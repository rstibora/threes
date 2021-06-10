<template>
<aside class="side-navbar">
    <router-link :to="{ name: 'dashboard' }" class="button"><i data-feather="home"/></router-link>
    <router-link :to="{ name: 'tasks' }" class="button"><i data-feather="file-text"/></router-link>
    <a @click="logout()" class="button">{{ session != null ? session.userEmail.substr(0, 1) : "X" }}</a>
</aside>
<div class="content">
    <router-view v-slot="{ Component, route }">
        <keep-alive>
            <component :is="Component" :key="route.path"/>
        </keep-alive>
    </router-view>
</div>
<nav class="bottom-navbar">
    <router-link :to="{ name: 'dashboard' }" class="button"><i data-feather="home"/></router-link>
    <router-link :to="{ name: 'tasks' }" class="button"><i data-feather="file-text"/></router-link>
</nav>
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

<style lang="sass">
@use "src/styles/reset"
@use "src/styles/base"

#app
    display: flex
    align-items: stretch
    height: 100%
    width: 100%

.app-inner
    display: flex
    flex-direction: row
    min-height: 100%
    max-height: 100%
    width: 100%

.side-navbar
    flex-direction: column
    width: 80px
    height: 100%
    position: sticky
    top: 0

.bottom-navbar
    display: none
    justify-content: space-between
    flex-direction: row
    width: 100%
    position: fixed
    bottom: 0

@media (max-width: base.$breakpoint-mobile)
    .side-navbar
        display: none

    .bottom-navbar
        display: flex

.content
    flex-grow: 1
    height: fit-content
</style>

<style lang="sass" scoped>
@use "src/styles/utils"

.button
    @include utils.centered
    padding-top: 25%
    padding-bottom: 25%
    cursor: pointer
    border-style: solid
    border-width: 1px
    border-color: rgb(0 0 0 / 0%)

.button:hover
    border-color: rgb(0 0 0 / 100%)
</style>
