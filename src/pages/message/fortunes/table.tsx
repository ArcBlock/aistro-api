import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import dsbridge from 'dsbridge';

import Lock from '../../../icons/lock.svg?react';
import ArrowRight from '../../../icons/right.svg?react';
import { FortuneDetail } from '../../../libs/type';

const TableContainer = styled(Box)`
  background: #292857;
  border-radius: 12px;
  margin: 40px 20px 0;
`;

const TableBody = styled(Box)`
  overflow: hidden;
  padding: 8px 0;

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
    font-weight: 700;
    font-size: 17px;
    line-height: 20px;
    text-transform: uppercase;
    color: #ffffff;
  }
`;

const TableRow = styled(Box)`
  display: flex;
  align-items: center;
  padding: 12px 16px;

  &.body-row {
    cursor: pointer;
  }
`;

const TableCell = styled(Box)``;

function Table({ list, details }: { list: string[]; details: FortuneDetail[] }) {
  const { t } = useLocaleContext();

  const onScrollItem = (isLock: boolean, star: string) => {
    if (isLock) {
      dsbridge.call('openSubPage');
      return;
    }

    document.querySelector(`#${star}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  const isNeedSubscribe = (details: FortuneDetail[], dimension: string) => {
    const found = details.find((item) => item.dimension === dimension);
    return !found;
  };

  return (
    <TableContainer>
      <TableBody>
        {list.map((item: string) => {
          return (
            <TableRow
              key={item}
              className="body-row"
              onClick={() => {
                onScrollItem(isNeedSubscribe(details, item), item);
              }}>
              <TableCell flex={1} display="flex" alignItems="center">
                <Box className="star">{t(`fortunes.${item.toLocaleLowerCase()}`)}</Box>
              </TableCell>

              <Box width={24} className="action center">
                {isNeedSubscribe(details, item) ? (
                  <SvgIcon component={Lock} viewBox="0 0 14 15" style={{ width: 16, height: 16 }} />
                ) : (
                  <SvgIcon component={ArrowRight} viewBox="0 0 14 15" style={{ width: 16, height: 16 }} />
                )}
              </Box>
            </TableRow>
          );
        })}
      </TableBody>
    </TableContainer>
  );
}

export default Table;
