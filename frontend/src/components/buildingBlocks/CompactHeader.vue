<template>
<div class="header vertical-alignment" ref="headerPart" :style="headerStyle">
    <button v-if="hasBackButton" @click="$router.back()" class="header-left-control">
        <h1>&lt;</h1>
    </button>
    <div class="slot-content">
        <h1><slot name="default"/></h1>
    </div>
    <button v-if="optionsButtons.size > 0" class="header-options-control" @click.stop="optionsModalDisplayed=true">
        <h1>:</h1>
    </button>
</div>
<div class="subheader vertical-alignment" ref="subheaderPart" :style="subheaderStyle">
    <div class="slot-content">
        <slot name="subheader"></slot>
    </div>
</div>

<div class="modal" v-show="optionsModalDisplayed" v-clicked-outside="() => optionsModalDisplayed = false">
    <button v-for="[name, action] of optionsButtons" :key="name" @click="action">
        {{ name }}
    </button>
</div>
</template>


<script lang="ts">
import { defineComponent, PropType } from "vue"


export default defineComponent({
    props: {
        hasBackButton: {
            type: Boolean,
            default: false,
        },
        optionsButtons: {
            type: Object as PropType<Map<string, () => void>>,
            default: new Map()
        }
    },
    data: function() {
        return {
            headerStyle: {} as Record<string, string>,
            subheaderStyle: {} as Record<string, string>,
            optionsModalDisplayed: false,
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
    grid-template-columns: 38px auto 38px
    align-items: center

.header-left-control
    grid-column: 1

.slot-content
    grid-column: 2

.header-options-control
    grid-column: 3

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

.modal
    position: fixed
    top: 30px
    right: 20px
    z-index: 10

    background-color: white
    box-shadow: 0px 0px 5px gray

.modal button
    display: block
    margin: 10px
</style>
