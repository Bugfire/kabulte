<script lang="ts">
  import "./OrderMargin.css";
</script>

<div class="order header">
  <div class="name">銘柄</div>
  <div class="margin">取引区分</div>
  <div class="side">売買</div>
  <div class="price">単価</div>
  <div class="qty">数量</div>
  <div class="expire_day">注文有効期限</div>
  <div class="order_state">状態</div>
  <div class="margin_premium">プレミアム料</div>
</div>

<style>
  .header {
    background-color: #eee;
    font-weight: 700;
  }

  .order > * {
    font-size: 20px;
  }

  .expire_day {
    font-size: 14px;
  }

  .margin_premium {
    font-size: 14px;
  }
</style>
