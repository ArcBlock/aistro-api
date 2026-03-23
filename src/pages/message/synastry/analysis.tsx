import styled from '@emotion/styled';
import Box from '@mui/material/Box';

import CardItem from '../../../components/card-item';
import Loading from '../../../components/loading';
import { Detail } from '../../../libs/type';

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

  .signs {
    font-family: 'Exo 2';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
    text-transform: capitalize;
    color: #ffffff;
    text-align: left;
    display: flex;
    align-items: center;

    .from {
      text-align: left;
    }
  }
`;

function Item({ item, index }: { item: Detail; index: number }) {
  return (
    <Card id={item.topic} mb="80px">
      <Box display="flex" alignItems="center">
        <Box sx={{ width: 20, height: 20 }}>
          <img src={item.icon} alt={item.iconTitle} />
        </Box>

        <Box className="star">{item.iconTitle}</Box>

        <Box className="star">{item.title}</Box>
      </Box>

      <CardItem content={item.content} image={item.image} index={index} />
    </Card>
  );
}

// const getStarInfo = (stars: NewHoroscopeStar[], star: string) => {
//   return stars.find((item) => item.star === star);
// };

function Analysis({ details }: { details: Detail[] }) {
  if (!details.length) {
    return <Loading />;
  }

  return (
    <Container>
      {details.map((item, i) => {
        return <Item key={item.star} item={item} index={i} />;
      })}
    </Container>
  );
}

export default Analysis;
