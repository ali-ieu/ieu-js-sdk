import { setupPuppeteer, E2E_TIMEOUT, timeout } from './e2eUtils'
// you should add by yourself
import AirLine from '../example/airline.json'
import Lingxi from '../example/lingxi.json'

describe('e2e: full example', () => {
    const { page, text, click, value } = setupPuppeteer()

    beforeEach(() => {
        // TODO: 启动 serve.
    }, 2000)

    afterEach(() => {
        // TODO: 关闭 serve
    })

    it(
        'test airline login',
        async () => {
            await page().goto('http://localhost:5000/example/airline?a=1')
            expect(await text('#airline')).toBe('airline login')

            // 跳转三方授权登录页面
            const [response] = await Promise.all([page().waitForNavigation(), click('#airline')])
            if (response.frame()) {
                await page().focus('#account')
                await page().keyboard.type(AirLine.account)
                expect(await value('#account')).toBe(AirLine.account)

                await page().focus('#password')
                await page().keyboard.type(AirLine.password)
                expect(await value('#password')).toBe(AirLine.password)
                // 模拟表单提交
                await click('button[type="submit"]')

                // 等待重定向回 localhost
                await page().waitForSelector('#token')
                await timeout(2000)
                // 等待请求完成
                expect((await text('#token'))?.length).toBe(40)

                const str = await page().evaluate(() => window.localStorage.getItem('@ali-ieu/sdk:access_token:airline'))
                const data = JSON.parse(str ?? 'null')
                expect(data.value.accessToken).toBe(await text('#token'))
                expect(data.value.thirdPartyChannel).toBe('ariline')

                expect(await page().evaluate(() => location.href)).toBe('http://localhost:5000/example/airline?a=1')
            }
        },
        E2E_TIMEOUT,
    )

    it(
        'test lingxi login',
        async () => {
            await page().goto('http://localhost:5000/example/lingxi?a=1')
            expect(await text('#lingxi')).toBe('lingxi login')

            // 跳转三方授权登录页面
            const [response] = await Promise.all([page().waitForNavigation(), click('#lingxi')])
            if (response.ok()) {
                // 选中密码登录, 位于第二个 tab
                await page().click('.ant-tabs-tab:nth-child(2)')

                // 自动键入登录账号, 这个页面有两个 id mobile
                await page().focus('.ant-form:nth-child(2) #mobile')
                await page().keyboard.type(Lingxi.account)
                expect(await value('.ant-form:nth-child(2) #mobile')).toBe(Lingxi.account)

                await page().focus('#password')
                await page().keyboard.type(Lingxi.password)
                expect(await value('#password')).toBe(Lingxi.password)
                // 模拟表单提交
                await click('.ant-form:nth-child(2) button[type="submit"]')

                // 等待重定向回 localhost
                await page().waitForSelector('#token')
                // 等待请求完成
                await timeout(2000)
                expect((await text('#token'))?.length).toBe(40)

                const str = await page().evaluate(() => window.localStorage.getItem('@ali-ieu/sdk:access_token:lingxi'))
                const data = JSON.parse(str ?? 'null')
                expect(data.value.accessToken).toBe(await text('#token'))
                expect(data.value.thirdPartyChannel).toBe('lingxi')

                expect(await page().evaluate(() => location.href)).toBe('http://localhost:5000/example/lingxi?a=1')
            }
        },
        E2E_TIMEOUT,
    )
})
