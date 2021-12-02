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

import { Actions } from "src/state/storeAccess"

import { Effort } from "src/network/models/effort"
import { Task } from "src/network/models/task"


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
    computed: {
        effort(): Effort {
            return this.$store.state.efforts.efforts.get(this.effortId) as Effort
        },
        task(): Task {
            return this.$store.state.tasks.tasks.get(this.taskId) as Task
        },
    },
    methods: {
        async optionDeleteEffort(): Promise<void> {
            await this.$store.dispatch(Actions.DESTROY_EFFORT, { effort: this.effort })
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
