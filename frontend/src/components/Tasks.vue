<template>
    <div class="top-navbar box" role="navigation">
        <div class="input m-2"></div>
        <div class="select m-2">
            <select>
                <option>Active</option>
                <option>Backlog</option>
            </select>
        </div>

        <router-link :to="({ name: 'newTask' })" class="button is-success my-2 mr-2">New</router-link>
        <!-- <button @click="newTaskModalOpen = true" class="button is-success my-2 mr-2">New</button> -->
        <!-- <teleport to="body"> -->
            <!-- <create-task v-if="newTaskModalOpen" @closed="newTaskModalOpen = false" ></create-task> -->
        <!-- </teleport> -->

    </div>
    <section class="section">
        <div class="card" v-for="[id, task] in tasks" :key="id">
            <div class="card-header">{{ task.name }}</div>
            <div class="card-content">{{ task.description }}</div>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapActions, mapState } from "vuex"

import CreateTask from "./tasks/CreateTask.vue"

export default defineComponent({
    components: {
        CreateTask
    },
    data: function() {
        return {
            newTaskModalOpen: false,
        }
    },
    methods: {
        ...mapActions([
            "fetchTasks"
        ])
    },
    computed: {
        ...mapState([
            "tasks"
        ])
    },
    created: function() {
        this.fetchTasks()
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
