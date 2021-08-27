import { params, suite } from "@testdeck/jest"

import { updateOrDeleteInMap } from "src/state/modules/moduleUtils"


@suite class EffortsModuleTests {
    @params({ stateItems: new Map([[1, "one"]]), items: new Map([[2, "two"]]), expected: new Map([[1, "one"], [2, "two"]])})
    testUpdateOrDeleteInMap({ stateItems, items, expected} ) {
        updateOrDeleteInMap(stateItems, items)
        expect(stateItems.size).toBe(expected.size)
    }
}
