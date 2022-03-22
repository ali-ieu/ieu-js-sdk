import { SocialShare, ShareParams } from '../src/index'
import { EjoySDK } from '@ali-ieu/ejoysdk'

Object.defineProperties(window.navigator, {
    userAgent: {
        writable: true,
    },
})

describe('Social Share', () => {
    let share: SocialShare
    const params: ShareParams = {
        title: 'title',
        message: 'message',
        link: 'https://example.com',
        medias: ['https://abc.png'],
    }
    const success = { code: 0, msg: '网页分享成功' }

    beforeEach(() => {
        share = new SocialShare({ platform: 'web' })
    })

    it('QZoneShare: web', async () => {
        global.open = jest.fn()
        const result = await share.QQ({
            type: 'qzone',
            ...params,
        })
        expect(global.open).toBeCalled()
        expect(global.open).toMatchSnapshot()
        expect(result).toEqual(success)
    })

    it('QQMessengerShare: web', async () => {
        global.open = jest.fn()
        const result = await share.QQ({
            type: 'messenger',
            ...params,
        })
        expect(global.open).toBeCalled()
        expect(global.open).toMatchSnapshot()
        expect(result).toEqual(success)
    })

    it('QQMessengerShare: sdk', async () => {
        const fn = jest.spyOn(EjoySDK, 'share')
        fn.mockImplementation((_arg1, _arg2, { onSuccess }: any) => onSuccess({ code: 0 }))
        share = new SocialShare({ platform: 'native' })
        const result = await share.QQ(params)
        expect(result.code).toEqual(0)
        expect(fn).toBeCalled()
    })

    it('QQMessengerShare fail: sdk', async () => {
        const fn = jest.spyOn(EjoySDK, 'share')
        fn.mockImplementation((_arg1, _arg2, { onError }: any) => onError({ message: 'message' }))
        share = new SocialShare({ platform: 'native' })
        share.QQ({ ...params }).catch((err) => {
            expect(err.code).toEqual(-1)
            expect(fn).toBeCalled()
        })
    })

    it('FaceBookShare: web', async () => {
        global.open = jest.fn()
        const result = await share.FaceBook(params)
        expect(global.open).toBeCalled()
        expect(global.open).toMatchSnapshot()
        expect(result).toEqual(success)
    })

    it('FaceBookShare: sdk', async () => {
        const fn = jest.spyOn(EjoySDK, 'share')
        fn.mockImplementation((_arg1, _arg2, { onSuccess }: any) => onSuccess({ code: 0 }))
        share = new SocialShare({ platform: 'native' })
        const result = await share.FaceBook(params)
        expect(result.code).toEqual(0)
        expect(fn).toBeCalled()
    })

    it('FaceBookShare fail: sdk', async () => {
        const fn = jest.spyOn(EjoySDK, 'share')
        fn.mockImplementation((_arg1, _arg2, { onError }: any) => onError({ message: 'message' }))
        share = new SocialShare({ platform: 'native' })
        share.FaceBook({ ...params }).catch((err) => {
            expect(err.code).toEqual(-1)
            expect(fn).toBeCalled()
        })
    })

    it('Twitter: web', async () => {
        global.open = jest.fn()
        const result = await share.Twitter(params)
        expect(global.open).toBeCalled()
        expect(global.open).toMatchSnapshot()
        expect(result).toEqual(success)
    })

    it('SinaShare: web', async () => {
        global.open = jest.fn()
        const result = await share.Sina(params)
        expect(global.open).toBeCalled()
        expect(global.open).toMatchSnapshot()
        expect(result).toEqual(success)
    })

    it('SinaShare: sdk', async () => {
        const fn = jest.spyOn(EjoySDK, 'share')
        fn.mockImplementation((_arg1, _arg2, { onSuccess }: any) => onSuccess({ code: 0 }))
        share = new SocialShare({ platform: 'native' })
        const result = await share.Sina(params)
        expect(result.code).toEqual(0)
        expect(fn).toBeCalled()
    })

    it('SinaShare fail: sdk', async () => {
        const fn = jest.spyOn(EjoySDK, 'share')
        fn.mockImplementation((_arg1, _arg2, { onError }: any) => onError({ message: 'message' }))
        share = new SocialShare({ platform: 'native' })
        share.Sina({ ...params }).catch((err) => {
            expect(err.code).toEqual(-1)
            expect(fn).toBeCalled()
        })
    })

    it('wecharShare: web', async () => {
        const updateAppMessageShareData = jest.fn()
        const updateTimelineShareData = jest.fn()
        const config = jest.fn()
        const ready = jest.fn().mockImplementation((callback) => callback())
        Object.defineProperty(global, 'wx', {
            writable: true,
            value: {
                updateAppMessageShareData,
                updateTimelineShareData,
                config,
                ready,
            },
        })
        Object.defineProperty(global.navigator, 'userAgent', {
            writable: true,
            value: 'MicroMessenger',
        })
        share = new SocialShare({
            platform: 'web',
            wxConfig: {
                appId: 'test',
                timestamp: Date.now(),
                nonceStr: 'test',
                signature: 'test',
                jsApiList: ['test1'],
            },
        })
        const result = await share.WeChat({ ...params })
        expect(result.code).toEqual(0)
        expect(updateAppMessageShareData).toBeCalled()
        expect(updateTimelineShareData).toBeCalled()
    })

    it('wecharShare: sdk', async () => {
        const fn = jest.spyOn(EjoySDK, 'share')
        fn.mockImplementation((_arg1, _arg2, { onSuccess }: any) => onSuccess({ code: 0 }))
        Object.defineProperty(window, 'prompt', {
            writable: true,
            value: () => '',
        })
        Object.defineProperty(global.navigator, 'userAgent', {
            writable: true,
            value: 'android;HYSDK',
        })
        share = new SocialShare({
            platform: 'native',
        })
        const result = await share.WeChat({ ...params })
        expect(result.code).toEqual(0)
        expect(fn).toBeCalled()
    })

    it('wecharShare fail: sdk', async () => {
        const fn = jest.spyOn(EjoySDK, 'share')
        fn.mockImplementation((_arg1, _arg2, { onError }: any) => onError({ message: 'message' }))
        Object.defineProperty(window, 'prompt', {
            writable: true,
            value: () => '',
        })
        Object.defineProperty(global.navigator, 'userAgent', {
            writable: true,
            value: 'android;HYSDK',
        })
        share = new SocialShare({
            platform: 'native',
        })
        share.WeChat({ ...params }).catch((err) => {
            expect(err.code).toEqual(-1)
            expect(fn).toBeCalled()
        })
    })
})
