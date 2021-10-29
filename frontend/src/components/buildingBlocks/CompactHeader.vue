<template>
<div class="compact-header" ref="headerPart" :style="headerStyle">
    <!-- Can't bind class to <slot>... -->
    <div class="slot-content">
        <slot name="default"/>
    </div>
</div>
<div class="disappearing" ref="subheaderPart" :style="subheaderStyle">
    <div class="slot-content">
        <slot name="subheader"></slot>
    </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"


export default defineComponent({
    data: function() {
        return {
            headerStyle: {},
            subheaderStyle: {},
        }
    },
    mounted() {
        // @ts-ignore
        const bottomPartHeight = this.$refs.subheaderPart.clientHeight
        // TODO: computes with integere precision.
        // @ts-ignore
        this.subheaderStyle["top"] = `${56 - bottomPartHeight}px`
        // @ts-ignore
        if (this.$slots.subheader === undefined) {
            // @ts-ignore
            const bottomPartStyle = window.getComputedStyle(this.$refs.subheaderPart)
            // @ts-ignore
            this.headerStyle["box-shadow"] = bottomPartStyle.getPropertyValue("box-shadow")
            // @ts-ignore
            this.headerStyle["clip-path"] = bottomPartStyle.getPropertyValue("clip-path")
        }
    }
})
</script>

<style lang="sass" scoped>
@use "src/styles/utils"

.slot-content
    margin-left: 20px

.compact-header
    @include utils.centered-cross-axis

    position: sticky
    top: 0px
    height: 56px
    width: 100%

    z-index: 2

    background-color: white

.disappearing
    position: sticky
    background-color: white
    margin-bottom: 10px

    box-shadow: 0px 0px 5px gray
    clip-path: inset(0px 0px -15px 0px)
    z-index: 1
</style>
