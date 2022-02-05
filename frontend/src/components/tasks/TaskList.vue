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
                    :id="task.id"
                    v-model="selectedTasksModel"
                    :value="task.id"
                    :type="configuration.allowMultiple ? 'checkbox' : 'radio'"
                >
            </div>
        </li>
    </ul>

    <div v-if="configuration?.action !== undefined">
        <button
            class="action-button"
            :enabled="configuration.action.allowEmpty ? true : selectedTasks.length !== 0"
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
import { useTasksStore } from "src/state/tasksStore"

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
    setup(props) {
        const tasksStore = useTasksStore()
        return { tasksStore }
    },
    data: function() {
        return {
            searchTerm: "",
            /**
             * Inner model that has to cover empty selection, radio input and checkbox input.
             */
            selectedTasksModel: undefined as Array<number> | number | undefined, 
        }
    },
    computed: {
        /**
         * Converts the complex inner model to a simple array only interface.
         */
        selectedTasks(): Array<number> {
            if (this.selectedTasksModel === undefined) {
                return new Array<number>()
            }
            return Array.isArray(this.selectedTasksModel) ? this.selectedTasksModel : [this.selectedTasksModel]
        },
        searchResult(): Array<Task> {
            let result = new Array<Task>()
            const regexp = new RegExp(`.*${this.searchTerm}.*`, "i")
            for (const task of this.tasksStore.tasks.values()) {
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
        const preselected = this.configuration.action.getPreselected()
        if (preselected.length === 0) {
            return
        }
        if (!this.configuration.action.allowMultiple) {
            this.selectedTasksModel = preselected[0]
        } else {
            this.selectedTasksModel = preselected
        }
    },
    methods: {
        async performAction() {
            if (this.configuration?.action === undefined) {
                return
            }
            await this.configuration.action.performAction(this.selectedTasks, this.$router)
            this.selectedTasksModel = new Array<number>()
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
