<template>
<div class="svg-wrapper">
    <svg id="svg" width="100%" height="100%" :viewBox="`0 0 ${this.width} ${this.height}`" preserveAspectRatio="none"/>
</div>
</template>

<script lang="ts">
import * as d3 from "d3"
import { defineComponent, PropType } from "vue"
import { debounce } from "vue-debounce"

import { StackedAreaChartConfiguration } from "src/components/utility/stackedAreaChart"


const STROKE_WIDTH = 3
const MAIN_COLOR = "steelblue"
const SECONDARY_COLOR = "lightsteelblue"


export default defineComponent({
    props: {
        configuration: {
            // Array of individual areas (first is the bottom most) represented as array of [x, y].
            type: Object as PropType<StackedAreaChartConfiguration>,
            required: true
        },
    },
    data: function() {
        return {
            width: 0,
            height: 0,
            resizeObserver: undefined as ResizeObserver | undefined,

            strokeWidth: STROKE_WIDTH,
            margin: { top: STROKE_WIDTH, left: 5, bottom: STROKE_WIDTH + 40, right: 5 },
            ticksUnit: "minutes",
            yTicksCount: 1
        }
    },
    computed: {

    },
    methods: {
        tickFormat(value: any, index: number): string {
            return index === 0 ? `${value}` : `${value} ${this.ticksUnit}`
        },
        updateSize(entries: Array<ResizeObserverEntry>, observer: ResizeObserver) {
            const entry = entries[0]
            this.width = entry.contentRect.width
            this.height = entry.contentRect.height

            const series = d3.stack<Array<number>, number>()
                .keys(this.configuration.stacks.keys())(this.configuration.transposedData)

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(series, d => d3.max(d, d => d[1])) as number])
                .range([this.height - this.margin.bottom, this.margin.top])
            const xScale = d3.scaleLinear()
                .domain(d3.extent(this.configuration.transposedData.keys()) as [number, number])
                .range([this.margin.left, this.width - this.margin.right])

            const area = d3.area()
                .x((_, i) => xScale(i))
                .y0(d => yScale(d[0]))
                .y1(d => yScale(d[1]))

            const svg = d3.select("#svg")
            svg.selectChildren().remove()

            svg.append("g")
                .selectAll("path")
                .data(series)
                .join("path")
                    // .attr("fill", (_, i) => this.configuration.stacks[i].color)
                    .attr("fill", (_, i) => d3.schemePastel1[i])
                    .attr("d", area as any)
            // svg.append("path")
            //     .datum(data)
            //     .attr("fill", SECONDARY_COLOR)
            //     .attr("stroke-linejoin", "round")
            //     .attr("stroke-linecap", "round")
            //     .attr("d", area as any)

            // svg.append("path")
            //     .datum(data)
            //     .attr("fill", "none")
            //     .attr("stroke", MAIN_COLOR)
            //     .attr("stroke-width", this.strokeWidth)
            //     .attr("stroke-linejoin", "round")
            //     .attr("stroke-linecap", "round")
            //     .attr("d", line as any)

            // svg.selectAll("circle")
            //     .data(data)
            //     .enter()
            //         .append("circle")
            //         .style("fill", MAIN_COLOR)
            //         .attr("cx", ([x, _]) => x)
            //         .attr("cy", ([_, y]) => y)
            //         .attr("r", this.strokeWidth)

            const axisVertical = d3.axisLeft(yScale)
                    .tickValues([0, yScale.domain()[1]])
                    .tickSize(this.width - (this.margin.left + this.margin.right))
                    .tickFormat(this.tickFormat)
            svg.append("g")
                    .attr("transform", `translate(${this.width - this.margin.right}, 0)`)
                    .call(axisVertical)
                    .call(g => g.select(".domain")
                            .remove())
                    .call(g => g.selectAll(".tick line")
                            .attr("stroke-opacity", "0.33")
                            .attr("stroke-dasharray", "2,2"))
                    .call(g => g.selectAll(".tick:not(:first-of-type) text")
                           .attr("x", 0)
                           .attr("dy", 12))
                    .call(g => g.selectAll(".tick:first-of-type text")
                           .attr("x", 0)
                           .attr("dy", -2))

            const calloutMethod = this.callout
            const scaledXData = [...this.configuration.transposedData.keys()].map(d => xScale(d))
            const stacks = this.configuration.stacks
            const tooltip = svg.append("g")
            const calloutYPosition = yScale(this.margin.top)
            svg.on("touchend mouseleave", () => tooltip.call(calloutMethod, null))
            svg.on("touchmove mousemove", function(event) {
                const index = d3.bisectCenter(scaledXData, d3.pointer(event, this)[0])

                tooltip
                    .attr("transform", `translate(${scaledXData[index]},${calloutYPosition})`)
                    .call(calloutMethod, stacks.map(stack => `${stack.name}: ${stack.data[index]} minutes`))
            })
        },
        callout(g: any, value: any) {
            if (!value) return g.style("display", "none")

            g
                .style("display", null)
                .style("pointer-events", "none")
                .style("font", "10px sans-serif")

            const path = g.selectAll("path")
                .data([null])
                .join("path")
                    .attr("fill", "white")
                    .attr("stroke", "black")
            const text = g.selectAll("text")
                .data([null])
                .join("text")
                .call((text: any) => text
                    .selectAll("tspan")
                    .data(value)
                    .join("tspan")
                        .attr("x", 0)
                        .attr("y", (_: any, i: any) => `${i * 1.1}em`)
                        .text((d: any) => d))

            const {x, y, width: w, height: h} = text.node().getBBox()

            text.attr("transform", `translate(${-w / 2},${15 - y})`)
            path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`)
        }
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
    max-height: 120px
</style>