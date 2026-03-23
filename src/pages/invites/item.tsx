import styled from '@emotion/styled';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import { Box } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import Copy from 'copy-to-clipboard';
import { useMemo } from 'react';

import Selected from '../../icons/invite-code/selected.svg?react';

const Container = styled(Box)`
  font-family: 'Exo 2';
  font-style: normal;
  font-weight: 400;
  line-height: 17px;
  text-align: center;
  color: #ffffff;
  padding: 10px 17.5px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

function Item({
  code,
  disabled = false,
  selected = false,
  setSelected,
  ...rest
}: {
  code: string;
  disabled?: boolean;
  selected: boolean;
  setSelected: (code: string) => void;
}) {
  const Icon = useMemo(() => {
    if (disabled) {
      return <SvgIcon component={Selected} viewBox="0 0 20 20" style={{ width: 20, height: 20, color: '#FBFBFB' }} />;
    }

    if (selected) {
      return <DoneIcon sx={{ fontSize: 20 }} />;
    }

    return <ContentCopyIcon sx={{ fontSize: 20 }} />;
  }, [disabled, selected]);

  const style = useMemo(() => {
    if (disabled) {
      return {
        background: 'rgba(255, 255, 255, 0.12)',
        border: 0,
        opacity: 0.2,
        cursor: 'not-allowed',
      };
    }

    if (selected) {
      return {
        background: '#9E5BF3',
      };
    }

    return {};
  }, [disabled, selected]);

  const onSelected = () => {
    if (disabled) return;

    setSelected(code);
    Copy(code);
  };

  return (
    <Container style={style} onClick={onSelected} {...rest} sx={{ fontSize: { xs: 12, sm: 14 } }}>
      <>
        <Box mr={1.5}>{code}</Box>
        {Icon}
      </>
    </Container>
  );
}

export default Item;
