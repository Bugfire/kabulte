<script lang="ts">
  import { onDestroy } from 'svelte';
  import { browser } from '$app/env';
  import { initialize, login, subscribe } from '$lib/login_state';

  let show = false;
  let apiPassword = '';
  let error = '';

  if (browser) {
    initialize();
  }

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
    const p = apiPassword;
    apiPassword = '';
    const message = await login(p);
    error = message;
  };
  const onClear = () => {
    apiPassword = '';
  };
</script>

<div class="login-background {show ? "modal-show" : "modal-hide"}">
  <div class="login-container">
    <div class="login">
      <h1>ログイン</h1>
      <div class="inputs">
        <form>
          <label>API Key
            <input placeholder="API Key" type="password" bind:value={apiPassword} />
          </label>
        </form>
        <div class="error">{error}</div>
        <button class="green-btn" on:click={onLogin}>ログイン</button>
        <button class="gray-btn" on:click={onClear}>クリア</button>
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
}

input {
  width: 100%;
  border: 2px solid #ccc;
  font-size: 18px;
  padding: 8px;
}

input::placeholder {
  opacity: 0.5;
}

.error {
  color: red;
}
</style>
