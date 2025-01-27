<script>
  import Showcase from "./Showcase.svelte";
  import UserReview from "./UserReview.svelte";
</script>

<section class="showcase">
  <Showcase />
</section>
<hr />
<h2>User Reviews</h2>
<section class="user-reviews">
  <div class="user-reviews_reviews">
    <UserReview
      userName="Nicolai"
      date="Nov 29, 2024"
      review="Fantastic tool for consistent training! Well thought-out exercises, that are both challenging and rewarding!"
      imgSrc="/images/man_1.png"
    />
    <UserReview
      userName="Ashley"
      date="Jun 2, 2024"
      review="Great app with a variety of games to track your putting practice and keep it interesting! Definitely worth the premium."
      imgSrc="/images/woman_1.png"
    />
    <UserReview
      userName="Jimmy"
      date="Feb 20, 2024"
      review="This app definitely keeps me pushing to do better. I currently stink at putting, simply because of losing interest while practicing. This is going to be a game changer."
      imgSrc="/images/man_2.png"
    />
  </div>
</section>

<style>
  .showcase {
    display: grid;
    gap: 2rem;
    padding: 1rem 2rem;
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
