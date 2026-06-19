const X01_LOCAL_STORAGE_KEYS = ['previousDartGame'];

export function clearX01LocalStorage(): void {
    X01_LOCAL_STORAGE_KEYS.forEach(key => {
        localStorage.removeItem(key);
    });
}
