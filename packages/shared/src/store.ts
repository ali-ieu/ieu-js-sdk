import { logError } from '.'

// localStorage may be unavailable in webview
function check() {
    if (__DEV__ && typeof window.localStorage === null) {
        console.error('window.localStorage is unavailable')
    }
}

type ExpiryData = {
    value: any
    expiry: number
    version: string
}

interface StoreOptions {
    version: string
    nameSpace: string
}
class Store {
    private nameSpace: string
    private version: string
    private store: Window['localStorage']
    constructor(options: StoreOptions) {
        check()
        this.nameSpace = options.nameSpace
        this.version = options.version
        this.store = window.localStorage
    }

    private getKey(key: string): string {
        if (!this.nameSpace) {
            if (__DEV__) {
                logError('[nameSpace] 尚未初始化')
            }
        }
        return this.nameSpace + ':' + key
    }

    setNameSpace(nameSpace: string): void {
        this.nameSpace = nameSpace
    }

    /**
     * expiry: 时间戳，过期时间
     */
    setItem(key: string, value: string | number | boolean | Record<string, any>, expiry: number): void {
        key = this.getKey(key)
        const expiryData: ExpiryData = {
            value,
            expiry,
            version: this.version,
        }
        this.store.setItem(key, JSON.stringify(expiryData))
    }

    getItem<T = any>(key: string): T | null {
        key = this.getKey(key)
        let result: ExpiryData | null = null
        try {
            result = JSON.parse(this.store.getItem(key) as string)
            if (result) {
                if (result.version === this.version) {
                    if (Date.now() < result.expiry) {
                        return result.value
                    } else {
                        // 失效移除
                        this.removeItem(key)
                        return null
                    }
                }
                return null
            }
        } catch (e: unknown) {
            console.error(e)
        }
        return null
    }

    removeItem(key: string): void {
        key = this.getKey(key)
        this.store.removeItem(key)
    }

    clear(): void {
        this.store.clear()
    }
}

export { Store }
