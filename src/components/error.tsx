import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';

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
`;

const Content = styled(Box)`
  flex: 1;
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
`;

function Error({ message }: { message?: string }) {
  const { t } = useLocaleContext();

  return (
    <Container>
      <Content>{message || t('common.error')}</Content>

      <Footer />
    </Container>
  );
}

export default Error;
