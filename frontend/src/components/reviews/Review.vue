<template>
    <div class="box">
        <nav class="navbar">
            <button>Previous</button>
            <p><strong>Week 35</strong></p>
            <button>Next</button>
        </nav>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
        <p>sed do eiusmod tempor incididunt ut labore et dolore magna aliqua,</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({

})
</script>

<style scoped>
.navbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>