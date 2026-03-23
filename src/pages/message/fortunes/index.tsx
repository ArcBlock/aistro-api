import styled from '@emotion/styled';
import Box from '@mui/material/Box';

import Action from '../../../components/action';
import Footer from '../../../components/footer';
import Subscribe from '../../../components/subscribe';
import { DataProps, FortuneDetail } from '../../../libs/type';
import { isInAistroClient } from '../../../libs/utils';
import Analysis from './analysis';
import Banner from './banner';
import Persons from './persons';
import Table from './table';

const Container = styled(Box)`
  background: #161548;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const list = ['love', 'creativity', 'career', 'wealth'];

function Report({ data }: { data: DataProps }) {
  const sub = !data?.isVip && isInAistroClient();
  const details = (data?.sections || []) as unknown as FortuneDetail[];

  return (
    <Container>
      <Banner url={data?.img} />

      <Persons
        avatar={data?.user?.avatar}
        name={data?.user?.name}
        createdAt={data?.createdAt}
        luckyNumber={(data?.parameters as { luckyNumber?: number })?.luckyNumber}
      />

      <Table list={list} details={details} />

      <Analysis details={details} />

      {sub && <Subscribe mb={8} />}

      <Footer mt={8} />

      <Action onLoggedIn={() => {}} />
    </Container>
  );
}

export default Report;
