<template>
    <div class="top-navbar box" role="navigation">
        <div class="input m-2"></div>
        <div class="select m-2">
            <select>
                <option>Active</option>
                <option>Backlog</option>
            </select>
        </div>

        <button @click="newTaskModalOpen = true" class="button is-success my-2 mr-2">New</button>

        <teleport to="body">
            <div v-if="newTaskModalOpen" class="modal is-active">
                <div @click="newTaskModalOpen = false" class="modal-background"></div>
                <div class="modal-content">
                    <div class="box">
                        <div class="field">
                            <label class="label">Task Name</label>
                            <div class="control">
                                <input v-model="newTaskName" class="input" type="text">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Task Description</label>
                            <div class="control">
                                <textarea v-model="newTaskDescription" class="textarea"></textarea>
                            </div>
                        </div>
                        <div class="field">
                            <div class="control">
                                <button @click="createNewTask(newTaskName, newTaskDescription)" class="button">Create Task</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </teleport>
    </div>
    <section class="section">
        <div class="card" v-for="task in tasks" :key="task">
            <div class="card-header">{{ task.name }}</div>
            <div class="card-content">{{ task.description }}</div>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data: function() {
        return {
            tasks: [] as Array<Object>,
            newTaskModalOpen: false,
            newTaskName: "",
            newTaskDescription: "",
        }
    },
    methods: {
        fetchTasks() {
            fetch("http://127.0.0.1:8000/api/tasks")
                .then(response => response.json())
                .then(json => {
                    for (let task of json) {
                        this.tasks.push({
                            "name": task["name"],
                            "description": task["description"],
                        })
                    }
                })
        },
        createNewTask(name: string, description: string) {
            fetch("http://127.0.0.1:800/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name: this.newTaskName,
                                      description: this.newTaskDescription})
            })
        }
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
    width: 400px;
}
.button:last-of-type {
    margin-left: auto;
}
</style>
