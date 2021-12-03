/**
 * @jest-environment jsdom
 */


import { DateTime } from "luxon"
import { params, suite } from "@testdeck/jest"
import { mount } from "@vue/test-utils"
import { createStore } from "vuex"

import { Effort } from "src/network/models/effort"
import { Task } from "src/network/models/task"
import { getters} from "src/state/store"
import { state as effortsState, getters as effortsGetters, mutations as effortsMutations } from "src/state/modules/effortsModule"
import { state as tasksState, getters as tasksGetters, mutations as tasksMutations } from "src/state/modules/tasksModule"
import { Actions, Mutations } from "src/state/storeAccess"

import EditEffort from "../EditEffort.vue"


@suite class EditEffortsTests {
    @params({ effortId: undefined})
    @params({ effortId: 0})
    async testCreateNewEffort({ effortId }) {

        const createEffortAction = jest.fn(() => new Effort(1, 0, 0, "", DateTime.fromSeconds(1638942034)))
        const updateEffortAction = jest.fn(() => new Effort(1, 0, 0, "", DateTime.fromSeconds(1638942034)))

        const store = createStore({
            modules: {
                efforts: {
                    state: effortsState,
                    getters: effortsGetters,
                    mutations: effortsMutations,
                    actions: {
                        [Actions.CREATE_EFFORT]: createEffortAction,
                        [Actions.UPDATE_EFFORT]: updateEffortAction,
                    }
                },
                tasks: {
                    state: tasksState,
                    getters: tasksGetters,
                    mutations: tasksMutations,
                },
            },
            getters
        })
        store.commit(Mutations.UPDATE_TASKS, { tasks: new Map([[0, new Task(0, "", "", DateTime.fromSeconds(1638942034))]]) })
        store.commit(Mutations.UPDATE_EFFORTS, { efforts: new Map([[0, new Effort(0, 0, 0, "", DateTime.fromSeconds(1638942034))]]) })

        const wrapper = mount(EditEffort, {
            shallow: true,
            global: {
                plugins: [store],
                mocks: {
                    $router: {
                        replace: jest.fn()
                    }
                }
            },
            props: {
                taskId: 0,
                effortId,
            }
        })
        expect(await wrapper.get("[data-test='confirmButton']").text()).toBe(effortId === undefined ? "Create" : "Save")

        await wrapper.get("[data-test='confirmButton']").trigger("click")

        expect(createEffortAction.mock.calls.length == (effortId === undefined ? 1 : 0))
        expect(updateEffortAction.mock.calls.length == (effortId === undefined ? 0 : 1))
    }
}
