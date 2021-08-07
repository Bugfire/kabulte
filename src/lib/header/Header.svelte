<script lang="ts">
  import { page } from '$app/stores';
  import { logout } from '$lib/login_state';

  const onLogout = () => {
    logout();
  };
</script>

<header>
  <div class="corner">Kabulte</div>
  <nav>
    <ul>
      <li class:active={$page.path === '/'}><a sveltekit:prefetch href="/">Home</a></li>
      <li class:active={$page.path === '/stock'}>
        <a sveltekit:prefetch href="/stock">現物株式</a>
      </li>
      <li class:active={$page.path === '/margin'}>
        <a sveltekit:prefetch href="/margin">信用建玉</a>
      </li>
      <li class:active={$page.path === '/order'}><a sveltekit:prefetch href="/order">発注</a></li>
    </ul>
  </nav>
  <div class="corner">
    <button class="gray-btn" on:click={onLogout}>ログアウト</button>
  </div>
</header>

<style>
  header {
    top: 0;
    position: sticky;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.5);
  }

  nav {
    display: flex;
    font-size: 18px;
  }

  ul {
    position: relative;
    padding: 0;
    margin: 0;
    display: flex;
    list-style: none;
    background: white;
    background-size: contain;
  }

  li {
    position: relative;
    height: 100%;
  }

  li.active::before {
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    left: calc(50% - 8px);
    border: 8px solid transparent;
    border-top: 8px solid black;
  }

  nav a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 1em;
    font-size: 24px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 10%;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  .corner {
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
    margin: 8px 32px;
    font-size: 24px;
    font-weight: 700;
  }
</style>
