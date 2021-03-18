<template>
<div class="app-inner">
    <aside class="navbar">
    </aside>

    <div class="content"></div>
</div>
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

<style>
html, body {
    height: 100%;
    min-height: 100%;
}

#app {
    display: flex;
    align-items: stretch;
    min-height: 100%;
    max-height: 100%;
    width: 100%;
}

.app-inner {
    display: flex;
    flex-direction: row;
    min-height: 100%;
    max-height: 100%;
    width: 100%;
}

.navbar {
    width: 80px;
    height: 100%;

    background-color: red;
}
.content {
    background-color: blue;
}
</style>
