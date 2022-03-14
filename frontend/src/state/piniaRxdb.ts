import { PiniaPluginContext } from "pinia"
import { createRxDatabase, RxCollectionCreator } from 'rxdb/plugins/core'
import { getRxStorageDexie } from 'rxdb/plugins/dexie'
import { markRaw } from "vue"


declare module "pinia" {
  export interface DefineStoreOptionsBase<S, Store> {
    schemaName?: string
  }
}

export async function prepareRxdbPlugin(schemas: Record<string, RxCollectionCreator>) {
  const database = await createRxDatabase({
    name: "threes-rxdb",
    storage: getRxStorageDexie(),
  })

  await database.addCollections(schemas)
  console.debug(schemas)

  return (context: PiniaPluginContext) => {
    context.store.$subscribe(() => console.debug("YOLO"))

    return { rxdb: markRaw(database), schemaName: context.options.schemaName }
  }
}
  