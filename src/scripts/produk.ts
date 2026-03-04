import { $, $$ } from "@/utils/dom";
import { slugify } from "@/utils/text";

type ProductData = {
  id: string;
  label: string;
  jenis: string;
  ukuran: string;
  kabko: string;
  provinsi: string;
  alamat: string;
  imageSrc: string;
  detailUrl: string;
};

type FilterState = {
  kabko: string[];
  jenis: string[];
  ukuran: string[];
};

class ProductFilter {
  private items: ProductData[];
  private filteredItems: ProductData[];
  private filters: FilterState = { kabko: [], jenis: [], ukuran: [] };

  // Pagination
  private currentPage: number = 1;
  private itemsPerPage: number = 16;

  // DOM Elements
  private gridContainer: HTMLElement;
  private paginationContainer: HTMLElement;
  private template: HTMLTemplateElement;
  private statusElement: HTMLElement;

  constructor(
    data: ProductData[],
    gridSelector: string,
    paginationSelector: string,
    templateSelector: string,
    itemsPerPage: number = 16,
  ) {
    this.items = data;
    this.filteredItems = [...data];
    this.itemsPerPage = itemsPerPage;

    this.gridContainer = document.querySelector(gridSelector) as HTMLElement;
    this.paginationContainer = document.querySelector(paginationSelector) as HTMLElement;
    this.template = document.querySelector(templateSelector) as HTMLTemplateElement;
    this.statusElement = document.querySelector('[data-role="filter-status"]') as HTMLElement;

    this.init();
  }

  private init(): void {
    // 1. Read URL Params
    this.readURLParams();

    // 2. Sync UI to match URL Params
    this.syncUI();

    // 3. Initial Render
    this.applyFilters();
    this.bindEvents();

    // 4. Listen for history changes (Back/Forward)
    window.addEventListener("popstate", () => {
      this.readURLParams();
      this.syncUI();
      this.applyFilters();
    });
  }

