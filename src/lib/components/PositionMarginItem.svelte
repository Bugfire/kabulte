<script lang="ts">
  import type { Position信用 } from '$lib/kabu_api';
  import { SideEnumRev, MarginTradeTypeEnum } from '$lib/kabu_api';
  import { localeNumber, signedNumber } from '$lib/format';

  export let position: Position信用;
</script>

<div class="position">
  <div class="name">
    <div>{position.Symbol} {position.ExchangeName}</div>
    <div>{position.SymbolName}</div>
  </div>
  <div class="margin">{MarginTradeTypeEnum[position.MarginTradeType]}</div>
  <div class="side">{SideEnumRev[position.Side]}</div>
  <div class="price">
    <div>現 {localeNumber(position.Valuation / position.LeavesQty)}</div>
    <div>{localeNumber(position.Price)}</div>
  </div>
  <div class="qty">{localeNumber(position.LeavesQty)}{position.HoldQty > 0 ? ` (${localeNumber(position.HoldQty)})` : ''}</div>
  <div class="profitloss">
    <div><span class="{position.ProfitLoss >= 0 ? 'red' : 'blue'}">{signedNumber(position.ProfitLoss)}</span>円</div>
    <div><span class="{position.ProfitLoss >= 0 ? 'red' : 'blue'}">{signedNumber(position.ProfitLossRate)}</span>%</div>
  </div>
</div>
