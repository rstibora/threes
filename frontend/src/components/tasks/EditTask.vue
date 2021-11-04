<template>
    <compact-header :hasBackButton="true">
        Edit Task
    </compact-header>
    <input v-model="editedTask.name"/>
    <input v-model="editedTask.description"/>

    <button class="confirm-button">{{ confirmButtonText }}</button>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import CompactHeader from "src/components/buildingBlocks/CompactHeader.vue"

import { NewTask, Task } from "src/network/models/task"


export default defineComponent({
    props: {
        taskId: {
            type: Number,
        }
    },
    data: function() {
        return {
            editedTask: new NewTask("Task Name", "Task description...") as NewTask | Task
        }
    },
    computed: {
        confirmButtonText(): string {
            return this.taskId !== undefined ? "Save" : "Create"
        },
    },
    components: {
        CompactHeader,
    },
    created() {
        if (this.taskId !== undefined) {
            this.editedTask = this.$store.state.tasks.tasks.get(this.taskId) as Task
        }
    }
})
</script>
