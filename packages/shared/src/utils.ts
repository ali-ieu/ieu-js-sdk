function isNative(): boolean {
    return /HYSDK/gi.test(navigator.userAgent) || /** 兼容客户端某些异常场景 */ Boolean(window['webkit'])
}

function logError(errorMsg: string, throwInDev = true): void {
    if (throwInDev) {
        throw new Error(errorMsg)
    } else {
        console.error(errorMsg)
    }
}
export { isNative, logError }
