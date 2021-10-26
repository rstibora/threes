<template>
<div class="card">
    <h1><editable-text v-model="editedTask.name" @update:modelValue="updateOrCreateTask()"/></h1>
    <p><editable-text v-model="editedTask.description" @update:modelValue="updateOrCreateTask()"/></p>
    <ul v-if="taskEfforts.length > 0">
        <li v-for="effort of taskEfforts" :key="effort.id">
            <effort-pill :effort="effort"/>
        </li>
    </ul>
    <button v-if="!editedTaskIsNewTask" @click="routerPushEffort()">New Effort</button>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapState } from "vuex"

import { Effort } from "src/network/models/effort"
import { NewTask, Task } from "src/network/models/task"

import { Actions } from "src/state/storeAccess"
import { State } from "src/state/store"

import EffortPill from "src/components/effort/EffortPill.vue"
import EditableText from "src/components/buildingBlocks/EditableText.vue"


function freshNewTask(): NewTask {
    return new NewTask("New Task", "Description of the new task.")
}

export default defineComponent({
    props: {
        taskId: {
            type: Number,
        }
    },
    data: function() {
        return {
            editedTask: freshNewTask() as Task | NewTask,
        }
    },
    computed: {
        taskEfforts(): Array<Effort> {
            let filteredEfforts = new Array<Effort>()
            if (!(this.editedTask instanceof Task)) {
                return filteredEfforts
            }

            for (const effort of this.$store.state.efforts.efforts.values()) {
                if (effort.taskId == this.editedTask.id) {
                    filteredEfforts.push(effort)
                }
            }
            return filteredEfforts
        },
        editedTaskIsNewTask(): boolean {
            return !(this.editedTask instanceof Task)
        },
        ...mapState({ tasks: state => (state as State).tasks.tasks }),
    },
    methods: {
        async updateOrCreateTask() {
            if (this.taskId === undefined) {
                const newTask = await this.$store.dispatch(Actions.CREATE_TASK, {task: this.editedTask })
                this.$router.push({ name: "task", params: { taskId: newTask.id }})
                this.editedTask = freshNewTask()
            } else {
                await this.$store.dispatch(Actions.UPDATE_TASKS, {task: this.editedTask})
                this.editedTask = this.tasks.get(this.taskId) as Task
            }
        },
        routerPushEffort(effortId: number | undefined = undefined) {
            if (this.editedTask instanceof Task) {
                const params = { taskId: this.editedTask.id }
                if (effortId !== undefined) {
                    // TODO: ugly.
                    (params as any).effortId = effortId
                }
                this.$router.push({name: "effort", params })
            }
        },
    },
    components: {
        EditableText,
        EffortPill,
    },
    created: function() {
        if (this.taskId !== undefined) {
            this.editedTask = this.tasks.get(this.taskId) as Task
        }
    }
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