import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';

import Image from '../../../components/image-gradient';
import Logo from '../../../icons/logo.svg?react';
import { isInAistroClient } from '../../../libs/utils';

const Header = styled(Box)`
  display: flex;
  position: relative;
  overflow: hidden;

  .logo {
    width: 71px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 6%;
    z-index: 1;
  }
`;

function Banner({ url }: { url?: string }) {
  return (
    <Header>
      {!isInAistroClient() && <SvgIcon component={Logo} viewBox="0 0 125 28" className="logo" />}

      <Image src={url} alt="banner" />
    </Header>
  );
}

export default Banner;
