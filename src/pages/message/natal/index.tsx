import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import { useMemo } from 'react';

import Action from '../../../components/action';
import Footer from '../../../components/footer';
import Subscribe from '../../../components/subscribe';
import Table from '../../../components/table';
import { DataProps, NewHoroscopeStar } from '../../../libs/type';
import { isInAistroClient, sortStars } from '../../../libs/utils';
import Analysis from './analysis';
import Banner from './banner';
import Chart from './chart';
import Persons from './persons';

const Container = styled(Box)`
  background: #161548;
  display: flex;
  flex-direction: column;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;

  .analysis {
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
  }
`;

function My({ data }: { data: DataProps }) {
  const sub = !data?.isVip && isInAistroClient();
  const { t } = useLocaleContext();

  if (!data?.sections) {
    throw new Error('The data is invalid. Please regenerate it');
  }

  const star = useMemo(() => {
    const stars = data?.parameters?.horoscope?.stars || [];
    return stars.map((x: NewHoroscopeStar) => {
      return {
        ...x,
        i18nSign: t(`signs.${x.sign?.toLocaleLowerCase()}`),
      };
    }, []);
  }, [data?.parameters?.horoscope?.stars, t]);

  const details = useMemo(() => {
    return sortStars(data?.sections || []);
  }, [data?.sections]);

  const user = useMemo(() => {
    if (data.type === 19) {
      return {
        name: data?.parameters?.name,
        avatar: data?.parameters?.avatar,
      };
    }

    return {
      name: data?.user?.name,
      avatar: data?.user?.avatar,
    };
  }, [data]);

  return (
    <Container>
      <Banner url={data?.img} />

      <Persons avatar={user?.avatar} name={user?.name} />

      <Chart chartData={data?.parameters?.horoscope?.chartData} />

      <Table signTitle={t('common.sign')} stars={star} />

      <Analysis stars={star} details={details} />

      {sub && <Subscribe mb={8} />}

      <Footer mt={8} />

      <Action onLoggedIn={() => {}} />
    </Container>
  );
}

export default My;
