/** LocaleString (3桁カンマ区切り等) */
const localeNumber = (value: number): string => {
  return value.toLocaleString();
};

/** LocaleString (3桁カンマ区切り等) */
const localeNumberIfNotZero = (value: number): string => {
  return value !== 0 ? value.toLocaleString() : '';
};

/** 符号付き LocaleString (3桁カンマ区切り等) */
const signedNumber = (value: number): string => {
  return (value > 0 ? '+' : '') + value.toLocaleString();
};

/** 符号付き LocaleString (3桁カンマ区切り等) */
const signedNumberRatio = (value: number): string => {
  return (value > 0 ? '+' : '') + value.toFixed(1);
};

/** 数字による日付を文字列に変換 */
const formatDate = (value: number): string => {
  const strValue = `${value}`;
  return `${strValue.substr(0, 4)}-${strValue.substr(4, 2)}-${strValue.substr(6, 2)}`;
};

export { localeNumber, localeNumberIfNotZero, signedNumber, signedNumberRatio, formatDate };
