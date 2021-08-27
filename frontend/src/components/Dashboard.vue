<template>
<div class="review-widgets-container">
    <review-widget class="review" v-for="[id, configuration] in activeReviewPeriodConfigurations" :key="id" :configuration="configuration"/>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { Actions } from "src/state/storeAccess"

import ReviewWidget from "src/components/reviews/ReviewWidget.vue"
import TaskCard from "src/components/tasks/TaskCard.vue"

import { ReviewConfiguration } from "src/network/models/reviewConfiguration"


export default defineComponent({
    computed: {
        activeReviewPeriodConfigurations() {
            const filtered = new Map<number, ReviewConfiguration>()
            for (const [id, userConfiguration] of this.$store.state.reviews.userConfigurations) {
                if (userConfiguration.isActive) {
                    const configuration = this.$store.state.reviews.configurations.get(
                        userConfiguration.configurationId) as ReviewConfiguration
                    filtered.set(configuration.id, configuration)
                }
            }
            return filtered
        },
    },
    components: {
        ReviewWidget,
        TaskCard,
    },
    created: async function() {
        await this.$store.dispatch(Actions.FETCH_TASKS)
        await this.$store.dispatch(Actions.FETCH_REVIEW_CONFIGURATIONS)
        await this.$store.dispatch(Actions.FETCH_USER_REVIEW_CONFIGURATIONS)
        await this.$store.dispatch(Actions.FETCH_REVIEWS)
    }
})
</script>

<style scoped>
.review-widgets-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    height: 100%;
    min-height: 100%;
}
</style>
