<template>
    <div>{{ task.name }}</div>
    <div>{{ task.description }} | {{ task.created.toLocaleString("cs-CZ") }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { Task } from "src/network/models/task"

export default defineComponent({
    props: {
        task: Task
    }
})
</script>

<style scoped>
</style>
