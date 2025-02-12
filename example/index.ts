import { singlePage } from '../src/index.js'

singlePage((href) => {
    console.log('href', href)
},
{
    // do we want to handle this hash link?
    handleAnchor: (href) => {
        console.log('anchor...', href)
        return !href.includes('hello')
    }
})

const divs = {
    foo: document.querySelector('#foo'),
    bar: document.querySelector('#bar'),
    baz: document.querySelector('#baz')
}

const showPage = singlePage(function (href) {
    Object.keys(divs).forEach(function (key) {
        // first hide everything
        hide(divs[key])
    })

    const div = divs[href.replace(/^\//, '')]
    // then show the one that was clicked
    if (div) show(div)
    else show(divs.foo)
})

function hide (e) { e.style.display = 'none' }
function show (e) { e.style.display = 'block' }

const links = document.querySelectorAll('a[href]')

for (let i = 0; i < links.length; i++) {
    const link = links[i]
    link.addEventListener('click', function (ev) {
        ev.preventDefault()
        showPage(link.getAttribute('href')!)
    })
}
