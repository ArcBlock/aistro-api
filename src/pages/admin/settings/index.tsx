import Toast from '@arcblock/ux/lib/Toast';
import { Editor, useMonaco } from '@monaco-editor/react';
import { LoadingButton } from '@mui/lab';
import { Box, Stack, Tab, Tabs } from '@mui/material';
import { useAsyncEffect, useLocalStorageState } from 'ahooks';
import { useEffect, useState } from 'react';

import { getErrorMessage } from '../../../libs/api';
import { generateBlog, getSettings, setSettings } from '../../../libs/settings';

export default function SettingsPage() {
  const [currentTab = 'agents', setCurrentTab] = useLocalStorageState<string>('aistro.admin.settings.currentTab');
  const [setting, setSetting] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [blogLoading, setBlogLoading] = useState(false);

  useAsyncEffect(async () => {
    setSetting(
      Object.fromEntries(
        Object.entries(await getSettings()).map(([key, value]) => [key, JSON.stringify(value, null, 2)]),
      ),
    );
  }, []);

  const handleGenerateBlog = async () => {
    setBlogLoading(true);
    try {
      await generateBlog();
      Toast.success('文章生成已触发，请稍后查看');
    } catch (error) {
      Toast.error(getErrorMessage(error));
    } finally {
      setBlogLoading(false);
    }
  };

  const save = async () => {
    setLoading(true);
    try {
      await setSettings(
        Object.fromEntries(Object.entries(setting).map(([key, value]) => [key, value ? JSON.parse(value) : undefined])),
      );
      Toast.success('保存成功');
    } catch (error) {
      Toast.error(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const monaco = useMonaco();
  const themeName = 'customTheme-setting-json';

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme(themeName, {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#F2F2F2',
        },
      });
      monaco.editor.setTheme(themeName);
    }
  }, [monaco, themeName]);

  return (
    <Box sx={{ bgcolor: '#fff', p: 3 }}>
      <Stack direction="row" justifyContent="space-between">
        <Tabs value={currentTab} onChange={(_, tab) => setCurrentTab(tab)}>
          <Tab value="agents" label="Agents" />
          <Tab value="predictReportTemplate" label="运势报告" />
          <Tab value="natalReportTemplate" label="本命盘报告" />
          <Tab value="synastryReportTemplate" label="合盘报告" />
          <Tab value="phaseReportTemplate" label="月相报告" />
          <Tab value="reportIcons" label="图标" />
          <Tab value="sessionChatGreetings" label="会话问候语" />
        </Tabs>

        <Stack direction="row" spacing={1}>
          <LoadingButton loading={blogLoading} onClick={handleGenerateBlog} variant="outlined">
            生成文章
          </LoadingButton>
          <LoadingButton loading={loading} onClick={save}>
            保存
          </LoadingButton>
        </Stack>
      </Stack>

      <Box
        sx={{ height: '80vh', mt: 1 }}
        component={Editor}
        theme={themeName}
        options={{
          lineNumbersMinChars: 2,
          scrollBeyondLastLine: false,
          padding: { bottom: 100 },
          minimap: { enabled: false },
          tabSize: 2,
          insertSpaces: true,
          fixedOverflowWidgets: true,
          contextmenu: false,
        }}
        language="json"
        value={setting[currentTab] || ''}
        onChange={(value) => setSetting((v) => ({ ...v, [currentTab]: value || '' }))}
      />
    </Box>
  );
}
