/* eslint-disable jsx-a11y/control-has-associated-label */

/* eslint-disable react/no-danger */
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import QRCode from '@arcblock/ux/lib/QRCode';
import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import SvgIcon from '@mui/material/SvgIcon';
import { styled } from '@mui/material/styles';
import { useLocalStorageState } from 'ahooks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollToBottom from 'react-scroll-to-bottom';
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WeiboIcon,
  WeiboShareButton,
} from 'react-share';
import { joinURL } from 'ufo';

import Layout from '../../components/page-layout';
import { fetch } from '../../libs/api';
import { getFortuneReport } from '../../libs/fortune';
import { getShareContent, isInAistroClient } from '../../libs/utils';
import AppStoreIcon from './icons/appstore.svg?react';
import GooglePlayIcon from './icons/googleplay.svg?react';

function Container({ children, needScroll }: { children: any; needScroll: Boolean }) {
  if (needScroll) {
    return (
      <ScrollToBottom scrollViewClassName="scroll-view-child" className="scroll-view">
        {children}
      </ScrollToBottom>
    );
  }
  return <div className="scroll-view">{children}</div>;
}

function ReportDetail() {
  const theme = useTheme();
  const prefix = window.blocklet && window.blocklet.prefix ? window.blocklet.prefix : '/';
  const type = 0;
  const navigate = useNavigate();
  const [birthData] = useLocalStorageState<any | undefined>('fortune-data');
  const [reportId, setReportId] = useLocalStorageState<string | undefined>(`fortune-reportId-${type}`);
  const { t, locale } = useLocaleContext();
  const [isGenerating, setIsGenerating] = useState<Boolean>(true);
  const [isOK] = useState<Boolean>(!!reportId);
  const [content, setContent] = useState<string>('');
  const [url, setUrl] = useState<string>('');

  const isBreakpointsDownSm = useMediaQuery(theme.breakpoints.down('sm'));
  useEffect(() => {
    async function genReport() {
      setContent('');
      fetch(joinURL(window.location.origin, prefix, '/api/fortune/generate'), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthDate: birthData.birthDate,
          birthPlace: birthData.birthPlace,
          lang: locale,
          type,
        }),
      }).then(async (res: any) => {
        setIsGenerating(true);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { value, done } = await reader.read();
          if (value) {
            const text = decoder.decode(value, { stream: true });
            if (text.startsWith('<start:')) {
              const id = text.replaceAll('<start:', '').replaceAll('>', '');
              setReportId(id);
              setUrl(joinURL(window.location.origin, prefix, 'fortune/share/0', id));
            } else {
              if (text.indexOf('<end>') > -1) {
                setIsGenerating(false);
              }
              setContent((oldContent) => oldContent + text);
            }
          }
          if (done) break;
        }
      });
    }

    async function getReportById() {
      if (reportId) {
        try {
          const report = await getFortuneReport(reportId);
          if (report.code === 1) {
            setReportId(undefined);
            navigate('/fortune/form/0', { replace: true });
          } else if (report.code === 0 && report.report) {
            // 显示数据
            setContent(report.report);
            setUrl(joinURL(window.location.origin, prefix, 'fortune/share/0', reportId));
            setIsGenerating(false);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }

    if (reportId) {
      // 通过 ReportId 拿结果
      getReportById();
    } else if (birthData && birthData.birthDate && birthData.birthPlace) {
      // 通过 birth 信息去生成一个新的 report
      genReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthData]);

  if (!birthData && !reportId) {
    navigate('/fortune/form/0', { replace: true });
    return null;
  }

  return (
    <DivOuter>
      <Div>
        <Container needScroll={!isOK}>
          <p className="title">{t('fortune.genReport.title')}</p>
          <div className={isGenerating ? 'content content-generating' : 'content'}>
            <div className="header-bg">
              <img src={joinURL(window?.blocklet?.prefix ?? '/', '/images/header-bg.png')} alt="" />
            </div>
            <p className="report" dangerouslySetInnerHTML={{ __html: content }} />
            {!isInAistroClient() && (
              <Collapse in={!isGenerating} timeout={1000}>
                <div className="share-container">
                  <div className="shares-outer">
                    <p className="share-title">{t('fortune.genReport.shareTo')}</p>
                    <div className="shares">
                      <div className="share-item">
                        <TwitterShareButton url={url} title={getShareContent(content)}>
                          <TwitterIcon size={isBreakpointsDownSm ? 24 : 28} round />
                        </TwitterShareButton>
                      </div>
                      <div className="share-item">
                        <TelegramShareButton url={url} title={getShareContent(content)}>
                          <TelegramIcon size={isBreakpointsDownSm ? 24 : 28} round />
                        </TelegramShareButton>
                      </div>
                      <div className="share-item">
                        <RedditShareButton url={url} title={getShareContent(content)}>
                          <RedditIcon size={isBreakpointsDownSm ? 24 : 28} round />
                        </RedditShareButton>
                      </div>
                      <div className="share-item">
                        <WeiboShareButton url={url} title={getShareContent(content)}>
                          <WeiboIcon size={isBreakpointsDownSm ? 24 : 28} round />
                        </WeiboShareButton>
                      </div>
                      <div className="share-item">
                        <FacebookShareButton url={url} hashtag={getShareContent(content)}>
                          <FacebookIcon size={isBreakpointsDownSm ? 24 : 28} round />
                        </FacebookShareButton>
                      </div>
                      <div className="share-item">
                        <LinkedinShareButton url={url} summary={getShareContent(content)}>
                          <LinkedinIcon size={isBreakpointsDownSm ? 24 : 28} round />
                        </LinkedinShareButton>
                      </div>
                    </div>
                  </div>
                  <div className="qr-code">
                    <QRCode data={url} size={isBreakpointsDownSm ? 70 : 100} image={undefined} config={undefined} />
                  </div>
                </div>
              </Collapse>
            )}
          </div>
          <Collapse in={!isGenerating && !isInAistroClient()} timeout={1000}>
            <div className="bottom-container">
              <div className="bottom" dangerouslySetInnerHTML={{ __html: t('fortune.genReport.bottomTip') }} />
              <div className="buttons">
                <a href="https://apps.apple.com/app/aistro-ai-astrology/id6447492298" target="_blank" rel="noreferrer">
                  <SvgIcon className="svg-icon" component={AppStoreIcon} viewBox="0 0 127 43" />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=io.arcblock.aistro"
                  target="_blank"
                  rel="noreferrer">
                  <SvgIcon className="svg-icon" component={GooglePlayIcon} viewBox="0 0 127 43" />
                </a>
              </div>
              <img
                className="screen-shot"
                src={joinURL(
                  window?.blocklet?.prefix ?? '/',
                  locale === 'zh' ? '/images/chat-zh.png' : '/images/chat.png',
                )}
                alt=""
              />
            </div>
          </Collapse>
        </Container>
      </Div>
    </DivOuter>
  );
}

const DivOuter = styled(Layout)`
  align-items: center;
  color: #ffffff;
`;

const Div = styled(Box)`
  width: 100%;
  max-width: 744px;
  min-width: 600px;
  margin: 0 auto;
  @media (max-width: ${(props) => props.theme.breakpoints.values.sm}px) {
    padding: 0 20px;
    box-sizing: border-box;
  }
  .scroll-view {
    height: 100%;
    position: absolute;
    max-width: 744px;
    min-width: 600px;
    margin: auto;
    top: 64px;
    left: 0;
    right: 0;
    @media (max-width: ${(props) => props.theme.breakpoints.values.sm}px) {
      padding: 0 20px;
      max-width: fit-content;
      min-width: fit-content;
    }

    .scroll-view-child {
      overflow-y: none;
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
    }
  }
  .title {
    font-size: 48px;
    text-align: center;
    padding: 0px 0 0 0;
    color: transparent;
    font-weight: bold;
    margin: 32px 0 0px 0;
    background-image: radial-gradient(circle at 0 0, #c849fe, #1d95fe 65%);
    background-clip: text;
    @media (max-width: ${(props) => props.theme.breakpoints.values.sm}px) {
      font-size: 28px;
      margin: 32px 0 0px 0;
    }
  }
  .content {
    width: 100%;
    padding: 30px;
    background: #0c0b33;
    border-radius: 12px;
    position: relative;
    color: #f7f7fd;
    margin: 24px auto 0px auto;
    border-radius: 12px;
    border: 2px solid #e2ac11;
    z-index: 1;
    .share-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      .qr-code {
        padding: 5px 5px 1px 5px;
        background-color: #fff;
        @media (max-width: ${(props) => props.theme.breakpoints.values.sm}px) {
          padding: 5px 5px 0px 5px;
        }
      }
    }
    .shares-outer {
      width: 100%;
      display: flex;
      flex-direction: column;
      .share-title {
        margin: 0px 0px 16px 0px;
        font-size: 20px;
        font-weight: 700;
        @media (max-width: ${(props) => props.theme.breakpoints.values.sm}px) {
          font-size: 14px;
        }
      }
      .shares {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: #fff;
        .shares-prefix {
          margin-bottom: 6px;
          font-size: 14px;
          margin-right: 4px;
        }
        .share-item {
          margin-left: 12px;
          &:first-of-type {
            margin-left: 0;
          }
        }
        @media (max-width: ${(props) => props.theme.breakpoints.values.sm}px) {
          width: inherit;
          max-width: inherit;
          min-width: inherit;
        }
      }
    }
    .header-bg {
      position: absolute;
      left: 0px;
      top: 0px;
      z-index: -1;
      img {
        width: 100%;
        margin-right: 2px;
        border-radius: 12px 12px 0 0;
        position: relative;
      }
      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        border-radius: 12px 12px 0 0;
        height: 100%;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, #0c0b33 100%);
      }
    }
    .report {
      margin-top: 90px;
      text-align: start;
      word-break: normal;
      font-size: 20px;
      line-height: 36px;
      white-space: pre-wrap;
      letter-spacing: 0.05em;
      padding-bottom: 16px;
      strong {
        color: #e2ac11;
        font-size: 28px;
        font-weight: bold;
      }
      a {
        text-decoration: none;
        color: #e2ac11;
        font-size: 28px;
        font-weight: bold;
      }
    }
    @media (max-width: ${(props) => props.theme.breakpoints.values.sm}px) {
      padding: 20px;
      .report {
        font-size: 16px;
        line-height: 28px;
        letter-spacing: 0.05em;
        strong {
          font-size: 20px;
          font-weight: bold;
        }
        a {
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
  }
  .content-generating {
    .report {
      &:after {
        content: '';
        display: inline-block;
        vertical-align: middle;
        height: 1.2em;
        margin-top: -0.2em;
        margin-left: 0.1em;
        border-right: 0.2em solid orange;
        border-radius: 10px;
        animation: blink-caret 0.75s step-end infinite;
        @keyframes blink-caret {
          from,
          to {
            border-color: transparent;
          }
          50% {
            border-color: orange;
          }
        }
      }
    }
  }
  .bottom-container {
    width: 100%;
    padding: 30px;
    background: #0c0b33;
    border-radius: 12px;
    position: relative;
    color: #f7f7fd;
    margin: 24px auto 40px auto;
    border-radius: 12px;
    border: 2px solid #e2ac11;
    display: flex;
    flex-direction: column;
    align-items: center;
    .screen-shot {
      width: 300px;
      margin: 10px auto;
      border-radius: 12px;
      border: 2px solid #fff;
    }
    .bottom {
      text-align: start;
      word-break: normal;
      font-size: 20px;
      line-height: 36px;
      white-space: pre-wrap;
      letter-spacing: 0.05em;
      strong {
        color: #e2ac11;
        font-size: 28px;
        font-weight: bold;
      }
    }
    .buttons {
      margin: 20px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      a {
        margin-left: 20px;
        &:first-of-type {
          margin-left: 0;
        }
        .svg-icon {
          width: 203.2px;
          height: 68.8px;
        }
      }
    }
    @media (max-width: ${(props) => props.theme.breakpoints.values.sm}px) {
      width: inherit;
      max-width: fit-content;
      min-width: inherit;
      padding: 20px;
      .screen-shot {
        width: 190px;
      }
      .bottom {
        font-size: 16px;
        line-height: 28px;
        strong {
          font-size: 20px;
          font-weight: bold;
        }
      }
      .buttons {
        a {
          .svg-icon {
            width: 127px;
            height: 43px;
          }
        }
      }
    }
  }
`;

export default ReportDetail;
