<template>
<div class="svg-wrapper">
    <svg id="svg" width="100%" height="100%" :viewBox="`0 0 ${this.width} ${this.height}`" preserveAspectRatio="none"/>
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

            strokeWidth: 2.
        }
    },
    computed: {
        scaledData(): Array<[number, number]> {
            const [xMin, xMax] = d3.extent(this.data, item => item[0])
            const [yMin, yMax] = d3.extent(this.data, item => item[1])
            if (xMin === undefined || xMax === undefined || yMin === undefined || yMax === undefined) {
                return this.data
            }
            const xScaling = (this.width - 2 * this.strokeWidth) / (xMax - xMin)
            const yScaling = (this.height - 2 * this.strokeWidth) / (yMax - yMin)
            return this.data.map(([x, y]) => [(x - xMin) * xScaling + this.strokeWidth,
                                              (y - yMin) * yScaling  + this.strokeWidth])
        }
    },
    methods: {
        updateSize(entries: Array<ResizeObserverEntry>, observer: ResizeObserver) {
            const entry = entries[0]
            this.width = entry.contentRect.width
            this.height = entry.contentRect.height

            const line = d3.line().curve(d3.curveStep)
            d3.select("#svg").select("path").remove()
            d3.select("#svg").append("path")
                .datum(this.scaledData)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", this.strokeWidth)
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