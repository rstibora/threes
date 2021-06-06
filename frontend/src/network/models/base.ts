export interface ExistingItem {
    id: number
}

export interface JsonSerializable<S> {
    serialize(): S
}
