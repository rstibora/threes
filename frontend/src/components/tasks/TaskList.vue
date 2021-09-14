<template>
<div class="card">
    <h1>Tasks</h1>
    <input type="text" v-model="searchTerm" placeholder="Your seach query...">
    <br>

    <span v-if="searchResult.size === 0">No task found.</span>
    <ul v-else>
        <li v-for="task of searchResult" :key="task.id">
            <task-pill :task="task" :efforts="new Map()"/>
        </li>
    </ul>

</div>
</template>

<script lang="ts">
import { defineComponent} from "vue"

import TaskPill from "src/components/tasks/TaskPill.vue"

import { Task } from "src/network/models/task"


export default defineComponent({
    data: function() {
        return {
            searchTerm: ""
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
</style>
