<template>
    <div class="top-navbar" role="navigation">
        <router-link :to="({ name: 'newTask' })">New</router-link>
    </div>
    <section>
        <div v-for="[id, task] in tasks" :key="id">
            <div>{{ task.name }}</div>
            <div>{{ task.description }}</div>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { Actions } from "src/state/storeAccess"


export default defineComponent({
    data: function() {
        return {
            newTaskModalOpen: false,
        }
    },
    computed: {
        tasks() { return this.$store.state.tasks.tasks }
    },
    created: function() {
        this.$store.dispatch(Actions.FETCH_TASKS)
    }
})
</script>

<style scoped>
.top-navbar {
    display: flex;
    flex-direction: row;
}
.input {
    max-width: 400px;
}
.button:last-of-type {
    margin-left: auto;
}
</style>
