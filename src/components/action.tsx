import useBrowser from '@arcblock/react-hooks/lib/useBrowser';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import styled from '@emotion/styled';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import SvgIcon from '@mui/material/SvgIcon';

import { useSessionContext } from '../contexts/session';
import Android from '../icons/android.svg?react';
import Apple from '../icons/apple.svg?react';
import { isInAistroClient } from '../libs/utils';

const Container = styled(Box)`
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  max-width: 800px;
  margin: 0 auto;
  z-index: 1;
`;

const ButtonInfo = styled(Button)`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  width: 100%;
  height: 44px;
  background: #fff !important;
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #25292f;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export function AppleButton() {
  const { t } = useLocaleContext();
  return (
    <ButtonInfo href="https://apps.apple.com/app/aistro-ai-astrology/id6447492298">
      <SvgIcon component={Apple} viewBox="0 0 16 16" style={{ width: 16, height: 16, marginRight: 8 }} />
      <Box className="text">{t('common.iosDownload')}</Box>
    </ButtonInfo>
  );
}

export function OpenAistroButton() {
  const { t } = useLocaleContext();
  return (
    <ButtonInfo href="aistro://aistro.io/cb">
      <Box className="text">{t('common.openAistro')}</Box>
    </ButtonInfo>
  );
}

export function AndroidButton() {
  const { t } = useLocaleContext();
  return (
    <ButtonInfo href="https://play.google.com/store/apps/details?id=io.arcblock.aistro">
      <SvgIcon component={Android} viewBox="0 0 17 16" style={{ width: 16, height: 16, marginRight: 8 }} />
      <Box className="text">{t('common.androidDownload')}</Box>
    </ButtonInfo>
  );
}

function Action({ onLoggedIn }: { onLoggedIn: () => void }) {
  const { session } = useSessionContext();
  const { t } = useLocaleContext();
  const browser = useBrowser();

  if (isInAistroClient()) {
    return null;
  }

  if (browser.mobile.any && browser.mobile.apple.device) {
    return (
      <Container>
        <Stack spacing={1} direction="column">
          <AppleButton />
          <OpenAistroButton />
          {!session.user && (
            <ButtonInfo
              onClick={() =>
                session.login(() => {
                  onLoggedIn();
                })
              }>
              <Box className="text">{t('common.login')}</Box>
            </ButtonInfo>
          )}
        </Stack>
      </Container>
    );
  }

  if (browser.mobile.any && browser.mobile.android.device) {
    return (
      <Container>
        <Stack spacing={1} direction="column">
          <AndroidButton />
          <OpenAistroButton />
          {!session.user && (
            <ButtonInfo
              onClick={() =>
                session.login(() => {
                  onLoggedIn();
                })
              }>
              <Box className="text">{t('common.login')}</Box>
            </ButtonInfo>
          )}
        </Stack>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={2.5}>
        <Grid size={6}>
          <AppleButton />
        </Grid>
        <Grid size={6}>
          <AndroidButton />
        </Grid>
        <Grid size={12}>
          {!session.user && (
            <ButtonInfo
              onClick={() =>
                session.login(() => {
                  onLoggedIn();
                })
              }>
              <Box className="text">{t('common.login')}</Box>
            </ButtonInfo>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Action;
