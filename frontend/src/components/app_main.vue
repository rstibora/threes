<template>
<div class="app-inner">
    <aside class="navbar">
        <a class="button" @click="setCurrentComponent('Dashboard')">D</a>
        <a class="button" @click="setCurrentComponent('')">Y</a>
    </aside>
    <div class="content">
        <keep-alive>
            <component :is="currentComponent"></component>
        </keep-alive>
    </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Dashboard from './Dashboard.vue'

export default defineComponent({
    data: function() {
        return {
            currentComponent: "Dashboard"
        }
    },
    methods: {
        setCurrentComponent(componentName: string) {
            this.currentComponent = componentName
        }
    },
    components: {
        Dashboard,
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
    flex-grow: 1;

    background-color: blue;
}
</style>
