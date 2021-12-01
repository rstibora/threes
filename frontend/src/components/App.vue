<template>
<aside class="side-navbar">
    <router-link :to="{ name: RouteNames.DASHBOARD }" class="button"><i data-feather="home"/></router-link>
    <router-link :to="{ name: RouteNames.TASKS }" class="button"><i data-feather="file-text"/></router-link>
    <a @click="logout()" class="button">{{ session !== undefined ? session.userEmail.substr(0, 1) : "X" }}</a>
</aside>
<div class="content-wrapper">
    <div class="content">
        <router-view v-slot="{ Component, route }">
            <keep-alive>
                <component :is="Component" :key="route.path"/>
            </keep-alive>
        </router-view>
    </div>
</div>
<nav class="bottom-navbar">
    <router-link :to="{ name: RouteNames.DASHBOARD }" class="button"><i data-feather="home"/></router-link>
    <router-link :to="{ name: RouteNames.TASKS }" class="button"><i data-feather="file-text"/></router-link>
</nav>
</template>

<script lang="ts">
// @ts-ignore: development dependency, will be removed later.
import feather from "feather-icons"
import { defineComponent } from 'vue'
import { mapState } from "vuex"

import { fetchResource } from "src/network/fetchResource"

import { Mutations } from "src/state/storeAccess"
import { State } from "src/state/store"

import Dashboard from "./Dashboard.vue"

export default defineComponent({
    components: {
        Dashboard,
    },
    computed: {
        ...mapState({ session: state => (state as State).session.session })
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
            if (this.session === undefined) {
                return
            }

            const response = await fetchResource("POST", "/logout/", undefined, this.session?.accessJwt)
            if (response.ok) {
                this.$store.commit(Mutations.UPDATE_SESSION, { session: undefined })
                // TODO: fix.
                window.location.replace("/signin/")
            }
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

.bottom-navbar
    display: none
    justify-content: space-around
    flex-direction: row
    width: 100%
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
