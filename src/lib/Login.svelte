<script lang="ts">
  import { browser } from '$app/env';
  import { onDestroy } from 'svelte';
  import type { SetupWorkerApi } from 'msw';
  import { setupWorker } from 'msw';
  import { initialize, login, subscribe, getApiEnv } from '$lib/login_state';
  import { handlers } from '$lib/__mock__';

  let show = false;
  let loading = false;
  let apiPassword = '';
  let apiEnv = getApiEnv();
  let error = '';
  let mockServiceWorker: SetupWorkerApi | null = null;

  $: {
    if (browser) {
      if (show) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  initialize();

  const unsubscribe = subscribe(value => {
    switch (value) {
      case 'login':
      case 'init':
        show = false;
        break;
      case 'logout':
        show = true;
        break;
    }
  });
  onDestroy(unsubscribe);

  const onLogin = async () => {
    if (apiEnv === 'mock') {
      if (mockServiceWorker === null) {
        mockServiceWorker = setupWorker(...handlers);
        mockServiceWorker.start();
      }
    } else if (mockServiceWorker !== null) {
      mockServiceWorker.stop();
      mockServiceWorker = null;
    }
    error = '';
    loading = true;
    try {
      const message = await login(apiPassword, apiEnv);
      apiPassword = '';
      loading = false;
      error = message;
    } catch (e) {
      apiPassword = '';
      loading = false;
      error = e.message;
    }
  };
  const onClear = () => {
    apiPassword = '';
    apiEnv = 'prod';
    error = '';
  };
</script>

<div class="login-background {show ? "modal-show" : "modal-hide"}">
  <div class="login-container">
    <div class="login">
      <h1>ログイン</h1>
      <div class="inputs">
        <form>
          <div class="input-radio">
            <label>
              <input type=radio name="api_host" value="prod" disabled={loading} bind:group={apiEnv} />
              本番
            </label>
            <label>
              <input type=radio name="api_host" value="dev" disabled={loading} bind:group={apiEnv} />
              開発
            </label>
            <label>
              <input type=radio name="api_host" value="mock" disabled={loading} bind:group={apiEnv} />
              モック
            </label>
          </div>
          <label class="input-text">API Key
            <input placeholder="API Key" type=password bind:value={apiPassword} disabled={loading || apiEnv === 'mock'} />
          </label>
        </form>
        {#if error !== ''}
          <div class="error">{error}</div>
        {/if}
        <button class="green-btn" on:click={onLogin} disabled={loading}>ログイン</button>
        <button class="gray-btn" on:click={onClear} disabled={loading}>クリア</button>
      </div>
    </div>
  </div>
</div>

<style>
.login-background {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  height: 100%;
  visibility: visible;
  transition: opacity .4s, visibility .3s;
  background-color: rgba(32, 32, 32, .4);
}

.modal-show {
  opacity: 1;
  visibility: visible;
  transition: opacity .3s, visibility .3s;
}

.modal-hide {
  opacity: 0;
  visibility: hidden;
  transition: opacity .3s, visibility .3s;
}

.login-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 240px;
  background: #fafafa;
  border-radius: 10px;
  border-width: 0;
  box-shadow: 0 0 16px rgba(0, 0, 0, .5);
}

.login {
  padding: 20px 20px;
  font-size: 18px;
}

.inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  text-align: center;
}

label {
  font-size: 14px;
  font-weight: 700;
  color: #888;
  display: flex;
  flex-direction: column;
}

input {
  border: 2px solid #ccc;
  font-size: 18px;
  padding: 8px;
}

input::placeholder {
  opacity: 0.5;
}

.error {
  color: red;
  border-radius: 20px;
  padding: 20px;
  background: rgba(255, 0, 0, 0.1);
}

.input-text > input {
  border-color: #888;
}

.input-text > input:disabled {
  border-color: #eee;
}

.input-radio {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  gap: 12px;
}

.input-radio > label {
  line-height: 1.2;
}

.input-radio > label > input {
  transform: scale(2);
}

.input-radio > * {
  gap: 12px;
}

.input-radio * {
  font-size: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  align-items: center;
  margin: 0;
}
</style>
