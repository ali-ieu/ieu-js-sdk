import { Env } from '../src/env'

describe('Env', () => {
    it('it throws error without setting Host or setting to falsy value', () => {
        const env = new Env({ host: '' })
        expect(() => env.getHost()).toThrowErrorMatchingSnapshot()
    })
    it('it could change host by setHost method', () => {
        const env = new Env({ host: 'https://a.com' })
        expect(env.getHost()).toBe('https://a.com')
    })
    it('it could automatically complete protocol', () => {
        const env = new Env({ host: 'a.com' })
        expect(env.getHost()).toBe('https://a.com')
    })
})
