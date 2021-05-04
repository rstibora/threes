<template>
<div class="vertical-split-container">
    <div class="left-split">
        <task-card v-for="task in tasks" :key="task" :task="task"/>
    </div>
    <div class="sticky-wrapper">
        <div class="right-split">
            <review class="review" v-for="reviewPeriodConfiguration in reviewPeriodConfigurations" :key="reviewPeriodConfiguration" :name="reviewPeriodConfiguration.name"/>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapActions, mapState } from "vuex"

import Review from "src/components/reviews/Review.vue"
import TaskCard from "src/components/tasks/TaskCard.vue"

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
        Review,
        TaskCard,
    },
    created: function() {
        this.fetchAll({ apiPath: "/api/tasks", model: Task, mutation: "updateTasks"})
        this.fetchAll({ apiPath: "/api/review_period_configurations", model: ReviewPeriodConfiguration,
                        mutation: "updateReviewPeriodConfigurations" })
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
