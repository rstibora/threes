import { Module, Store as VuexStore } from "vuex"

import { MapById } from "src/utils/types"
import { Effort, EffortSerialized, NewEffort } from "src/network/models/effort"

import { Actions, Mutations } from "src/state/storeAccess"

import { updateOrDeleteInMap } from "src/state/modules/moduleUtils"


export type State = {
    efforts: MapById<Effort>
}

export type Store<S = State> = VuexStore<S>

export const mutations = {
    [Mutations.UPDATE_EFFORTS] (state: State, payload: { efforts: MapById<Effort | undefined> }) {
        updateOrDeleteInMap(state.efforts, payload.efforts)
    }
}

export const EffortsModule: Module<State, any> = {
    state: () => ({
        efforts: new Map<number, Effort>(),
    }),
    mutations,
    actions: {
        async [Actions.CREATE_EFFORT] ({ dispatch, commit }, payload: { effort: NewEffort }): Promise<Effort> {
            // TODO: handle failure cases.
            const response: Response = await dispatch(
                Actions.FETCH_RESOURCE, { method: "POST", apiPath: `/api/efforts/`,
                                          data: payload.effort.serialize() })
            const responseJson: EffortSerialized = await response.json()

            const effort = Effort.deserialize(responseJson)
            commit(Mutations.UPDATE_EFFORTS, new Map([[effort.id, effort]]))
            return effort
        },
        async [Actions.UPDATE_EFFORT] ({ dispatch, commit }, payload: { effort: Effort }): Promise<Effort> {
            // TODO: handle failure cases.
            const response: Response = await dispatch(
                Actions.FETCH_RESOURCE, { method: "PUT", apiPath: `/api/efforts/${payload.effort.id}/`,
                                          data: payload.effort.serialize() })
            commit(Mutations.UPDATE_EFFORTS, new Map([[payload.effort.id, payload.effort]]))
            return payload.effort
        },
        async [Actions.DESTROY_EFFORT] ({ dispatch, commit }, payload: { effort: Effort }) {
            // TODO: handle failure cases.
            const response: Response = await dispatch(
                Actions.FETCH_RESOURCE, { method: "DELETE",
                                          apiPath: `/api/efforts/${payload.effort.id}` })
            commit(Mutations.UPDATE_EFFORTS, { efforts: new Map([[payload.effort.id, undefined]]) })
        },
        async [Actions.FETCH_EFFORTS] ({ dispatch, commit }): Promise<MapById<Effort>> {
            // TODO: handle failure cases.
            const response: Response = await dispatch(
                Actions.FETCH_RESOURCE, { method: "GET", apiPath: "/api/efforts" })
            const json: Array<EffortSerialized> = await response.json()

            let efforts = new Map<number, Effort>()
            for (const effortSerialized of json) {
                const effort = Effort.deserialize(effortSerialized)
                efforts.set(effort.id, effort)
            }
            commit(Mutations.UPDATE_EFFORTS, { efforts })
            return efforts
        },
    }
}
