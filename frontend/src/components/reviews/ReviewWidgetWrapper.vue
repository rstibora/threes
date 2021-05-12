<template>
    <div class="box">
        <nav class="navbar">
            <button :disabled="previousButtonDisabled"  @click="changeSelectedReviewIndexBy(-1)">
                Previous
            </button>
            <div v-if="selectedReviewPeriod != null">
                <strong>{{ selectedReviewPeriod != null ? selectedReviewPeriod.name() : "Create your first Review Period" }}</strong>
                <br>{{ selectedReviewPeriod.starts().toLocaleString() }} - {{ selectedReviewPeriod.ends().toLocaleString() }}
            </div>
            <p v-else>Create your first Review Period</p>
            <button :disabled="nextButtonDisabled" @click="changeSelectedReviewIndexBy(1)">
                Next
            </button>
        </nav>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { mapState } from "vuex"

import { ReviewPeriod } from "src/network/models/reviewPeriod"
import { ReviewPeriodConfiguration } from "src/network/models/reviewPeriodConfiguration"

export default defineComponent({
    props: {
        configuration: {
            type: Object as PropType<ReviewPeriodConfiguration>,
            required: true,
        }
    },
    data: function() {
        return {
            selectedReviewIndex: 0,
        }
    },
    computed: {
        ...mapState(["reviewPeriods"]),
        reviewPeriodsForConfiguration(): Array<ReviewPeriod> {
            return [...this.reviewPeriods.values()].filter(
                (reviewPeriod: ReviewPeriod) => reviewPeriod.configuration.id == this.configuration.id)
        },
        previousButtonDisabled(): boolean { 
            return this.selectedReviewIndex == 0 },
        nextButtonDisabled(): boolean { 
            return this.selectedReviewIndex == Math.max(0, this.reviewPeriodsForConfiguration.length - 1)},
        selectedReviewPeriod(): ReviewPeriod | null {
            if (this.reviewPeriodsForConfiguration.length > 0) {
                return this.reviewPeriodsForConfiguration[this.selectedReviewIndex]
            }
            return null
        }
    },
    methods: {
        changeSelectedReviewIndexBy(step: number) {
            this.selectedReviewIndex = Math.max(Math.min(this.selectedReviewIndex + step,
                                                         this.reviewPeriodsForConfiguration.length - 1), 0)
        }
    }
})
</script>

<style scoped>
.navbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>