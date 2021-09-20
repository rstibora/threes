<template>
<div class="card">
    <h1>{{ configuration.getReviewName(review.index) }}</h1>
    <p>{{ configuration.getReviewInterval(review.index).start.toLocaleString() }} - {{ configuration.getReviewInterval(review.index).end.toLocaleString() }}</p>

    <task-pill v-for="task of plannedTasks(review).values()" :key="task.id"
               :task="task" :efforts="effortsPerTask(task, configuration.getReviewInterval(review.index))"
               :configuration="{ listEfforts: true }"/>
    <button class="button-track-tasks" @click="buttonTrackTasksHandler">Track tasks</button>
</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { mapGetters } from "vuex"

import TaskPill from "src/components/tasks/TaskPill.vue"

import { Review, NewReview, ReviewIdentification } from "src/network/models/review"
import { ReviewConfiguration } from "src/network/models/reviewConfiguration"

import { Actions } from "src/state/storeAccess"


export default defineComponent({
    props: {
        reviewIdentification: {
            type: Object as PropType<ReviewIdentification>,
            required: true,
        },
    },
    computed: {
        ...mapGetters(["plannedTasks", "effortsPerTask"]),
        configuration(): ReviewConfiguration {
            return this.$store.state.reviews.configurations.get(this.review.configurationId) as ReviewConfiguration
        },
        review(): Review | NewReview {
            if (this.reviewId !== undefined) {
                return this.$store.state.reviews.reviews.get(this.reviewId) as Review
            }
            return new NewReview(this.reviewIdentification.configurationId as number, this.reviewIdentification.index as number, [])
        }
    },
    data: function() {
        return {
            reviewId: this.reviewIdentification.id
        }
    },
    methods: {
        async buttonTrackTasksHandler() {
            // Create the review if it doesn't exist.
            if (this.reviewIdentification.id === undefined) {
                const createdReview: Review = await this.$store.dispatch(Actions.CREATE_REVIEW, { review: this.review as NewReview })
                this.reviewId = createdReview.id
                this.$router.replace({ name: "review", params: { reviewId: createdReview.id }})
            }
            this.$router.push({ name: "tasks", query: { action: "selectForReview", reviewId: (this.review as Review).id }})
        },
    },
    components: {
        TaskPill,
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
