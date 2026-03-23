import useBrowser from '@arcblock/react-hooks/lib/useBrowser';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Toast from '@arcblock/ux/lib/Toast';
import { useSearchBoxCore } from '@mapbox/search-js-react';
import { styled } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import { joinURL } from 'ufo';

import Footer from '../../components/footer';
import Layout from '../../components/page-layout';
import { useSessionContext } from '../../contexts/session';
import { completeInvitation, getInvitation, getUserDetail } from '../../libs/invites';

const Root = styled(Layout)`
  background-color: rgb(28, 28, 72);
  align-items: center;
  .container {
    width: 100%;
    max-width: 800px;
    padding: 0 20px;
    margin: 0 auto;
    .Mui-disabled {
      color: #fff !important;
      -webkit-text-fill-color: #fff !important;
    }
    .MuiAutocomplete-clearIndicator {
      color: #fff !important;
    }
    .invite-invalid {
      width: 100%;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 80px 0;
      .out-of-date-icon {
        width: 150px;
        height: 150px;
      }
      .title {
        font-size: 20px;
        font-weight: 700;
        margin-top: 12px;
        text-align: center;
      }
      .desc {
        color: rgba(255, 255, 255, 0.5);
        font-size: 16px;
        font-weight: 700;
        text-align: center;
        margin-top: 6px;
      }
      .go-main-site-btn {
        margin-top: 24px;
        border-color: #fff;
        color: #fff;
        text-transform: none;
      }
    }
  }
`;

const Container = styled(Box)`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 12px;
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
    .Mui-disabled {
      background: #ccc !important;
    }
  }
`;

function InviteFriendContainer({ children }: { children: ReactNode }) {
  return (
    <Root>
      <div className="container">{children}</div>
      <Footer mt={8} maxWidth={760} mx="auto" width="100%" />
    </Root>
  );
}

