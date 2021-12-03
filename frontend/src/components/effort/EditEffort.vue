<template>
    <compact-header :has-back-button="true">
        Effort for {{ task.name }}
    </compact-header>
    <input
        v-model="effortData.description"
        class=".full-width-input" 
    >

    <p>
        Duration: <input
            v-model="effortData.duration"
            type="number"
            min="0"
        >
    </p>

    <button
        class="success-button"
        data-test="confirmButton"
        @click="confirmButtonAction"
    >
        {{ confirmButtonText }}
    </button>
</template>

<script lang="ts">
import { DateTime, Duration } from "luxon"
import { defineComponent, PropType } from "vue"

import CompactHeader from "src/components/buildingBlocks/CompactHeader.vue"

import { Effort, NewEffort } from "src/network/models/effort"
import { Task } from "src/network/models/task"
import { RouteNames } from "src/routing/routeNames"
import { Actions } from "src/state/storeAccess"


export default defineComponent({
    components: {
        CompactHeader
    },
    props: {
        taskId: {
            type: Number,
            required: true
        },
        effortId: {
            type: Object as PropType<number | undefined>,
            default: undefined,
        }
    },
    data: function() {
        return {
            effortData: {
                duration: 15,
                description: "",
                starts: DateTime.now()
            }
        }
    },
    computed: {
        // TODO: add tests for this.
        // Shifted back by the duration, so that it really is the time when the effort started.
        effortStartsShifted(): DateTime {
            if (this.effortId !== undefined) {
                return this.effortData.starts
            }
            return DateTime.now().minus(Duration.fromObject({ minutes: this.effortData.duration }))
        },
        task(): Task {
            return this.$store.state.tasks.tasks.get(this.taskId) as Task
        },
        confirmButtonText(): string {
            return this.effortId !== undefined ? "Save" : "Create"
        }
    },
    created(): void {
        if (this.effortId !== undefined) {
            const effort = this.$store.state.efforts.efforts.get(this.effortId) as Effort
            this.effortData.duration = effort.duration
            this.effortData.description = effort.description
            this.effortData.starts = effort.starts
        }
    },
    methods: {
        async confirmButtonAction(): Promise<void> {
            const effort = this.effortId !== undefined ?
                           new Effort(this.effortId, this.taskId, this.effortData.duration,
                                      this.effortData.description, this.effortStartsShifted) :
                           new NewEffort(this.taskId, this.effortData.duration,
                                         this.effortData.description, this.effortStartsShifted)
            const storeAction = this.effortId !== undefined ? Actions.UPDATE_EFFORT : Actions.CREATE_EFFORT
            const savedEffort = await this.$store.dispatch(storeAction, { effort }) as Effort
            this.$router.replace({ name: RouteNames.EFFORT, params: { taskId: this.taskId, effortId: savedEffort.id }})
        },
    },
})

</script>

<style lang="sass" scoped>
.full-width-input
    display: block
    width: 100%
</style>