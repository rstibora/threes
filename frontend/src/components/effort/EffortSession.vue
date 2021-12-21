<template>
<compact-header
    :has-back-button="true"
>
    Record effort
    <button>{{"Select task"}}</button>
</compact-header>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"

import CompactHeader from "src/components/buildingBlocks/CompactHeader.vue"

import { Task } from "src/network/models/task"


export default defineComponent({
    components: {
        CompactHeader
    },
    props: {
        taskId: {
            type: Object as PropType<number | undefined>,
            required: false,
            default: undefined
        }
    },
    data: function() {
        return {
            task: undefined as Task | undefined
        }
    },
    created(): void {
        if (this.taskId !== undefined) {
            this.task = this.$store.state.tasks.tasks.get(this.taskId) as Task
        }
    },
})
</script>
