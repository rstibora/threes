<template>
    <div class="pill">
        <router-link :to="({ name: 'effort', params: { taskId: effort.taskId, effortId: effort.id} })" class="grid">
            <div class="duration"> {{ effort.duration }} minutes</div>
            <div class="date">{{ effort.starts }} </div>
            <div class="description"> {{ effort.description }} </div>
        </router-link>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"

import { Effort } from "src/network/models/effort"

export default defineComponent({
    props: {
        effort: {
            type: Effort,
            required: true,
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
    background-color: HotPink
.grid
    display: grid
    grid-template: "duration space date" "description description description" / auto 1fr auto
.duration
    grid-area: duration
.date
    grid-area: date
.description
    grid-area: description
</style>
