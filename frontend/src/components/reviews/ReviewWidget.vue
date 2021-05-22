<template>
    <div class="box">
        <nav class="navbar">
            <button :disabled="previousButtonDisabled"  @click="changeSelectedReviewIndexBy(-1)">
                Previous
            </button>
            <div v-if="selectedReviewPeriod != null">
                <strong>{{ selectedReviewPeriod != null ? selectedReviewPeriod.name() : "Create your first Review Period" }}</strong>
                <br>{{ selectedReviewPeriod.starts.toLocaleString() }} - {{ selectedReviewPeriod.ends.toLocaleString() }}
            </div>
            <p v-else>Create your first Review Period</p>
            <button :disabled="nextButtonDisabled" @click="changeSelectedReviewIndexBy(1)">
                Next
            </button>
        </nav>

        <div class="box">
            {{ plannedTasks.length != 0 ? `${plannedTasks.length} Planned tasks:` : "No planned tasks" }}
            <task-pill v-for="task in plannedTasks" :key="task.id" :task="task" :efforts="effortPerTaskForSelectedReview.get(task.id)"/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { mapActions, mapState } from "vuex"

import TaskPill from "src/components/tasks/TaskPill.vue"

import { Effort } from "src/network/models/effort"
import { ReviewPeriod } from "src/network/models/reviewPeriod"
import { ReviewPeriodConfiguration } from "src/network/models/reviewPeriodConfiguration"
import { Task } from "src/network/models/task"

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
        ...mapState(["efforts", "reviewPeriods", "tasks"]),
        effortPerTaskForSelectedReview(): Map<number, Array<Effort>> {
            let effortPerTask = new Map<number, Array<Effort>>()
            for (const effort of this.efforts.values() as Array<Effort>) {
                // TODO: dumb for now.
                if (this.selectedReviewPeriod == null
                        || effort.starts < this.selectedReviewPeriod.starts
                        || effort.starts > this.selectedReviewPeriod.ends) {
                    return effortPerTask
                }

                if (!effortPerTask.has(effort.taskId)) {
                    effortPerTask.set(effort.taskId, new Array<Effort>())
                }
                let efforts = effortPerTask.get(effort.taskId) as Array<Effort>
                efforts.push(effort)
            }
            for (const task of this.plannedTasks) {
                if (!effortPerTask.has(task.id)) {
                    effortPerTask.set(task.id, new Array<Effort>())
                }
            }
            return effortPerTask
        },
        reviewPeriodsForConfiguration(): Array<ReviewPeriod> {
            return [...this.reviewPeriods.values()].filter(
                (reviewPeriod: ReviewPeriod) => reviewPeriod.configuration.id == this.configuration.id)
        },
        plannedTasks(): Array<Task> {
            let plannedTasks: Array<Task> = []
            if (this.selectedReviewPeriod == null) {
                return plannedTasks
            }
            for (const id of this.selectedReviewPeriod.plannedTasksIds) {
                plannedTasks.push(this.tasks.get(id))
            }
            return plannedTasks
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
        ...mapActions(["fetchEfforts"]),
        changeSelectedReviewIndexBy(step: number) {
            this.selectedReviewIndex = Math.max(Math.min(this.selectedReviewIndex + step,
                                                         this.reviewPeriodsForConfiguration.length - 1), 0)
        }
    }, components: {
        TaskPill,
    }, created: async function() {
        this.fetchEfforts()
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