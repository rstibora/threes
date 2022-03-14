import Keycloak from "keycloak-js"
import { defineStore } from "pinia"


export const useKeycloakStore = defineStore("keycloak", {
  state: () => {
    return {
      keycloak: Keycloak({
        url: "http://localhost:8443",
        realm: "threes",
        clientId: "hasura",
      }),
      initialized: false
    }
  },
  actions: {
    async checkLogin(): Promise<boolean> {
      if (!this.initialized) {
        this.initialized = await this.keycloak.init({ onLoad: "login-required" })
      } else {
        await this.keycloak.login()
      }

      return this.keycloak.authenticated ?? false
    }
  }
})
