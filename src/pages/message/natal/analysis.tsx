import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';

import CardItem from '../../../components/card-item';
import Loading from '../../../components/loading';
import Icon from '../../../components/star-icon';
import { Detail, HoroscopeStar } from '../../../libs/type';

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

  .house {
    font-family: 'Exo 2';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    text-transform: capitalize;
    color: #ffffff;
    margin-bottom: 8px;
  }

  .star {
    font-family: 'Exo 2';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 22px;
    text-transform: uppercase;
    color: #d4c9ff;
    margin-left: 8px;
  }

  .sign {
    font-family: 'Exo 2';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
    text-transform: capitalize;
    color: #ffffff;
    margin-left: 8px;
  }
`;

function Item({
  arcDegreesFormatted30,
  house,
  item,
  index,
}: {
  house?: number;
  arcDegreesFormatted30?: string;
  item: Detail;
  index: number;
}) {
  const { t } = useLocaleContext();

  return (
    <Card id={item.star} mb="80px">
      {house && <Box className="house">{t(`houses.house${house}`)}</Box>}

      <Box display="flex" alignItems="center">
        <Box sx={{ width: 20, height: 20 }}>
          <Icon star={item.star} />
        </Box>

        <Box className="star">{t(`stars.${item.star?.toLocaleLowerCase()}`)}</Box>

        <Box className="sign">
          {t(`signs.${item.sign?.toLocaleLowerCase()}`)} {arcDegreesFormatted30 ? `${arcDegreesFormatted30}'` : ''}
        </Box>
      </Box>

      <CardItem content={item.content} image={item.image} index={index} />
    </Card>
  );
}

const getStarInfo = (stars: HoroscopeStar[], star: string) => {
  return stars.find((item) => item.star === star);
};

const splitDegree = (degree: string) => {
  return degree.split("'")[0];
};

function Analysis({ stars, details }: { stars: HoroscopeStar[]; details: Detail[] }) {
  if (!details.length) {
    return <Loading />;
  }

  return (
    <Container>
      {details.map((item, i) => {
        const star = getStarInfo(stars, item.star);

        return (
          <Item
            arcDegreesFormatted30={splitDegree(star?.arcDegreesFormatted30 || '')}
            house={star?.house}
            key={item.star}
            item={item}
            index={i}
          />
        );
      })}
    </Container>
  );
}

export default Analysis;
