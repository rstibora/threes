<template>
<div class="svg-wrapper">
    <svg id="svg" width="100%" height="100%" :viewBox="viewBoxString" preserveAspectRatio="none"/>
</div>
</template>

<script lang="ts">
import * as d3 from "d3"
import { defineComponent, PropType } from "vue"
import { debounce } from "vue-debounce"


export default defineComponent({
    props: {
        data: {
            type: Object as PropType<Array<[number, number]>>,
            required: true
        },
    },
    data: function() {
        return {
            width: 0,
            height: 0,
            resizeObserver: undefined as ResizeObserver | undefined,
        }
    },
    computed: {
        viewBoxString(): string {
            return `0 0 ${this.width} ${this.height}`
        }
    },
    methods: {
        updateSize(entries: Array<ResizeObserverEntry>, observer: ResizeObserver) {
            const entry = entries[0]
            this.width = entry.contentRect.width
            this.height = entry.contentRect.height

            const line = d3.line().curve(d3.curveStep)
            d3.select("#svg").append("path")
                .datum(this.data)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("d", line as any)
        },
    },
    created() {
        this.resizeObserver = new ResizeObserver(debounce(this.updateSize, "100ms"))
    },
    mounted() {
        (this.resizeObserver as ResizeObserver).observe(this.$el)
    },
})
</script>

<style lang="sass" scoped>
.svg-wrapper
    max-height: 30px
</style>