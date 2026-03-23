import styled from '@emotion/styled';
// import { Horoscope, Origin } from 'circular-natal-horoscope-js/dist';
import { useEffect } from 'react';

import { HoroscopeChartData } from '../../api/src/store/models/user';
import useWidth from '../hooks/use-width';
// import { getDateTime } from '../libs/utils';
import Square from './square';

const Container = styled(Square)`
  position: relative;

  .chart {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 100%;
    overflow: hidden;
    display: flex;

    svg {
      background: #161548;
    }
  }

  #chart-aistro-radix-planets,
  #chart-aistro-transit-planets {
    animation: rotate-2 1.5s ease-in-out 1;
    transform-origin: center;
    animation-delay: 500ms;
  }

  #chart-aistro-radix-signs {
    animation: rotate 1.5s ease-in-out 1;
    transform-origin: center;
    animation-delay: 500ms;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes rotate-2 {
    0% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;

// const getChartData = (horoscope: HoroscopeType) => {
// //   const allBodies: {
// //     key: string;
// //     Sign: { key: string };
// //     House: { id: number; Sign: { key: string } };
// //     isRetrograde?: true;
// //     ChartPosition: any;
// //   }[] = horoscope.CelestialBodies.all;

// //   const allPoints: {
// //     key: string;
// //     Sign: { key: string };
// //     House: { id: number; Sign: { key: string } };
// //     isRetrograde?: true;
// //     ChartPosition: any;
// //   }[] = horoscope.CelestialPoints.all;

// //   // 月亮:  Moon
// //   // 金星:  Venus
// //   // 木星:  Jupiter
// //   // 北交:  NNode
// //   // 火星:  Mars
// //   // 莉莉丝: Lilith
// //   // 土星:  Saturn
// //   // 凯龙:  Chiron
// //   // 天王星: Uranus
// //   // 太阳:  Sun
// //   // 水星:  Mercury
// //   // 海王星: Neptune
// //   // 冥王星:  Pluto
// //   const planets = Object.assign(
// //     {},
// //     ...allBodies
// //       .concat(allPoints)
// //       .filter((body) => !['sirius', 'southnode'].includes(body.key))
// //       .map((body) => {
// //         const key = body.key === 'northnode' ? 'NNode' : body.key.charAt(0).toUpperCase() + body.key.slice(1);
// //         const speed = horoscope.Ephemeris[body.key]?.motion?.oneSecondMotionAmount;
// //         const value = [body.ChartPosition.Ecliptic.DecimalDegrees];
// //         if (speed !== undefined) value.push(speed);
// //         return { [key]: value };
// //       })
// //   );

// //   const cusps = horoscope.Houses.map((cusp: any) => {
// //     return cusp.ChartPosition.StartPosition.Ecliptic.DecimalDegrees;
// //   });

// //   const data = {
// //     planets,
// //     cusps,
// //   };

// //   return data;
// // };

function AstroChart({ width, user, match }: { width: number; user?: HoroscopeChartData; match?: HoroscopeChartData }) {
  const winWidth = useWidth();

  const init = async () => {
    try {
      const dataRadix = user;
      const margin = Math.ceil(width / 100) * 10 + 10;
      const scale = Math.max(width / winWidth, 0.6);

      if (match) {
        const dataTransit = match;

        const chart = new (window as any).astrology.Chart('chart', width, width, {
          MARGIN: margin,
          SYMBOL_SCALE: scale,
        });

        chart.radix(dataRadix).transit(dataTransit).aspects();
      } else {
        const chart = new (window as any).astrology.Chart('chart', width, width, { SYMBOL_SCALE: scale });

        chart.radix(dataRadix).aspects();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  return (
    <Container>
      <div id="chart" className="chart" />
    </Container>
  );
}

export default AstroChart;
