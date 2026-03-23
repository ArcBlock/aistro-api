const lunarCalc = require("lunarphase-calculator");

const date = new Date(Date.now());

const currentPhaseWithASCII = lunarCalc.getFullLunarPhase(date);

// eslint-disable-next-line no-console
console.log(currentPhaseWithASCII);

/*
  Output:

        2022-07-18
      WANING_GIBBOUS

           ####.
         #######..
        ########...
        ########...
         #######..
           ####.
*/
