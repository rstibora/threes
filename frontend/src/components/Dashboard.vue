<template>
<compact-header>
    Dashboard
    <template v-slot:subheader>
        {{ subheaderString }}
    </template>
</compact-header>
<div class="review-widgets-container">
    <review-widget class="review" v-for="[id, configuration] in activeReviewPeriodConfigurations" :key="id" :configuration="configuration"/>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { DateTime } from "luxon"

import CompactHeader from "src/components/buildingBlocks/CompactHeader.vue"
import ReviewWidget from "src/components/reviews/ReviewWidget.vue"
import TaskCard from "src/components/tasks/TaskCard.vue"

import { Actions } from "src/state/storeAccess"

import { ReviewConfiguration } from "src/network/models/reviewConfiguration"


export default defineComponent({
    computed: {
        activeReviewPeriodConfigurations() {
            const filtered = new Map<number, ReviewConfiguration>()
            for (const [id, userConfiguration] of this.$store.state.reviews.userConfigurations) {
                if (userConfiguration.isActive) {
                    const configuration = this.$store.state.reviews.configurations.get(
                        userConfiguration.configurationId) as ReviewConfiguration
                    filtered.set(configuration.id, configuration)
                }
            }
            return filtered
        },
        subheaderString(): string {
            // TODO: What happens at midnight? Nothing.
            return DateTime.now().toLocaleString()
        }
    },
    components: {
        CompactHeader,
        ReviewWidget,
        TaskCard,
    },
})
</script>

<style scoped>
.review-widgets-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    height: 100%;
    min-height: 100%;
}
</style>
