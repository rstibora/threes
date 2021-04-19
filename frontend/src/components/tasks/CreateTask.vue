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

import { fetch_resource } from "src/network/fetch_resource"

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
        async postNewTask(name: string, description: string) {
            if (this.$store.state.session == null) {
                throw Error("Can't create a new task without active session.")
            }

            const response = await fetch_resource("POST", "/api/tasks/", { name, description, owner: 1 }, this.$store.state.session.accessJwt)
            if (response.ok) {
                this.name = ""
                this.description = ""
                this.failed = false
            } else {
                this.failed = true
            }
        }
    }
})
</script>
