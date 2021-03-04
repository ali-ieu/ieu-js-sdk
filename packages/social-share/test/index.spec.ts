import { SocialShare, ShareParams } from '../src/index'

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

    it('FaceBookShare: web', async () => {
        global.open = jest.fn()
        const result = await share.FaceBook(params)
        expect(global.open).toBeCalled()
        expect(global.open).toMatchSnapshot()
        expect(result).toEqual(success)
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
})
