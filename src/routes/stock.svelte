<script lang="ts">
  import { onDestroy } from 'svelte';
  import { browser } from '$app/env';
  import type { Position現物 } from '$lib/kabu_api';
  import { positions, ProductEnum } from '$lib/kabu_api';
  import { subscribe, logout } from '$lib/login_state';
  import PositionStockHeader from '$lib/components/PositionStockHeader.svelte';
  import PositionStockItem from '$lib/components/PositionStockItem.svelte';

  let state: '-' | 'ロード中' | 'ready' = '-';
  let positionList: Position現物[][] = [];

  const reload = async () => {
    if (!browser) {
      return;
    }
    try {
      state = 'ロード中';
      const positionListRaw = (await positions({ product: ProductEnum.現物 })) as Position現物[];
      const numPages = Math.trunc((positionListRaw.length + 9) / 10);
      positionList = [];
      for (let i = 0; i < numPages; i++) {
        positionList.push(positionListRaw.slice(i * 10, i * 10 + 10));
      }
      console.log(positionList);
      state = 'ready';
    } catch (e) {
      logout();
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
	<title>現物株式</title>
</svelte:head>

<div class="container">
  <button class="gray-btn" on:click={reload}>更新</button> 

  {#if state === 'ready' && positionList.length === 0}
    <div class="message">データ無し</div>
  {:else if state === 'ready'}
    <div class="holdings-container">
      {#each positionList as list}
        <div class="list">
          <PositionStockHeader />
          {#each list as position}
            <PositionStockItem position={position} />
          {/each}
        </div>
      {/each}
    </div>
  {:else}
    <div class="message">{state}</div>
  {/if}
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

  .holdings-container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    max-width: 1024px;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background-color: #eee;
    padding: 4px;
  }
</style>
