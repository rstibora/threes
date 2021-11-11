<template>
    <compact-header :hasBackButton="true">
        Effort for {{ task.name }}
    </compact-header>
    <input v-model="this.editedEffort.description" class=".full-width-input"/>
    <p>Duration: <input v-model="this.editedEffort.duration" type="number" min="0"/></p>

    <button @click="confirmButtonAction" class="success-button">{{ confirmButtonText }}</button>
</template>

<script lang="ts">
import { DateTime } from "luxon"
import { defineComponent } from "vue"

import CompactHeader from "src/components/buildingBlocks/CompactHeader.vue"

import { Effort, NewEffort } from "src/network/models/effort"
import { Task } from "src/network/models/task"
import { RouteNames } from "src/routing/routeNames"
import { Actions } from "src/state/storeAccess"


export default defineComponent({
    props: {
        taskId: {
            type: Number,
            required: true
        },
        effortId: {
            type: Number
        }
    },
    data: function() {
        return {
            editedEffort: new NewEffort(this.taskId, DateTime.now(), 15, "Did this and that...")
        }
    },
    computed: {
        task(): Task {
            return this.$store.state.tasks.tasks.get(this.taskId) as Task
        },
        confirmButtonText(): string {
            return this.editedEffort instanceof Effort ? "Save" : "Create"
        }
    },
    methods: {
        async confirmButtonAction(): Promise<void> {
            const action = this.editedEffort instanceof Effort ? Actions.UPDATE_EFFORT : Actions.CREATE_EFFORT
            const effort = await this.$store.dispatch(action, { effort: this.editedEffort }) as Effort
            this.$router.push({ name: RouteNames.EFFORT, params: { taskId: this.taskId, effortId: effort.id }})
        },
    },
    created(): void {
        if (this.effortId !== undefined) {
            this.editedEffort = this.$store.state.efforts.efforts.get(this.effortId) as Effort
        }
    },
    components: {
        CompactHeader
    }
})

</script>

<style lang="sass" scoped>
.full-width-input
    display: block
    width: 100%
</style>