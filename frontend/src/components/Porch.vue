<template>
    <component v-if="session != null" :is="'App'"/>
    <!-- else spinner and stuff -->
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapState } from "vuex"

import { Session } from "src/state/session"
import { fetchResource } from "src/network/fetchResource"

import App from "src/components/App.vue"

export default defineComponent({
    computed: {
        ...mapState(["session"])
    },
    async created() {
        const response = await fetchResource("POST", "/api/token/refresh/")
        if (response.ok) {
            const responseJson = await response.json()
            this.$store.commit("updateSession", {"session": new Session(responseJson["access"])})
        } else {
            window.location.replace("/signin/")
        }
    },
    components: { App }
})
</script>
