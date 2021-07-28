import { browser } from '$app/env';
import { writable, Readable } from 'svelte/store';
import { hasAPIToken, getAPIToken, clearAPIToken, getAPIHost } from '$lib/kabu_api';
import { MOCK_HOST } from '$lib/const';

type LoginState = 'init' | 'login' | 'logout';

const setLoginState = (): Readable<LoginState> &
{
  initialize: () => Promise<void>,
  login: (apiPassword: string, apiHost: string) => Promise<string>,
  logout: () => void,
  getHost: () => string,
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
  const getHost = (): string => {
    if (!browser) {
      return '';
    }
    return getAPIHost();
  };
  const logout = (): void => {
    clearAPIToken();
    set('logout');
  };
  const login = async (apiPassword: string, apiHost: string): Promise<string> => {
    try {
      if (apiHost === '') {
        throw Error("APIホストが空です");
      }
      if (apiHost !== MOCK_HOST && apiPassword === '') {
        throw Error("APIパスワードが空です");
      }
      await getAPIToken(apiPassword, apiHost);
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
    getHost,
  };
};

export const { initialize, getHost, login, logout, subscribe } = setLoginState();

