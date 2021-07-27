<script lang="ts">
  import { browser } from '$app/env';
	import Header from '$lib/header/Header.svelte';
  import Login from '$lib/Login.svelte';
	import '../app.css';
  import { setupWorker } from 'msw';
  import { handlers } from '$lib/__mock__';

  if (browser) {
    // TEST
    setupWorker(...handlers).start();
  }
</script>

<Header />

<main>
	<slot />
</main>

<Login />

<style>
main {
  margin: 16px;
}
</style>
