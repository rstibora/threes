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
    {{ stopwatchIntervalHandle ? "Pause" : "Start" }}
  </button>
  <button
    class="full-width"
    @click="saveButtonClicked"
  >
    Save
  </button>
  <button
    class="full-width"
    :enabled="stopwatchIntervalHandle !== undefined"
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
import { EffortSession, EffortSessionState, NewEffortSession } from "src/network/models/effortSession"
import { Task } from "src/network/models/task"
import { RouteNames } from "src/routing/routeNames"
import { useEffortSessionStore } from "src/state/effortSessionStore"
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
    const effortSessionStore = useEffortSessionStore()
    const effortsStore = useEffortsStore()
    const tasksStore = useTasksStore()
    return { effortSessionStore, effortsStore, tasksStore }
  },
  data: function() {
    return {
      task: undefined as Task | undefined,
      duration: 0,
      stopwatchIntervalHandle: undefined as ReturnType<typeof setInterval> | undefined,
    }
  },
  computed: {
    durationInminutesAndSeconds(): [string, string] {
      const duration = Duration.fromObject({ minutes: 0, seconds: this.duration }).normalize()
      return [duration.minutes.toFixed(0), duration.seconds.toFixed(0)]
    }
  },
  created(): void {
    this.task = this.tasksStore.getExistingTask(this.taskId)
    if (this.effortSessionStore.session !== undefined) {
      this.duration = this.effortSessionStore.session.duration
      if (this.effortSessionStore.session.state === EffortSessionState.RUNNING) {
        this.duration -= this.effortSessionStore.session.lastActive.diffNow("seconds").seconds
        this.stopwatchIntervalHandle = setInterval(() => this.duration += 1, 1000)
      }
    }
  },
  methods: {
    async startPauseButtonClicked(): Promise<void> {
      if (!this.effortSessionStore.session) {
        await this.effortSessionStore.createEffortSession(
          new NewEffortSession(this.taskId, EffortSessionState.PAUSED, DateTime.now(), 0, DateTime.now()))
      } 

      const effortSession = this.effortSessionStore.session as EffortSession
      effortSession.duration = this.duration
      if (effortSession.state === EffortSessionState.PAUSED) {
        effortSession.state = EffortSessionState.RUNNING
        this.stopwatchIntervalHandle = setInterval(() => this.duration += 1, 1000)
      } else {
        effortSession.state = EffortSessionState.PAUSED
        // @ts-ignore
        clearInterval(this.stopwatchIntervalHandle)
        this.stopwatchIntervalHandle = undefined
      }
      effortSession.lastActive = DateTime.now()
      await this.effortSessionStore.updateEffortSession(effortSession)
    },
    async saveButtonClicked(): Promise<void> {
      if (this.effortSessionStore.session?.state === EffortSessionState.RUNNING) {
        // Eh.
        this.startPauseButtonClicked()
      }
      const effort = new NewEffort(
        (this.task as Task).id, this.duration, "", this.effortSessionStore.session?.created)
      await this.effortsStore.createEffort(effort)
      this.duration = 0
      await this.effortSessionStore.deleteEffortSession()
      this.$router.push({ name: RouteNames.DASHBOARD })
    },
    async clearButtonClicked(): Promise<void> {
      if (this.effortSessionStore.session !== undefined) {
        if (this.stopwatchIntervalHandle !== undefined) {
          this.startPauseButtonClicked()
        }
        this.duration = 0
        await this.effortSessionStore.deleteEffortSession()
      }
    }
  },
})
</script>

<style lang="sass" scoped>
.full-width
  width: 100%
</style>