function InviteFriend() {
  const searchBoxCore = useSearchBoxCore({ accessToken: import.meta.env.VITE_MAPBOX_TOKEN || '' });
  const { t, locale } = useLocaleContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [friendBirthDate, setFriendBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState(dayjs(''));
  const [address, setAddress] = useState('');
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const { id } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserReady, setIsUserReady] = useState(false);
  const { session } = useSessionContext();
  const browser = useBrowser();
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const res = await getUserDetail();
        if (res.birthPlace) {
          setAddress(res.birthPlace.address);
          setLatitude(res.birthPlace.latitude);
          setLongitude(res.birthPlace.longitude);
        }
        if (res.birthDate) {
          const birthDate = dayjs(res.birthDate).format('YYYY-MM-DD');
          setBirthTime(dayjs(res.birthDate));
          setFriendBirthDate(birthDate);
        }
        if (res.birthPlace && res.birthDate) {
          setIsUserReady(true);
        }
      } catch (error) {
        // console.error(error);
      }
    };
    if (session.user) {
      fetchUserDetail();
    } else {
      // for test
      // const birthDate = dayjs('1990-02-25 00:00:00').format('YYYY-MM-DD');
      // setBirthTime(dayjs('1990-02-25 00:00:00'));
      // setFriendBirthDate(birthDate);
    }
  }, [session.user]);

  const result = useAsync(() => getInvitation(id!), []);

  const handleLoginClick = () => {
    session.login(() => {});
  };

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

  if (result.loading) {
    return (
      <InviteFriendContainer>
        <div className="invite-invalid">
          <CircularProgress
            size={32}
            sx={{
              color: 'white',
            }}
          />
          <span className="title">{t('inviteFriend.loading')}</span>
        </div>
      </InviteFriendContainer>
    );
  }

  if (result.value?.code === 200) {
    const inviteFriend = result.value?.inviteFriend;
    const fromUserId = result.value?.inviteFriend?.fromUserId!;

    const reportId = result.value?.inviteFriend?.reportId;

    if (reportId) {
      navigate(`/message/${reportId}?${searchParams.toString()}`, { replace: true });
      return null;
    }

    // 此时如果发现是在微信浏览器里面，则提示用户用系统浏览器打开
    if (browser.wechat) {
      return (
        <InviteFriendContainer>
          <div className="invite-invalid">
            <img
              className="out-of-date-icon"
              src={joinURL(window?.blocklet?.prefix ?? '/', '/images/arrow-to-right.png')}
              alt=""
            />
            <span className="title">请点击右上角按钮，选择“在浏览器中打开”即可继续完成星座匹配！</span>
          </div>
        </InviteFriendContainer>
      );
    }

    const handleFinishSynastry = async () => {
      if (!address) {
        Toast.error('Please select address');
        return;
      }
      setIsLoading(true);
      const selectTime = birthTime.format('HH:mm');
      try {
        const result = await completeInvitation(
          id!,
          fromUserId,
          `${friendBirthDate} ${selectTime}`,
          {
            longitude,
            latitude,
            address,
          },
          locale,
        );
        navigate(`/message/${result.reportId!}?${searchParams.toString()}`, { replace: true });
      } catch (error) {
        Toast.error('The submission failed. Please try again');
      }
      setIsLoading(false);
    };

    return (
      <InviteFriendContainer>
        <>
          <Box
            component="h1"
            sx={{
              fontSize: 18,
              textAlign: 'center',
              padding: '20px 0',
              margin: '0 -20px',
              backgroundImage: 'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)',
              color: '#fff',
            }}>
            {t('inviteFriend.topTip')}
          </Box>
          <Box
            component="h1"
            sx={{
              fontSize: { xs: 28, sm: 48 },
              lineHeight: { xs: '30px', sm: '60px' },
              textAlign: { xs: 'center', sm: 'center' },
              padding: '20px 0 0 0',
              color: 'transparent',
              backgroundImage: 'radial-gradient(circle at 0 0, #c849fe, #1d95fe 65%)',
              backgroundClip: 'text',
            }}>
            {t('inviteFriend.title', { user: inviteFriend?.fromUserName })}
          </Box>
          <Box
            mt={2.5}
            sx={{
              fontSize: { xs: 16, sm: 18 },
              textAlign: { xs: 'center', sm: 'center' },
              color: 'white',
              maxWidth: '800px',
              margin: '0 0 24px 0',
            }}>
            {t('inviteFriend.desc', { friendName: inviteFriend?.friendName, user: inviteFriend?.fromUserName })}
          </Box>
          <Container>
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
                  disabled={isLoading}
                  readOnly={isUserReady}
                  slotProps={{
                    textField: { placeholder: t('inviteFriend.birthDatePlacholer') },
                  }}
                  value={dayjs(friendBirthDate).isValid() ? dayjs(friendBirthDate) : null}
                  onAccept={(newValue) => {
                    if (newValue) {
                      const dayjsValue = newValue as Dayjs;
                      const formattedDate = dayjsValue.format('YYYY-MM-DD');
                      setFriendBirthDate(formattedDate);
                    }
                  }}
                  open={session.user}
                  onOpen={() => {
                    if (isUserReady) {
                      setIsLoginDialogOpen(true);
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
                  disabled={isLoading}
                  readOnly={isUserReady}
                  defaultValue={dayjs('12:00')}
                  value={dayjs(birthTime).isValid() ? dayjs(birthTime) : null}
                  onAccept={(newValue) => {
                    if (newValue) {
                      setBirthTime(newValue);
                    }
                  }}
                  open={session.user}
                  onOpen={() => {
                    if (isUserReady) {
                      setIsLoginDialogOpen(true);
                    }
                  }}
                />
              </LocalizationProvider>
            </Box>
            {!isUserReady && (
              <Typography sx={{ textAlign: 'left', color: 'white' }}>
                <Button
                  variant="text"
                  color="inherit"
                  disabled={isLoading}
                  onClick={handleLinkClick}
                  sx={{
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}>
                  {t('inviteFriend.birthTimeNotKnown')}
                </Button>
              </Typography>
            )}
          </Container>

          <Container>
            <Box className="name-title">{t('inviteFriend.birthPlace')}</Box>
            <Box
              className="name-input"
              sx={{
                input: {
                  color: 'white !important',
                  background: '#292857 !important',
                },
              }}>
              {isUserReady && <span className="input-text">{address}</span>}
              {!isUserReady && (
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
              )}
            </Box>

            <Box className="action">
              {isUserReady && (
                <span
                  style={{ color: '#fff', fontSize: 12, textAlign: 'center', margin: '6px 0' }}
                  className="input-text">
                  系统识别到您已登录，已自动填入您的出生信息！
                </span>
              )}
              <Button
                className="start-button"
                variant="contained"
                onClick={handleFinishSynastry}
                disabled={isLoading || !longitude || !latitude || !address}>
                {isLoading ? (
                  <Box display="flex">
                    <CircularProgress
                      size={18}
                      sx={{
                        color: 'white',
                      }}
                    />
                  </Box>
                ) : (
                  t('inviteFriend.synastryStart')
                )}
              </Button>
              {!session.user && (
                <Typography sx={{ textAlign: 'left', color: 'white' }}>
                  <Button
                    variant="text"
                    color="inherit"
                    onClick={handleLoginClick}
                    sx={{ textDecoration: 'underline', cursor: 'pointer', padding: '10px 0' }}>
                    {t('inviteFriend.login_tip')}
                  </Button>
                </Typography>
              )}
            </Box>
          </Container>
        </>
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

        <Dialog open={isLoginDialogOpen} onClose={handleDialogClose}>
          <DialogContent>{t('inviteFriend.logined_edit_tips')}</DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsLoginDialogOpen(false);
              }}
              color="primary">
              {t('common.ok')}
            </Button>
          </DialogActions>
        </Dialog>
      </InviteFriendContainer>
    );
  }

  return (
    <InviteFriendContainer>
      <div className="invite-invalid">
        <img
          className="out-of-date-icon"
          src={joinURL(window?.blocklet?.prefix ?? '/', '/images/out-of-date.png')}
          alt=""
        />
        <span className="title">{t('inviteFriend.outOfDate.title')}</span>
        <span className="desc">{t('inviteFriend.outOfDate.desc')}</span>
        <Button
          variant="outlined"
          className="go-main-site-btn"
          onClick={() => {
            window.location.href = window.location.origin;
          }}>
          {t('inviteFriend.outOfDate.btn')}
        </Button>
      </div>
    </InviteFriendContainer>
  );
}

export default InviteFriend;
