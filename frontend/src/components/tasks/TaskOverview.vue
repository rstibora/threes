<template>
<div class="card">
    <h1><editable-text v-model="editedTask.name" @update:modelValue="updateOrCreateTask()"/></h1>
    <p><editable-text v-model="editedTask.description" @update:modelValue="updateOrCreateTask()"/></p>
    <ul v-if="taskEfforts.length > 0">
        <li v-for="effort of taskEfforts" :key="effort.id"
            @click="routerPushEffort(effort.id)">{{ effort.starts }}: {{ effort.duration }} minutes</li>
    </ul>
    <button v-if="!editedTaskIsNewTask" @click="routerPushEffort()">New Effort</button>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapActions, mapState } from "vuex"

import { Effort } from "src/network/models/effort"
import { NewTask, Task } from "src/network/models/task"

import EffortModal from "src/components/effort/EffortModal.vue"
import EditableText from "src/components/utility/EditableText.vue"


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

            for (const effort of this.efforts.values()) {
                if (effort.taskId == this.editedTask.id) {
                    filteredEfforts.push(effort)
                }
            }
            return filteredEfforts
        },
        editedTaskIsNewTask(): boolean {
            return !(this.editedTask instanceof Task)
        },
        ...mapState(["efforts", "tasks"]),
    },
    methods: {
        async updateOrCreateTask() {
            if (!(this.editedTask instanceof Task)) {
                const newTask = await this.createTask({task: this.editedTask})
                this.$router.push({ name: "task", params: { taskId: newTask.id }})
                this.editedTask = freshNewTask()
            } else {
                await this.updateTask({task: this.editedTask})
                this.editedTask = this.tasks.get(this.taskId)
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
        ...mapActions(["updateTask", "createTask"])
    },
    components: {
        EditableText,
        EffortModal,
    },
    created: function() {
        if (this.taskId != undefined) {
            this.editedTask = this.tasks.get(this.taskId)
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