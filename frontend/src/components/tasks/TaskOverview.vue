<template>
    <h1>{{ task.name }}</h1>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { mapState } from "vuex"

import { Task } from "src/network/models/task"

export default defineComponent({
    props: {
        taskId: {
            type: Number,
            required: true
        }
    },
    computed: {
        ...mapState(["tasks"]),
        task(): Task {
            return this.tasks.get(this.taskId)
        }

    }
})
</script>
