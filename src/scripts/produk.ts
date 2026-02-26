import { $, $$ } from "@/utils/dom"
import { slugify } from "@/utils/text"

type ProductData = {
  id: string
  label: string
  jenis: string
  ukuran: string
  kabko: string
  provinsi: string
  alamat: string
  imageSrc: string
  detailUrl: string
}

type FilterState = {
  kabko: string[]
  jenis: string[]
  ukuran: string[]
}

class ProductFilter {
  private items: ProductData[]
  private filteredItems: ProductData[]
  private filters: FilterState = { kabko: [], jenis: [], ukuran: [] }

  // Pagination
  private currentPage: number = 1
  private itemsPerPage: number = 16

  // DOM Elements
  private gridContainer: HTMLElement
  private paginationContainer: HTMLElement
  private template: HTMLTemplateElement
  private statusElement: HTMLElement

  constructor(
    data: ProductData[],
    gridSelector: string,
    paginationSelector: string,
    templateSelector: string,
    itemsPerPage: number = 16
  ) {
    this.items = data
    this.filteredItems = [...data]
    this.itemsPerPage = itemsPerPage

    this.gridContainer = $<HTMLElement>(gridSelector)!
    this.paginationContainer = $<HTMLElement>(paginationSelector)!
    this.template = $<HTMLTemplateElement>(templateSelector)!
    this.statusElement = $<HTMLElement>('[data-role="filter-status"]')!

    this.init()
  }

  private init(): void {
    // 1. Read URL Params
    this.readURLParams()

    // 2. Sync UI to match URL Params
    this.syncUI()

    // 3. Initial Render
    this.applyFilters()
    this.bindEvents()

    // 4. Listen for history changes (Back/Forward)
    window.addEventListener("popstate", () => {
      this.readURLParams()
      this.syncUI()
      this.applyFilters()
    })
  }

