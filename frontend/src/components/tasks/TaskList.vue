<template>
<compact-header>
    <div class="flex-wrapper">
        Tasks
        <input
            v-model="searchTerm"
            type="text"
            placeholder="Your seach query..."
        >
    </div>
</compact-header>

<div class="card">
    <span v-if="searchResult.size === 0">No task found.</span>
    <ul v-else>
        <li
            v-for="task of searchResult"
            :key="task.id"
            class="task-pill-wrapper"
        >
            <task-pill
                :task="task"
                :efforts="new Map()"
                class="flex-grow-1"
            />

            <div v-if="configuration?.action !== undefined">
                <input
                    id="task.id"
                    v-model="selectedTasks"
                    :value="task.id"
                    type="checkbox"
                >
            </div>
        </li>
    </ul>

    <div v-if="configuration?.action !== undefined">
        <button
            class="action-button"
            @click="performAction"
        >
            {{ configuration.action.actionName }}
        </button>
    </div>
    <button
        v-else
        @click="$router.push({ name: RouteNames.NEW_TASK })"
    >
        Create a new task
    </button>
</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"

import { Task } from "src/network/models/task"

import TaskPill from "src/components/tasks/TaskPill.vue"
import CompactHeader from "src/components/buildingBlocks/CompactHeader.vue"

import { TaskListConfiguration } from "src/components/tasks/taskList"


export default defineComponent({
    components: {
        CompactHeader,
        TaskPill,
    },
    props: {
        configuration: {
            type: Object as PropType<TaskListConfiguration>,
            default: () => ({ action: undefined})
        }
    },
    data: function() {
        return {
            searchTerm: "",
            selectedTasks: [] as Array<number>,
        }
    },
    computed: {
        searchResult(): Array<Task> {
            let result = new Array<Task>()
            const regexp = new RegExp(`.*${this.searchTerm}.*`, "i")
            for (const task of this.$store.state.tasks.tasks.values()) {
                if (regexp.test(task.name)) {
                    result.push(task)
                }
            }
            return result
        }
    },
    created: function() {
        if (this.configuration?.action === undefined) {
            return
        }
        this.selectedTasks = this.configuration.action.getPreselected()
    },
    methods: {
        async performAction() {
            if (this.configuration?.action === undefined) {
                return
            }
            await this.configuration.action.performAction(this.selectedTasks)
            this.$router.back()
        },
    },
})
</script>

<style lang="sass" scoped>
@use "src/styles/constants"
@use "src/styles/visual"

$margin: constants.$margin-small

.flex-wrapper
    display: flex
.card
    @include visual.rounded
    margin: $margin
    padding: .5em
    background-color: constants.$colour-background
input
    width: 100%
.action-button
    width: 100%
.task-pill-wrapper
    display: flex
.flex-grow-1
    flex-grow: 1
</style>
