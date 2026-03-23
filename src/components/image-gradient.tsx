import styled from '@emotion/styled';

import Gradient from './gradient';
import Image from './image';
import Square from './square';

type Props = {
  src?: string;
  children?: any;
  [key: string]: any;
};

const Container = styled(Square)`
  position: relative;
  background: rgb(22, 21, 72);

  img {
    display: flex;
  }
`;

function LazyImageGradient({ src, children, ...rest }: Props) {
  return (
    <Container>
      <Image src={src} {...rest}>
        {children}
      </Image>
      <Gradient />
    </Container>
  );
}

export default LazyImageGradient;
