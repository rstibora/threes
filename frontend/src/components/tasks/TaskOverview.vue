<template>
    <div class="box">
        <h1><editable-text v-model="editedTask.name" @update:modelValue="updateOrCreateTask()"/></h1>
        <p><editable-text v-model="editedTask.description" @update:modelValue="updateOrCreateTask()"/></p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapActions, mapState } from "vuex"

import { NewTask, Task } from "src/network/models/task"

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
            editedTask: freshNewTask() as Task | NewTask
        }
    },
    computed: {
        ...mapState(["tasks"]),
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
        ...mapActions(["updateTask", "createTask"])
    },
    components: {
        EditableText,
    },
    created: function() {
        if (this.taskId != undefined) {
            this.editedTask = this.tasks.get(this.taskId)
        }
    }
})
</script>

<style scoped>
.box {
    width: 600px;
}
</style>
