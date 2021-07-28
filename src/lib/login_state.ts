import { browser } from '$app/env';
import { writable, Readable } from 'svelte/store';
import { hasAPIToken, getAPIToken, clearAPIToken, getApiEnv as getApiEnvFromStorage} from '$lib/kabu_api';
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
    if (hasAPIToken()) {
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
    clearAPIToken();
    set('logout');
  };
  const login = async (apiPassword: string, apiEnv: ApiEnv): Promise<string> => {
    try {
      if (apiEnv !== 'mock' && apiPassword === '') {
        throw Error("APIパスワードが空です");
      }
      await getAPIToken(apiPassword, apiEnv);
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

