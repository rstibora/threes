<template>
<div class="review-widgets-container">
    <review-widget class="review" v-for="[id, configuration] in activeReviewPeriodConfigurations" :key="id" :configuration="configuration"/>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapActions, mapState } from "vuex"

import ReviewWidget from "src/components/reviews/ReviewWidget.vue"
import TaskCard from "src/components/tasks/TaskCard.vue"

import { ReviewConfiguration } from "src/network/models/reviewConfiguration"
import { UserReviewConfiguration } from "src/network/models/userReviewConfiguration"
import { MapById } from "src/state/store"

export default defineComponent({
    computed: {
        ...mapState([
            "reviewConfigurations", "userReviewConfigurations"
        ]),
        activeReviewPeriodConfigurations() {
            const filtered = new Map<number, ReviewConfiguration>()
            for (const [id, userConfiguration] of this.userReviewConfigurations as MapById<UserReviewConfiguration>) {
                if (userConfiguration.isActive) {
                    const configuration = this.reviewConfigurations.get(userConfiguration.configurationId)
                    filtered.set(configuration.id, configuration)
                }
            }
            return filtered
        },
    },
    methods: {
        ...mapActions(["fetchTasks", "fetchReviews"])
    },
    components: {
        ReviewWidget,
        TaskCard,
    },
    created: async function() {
        this.fetchTasks()
        this.fetchReviews()
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
