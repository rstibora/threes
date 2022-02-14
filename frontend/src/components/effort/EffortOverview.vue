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
  <p>Duration: {{ displaySeconds(effort.duration) }}</p>
</div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import router from "src/routing/router"

import CompactHeader from "src/components/buildingBlocks/CompactHeader.vue"
import { useEffortsStore } from "src/state/effortsStore"
import { useTasksStore } from "src/state/tasksStore"
import { displaySeconds } from "src/utils/dateTime"


const props = defineProps({
  taskId: {
    type: Number,
    required: true
  },
  effortId: {
    type: Number,
    required: true
  },
})

const effortsStore = useEffortsStore()
const tasksStore = useTasksStore()

const task = computed(() => tasksStore.getExistingTask(props.taskId))
const effort = computed(() => effortsStore.getExistingEffort(props.effortId))

async function optionDeleteEffort(): Promise<void> {
  effort.effect.stop()
  router.back()
  await effortsStore.deleteEffort(effort.value)
}
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
