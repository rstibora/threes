import { Existing, Serializable } from "src/network/models/basic"
import { useSessionStore } from "src/state/sessionStore"
import { MapById } from "src/utils/types"


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

export async function createItem<
  ItemSerialized,
  NewItem extends Serializable<ItemSerialized>,
  ExistingItem extends Existing<ItemSerialized>
  >(stateMap: MapById<ExistingItem>, item: NewItem,
    itemDeserializer: (_: ItemSerialized) => Readonly<ExistingItem>,
    apiPath: string): Promise<Readonly<ExistingItem>>
{
  const sessionStore = useSessionStore()
  const response = await sessionStore.fetchResource<ItemSerialized, ItemSerialized>(
    "POST", apiPath, item.serialize())
  const savedItem = itemDeserializer(response)
  updateOrDeleteInMap(stateMap, new Map([[savedItem.id, savedItem]]))
  return savedItem
}

export async function updateItem<
  ItemSerialized,
  ExistingItem extends Existing<ItemSerialized>
  >(stateMap: MapById<ExistingItem>, item: ExistingItem,
    itemDeserializer: (_: ItemSerialized) => Readonly<ExistingItem>,
    apiPath: string): Promise<Readonly<ExistingItem>>
{
  const sessionStore = useSessionStore()
  const response = await sessionStore.fetchResource<ItemSerialized, ItemSerialized>(
    "PUT", apiPath, item.serialize())
  const updatedItem = itemDeserializer(response)
  updateOrDeleteInMap(stateMap, new Map([[updatedItem.id, updatedItem]]))
  return updatedItem
}

export async function deleteItem<
  ItemSerialized,
  ExistingItem extends Existing<ItemSerialized>
  >(stateMap: MapById<ExistingItem>, item: ExistingItem, apiPath: string): Promise<void>
{
  const sessionStore = useSessionStore()
  await sessionStore.fetchResource("DELETE", apiPath)
  updateOrDeleteInMap(stateMap, new Map([[item.id, undefined]]))
}

export async function getItems<ItemSerialized,  ExistingItem extends Existing<ItemSerialized>
  >(stateMap: MapById<ExistingItem>, itemDeserializer: (_: ItemSerialized) => Readonly<ExistingItem>,
    apiPath: string): Promise<void>
{
  const sessionStore = useSessionStore()
  const response = await sessionStore.fetchResource<undefined, Array<ItemSerialized>>("GET", apiPath)
  for (const taskSerialized of response) {
    const task = itemDeserializer(taskSerialized)
    stateMap.set(task.id, task)
  }
}

export async function getItem<ItemSerialized, ExistingItem extends Existing<ItemSerialized>
  >(stateMap: MapById<ExistingItem>, itemDeserializer: (_: ItemSerialized) => Readonly<ExistingItem>,
    apiPath: string): Promise<Readonly<ExistingItem>>
{
  const sessionStore = useSessionStore()
  const response = await sessionStore.fetchResource<undefined, ItemSerialized>("GET", apiPath)
  const deserializedItem = itemDeserializer(response)
  updateOrDeleteInMap(stateMap, new Map([[deserializedItem.id, deserializedItem]]))
  return deserializedItem
}

export function getExistingItem<Item>(stateMap: MapById<Item>, itemId: number): Readonly<Item> {
  if (!stateMap.has(itemId)) {
    throw Error(`State map does not contain item with id ${itemId}.`)
  }
  return stateMap.get(itemId) as Item
}