import { defineStore } from "pinia"

import { fetchResource, HttpError } from "src/network/fetchResource"
import { Session } from "src/state/session"


export const useSessionStore = defineStore("session", {
  state: () => {
    return {
      session: undefined as Session | undefined
    }
  },
  actions: {
    async refreshToken(): Promise<void> {
      // TODO: handle exceptions (e.g. on disconnect).
      const response = await fetchResource("POST", "/api/token/refresh/")
      if (!response.ok) {
        throw Error(`Could not refresh token: ${response.statusText}: ${await response.text()}`)
      }

      const responseJson = await response.json()
      this.session = new Session(responseJson["access"])
    },
    async fetchResource<InputData, OutputData>(method: string, apiPath: string, data?: InputData): Promise<OutputData> {
      if (!this.session) {
        await this.refreshToken()
      }
      const firstTryResponse = await fetchResource(method, apiPath, data, (this.session?.accessJwt as string))
      if (firstTryResponse.ok) {
        // Either none or application/json is expected.
        if (firstTryResponse.headers.get("Content-Type")) {
          return await firstTryResponse.json() as OutputData
        }
        return undefined as unknown as OutputData
      }

      // TODO: verify that it is correct.
      if (firstTryResponse.status === 400) {
        this.refreshToken()
        const secondTryResponse = await fetchResource(method, apiPath, data, (this.session?.accessJwt as string))
        if (secondTryResponse.ok) {
          if (secondTryResponse.headers.get("Content-Type")) {
            return await secondTryResponse.json() as OutputData
          }
          return undefined as unknown as OutputData
        }
      }
      throw new HttpError(
        `Could not fetch resource: ${firstTryResponse.statusText}: ${await firstTryResponse.text()}`,
        firstTryResponse.status)
    }
  }
})
