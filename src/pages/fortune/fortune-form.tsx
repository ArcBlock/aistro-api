import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import QRCode from '@arcblock/ux/lib/QRCode';
import { useSearchBoxCore } from '@mapbox/search-js-react';
import { useMediaQuery, useTheme } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { useLocalStorageState } from 'ahooks';
import dayjs, { Dayjs } from 'dayjs';
import { ReactNode, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

import Footer from '../../components/footer';
import Layout from '../../components/page-layout';
import { useSessionContext } from '../../contexts/session';
import { isInAistroClient } from '../../libs/utils';

function FortuneFormContainer({ children }: { children: ReactNode }) {
  return (
    <Div>
      <div className="container">{children}</div>
      <Footer mt={8} maxWidth={760} mx="auto" width="100%" />
    </Div>
  );
}

const getTitle = (type: number, t: any) => {
  if (Number(type) === 1) {
    return t('fortune.form.dragonTitle');
  }
  if (type === 2) {
    return t('fortune.form.snakeTitle');
  }
  return t('fortune.form.title');
};

function FortuneForm() {
  const theme = useTheme();
  const { type } = useParams();
  const [, setBirthData] = useLocalStorageState<any | undefined>('fortune-data');
  const [reportId, setReportId] = useLocalStorageState<string | undefined>(`fortune-reportId-${type}`);
  const searchBoxCore = useSearchBoxCore({ accessToken: import.meta.env.VITE_MAPBOX_TOKEN || '' });
  const { t, locale } = useLocaleContext();
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState(dayjs(''));
  const [address, setAddress] = useState('');
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { session } = useSessionContext();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const navigate = useNavigate();
  const isBreakpointsDownSm = useMediaQuery(theme.breakpoints.down('sm'));

  useMemo(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLinkClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleConfirm = () => {
    // 处理确认逻辑
    setBirthTime(dayjs('2000-01-01T12:00'));
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    // 处理取消逻辑
    setIsDialogOpen(false);
  };

  const url = window.location.href;

  return (
    <FortuneFormContainer>
      <Container>
        <p className="title">{getTitle(Number(type), t)}</p>
        <p className="sub-title">{t('fortune.form.inputTip')}</p>
        <Box className="name-title">{t('inviteFriend.birthDate')}</Box>
        <Box className="name-input">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
            <MobileDatePicker
              sx={{
                width: '100%',
                '& .MuiInputBase-input': {
                  color: 'white',
                },
                '& .MuiSvgIcon-root': {
                  color: 'white',
                },
              }}
              slotProps={{
                textField: { placeholder: t('inviteFriend.birthDatePlacholer') },
              }}
              value={dayjs(birthDate).isValid() ? dayjs(birthDate) : null}
              onAccept={(newValue) => {
                if (newValue) {
                  const dayjsValue = newValue as Dayjs;
                  const formattedDate = dayjsValue.format('YYYY-MM-DD');
                  setBirthDate(formattedDate);
                }
              }}
            />
          </LocalizationProvider>
        </Box>
      </Container>

      <Container>
        <Box className="name-title">{t('inviteFriend.birthTime')}</Box>
        <Box className="name-input">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
            <MobileTimePicker
              sx={{
                width: '100%',
                '& .MuiInputBase-input': {
                  color: 'white',
                },
                '& .MuiSvgIcon-root': {
                  color: 'white',
                },
              }}
              slotProps={{
                textField: { placeholder: t('inviteFriend.birthTimePlacholer') },
              }}
              defaultValue={dayjs('12:00')}
              value={dayjs(birthTime).isValid() ? dayjs(birthTime) : null}
              onAccept={(newValue) => {
                if (newValue) {
                  setBirthTime(newValue);
                }
              }}
            />
          </LocalizationProvider>
        </Box>
        <Typography sx={{ textAlign: 'left', color: 'white' }}>
          <Button
            variant="text"
            color="inherit"
            onClick={handleLinkClick}
            sx={{
              textDecoration: 'underline',
              cursor: 'pointer',
            }}>
            {t('inviteFriend.birthTimeNotKnown')}
          </Button>
        </Typography>
      </Container>

      <Container style={{ marginTop: '0px' }}>
        <Box className="name-title">{t('inviteFriend.birthPlace')}</Box>
        <Box
          className="name-input"
          sx={{
            input: {
              color: 'white !important',
              background: '#292857 !important',
            },
          }}>
          <Autocomplete
            onInputChange={(_event, _value, reason) => {
              if (reason === 'clear') {
                setSuggestions([]);
                setAddress('');
                setLongitude(0);
                setLatitude(0);
              }
            }}
            onChange={async (_event: any, newValue: string | any | null) => {
              if (newValue && newValue.name) {
                try {
                  // @ts-ignore
                  const { features } = await searchBoxCore.retrieve(newValue, { sessionToken: token });
                  if (features && features.length > 0) {
                    // @ts-ignore
                    setAddress(features[0].properties.name);
                    // @ts-ignore
                    setLatitude(features[0].geometry.coordinates[1]);
                    // @ts-ignore
                    setLongitude(features[0].geometry.coordinates[0]);
                  }
                } catch (error) {
                  console.error(error);
                }
              } else {
                setSuggestions([]);
                setAddress('');
                setLongitude(0);
                setLatitude(0);
              }
            }}
            freeSolo
            selectOnFocus
            getOptionLabel={(option) => {
              return option.name || '';
            }}
            options={suggestions}
            renderOption={(props, option) => (
              <li {...props} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 'bold', fontSize: 14 }}>{option.name}</span>
                <span style={{ fontSize: 13 }}>{option.place_formatted}</span>{' '}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                placeholder={t('inviteFriend.birthPlacePlaceholder')}
                onChange={async (e) => {
                  if (e.target.value) {
                    const response = await searchBoxCore.suggest(e.target.value, {
                      sessionToken: token,
                      types: 'city',
                    });
                    if (response.suggestions) {
                      setSuggestions(response.suggestions);
                    }
                  } else {
                    setAddress('');
                    setLongitude(0);
                    setLatitude(0);
                  }
                }}
                {...params}
              />
            )}
          />
        </Box>
        <Box className="action">
          {(session.user || !reportId) && (
            <Button
              className="start-button"
              variant="contained"
              onClick={() => {
                const selectTime = birthTime.format('HH:mm');
                setBirthData({
                  birthDate: `${birthDate} ${selectTime}`,
                  birthPlace: {
                    longitude,
                    latitude,
                  },
                });
                setReportId(undefined);
                navigate(`/fortune/report/${type}`);
              }}
              disabled={!longitude || !latitude || !address || !birthTime || !birthDate}>
              {reportId ? t('fortune.form.reStartBtn') : t('fortune.form.startBtn')}
            </Button>
          )}
          {!session.user && reportId && (
            <Button
              className="start-button"
              variant="contained"
              onClick={() => {
                session.login();
              }}>
              {t('fortune.form.loginToUnlock')}
            </Button>
          )}
          {reportId && (
            <Button
              className="view-button"
              variant="outlined"
              onClick={() => {
                navigate(`/fortune/report/${type}`);
              }}>
              {t('fortune.form.viewReport')}
            </Button>
          )}
        </Box>
      </Container>
      <p className="bottom-tip">{t('fortune.form.tip')}</p>
      {!isInAistroClient() && (
        <div className="shares-outer">
          <p className="share-title">{t('fortune.form.invite')}</p>
          <div className="shares">
            <div className="share-item">
              <TwitterShareButton url={url} title={t('fortune.form.title')}>
                <TwitterIcon size={isBreakpointsDownSm ? 24 : 28} round />
              </TwitterShareButton>
            </div>
            <div className="share-item">
              <TelegramShareButton url={url} title={t('fortune.form.title')}>
                <TelegramIcon size={isBreakpointsDownSm ? 24 : 28} round />
              </TelegramShareButton>
            </div>
            <div className="share-item">
              <RedditShareButton url={url} title={t('fortune.form.title')}>
                <RedditIcon size={isBreakpointsDownSm ? 24 : 28} round />
              </RedditShareButton>
            </div>
            <div className="share-item">
              <WeiboShareButton url={url} title={t('fortune.form.title')}>
                <WeiboIcon size={isBreakpointsDownSm ? 24 : 28} round />
              </WeiboShareButton>
            </div>
            <div className="share-item">
              <FacebookShareButton url={url} hashtag={t('fortune.form.title')}>
                <FacebookIcon size={isBreakpointsDownSm ? 24 : 28} round />
              </FacebookShareButton>
            </div>
            <div className="share-item">
              <LinkedinShareButton url={url} summary={t('fortune.form.title')}>
                <LinkedinIcon size={isBreakpointsDownSm ? 24 : 28} round />
              </LinkedinShareButton>
            </div>
          </div>
        </div>
      )}
      <div className="qr-code">
        <QRCode data={url} size={120} image={undefined} config={undefined} />
      </div>
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogContent>{t('inviteFriend.born_time_tip')}</DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleConfirm} color="primary">
            {t('inviteFriend.set_to_default')}
          </Button>
        </DialogActions>
      </Dialog>
    </FortuneFormContainer>
  );
}

