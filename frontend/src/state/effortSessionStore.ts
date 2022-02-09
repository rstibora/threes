import { defineStore } from "pinia"

import { HttpError } from "src/network/fetchResource"
import { deserializeEffortSession, EffortSession,
         EffortSesssionSerialized, NewEffortSession } from "src/network/models/effortSession"
import { useSessionStore } from "./sessionStore"


export const useEffortSessionStore = defineStore("effortSession", {
  state: () => {
    return {
      session: undefined as EffortSession | undefined
    }
  },
  actions: {
    async createEffortSession(effortSession: NewEffortSession): Promise<Readonly<EffortSession>> {
      const sessionStore = useSessionStore()
      const response = await sessionStore.fetchResource<EffortSesssionSerialized, EffortSesssionSerialized>(
        "POST", `/api/effort_sessions/`, effortSession.serialize())
      this.session = deserializeEffortSession(response)
      return this.session
    },
    async updateEffortSession(effortSession: EffortSession): Promise<Readonly<EffortSession>> {
      const sessionStore = useSessionStore()
      const response = await sessionStore.fetchResource<EffortSesssionSerialized, EffortSesssionSerialized>(
        "PUT", `/api/effort_sessions/${sessionStore.session?.userId}/`, effortSession.serialize())
      this.session = deserializeEffortSession(response)
      return this.session
    },
    async fetchEffortSession(): Promise<Readonly<EffortSession | undefined>> {
      const sessionStore = useSessionStore()
      try {
        const response = await sessionStore.fetchResource<undefined, EffortSesssionSerialized>(
          "GET", `/api/effort_sessions/${sessionStore.session?.userId}/`)
          this.session = deserializeEffortSession(response)
          return this.session
      } catch (e) {
        if (e instanceof HttpError && e.code === 404) {
          return undefined
        }
      }
    },
    async deleteEffortSession(): Promise<void> {
      const sessionStore = useSessionStore()
      await sessionStore.fetchResource<undefined, undefined>(
        "DELETE", `/api/effort_sessions/${sessionStore.session?.userId}/`)
      this.session = undefined
    }
  }
})
