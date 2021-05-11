<template>
<div class="vertical-split-container">
    <div class="left-split">
        <task-card v-for="[id, task] in tasks" :key="id" :task="task"/>
    </div>
    <div class="sticky-wrapper">
        <div class="right-split">
            <review-widget-wrapper class="review" v-for="[id, configuration] in reviewPeriodConfigurations" :key="id" :configuration="configuration"/>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapActions, mapState } from "vuex"

import ReviewWidgetWrapper from "src/components/reviews/ReviewWidgetWrapper.vue"
import TaskCard from "src/components/tasks/TaskCard.vue"

export default defineComponent({
    computed: {
        ...mapState([
            "tasks", "reviewPeriodConfigurations"
        ])
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
