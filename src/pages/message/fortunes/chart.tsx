import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';

import { HoroscopeChartData } from '../../../../api/src/store/models/user';
import AstroChart from '../../../components/astrochart';
import useWidth from '../../../hooks/use-width';

const Container = styled(Box)`
  overflow: hidden;

  .analysis {
    margin: -32px 0;
  }
`;

type Props = {
  user?: HoroscopeChartData;
  match?: HoroscopeChartData;
};

function Chart({ user, match }: Props) {
  const { t } = useLocaleContext();
  const width = useWidth();

  return (
    <Container>
      <Box className="title">{t('report.fortune')}</Box>

      <Box className="analysis">
        <AstroChart width={width - 24} user={user} match={match} />
      </Box>
    </Container>
  );
}

export default Chart;
