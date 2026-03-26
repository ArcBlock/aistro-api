import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Toast from '@arcblock/ux/lib/Toast';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from 'dayjs';
import { ComponentType, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Center from '../../components/center';
import ErrorPage from '../../components/error';
import ForbiddenPage from '../../components/forbidden';
import { useSessionContext } from '../../contexts/session';
import { bindInviteFriend, getErrorMessage, getInviteFriend, getMessage } from '../../libs/api';
import { DataProps, InviteFriend, MessageType } from '../../libs/type';
import { sleep } from '../../libs/utils';
// import fortunes from './fortunes';
// import natal from './natal';
import synastry from './synastry';

const tryTime = 30;

function Message() {
  const { messageId } = useParams();
  const { locale } = useLocaleContext();
  const { session } = useSessionContext();
  const [invitedFriend, setInvitedFriend] = useState<InviteFriend | null>();

  if (!messageId) {
    throw new Error('messageId is required');
  }

  const [state, setState] = useState<{
    loading: boolean;
    error?: Error | null;
    value?: { data: DataProps } | any | null;
  }>({
    loading: true,
    error: null,
    value: null,
  });

  const init = async (retry = 0) => {
    await sleep(300);

    try {
      const res = await getMessage({ messageId, language: locale });

      // @ts-ignore
      if (res?.data?.code === 403) {
        setState((r) => ({
          ...r,
          loading: false,
          value: { data: { code: 403 } },
        }));
        return;
      }

      const data = res?.data as DataProps;
      setState((r) => ({
        ...r,
        loading: false,
        value: { data },
      }));
      const invitedFriend = await getInviteFriend({ reportId: messageId });

      setInvitedFriend(invitedFriend.data.inviteFriend);
      // 如果没有数据, 添加重试
      if (res.data?.generateStatus !== 'finished' && retry < tryTime) {
        await sleep(5000);
        init(retry + 1);
      }
    } catch (error) {
      setState((r) => ({ ...r, error }));
    } finally {
      setState((r) => ({ ...r, loading: false }));
    }
  };

  useEffect(() => {
    const bindFriendId = async (userId: string, invitedId: string) => {
      try {
        const utcOffset = dayjs().utcOffset();
        await bindInviteFriend({ userId, invitedId, utcOffset });
      } catch (error) {
        console.error(error);
        Toast.error(getErrorMessage(error));
      }
    };
    if (session?.user && invitedFriend?.id && !invitedFriend?.toUserId) {
      bindFriendId(session.user?.did, invitedFriend.id);
    }
  }, [session?.user, messageId, invitedFriend]);

  useEffect(() => {
    setState((r) => ({ ...r, loading: true }));

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.loading) {
    return (
      <Root>
        <Center>
          <CircularProgress />
        </Center>
      </Root>
    );
  }

  if (state.error) {
    return (
      <Root>
        <ErrorPage />
      </Root>
    );
  }

  const data = state.value?.data;
  if (!data) {
    return (
      <Root>
        <ErrorPage />
      </Root>
    );
  }

  if (data.code && data.code === 403) {
    return (
      <Root>
        <ForbiddenPage />
      </Root>
    );
  }

  const type = data?.type;
  const Components: { [key: number]: ComponentType<{ data: DataProps; messageId: string; onLoggedIn: () => void }> } = {
    // [MessageType.TodaysFortunes]: fortunes, // 3 今日运势
    // [MessageType.Fortunes]: fortunes, // 3 今日运势
    // [MessageType.NatalReport]: natal, // 12 个人命盘
    [MessageType.SynastryReport]: synastry, // 13 两人合盘
    // [MessageType.FriendNatalReport]: natal,
  };

  if (type) {
    const Component = Components[type] || ErrorPage;
    return (
      <Root>
        <Box className="app">
          <Component data={{ ...data, invitedFriend }} messageId={messageId} onLoggedIn={() => {}} />
        </Box>
      </Root>
    );
  }

  return (
    <Root>
      <ErrorPage />
    </Root>
  );
}

const Root = styled(Box)`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: rgb(22, 21, 72);
`;

export default Message;
