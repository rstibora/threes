<template>
    <div class="card m-2">
        <div class="card-header">
            <div class="card-header-title">{{ task.name }}</div>
        </div>
        <div class="card-content">{{ task.description }} | {{ task.created }}</div>
    </div>
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
.card {
    min-height: 200px;
}
</style>
