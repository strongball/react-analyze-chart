import moment from 'moment';

export interface DataTimeWithWeight {
  u: number;
  text: string;
  weight: DataTimeWeight;
}
enum DataTimeWeight {
  year,
  month,
  week,
  day,
  hour,
  minute15,
  minute,
}
const weightFormat: { [K in DataTimeWeight]: string } = {
  [DataTimeWeight.year]: 'YYYY',
  [DataTimeWeight.month]: 'MM',
  [DataTimeWeight.week]: 'DD',
  [DataTimeWeight.day]: 'DD',
  [DataTimeWeight.hour]: 'HH:mm',
  [DataTimeWeight.minute15]: 'HH:mm',
  [DataTimeWeight.minute]: 'HH:mm',
};

const weightOrder = [
  DataTimeWeight.year,
  DataTimeWeight.month,
  DataTimeWeight.week,
  DataTimeWeight.day,
  DataTimeWeight.hour,
  DataTimeWeight.minute15,
  DataTimeWeight.minute,
];

export function addWeight(datetimes: number[], res): DataTimeWithWeight[] {
  let prev = new Date(0);

  const data = datetimes.map((date) => new Date(date * 1000));

  const results: DataTimeWithWeight[] = [];

  for (const datetime of data) {
    let weight = DataTimeWeight.minute;
    if (prev.getFullYear() < datetime.getFullYear()) {
      weight = DataTimeWeight.year;
    } else if (prev.getMonth() < datetime.getMonth()) {
      weight = DataTimeWeight.month;
    } else if (prev.getDay() > datetime.getDay()) {
      weight = DataTimeWeight.week;
    } else if (prev.getDate() < datetime.getDate()) {
      weight = DataTimeWeight.day;
    } else if (prev.getHours() < datetime.getHours()) {
      weight = DataTimeWeight.hour;
    } else if (Math.floor(prev.getMinutes() / 15) != Math.floor(datetime.getMinutes() / 15)) {
      weight = DataTimeWeight.minute15;
    }
    results.push({
      u: datetime.getTime() / 1000,
      text: moment(datetime).format(weightFormat[weight]),
      weight: weight,
    });
    prev = datetime;
  }

  return results;
}

export function filterxAxisByWeight(datetimes: DataTimeWithWeight[], gap: number): DataTimeWithWeight[] {
  const workArray: (DataTimeWithWeight | null)[] = [...datetimes];

  for (const weight of weightOrder) {
    for (const [index, item] of workArray.entries()) {
      if (item == null) {
        continue;
      }
      if (item.weight == weight) {
        for (let i = index - 1; i > 0 && i > index - gap; i--) {
          workArray[i] = null;
        }
        for (let i = index + 1; i < workArray.length && i < index + gap; i++) {
          workArray[i] = null;
        }
      }
    }
  }
  return workArray.filter((item): item is DataTimeWithWeight => item !== null);
}
