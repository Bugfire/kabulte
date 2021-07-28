<script lang="ts">
  import type { Order現物 } from '$lib/kabu_api';
  import { SideEnumRev, OrderStateEnum, DetalStateEnum, OrderTypeEnum, RecTypeEnum } from '$lib/kabu_api';
  import { localeNumber, formatDate } from '$lib/format';

  export let order: Order現物;
</script>

<div>
  <div class="order">
    <div class="name">
      <div>{order.Symbol} {order.ExchangeName}</div>
      <div>{order.SymbolName}</div>
    </div>
    <div class="side">{SideEnumRev[order.Side]}</div>
    <div class="price">{localeNumber(order.Price)}</div>
    <div class="order_qty">
      <div>{order.CumQty}</div>
      <div>{order.OrderQty}</div>
    </div>
    <div class="expire_day">{formatDate(order.ExpireDay)}</div>
    <div class="order_state">{OrderStateEnum[order.OrderState]}</div>
  </div>
  {#if order.Details.length > 0}
    <details>
      <summary>詳細</summary>
        {#each order.Details as detail}
          <div class="order">
            <div class="detail_indent"></div>
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
