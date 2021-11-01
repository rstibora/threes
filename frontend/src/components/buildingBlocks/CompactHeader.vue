<template>
<div class="header vertical-alignment" ref="headerPart" :style="headerStyle">
    <button v-if="hasBackButton" @click="$router.go(-1)" class="header-left-control">
        <h1>&lt;</h1>
    </button>
    <div class="slot-content">
        <slot name="default"/>
    </div>
</div>
<div class="subheader vertical-alignment" ref="subheaderPart" :style="subheaderStyle">
    <div class="slot-content">
        <slot name="subheader"></slot>
    </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"


export default defineComponent({
    props: {
        hasBackButton: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            headerStyle: {} as Record<string, string>,
            subheaderStyle: {} as Record<string, string>,
        }
    },
    mounted() {
        const subheaderElement = this.$refs.subheaderPart as Element
        const bottomPartHeight = subheaderElement.clientHeight
        // TODO: computes with integere precision.
        this.subheaderStyle["top"] = `${56 - bottomPartHeight}px`
        if (this.$slots.subheader === undefined) {
            const bottomPartStyle = window.getComputedStyle(subheaderElement)
            this.headerStyle["box-shadow"] = bottomPartStyle.getPropertyValue("box-shadow")
            this.headerStyle["clip-path"] = bottomPartStyle.getPropertyValue("clip-path")
        }
    }
})
</script>

<style lang="sass" scoped>
@use "src/styles/utils"

.vertical-alignment
    display: grid
    grid-template-columns: 38px auto
    align-items: center

.header-left-control
    grid-column: 1

.slot-content
    grid-column: 2

.header
    position: sticky
    top: 0px
    height: 56px
    width: 100%

    z-index: 2

    background-color: white

.subheader
    position: sticky
    background-color: white
    margin-bottom: 10px

    box-shadow: 0px 0px 5px gray
    clip-path: inset(0px 0px -15px 0px)
    z-index: 1
</style>
