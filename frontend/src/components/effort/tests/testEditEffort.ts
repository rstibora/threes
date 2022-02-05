/**
 * @jest-environment jsdom
 */

import { DateTime, Duration } from "luxon"
import { createTestingPinia } from '@pinia/testing'
import { params, suite } from "@testdeck/jest"
import { shallowMount } from "@vue/test-utils"

import { Effort } from "src/network/models/effort"
import { Task } from "src/network/models/task"
import { useEffortsStore } from "src/state/effortsStore"
import { useTasksStore } from "src/state/tasksStore"

import EditEffort from "../EditEffort.vue"


@suite class EditEffortsTests {

    @params({ effortId: undefined, effortDuration: 25 })
    @params({ effortId: 0, effortDuration: 25 })
    testEffortStartsShifted({ effortId, effortDuration }) {
        jest.spyOn(DateTime, "now").mockImplementation(() => DateTime.fromObject({ year: 2020, month: 2, day: 22, hour: 20, minute: 20}))

        const localThis = {
            effortId,
            effortData: {
                duration: effortDuration,
                starts: DateTime.fromObject({ year: 2020, month: 2, day: 22, hour: 20, minute: 20})}}

        const result = (EditEffort.computed.effortStartsShifted as any).call(localThis)
        if (effortId !== undefined) {
            expect(result).toStrictEqual(localThis.effortData.starts)
        } else {
            expect(result).toStrictEqual(localThis.effortData.starts.minus(Duration.fromObject({ seconds: effortDuration})))
        }
    }

    @params({ effortId: undefined })
    @params({ effortId: 0 })
    async testConfirmButtonAction({ effortId }) {
        const wrapper = shallowMount(EditEffort, {
            global: {
                plugins: [createTestingPinia({initialState: { efforts: { efforts: new Map([[0, new Effort(0, 0, 0, "", DateTime.fromSeconds(1638942034))]]) },
                                                              tasks: { tasks: new Map([[0, new Task(0, "", "", DateTime.fromSeconds(1638942034))]]) }}})],
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

        const effortsStore = useEffortsStore()
        const createEffortAction = jest.fn(() => effortsStore.efforts.set(1, new Effort(1, 0, 0, "", DateTime.fromSeconds(1638942034))))
        const updateEffortAction = jest.fn(() => effortsStore.efforts.set(0, new Effort(0, 0, 0, "", DateTime.fromSeconds(1638942034))))

        // @ts-ignore
        effortsStore.createEffort.mockImplementation(createEffortAction)
        // @ts-ignore
        effortsStore.updateEffort.mockImplementation(updateEffortAction)

        expect(wrapper.get("[data-test='confirmButton']").text()).toBe(effortId === undefined ? "Create" : "Save")
        await wrapper.get("[data-test='confirmButton']").trigger("click")

        expect(createEffortAction.mock.calls.length).toBe(effortId === undefined ? 1 : 0)
        expect(updateEffortAction.mock.calls.length).toBe(effortId === undefined ? 0 : 1)
    }
}
