<template>
<compact-header :hasBackButton="true" :optionsButtons="new Map([['Edit Effort', () => $router.replace({ name: RouteNames.EDIT_EFFORT, params: { taskId, effortId }})],
                                                                ['Delete Effort', optionDeleteEffort]])">
    Effort for {{ task.name }}
</compact-header>
<div class="card">
    <p><editable-text v-model="effort.description"/></p>
    <p>Duration: {{ effort.duration }} minutes</p>
</div>
</template>

<script lang="ts">
import { DateTime } from "luxon"
import { defineComponent } from "vue"

import CompactHeader from "src/components/buildingBlocks/CompactHeader.vue"
import EditableText from "src/components/buildingBlocks/EditableText.vue"

import { Actions } from "src/state/storeAccess"

import { Effort, NewEffort } from "src/network/models/effort"
import { Task } from "src/network/models/task"


export default defineComponent({
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
    data: function() {
        return {
            effort: new NewEffort(this.taskId, 15, "") as Effort | NewEffort
        }
    },
    computed: {
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
    components: {
        CompactHeader,
        EditableText,
    },
    created: function() {
        this.effort = this.$store.state.efforts.efforts.get(this.effortId) as Effort
    }
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
