import { browser } from '$app/env';
import { writable, Readable } from 'svelte/store';
import { hasApiToken, clearApiToken, getApiEnv as getApiEnvFromStorage } from '$lib/api/util';
import { generateToken } from '$lib/api/kabu_api';
import type { ApiEnv } from '$lib/const';

type LoginState = 'init' | 'login' | 'logout';

const setLoginState = (): Readable<LoginState> &
{
  initialize: () => Promise<void>,
  login: (apiPassword: string, apiHost: string) => Promise<string>,
  logout: () => void,
  getApiEnv: () => ApiEnv,
} => {
  const { subscribe, set } = writable<LoginState>('init');
  const initialize = async (): Promise<void> => {
    if (!browser) {
      return;
    }
    if (hasApiToken()) {
      set('login');
    } else {
      set('logout');
    }
  };
  const getApiEnv = (): ApiEnv => {
    if (!browser) {
      return 'prod';
    }
    return getApiEnvFromStorage();
  };
  const logout = (): void => {
    clearApiToken();
    set('logout');
  };
  const login = async (apiPassword: string, apiEnv: ApiEnv): Promise<string> => {
    try {
      if (apiEnv !== 'mock' && apiPassword === '') {
        throw Error("APIパスワードが空です");
      }
      await generateToken(apiPassword, apiEnv);
    } catch (e) {
      set('logout');
      return e.message;
    }
    set('login');
    return '';
  };
  return {
    initialize,
    login,
    logout,
    subscribe,
    getApiEnv,
  };
};

export const { initialize, getApiEnv, login, logout, subscribe } = setLoginState();