const Div = styled(Layout)`
  background-color: rgb(28, 28, 72);
  align-items: center;
  color: #ffffff;
  .container {
    width: 100%;
    max-width: 760px;
    padding: 0 20px;
    margin: 0 auto;
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
      }
    }
    .sub-title {
      text-align: center;
      margin: 32px 0 16px 0;
    }
    .bottom-tip {
      font-size: 13px;
      text-align: center;
    }
    .shares-outer {
      width: 100%;
      display: flex;
      flex-direction: column;
      padding-top: 16px;
      .share-title {
        margin: 0px 0px 16px 0px;
        font-size: 20px;
        font-weight: 700;
        text-align: center;
        @media (max-width: ${(props) => props.theme.breakpoints.values.sm}px) {
          font-size: 14px;
        }
      }
      .shares {
        display: flex;
        justify-content: center;
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
    .qr-code {
      margin: 20px 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      div {
        padding: 10px 10px 6px 10px;
        background-color: #fff;
      }
    }
    .Mui-disabled {
      color: #fff !important;
      -webkit-text-fill-color: #fff !important;
    }
    .MuiAutocomplete-clearIndicator {
      color: #fff !important;
    }
  }
`;

const Container = styled(Box)`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  .name-title {
    color: white;
    margin-top: 8px;
    margin-bottom: 8px;
    font-weight: 400;
    font-size: 14px;
    align-self: flex-start;
  }

  .name-input {
    display: flex;
    flex-direction: column;
    background: #292857;
    border-radius: 12px;
    color: white;
    padding: 0px 12px;
    justify-content: center;
    font-weight: 400;
    font-size: 16px;
    height: 44px;
    .input-text {
      color: white;
    }

    .input-date {
      color: white;
    }
    mapbox-search-box {
      input {
        &:focus {
          border: none;
        }
      }
    }
  }

  .action {
    display: flex;
    flex-direction: column;
    margin-top: 24px;
    .start-button {
      height: 44px;
      color: white;
      background: #9e5bf3;
      border-radius: 22px;
      width: 100%;
    }
    .view-button {
      margin-top: 16px;
      height: 44px;
      color: white;
      border-radius: 22px;
      width: 100%;
      border-color: #9e5bf3;
      border-width: 2px;
      color: #9e5bf3;
    }
    .Mui-disabled {
      background: #ccc !important;
    }
  }
`;

export default FortuneForm;
