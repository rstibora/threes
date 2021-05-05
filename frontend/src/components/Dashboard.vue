<template>
<div class="vertical-split-container">
    <div class="left-split">
        <task-card v-for="task in tasks" :key="task" :task="task"/>
    </div>
    <div class="sticky-wrapper">
        <div class="right-split">
            <review-widget-wrapper class="review" v-for="configuration in reviewPeriodConfigurations" :key="configuration" :configuration="configuration"/>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapActions, mapState } from "vuex"

import ReviewWidgetWrapper from "src/components/reviews/ReviewWidgetWrapper.vue"
import TaskCard from "src/components/tasks/TaskCard.vue"

import { ReviewPeriod } from "src/network/models/reviewPeriod"
import { ReviewPeriodConfiguration } from "src/network/models/reviewPeriodConfiguration"
import { Task } from "src/network/models/task"

export default defineComponent({
    computed: {
        ...mapState([
            "tasks", "reviewPeriodConfigurations"
        ])
    },
    methods: {
        ...mapActions(["fetchAll"])
    },
    components: {
        ReviewWidgetWrapper,
        TaskCard,
    },
    created: async function() {
        this.fetchAll({ apiPath: "/api/tasks", model: Task, mutation: "updateTasks"})
        await this.fetchAll({ apiPath: "/api/review_period_configurations", model: ReviewPeriodConfiguration,
                              mutation: "updateReviewPeriodConfigurations" })
        for (let configuration of this.$store.state.reviewPeriodConfigurations) {
            this.fetchAll({ apiPath: `/api/review_periods?configuration_id=${configuration.id}`,
                            model: ReviewPeriod,
                            mutation: "updateReviewPeriods" })
        }
    }
})
</script>

<style scoped>
.vertical-split-container {
    display: flex;

    height: 100%;
    min-height: 100%;
}
.left-split, .sticky-wrapper
{
    flex-basis: 50%;
    flex-shrink: 1;
    display: flex;
    flex-direction: column;
}
.right-split {
    position: sticky;
    top: 0;
    bottom: 0;
}
</style>
