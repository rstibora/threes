<template>
    <compact-header
        :has-back-button="true"
        :options-buttons="new Map([['Edit task', () => $router.replace({ name: RouteNames.EDIT_TASK, params: { taskId: taskId }})],
                                   ['Delete task', optionDeleteTask]])"
    >
        {{ task.name }}
    </compact-header>
    <div class="card">
        <p>{{ task.description }}</p>
        <ul v-if="taskEfforts.length > 0">
            <li
                v-for="effort of taskEfforts"
                :key="effort.id"
            >
                <effort-pill :effort="effort" />
            </li>
        </ul>
        <button @click="$router.replace({name: RouteNames.NEW_EFFORT, params: { taskId: task.id }})">
            New Effort
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import CompactHeader from "src/components/buildingBlocks/CompactHeader.vue"
import EffortPill from "src/components/effort/EffortPill.vue"

import { Effort } from "src/network/models/effort"
import { Task } from "src/network/models/task"

import { Actions } from "src/state/storeAccess"


export default defineComponent({
    components: {
        CompactHeader,
        EffortPill,
    },
    props: {
        taskId: {
            type: Number,
            required: true
        }
    },
    computed: {
        task(): Task {
            return this.$store.state.tasks.tasks.get(this.taskId) as Task
        },
        taskEfforts(): Array<Effort> {
            let filteredEfforts = new Array<Effort>()
            for (const effort of this.$store.state.efforts.efforts.values()) {
                if (effort.taskId == this.task.id) {
                    filteredEfforts.push(effort)
                }
            }
            return filteredEfforts
        },
    },
    methods: {
        async optionDeleteTask(): Promise<void> {
            await this.$store.dispatch(Actions.DESTROY_TASK, { task: this.task })
            this.$router.back()
        }
    },
})
</script>

<style lang="sass" scoped>
@use "src/styles/constants"
@use "src/styles/utils"
@use "src/styles/visual"

$margin: constants.$margin-small

.card
    @include visual.rounded
    margin: $margin
    padding: .5em
    background-color: constants.$colour-background
</style>