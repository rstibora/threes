<template>
  <!-- keycloak.authenticated can be only checked after keycloak has been initialized, because
  .authenticaed is initially not defined on the object at all and there are some reactivity issues.
  (.authenticated being created with value 'true' does not trigger update). -->
  <component
    :is="'App'"
    v-if="keycloakStore.initialized && (keycloakStore.keycloak.authenticated ?? false)"
  />
  <!-- else spinner and stuff -->
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { useKeycloakStore } from "src/state/keycloakStore"

import App from "src/components/App.vue"


export default defineComponent({
  components: { App },
  setup() {
    const keycloakStore = useKeycloakStore()
    return { keycloakStore }
  },
  async created() {
    await this.keycloakStore.checkLogin()
  }
})
</script>
