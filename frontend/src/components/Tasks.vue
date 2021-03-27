<template>
    <div class="top-navbar box" role="navigation">
        <div class="input m-2"></div>
        <div class="select m-2">
            <select>
                <option>Active</option>
                <option>Backlog</option>
            </select>
        </div>
        <button class="button is-success my-2 mr-2">New</button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
        
    },
})
</script>

<style scoped>
.top-navbar {
    display: flex;
    flex-direction: row;
}
.input {
    width: 400px;
}
.button:last-of-type {
    margin-left: auto;
}
</style>
