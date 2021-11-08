<template>
<compact-header :hasBackButton="true"
                :optionsButtons="new Map([['Edit task', () => $router.push({ name: Routes.EDIT_TASK, params: { taskId: taskId }})],
                                          ['Delete task', optionDeleteTask]])">
    {{ task.name }}
</compact-header>
<div class="card">
    <p><editable-text v-model="task.description" @update:modelValue="updateOrCreateTask()"/></p>
    <ul v-if="taskEfforts.length > 0">
        <li v-for="effort of taskEfforts" :key="effort.id">
            <effort-pill :effort="effort"/>
        </li>
    </ul>
    <button @click="routerPushEffort()">New Effort</button>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapState } from "vuex"

import CompactHeader from "src/components/buildingBlocks/CompactHeader.vue"
import EffortPill from "src/components/effort/EffortPill.vue"
import EditableText from "src/components/buildingBlocks/EditableText.vue"

import { Effort } from "src/network/models/effort"
import { Task } from "src/network/models/task"

import { Routes } from "src/routing/router"
import { Actions } from "src/state/storeAccess"
import { State } from "src/state/store"


export default defineComponent({
    props: {
        taskId: {
            type: Number,
            required: true
        }
    },
    data: function() {
        return {
            task: undefined as unknown as Task,
        }
    },
    computed: {
        taskEfforts(): Array<Effort> {
            let filteredEfforts = new Array<Effort>()
            for (const effort of this.$store.state.efforts.efforts.values()) {
                if (effort.taskId == this.task.id) {
                    filteredEfforts.push(effort)
                }
            }
            return filteredEfforts
        },
        ...mapState({ tasks: state => (state as State).tasks.tasks }),
    },
    methods: {
        async updateOrCreateTask(): Promise<void> {
            await this.$store.dispatch(Actions.UPDATE_TASKS, {task: this.task})
            this.task = this.tasks.get(this.taskId) as Task
        },
        routerPushEffort(effortId: number | undefined = undefined): void {
            const params = { taskId: this.task.id }
            if (effortId !== undefined) {
                // TODO: ugly.
                (params as any).effortId = effortId
            }
            this.$router.push({name: Routes.EFFORT, params })
        },
        async optionDeleteTask(): Promise<void> {
            await this.$store.dispatch(Actions.DESTROY_TASK, { task: this.task })
            if (this.$router.getRoutes().at(-1) !== undefined && this.$router.getRoutes().at(-1)?.name === Routes.EDIT_TASK) {
                // TODO: Should be handled better, editTask is still in history for the deleted task...
                this.$router.push({ name: Routes.TASKS })
            }
            this.$router.back()
        }
    },
    components: {
        CompactHeader,
        EditableText,
        EffortPill,
    },
    created: function() {
        this.task = this.tasks.get(this.taskId) as Task
    }
})
</script>

<style lang="sass" scoped>
@use "src/styles/constants"
@use "src/styles/utils"
@use "src/styles/visual"

$margin: constants.$margin-small

.card
    @include visual.rounded
    margin: $margin
    padding: .5em
    background-color: constants.$colour-background
</style>