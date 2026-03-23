import Toast from '@arcblock/ux/lib/Toast';
import Dashboard from '@blocklet/ui-react/lib/Dashboard';
import { Editor, useMonaco } from '@monaco-editor/react';
import { LoadingButton } from '@mui/lab';
import { Box, Stack, Tab, Tabs, styled } from '@mui/material';
import { useAsyncEffect, useLocalStorageState } from 'ahooks';
import React, { useEffect, useState } from 'react';

import { getErrorMessage } from '../../../libs/api';
import { getSettings, setSettings } from '../../../libs/settings';

export default function SettingsPage() {
  const [currentTab = 'agents', setCurrentTab] = useLocalStorageState<string>('aistro.admin.settings.currentTab');
  const [setting, setSetting] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useAsyncEffect(async () => {
    setSetting(
      Object.fromEntries(
        Object.entries(await getSettings()).map(([key, value]) => [key, JSON.stringify(value, null, 2)]),
      ),
    );
  }, []);

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
    <Root
      // FIXME: remove following undefined props after issue https://github.com/ArcBlock/ux/issues/1136 solved
      meta={undefined}
      fallbackUrl={undefined}
      invalidPathFallback={undefined}
      headerAddons={undefined}
      sessionManagerProps={undefined}
      links={undefined}
      showDomainWarningDialog={undefined}>
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

        <LoadingButton loading={loading} onClick={save}>
          保存
        </LoadingButton>
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
    </Root>
  );
}

const Root = styled(Dashboard as React.FC<any>)`
  background-color: #fff;
  .header {
    margin-top: 20px;
    .MuiListItem-root {
      border-left: 2px solid rgba(0, 0, 0, 0.87);
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      .MuiListItemText-secondary {
        font-weight: bold;
        font-size: 28px;
        color: #333;
      }
    }
  }
`;
