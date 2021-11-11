<template>
    <compact-header :hasBackButton="true">
        {{ headerText }}
    </compact-header>
    <input v-model="editedTask.name" minlength="1" class="full-width-input"/>
    <input v-model="editedTask.description" class="full-width-input"/>

    <button @click="confirmButtonAction" class="success-button">{{ confirmButtonText }}</button>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import CompactHeader from "src/components/buildingBlocks/CompactHeader.vue"

import { NewTask, Task } from "src/network/models/task"
import { RouteNames } from "src/routing/routeNames"
import { Actions } from "src/state/storeAccess"


export default defineComponent({
    props: {
        taskId: {
            type: Number,
        }
    },
    data: function() {
        return {
            editedTask: new NewTask("Task Name", "Task description...") as NewTask | Task
        }
    },
    computed: {
        headerText(): string {
            return this.editedTask instanceof Task ? "Edit Task" : "Create Task"
        },
        confirmButtonText(): string {
            return this.editedTask instanceof Task ? "Save" : "Create"
        },
    },
    methods: {
        async confirmButtonAction(): Promise<void> {
            const action = this.editedTask instanceof Task ? Actions.UPDATE_TASKS : Actions.CREATE_TASK
            const task = await this.$store.dispatch(action, { task: this.editedTask })
            this.$router.push({ name: RouteNames.TASK, params: { taskId: task.id }})
        }
    },
    components: {
        CompactHeader,
    },
    created(): void {
        if (this.taskId !== undefined) {
            this.editedTask = this.$store.state.tasks.tasks.get(this.taskId) as Task
        }
    }
})
</script>

<style lang="sass" scoped>
.success-button
    width: 100%

.full-width-input
    display: block
    width: 100%
</style>
