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

#app
    display: flex
    align-items: stretch
    height: 100%
    width: 100%
</style>

<style lang="sass" scoped>
@use "src/styles/constants"
@use "src/styles/utils"

.app-inner
    display: flex
    flex-direction: row
    min-height: 100%
    max-height: 100%
    width: 100%

.side-navbar
    display: flex
    flex-direction: column
    width: constants.$side-navbar-width
    height: 100%
    position: sticky
    top: 0

.bottom-navbar
    display: none
    justify-content: space-around
    flex-direction: row
    width: 100%
    position: fixed
    bottom: 0

@media (max-width: constants.$breakpoint-mobile)
    .side-navbar
        display: none

    .bottom-navbar
        display: flex

.content
    flex-grow: 1
    height: fit-content

.button
    @include utils.centered
    padding-top: calc(#{constants.$side-navbar-width} / 4)
    padding-bottom: calc(#{constants.$side-navbar-width} / 4)
    cursor: pointer
    border-style: solid
    border-width: 1px
    border-color: rgb(0 0 0 / 0%)

.button:hover
    border-color: rgb(0 0 0 / 100%)

.button:last-of-type
    margin-top: auto
</style>
