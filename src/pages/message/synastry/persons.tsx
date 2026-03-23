import styled from '@emotion/styled';
import { Stack } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

const Container = styled(Box)`
  margin-top: 64px;
  overflow: hidden;

  .avatar {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 500;
    font-size: 40px;
    line-height: 56px;
    width: 64px;
    height: 64px;
    background: #34289b;
    border: 0 !important;
  }

  .title {
    font-family: 'Exo 2';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    width: 64px;
    text-align: center;
    color: #ffffff;
    margin-top: 16px;
    text-transform: capitalize;
    word-break: keep-all;
  }
`;

type User = {
  name?: string;
  avatar?: string;
};

function DashedLineSVG() {
  return (
    <svg width="60" height="64">
      <path d="M0 32 l58 0" stroke="white" strokeWidth="2" strokeDasharray="2,2" fill="none" />
    </svg>
  );
}

function EmojiScore({ score }: { score: number }) {
  let emoji = '\u{1F604}';
  if (score >= 80) {
    emoji = '\u{1F604}';
  } else if (score >= 60) {
    emoji = '\u{1F60A}';
  } else if (score >= 40) {
    emoji = '\u{1F642}';
  } else if (score >= 20) {
    emoji = '\u{1F61F}';
  } else {
    emoji = '\u{1F62D}';
  }
  return (
    <div
      style={{
        height: '28px',
        width: '28px',
        fontSize: '20px',
        marginTop: '20px',
        borderRadius: '50%',
        backgroundColor: '#8855F4',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <span style={{ marginBottom: '4px' }}>{emoji}</span>
    </div>
  );
}

function Persions({ user, matchUser, score }: { user: User; matchUser: User; score: number }) {
  const [time, setTime] = useState(0);
  const trueScore = score > 0 ? score : 80;

  useEffect(() => {
    if (score <= 0) {
      const tick = setInterval(() => {
        setTime(time + 1);
      }, 500);
      return () => clearInterval(tick);
    }
    return () => {};
  }, [time, score]);

  return (
    <Container>
      <Stack spacing={1} direction="row" justifyContent="center">
        <Stack spacing={0} direction="column" justifyContent="center">
          {user?.avatar ? (
            <Avatar className="avatar" src={user?.avatar} />
          ) : (
            <Avatar className="avatar">{(user?.name?.[0] || '').toUpperCase()}</Avatar>
          )}
          <Box className="title">{`${user?.name || ''}`}</Box>
        </Stack>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <DashedLineSVG />
          <EmojiScore score={trueScore} />
          <DashedLineSVG />
        </div>
        <Stack spacing={0} direction="column" justifyContent="center">
          <Avatar className="avatar">{(matchUser?.name?.[0] || '').toUpperCase()}</Avatar>
          <Box className="title">{matchUser?.name || ''}</Box>
        </Stack>
      </Stack>
    </Container>
  );
}

export default Persions;
