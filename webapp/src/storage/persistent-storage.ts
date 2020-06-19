export type PersistentStorageKey = "token";

export namespace PersistentStorage {
    export function set(key: PersistentStorageKey, value: string) {
        localStorage.setItem(key, value);
    }

    export function get(key: PersistentStorageKey) {
        return localStorage.getItem(key);
    }

    export function remove(key: PersistentStorageKey) {
        localStorage.removeItem(key);
    }
}
