<template>
<aside class="side-navbar">
    <router-link :to="{ name: 'dashboard' }" class="button m-2"><i data-feather="home"/></router-link>
    <router-link :to="{ name: 'tasks' }" class="button m-2"><i data-feather="file-text"/></router-link>
    <a @click="logout()" class="button m-2">{{ session != null ? session.userEmail.substr(0, 1) : "X" }}</a>
</aside>
<div class="content">
    <router-view v-slot="{ Component }">
        <keep-alive>
            <component :is="Component"/>
        </keep-alive>
    </router-view>
    <nav class="bottom-navbar box">
        <router-link :to="{ name: 'dashboard' }" class="button m-2"><i data-feather="home"/></router-link>
        <router-link :to="{ name: 'tasks' }" class="button m-2"><i data-feather="file-text"/></router-link>
        <a class="button m-2"><i data-feather="award"/></a>
    </nav>
</div>
</template>

<script lang="ts">
// @ts-ignore: development dependency, will be removed later.
import feather from "feather-icons"
import { defineComponent } from 'vue'
import { mapState } from "vuex"

import { fetchResource } from "src/network/fetchResource"

import Dashboard from "./Dashboard.vue"
import Tasks from "./Tasks.vue"

export default defineComponent({
    computed: {
        ...mapState(["session"])
    },
    methods: {
        async logout() {
            if (this.$store.state.session == null) {
                return
            }

            const response = await fetchResource("POST", "/logout/", undefined, this.$store.state.session?.accessJwt)
            if (response.ok) {
                this.$store.commit("updateSession", {"session": undefined})
                // TODO: fix.
                window.location.replace("/signin/")
            }
        }
    },
    mounted() {
        // Bring in the feather-icons.
        feather.replace()
    },
    components: {
        Dashboard,
        Tasks,
    }
})
</script>

<style>
html, body {
    height: fit-content;
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
.side-navbar {
    flex-direction: column;
    width: 80px;
    height: 100%;
    position: sticky;
    top: 0;
}
.bottom-navbar {
    display: none;
    justify-content: space-between;
    flex-direction: row;
    width: 100%;
    position: fixed;
    bottom: 0;
}
@media (max-width: 480px) {
    .side-navbar {
        display: none;
    }
    .bottom-navbar {
        display: flex;
    }
}
.content {
    flex-grow: 1;
    height: fit-content;
}
</style>
