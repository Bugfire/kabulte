<script lang="ts">
  import type { Position信用 } from '$lib/api/positions';
  import { SideEnumRev, MarginTradeTypeEnum, AccountTypeEnum } from '$lib/api/common';
  import { localeNumber, signedNumber, signedNumberRatio } from '$lib/format';

  export let position: Position信用;
</script>

<div class="position">
  <div class="name">
    <div>{position.Symbol} {position.ExchangeName} {AccountTypeEnum[position.AccountType]}</div>
    <div>{position.SymbolName}</div>
  </div>
  <div class="margin">{MarginTradeTypeEnum[position.MarginTradeType]}</div>
  <div class="side">{SideEnumRev[position.Side]}</div>
  <div class="price">
    <div>現 {localeNumber(position.Valuation / position.LeavesQty)}円</div>
    <div>{localeNumber(position.Price)}円</div>
  </div>
  <div class="qty">
    {localeNumber(position.LeavesQty)}{position.HoldQty > 0
      ? ` (${localeNumber(position.HoldQty)})`
      : ''}
  </div>
  <div class="expenses">{localeNumber(position.Expenses)}円</div>
  <div class="profitloss">
    <div>
      <span class={position.ProfitLoss >= 0 ? 'red' : 'blue'}
        >{signedNumber(position.ProfitLoss)}</span
      >円
    </div>
    <div>
      <span class={position.ProfitLoss >= 0 ? 'red' : 'blue'}
        >{signedNumberRatio(position.ProfitLossRate)}</span
      >%
    </div>
  </div>
</div>
