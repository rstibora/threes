<template>
    <component v-if="$store.state.session.session !== undefined" :is="'App'"/>
    <!-- else spinner and stuff -->
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { Session } from "src/state/session"
import { Mutations } from "src/state/storeAccess"

import { fetchResource } from "src/network/fetchResource"

import App from "src/components/App.vue"

export default defineComponent({
    components: { App },
    async created() {
        const response = await fetchResource("POST", "/api/token/refresh/")
        if (response.ok) {
            const responseJson = await response.json()
            this.$store.commit(Mutations.UPDATE_SESSION, {"session": new Session(responseJson["access"])})
        } else {
            window.location.replace("/signin/")
        }
    },
})
</script>
