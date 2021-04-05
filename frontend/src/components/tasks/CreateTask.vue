<template>
        <div class="modal is-active">
            <div @click="$emit('closed')" class="modal-background"></div>
            <div class="modal-content">
                <div class="box">
                    <div class="field">
                        <label class="label">Task Name</label>
                        <div class="control">
                            <input v-model="name" class="input" type="text">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Task Description</label>
                        <div class="control">
                            <textarea v-model="description" class="textarea"></textarea>
                        </div>
                    </div>
                    <div class="field">
                        <div class="control">
                            <button @click="postNewTask(name, description)" class="button">Create Task</button>
                            <span v-if="failed" class="has-text-danger">Something went wrong.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
    emits: ["closed"],
    data: function() {
        return {
            name: "",
            description: "",
            failed: false,
        }
    },
    methods: {
        postNewTask(name: string, description: string) {
            fetch("http://127.0.0.1:800/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, description })
            })
            .then(response => {
                if (response.ok) {
                    this.name = ""
                    this.description = ""
                    this.failed = false
                    this.$emit("closed")
                } else {
                    this.failed = true
                }
            })
            .catch(_ => {
                this.failed = true
            })
        }
    }
})
</script>
