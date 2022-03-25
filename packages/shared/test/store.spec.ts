import { Store } from '../src/store'

jest.useFakeTimers()

class LocalStorage {
    store: Record<string, any> = {}
    setItem = (key: string, val: any) => (this.store[key] = val)
    getItem = (key: string) => this.store[key]
    removeItem = (key: string) => {
        delete this.store[key]
    }
    clear = () => (this.store = {})
}

Object.defineProperty(window, 'localStorage', {
    value: new LocalStorage(),
})

describe('store', () => {
    beforeEach(() => {
        localStorage.clear()
    })
    it('it throws error without setting nameSpace or setting falsy value', () => {
        const store = new Store({ nameSpace: '', version: '1.0.0' })
        expect(() => store.getItem('foo')).toThrowErrorMatchingSnapshot()
    })
    it('it will return null if value expires', async () => {
        const store = new Store({ nameSpace: 'foo', version: '1.0.0' })
        store.setItem('bar', 'bar', Date.now() + 1000)

        // 还未失效
        expect(store.getItem('bar')).toBe('bar')

        // 2s 后已经 token 失效
        setTimeout(() => {
            expect(store.getItem('bar')).toBe(null)
        }, 2000)
    })

    it('it can set namespace', () => {
        const store = new Store({ nameSpace: '', version: '1.0.0' })
        store.setNameSpace('test')
        store.setItem('bar', 'bar', Date.now() + 1000)
        expect(store.getItem('bar')).toBe('bar')
    })

    it('it can remove item', () => {
        const store = new Store({ nameSpace: 'nameSpace', version: '1.0.0' })
        store.setItem('bar', 'bar', Date.now() + 1000)
        store.setItem('foo', 'foo', Date.now() + 1000)
        expect(store.getItem('bar')).toBe('bar')
        store.removeItem('bar')
        expect(!!window.localStorage.getItem('namespace:bar')).toBeFalsy()
    })

    it('it supports clear', () => {
        const store = new Store({ nameSpace: 'nameSpace', version: '1.0.0' })
        store.setItem('bar', 'bar', Date.now() + 1000)
        expect(store.getItem('bar')).toBe('bar')
        store.clear()
        expect(window.localStorage.store).toMatchObject({})
    })

    it('it will fail', () => {
        const store = new Store({ nameSpace: 'nameSpace', version: '1.0.0' })
        store.setItem('bar', 'bar', Date.now() + 1000)
        expect(store.getItem('bar')).toBe('bar')
        store.clear()
        expect(store.getItem('bar')).toBe(null)
    })
})
