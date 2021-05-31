<template>
    <div class="box">
        <h1><editable-text v-model="taskName"/></h1>
        <p>{{ task.description }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { mapState } from "vuex"

import { Task } from "src/network/models/task"

import EditableText from "src/components/utility/EditableText.vue"


export default defineComponent({
    props: {
        taskId: {
            type: Number,
            required: true
        }
    },
    data: function() {
        return {
            taskName: "YOLO"
        }
    },
    computed: {
        ...mapState(["tasks"]),
        task(): Task {
            return this.tasks.get(this.taskId)
        }
    },
    components: {
        EditableText,
    }
})
</script>

<style scoped>
.box {
    width: 600px;
}
</style>
