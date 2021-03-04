import { logError } from '.'

interface EnvOption {
    host: string
    /** 使用裂变账号服务地址 */
    fissionURL?: string
}
class Env {
    private host: string
    private fissionURL?: string
    constructor(options: EnvOption) {
        this.host = this.completeHost(options.host)
        this.fissionURL = options.fissionURL
    }

    private completeHost(host: string) {
        if (!host) {
            return host
        }
        if (!/^https?/.test(host)) {
            return `https://` + host
        }
        return host
    }

    setHost(host: string): void {
        this.host = this.completeHost(host)
    }

    getHost(): string {
        if (!this.host) {
            if (__DEV__) {
                logError('[host] 尚未初始化，请按照文档指示，设置一个明确的 Host 值!')
            }
        }
        return this.host
    }

    getFissionURL(): string {
        if (!this.fissionURL) {
            if (__DEV__) {
                logError('[fissionURL] 尚未初始化，请按照文档指示，设置一个明确的 fissionURL 值!')
            }
        }
        return this.fissionURL ?? ''
    }
}

export { Env }
