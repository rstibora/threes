export function getStringEnumKeyByValue<T extends {[index: string]: string}>(stringEnum: T, value: string): keyof T {
    let keys = Object.keys(stringEnum).filter(x => stringEnum[x] == value);
    if (keys.length != 1) {
        throw Error(`Invalid value ${value} for ${stringEnum}`)
    }
    return keys[0]
}
