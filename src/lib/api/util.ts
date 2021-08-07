import { getValue, setValue } from '$lib/storage';
import type { ApiEnv } from '$lib/const';
import { getApiHost } from '$lib/const';

/** 以下SessionStore/Cookie に保持する時のキー */

/** API Token */
const API_TOKEN_KEY = 'API_TOKEN';
/** API Env */
const API_ENV_KEY = 'API_ENV';

const objectToParams = (object: Record<string, unknown>): Record<string, string> => {
  const r: Record<string, string> = {};
  Object.keys(object).forEach((key) => {
    r[key] = `${object[key]}`;
  });
  return r;
};

/** API Host を取得する */
const getApiEnv = (): ApiEnv => {
  const apiEnv = getValue(API_ENV_KEY);
  switch (apiEnv) {
    default:
    case 'prod':
      return 'prod';
    case 'dev':
      return 'dev';
    case 'mock':
      return 'mock';
  }
};

/** APIトークンを保持しているか返す。有効かどうかは使ってみないとわからない */
const hasApiToken = (): boolean => {
  const apiKey = getValue(API_TOKEN_KEY);
  return apiKey !== null && apiKey !== '';
};

/** APIトークンを削除する */
const clearApiToken = (): void => {
  setValue(API_TOKEN_KEY, '');
};

/** APIトークンを取得します */
const getApiToken = (): string => {
  const apiToken = getValue(API_TOKEN_KEY);
  if (apiToken === null || apiToken === '') {
    throw new Error('APIトークンが未設定です');
  }
  return apiToken;
};

/** API の URL prefix を取得する */
const baseUrl = (): string => {
  return `${getApiHost(getApiEnv())}/kabusapi`;
};

export {
  objectToParams,
  baseUrl,
  getApiEnv,
  hasApiToken,
  clearApiToken,
  getApiToken,
  API_TOKEN_KEY,
  API_ENV_KEY
};
