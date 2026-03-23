import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import { useMemo } from 'react';
import { Image } from 'react-render-image';

import Square from './square';

type Props = {
  src?: string;
  children?: any;
  [key: string]: any;
};

const Gradient = styled(Box)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgb(22, 21, 72);
  display: flex;
  justify-content: center;
  align-items: center;
`;

function LazyImage({ src, children, ...rest }: Props) {
  return useMemo(() => {
    if (src) {
      return (
        <Image
          src={src}
          loading={<Gradient />}
          loaded={
            <>
              <img src={src} alt="alt" {...rest} />
              {children}
            </>
          }
          errored={<Square />}
        />
      );
    }

    return <Square />;
  }, [src, rest, children]);
}

export default LazyImage;
