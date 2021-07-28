<script lang="ts">
  import { onDestroy } from 'svelte';
  import { browser } from '$app/env';
  import { walletCash, walletMargin } from '$lib/api/kabu_api';
  import { subscribe, logout } from '$lib/login_state';
  import { localeNumber } from '$lib/format';

  let state: '' | 'ロード中' | 'ready' = '';
  let walletCashValue: number | undefined = undefined;
  let walletMarginValue: number | undefined = undefined;

  const reload = async () => {
    if (!browser) {
      return;
    }
    try {
      state = 'ロード中';
      {
        walletCashValue = await walletCash();
        console.log(walletCashValue);
      }
      {
        walletMarginValue = await walletMargin();
        console.log(walletMarginValue);
      }
      state = 'ready';
    } catch {
      logout();
    }
  };

  const unsubscribe = subscribe(value => {
    switch (value) {
      case 'login':
        reload();
        break;
      default:
        state = '';
        break;
    }
  });
  onDestroy(unsubscribe);
</script>

<svelte:head>
	<title>Kabulte</title>
</svelte:head>

<div class="container">
  {#if state === 'ready'}
    <div>
      <div class="name">取引余力(現物)</div>
      <div class="value">{walletCashValue ? localeNumber(walletCashValue) + '円' : ''}</div>
    </div>
    <div>
      <div class="name">信用新規可能額</div>
      <div class="value">{walletMarginValue ? localeNumber(walletMarginValue) + '円' : ''}</div>
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
  }

  .container > * {
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }

  .name {
    display: flex;
    justify-content: flex-start;
    color: #888;
    font-size: 20px;
    width: 200px;
  }

  .value {
    display: flex;
    justify-content: flex-end;
    color: black;
    font-size: 24px;
    width: 200px;
  }
</style>
