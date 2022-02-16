import { DateTime } from "luxon"

import { Existing, Serializable } from "src/network/models/basic"
import { getStringEnumKeyByValue } from "src/utils/enum"


export enum EffortSessionState {
  RUNNING = "R",
  PAUSED = "P",
}

export interface EffortSesssionSerialized {
  id?: number
  task: number
  state: string
  last_active: string
  duration: number
  created: string
  description: string
}

export class NewEffortSession implements Serializable<EffortSesssionSerialized> {
  taskId: number
  state: EffortSessionState
  lastActive: DateTime
  duration: number
  created: DateTime
  description: string

  constructor(task: number, state: EffortSessionState, lastActive: DateTime, duration: number,
              created: DateTime, description?: string) {
    this.taskId = task
    this.state = state
    this.lastActive = lastActive
    this.duration = duration
    this.created = created
    this.description = description ? description : ""
  }

  serialize(): EffortSesssionSerialized {
    return {
      task: this.taskId,
      state: this.state,
      last_active: this.lastActive.toISO(),
      duration: Math.round(this.duration),
      created: this.created.toISO(),
      description: this.description
    }
  }
}

export class EffortSession extends NewEffortSession implements Existing<EffortSesssionSerialized> {
  id: number

  constructor(id: number, taskId: number, state: EffortSessionState, lastActive: DateTime, duration: number,
              created: DateTime, description?: string) {
    super(taskId, state, lastActive, duration, created, description)
    this.id = id
  }

  serialize(): EffortSesssionSerialized {
    return { id: this.id, ...super.serialize() }
  }
}

export function deserializeEffortSession(serialized: EffortSesssionSerialized): EffortSession {
  if (serialized.id === undefined) {
    throw Error(`Can't deserialize EffortSession (${serialized}) with undefined id.`)
  }
  return new EffortSession(serialized.id, serialized.task,
                           EffortSessionState[getStringEnumKeyByValue(EffortSessionState, serialized.state)],
                           DateTime.fromISO(serialized.last_active),
                           serialized.duration,
                           DateTime.fromISO(serialized.created),
                           serialized.description)
}
