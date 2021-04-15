<template>
<div class="app-inner">
    <aside class="navbar">
        <a @click="setCurrentComponent('Dashboard')" class="button m-2"><i data-feather="home"/></a>
        <a @click="setCurrentComponent('Tasks')" class="button m-2"><i data-feather="file-text"/></a>
        <a class="button m-2"><i data-feather="award"/></a>
        <a class="button m-2">{{ session != null ? session.userEmail : "X" }}</a>
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
import { mapState } from "vuex"

import Dashboard from "./Dashboard.vue"
import Tasks from "./Tasks.vue"

export default defineComponent({
    data: function() {
        return {
            currentComponent: "Tasks"
        }
    },
    computed: {
        ...mapState(["session"])
    },
    methods: {
        setCurrentComponent(componentName: string) {
            this.currentComponent = componentName
        }
    },
    components: {
        Dashboard,
        Tasks,
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
    display: flex;
    flex-direction: column;
    width: 80px;
    height: 100%;
}
.content {
    flex-grow: 1;
}
</style>
