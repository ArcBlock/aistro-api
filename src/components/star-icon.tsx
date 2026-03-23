import SvgIcon from '@mui/material/SvgIcon';

import Ascendant from '../icons/stars/ascendant.svg?react';
import Jupiter from '../icons/stars/jupiter.svg?react';
import Mars from '../icons/stars/mars.svg?react';
import Mercury from '../icons/stars/mercury.svg?react';
import Moon from '../icons/stars/moon.svg?react';
import Neptune from '../icons/stars/neptune.svg?react';
import Saturn from '../icons/stars/saturn.svg?react';
import Sun from '../icons/stars/sun.svg?react';
import Uranus from '../icons/stars/uranus.svg?react';
import Venus from '../icons/stars/venus.svg?react';

function StarIcon({ star, ...rest }: { star: string }) {
  const mapSvg: {
    [key: string]: any;
  } = {
    ascendant: Ascendant,
    jupiter: Jupiter,
    mars: Mars,
    mercury: Mercury,
    moon: Moon,
    neptune: Neptune,
    saturn: Saturn,
    sun: Sun,
    uranus: Uranus,
    venus: Venus,
  };

  if (!mapSvg[star]) {
    return null;
  }

  return <SvgIcon component={mapSvg[star]} viewBox="0 0 16 16" style={{ width: '100%', height: '100%' }} {...rest} />;
}

export default StarIcon;
