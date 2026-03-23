import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import dsbridge from 'dsbridge';

import Selected from '../icons/selected.svg?react';
import SubLogo from '../icons/sub-logo.svg?react';

const Container = styled(Box)`
  margin: 90px 20px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px 20px;
  background: #9e5bf3;
  border-radius: 12px;

  .title {
    font-family: 'Exo 2';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
    text-transform: capitalize;
    color: #ffffff;
  }

  .image {
    width: 120px;
    height: 0px;
    align-self: flex-end;
  }

  .item {
    font-family: 'Exo 2';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    text-transform: capitalize;
    color: #ffffff;
    text-align: left;
  }
`;

const ButtonInfo = styled(Button)`
  border-radius: 30px;
  font-family: 'Exo 2';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  text-transform: capitalize;
  margin-top: 16px;
  padding: 12px;
  width: 100%;
  background: #ffffff;
  color: #161548;

  &:hover {
    background: #ffffff;
  }
`;

function Subscribe({ ...rest }) {
  const { t } = useLocaleContext();

  return (
    <Box {...rest}>
      <Container>
        <Box display="flex" position="relative" width={1} justifyContent="space-between">
          <Box className="title">{t('my.fullReport')}</Box>
          <Box className="image">
            <SvgIcon
              component={SubLogo}
              viewBox="0 0 120 120"
              style={{ width: 120, height: 120, position: 'absolute', bottom: 0, right: 0 }}
            />
          </Box>
        </Box>

        <Box>
          <Box component="li" display="flex" alignItems="center" className="item" mt={2}>
            <SvgIcon component={Selected} viewBox="0 0 16 17" style={{ width: 16, height: 16, marginRight: 8 }} />
            <Box>{t('my.reason1')}</Box>
          </Box>

          <Box component="li" display="flex" alignItems="center" className="item" mt={2}>
            <SvgIcon component={Selected} viewBox="0 0 16 17" style={{ width: 16, height: 16, marginRight: 8 }} />
            <Box>{t('my.reason2')}</Box>
          </Box>
        </Box>

        <ButtonInfo
          onClick={() => {
            dsbridge.call('openSubPage');
          }}>
          {t('my.subscribe')}
        </ButtonInfo>
      </Container>
    </Box>
  );
}

export default Subscribe;
