<script>
  import Footer from "./components/Footer.svelte";
  import Router from "svelte-spa-router";
  import routes from "./routes/routes.js";
</script>

<header>
  <a href="/">
    <img src="/images/logo_plain.png" alt="dgputt logo" />
  </a>
</header>

<main>
  <Router {routes} />
</main>

<Footer />

<style>
  header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
  header img {
    width: 5rem;
  }
</style>
