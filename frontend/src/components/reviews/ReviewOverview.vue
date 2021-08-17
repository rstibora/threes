<template>
<div class="cards">
    <h1>{{ reviewConfiguration.getReviewName(reviewIndex) }}</h1>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapState } from "vuex"

import { Review, NewReview } from "src/network/models/review"
import { ReviewConfiguration } from "src/network/models/reviewConfiguration"


export default defineComponent({
    props: {
        configurationId: {
            type: Number,
            required: true,
        },
        reviewIndex: {
            type: Number,
            required: true,
        },
        reviewId : {
            type: Number
        },
    },
    computed: {
        ...mapState(["reviews", "reviewConfigurations"]),
        reviewConfiguration(): ReviewConfiguration {
            return this.reviewConfigurations.get(this.configurationId) as ReviewConfiguration
        },
    },
    data: function() {
        return {
            review: new NewReview(this.configurationId, this.reviewIndex, []) as Review | NewReview,
        }
    },
    created: function() {
        if (this.reviewId !== undefined) {
            this.review = this.reviews.get(this.reviewId) as Review
        }
    }
})
</script>

<style lang="sass" scoped>
@use "src/styles/constants"
@use "src/styles/visual"

$margin: constants.$margin-small

.card
    @include visual.rounded
    margin: $margin
    padding: .5em
    background-color: constants.$colour-background
</style>
