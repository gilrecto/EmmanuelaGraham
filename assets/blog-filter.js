
customElements.define('blog-filter', class extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('form');
    this.filterUrl = this.dataset.url;
    this.sectionId = this.dataset.sectionId;
    this.blogPostsContainer = document.querySelector('#blog-posts');

    this.form.addEventListener('change', (e) => {
      // Sync filters immediately, then filter after a delay
      this.syncFilters(e.target);

      // Use setTimeout for the actual filtering to prevent conflicts
      setTimeout(() => {
        this.onFilter();
      }, 50);
    });
    this.form.addEventListener('reset', (e) => {
      e.preventDefault();
      this.clearAllFilters();
    });

    // Initialize clear filter button visibility and sync filters
    this.updateClearFilterButton();
    this.initializeFilterSync();
  }

  async onFilter() {
    const formData = new FormData(this.form);
    const params = new URLSearchParams();

    // Get values from both mobile and desktop inputs
    const yearDesktop = formData.get('year-desktop');
    const yearMobile = formData.get('year-mobile');
    const categoriesDesktop = formData.getAll('category-desktop');
    const categoriesMobile = formData.getAll('category-mobile');

    // Use whichever has a value (they should be synced)
    const year = yearDesktop || yearMobile;
    const categories = [...categoriesDesktop, ...categoriesMobile].filter(Boolean);

    if (year) params.set('year', year);
    if (categories.length) params.set('category', categories.join(','));

    params.set('section_id', this.sectionId);

    // Update URL to reflect current filters
    const newUrl = year || categories.length ?
      `${this.filterUrl}?${new URLSearchParams({...(year && {year}), ...(categories.length && {category: categories.join(',')})}).toString()}` :
      this.filterUrl;

    window.history.replaceState(null, '', newUrl);

    this.setLoading(true);
    const res = await fetch(`${this.filterUrl}?${params.toString()}`);
    const html = await res.text();
    const parser = new DOMParser().parseFromString(html, 'text/html');
    const updated = parser.querySelector('#blog-posts');

    if (updated) {
      this.blogPostsContainer.innerHTML = updated.innerHTML;
    }

    // Update clear filter button visibility
    this.updateClearFilterButton();
    this.setLoading(false);
  }

  clearAllFilters() {
    // Clear all checkboxes (both mobile and desktop)
    const checkboxes = this.form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });

    // Clear all radio buttons (both mobile and desktop)
    const radios = this.form.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.checked = false;
    });

    // Update URL to remove all filter parameters
    window.history.replaceState(null, '', this.filterUrl);

    // Trigger filtering to show all posts
    requestAnimationFrame(() => this.onFilter());
  }

  initializeFilterSync() {
    // Sync filters on page load based on URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlYear = urlParams.get('year');
    const urlCategory = urlParams.get('category');

    if (urlYear) {
      const yearInputs = this.form.querySelectorAll(`input[data-sync-group="year"][value="${urlYear}"]`);
      yearInputs.forEach(input => input.checked = true);
    }

    if (urlCategory) {
      const categories = urlCategory.split(',');
      categories.forEach(category => {
        const categoryInputs = this.form.querySelectorAll(`input[data-sync-group="category"][value="${category.trim()}"]`);
        categoryInputs.forEach(input => input.checked = true);
      });
    }
  }

  syncFilters(changedInput) {
    const syncGroup = changedInput.dataset.syncGroup;
    const value = changedInput.value;
    const isChecked = changedInput.checked;

    if (changedInput.type === 'radio') {
      // For radio buttons, handle sync group
      if (isChecked) {
        // First, uncheck all radios in the same sync group
        const allRadiosInGroup = this.form.querySelectorAll(`input[type="radio"][data-sync-group="${syncGroup}"]`);
        allRadiosInGroup.forEach(radio => {
          radio.checked = false;
        });

        // Then check the specific value in both mobile and desktop
        const matchingInputs = this.form.querySelectorAll(`input[type="radio"][data-sync-group="${syncGroup}"][value="${value}"]`);

        // Check each matching input
        matchingInputs.forEach((input, index) => {
          const isMobile = input.closest('.ts\\:md\\:hidden') !== null;

          input.checked = true;
        });
      }
    } else {
      // For checkboxes, sync based on sync group
      const matchingInputs = this.form.querySelectorAll(`input[type="checkbox"][data-sync-group="${syncGroup}"][value="${value}"]`);
      matchingInputs.forEach(input => {
        if (input !== changedInput) {
          input.checked = isChecked;
        }
      });
    }
  }

  updateClearFilterButton() {
    const formData = new FormData(this.form);
    const yearDesktop = formData.get('year-desktop');
    const yearMobile = formData.get('year-mobile');
    const categoriesDesktop = formData.getAll('category-desktop');
    const categoriesMobile = formData.getAll('category-mobile');

    // Also check URL parameters for initial state
    const urlParams = new URLSearchParams(window.location.search);
    const urlYear = urlParams.get('year');
    const urlCategory = urlParams.get('category');

    const hasActiveFilters = yearDesktop || yearMobile || categoriesDesktop.length > 0 || categoriesMobile.length > 0 || urlYear || urlCategory;

    const clearButton = this.form.querySelector('button[type="reset"]');
    if (clearButton) {
      clearButton.style.display = hasActiveFilters ? 'block' : 'none';
    }
  }

  setLoading(state) {
    this.blogPostsContainer.classList.toggle('ts:opacity-50', state);
    this.blogPostsContainer.classList.toggle('ts:pointer-events-none', state);
  }
});
