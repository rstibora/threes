<template>
<div class="review-widgets-container">
    <review-widget-wrapper class="review" v-for="[id, configuration] in activeReviewPeriodConfigurations" :key="id" :configuration="configuration"/>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapActions, mapState } from "vuex"

import ReviewWidgetWrapper from "src/components/reviews/ReviewWidgetWrapper.vue"
import TaskCard from "src/components/tasks/TaskCard.vue"

import { ReviewPeriodConfiguration } from "src/network/models/reviewPeriodConfiguration"

export default defineComponent({
    computed: {
        ...mapState([
            "tasks", "reviewPeriodConfigurations"
        ]),
        activeReviewPeriodConfigurations() {
            const filtered = new Map<number, ReviewPeriodConfiguration>()
            for (const [id, configuration] of this.reviewPeriodConfigurations) {
                if (configuration.active) {
                    filtered.set(id, configuration)
                }
            }
            return filtered
        },
    },
    methods: {
        ...mapActions(["fetchTasks", "fetchReviewPeriods"])
    },
    components: {
        ReviewWidgetWrapper,
        TaskCard,
    },
    created: async function() {
        this.fetchTasks()
        this.fetchReviewPeriods()
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
.review {
    width: 600px;
}
</style>
