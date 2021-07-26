<script lang="ts">
  import { onDestroy } from 'svelte';
  import { browser } from '$app/env';
  import type { Position } from '$lib/kabu_api';
  import { subscribe } from '$lib/login_state';

  let state: '-' | 'ロード中' | 'ready' = '-';

  const reload = async () => {
    if (!browser) {
      return;
    }
  };

  const unsubscribe = subscribe(value => {
    switch (value) {
      case 'login':
        reload();
        break;
      default:
        state = '-';
        break;
    }
  });
  onDestroy(unsubscribe);
</script>

<svelte:head>
	<title>Kabulte</title>
</svelte:head>

<div class="container">
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    align-content: center;
    justify-content: center;
    align-items: center;
  }
</style>
