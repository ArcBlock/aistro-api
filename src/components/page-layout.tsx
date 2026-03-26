// import Footer from '@blocklet/ui-react/lib/Footer';
import Header from '@blocklet/ui-react/lib/Header';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import { Component, type ErrorInfo, type ReactNode } from 'react';

// Header from @blocklet/ui-react crashes when session context is not yet initialized (guest access).
// Wrap it in a boundary so it doesn't take down the whole page.
class HeaderBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(_: Error, info: ErrorInfo) {
    console.warn('Header render failed, hiding header:', info);
  }

  override render() {
    return this.state.hasError ? null : this.props.children;
  }
}

function Layout({ children, ...rest }: { children: any }) {
  return (
    <Root {...rest}>
      <HeaderBoundary>
        <StyledHeader className="sticky" maxWidth={false} />
      </HeaderBoundary>

      <Box className="body-inner">
        <Box className="main-inner">{children}</Box>

        {/* <Footer layout="standard" style={{ border: 0 }} /> */}
      </Box>
    </Root>
  );
}

const Root = styled(Box)`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: rgb(22, 21, 72);

  .body-inner {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    width: 100%;
  }

  .main-inner {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .footer {
    margin-top: 0;
  }

  .footer-row-auto-center {
    border: 0;
  }
`;

const StyledHeader = styled(Header)`
  &.sticky {
    position: sticky;
    top: 0;
    width: 100%;
  }
`;

export default Layout;
