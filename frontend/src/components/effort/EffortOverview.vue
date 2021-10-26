<template>
<div class="card">
    <h1>Effort for {{ task.name }}</h1>
    <p><editable-text v-model="effort.description"/></p>
    <p>Duration: <input type="number" min="0" v-model.number="effort.duration"> minutes</p>
    <button @click="saveChanges">Save</button>
    <button v-if="effort.id !== undefined" @click="destroy">Delete</button>
</div>
</template>

<script lang="ts">
import { DateTime } from "luxon"
import { defineComponent } from "vue"

import { Actions } from "src/state/storeAccess"

import EditableText from "src/components/buildingBlocks/EditableText.vue"

import { Effort, NewEffort } from "src/network/models/effort"
import { Task } from "src/network/models/task"


export default defineComponent({
    props: {
        effortId: Number,
        taskId: {
            type: Number,
            required: true,
        },
    },
    data: function() {
        return {
            effort: new NewEffort(this.taskId, DateTime.now(), 15, "") as Effort | NewEffort
        }
    },
    computed: {
        task(): Task {
            return this.$store.state.tasks.tasks.get(this.taskId) as Task
        },
    },
    methods: {
        async saveChanges(): Promise<void> {
            const payload = { effort: this.effort }
            if (!(this.effort instanceof Effort)) {
                await this.$store.dispatch(Actions.CREATE_EFFORT, payload)
            } else {
                await this.$store.dispatch(Actions.UPDATE_EFFORT, payload)
            }
            this.$router.go(-1)
        },
        async destroy(): Promise<void> {
            if (this.effort instanceof Effort) {
                await this.$store.dispatch(Actions.DESTROY_EFFORT, { effort: this.effort })
            }
            this.$router.go(-1)
        }
    },
    components: {
        EditableText,
    },
    created: function() {
        if (this.effortId !== undefined) {
            this.effort = this.$store.state.efforts.efforts.get(this.effortId) as Effort
        }
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
