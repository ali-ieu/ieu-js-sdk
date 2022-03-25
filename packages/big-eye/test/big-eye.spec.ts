import { BigEye, BrowserLogger } from '../src'
import * as Utils from '../src/utils'

describe('big-eye', () => {
    it('test event success', () => {
        BigEye({
            targetId: 'app',
            envFlag: 'prod',
            loggerConfig: {
                release: '1.0.0',
                pid: 'dsv9zcel92@d92a991af7669c9',
                c1: 'test',
            },
        })
        expect(BrowserLogger).not.toBe(undefined)
    })

    it('test event when current environment is mobile and dom of image is inserted', async () => {
        jest.useFakeTimers()
        const div = document.createElement('div')
        div.id = 'app'
        document.body.appendChild(div)
        const mock = jest.spyOn(Utils, 'isMobile')
        mock.mockReturnValueOnce(true)
        document.addEventListener = jest.fn().mockImplementationOnce((_, callback) => {
            callback()
        })
        BigEye({
            targetId: 'app',
            envFlag: 'prod',
            loggerConfig: {
                release: '1.0.0',
                pid: 'dsv9zcel92@d92a991af7669c9',
                c1: 'test',
            },
        })
        expect(document.addEventListener).toBeCalledWith('DOMContentLoaded', expect.any(Function))
        jest.advanceTimersByTime(300)
        const app = document.querySelector('#app')
        if (app) {
            const fn = jest.spyOn(BrowserLogger, 'avg')
            const img = new Image()
            img.src = 'test.jpg'
            app.appendChild(img)
            const mockAddEventListener = jest.spyOn(img, 'addEventListener')
            mockAddEventListener.mockImplementation((type, onLoadImage: any, _) => {
                if (type === 'load') {
                    onLoadImage({
                        naturalWidth: 751,
                        naturalHeight: 1335,
                    })
                    expect(fn).toBeCalled()
                }
            })
        }
    })
})
