<script>
	import UserReview from "./components/UserReview.svelte";
	import Showcase from "./components/Showcase.svelte";
    import Footer from "./components/Footer.svelte";
</script>

<body>
	<header>
		<img src="/images/logo_plain.png" alt="" srcset="" />
	</header>
	<main>
		<section class="showcase">
			<Showcase />
		</section>
		<hr />
		<h2>User Reviews</h2>
		<section class="user-reviews">
			<div class="user-reviews_reviews">
				<UserReview
					userName="lolpopli"
					date="Dec 15, 2022"
					review="I love this app it really challenges you mentally to get better at putting. You will realize right away how addicting and fun it becomes!!!!"
					imgSrc="/images/woman_1.png"
				/>
				<UserReview
					userName="TheMightyCfresh"
					date="Sep 3, 2022"
					review="Just an all around amazing tool for improving your putting. Can’t recommend enough."
					imgSrc="/images/man_1.png"
				/>
				<UserReview
					userName="Ken Bare"
					date="Jan 9, 2022"
					review="Great App! Tracks my putts and much more. Exactly what I was looking for!"
					imgSrc="/images/man_2.png"
				/>
			</div>
		</section>
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
	.showcase {
		display: grid;
		gap: 2rem;
		padding: 1rem 2rem;
	}

	header {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
	}
	header img {
		width: 5rem;
	}

	hr {
		margin: 1rem 2rem;
	}

	.user-reviews {
		padding: 1rem;
		text-align: center;
		overflow: scroll;
	}

	.user-reviews_reviews {
		display: grid;
		grid-auto-flow: column;
		grid-gap: 1rem;
		margin-right: -150%; /* Hides the extra review to the right */
		padding-right: 1rem; /* Adds a bit of spacing between the reviews */
	}

	@media (min-width: 640px) {
		.showcase {
			grid-template-columns: 1fr 1fr;
			padding: 2rem 4rem;
			flex-wrap: nowrap;
			align-items: center;
		}

		.user-reviews {
			padding: 1rem;
			text-align: center;
		}

		.user-reviews_reviews {
			display: flex;
			grid-gap: 1rem;
			margin-right: 0;
			padding-right: 0;
		}
	}
</style>
