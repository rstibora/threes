<template>
    <div class="box">
        <nav class="navbar">
            <button :disabled="previousButtonDisabled"  @click="changeSelectedReviewIndexBy(-1)">
                Previous
            </button>
            <p><strong>{{ configuration.name }} 35</strong></p>
            <button :disabled="nextButtonDisabled" @click="changeSelectedReviewIndexBy(1)">
                Next
            </button>
        </nav>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
        <p>sed do eiusmod tempor incididunt ut labore et dolore magna aliqua,</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapState } from "vuex"

import { ReviewPeriodConfiguration } from "src/network/models/reviewPeriodConfiguration"

export default defineComponent({
    props: {
        configuration: ReviewPeriodConfiguration,
    },
    data: function() {
        return {
            selectedReviewIndex: 0,
        }
    },
    computed: {
        ...mapState(["reviewPeriods"]),
        previousButtonDisabled(): boolean { 
            return this.selectedReviewIndex == 0 },
        nextButtonDisabled(): boolean { 
            return this.selectedReviewIndex == this.reviewPeriods.length - 1},
    },
    methods: {
        changeSelectedReviewIndexBy(step: number) {
            this.selectedReviewIndex = Math.max(Math.min(this.selectedReviewIndex + step,
                                                         this.reviewPeriods.length - 1), 0)
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