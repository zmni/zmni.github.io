import { $, $$ } from "@/utils/dom"

// Mencegah eksekusi ganda pada DOM yang sama
if (document.getElementById("scroll-sentinel")) {
  throw new Error("Skrip index.astro dilewati: sudah dijalankan.")
}

/**
 * DOM
 */
const header = $<HTMLElement>("header")!
const navToggle = $<HTMLInputElement>("#nav-toggle", header)!
const nav = $<HTMLElement>("nav", header)!
const navLinks = $$<HTMLAnchorElement>("a[href]", nav)
const sections = $$<HTMLElement>("section")

/**
 * UTILS
 */
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

const headerOffset = () => 10

const scrollToY = (y: number) => {
  window.scrollTo({
    top: y,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  })
}

const closeMobileMenu = () => {
  if (navToggle) navToggle.checked = false
}

/**
 * NAV & HISTORY
 */
const navLinkMap = new Map<string, HTMLAnchorElement>()
const sectionIdToHash = new Map<string, string>()

navLinks?.forEach(link => {
  const url = new URL(link.href)
  const hashMatch = url.hash.match(/^#\/?(.+?)\/?$/)
  const id = hashMatch ? hashMatch[1] : null

  if (url.pathname === "/" && !url.hash) {
    navLinkMap.set("home", link)
  } else if (id) {
    sectionIdToHash.set(id, url.hash)
    navLinkMap.set(id, link)
  }
})

const clearLinkActive = () => {
  navLinks?.forEach(link => link.removeAttribute("aria-current"))
}

const setLinkActive = (key: string) => {
  const link = navLinkMap.get(key)
  clearLinkActive()
  if (link) {
    link.setAttribute("aria-current", "true")
  }
}

const updateHistory = (hash: string) => {
  const url = new URL(location.href)
  if (url.hash !== hash) {
    history.replaceState(null, "", hash || location.pathname)
  }
}

/**
 * SCROLL EVENT LOGIC (SIMPLIFIED)
 */
let isScrolling = false
let ignoreScrollSpy = false
let scrollTimeout: number

// Sentinel dummy untuk keseragaman pengecekan eksekusi ganda
const topSentinel = document.createElement("div")
topSentinel.id = "scroll-sentinel"
topSentinel.style.display = "none"
document.body.prepend(topSentinel)

const determineActiveSection = () => {
  const scrollY = window.scrollY

  // 1. Update Header Style
  header?.toggleAttribute("data-scrolled", scrollY > 0)

  // 2. Scroll Spy Logic
  if (ignoreScrollSpy) return

  // Cek posisi paling atas (Home)
  if (scrollY < 150) {
    setLinkActive("home")
    updateHistory("")
    return
  }

  // Cari section yang posisinya berada di tengah layar
  const midPoint = scrollY + window.innerHeight / 2
  let activeSectionId: string | null = null

  for (const section of sections) {
    const { offsetTop, offsetHeight } = section
    if (midPoint >= offsetTop && midPoint < offsetTop + offsetHeight) {
      activeSectionId = section.id
      break
    }
  }

  if (activeSectionId) {
    const hash = sectionIdToHash.get(activeSectionId)
    if (hash) {
      setLinkActive(activeSectionId)
      updateHistory(hash)
    } else {
      // Unlinked section
      clearLinkActive()
      updateHistory("")
    }
  } else {
    // Gap
    clearLinkActive()
    updateHistory("")
  }
}

const onScroll = () => {
  if (!isScrolling) {
    window.requestAnimationFrame(() => {
      determineActiveSection()
      isScrolling = false
    })
    isScrolling = true
  }
}

window.addEventListener("scroll", onScroll, { passive: true })

/**
 * SCROLL CONTROLLER
 */
const withScrollSpyIgnored = (fn: () => void, delay = 800) => {
  ignoreScrollSpy = true
  window.clearTimeout(scrollTimeout)
  fn()
  scrollTimeout = window.setTimeout(() => {
    ignoreScrollSpy = false
    determineActiveSection()
  }, delay)
}

const scrollToSection = (id: string) => {
  const target = document.getElementById(id)
  if (!target) return

  withScrollSpyIgnored(() => {
    scrollToY(target.offsetTop - headerOffset())
    setLinkActive(id)
  })
}

const scrollToTop = () => {
  withScrollSpyIgnored(() => {
    scrollToY(0)
    setLinkActive("home")
    updateHistory("")
  })
}

/**
 * LISTENERS & INIT
 */
document.addEventListener("click", event => {
  const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[href]")
  if (!link) return

  const url = new URL(link.href, location.origin)
  if (url.pathname !== location.pathname) return

  const hash = url.hash

  if (url.pathname === "/" && !hash) {
    event.preventDefault()
    scrollToTop()
    closeMobileMenu()
    return
  }

  if (hash.startsWith("#/")) {
    const id = hash.split("/")[1]
    if (sectionIdToHash.has(id)) {
      event.preventDefault()
      scrollToSection(id)
      closeMobileMenu()
    }
  }
})

const init = () => {
  const { hash } = location
  if (hash.startsWith("#/")) {
    const id = hash.split("/")[1]
    setTimeout(() => scrollToSection(id), 50)
  } else {
    determineActiveSection() // Run once on load
  }
}
requestAnimationFrame(init)
