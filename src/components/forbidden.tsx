import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { joinURL } from 'ufo';

import { useSessionContext } from '../contexts/session';
import Footer from './footer';

const Container = styled(Box)`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #161548;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  .forbidden-icon {
    margin: 200px auto 0 auto;
    width: 50px;
    height: 50px;
  }
  .btn-item {
    border-color: #fff;
    width: fit-content;
    margin: 20px auto 100px auto;
    color: #fff;
    text-transform: none;
    &:hover {
      border-color: #fff;
    }
  }
`;

const Content = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Lexend';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #ffffff;
  margin-top: 24px;
  margin: 24px 20px 0 20px;
`;

function Forbidden() {
  const { t } = useLocaleContext();
  const { session } = useSessionContext();
  return (
    <Container>
      <img className="forbidden-icon" src={joinURL(window?.blocklet?.prefix ?? '/', '/images/locked.png')} alt="" />
      <Content>{session.user ? t('forbidden.noPermission') : t('forbidden.needLogin')}</Content>
      <Button
        variant="outlined"
        className="btn-item"
        size="small"
        onClick={() => {
          if (session.user) {
            window.location.href = window.location.origin;
          } else {
            session.login();
          }
        }}>
        {session.user ? t('inviteFriend.outOfDate.btn') : t('forbidden.login')}
      </Button>
      <Footer />
    </Container>
  );
}

export default Forbidden;
