import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import styled from '@emotion/styled';
import { Box, Container } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { useAsync } from 'react-use';

import { AndroidButton, AppleButton } from '../../components/action';
import Layout from '../../components/page-layout';
import { generatePublicInvites } from '../../libs/invites';
import Item from './item';

const Gradient = styled(Box)`
  z-index: 1;
  width: 1200px;
  height: 1200px;
  opacity: 0.45;
  filter: blur(200px);
  background-image: linear-gradient(270deg, #08f, #90f);
  border-radius: 2000px;
  position: absolute;
  top: -800px;
  bottom: auto;
  left: auto;
  right: auto;
  opacity: 0.58;
`;

const Card = styled(Layout)`
  .main-inner {
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .title {
    font-style: normal;
    font-weight: 600;
    text-align: center;
    text-transform: capitalize;
    color: #ffffff;
    z-index: 1;
    color: #fff;
    position: static;
    margin-bottom: 0;

    .text-span {
      -webkit-text-fill-color: transparent;
      background-image: radial-gradient(circle at 0 0, #c849fe, #1d95fe 65%);
      -webkit-background-clip: text;
      background-clip: text;
    }
  }

  .desc {
    font-style: normal;
    font-weight: 700;
    text-transform: capitalize;
    z-index: 1;
    color: #fff;
    font-family:
      Sohne leicht,
      Arial,
      sans-serif;
    line-height: 24px;
    letter-spacing: 0;
    position: static;
    max-width: 1000px;
    padding: 0 20px;
  }

  .card {
    display: flex;
    flex-wrap: wrap;
    background: #0c0b33;
    border-radius: 12px;
    padding: 20px;
    z-index: 1;
  }

  .mt80 {
    margin-top: 80px;
  }
`;

const BorderContainer = styled(Box)`
  opacity: 1;
  transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
  transform-style: preserve-3d;
  will-change: opacity;

  .border {
    background-color: #0c0b33;
    border: 1px solid #0c0b33;
    border-radius: 16px;
    flex-direction: row;
    flex: 1;
    margin-bottom: 16px;
    padding: 4px 4px 0;
  }

  .gradient {
    background-image: linear-gradient(rgb(158, 91, 243), #0c0b33 38%);
    border-radius: 12px;
    padding-top: 2px;
    padding-left: 2px;
    padding-right: 2px;
  }
`;

function CardBox({ children }: { children: React.ReactNode }) {
  return (
    <BorderContainer sx={{ margin: { xs: '40px 20px', sm: '80px 20px;' } }}>
      <Box className="border">
        <Box className="gradient">{children}</Box>
      </Box>
    </BorderContainer>
  );
}

function InviteCodeList() {
  const { t } = useLocaleContext();
  const [selected, setSelected] = useState('');
  const result = useAsync(() => generatePublicInvites(), [generatePublicInvites]);

  const render = () => {
    if (result.loading) {
      return (
        <Container className="card center mt80">
          <CircularProgress />
        </Container>
      );
    }

    if (result.error) {
      return (
        <Container className="card mt80">
          <Box className="desc" width={1}>
            {result.error?.message || t('invites.error')}
          </Box>
        </Container>
      );
    }

    const list = result.value?.list ?? [];
    if (list.length === 0) {
      return (
        <Container className="card mt80">
          <Box className="desc" width={1}>
            {t('invites.empty')}
          </Box>
        </Container>
      );
    }

    return (
      <CardBox>
        <Container className="card">
          <Grid container spacing={2.5}>
            {list.map((invite) => {
              return (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={invite.code}>
                  <Item
                    code={invite.code}
                    disabled={invite.used}
                    selected={invite.code === selected}
                    setSelected={setSelected}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </CardBox>
    );
  };

  return (
    <Card>
      <Gradient />

      <Box
        className="title"
        component="h1"
        dangerouslySetInnerHTML={{
          __html: t('invites.title'),
        }}
        sx={{
          marginTop: { xs: '60px', sm: '120px' },
          fontSize: { xs: 28, sm: 48 },
          lineHeight: { xs: '30px', sm: '60px' },
        }}
      />

      <Box
        className="desc"
        mt={2.5}
        sx={{
          fontSize: { xs: 16, sm: 18 },
          textAlign: { xs: 'justify', sm: 'center' },
        }}>
        {t('invites.subTitle')}
      </Box>

      <Grid container spacing={2.5} sx={{ maxWidth: 420, mt: 5, zIndex: 1, px: 2.5 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppleButton />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <AndroidButton />
        </Grid>
      </Grid>

      {render()}
    </Card>
  );
}

export default InviteCodeList;
