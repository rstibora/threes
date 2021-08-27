import { MapById } from "src/utils/types";

export function updateOrDeleteInMap<T>(stateItems: MapById<T>, items: MapById<T | undefined>) {
    /**
     * Updates the state map with the provided items, deletes them instead if they are undefined.
     */
    for (const [id, item] of items) {
        if (item === undefined) {
            stateItems.delete(id)
        } else {
            stateItems.set(id, item)
        }
    }
}
