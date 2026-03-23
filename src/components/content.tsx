import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { fetch, getContentUrl } from '../libs/api';

type Props = {
  content: string;
  messageId: string;
  [key: string]: any;
};

function Content({ content, messageId, ...rest }: Props) {
  const { t } = useLocaleContext();
  const [message, setMessage] = useState('');

  const handleContentChange = async () => {
    const decoder = new TextDecoder();
    const url = getContentUrl({ messageId });
    const reader = (await fetch(url)).body?.getReader();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (reader) {
        const { value, done } = await reader.read();
        if (value) {
          const chunkValue = decoder.decode(value);
          setMessage((r) => r + chunkValue);
        }

        if (done) {
          break;
        }
      }
    }
  };

  useEffect(() => {
    if (!content) {
      handleContentChange();
    } else {
      setMessage(content);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, messageId]);

  return (
    <Container {...rest}>
      {message ? <Box component={ReactMarkdown}>{message}</Box> : <span className="loader">{t('common.loading')}</span>}
    </Container>
  );
}

const Container = styled(Box)`
  padding: 12px;
  margin: 24px 20px;
  background: #292857;
  border-radius: 12px;
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #ffffff;
  text-align: justify;

  .loader {
    color: #fff;
    display: inline-block;
    position: relative;
    font-size: 16px;
    font-family: Arial, Helvetica, sans-serif;
    box-sizing: border-box;
  }

  .loader::after {
    content: '';
    width: 2px;
    height: 2px;
    background: currentColor;
    position: absolute;
    bottom: 8px;
    right: -5px;
    box-sizing: border-box;
    animation: animloader 1s linear infinite;
  }

  @keyframes animloader {
    0% {
      box-shadow:
        10px 0 rgba(255, 255, 255, 0),
        20px 0 rgba(255, 255, 255, 0);
    }
    50% {
      box-shadow:
        10px 0 white,
        20px 0 rgba(255, 255, 255, 0);
    }
    100% {
      box-shadow:
        10px 0 white,
        20px 0 white;
    }
  }
`;

export default Content;
