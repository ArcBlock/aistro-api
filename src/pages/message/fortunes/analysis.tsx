import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';

import CardItem from '../../../components/card-item';
import Loading from '../../../components/loading';
import Score from '../../../components/score';
import { FortuneDetail } from '../../../libs/type';

const Container = styled(Box)`
  margin: 24px 20px 0;
  overflow: hidden;
`;

const Card = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #0c0b33;
  border-radius: 12px;
  padding: 16px 20px 20px;

  .star {
    font-family: 'Exo 2';
    font-style: normal;
    font-weight: 700;
    font-size: 17px;
    line-height: 20px;
    text-transform: uppercase;
    color: #ffffff;
  }
`;

function Item({ item, index }: { item: FortuneDetail; index: number }) {
  const { t } = useLocaleContext();

  return (
    <Card id={item.dimension} mb="80px">
      <Box display="flex" alignItems="center">
        <Box className="star" mr={2}>
          {t(`fortunes.${item.dimension?.toLocaleLowerCase()}`)}
        </Box>

        <Score type={item.dimension} score={item.score || 0} />
      </Box>

      <CardItem content={item.content} image={item.image} index={index} />
    </Card>
  );
}

function Analysis({ details }: { details: FortuneDetail[] }) {
  if (!details.length) {
    return <Loading />;
  }

  return (
    <Container>
      {details.map((item, i) => {
        return <Item key={item.dimension} item={item} index={i} />;
      })}
    </Container>
  );
}

export default Analysis;
