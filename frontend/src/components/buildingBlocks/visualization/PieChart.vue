<template>
<div class="svg-wrapper">
    <svg id="svg" width="100%" height="100%" :viewBox="`0 0 ${this.width} ${this.height}`" preserveAspectRatio="none"/>
</div>
</template>

<script lang="ts">
import * as d3 from "d3"
import { defineComponent, PropType } from "vue"
import { debounce } from "vue-debounce"

import { PieArea, PieChartConfiguration } from "src/components/buildingBlocks/visualization/PieChart"
import { PieArcDatum } from "d3"


export default defineComponent({
        props: {
        configuration: {
            type: Object as PropType<PieChartConfiguration>,
            required: true
        },
    },
    data: function() {
        return {
            width: 0,
            height: 0,
            resizeObserver: undefined as ResizeObserver | undefined,

            margin: { top: 5, left: 5, bottom: 5, right: 5 },
        }
    },
    computed: {

    },
    methods: {
        updateSize(entries: Array<ResizeObserverEntry>, observer: ResizeObserver) {
            const entry = entries[0]
            this.width = entry.contentRect.width
            this.height = entry.contentRect.height

            const outerRadius = Math.min(this.width - (this.margin.left + this.margin.right),
                                         this.height - (this.margin.top + this.margin.bottom)) / 2

            const pie = d3.pie<any, PieArea>().value((d, _) => d.value)
            const arcs = pie(this.configuration.areas)

            const svg = d3.select("#svg")
            svg.selectChildren().remove()

            svg.append("g")
                .attr("transform",
                      `translate(${this.width / 2 + this.margin.left},${this.height / 2 + this.margin.top})`)
                .selectAll("path")
                    .data(arcs)
                    .join("path")
                        .attr("d", d3.arc<any, PieArcDatum<PieArea>>()
                            .innerRadius(outerRadius * 0.33)
                            .outerRadius(outerRadius))
                            .attr("fill", (pieArea => pieArea.data.colour))

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
    max-height: 120px
</style>