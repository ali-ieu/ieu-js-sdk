import { isNative } from '@ali-ieu/shared'
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
    writable: true,
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
        expect(isNative()).toBe(true)
    })

    it('test event success', () => {
        const result = 'success'

        EjoySDK.share('qq_share_messenger', shareParams, {
            onSuccess: (res) => expect(res).toBe(res),
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

        expect(isNative()).toBe(true)
        EjoySDK.share('qq_share_messenger', shareParams, {
            onSuccess: (res) => expect(res).toBe(undefined),
            onError: (err) => expect(err).toEqual(new Error(error)),
        })
        expect(EjoySDK.eventsId).toBe('1001')
        EjoySDK.nativeCallback(EjoySDK.eventsId, {
            error,
        })
    })
    it('test ios when webViewJSinterface exits', () => {
        Object.defineProperties(navigator, {
            platform: {
                writable: true,
                value: 'iPad',
            },
            userAgent: {
                value: 'HYSDK',
                writable: true,
            },
        })
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { EjoySDK } = require('../src')
        const testFn = jest.fn()
        const windowSpy = jest.spyOn(window, 'window', 'get')
        windowSpy.mockImplementation(
            () =>
                ({
                    webkit: {
                        messageHandlers: { jsinterface: { postMessage: testFn } },
                    },
                } as any),
        )
        EjoySDK.callSync('test')
        expect(testFn).toBeCalled()
        windowSpy.mockRestore()
    })

    it("test ios when webViewJSinterface doesn't exits", () => {
        Object.defineProperties(navigator, {
            platform: {
                writable: true,
                value: 'iPad',
            },
            userAgent: {
                value: 'HYSDK',
                writable: true,
            },
        })
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { EjoySDK } = require('../src')
        const windowSpy = jest.spyOn(window, 'window', 'get')
        windowSpy.mockImplementation(() => ({} as any))
        EjoySDK.callSync('test')
        expect(EjoySDK.eventsId).toBe('1001')
        windowSpy.mockRestore()
    })

    it('test pc', () => {
        Object.defineProperties(navigator, {
            platform: {
                writable: true,
                value: '',
            },
            userAgent: {
                value: 'window;HYSDK',
                writable: true,
            },
        })
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { EjoySDK } = require('../src')
        const testFn = jest.fn()
        const windowSpy = jest.spyOn(window, 'window', 'get')
        windowSpy.mockImplementation(
            () =>
                ({
                    chrome: {
                        webview: { postMessage: testFn },
                    },
                } as any),
        )
        EjoySDK.callSync('test')
        expect(testFn).toBeCalled()
        windowSpy.mockRestore()
    })

    it('test other', () => {
        Object.defineProperties(navigator, {
            platform: {
                value: '',
            },
            userAgent: {
                value: '',
            },
        })
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { EjoySDK } = require('../src')
        EjoySDK.nativeCallback(EjoySDK.eventsId, {
            error: 'error',
        })
    })

    it('test isAliHYApp', () => {
        Object.defineProperties(navigator, {
            platform: {
                value: '',
            },
            userAgent: {
                value: '',
            },
        })
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { EjoySDK } = require('../src')
        expect(EjoySDK.isAliHYApp()).toBeFalsy()
    })

    it('test getStartupData function', () => {
        Object.defineProperties(navigator, {
            platform: {
                writable: true,
                value: 'iPad',
            },
            userAgent: {
                value: 'HYSDK',
                writable: true,
            },
        })
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { EjoySDK } = require('../src')
        const fn = jest.spyOn(EjoySDK, 'callSync')
        EjoySDK.getStartupData()
        expect(fn).toBeCalled()
        fn.mockRestore()
    })

    it('test checkShareType function', () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { EjoySDK } = require('../src')
        const fn = jest.spyOn(EjoySDK, 'callAsync')
        EjoySDK.checkShareType()
        expect(fn).toBeCalled()
        fn.mockRestore()
    })

    it('test transparentBackground function', () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { EjoySDK } = require('../src')
        const fn = jest.spyOn(EjoySDK, 'callSync')
        EjoySDK.transparentBackground()
        expect(fn).toBeCalled()
        fn.mockRestore()
    })

    it('test closeBrowser function', () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { EjoySDK } = require('../src')
        const fn = jest.spyOn(EjoySDK, 'callSync')
        EjoySDK.closeBrowser({})
        expect(fn).toBeCalled()
        fn.mockRestore()
    })

    it('test notifyLuaAsync function', () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { EjoySDK } = require('../src')
        const fn = jest.spyOn(EjoySDK, 'callAsync')
        EjoySDK.notifyLuaAsync({})
        expect(fn).toBeCalled()
        fn.mockRestore()
    })

    it('test notifyLuaSync function', () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { EjoySDK } = require('../src')
        const fn = jest.spyOn(EjoySDK, 'callSync')
        EjoySDK.notifyLuaSync({})
        expect(fn).toBeCalled()
        fn.mockRestore()
    })

    it('test enableDebug function', () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { EjoySDK } = require('../src')
        const fn = jest.spyOn(EjoySDK, 'callSync')
        EjoySDK.enableDebug()
        expect(fn).toBeCalled()
        fn.mockRestore()
    })

    it('test showCloseButton function', () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { EjoySDK } = require('../src')
        const fn = jest.spyOn(EjoySDK, 'callSync')
        EjoySDK.showCloseButton(true)
        expect(fn).toBeCalled()
        fn.mockRestore()
    })
})
