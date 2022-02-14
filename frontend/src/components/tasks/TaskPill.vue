<template>
  <div class="pill">
    <router-link
      :to="({ name: RouteNames.TASK, params: { taskId: task.id }})"
      class="grid"
    >
      <div class="left-part">
        {{ taskDetails }}
      </div>
      <router-link
        :to="({ name: RouteNames.EFFORT_SESSION, params: { taskId: task.id }})"
        class="after-space"
      >
        *
      </router-link>
      <router-link
        :to="({ name: RouteNames.NEW_EFFORT, params: { taskId: task.id }})"
      >
        +
      </router-link>
    </router-link>
    <ul v-if="configuration.listEfforts">
      <effort-pill
        v-for="effort of efforts.values()"
        :key="effort.id"
        :effort="effort"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import EffortPill from "src/components/effort/EffortPill.vue"

import { MapById } from "src/utils/types"

import { Effort, NewEffort } from "src/network/models/effort"
import { Task } from "src/network/models/task"
import { displaySeconds } from "src/utils/dateTime"


interface TaskPillConfiguration {
  // undefined is meant as a false value to avoid filling all fields when passing as prop.
  listEfforts?: boolean,
  showTotalEffortTime?: boolean,
}


export default defineComponent({
  components: {
    EffortPill
  },
  props: {
    task: {
      type: Task,
      required: true,
    },
    efforts: {
      type: Object as PropType<MapById<Effort>>,
      required: true,
    },
    configuration: {
      type: Object as PropType<TaskPillConfiguration>,
      required: false,
      default: () => { return {} }
    }
  },
  computed: {
    taskDetails(): string {
      if (!this.configuration.showTotalEffortTime) {
        return this.task.name
      }
      // TODO: possibly incorrect as it always adds the total effort time.
      let totalTaskEffort = 0
      for (const effort of this.efforts.values()) {
        totalTaskEffort += effort.duration
      }
      return `${this.task.name}: ${displaySeconds(totalTaskEffort)}`
    },
  },
  methods: {
    effortDescriptionText(effort: Effort | NewEffort): string {
      const description = (effort.description !== ""
                            ? `${effort.description} (${effort.duration} seconds)`
                            : `${effort.duration} seconds of effort`)
      return `${effort.starts.toLocaleString()}: ${description}`
    }
  },
})
</script>

<style lang="sass" scoped>
@use "src/styles/constants"
@use "src/styles/visual"

.pill
  @include visual.rounded
  margin-top: constants.$margin-medium
  padding: .05em
  background-color: Aquamarine

.grid
  display: grid
  grid-template-columns: auto 1fr auto auto
.after-space
  grid-column: 3
</style>
