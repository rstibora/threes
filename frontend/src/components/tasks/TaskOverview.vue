<template>
    <div class="box">
        <h1><editable-text v-model="editedTask.name" @update:modelValue="updateTask({task: editedTask})"/></h1>
        <p><editable-text v-model="editedTask.description" @update:modelValue="updateTask({task: editedTask})"/></p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapActions, mapState } from "vuex"

import { Task } from "src/network/models/task"

import EditableText from "src/components/utility/EditableText.vue"


export default defineComponent({
    props: {
        taskId: {
            type: Number,
            required: true
        }
    },
    data: function() {
        return {
            editedTask: undefined as Task | undefined
        }
    },
    computed: {
        ...mapState(["tasks"]),
        task(): Task {
            return this.tasks.get(this.taskId)
        }
    },
    methods: {
        ...mapActions(["updateTask"])
    },
    components: {
        EditableText,
    },
    created: function() {
        this.editedTask = this.task
    }
})
</script>

<style scoped>
.box {
    width: 600px;
}
</style>
