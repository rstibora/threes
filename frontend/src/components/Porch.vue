<template>
    <component
        :is="'App'"
        v-if="sessionStore.session !== undefined"
    />
    <!-- else spinner and stuff -->
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { useSessionStore } from "src/state/sessionStore"
import { Session } from "src/state/session"

import { fetchResource } from "src/network/fetchResource"

import App from "src/components/App.vue"

export default defineComponent({
    components: { App },
    setup(_props) {
        const sessionStore = useSessionStore()
        return { sessionStore }
    },
    async created() {
        const response = await fetchResource("POST", "/api/token/refresh/")
        if (response.ok) {
            const responseJson = await response.json()
            this.sessionStore.session = new Session(responseJson["access"])
        } else {
            window.location.replace("/signin/")
        }
    },
})
</script>
