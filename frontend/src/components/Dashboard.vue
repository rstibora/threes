<template>
<div class="vertical-split-container">
    <div class="left-split">
        <task v-for="task in tasks" :key="task" :task="task"/>
        <task v-for="task in tasks" :key="task" :task="task"/>
        <task v-for="task in tasks" :key="task" :task="task"/>
    </div>
    <div class="right-split">
    </div>

</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import Task from "./tasks/Task.vue"

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
.left-split, .right-split {
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
}
</style>
