<template>
<div class="centering-wrapper">
    <div class="card">
        <h1>Effort for {{ task.name }}</h1>
        <p><editable-text v-model="effort.description"/></p>
        <p>Duration: <input type="number" min="0" max="600" v-model="effort.duration"> minutes</p>
        <button @click="saveChanges">Save</button>
    </div>
</div>
</template>

<script lang="ts">
import { DateTime } from "luxon"
import { defineComponent, PropType } from "vue"
import { mapActions, mapState } from "vuex"

import EditableText from "src/components/utility/EditableText.vue"

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
            effort: new NewEffort(this.taskId, DateTime.now(), 15, "")
        }
    },
    computed: {
        ...mapState(["efforts", "tasks"]),
        task(): Task {
            return this.tasks.get(this.taskId) as Task
        },
    },
    methods: {
        ...mapActions(["createEffort", "updateEffort"]),
        async saveChanges(): Promise<void> {
            if (!(this.effort instanceof Effort)) {
                await this.createEffort({ effort: this.effort })
            } else {
                await this.updateEffort({ effort: this.effort })
            }
            this.$router.go(-1)
        }
    },
    components: {
        EditableText,
    },
    created: function() {
        if (this.effortId !== undefined) {
            this.effort = this.efforts.get(this.effortId) as Effort
        }
    }
})
</script>

<style lang="sass" scoped>
@use "src/styles/constants"
@use "src/styles/utils"
@use "src/styles/visual"

$margin: constants.$margin-small

.centering-wrapper
    @include utils.centered-main-axis

.card
    @include visual.rounded
    margin: $margin
    padding: .5em
    width: calc(100% - #{2 * $margin})
    max-width: constants.$card-max-width
    background-color: constants.$colour-background
</style>
