<script lang="ts">
  import "./PositionStock.css";
</script>

<div class="position header">
  <div class="name">銘柄</div>
  <div class="price">単価</div>
  <div class="qty">保有数</div>
  <div class="valuation">評価額</div>
  <div class="profitloss">損益</div>
</div>

<style>
  .header {
    background-color: #eee;
    font-weight: 700;
  }

  .position > * {
    font-size: 20px;
  }
</style>
