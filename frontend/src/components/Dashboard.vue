<template>
<div class="vertical-split-container">
    <div class="left-split">
        <task v-for="task in tasks" :key="task" :task="task"/>
        <task v-for="task in tasks" :key="task" :task="task"/>
        <task v-for="task in tasks" :key="task" :task="task"/>
        <task v-for="task in tasks" :key="task" :task="task"/>
        <task v-for="task in tasks" :key="task" :task="task"/>
        <task v-for="task in tasks" :key="task" :task="task"/>
        <task v-for="task in tasks" :key="task" :task="task"/>
    </div>
    <div class="sticky-wrapper">
        <div class="right-split">
            <review class="review"/>
            <review class="review"/>
            <review class="review"/>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import Review from "src/components/reviews/Review.vue"
import Task from "src/components/tasks/Task.vue"

export default defineComponent({
    data: function() {
        return {
            tasks: [{
                title: "Task XYZ",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            }]
        }
    },
    components: {
        Review,
        Task,
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
