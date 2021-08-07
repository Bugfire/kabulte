<script lang="ts">
  import { onDestroy } from 'svelte';
  import { browser } from '$app/env';
  import { ProductEnum } from '$lib/api/common';
  import type { Position信用 } from '$lib/api/positions';
  import { positions } from '$lib/api/positions';
  import type { Order信用 } from '$lib/api/orders';
  import { orders } from '$lib/api/orders';
  import { subscribe, logout } from '$lib/login_state';
  import OrderMarginHeader from '$lib/components/OrderMarginHeader.svelte';
  import OrderMarginItem from '$lib/components/OrderMarginItem.svelte';
  import PositionMarginHeader from '$lib/components/PositionMarginHeader.svelte';
  import PositionMarginItem from '$lib/components/PositionMarginItem.svelte';

  let state: '' | 'ロード中' | 'ready' = '';
  let orderList: Order信用[][] = [];
  let positionList: Position信用[][] = [];

  const reload = async () => {
    if (!browser) {
      return;
    }
    try {
      state = 'ロード中';
      orderList = [];
      positionList = [];
      {
        const orderListRaw = (await orders({ product: ProductEnum.信用 })) as Order信用[];
        const numPages = Math.trunc((orderListRaw.length + 9) / 10);
        orderList = [];
        for (let i = 0; i < numPages; i++) {
          orderList.push(orderListRaw.slice(i * 10, i * 10 + 10));
        }
        console.log(orderList);
      }
      {
        const positionListRaw = (await positions({ product: ProductEnum.信用 })) as Position信用[];
        const numPages = Math.trunc((positionListRaw.length + 9) / 10);
        positionList = [];
        for (let i = 0; i < numPages; i++) {
          positionList.push(positionListRaw.slice(i * 10, i * 10 + 10));
        }
        console.log(positionList);
      }
      state = 'ready';
    } catch {
      logout();
    }
  };

  const unsubscribe = subscribe((value) => {
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
  <title>信用建玉</title>
</svelte:head>

<div class="container">
  {#if state === 'ready' && positionList.length === 0 && orderList.length === 0}
    <div class="message">データ無し</div>
  {:else if state === 'ready'}
    <div class="holdings-container">
      {#each orderList as list}
        <div class="list">
          <OrderMarginHeader />
          {#each list as order}
            <OrderMarginItem {order} />
          {/each}
        </div>
      {/each}
    </div>
    <div class="holdings-container">
      {#each positionList as list}
        <div class="list">
          <PositionMarginHeader />
          {#each list as position}
            <PositionMarginItem {position} />
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
