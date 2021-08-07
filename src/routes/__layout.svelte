<script lang="ts">
  import Header from '$lib/header/Header.svelte';
  import Login from '$lib/Login.svelte';
  import '../app.css';
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
