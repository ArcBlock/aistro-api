import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import styled from '@emotion/styled';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { ReactNode, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';

import getHoroscope, { getHoroscopeData } from '../../../api/src/libs/horoscope';
import type { HoroscopeChartData } from '../../../api/src/store/models/user';
import Chart from '../../components/astrochart';
import Footer from '../../components/footer';
import Layout from '../../components/page-layout';
import { useSessionContext } from '../../contexts/session';
import { getUserDetail } from '../../libs/invites';
import { getReportDetail } from '../../libs/report-detail';
import {
  ReportDetailCellModel,
  ReportDetailChartModel,
  ReportDetailChartType,
  ReportDetailDataType,
  ReportDetailImageModel,
  ReportDetailSpaceModel,
} from '../../libs/type';
import ActionForReportDetail from './action-for-report-detail';

const Root = styled(Layout)`
  background-color: #161548;
  align-items: center;
  .container {
    width: 100%;
    max-width: 800px;
    padding: 0 10px;
    margin: 0 auto;
    background-color: #161548;

    .header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .headerImage {
        width: 50px;
        height: auto;
      }

      .title {
        color: #d4c9ff;
        margin: 0 0 5px 0;
        font-size: 14px;
      }
      .topic {
        color: #f7f7fd;
        margin: 0 0 5px 0;
        font-size: 20px;
        font-weight: 700;
      }
      .time {
        color: #f7f7fd;
        margin: 0 0 5px 0;
        font-size: 14px;
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .imageTextCell {
        color: #f7f7fd;
        font-size: 20px;
        .topic {
          .topicHeader {
            display: flex;
            align-items: center;
            gap: 5px;
            .topicTitle {
              font-weight: 700px;
              color: #d4c9ff;
            }
            .topicImage {
              width: 20px;
              height: auto;
            }
          }
          .topicContent {
            margin: 0 0 5px 0;
          }
        }
        .onlyText {
          color: #f7f7fd;
          font-size: 20px;
        }
        .imageText {
          .image {
            width: 160px;
            height: auto;
          }
          .left {
            display: flex;
            align-items: center;
            gap: 5px;
          }
          .center {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .right {
            display: flex;
            align-items: center;
            gap: 5px;
          }
        }
      }
      .imageCell {
        width: 50px;
        height: auto;
      }
      .chartCell {
        width: 100%;
        max-width: 600px;
      }
      .spaceCell {
        font-size: 20px;
      }
    }
    .loading {
      width: 100%;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 80px 0;
    }
  }
`;

const StyledGridContainer = styled(Grid)`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 420px;
  z-index: 1;
  width: 100%;
  padding: 2.5rem;
`;

function ReportContainer({ children }: { children: ReactNode }) {
  return (
    <Root>
      <div className="container">{children}</div>
      <Footer mt={8} maxWidth={760} mx="auto" width="100%" />
      <StyledGridContainer>
        <ActionForReportDetail onLoggedIn={() => {}} />
      </StyledGridContainer>
    </Root>
  );
}

function ReportDetailImageTextCell({ data }: { data: ReportDetailCellModel }) {
  if (data.sectionIcon) {
    // topic
    return (
      <div className="imageTextCell">
        <div className="topic">
          <div className="topicHeader">
            <img className="topicImage" src={data.sectionIcon} alt={data.sectionTitle ?? ''} />
            <p className="topicTitle">{data.sectionTitle}</p>
          </div>
          <p className="topicContent">{data.content}</p>
        </div>
      </div>
    );
  }
  if (data.image) {
    // image, text
    const inset = data.inset ?? 'left';
    return (
      <div className="imageTextCell">
        <div className="imageText">
          {inset === 'left' && (
            <div className={inset}>
              <img src={data.image} alt="" className="image" />
              <p>{data.content}</p>
            </div>
          )}
          {inset === 'right' && (
            <div className={inset}>
              <p>{data.content}</p>
              <img src={data.image} alt="" className="image" />
            </div>
          )}
          {inset === 'middle' && (
            <div className={inset}>
              <img src={data.image} alt="" className="image" />
            </div>
          )}
        </div>
      </div>
    );
  }
  // only text
  return (
    <div className="imageTextCell">
      <p className="onlyText">{data.content}</p>
    </div>
  );
}

function ReportDetailImageCell({ data }: { data: ReportDetailImageModel }) {
  return <img className="imageCell" src={data.image} alt={data.description ?? ''} />;
}

function ReportDetailSpaceCell({ data }: { data: ReportDetailSpaceModel }) {
  const breaks = Array(data.line).fill(<br />);

  return <p className="spaceCell">{breaks}</p>;
}

function ReportDetailChartCell({
  data,
  userHoroscopeChartData,
  chartWidth,
}: {
  data: ReportDetailChartModel;
  userHoroscopeChartData: HoroscopeChartData | null;
  chartWidth: number;
}) {
  let otherHoroscope;

  if (data.birthDate && data.latitude && data.longitude) {
    const horoscopeData = getHoroscope({
      birthDate: data.birthDate,
      birthPlace: {
        longitude: data.longitude,
        latitude: data.latitude,
      },
    });

    otherHoroscope = getHoroscopeData(horoscopeData);
  }

  return (
    <div className="chartCell">
      {data.chartType === ReportDetailChartType.Transit && userHoroscopeChartData && otherHoroscope?.chartData ? (
        <Chart width={chartWidth} user={userHoroscopeChartData} match={otherHoroscope.chartData} />
      ) : data.chartType === ReportDetailChartType.Natal && userHoroscopeChartData ? (
        <Chart width={chartWidth} user={userHoroscopeChartData} />
      ) : (
        <div />
      )}
    </div>
  );
}

function ReportDetail() {
  const { t, locale } = useLocaleContext();
  const { id } = useParams();
  const result = useAsync(() => getReportDetail(id!, locale), [getReportDetail]);
  const { session } = useSessionContext();
  const [userHoroscopeChartData, setUserHoroscopeChartData] = useState<HoroscopeChartData | null>(null);
  const [chartWidth, setChartWidth] = useState(400); // 默认宽度

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const res = await getUserDetail();
        if (res.horoscopeChartData) {
          setUserHoroscopeChartData(res.horoscopeChartData);
        } else if (res.birthPlace && res.birthDate) {
          setUserHoroscopeChartData(
            getHoroscopeData(getHoroscope({ birthDate: res.birthDate, birthPlace: res.birthPlace })).chartData,
          );
        }
      } catch (error) {
        // console.error(error);
      }
    };
    if (session.user) {
      fetchUserDetail();
    }
  }, [session.user]);

  useEffect(() => {
    const updateWidth = () => {
      const windowWidth = window.innerWidth;
      const mobileWidth = windowWidth - 40;
      const maxWidth = 600;

      if (windowWidth < 600) {
        setChartWidth(mobileWidth);
      } else {
        setChartWidth(maxWidth);
      }
    };

    window.addEventListener('resize', updateWidth);
    updateWidth();

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const renderContent = () => {
    if (!result.value?.sections) {
      return null; // 没有sections数据时不渲染
    }

    return result.value.sections.map((section) => {
      switch (section.type) {
        case ReportDetailDataType.ImageText:
          return (
            <ReportDetailImageTextCell
              key={(section as ReportDetailCellModel).id}
              data={section as ReportDetailCellModel}
            />
          );
        case ReportDetailDataType.Image:
          return (
            <ReportDetailImageCell
              key={(section as ReportDetailImageModel).image}
              data={section as ReportDetailImageModel}
            />
          );
        case ReportDetailDataType.Chart:
          return (
            <ReportDetailChartCell
              data={section as ReportDetailChartModel}
              key={(section as ReportDetailChartModel).birthDate}
              userHoroscopeChartData={userHoroscopeChartData}
              chartWidth={chartWidth}
            />
          );
        case ReportDetailDataType.Space:
          return (
            <ReportDetailSpaceCell
              key={(section as ReportDetailSpaceModel).line}
              data={section as ReportDetailSpaceModel}
            />
          );
        default:
          return null;
      }
    });
  };

  const render = () => {
    if (result.loading) {
      return (
        <ReportContainer>
          <div className="loading">
            <CircularProgress
              size={32}
              sx={{
                color: 'white',
              }}
            />
            <span className="title">{t('common.loading')}</span>
          </div>
        </ReportContainer>
      );
    }

    if (result.error) {
      return (
        <ReportContainer>
          <div className="loading">{result.error?.message || t('invites.error')}</div>
        </ReportContainer>
      );
    }

    return (
      <ReportContainer>
        <Grid className="container">
          <div className="header">
            {result.value?.icon && <img src={result.value.icon} alt="" className="headerImage" />}
            <p className="title">{result.value?.iconTitle}</p>
            <p className="topic">{result.value?.title}</p>
            <p className="time">{result.value?.subtitle}</p>
          </div>
          <div className="content">{renderContent()}</div>
        </Grid>
      </ReportContainer>
    );
  };

  return <div>{render()}</div>;
}

export default ReportDetail;
