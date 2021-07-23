import { writable, Readable } from 'svelte/store';
import { hasAPIToken, getAPIToken, clearAPIToken } from '$lib/kabu_api';

type LoginState = 'init' | 'login' | 'logout';
  
function setLoginState(): Readable<LoginState> &
{
  initialize: () => Promise<void>,
  login: (apiPassword: string) => Promise<string>,
  logout: () => void,
} {
  const { subscribe, set } = writable<LoginState>('init');
  const initialize = async (): Promise<void> => {
    if (hasAPIToken()) {
      set('login');
    } else {
      set('logout');
    }
  };
  const logout = (): void => {
    clearAPIToken();
    set('logout');
  };
  const login = async (apiPassword: string): Promise<string> => {
    try {
      await getAPIToken(apiPassword);
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
  };
};

export const { initialize, login, logout, subscribe } = setLoginState();