  private bindEvents(): void {
    const filters = document.querySelectorAll("[data-group]") as NodeListOf<HTMLSelectElement>;
    filters.forEach((filter) => {
      filter.addEventListener("change", () => {
        this.handleFilterChange();
      });
    });

    // Pagination Click delegation
    this.paginationContainer.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const button = target.closest("button");
      if (!button || button.disabled) return;

      const page = button.dataset.page;
      if (page) {
        this.goToPage(parseInt(page));
      }
    });
  }

  private readURLParams(): void {
    const params = new URLSearchParams(window.location.search);

    // Filters (assumed to be slugs already)
    this.filters.kabko = params.getAll("kabko");
    this.filters.jenis = params.getAll("jenis");
    this.filters.ukuran = params.getAll("ukuran");

    // Pagination
    const page = params.get("page");
    this.currentPage = page ? parseInt(page) : 1;
  }

  private updateURL(): void {
    const params = new URLSearchParams();

    // Filters are already slugs in state
    this.filters.kabko.forEach((val) => params.append("kabko", val));
    this.filters.jenis.forEach((val) => params.append("jenis", val));
    this.filters.ukuran.forEach((val) => params.append("ukuran", val));

    // Pagination (only if > 1)
    if (this.currentPage > 1) {
      params.set("page", String(this.currentPage));
    }

    const queryString = params.toString();
    const newURL = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;
    window.history.replaceState({}, "", newURL);
  }

  private syncUI(): void {
    // Reset all first
    const allFilters = document.querySelectorAll(
      "select[data-group]",
    ) as NodeListOf<HTMLSelectElement>;
    allFilters.forEach((filter) => (filter.value = ""));

    // Apply values from state (slugs)
    const setGroupValue = (group: string, slugValues: string[]) => {
      const filters = document.querySelectorAll(
        `[data-group="${group}"]`,
      ) as NodeListOf<HTMLSelectElement>;

      filters.forEach((filter) => {
        if (slugValues.length > 0) {
          // Find option where slugify(opt.value) matches slugValue
          const option = Array.from(filter.options).find(
            (opt) => slugify(opt.value) === slugValues[0] && opt.value !== "",
          );
          if (option) filter.value = option.value;
        }
      });
    };

    setGroupValue("jenis", this.filters.jenis);
    setGroupValue("ukuran", this.filters.ukuran);
    setGroupValue("kabko", this.filters.kabko);
  }

  private handleFilterChange(): void {
    // Baca state dari DOM dan CONVERT TO SLUGS
    const getFilterValues = (group: string) => {
      const filters = document.querySelectorAll(
        `[data-group="${group}"]`,
      ) as NodeListOf<HTMLSelectElement>;
      const values: string[] = [];

      filters.forEach((filter) => {
        if (filter.value !== "") values.push(slugify(filter.value));
      });

      return values;
    };

    this.filters.jenis = getFilterValues("jenis");
    this.filters.ukuran = getFilterValues("ukuran");
    this.filters.kabko = getFilterValues("kabko");

    this.currentPage = 1; // Reset to page 1 on filter change
    this.applyFilters();
    this.updateURL();
  }

  private applyFilters(): void {
    // Filters are Slugs. Items are Raw.
    const hasMatch = (filters: string[], itemValue: string) => {
      if (filters.length === 0) return true;
      // filters are already slugs, so we slugify itemValue to compare
      return filters.includes(slugify(itemValue));
    };

    this.filteredItems = this.items.filter((item) => {
      const matchJenis = hasMatch(this.filters.jenis, item.jenis);
      const matchUkuran = hasMatch(this.filters.ukuran, item.ukuran);
      const matchKabko = hasMatch(this.filters.kabko, item.kabko);

      return matchJenis && matchUkuran && matchKabko;
    });

    this.render();
  }

  private render(): void {
    this.renderGrid();
    this.renderPagination();
    this.updateStatus();
  }

  private renderGrid(): void {
    this.gridContainer.innerHTML = "";

    if (this.filteredItems.length === 0) {
      this.gridContainer.innerHTML = `
          <div class="col-span-full py-12 text-center text-gray-500">
            <p class="text-lg">Tidak ada produk yang sesuai kriteria.</p>
          </div>
        `;
      return;
    }

    // Slice paginasi
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const paginatedItems = this.filteredItems.slice(start, end);

    const fragment = document.createDocumentFragment();

    paginatedItems.forEach((item) => {
      const clone = this.template.content.cloneNode(true) as DocumentFragment;

      // Data

      // Tautan produk
      const link = clone.querySelector("a") as HTMLAnchorElement;
      if (link) {
        link.href = item.detailUrl;
        link.dataset.id = item.id;
      }

      // Jenis ukuran produk
      const badgeJenis = clone.querySelector('[data-bind="jenis"]') as HTMLSpanElement;
      if (badgeJenis) badgeJenis.textContent = item.jenis;

      const badgeUkuran = clone.querySelector('[data-bind="ukuran"]') as HTMLSpanElement;
      if (badgeUkuran) badgeUkuran.textContent = item.ukuran;

      // Gambar produk
      const img = clone.querySelector("img") as HTMLImageElement;
      if (img) {
        img.src = item.imageSrc;
        img.alt = item.label;
        img.classList.add(`[view-transition-name:produk-img-${item.id}]`);
      }

      // Lokasi produk
      const label = clone.querySelector('[data-bind="label"]') as HTMLSpanElement;
      if (label) label.textContent = item.label; // Hidden usually

      const alamat = clone.querySelector('[data-bind="alamat"]') as HTMLSpanElement;
      if (alamat) alamat.textContent = item.alamat;

      const kabko = clone.querySelector('[data-bind="kabko"]') as HTMLSpanElement;
      if (kabko) kabko.textContent = item.kabko;

      const provinsi = clone.querySelector('[data-bind="provinsi"]') as HTMLSpanElement;
      if (provinsi) provinsi.textContent = item.provinsi;

      fragment.appendChild(clone);
    });

    this.gridContainer.appendChild(fragment);
  }

  private renderPagination(): void {
    const totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
    this.paginationContainer.innerHTML = "";

    if (totalPages <= 1) return;

    // Helper untuk membuat button
    const createBtn = (
      text: string | number,
      page: number,
      active: boolean = false,
      disabled: boolean = false,
    ) => {
      const button = document.createElement("button");
      button.className = `flex h-10 w-10 items-center justify-center rounded-sm border text-sm font-medium ${active ? "border-blue-500 bg-blue-500 text-white" : "border-gray-200 bg-white hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"}`;
      button.textContent = String(text);

      if (page > 0) button.dataset.page = String(page);
      if (disabled) button.disabled = true;

      return button;
    };

    // Prev
    this.paginationContainer.appendChild(
      createBtn("«", this.currentPage - 1, false, this.currentPage === 1),
    );

    // Page Numbers (Simple loop for now, can be optimized for large pages)
    for (let i = 1; i <= totalPages; i++) {
      this.paginationContainer.appendChild(createBtn(i, i, i === this.currentPage));
    }

    // Next
    this.paginationContainer.appendChild(
      createBtn("»", this.currentPage + 1, false, this.currentPage === totalPages),
    );
  }

  private updateStatus(): void {
    if (this.statusElement) {
      const total = this.filteredItems.length;
      const start = (this.currentPage - 1) * this.itemsPerPage + 1;
      const end = Math.min(start + this.itemsPerPage - 1, total);

      this.statusElement.textContent =
        total > 0 ? `Menampilkan ${start}-${end} dari ${total} produk` : "";
    }
  }

  private goToPage(page: number): void {
    this.currentPage = page;
    this.render();
    this.updateURL();

    // Smooth scroll jika diperlukan
    this.gridContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Logika inisialisasi
const dataElement = document.getElementById("product-data") as HTMLScriptElement;
const gridSelector = "#product-grid";
const paginationSelector = "#pagination-container";
const templateSelector = "#product-template";

if (dataElement) {
  const data = JSON.parse(dataElement.textContent || "[]");
  // Ambil itemsPerPage dari dataset atau gunakan default
  const itemsPerPage = Number(dataElement.dataset.itemsPerPage) || 16;

  new ProductFilter(data, gridSelector, paginationSelector, templateSelector, itemsPerPage);
}
