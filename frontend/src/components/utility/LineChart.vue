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

            strokeWidth: 3.
        }
    },
    computed: {
        scaledData(): Array<[number, number]> {
            const [xMin, xMax] = d3.extent(this.data, item => item[0])
            const [yMin, yMax] = d3.extent(this.data, item => item[1])
            if (xMin === undefined || xMax === undefined || yMin === undefined || yMax === undefined) {
                return this.data
            }
            const yScale = d3.scaleLinear().domain([yMin, yMax])
                .range([this.height - 2 * this.strokeWidth, this.strokeWidth])
            const xScale = d3.scaleLinear().domain([xMin, xMax])
                .range([this.strokeWidth, this.width - 2 * this.strokeWidth])
            const data = this.data.map(([x, y]) => [xScale(x), yScale(y)])
            return data as Array<[number, number]>
        }
    },
    methods: {
        updateSize(entries: Array<ResizeObserverEntry>, observer: ResizeObserver) {
            const entry = entries[0]
            this.width = entry.contentRect.width
            this.height = entry.contentRect.height

            const svg = d3.select("#svg")
            svg.selectChildren().remove()

            const line = d3.line().curve(d3.curveLinear)
            svg.append("path")
                .datum(this.scaledData)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", this.strokeWidth)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("d", line as any)

            svg.selectAll("circle")
                .data(this.scaledData)
                .enter()
                    .append("circle")
                    .style("fill", "steelblue")
                    .attr("cx", ([x, _]) => x)
                    .attr("cy", ([_, y]) => y)
                    .attr("r", this.strokeWidth)
        },
    },
    created() {
        this.resizeObserver = new ResizeObserver(debounce(this.updateSize, "100ms"))
    },
    mounted() {
        (this.resizeObserver as ResizeObserver).observe(this.$el)
    },
    beforeUnmount() {
        (this.resizeObserver as ResizeObserver).unobserve(this.$el)
    }
})
</script>

<style lang="sass" scoped>
.svg-wrapper
    max-height: 30px
</style>