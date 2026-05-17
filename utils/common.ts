export const uuid = (a?: number): string => {
  if (a != null) {
    return (a ^ ((Math.random() * 16) >> (a / 4))).toString(16);
  } else {
    // eslint-disable-next-line
    //@ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
  }
};

export const toSlug = (value: string) => {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const formatNumber = (
  value?: number | null,
  options?: {
    digit?: number;
    offsetRate?: number;
    toFixed?: boolean;
    failoverValue?: string;
    isSkipRound?: boolean;
    floor?: boolean;
    showPlusPrefix?: boolean;
  },
) => {
  const { digit, offsetRate, toFixed, failoverValue, isSkipRound, floor, showPlusPrefix } = options ?? {};
  if (value == null || isNaN(value)) {
    return failoverValue ?? '0';
  }

  let data = value;

  if (offsetRate != null) {
    data = value / offsetRate;
  }

  let tempValueString = data.toString();
  let prefix = showPlusPrefix ? '+' : '';

  if (tempValueString.startsWith('-')) {
    prefix = '-';
    tempValueString = tempValueString.substring(1, tempValueString.length);
  }

  try {
    const tempValue = Number(tempValueString);
    const fractionDigit = digit ?? 0;

    let mainNum = Number(`${Number(tempValue.toString())}e+${fractionDigit}`);
    if (!isSkipRound) {
      mainNum = floor ? Math.floor(mainNum) : Math.round(mainNum);
    }

    if (fractionDigit > 0) {
      const temp = +`${mainNum}e-${fractionDigit}`;
      let fractionString = '';
      let i = '';
      if (toFixed) {
        i = temp.toFixed(fractionDigit);
        fractionString = i.substring(i.indexOf('.'), i.length);
        i = i.substring(0, i.indexOf('.'));
        return prefix + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + fractionString;
      }

      i = temp.toString();
      if (temp.toString().indexOf('.') >= 1) {
        fractionString = temp.toString().substring(temp.toString().indexOf('.'), temp.toString().length);
        i = temp.toString().substring(0, temp.toString().indexOf('.'));
      }
      return prefix + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + fractionString;
    }

    const temp = +`${mainNum}e-${fractionDigit}`;
    const i = temp.toString();
    return prefix + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } catch {
    return '';
  }
};
