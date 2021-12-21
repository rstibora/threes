import { DateTime } from "luxon"


export enum EventType {
    START = "Start",
    PAUSE = "Pause",
}


export interface EffortSessionEventSerialized {
    id?: number
    sessionId: number
    eventType: string
}


export class NewEffortSessionEvent {
    sessionId: number
    eventType: EventType

    constructor(sessionId: number, eventType: EventType) {
        this.sessionId = sessionId
        this.eventType = eventType
    }

    serialize(): EffortSessionEventSerialized {
        return {
            sessionId: this.sessionId,
            eventType: this.eventType
        }
    }
}

export class EffortSessionEvent extends NewEffortSessionEvent {
    id: number

    constructor(id: number, sessionId: number, eventType: EventType) {
        super(sessionId, eventType)
        this.id = id
    }

    static deserialize(serialized: EffortSessionEventSerialized): EffortSessionEvent {
        if (serialized.id === undefined) {
            throw Error(`Can't deserialize EffortSessionEvent (${serialized}) with undefined id.`)
        }
        if (serialized.eventType != "S" && serialized.eventType != "P") {
            throw Error(`Invalid EventType: ${serialized.eventType}.`)
        }
        return new EffortSessionEvent(serialized.id, serialized.sessionId, 
                                      serialized.eventType === "S" ? EventType.START : EventType.PAUSE)
    }
}

export interface EffortSesssionSerialized {
    id?: number
    taskId: number
    description: string
    lastActive: string
}

export class NewEffortSession {
    taskId: number
    description: string
    lastActive: DateTime

    constructor(taskId: number, description: string, lastActive: DateTime) {
        this.taskId = taskId
        this.description = description
        this.lastActive = lastActive
    }
}

export class EffortSession extends NewEffortSession {
    id: number

    constructor(id: number, taskId: number, description: string, lastActive: DateTime) {
        super(taskId, description, lastActive)
        this.id = id
    }

    static deserialize(serialized: EffortSesssionSerialized): EffortSession {
        if (serialized.id === undefined) {
            throw Error(`Can't deserialize EffortSession (${serialized}) with undefined id.`)
        }
        return new EffortSession(serialized.id, serialized.taskId, serialized.description,
                                 DateTime.fromISO(serialized.lastActive))
    }
}
