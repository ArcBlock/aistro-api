import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import { joinURL } from 'ufo';

import Logo from '../icons/logo.svg?react';
import Image from './image-gradient';

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  background-color: rgb(22, 21, 72);

  .logo {
    width: 121px;
    margin: 0 auto;
    margin-bottom: 8px;
  }

  .desc {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    color: #a69ccd;
    text-align: center;
  }
`;

type Props = {
  [key: string]: any;
};

function Footer({ ...rest }: Props) {
  return (
    <Container {...rest}>
      <SvgIcon component={Logo} viewBox="0 0 125 28" className="logo" />
      <Box className="desc">{'Your Personal AI Astrologist'.toLocaleUpperCase()}</Box>
      <Image src={joinURL(window?.blocklet?.prefix ?? '/', '/images/footer.png')} alt="banner" />
    </Container>
  );
}

export default Footer;
