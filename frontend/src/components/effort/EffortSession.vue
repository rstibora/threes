<template>
<compact-header
    :has-back-button="true"
>
    Record effort
</compact-header>
    Task: <button @click="$router.push({ name: RouteNames.TASKS, query: { action: 'selectForEffortSession', taskId: taskId }})">
        {{ task.name }}: {{ durationInminutesAndSeconds[0] }}:{{ durationInminutesAndSeconds[1] }}
    </button>
    <br>
    <button
        class="full-width"
        @click="startPauseButtonClicked"
    >
        {{ intervalId ? "Pause" : "Start" }}
    </button>
    <button
        class="full-width"
        @click="saveButtonClicked"
    >
        Save
    </button>
    <button
        class="full-width"
        :enabled="intervalId !== undefined"
        @click="clearButtonClicked"
    >
        Clear
    </button>
</template>

<script lang="ts">
import { DateTime, Duration } from "luxon"
import { defineComponent } from "vue"

import CompactHeader from "src/components/buildingBlocks/CompactHeader.vue"

import { NewEffort } from "src/network/models/effort"
import { Task } from "src/network/models/task"
import { RouteNames } from "src/routing/routeNames"
import { useEffortsStore } from "src/state/effortsStore"
import { useTasksStore } from "src/state/tasksStore"


export default defineComponent({
    components: {
        CompactHeader
    },
    props: {
        taskId: {
            type: Number,
            required: true,
        }
    },
    setup(_props) {
        const effortsStore = useEffortsStore()
        const tasksStore = useTasksStore()
        return { effortsStore, tasksStore }
    },
    data: function() {
        return {
            task: undefined as Task | undefined,
            session: {
                duration: 0,
                started: undefined as DateTime | undefined,
            },
            intervalId: undefined as ReturnType<typeof setInterval> | undefined,
        }
    },
    computed: {
        durationInminutesAndSeconds(): [number, number] {
            const duration = Duration.fromObject({ minutes: 0, seconds: this.session.duration }).normalize()
            return [duration.minutes, duration.seconds]
        }
    },
    created(): void {
        this.task = this.tasksStore.getExistingTask(this.taskId)
    },
    methods: {
        startPauseButtonClicked(): void {
            if (!this.intervalId) {
                if (!this.session.started) {
                    this.session.started = DateTime.now()
                }
                this.intervalId = setInterval(() => this.session.duration += 1, 1000)
            } else {
                clearTimeout(this.intervalId)
                this.intervalId = undefined
            }
        },
        async saveButtonClicked(): Promise<void> {
            if (this.intervalId) {
                // Eh.
                this.startPauseButtonClicked()
            }
            const effort = new NewEffort(
                (this.task as Task).id, this.session.duration, "",
                DateTime.now().minus(Duration.fromObject({ minutes: this.session.duration})))
            await this.effortsStore.createEffort(effort)
            this.$router.push({ name: RouteNames.DASHBOARD })
        },
        clearButtonClicked(): void {
            if (this.intervalId) {
                this.startPauseButtonClicked()
                this.session.duration = 0
            }
        }
    },
})
</script>

<style lang="sass" scoped>
.full-width
    width: 100%
</style>