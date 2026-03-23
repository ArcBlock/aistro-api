import useBrowser from '@arcblock/react-hooks/lib/useBrowser';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import styled from '@emotion/styled';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { AndroidButton, AppleButton } from '../../components/action';
import { useSessionContext } from '../../contexts/session';
import { isInAistroClient } from '../../libs/utils';

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

function OpenAistroButton() {
  const { t } = useLocaleContext();
  return (
    <ButtonInfo href="aistro://aistro.io">
      <Box className="text">{t('common.openInApp')}</Box>
    </ButtonInfo>
  );
}

function LoginViewMoreButton({ onLoggedIn }: { onLoggedIn: () => void }) {
  const { t } = useLocaleContext();
  const { session } = useSessionContext();
  const browser = useBrowser();

  return (
    <div>
      {session.user ? (
        browser.mobile.any && <OpenAistroButton />
      ) : (
        <ButtonInfo
          onClick={() =>
            session.login(() => {
              onLoggedIn();
            })
          }>
          <Box className="text">{t('common.loginViewMore')}</Box>
        </ButtonInfo>
      )}
    </div>
  );
}

function ActionForReportDetail({ onLoggedIn }: { onLoggedIn: () => void }) {
  const browser = useBrowser();

  if (isInAistroClient()) {
    return null;
  }

  if (browser.mobile.any && browser.mobile.apple.device) {
    return (
      <Container>
        <Stack spacing={1} direction="column">
          <LoginViewMoreButton onLoggedIn={onLoggedIn} />
          <AppleButton />
        </Stack>
      </Container>
    );
  }

  if (browser.mobile.any && browser.mobile.android.device) {
    return (
      <Container>
        <Stack spacing={1} direction="column">
          <LoginViewMoreButton onLoggedIn={onLoggedIn} />
          <AndroidButton />
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
          <LoginViewMoreButton onLoggedIn={onLoggedIn} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default ActionForReportDetail;
