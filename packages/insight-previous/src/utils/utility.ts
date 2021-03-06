import Big from 'big.js';
const deciRegExp = /^-?\d*(\.)?\d+$/;
export const setIntervalSynchronous = (func, delay) => {
  // tslint:disable-next-line: one-variable-per-declaration
  let intervalFunction, timeoutId, clear;
  clear = () => {
    clearTimeout(timeoutId);
  };
  intervalFunction = () => {
    func();
    timeoutId = setTimeout(intervalFunction, delay);
  };
  timeoutId = setTimeout(intervalFunction, delay);
  return clear;
};

export const roundingDown = (val: string | number) => {
  if(isNaN(parseFloat(String(val)))) {
    return val;
  }
  return new Big(val).round(2, 0).toString();
};
