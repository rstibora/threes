<template>
<div class="compact-header" ref="topPart">
    <slot name="default"/>
</div>
<div class="disappearing" ref="bottomPart" :style="bottomPartStyle">
    <slot name="subheader"></slot>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"


export default defineComponent({
    data: function() {
        return {
            bottomPartStyle: {}
        }
    },
    mounted() {
        // @ts-ignore
        const bottomPartHeight = this.$refs.bottomPart.clientHeight
        // TODO: computes with integere precision.
        // @ts-ignore
        this.bottomPartStyle["top"] = `${56 - bottomPartHeight}px`
    }
})
</script>

<style lang="sass" scoped>
.compact-header
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
