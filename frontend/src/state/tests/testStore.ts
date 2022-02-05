import { DateTime, Interval } from "luxon"
import { setActivePinia, createPinia } from "pinia"

import { params, suite } from "@testdeck/jest"
import { Task } from "src/network/models/task"
import { Effort } from "src/network/models/effort"

import { useTasksStore } from "../tasksStore"
import { useEffortsStore } from "../effortsStore"


const task = new Task(0, "", "", DateTime.fromSeconds(1638942034))
const tasksState = { tasks: new Map([[task.id, task]])}
const interval = Interval.fromDateTimes(DateTime.fromObject({ year: 2020, day: 15, hour: 10, minute: 15}),
                                        DateTime.fromObject({ year: 2020, day: 15, hour: 10, minute: 45}))

@suite class TestStore {
    before() {
        setActivePinia(createPinia())
    }

    @params({ effortsState: { efforts: new Map([[0, new Effort(0, 0, 15 * 60, "", DateTime.fromObject({ year: 2020, day: 15, hour: 10, minute: 15 }))]])}, expectedSize: 1 })
    @params({ effortsState: { efforts: new Map([[0, new Effort(0, 0, 15 * 60, "", DateTime.fromObject({ year: 2020, day: 15, hour: 10, minute: 50 }))]])}, expectedSize: 0 })
    @params({ effortsState: { efforts: new Map([[0, new Effort(0, 0, 15 * 60, "", DateTime.fromObject({ year: 2020, day: 15, hour: 10, minute: 0 }))]])}, expectedSize: 0 })
    @params({ effortsState: { efforts: new Map([[0, new Effort(0, 0, 15 * 60, "", DateTime.fromObject({ year: 2020, day: 15, hour: 10, minute: 5 }))]])}, expectedSize: 1 })
    testEffortsPerTask({ effortsState, expectedSize }) {
        const effortsStore = useEffortsStore()
        effortsStore.efforts = effortsState.efforts
        const result = effortsStore.effortsPerTask(task, interval)
        expect(result.size).toBe(expectedSize)
    }

    @params({ effortsState: { efforts: new Map([[0, new Effort(0, 0, 15 * 60, "", DateTime.fromObject({ year: 2020, day: 15, hour: 9, minute: 39 }))]])}, ignoreTasks: undefined, expectedSize: 0 })
    @params({ effortsState: { efforts: new Map([[0, new Effort(0, 0, 15 * 60, "", DateTime.fromObject({ year: 2020, day: 15, hour: 10, minute: 15 }))]])}, ignoreTasks: undefined, expectedSize: 1 })
    @params({ effortsState: { efforts: new Map([[0, new Effort(0, 0, 15 * 60, "", DateTime.fromObject({ year: 2020, day: 15, hour: 10, minute: 5 }))]])}, ignoreTasks: undefined, expectedSize: 1 })
    @params({ effortsState: { efforts: new Map([[0, new Effort(0, 0, 15 * 60, "", DateTime.fromObject({ year: 2020, day: 15, hour: 10, minute: 50 }))]])}, ignoreTasks: undefined, expectedSize: 0 })
    @params({ effortsState: { efforts: new Map([[0, new Effort(0, 0, 15 * 60, "", DateTime.fromObject({ year: 2020, day: 15, hour: 10, minute: 15 }))]])}, ignoreTasks: new Map([[task.id, task]]), expectedSize: 0 })
    testTasksAndEffortsForInterval({ effortsState, ignoreTasks, expectedSize }) {
        const effortsStore = useEffortsStore()
        const tasksStore = useTasksStore()

        effortsStore.efforts = effortsState.efforts
        tasksStore.tasks = tasksState.tasks

        jest.spyOn(effortsStore, "effortsPerTask")
        const result = tasksStore.tasksAndEffortsForInterval(interval, ignoreTasks)
        expect(result.length).toBe(expectedSize)
        if (expectedSize !== 0) {
            expect(result[0][1].size).toBe(expectedSize)
            // @ts-ignore
            expect(effortsStore.effortsPerTask.mock).toHaveBeenCalled
        }
    }

    after() {
        // This is not strictly necessary here, but servers as an example.
        // If mockImplementationOnce would be used abvoe instead of mockImplementation, the tests
        // would pass even without this cleanup.
        jest.restoreAllMocks()
    }
}
