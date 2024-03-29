<template>
<aside class="side-navbar">
    <router-link
        :to="{ name: RouteNames.TASKS, query: { action: 'selectForEffortSession' }}"
        class="button"
    >
        <i data-feather="disc" />
    </router-link>
    <router-link
        :to="{ name: RouteNames.DASHBOARD }"
        class="button"
    >
        <i data-feather="home" />
    </router-link>
    <router-link
        :to="{ name: RouteNames.TASKS }"
        class="button"
    >
        <i data-feather="file-text" />
    </router-link>
    <a
        class="button"
        @click="logout()"
    >
        {{ keycloakStore.keycloak.userInfo }}
    </a>
</aside>
<div class="content-wrapper">
    <div class="content">
        <router-view v-slot="{ Component, route }">
            <component
                :is="Component"
                :key="route.fullPath"
            />
        </router-view>
    </div>
</div>
<div
    v-if="effortSessionStore.session"
    class="information-strip"
/>
<nav class="bottom-navbar">
    <router-link
        :to="{ name: RouteNames.DASHBOARD }"
        class="button"
    >
        <i data-feather="home" />
    </router-link>
    <router-link
        :to="effortSessionStore.session
            ? { name: RouteNames.EFFORT_SESSION, params: { taskId: effortSessionStore.session.taskId }}
            : { name: RouteNames.TASKS, query: { action: 'selectForEffortSession' }}"
        class="button"
    >
        <i data-feather="disc" />
    </router-link>
    <router-link
        :to="{ name: RouteNames.TASKS }"
        class="button"
    >
        <i data-feather="file-text" />
    </router-link>
</nav>
</template>

<script lang="ts">
// @ts-ignore: development dependency, will be removed later.
import feather from "feather-icons"
import { defineComponent } from 'vue'

import { fetchResource } from "src/network/fetchResource"

import { useEffortSessionStore } from "src/state/effortSessionStore"
import { useKeycloakStore } from "src/state/keycloakStore"

import Dashboard from "./Dashboard.vue"

export default defineComponent({
    components: {
        Dashboard,
    },
    setup(props) {
        const keycloakStore = useKeycloakStore()
        const effortSessionStore = useEffortSessionStore()
        return { effortSessionStore, keycloakStore }
    },
    mounted() {
        // Bring in the feather-icons.
        feather.replace()

        for (const meta of Array.from(document.getElementsByTagName("meta"))) {
            const name = meta.getAttribute("name")
            if (name === "git-hash") {
                console.info(`Git hash backend: ${meta.getAttribute("content")}, frontend: ${GIT_INFO.hash}.`)
                if (meta.getAttribute("content") !== GIT_INFO.hash) {
                    console.error("Frontend and backend git hashes do not match.")
                }
            } else if (name === "git-tag") {
                console.info(`Git tag backend: ${meta.getAttribute("content")}, frontend: ${GIT_INFO.tag}`)
                if (meta.getAttribute("content") !== GIT_INFO.tag) {
                    console.error("Frontend and backend git tags do not match.")
                }
            } else if (name === "git-is-clean") {
                console.info(`Git clean backend: ${meta.getAttribute("content") === "True"}, frontend: ${GIT_INFO.isClean}`)
                if (meta.getAttribute("content") !== "True") {
                    console.error("Backend git was not clean during build.")
                }
            }
        }
        if (!GIT_INFO.isClean) {
            console.error("Frontend git was not clean during build.")
        }
    },
    methods: {
        async logout() {
            await this.keycloakStore.keycloak.logout()
        }
    },
})
</script>

<style lang="sass">
@use "src/styles/reset"
@use "src/styles/classes"

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

.information-strip
    height: 5px
    width: 100%
    position: fixed
    bottom: constants.$bottom-navbar-height
    background-color: red

.bottom-navbar
    display: none
    justify-content: space-around
    flex-direction: row
    width: 100%
    height: constants.$bottom-navbar-height
    position: fixed
    bottom: 0

    background-color: white
    box-shadow: 0px 0px 5px gray

@media (max-width: constants.$breakpoint-mobile)
    .side-navbar
        display: none

    .bottom-navbar
        display: flex

    .content-wrapper
        padding-bottom: constants.$bottom-navbar-height

.content-wrapper
    display: flex
    flex-grow: 1
    height: fit-content
    justify-content: center

.content
    max-width: constants.$card-max-width
    width: 100%

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
