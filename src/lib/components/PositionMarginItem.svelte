<script lang="ts">
  import type { Position信用 } from '$lib/kabu_api';
  import { SideEnumRev } from '$lib/kabu_api';
  import { localeNumber, signedNumber } from '$lib/format';
  import "./PositionMargin.css";

  export let position: Position信用;
</script>

<div class="position">
  <div class="name">
    <div>{position.Symbol} {position.ExchangeName}</div>
    <div>{position.SymbolName}</div>
  </div>
  <div class="price">{localeNumber(position.Price)}</div>
  <div class="qty">{localeNumber(position.LeavesQty)}{position.HoldQty > 0 ? ` (${localeNumber(position.HoldQty)})` : ''}</div>
  <div class="side">{SideEnumRev[position.Side]}</div>
  <div class="valuation {position.Valuation >= 0 ? '' : 'blue'}">{localeNumber(position.Valuation)}</div>
  <div class="profitloss {position.ProfitLoss >= 0 ? 'red' : 'blue'}">{signedNumber(position.ProfitLoss)}</div>
</div>

<style>
  .name {
    align-items: flex-start;
  }

  .name > * {
    font-size: 20px;
  }

  .name > :nth-child(1) {
    font-size: 12px;
  }

  .price {
    align-items: flex-end;
  }

  .qty {
    align-items: flex-end;
  }

  .side {
    align-items: center;
  }

  .valuation {
    align-items: flex-end;
    font-size: 24px;
  }

  .profitloss {
    align-items: flex-end;
    font-size: 20px;
  }
</style>
