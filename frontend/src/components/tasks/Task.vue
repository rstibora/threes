<template>
    <div class="card">
        <div class="card-header">
            <div class="card-header-title">{{ task.title }}</div>
        </div>
        <div class="card-content">{{ task.description }}</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        task: Object
    }
})
</script>

<style scoped>
.card {
    height: 200px;
    width: 500px
}
</style>
