<template>
    <div>
        <router-link :to="({ name: 'task', params: { taskId: this.task.id }})">
            {{ task.name }}: {{ taskEffort }}
        </router-link>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { Effort } from "src/network/models/effort"
import { Task } from "src/network/models/task"

export default defineComponent({
    props: {
        task: Task,
        efforts: {
            type: Object as PropType<Array<Effort>>,
            required: true,
        }
    },
    computed: {
        taskEffort(): number {
            return this.efforts.reduce((total, effort) => total += effort.duration, 0)
        }
    }
})
</script>
