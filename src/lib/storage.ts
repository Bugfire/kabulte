/** sessionStorage が利用可能かどうか調べる */
const isSessionStorageAvailable = (): boolean => {
  try {
    const __storage_test__ = '__storage_test__';
    sessionStorage.setItem(__storage_test__, __storage_test__);
    const value = sessionStorage.getItem(__storage_test__);
    return value === __storage_test__;
  } catch {
    return false;
  }
};

/** Cookie を検索し、見つかれば string、見つからなければ null を返す */
const getCookie = (key: string): string | null => {
  const encodedKey = encodeURIComponent(key);
  const keyValue = document.cookie
    .split(';')
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
    .map((v) => v.split('=').map((vv) => vv.trim()))
    .filter((v) => v.length == 2)
    .find((v) => v[0] === encodedKey);
  if (keyValue === undefined) {
    return null;
  }
  return decodeURIComponent(keyValue[1]);
};

/** Cookie を設定する */
const setCookie = (key: string, value: string): void => {
  document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
};

/** 値を取得する */
const getValue = (key: string): string | null => {
  if (isSessionStorageAvailable()) {
    return sessionStorage.getItem(key);
  } else {
    return getCookie(key);
  }
};

/** 値を設定する */
const setValue = (key: string, value: string): void => {
  if (isSessionStorageAvailable()) {
    sessionStorage.setItem(key, value);
  } else {
    setCookie(key, value);
  }
};

export { getValue, setValue };
