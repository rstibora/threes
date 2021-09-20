<template>
<div class="card">
    <h1>Tasks</h1>
    <input type="text" v-model="searchTerm" placeholder="Your seach query...">
    <br>

    <span v-if="searchResult.size === 0">No task found.</span>
    <ul v-else>
        <li v-for="task of searchResult" :key="task.id" class="task-pill-wrapper">
            <task-pill :task="task" :efforts="new Map()" class="flex-grow-1"/>

            <div v-if="configuration !== undefined">
                <input type="checkbox" id="task.id" v-model="selectedTasks" :value="task.id"/>
            </div>
        </li>
    </ul>

    <div v-if="configuration !== undefined">
        <button class="action-button" @click="trackSelectedTasks">Track Selected Tasks</button>
    </div>
</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"

import { ExistingReviewIdentification } from "src/network/models/review"
import { Review } from "src/network/models/review"
import { Task } from "src/network/models/task"

import TaskPill from "src/components/tasks/TaskPill.vue"

import { TaskListConfiguration } from "src/components/tasks/taskList"
import { Actions } from "src/state/storeAccess"


export default defineComponent({
    props: {
        configuration: {
            type: Object as PropType<TaskListConfiguration>,
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
            for (const [id, task] of this.$store.state.tasks.tasks) {
                if (regexp.test(task.name)) {
                    result.push(task)
                }
            }
            return result
        }
    },
    methods: {
        async trackSelectedTasks() {
            const review = this.$store.state.reviews.reviews.get(
                (this.configuration?.action?.reviewIdentification as ExistingReviewIdentification).id) as Review
            for (const taskIdToTrack of this.selectedTasks) {
                if (!review.plannedTasksIds.includes(taskIdToTrack)) {
                    review.plannedTasksIds.push(taskIdToTrack)
                }
            }
            await this.$store.dispatch(Actions.UPDATE_REVIEW, { review })
            this.$router.go(-1)
        }
    },
    components: {
        TaskPill
    }
})
</script>

<style lang="sass" scoped>
@use "src/styles/constants"
@use "src/styles/visual"

$margin: constants.$margin-small

.card
    @include visual.rounded
    margin: $margin
    padding: .5em
    background-color: constants.$colour-background
.action-button
    width: 100%
.task-pill-wrapper
    display: flex
.flex-grow-1
    flex-grow: 1
</style>
