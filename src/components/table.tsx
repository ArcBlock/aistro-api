import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import dsbridge from 'dsbridge';
import { useMemo } from 'react';

// import { ReactComponent as Lock } from '../icons/lock.svg';
import ArrowRight from '../icons/right.svg?react';
import { NewHoroscopeStar } from '../libs/type';
import { sortStars } from '../libs/utils';
import Icon from './star-icon';

const TableContainer = styled(Box)`
  background: #292857;
  border-radius: 12px;
  margin: 24px 20px 0;
`;

const TableHead = styled(Box)`
  font-family: 'Exo 2';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 1px;
  text-transform: capitalize;
  color: #ffffff;
  text-align: left;
`;

const TableBody = styled(Box)`
  .body-row:last-child {
    border: 0;
  }

  .sign {
    font-family: 'Exo 2';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    text-transform: capitalize;
    color: #ffffff;
    text-align: left;
  }

  .star {
    font-family: 'Exo 2';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    text-transform: uppercase;
    color: #d4c9ff;
  }
`;

const TableRow = styled(Box)`
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  margin: 0 16px;

  &.body-row {
    cursor: pointer;
  }
`;

const TableCell = styled(Box)``;

// const isNeedSubscribe = (details: Detail[], star: NewHoroscopeStar) => {
//   const found = details.find((item) => item.star?.toLocaleLowerCase() === star.star?.toLocaleLowerCase());
//   return !found;
// };

function Table({ signTitle, stars }: { signTitle: string; stars: NewHoroscopeStar[] }) {
  const { t } = useLocaleContext();

  const sortedStars = useMemo(() => {
    return sortStars(stars);
  }, [stars]);

  const onScrollItem = (isLock: boolean, star: string) => {
    if (isLock) {
      dsbridge.call('openSubPage');
      return;
    }

    document.querySelector(`#${star}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <TableContainer>
      <TableHead>
        <TableRow>
          <TableCell flex={1}>{t('common.planet')}</TableCell>
          <TableCell flex={1}>{signTitle}</TableCell>
          <TableCell width={24} className="action center" />
        </TableRow>
      </TableHead>

      <TableBody>
        {sortedStars.map((item: NewHoroscopeStar) => {
          return (
            <TableRow
              key={item.star}
              className="body-row"
              onClick={() => {
                onScrollItem(false, item.star);
              }}>
              <TableCell flex={1} display="flex" alignItems="center">
                <Box sx={{ width: 20, height: 20, marginRight: 1 }}>
                  <Icon star={item.star} />
                </Box>

                <Box className="star">{t(`stars.${item.star?.toLocaleLowerCase()}`)}</Box>
              </TableCell>

              <TableCell flex={1} className="sign">
                {item.i18nSign}
              </TableCell>

              <Box width={24} className="action center">
                {/* {isNeedSubscribe(details, item) ? (
                  <SvgIcon component={Lock} viewBox="0 0 14 15" style={{ width: 16, height: 16 }} />
                ) : ( */}
                <SvgIcon component={ArrowRight} viewBox="0 0 14 15" style={{ width: 16, height: 16 }} />
                {/* )} */}
              </Box>
            </TableRow>
          );
        })}
      </TableBody>
    </TableContainer>
  );
}

export default Table;
