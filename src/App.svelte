<script>
  import Home from "./components/Home.svelte";
  import Footer from "./components/Footer.svelte";
  import Router from "svelte-spa-router";
  import PrivacyPolicy from "./components/PrivacyPolicy.svelte";

  const routes = {
    "/": Home,
    "/privacy-policy": PrivacyPolicy,
  };
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
