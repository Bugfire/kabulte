<script lang="ts">
  import type { Order信用 } from '$lib/api/orders';
  import { SideEnumRev, MarginTradeTypeEnum, AccountTypeEnum } from '$lib/api/common';
  import { OrderStateEnum, DetalStateEnum, OrderTypeEnum, RecTypeEnum } from '$lib/api/orders';
  import { CashMarginEnum } from '$lib/api/kabu_api';
  import { localeNumberIfNotZero, formatDate } from '$lib/format';

  export let order: Order信用;
</script>

<div>
  <div class="order">
    <div class="name">
      <div>{order.Symbol} {order.ExchangeName} {AccountTypeEnum[order.AccountType]}</div>
      <div>{order.SymbolName}</div>
    </div>
    <div class="margin">
      <div>{CashMarginEnum[order.CashMargin]}</div>
      <div>{MarginTradeTypeEnum[order.MarginTradeType]}</div>
    </div>
    <div class="side">{SideEnumRev[order.Side]}</div>
    <div class="price">{localeNumberIfNotZero(order.Price)}</div>
    <div class="order_qty">
      <div>{order.CumQty}</div>
      <div>{order.OrderQty}</div>
    </div>
    <div class="expire_day">{formatDate(order.ExpireDay)}</div>
    <div class="order_state">{OrderStateEnum[order.OrderState]}</div>
    <div class="margin_premium">
      {typeof order.MarginPremium === 'number' ? order.MarginPremium + '円' : ''}
    </div>
  </div>
  {#if order.Details.length > 0}
    <details>
      <summary>詳細</summary>
      {#each order.Details as detail}
        <div class="order">
          <div class="detail_indent" />
          <div class="detail_item">{RecTypeEnum[detail.RecType]}</div>
          <div class="detail_item">{DetalStateEnum[detail.State]}</div>
          <div class="detail_item">
            <div>数量</div>
            <div>{detail.Qty}</div>
          </div>
          <div class="detail_item">
            {#if detail.Price}
              <div>値段</div>
              <div>{detail.Price}円</div>
            {/if}
          </div>
          <div class="detail_item">
            {#if detail.OrdType !== null && OrderTypeEnum[detail.OrdType] !== ''}
              <div>執行条件</div>
              <div>{OrderTypeEnum[detail.OrdType]}</div>
            {/if}
          </div>
          <div class="detail_item">
            <div>受渡日</div>
            <div>{formatDate(detail.DelivDay)}</div>
          </div>
          <div class="detail_item">
            {#if detail.Commission}
              <div>手数料</div>
              <div>{detail.Commission}円</div>
            {/if}
          </div>
        </div>
      {/each}
    </details>
  {/if}
</div>

<style>
  .detail_indent {
    width: 0;
  }

  .detail_item > :nth-child(1) {
    color: #888;
    font-weight: 700;
  }
</style>
