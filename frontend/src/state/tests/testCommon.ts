import { params, suite } from "@testdeck/jest"

import { updateOrDeleteInMap } from "src/state/common"


@suite class EffortsModuleTests {
    @params({ stateItems: new Map([[1, "one"]]), items: new Map([[2, "two"]]), expected: new Map([[1, "one"], [2, "two"]])})
    @params({ stateItems: new Map([[1, "one"], [2, "two"]]), items: new Map([[2, undefined]]), expected: new Map([[1, "one"]])})
    testUpdateOrDeleteInMap({ stateItems, items, expected} ) {
        updateOrDeleteInMap(stateItems, items)

        expect(stateItems.size).toBe(expected.size)
        for (const [id, item] of items) {
            expect(stateItems.get(id)).toBe(item)
        }
    }
}
