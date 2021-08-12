<template>
    <router-link :to="({ name: 'task', params: { taskId: task.id }})" class="pill grid">
        <div class="left-part">{{ task.name }}: {{ taskEffort }}</div>
        <router-link :to="({ name: 'effort', params: { taskId: task.id }})" class="right-part">+</router-link>
    </router-link>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { Effort } from "src/network/models/effort"
import { Task } from "src/network/models/task"

export default defineComponent({
    props: {
        task: Task,
        efforts: {
            type: Object as PropType<Array<Effort>>,
            required: true,
        }
    },
    computed: {
        taskEffort(): number {
            return this.efforts.reduce((total, effort) => total += effort.duration, 0)
        }
    }
})
</script>

<style lang="sass" scoped>
@use "src/styles/constants"
@use "src/styles/visual"

.pill
    @include visual.rounded
    margin-top: constants.$margin-medium
    padding: .05em
    background-color: Aquamarine

.grid
    display: grid
    grid-template-columns: auto 1fr auto

.right-part
    grid-column: 3
</style>