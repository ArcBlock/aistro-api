import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';

import Zero from '../icons/0.svg?react';
import One from '../icons/1.svg?react';
import Two from '../icons/2.svg?react';
import Three from '../icons/3.svg?react';
import Four from '../icons/4.svg?react';
import Five from '../icons/5.svg?react';
import Six from '../icons/6.svg?react';
import Seven from '../icons/7.svg?react';
import Eight from '../icons/8.svg?react';
import Nine from '../icons/9.svg?react';

const Container = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;

  .number {
    height: 88px;
    width: 63px;
  }
`;

function LuckyNumber({ number }: { number: number }) {
  if (number < 0 && number > 100) {
    return null;
  }

  const mapSvg: {
    [key: number]: any;
  } = {
    0: Zero,
    1: One,
    2: Two,
    3: Three,
    4: Four,
    5: Five,
    6: Six,
    7: Seven,
    8: Eight,
    9: Nine,
  };

  const arr = String(number)
    .split('')
    .map((item: string) => Number(item));

  return (
    <Container>
      {arr.map((item: number, i: number) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Box className="number" key={i}>
            <SvgIcon component={mapSvg[item]} viewBox="0 0 63 88" style={{ width: '100%', height: '100%' }} />
          </Box>
        );
      })}
    </Container>
  );
}

export default LuckyNumber;
