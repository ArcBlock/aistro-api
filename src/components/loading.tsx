import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';

const Container = styled(Box)`
  padding: 16px 20px;
  margin: 24px;
  background: #0c0b33;
  border-radius: 12px;
  font-family: 'Exo 2';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #ffffff;
  text-align: left;
`;

export default function Loading() {
  const { t } = useLocaleContext();

  return <Container>{`${t('common.reportGenerate')}`}</Container>;
}
