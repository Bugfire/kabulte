<script lang="ts">
  import type { Order信用 } from '$lib/kabu_api';
  import { SideEnumRev, CashMarginEnum, OrderStateEnum, MarginTradeTypeEnum, DetalStateEnum, OrderTypeEnum, RecTypeEnum } from '$lib/kabu_api';
  import { localeNumber, formatDate } from '$lib/format';
  import "./OrderMargin.css";

  export let order: Order信用;
</script>

<div>
  <div class="order">
    <div class="name">
      <div>{order.Symbol} {order.ExchangeName}</div>
      <div>{order.SymbolName}</div>
    </div>
    <div class="margin">
      <div>{CashMarginEnum[order.CashMargin]}</div>
      <div>{MarginTradeTypeEnum[order.MarginTradeType]}</div>
    </div>
    <div class="side">{SideEnumRev[order.Side]}</div>
    <div class="price">{localeNumber(order.Price)}</div>
    <div class="qty">{order.CumQty} / {order.OrderQty} </div>
    <div class="expire_day">{formatDate(order.ExpireDay)}</div>
    <div class="order_state">{OrderStateEnum[order.OrderState]}</div>
    <div class="margin_premium">{typeof order.MarginPremium === 'string' ? order.MarginPremium : ''}</div>
  </div>
  {#each order.Details as detail}
    <div class="order">
      <div class="detail_indent"></div>
      <div class="detail_item">{RecTypeEnum[detail.RecType]}</div>
      <div class="detail_item">{DetalStateEnum[detail.State]}</div>    
      <div class="detail_item"><div>数量</div><div>{detail.Qty}</div></div>
      <div class="detail_item">{#if detail.Price !== 0}<div>値段</div><div>{detail.Price}</div>{/if}</div>
      <div class="detail_item"><div>執行条件</div><div>{OrderTypeEnum[detail.OrdType]}</div></div>
      <div class="detail_item"><div>受渡日</div><div>{formatDate(detail.DelivDay)}</div></div>
      <div class="detail_item">{#if detail.Commission}<div>手数料</div><div>{detail.Commission}</div>{/if}</div>
    </div>
  {/each}
</div>

<style>
  .name {
    width: 320px;
    align-items: flex-start;
  }

  .name > * {
    font-size: 20px;
  }

  .name > :nth-child(1) {
    font-size: 12px;
  }

  .margin {
    width: 80px;
    align-items: flex-start;
  }

  .margin > * {
    font-size: 12px;
  }

  .price {
    align-items: flex-end;
  }

  .qty {
    align-items: flex-end;
  }

  .margin_premium {
    align-items: flex-end;
  }

  .detail_indent {
    width: 0;
  }

  .detail_item {
    font-size: 12px;
  }

  .detail_item > :nth-child(1) {
    color: #888;
    font-weight: 700;
  }
</style>
