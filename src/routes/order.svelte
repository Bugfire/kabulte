<script lang="ts">
  import {
    MarginTradeTypeEnum,
    StockExchangeEnum,
    SideEnum,
    AccountTypeEnum,
    CashMarginEnum
  } from '$lib/api/common';
  import { primaryexchange, sendorderMargin, getSymbol } from '$lib/api/kabu_api';
  import type { SymbolDef } from '$lib/api/kabu_api';

  let error = '';
  let symbol = '';
  let qty = '';
  let password = '';
  let log: string[] = [];
  let exchange: StockExchangeEnum | null = null;
  let symbolDef: SymbolDef | null = null;
  let state: 'wait_1' | 'ready_1' | 'load_1' | 'wait_2' | 'ready_2' | 'load_2' | 'done' = 'wait_1';

  const addLog = (message: string) => {
    const now = new Date();
    const padding2 = (value: number) => `0${value}`.substr(-2);
    const timestamp = `${padding2(now.getHours())}:${padding2(now.getMinutes())}:${padding2(
      now.getSeconds()
    )}`;
    log = [...log, `${timestamp} ${message}`];
  };

  const onReset = async (): Promise<void> => {
    if (state === 'load_1' || state === 'load_2') {
      return;
    }
    error = '';
    exchange = null;
    symbolDef = null;
    state = 'wait_1';
    log = [];
  };

  const onPush1 = async (): Promise<void> => {
    if (state !== 'ready_1') {
      return;
    }
    try {
      onReset();
      state = 'load_1';
      addLog('クロス発注準備中...');
      exchange = await primaryexchange(symbol);
      symbolDef = await getSymbol(`${symbol}@${exchange}`);

      if (symbolDef.KCMarginBuy === false || symbolDef.KCMarginSell === false) {
        throw new Error('一般信用が利用できません');
      }
      if (parseInt(qty, 10) % symbolDef.TradingUnit !== 0) {
        throw new Error('売買単位が一致しません');
      }
      addLog('発注準備が完了しました');
      state = 'wait_2';
    } catch (e) {
      addLog(e.message);
      console.log(e);
      state = 'wait_1';
      error = e.message;
    }
  };

  const onPush2 = async (): Promise<void> => {
    if (state !== 'ready_2') {
      return;
    }
    try {
      state = 'load_2';
      addLog('発注中...');
      await sendorderMargin({
        Password: password,
        Symbol: symbol,
        Exchange: exchange,
        SecurityType: 1,
        Side: SideEnum.売,
        CashMargin: CashMarginEnum.新規,
        MarginTradeType: MarginTradeTypeEnum.一般信用長期,
        DelivType: 0,
        AccountType: AccountTypeEnum.特定,
        Qty: parseInt(qty, 10),
        FrontOrderType: 10, // 成行
        Price: 0,
        ExpireDay: 0
      });
      await sendorderMargin({
        Password: password,
        Symbol: symbol,
        Exchange: exchange,
        SecurityType: 1,
        Side: SideEnum.買,
        CashMargin: CashMarginEnum.新規,
        MarginTradeType: MarginTradeTypeEnum.一般信用長期,
        DelivType: 0,
        AccountType: AccountTypeEnum.特定,
        Qty: parseInt(qty, 10),
        FrontOrderType: 10, // 成行
        Price: 0,
        ExpireDay: 0
      });
      addLog('発注が完了しました');
      state = 'done';
    } catch (e) {
      addLog(e.message);
      console.log(e);
      state = 'ready_2';
      error = e.message;
    }
  };

  $: {
    switch (state) {
      case 'wait_1':
      case 'ready_1':
        if (symbol !== '' && qty !== '' && parseInt(qty, 10) > 0) {
          state = 'ready_1';
        } else {
          state = 'wait_1';
        }
        break;
      case 'wait_2':
      case 'ready_2':
        if (password !== '') {
          state = 'ready_2';
        } else {
          state = 'wait_2';
        }
    }
  }
</script>

<div class="order-container">
  <button class="gray-btn" on:click={onReset} disabled={state === 'load_1' || state === 'load_2'}
    >リセット</button
  >
  {#if error !== ''}
    <div class="error">{error}</div>
  {/if}
  <div class="box">
    <form class="form inputs1">
      <label
        >銘柄
        <input
          class="gray-input-text small"
          type="text"
          placeholder="1234"
          bind:value={symbol}
          disabled={state !== 'wait_1' && state !== 'ready_1'}
        />
      </label>
      <label
        >数量
        <input
          class="gray-input-text small"
          type="text"
          placeholder="100"
          bind:value={qty}
          disabled={state !== 'wait_1' && state !== 'ready_1'}
        />
      </label>
    </form>
    <button class="gray-btn" on:click={onPush1} disabled={state !== 'ready_1'}
      >クロス発注準備</button
    >
    {#if symbolDef !== null}
      <div class="detail_1">
        <div>
          <div>優先市場</div>
          <div>{StockExchangeEnum[exchange]}</div>
        </div>
        <div>
          <div>銘柄名称</div>
          <div>{symbolDef.SymbolName}</div>
        </div>
        <div>
          <div>売買単位</div>
          <div>{symbolDef.TradingUnit}</div>
        </div>
        <div>
          <div>一般信用買建</div>
          <div>{symbolDef.KCMarginBuy ? '可' : '-'}</div>
        </div>
        <div>
          <div>一般信用売建</div>
          <div>{symbolDef.KCMarginSell ? '可' : '-'}</div>
        </div>
      </div>
    {/if}
  </div>
  <div class="box">
    <form class="form inputs1">
      <label
        >パスワード
        <input
          class="gray-input-text large"
          type="password"
          placeholder="発注パスワード"
          bind:value={password}
          disabled={state !== 'wait_2' && state !== 'ready_2'}
        />
      </label>
    </form>
    <button class="gray-btn" on:click={onPush2} disabled={state !== 'ready_2'}>クロス発注</button>
  </div>
  <div class="box">
    <div>ログ</div>
    <div>
      {#each log as line}
        <div>{line}</div>
      {/each}
    </div>
  </div>
</div>

<style>
  .order-container {
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 20px;
    gap: 20px;
  }

  .box {
    min-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 2px solid #aaa;
    border-radius: 16px;
    padding: 16px;
    gap: 16px;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form > * {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 8px;
  }

  .detail_1 {
    font-size: 16px;
    line-height: 1.5;
  }

  .detail_1 > * {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .detail_1 > * > :nth-child(1) {
    font-size: 12px;
    width: 128px;
  }

  .detail_1 > * > :nth-child(2) {
    font-size: 16px;
    width: 240px;
  }

  .small {
    width: 128px;
  }

  .large {
    width: 320px;
  }

  .error {
    color: red;
    border-radius: 20px;
    padding: 20px;
    background: rgba(255, 0, 0, 0.1);
  }
</style>
