import styled from '@emotion/styled';
import Box from '@mui/material/Box';

import { HoroscopeChartData } from '../../../../api/src/store/models/user';
import AstroChart from '../../../components/astrochart';
import useWidth from '../../../hooks/use-width';

const Container = styled(Box)`
  padding: 40px 32px 0;
  overflow: hidden;
`;

type Props = {
  user?: HoroscopeChartData;
  matchUser?: HoroscopeChartData;
};

function Chart({ user, matchUser }: Props) {
  const width = useWidth();
  // eslint-disable-next-line no-console
  // console.log(user, matchUser);
  return (
    <Container>
      <AstroChart width={width - 24} user={user} match={matchUser} />
    </Container>
  );
}

export default Chart;
