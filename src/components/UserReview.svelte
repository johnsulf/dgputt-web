<script>
    export let userName;
    export let date;
    export let review;
    export let imgSrc;
</script>

<div class="review-container">
    <div class="top">
        <h3>by: {userName}</h3>
        <p class="date">{date}</p>
    </div>
    <p class="review">"{review}"</p>
    <img src={imgSrc} alt="" />
</div>

<style>
    p {
        margin: 0.5rem;
    }

    .review-container {
        display: grid;
        margin-block: 1rem;
        padding: 2rem;
        background-color: #fbd73920;
        border-radius: 1rem;
    }

    .review {
        font-style: italic;
    }

    .date {
        font-size: 0.75rem;
    }

    img {
        width: 200px;
        border-radius: 50%;
        justify-self: center;
    }

    @media (min-width: 640px) {
        .review-container {
            width: 30%;
        }
    }
</style>
