<template>
    <div> <!-- To avoid leaing style from the parent component -->
    <div class="pill">
        <router-link :to="({ name: 'effort', params: { taskId: effort.taskId, effortId: effort.id} })" class="grid">
            <div class="duration"> {{ effort.duration }} minutes</div>
            <div class="date">{{ relativeDateTime(effort.starts) }} </div>
            <div class="description"> {{ effort.description }} </div>
        </router-link>
    </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

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
    grid-template: "duration date" "description description" / auto auto
.duration
    grid-area: duration
.date
    grid-area: date
    text-align: end
.description
    grid-area: description
</style>
