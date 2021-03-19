<template>
<div class="vertical-split-container">
    <div class="left-split">
        <task v-for="item in items" :key="item"/>
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
            items: [1, 2, 3]
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
}
</style>
