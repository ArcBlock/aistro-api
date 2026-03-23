import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';

import { HoroscopeChartData } from '../../../../api/src/store/models/user';
import AstroChart from '../../../components/astrochart';
import useWidth from '../../../hooks/use-width';

const Container = styled(Box)`
  overflow: hidden;

  .name {
    font-family: 'Exo 2';
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 29px;
    color: #ffffff;
    margin: 40px 0;
  }

  .chat {
    margin: -32px 0;
  }
`;

function Chart({ chartData }: { chartData: HoroscopeChartData }) {
  const width = useWidth();
  const { t } = useLocaleContext();

  return (
    <Container>
      <Box className="name">{t('my.analysis')}</Box>

      <Box className="chat">
        <AstroChart width={width - 24} user={chartData} />
      </Box>
    </Container>
  );
}

export default Chart;
