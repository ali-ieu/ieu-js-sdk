import { BigEye, BrowserLogger } from '../src'

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
})
