<script lang="ts">
  import type { Position現物 } from '$lib/api/positions';
  import { AccountTypeEnum } from '$lib/api/common';
  import { localeNumber, signedNumber, signedNumberRatio } from '$lib/format';

  export let position: Position現物;
</script>

<div class="position">
  <div class="name">
    <div>{position.Symbol} {position.ExchangeName} {AccountTypeEnum[position.AccountType]}</div>
    <div>{position.SymbolName}</div>
  </div>
  <div class="price">
    <div>現 {localeNumber(position.CurrentPrice)}円</div>
    <div>{localeNumber(position.Price)}円</div>
  </div>
  <div class="qty">{localeNumber(position.LeavesQty)}{position.HoldQty > 0 ? ` (${localeNumber(position.HoldQty)})` : ''}</div>
  <div class="valuation">{localeNumber(position.Valuation)}円</div>
  <div class="profitloss">
    <div><span class="{position.ProfitLoss >= 0 ? 'red' : 'blue'}">{signedNumber(position.ProfitLoss)}</span>円</div>
    <div><span class="{position.ProfitLoss >= 0 ? 'red' : 'blue'}">{signedNumberRatio(position.ProfitLossRate)}</span>%</div>
  </div>
</div>