  private bindEvents(): void {
    // Filter Inputs and Selects
    const filters = document.querySelectorAll<HTMLElement>("[data-group]")
    filters.forEach(el => {
      el.addEventListener("change", () => {
        this.handleFilterChange()
      })
    })

    // Pagination Click delegation
    this.paginationContainer.addEventListener("click", e => {
      const target = e.target as HTMLElement
      const btn = target.closest("button")
      if (!btn || btn.disabled) return

      const page = btn.dataset.page
      if (page) {
        this.goToPage(parseInt(page))
      }
    })

    // Reset Button (optional)
    const resetBtn = $('[data-role="reset-filter"]')
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        // Reset UI inputs
        const inputs = document.querySelectorAll<HTMLElement>("[data-group]")
        inputs.forEach(el => {
          if (el instanceof HTMLInputElement) {
            if (el.type === "radio" && el.value === "" && el.checked === false) el.click()
          } else if (el instanceof HTMLSelectElement) {
            el.value = ""
            el.dispatchEvent(new Event("change"))
          }
        })
      })
    }
  }

  private readURLParams(): void {
    const params = new URLSearchParams(window.location.search)

    // Filters (assumed to be slugs already)
    this.filters.jenis = params.getAll("jenis")
    this.filters.ukuran = params.getAll("ukuran")
    this.filters.kabko = params.getAll("kabko")

    // Pagination
    const page = params.get("page")
    this.currentPage = page ? parseInt(page) : 1
  }

  private updateURL(): void {
    const params = new URLSearchParams()

    // Filters are already slugs in state
    this.filters.jenis.forEach(val => params.append("jenis", val))
    this.filters.ukuran.forEach(val => params.append("ukuran", val))
    this.filters.kabko.forEach(val => params.append("kabko", val))

    // Pagination (only if > 1)
    if (this.currentPage > 1) {
      params.set("page", String(this.currentPage))
    }

    const queryString = params.toString()
    const newURL = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname
    window.history.replaceState({}, "", newURL)
  }

  private syncUI(): void {
    // Reset all first
    document.querySelectorAll<HTMLInputElement>("input[data-group]").forEach(el => {
      if (el.type === "radio")
        el.checked = el.value === "" // Default to 'Semua' if empty
      else if (el.type === "checkbox") el.checked = false
    })
    document
      .querySelectorAll<HTMLSelectElement>("select[data-group]")
      .forEach(el => (el.value = ""))

    // Apply values from state (Slugs)
    const setGroupValue = (group: string, slugValues: string[]) => {
      const elements = document.querySelectorAll<HTMLElement>(`[data-group="${group}"]`)
      elements.forEach(el => {
        if (el instanceof HTMLInputElement) {
          if (el.type === "radio") {
            // el.value is Raw (e.g. "Baliho"). slugify it to compare.
            const elSlug = el.value ? slugify(el.value) : ""

            if (slugValues.length > 0 && slugValues.includes(elSlug)) el.checked = true
            else if (slugValues.length === 0 && el.value === "") el.checked = true // 'Semua'
          }
        } else if (el instanceof HTMLSelectElement) {
          if (slugValues.length > 0) {
            // Find option where slugify(opt.value) matches slugValue
            const option = Array.from(el.options).find(
              opt => slugify(opt.value) === slugValues[0] && opt.value !== ""
            )
            if (option) el.value = option.value
          }
        }
      })
    }

    setGroupValue("jenis", this.filters.jenis)
    setGroupValue("ukuran", this.filters.ukuran)
    setGroupValue("kabko", this.filters.kabko)
  }

  private handleFilterChange(): void {
    // Read state from DOM and CONVERT TO SLUGS
    const getFilterValues = (group: string) => {
      const elements = $$<HTMLElement>(`[data-group="${group}"]`)
      const values: string[] = []

      elements.forEach(el => {
        if (el instanceof HTMLInputElement) {
          if (el.checked && el.value !== "") values.push(slugify(el.value))
        } else if (el instanceof HTMLSelectElement) {
          if (el.value !== "") values.push(slugify(el.value))
        }
      })
      return values
    }

    this.filters.jenis = getFilterValues("jenis")
    this.filters.ukuran = getFilterValues("ukuran")
    this.filters.kabko = getFilterValues("kabko")

    this.currentPage = 1 // Reset to page 1 on filter change
    this.applyFilters()
    this.updateURL()
  }

  private applyFilters(): void {
    // Filters are Slugs. Items are Raw.
    const hasMatch = (filters: string[], itemValue: string) => {
      if (filters.length === 0) return true
      // filters are already slugs, so we slugify itemValue to compare
      return filters.includes(slugify(itemValue))
    }

    this.filteredItems = this.items.filter(item => {
      const matchJenis = hasMatch(this.filters.jenis, item.jenis)
      const matchUkuran = hasMatch(this.filters.ukuran, item.ukuran)
      const matchKabko = hasMatch(this.filters.kabko, item.kabko)

      return matchJenis && matchUkuran && matchKabko
    })

    this.render()
  }

  private render(): void {
    this.renderGrid()
    this.renderPagination()
    this.updateStatus()
  }

  private renderGrid(): void {
    this.gridContainer.innerHTML = ""

    if (this.filteredItems.length === 0) {
      this.gridContainer.innerHTML = `
          <div class="col-span-full py-12 text-center text-gray-500">
            <p class="text-lg">Tidak ada produk yang sesuai kriteria.</p>
          </div>
        `
      return
    }

    // Pagination Slice
    const start = (this.currentPage - 1) * this.itemsPerPage
    const end = start + this.itemsPerPage
    const paginatedItems = this.filteredItems.slice(start, end)

    const fragment = document.createDocumentFragment()

    paginatedItems.forEach(item => {
      const clone = this.template.content.cloneNode(true) as DocumentFragment

      // Populate Data
      // Anchor Link
      const link = $<HTMLAnchorElement>("a", clone)
      if (link) {
        link.href = item.detailUrl
        link.dataset.id = item.id
      }

      // Badges
      const badgeJenis = $('[data-bind="jenis"]', clone)
      if (badgeJenis) badgeJenis.textContent = item.jenis

      const badgeUkuran = $('[data-bind="ukuran"]', clone)
      if (badgeUkuran) badgeUkuran.textContent = item.ukuran

      // Image
      const img = $<HTMLImageElement>("img", clone)
      if (img) {
        img.src = item.imageSrc
        img.alt = item.label
        img.classList.add(`[view-transition-name:produk-img-${item.id}]`)
      }

      // Details
      const label = $('[data-bind="label"]', clone)
      if (label) label.textContent = item.label // Hidden usually

      const alamat = $('[data-bind="alamat"]', clone)
      if (alamat) alamat.textContent = item.alamat

      const kabko = $('[data-bind="kabko"]', clone)
      if (kabko) kabko.textContent = item.kabko

      const provinsi = $('[data-bind="provinsi"]', clone)
      if (provinsi) provinsi.textContent = item.provinsi

      fragment.appendChild(clone)
    })

    this.gridContainer.appendChild(fragment)
  }

  private renderPagination(): void {
    const totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage)
    this.paginationContainer.innerHTML = ""

    if (totalPages <= 1) return

    // Helper to create button
    const createBtn = (
      text: string | number,
      page: number,
      active: boolean = false,
      disabled: boolean = false
    ) => {
      const btn = document.createElement("button")
      btn.className = `
          flex h-10 w-10 items-center justify-center border text-sm font-medium
          ${
            active
              ? "border-blue-500 bg-blue-500 text-white"
              : "border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          }
        `
      btn.textContent = String(text)
      if (page > 0) btn.dataset.page = String(page)
      if (disabled) btn.disabled = true
      return btn
    }

    // Prev
    this.paginationContainer.appendChild(
      createBtn("«", this.currentPage - 1, false, this.currentPage === 1)
    )

    // Page Numbers (Simple loop for now, can be optimized for large pages)
    for (let i = 1; i <= totalPages; i++) {
      this.paginationContainer.appendChild(createBtn(i, i, i === this.currentPage))
    }

    // Next
    this.paginationContainer.appendChild(
      createBtn("»", this.currentPage + 1, false, this.currentPage === totalPages)
    )
  }

  private updateStatus(): void {
    if (this.statusElement) {
      const total = this.filteredItems.length
      const start = (this.currentPage - 1) * this.itemsPerPage + 1
      const end = Math.min(start + this.itemsPerPage - 1, total)

      this.statusElement.textContent =
        total > 0 ? `Menampilkan ${start}-${end} dari ${total} produk` : ""
    }
  }

  private goToPage(page: number): void {
    this.currentPage = page
    this.render()
    this.updateURL()
    // Smooth scroll only if needed
    this.gridContainer.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

// Initialization logic
const dataElement = document.getElementById("product-data")
const gridSelector = "#product-grid"
const paginationSelector = "#pagination-container"
const templateSelector = "#product-template"

if (dataElement) {
  const data = JSON.parse(dataElement.textContent || "[]")
  // Extract itemsPerPage from dataset or use default
  const itemsPerPage = Number(dataElement.dataset.itemsPerPage) || 16

  new ProductFilter(data, gridSelector, paginationSelector, templateSelector, itemsPerPage)
}
