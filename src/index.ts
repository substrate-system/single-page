export interface PushFunction {
    (href:string):void;
    push:(href:string) => void;
    show:(href:string) => void;
}

export function singlePage (
    cb:((href:string, opts)=>void),
    opts:{ pushState:typeof history.pushState }
) {
    const page = new Page(cb, opts)
    window.addEventListener('popstate', onpopstate)

    function onpopstate () {
        const href = getPath()
        page.show(href, { popstate: true })
    }
    setTimeout(onpopstate, 0)

    const fn:PushFunction = function (href) { return page.show(href) }
    fn.push = function (href) { return page.push(href) }
    fn.show = function (href) { return page.show(href) }
    return fn
}

class Page {
    current:string|null = null;
    hasPushState:boolean|typeof window.history.pushState = false;
    scroll;
    cb:((href:string, opts)=>void)|null = null;

    constructor (
        cb,
        opts:{
            pushState: undefined|typeof history.pushState
        } = { pushState: undefined }
    ) {
        this.hasPushState = (opts.pushState !== undefined ?
            opts.pushState :
            (window.history && window.history.pushState)
        )
        this.cb = cb
    }

    show (href, opts = { popstate: false }) {
        href = href.replace(/^\/+/, '/')

        if (this.current === href) return
        this.saveScroll()
        this.current = href

        const scroll = this.scroll[href]
        this.pushHref(href)

        this.cb && this.cb(href, {
            popstate: opts.popstate,
            scrollX: (scroll && scroll[0]) || 0,
            scrollY: (scroll && scroll[1]) || 0
        })
    }

    saveScroll () {
        if (this.scroll && this.current) {
            this.scroll[this.current] = [window.scrollX, window.scrollY]
        }
    };

    pushHref (href:string) {
        this.current = href
        const mismatched = getPath() !== href
        if (mismatched) window.history.pushState(null, '', href)
    }

    push (href:string) {
        href = href.replace(/^\/+/, '/')
        this.saveScroll()
        this.pushHref(href)
    }
}

function getPath () {
    return window.location.pathname
        + (window.location.search || '')
        + (window.location.hash || '')
}

export default singlePage
