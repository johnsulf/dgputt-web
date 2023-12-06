<script>
    import Home from "./components/Home.svelte";
    import Footer from "./components/Footer.svelte";
    import Router from 'svelte-spa-router';
    import PrivacyPolicy from './components/PrivacyPolicy.svelte';

    const routes = {
        '/': Home,
        '/privacy-policy': PrivacyPolicy,
    };
</script>


<body>
	<header>
		<a href="/">
			<img src="/images/logo_plain.png" alt="dgputt logo" />
		</a>
	</header>
	<main>
		<Router {routes}></Router>
	</main>
	<Footer />
	<script>
		window.fwSettings={
		'widget_id':151000004393
		};
		!function(){if("function"!=typeof window.FreshworksWidget){var n=function(){n.q.push(arguments)};n.q=[],window.FreshworksWidget=n}}() 
	</script>
	<script type='text/javascript' src='https://widget.freshworks.com/widgets/151000004393.js' async defer></script>
</body>

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
