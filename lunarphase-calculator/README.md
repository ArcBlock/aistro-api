# Lunar-Phase-Calculator

To install:
```console
$ npm i lunarphase-calculator -S
```
Then require it in your program:
```js
const lunarCalc = require("lunarphase-calculator");
```

## API
```js
lunarCalc.getLunarDay(Date);
```
Returns **lunar day** of specified or current `Date Object`.


```js
lunarCalc.getLunarPhase(lunarDay);
```
Returns **lunar phase** (`lunarCalc.phases`) of specified or current lunar day.


```js
lunarCalc.getLunarPhaseMonth(Date);
```
Returns an **array** of **lunar phases** (`lunarCalc.phases`) in specified or current month.


```js
lunarCalc.getFullLunarPhase(lunarDay);
```
Returns **lunar phase** (`lunarCalc.phases`) with simple **ASCII-art** of phase (`lunarCalc.ASCIIArts`) of specified or current lunar day.


```js
lunarCalc.toJDN(Date, isGrigorian);
```
Returns **Julian Date Number (JDN)** of specified or current `Date Object`. Second parameter is boolean, default is true.


```js
lunarCalc.fromJDN(jdn, isGrigorian);
```
Returns `[year, month, date]` of specified or current **JDN**. Second parameter is boolean, default is true.


```js
lunarCalc.drawASCII(lunarPhase);
```
Returns **ASCII-art** (`lunarCalc.ASCIIArts`) of specified or current lunar phase (`lunarCalc.phases`).


```js
lunarCalc.phases;
```
An Object of **lunar phases**.


```js
lunarCalc.ASCII-arts;
```
An object of **ASCII-arts** of lunar phases.