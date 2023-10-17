import moment from 'moment';
import { hourInterval, minInterval, dayInterval, weekInterval, monthInterval } from './resolution';

export const GRID_LINE_WIDTH_DEFAULT = 82;
const VERTICAL_WEIGHT_HOUR_MIN = -2;
const VERTICAL_WEIGHT_HOUR = 0;
const VERTICAL_WEIGHT_DAY = 2;
const VERTICAL_WEIGHT_WEEK = 4;
const VERTICAL_WEIGHT_MONTH = 6;
const VERTICAL_WEIGHT_YAER = 8;

const allIntervals = [...minInterval, ...hourInterval, ...dayInterval, ...weekInterval, ...monthInterval];
const isHourInterval = (resolution) => hourInterval.includes(resolution);
const isMiInterval = (resolution) => minInterval.includes(resolution);
const isMonthInterval = (resolution) => monthInterval.includes(resolution);

// as move left or move right the chart
// xAxis Value will change so frequently and we don't want it always changes
// so adding weight if currentXaxisValue if it is exist in prevAxisValues
export const getPersistentXAxis = (timeAxis, prevTimeAxis) => {
  let prevTimeAxisIndex = 0;
  return timeAxis.map(([curDomain, curTimeStamp, curDate, curweight]) => {
    while (prevTimeAxisIndex < prevTimeAxis.length) {
      if (curTimeStamp < prevTimeAxis[prevTimeAxisIndex][1]) {
        break;
      } else if (curTimeStamp === prevTimeAxis[prevTimeAxisIndex][1]) {
        prevTimeAxisIndex = prevTimeAxisIndex + 1;
        return [curDomain, curTimeStamp, curDate, curweight + 1];
      } else {
        prevTimeAxisIndex = prevTimeAxisIndex + 1;
      }
    }

    return [curDomain, curTimeStamp, curDate, curweight];
  });
};

// removing xAxis if there is not enough width from high weight to low graudually
export const filterxAxisByWeight = (axis, gridLineGap) => {
  const axisWeightSet = new Set();
  const timeAxis = axis;

  timeAxis.forEach(({ priority }) => {
    axisWeightSet.add(priority);
  });

  const sortedWeight = Array.from(axisWeightSet).sort((a, b) => b - a);

  sortedWeight.forEach((targetWeight) => {
    function removeItemByIndex(index) {
      if (timeAxis[index]) {
        const { priority: curweight } = timeAxis[index];
        const curDomain = index;
        if (curweight === targetWeight) {
          let leftIndex = index - 1;
          const leftEnd = Math.max(0, curDomain - gridLineGap);

          while (leftIndex >= leftEnd) {
            if (timeAxis[leftIndex]) {
              const { priority: leftWeight } = timeAxis[leftIndex];
              // if distance between current and left xAxis is below gridLineGap
              // remove vertical which weight is lower
              if (leftWeight <= curweight) {
                timeAxis[leftIndex] = null;
              }
            }
            leftIndex = leftIndex - 1;
          }

          let rightIndex = index + 1;
          const rightEnd = Math.min(curDomain + gridLineGap, timeAxis.length - 1);
          while (rightIndex <= rightEnd) {
            if (timeAxis[rightIndex]) {
              const { priority: rightWeight } = timeAxis[rightIndex];
              if (rightWeight <= curweight) {
                timeAxis[rightIndex] = null;
              }
            }
            rightIndex = rightIndex + 1;
          }
        }
      }
    }

    if (timeAxis.length > 2) {
      let index = 0;
      while (index < timeAxis.length) {
        removeItemByIndex(index);
        index = index + 1;
      }
    }
  });
  return timeAxis.filter((value) => value);
};

