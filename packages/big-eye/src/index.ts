import initBrowserLogger from './thirdParty/logger/index'
let _envFlag = 'development'
let BrowserLogger: any

function getImgNaturalDimensions(img: HTMLImageElement): number[] {
    let nWidth = 0,
        nHeight = 0
    if (img.naturalWidth) {
        nWidth = img.naturalWidth
        nHeight = img.naturalHeight
    }
    return [nWidth, nHeight]
}

const mutationCallback: MutationCallback = function (mutationsList) {
    mutationsList.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
            dfs(node, function (node) {
                function onLoadImage(): void
                function onLoadImage(img?: HTMLImageElement): void {
                    const params = img === undefined ? (node as HTMLImageElement) : img
                    const [nWidth, nHeight] = getImgNaturalDimensions(params)
                    const minLen = Math.min(nWidth, nHeight)
                    // 2倍屏设计稿750x1334
                    if (minLen > 750) {
                        if (_envFlag === 'development') {
                            // 颠倒和高亮
                            const _node = node as HTMLElement
                            _node.style.transform = 'rotate(180deg)'
                            _node.style.backgroundColor = 'royalblue'
                        } else {
                            // 上报
                            const imgSrc = img === undefined ? (node as HTMLMediaElement).currentSrc : img.currentSrc
                            BrowserLogger.avg(imgSrc, minLen)
                        }
                    }
                }
                // node.currentStyle 兼容 IE、FireFox
                const style = (node as any).currentStyle || window.getComputedStyle(node as HTMLElement)
                if (
                    (node as HTMLElement).attributes &&
                    ((node as HTMLElement).attributes as any).mmtrust &&
                    ((node as HTMLElement).attributes as any).mmtrust.nodeValue === 'true'
                ) {
                    return
                }
                if ((node as HTMLElement).tagName === 'IMG') {
                    node.addEventListener('load', onLoadImage, false)
                } else if (style.backgroundImage != 'none') {
                    const img = new Image()
                    img.addEventListener('load', onLoadImage.bind(null, img), false)
                    img.src = style.backgroundImage.slice(4, -1).replace(/"/g, '')
                }
            })
        })
    })
}

function dfs(parentNode: any, cb: (node: Node) => void) {
    if (!parentNode) return
    cb(parentNode)
    console.log(parentNode)
    if (parentNode.children) {
        Array.prototype.forEach.call(parentNode.children, function (child) {
            dfs(child, cb)
        })
    }
}

function monitorInit(target: HTMLElement, config?: MutationObserverInit) {
    if (!window.MutationObserver) return
    config = {
        ...(config || {}),
        ...{ attributes: true, childList: true, subtree: true },
    }

    const observer = new MutationObserver(mutationCallback)
    observer.observe(target, config)
}

function BigEye({ targetId, envFlag, loggerConfig }: IEntry) {
    const targetObj = document.getElementById(targetId || 'app')
    envFlag && (_envFlag = envFlag)

    BrowserLogger = initBrowserLogger({
        env: envFlag,
        ...loggerConfig,
    })
    if (targetObj) {
        document.addEventListener('DOMContentLoaded', function () {
            monitorInit(targetObj)
        })
    }
}

export { BigEye, BrowserLogger }
