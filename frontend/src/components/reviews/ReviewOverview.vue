<template>
<div class="card">
    <h1>{{ configuration.getReviewName(reviewIndex) }}</h1>
    <p>{{ configuration.getReviewInterval(reviewIndex).start.toLocaleString() }} - {{ configuration.getReviewInterval(reviewIndex).end.toLocaleString() }}</p>

    <task-pill v-for="task of plannedTasks(review).values()" :key="task.id"
               :task="task" :efforts="effortsPerTask(task, configuration.getReviewInterval(reviewIndex))"
               :configuration="{ listEfforts: true }"/>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapGetters } from "vuex"

import TaskPill from "src/components/tasks/TaskPill.vue"

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
        ...mapGetters(["plannedTasks", "effortsPerTask"]),
        configuration(): ReviewConfiguration {
            return this.$store.state.reviews.configurations.get(this.configurationId) as ReviewConfiguration
        },
    },
    data: function() {
        return {
            review: new NewReview(this.configurationId, this.reviewIndex, []) as Review | NewReview,
        }
    },
    components: {
        TaskPill,
    },
    created: function() {
        if (this.reviewId !== undefined) {
            this.review = this.$store.state.reviews.reviews.get(this.reviewId) as Review
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
