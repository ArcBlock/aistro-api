import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Stack } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import QuoteDownIcon from '../icons/quote-down.svg?react';
import QuoteUpIcon from '../icons/quote-up.svg?react';

function Quota({ title }: { title: string }) {
  const [time, setTime] = useState(0);
  let dots = '.';
  for (let i = 0; i < time % 5; i++) {
    dots += '.';
  }
  const { t } = useLocaleContext();
  const trueTitle = title && title !== '' ? title : t('report.loading', { dots });

  useEffect(() => {
    if (!title || title === '') {
      const tick = setInterval(() => {
        setTime(time + 1);
      }, 500);
      return () => clearInterval(tick);
    }
    return () => {};
  }, [time, title]);
  return (
    <Div>
      <Stack spacing={1} direction="row">
        <SvgIcon
          className="quote-up"
          component={QuoteUpIcon}
          viewBox="0 0 40 40"
          style={{ width: 60, height: 60, color: '#fff' }}
        />
        <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff' }} className="word-title-content">
          {trueTitle}
        </span>
        <Stack direction="row" alignItems="flex-end" marginBottom={10}>
          <SvgIcon
            className="quote-down"
            component={QuoteDownIcon}
            viewBox="0 0 40 40"
            style={{ width: 60, height: 60, color: '#fff' }}
          />
        </Stack>
      </Stack>
    </Div>
  );
}

const Div = styled('div')`
  font-family: 'Exo', '宋体', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
  overflow: hidden;
  padding-top: 40px;
  @media (max-width: ${(props: any) => props.theme.breakpoints.values.sm}px) {
    padding: 40px 20px 0 20px;
  }
  .title {
    width: 100%;
    font-size: 32px;
    color: #f7f7fd;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    @media (max-width: ${(props) => props.theme.breakpoints.values.sm}px) {
      width: inherit;
      max-width: inherit;
      min-width: inherit;
      font-size: 24px;
    }
  }

  .word-title {
    text-align: start;
    word-break: normal;
    font-weight: 800;
    margin-top: 28px;
    font-size: 1rem;
    color: #f7f7fd;
    position: relative;
    .word-title-content {
      display: inline-block;
      width: 100%;
      text-align: center;
      margin-top: 30px;
      padding-left: 50px;
      padding-right: 50px;
      .text {
        font-size: 2rem;
      }


    }
    @media (min-width: 600px) {
      .word-title {
        font-size: 1.5rem;
      }
    }
    .quote-up {
      position: absolute;
      left: 0;
      top: 0;
      #SVGRepo_iconCarrier {
        scale: 1.5;
      }
    }
    .quote-down {
      position: absolute;
      right: 0;
      bottom: -30px;
      #SVGRepo_iconCarrier {
        scale: 1.5;
      }
    }
  }
  .word-content {
    text-align: start;
    word-break: normal;
    font-size: 24px;
    margin-top: 72px;
    font-weight: 500;
    line-height: 36px;
    white-space: pre-wrap;
    letter-spacing: 0.05em;
  }
  }
`;
export default Quota;
