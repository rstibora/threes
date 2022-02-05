<template>
<compact-header
    :has-back-button="true"
    :options-buttons="new Map([['Edit Effort', () => $router.replace({ name: RouteNames.EDIT_EFFORT, params: { taskId, effortId }})],
                               ['Delete Effort', optionDeleteEffort]])"
>
    Effort for {{ task.name }}
</compact-header>
<div class="card">
    <p>{{ effort.description }}</p>
    <p>Duration: {{ effort.duration }} minutes</p>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import CompactHeader from "src/components/buildingBlocks/CompactHeader.vue"

import { Effort } from "src/network/models/effort"
import { Task } from "src/network/models/task"
import { useEffortsStore } from "src/state/effortsStore"
import { useTasksStore } from "src/state/tasksStore"


export default defineComponent({
    components: {
        CompactHeader,
    },
    props: {
        taskId: {
            type: Number,
            required: true,
        },
        effortId: {
            type: Number,
            required: true
        },
    },
    setup(props) {
        const effortsStore = useEffortsStore()
        const tasksStore = useTasksStore()
        return { effortsStore, tasksStore }
    },
    computed: {
        effort(): Effort {
            return this.effortsStore.efforts.get(this.effortId) as Effort
        },
        task(): Task {
            return this.tasksStore.getExistingTask(this.taskId)
        },
    },
    methods: {
        async optionDeleteEffort(): Promise<void> {
            await this.effortsStore.deleteEffort(this.effort)
            this.$router.back()
        },
    },
})
</script>

<style lang="sass" scoped>
@use "src/styles/constants"
@use "src/styles/visual"

$margin: constants.$margin-small

.card
    @include visual.rounded
    margin: $margin
    padding: .5em
    background-color: constants.$colour-background
</style>
