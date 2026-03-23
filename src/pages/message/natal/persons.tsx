import styled from '@emotion/styled';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';

const Container = styled(Box)`
  margin-top: -64px;
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

  .names {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    color: #ffffff;
    margin-top: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .title {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 34px;
    text-align: center;
    text-transform: capitalize;
    color: #ffffff;
    margin-top: 24px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

type Props = {
  avatar?: string;
  name?: string;
};

function Persions({ avatar, name }: Props) {
  return (
    <Container>
      <AvatarGroup sx={{ justifyContent: 'center' }}>
        {avatar ? (
          <Avatar className="avatar" src={avatar} />
        ) : (
          <Avatar className="avatar">{(name?.[0] || '').toLocaleUpperCase()}</Avatar>
        )}
      </AvatarGroup>

      {name && <Box className="names">{name}</Box>}
    </Container>
  );
}

export default Persions;
