<template>
    <div>{{ task.name }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { Task } from "src/network/models/task"

export default defineComponent({
    props: {
        task: Task,
    }
})
</script>
