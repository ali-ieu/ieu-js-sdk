import { EjoySDK, NativeShareParams } from '../src'

const shareParams: NativeShareParams = {
    title: 'title',
    message: 'message',
    content_url: 'https://example.com',
    media: [{ type: 'image_url', data: 'https://example.com/a.png' }],
}

// mock HYSDK webview
Object.defineProperty(window.navigator, 'userAgent', {
    value: 'android;HYSDK',
})

Object.defineProperty(window, 'prompt', {
    value: () => '',
})

describe('ejoysdk', () => {
    afterEach(() => {
        // 重置
        EjoySDK.eventsId = '1000'
    })

    it('it is in mock valid webview', () => {
        expect(window.navigator.userAgent).toBe('android;HYSDK')
        expect(EjoySDK.isInWebview()).toBe(true)
    })

    it('test event success', () => {
        const result = 'success'

        EjoySDK.share('qq_share_messenger', shareParams, (err, result) => {
            if (err) {
                return
            }
            expect(result).toBe(result)
        })
        expect(EjoySDK.eventsId).toBe('1001')
        EjoySDK.nativeCallback(EjoySDK.eventsId, {
            retval: {
                result,
            },
        })
    })
    it('test event error', () => {
        const error = 'error'

        expect(EjoySDK.isInWebview()).toBe(true)
        EjoySDK.share('qq_share_messenger', shareParams, (err, result) => {
            if (err) {
                expect(err).toEqual(new Error(error))
            }
            expect(result).toBe(undefined)
        })
        expect(EjoySDK.eventsId).toBe('1001')
        EjoySDK.nativeCallback(EjoySDK.eventsId, {
            error,
        })
    })
})
