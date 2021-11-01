/**
 * @description: 是否是移动端设备
 * @return {Boolean}
 */
export const isMobile = () => {
    if (
        window.navigator.userAgent.match(
            /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
        ) ||
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    ) {
        return true
    }
    return false
}
