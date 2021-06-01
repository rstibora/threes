export interface JsonDeserializable<S> {
    new (serialized: S): JsonSerializable<S>
}

export interface JsonSerializable<S> {
    serialize(): S
}

export function deserialize<S>(ctor: JsonDeserializable<S>, serialized: S): JsonSerializable<S> {
    return new ctor(serialized)
}