const getXAxisValuesByYearMonthDay = (xAxisValues) => {
  const sortedXAxisValues = xAxisValues
    .filter((value) => value && value[1])
    .sort((a, b) => {
      const aTimeStamp = a[1];
      const bTimeStamp = b[1];
      return aTimeStamp - bTimeStamp;
    });

  const xAxisValuesByYearMonthDay = {};
  // handling xAxisValues by year, month and day, the result will look like
  //  year  month    day                               day      day
  // {2022: {  1:  { 1: [xAxisValues,xAxisValues,...]},2:{...}],3:{...}}}
  sortedXAxisValues.forEach(([domain, timeStamp]) => {
    const timeUnix = moment.unix(timeStamp);
    const timeYYYY = timeUnix.format('YYYY');
    const timeMM = timeUnix.format('MM');
    const timeDD = timeUnix.format('DD');
    if (!xAxisValuesByYearMonthDay[timeYYYY]) {
      xAxisValuesByYearMonthDay[timeYYYY] = {};
    }

    if (!xAxisValuesByYearMonthDay[timeYYYY][timeMM]) {
      xAxisValuesByYearMonthDay[timeYYYY][timeMM] = {};
    }

    if (!xAxisValuesByYearMonthDay[timeYYYY][timeMM][timeDD]) {
      xAxisValuesByYearMonthDay[timeYYYY][timeMM][timeDD] = [];
    }

    xAxisValuesByYearMonthDay[timeYYYY][timeMM][timeDD].push([domain, timeStamp]);
  });
  return xAxisValuesByYearMonthDay;
};

/**
 * @param {number[]} _xAxisValues
 * @param {string} resolution
 * @returns {{u: number, text: string, priority:number }[]}
 */
export function getTimeAxisWithDateAndWeight(_xAxisValues, resolution) {
  const xAxisValues = _xAxisValues.map((d, i) => [i, d]);
  const xAxisValuesByYearMonthDay = getXAxisValuesByYearMonthDay(xAxisValues);
  const xAxisByYear = Object.entries(xAxisValuesByYearMonthDay);
  let timeAxis = [];

  xAxisByYear.forEach(([, xAxisCurYear]) => {
    const sortedXAxisByMonth = Object.entries(xAxisCurYear).sort(([aKey], [bKey]) => aKey - bKey);

    sortedXAxisByMonth.forEach(([, xAxisCurMonth], monthIndex) => {
      const isFirstDayAlreadInByWeek = {};
      const sortedXAxisByDay = Object.entries(xAxisCurMonth).sort(([aKey], [bKey]) => aKey - bKey);

      sortedXAxisByDay.forEach(([, xAxisCurDay], dayIndex) => {
        // handling year and month level
        const addingMonthOrYear = () => {
          const isFirstDayofMonth = dayIndex === 0;
          if (isFirstDayofMonth) {
            const isFirstMonth = monthIndex === 0;
            const [domain, currentTimeStamp] = xAxisCurDay[0];
            const timeUnix = moment.unix(currentTimeStamp);
            timeAxis.push([
              domain,
              currentTimeStamp,
              isFirstMonth ? timeUnix.format('YYYY') : timeUnix.format('MMM'),
              isFirstMonth ? VERTICAL_WEIGHT_YAER : VERTICAL_WEIGHT_MONTH,
            ]);
          }
        };

        const addingWeekDayHour = () => {
          xAxisCurDay.forEach(([curDomain, curTimeStamp], hourIndex) => {
            const curDayTimeUnix = moment.unix(curTimeStamp);
            const curDayWW = curDayTimeUnix.format('WW');
            const isFirstDayInWeek = !isFirstDayAlreadInByWeek[curDayWW];

            if (isFirstDayInWeek) {
              isFirstDayAlreadInByWeek[curDayWW] = true;
              return timeAxis.push([curDomain, curTimeStamp, curDayTimeUnix.format('DD'), VERTICAL_WEIGHT_WEEK]);
            }

            const isFirstHourThisDay = hourIndex === 0;
            if (isFirstHourThisDay) {
              return timeAxis.push([curDomain, curTimeStamp, curDayTimeUnix.format('DD'), VERTICAL_WEIGHT_DAY]);
            }

            if (isHourInterval(resolution) || isMiInterval(resolution)) {
              const curDaymm = curDayTimeUnix.format('mm');
              const isEachFiveMin = curDaymm % 5 === 0;
              if (isEachFiveMin) {
                return timeAxis.push([curDomain, curTimeStamp, curDayTimeUnix.format('HH:mm'), VERTICAL_WEIGHT_HOUR]);
              } else {
                return timeAxis.push([
                  curDomain,
                  curTimeStamp,
                  curDayTimeUnix.format('HH:mm'),
                  VERTICAL_WEIGHT_HOUR_MIN,
                ]);
              }
            }
          });
        };

        addingMonthOrYear();
        if (!isMonthInterval(resolution)) {
          addingWeekDayHour();
        }
      });
    });
  });
  return timeAxis.map(([_, u, text, p]) => ({
    u: u,
    text: text,
    priority: p,
  }));
}
