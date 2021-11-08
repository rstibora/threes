<template>
    <div class="pill">
        <router-link :to="({ name: RouteNames.TASK, params: { taskId: task.id }})" class="grid">
            <div class="left-part">{{ task.name }}: {{ totalEffort }}</div>
            <router-link :to="({ name: RouteNames.EFFORT, params: { taskId: task.id }})" class="right-part">+</router-link>
        </router-link>
        <ul v-if="configuration?.listEfforts">
            <effort-pill v-for="effort of efforts.values()" :key="effort.id" :effort="effort"/>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import EffortPill from "src/components/effort/EffortPill.vue"

import { MapById } from "src/utils/types"

import { Effort, NewEffort } from "src/network/models/effort"
import { Task } from "src/network/models/task"


interface TaskListConfiguration {
    listEfforts?: boolean
}


export default defineComponent({
    props: {
        task: Task,
        efforts: {
            type: Object as PropType<MapById<Effort>>,
            required: true,
        },
        configuration: {
            type: Object as PropType<TaskListConfiguration>,
            required: false
        }
    },
    computed: {
        totalEffort(): number {
            // TODO: possibly incorrect as it always adds the total effort time.
            let totalEffort = 0
            for (const effort of this.efforts.values()) {
                totalEffort += effort.duration
            }
            return totalEffort
        },
    },
    methods: {
        effortDescriptionText(effort: Effort | NewEffort): string {
            const description = (effort.description !== ""
                                 ? `${effort.description} (${effort.duration} minutes)`
                                 : `${effort.duration} minutes of effort`)
            return `${effort.starts.toLocaleString()}: ${description}`
        }
    },
    components: {
        EffortPill
    },
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