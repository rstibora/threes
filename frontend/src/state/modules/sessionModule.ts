import { Module, Store as VuexStore } from "vuex"

import { fetchResource } from "src/network/fetchResource"

import { Session } from "src/state/session"
import { Actions, Mutations } from "src/state/storeAccess"


export type State = {
    session: Session | undefined
}

export type Store<S=State> = VuexStore<S>

export const SessionModule: Module<State, any> = {
    state: () => ({
        session: undefined
    }),
    mutations: {
        [Mutations.UPDATE_SESSION] (state, payload: { session?: Session }) {
            state.session = payload.session
        }
    },
    actions: {
        async [Actions.REFRESH_TOKEN] ({ state, commit }): Promise<boolean> {
            // TODO: Does not seem entirely correct.
            if (state.session != null) {
                return true
            }

            // TODO: handle exceptions (in case of disconnect).
            const refreshResponse = await fetchResource("POST", "/api/token/refresh/")
            if (!refreshResponse.ok) {
                return false
            }

            const refreshResponseJson = await refreshResponse.json()
            commit(Mutations.UPDATE_SESSION, { session: new Session(refreshResponseJson["access"]) })
            return true

        },
        async [Actions.FETCH_RESOURCE] ({ state, dispatch }, payload: { method: string, apiPath: string, data?: Object }): Promise<Response> {
            if (await dispatch(Actions.REFRESH_TOKEN)) {
                return await fetchResource(payload.method, payload.apiPath, payload.data, state.session?.accessJwt)
            }
            return Promise.reject("Could not refresh token")
        }
    }
}