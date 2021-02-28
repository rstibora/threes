<template>
    <div class="yololo">{{ msg }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data: function() {
        return {
            msg: "YOLO"
        }
    }
})
</script>
