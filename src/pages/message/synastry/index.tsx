import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
// import { styled } from '@mui/material/styles';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import pick from 'lodash/pick';
import { useMemo } from 'react';

import ActionForSynastry from '../../../components/action-for-synastry';
import Footer from '../../../components/footer';
import Quota from '../../../components/quota';
import Subscribe from '../../../components/subscribe';
import Table from '../../../components/table';
import { DataProps, HoroscopeStar, NewHoroscopeStar } from '../../../libs/type';
import { isInAistroClient, sortStars } from '../../../libs/utils';
import Analysis from './analysis';
import Chart from './chart';
import Persons from './persons';

const Container = styled.div`
  background: #161548;
  text-align: center;
  margin: 0 auto;
  .message-inner {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
`;

function Relation({ data, onLoggedIn }: { data: DataProps; onLoggedIn: () => void }) {
  const { t } = useLocaleContext();
  const sub = !data?.isVip && isInAistroClient();

  const user = {
    name: data?.user?.name,
    avatar: data?.user?.avatar,
  };

  const matchUser = {
    name: (data?.friend as { name?: string })?.name,
    avatar: (data?.friend as { avatar?: string })?.avatar,
  };

  const stars = useMemo(() => {
    const myself: HoroscopeStar[] = data?.parameters?.user?.horoscope?.stars || [];
    const friend: HoroscopeStar[] = data?.parameters?.secondaryUser?.horoscope?.stars || [];

    const myselfObj = myself.reduce(
      (acc, x) => {
        acc[x.star] = {
          star: x.star,
          sign: x.sign,
          myself: x,
        };

        return acc;
      },
      {} as { [key: string]: NewHoroscopeStar },
    );

    const mergeObj = friend.reduce(
      (acc, x) => {
        if (acc[x.star]) {
          (acc[x.star] as NewHoroscopeStar).friend = x;
        } else {
          acc[x.star] = {
            star: x.star,
            sign: x.sign,
            friend: x,
          };
        }

        return acc;
      },
      myselfObj as { [key: string]: NewHoroscopeStar },
    );

    const pickStars = pick(mergeObj, ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn']);

    const list = Object.values(pickStars).map((item): NewHoroscopeStar => {
      return {
        ...item,
        i18nSign: `${t(`signs.${item?.myself?.sign?.toLocaleLowerCase()}`)} - ${t(
          `signs.${item?.friend?.sign?.toLocaleLowerCase()}`,
        )}`,
      };
    });

    return sortStars(list);
  }, [data?.parameters?.user?.horoscope?.stars, data?.parameters?.secondaryUser?.horoscope?.stars, t]);

  const details = useMemo(() => {
    return sortStars(data?.sections || []);
  }, [data?.sections]);

  return (
    <Container>
      <div className="message-inner">
        <Box
          component="h1"
          sx={{
            fontSize: 18,
            textAlign: 'center',
            padding: '20px 0',
            margin: '0',
            backgroundImage: 'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)',
            color: '#fff',
          }}>
          {t('inviteFriend.topTip')}
        </Box>
        <Persons user={user} matchUser={matchUser} score={data?.score || 81} />
        <Quota title={data?.title || ''} />
        <Chart
          user={data?.parameters?.user.horoscope?.chartData}
          matchUser={data?.parameters?.secondaryUser?.horoscope?.chartData}
        />

        <Table signTitle={t('relation.signTitle')} stars={stars} />

        <Analysis details={details} />

        {sub && <Subscribe mb={8} />}

        <Footer mt={8} />

        <ActionForSynastry
          inviteFriend={data.invitedFriend}
          onLoggedIn={() => {
            onLoggedIn();
          }}
        />
      </div>
    </Container>
  );
}

export default Relation;
