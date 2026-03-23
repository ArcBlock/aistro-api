import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';

import Career from '../icons/career.svg?react';
import Creativity from '../icons/creativity.svg?react';
import Love from '../icons/love.svg?react';
import Wealth from '../icons/wealth.svg?react';
import { getStarOpacity } from '../libs/utils';

const Container = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
`;

function ScoreIcons({ type, score }: { type: string; score: number }) {
  const mapSvg: {
    [key: string]: any;
  } = {
    career: Career,
    love: Love,
    creativity: Creativity,
    wealth: Wealth,
  };

  const svg = mapSvg[type] || Love;
  const arr = getStarOpacity(score || 0);

  return (
    <Container>
      {arr.map((item: number, i: number) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Box display="flex" key={i} sx={{ opacity: item }}>
            <SvgIcon component={svg} viewBox="0 0 18 18" style={{ width: 18, height: 18, color: 'transparent' }} />
          </Box>
        );
      })}
    </Container>
  );
}

export default ScoreIcons;
