export interface Serialized extends Record<string, unknown> {}

export interface Serializable<Serialized> {
  serialize(): Serialized
}

export interface Existing<Serialized> extends Serializable<Serialized> {
  id: number
}
