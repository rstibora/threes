<template>
    <div class="box">
        <!-- <h1><editable-text v-model="taskName"/></h1> -->
        <p><editable-text v-model="taskDescription"/></p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
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
            taskName: "Eat your veggies!",
            taskDescription: "And some fruits as well."
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
    },
    created: function() {
        this.taskName = this.task.name
        this.taskDescription = this.task.description
    }
})
</script>

<style scoped>
.box {
    width: 600px;
}
</style>
