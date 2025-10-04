document.addEventListener('DOMContentLoaded', function () {
    // Enhanced Product Management System
    console.log('Enhanced Product Management System Initialized');

    // Basic sign out modal wiring (reuse pattern from overview.js)
    const openSignOutBtn = document.getElementById('openSignOut');
    const signOutModal = document.getElementById('signOutModal');
    const cancelSignOutBtn = document.getElementById('cancelSignOut');
    const confirmSignOutBtn = document.getElementById('confirmSignOut');

    function openModal(modal) {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
    }
    function closeModal(modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    }
    if (openSignOutBtn) openSignOutBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(signOutModal); });
    if (cancelSignOutBtn) cancelSignOutBtn.addEventListener('click', () => closeModal(signOutModal));
    if (signOutModal) signOutModal.addEventListener('click', (e) => { if (e.target === signOutModal) closeModal(signOutModal); });
    if (confirmSignOutBtn) confirmSignOutBtn.addEventListener('click', () => { closeModal(signOutModal); showToast('Signed out', 'You have been signed out successfully.', 'success'); });

    // Product Type Filter switching
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const productType = btn.dataset.type;
            state.filters.productType = productType === 'all' ? '' : productType;
            renderAllProducts();
        });
    });

    // LocalStorage keys
    const KEYS = {
        cakes: 'admin_products_cakes',
        cakeAddons: 'admin_products_cake_addons',
        flowers: 'admin_products_flowers',
        flowerAddons: 'admin_products_flower_addons',
        balloons: 'admin_products_balloons'
    };

    // Enhanced State Management
    const state = {
        currentPage: 1,
        itemsPerPage: 10,
        sortColumn: null,
        sortDirection: 'asc',
        filters: {
            search: '',
            productType: '',
            priceRange: '',
            availability: '',
            supplier: '',
            sortBy: 'name'
        }
    };

    // State helpers
    function load(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } }
    function save(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
    function nextId(items) { return items.length ? Math.max(...items.map(i => Number(i.id) || 0)) + 1 : 1; }

    // Enhanced data manipulation
    function getAllProducts() {
        const allProducts = [];

        // Load all product types and add type identifier
        Object.keys(KEYS).forEach(key => {
            const items = load(KEYS[key]);
            const type = key.replace('s', '').replace('Addon', 'Addon'); // Normalize type names
            items.forEach(item => {
                allProducts.push({
                    ...item,
                    productType: type,
                    price: item.basePrice || item.price || 0,
                    created: item.created || new Date().toISOString()
                });
            });
        });

        return allProducts;
    }

    function applyFilters(items, filters) {
        return items.filter(item => {
            // Product type filter
            if (filters.productType && item.productType !== filters.productType) return false;

            // Search filter
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                const searchableText = `${item.name || ''} ${item.description || ''} ${item.category || ''} ${item.optionGroup || ''} ${item.optionName || ''}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) return false;
            }

            // Price range filter
            if (filters.priceRange) {
                const price = Number(item.price || 0);
                const [min, max] = filters.priceRange.split('-').map(Number);
                if (max && (price < min || price > max)) return false;
                if (!max && price < min) return false;
            }

            // Availability filter
            if (filters.availability) {
                const isAvailable = item.available === true || item.available === 'true';
                if (filters.availability === 'available' && !isAvailable) return false;
                if (filters.availability === 'unavailable' && isAvailable) return false;
            }

            // Supplier filter
            if (filters.supplier && item.supplierId !== filters.supplier) return false;

            return true;
        });
    }

    function sortItems(items, column, direction) {
        return items.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];

            // Handle different data types
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (direction === 'asc') {
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            } else {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            }
        });
    }

    function paginateItems(items, page, perPage) {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        return {
            items: items.slice(start, end),
            totalPages: Math.ceil(items.length / perPage),
            currentPage: page,
            totalItems: items.length
        };
    }

    // Toasts
    function showToast(title, message, type) {
        const toastContainer = document.querySelector('.toast-container');
        const template = document.getElementById('toast-template');
        if (!toastContainer || !template) return;
        const toast = template.content.firstElementChild.cloneNode(true);
        let iconClass = 'fas fa-info-circle'; let iconColor = '#368BFF';
        if (type === 'success') { iconClass = 'fas fa-check-circle'; iconColor = '#2ecc71'; }
        else if (type === 'warning') { iconClass = 'fas fa-exclamation-triangle'; iconColor = '#FFB11B'; }
        else if (type === 'error') { iconClass = 'fas fa-times-circle'; iconColor = '#e74c3c'; }
        toast.querySelector('.toast-icon').style.backgroundColor = iconColor;
        toast.querySelector('.toast-icon i').className = iconClass;
        toast.querySelector('.toast-title').textContent = title;
        toast.querySelector('.toast-message').textContent = message;
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        });
        toastContainer.appendChild(toast);
        setTimeout(() => { if (toast.parentNode) { toast.style.animation = 'slideIn 0.3s ease-out reverse'; setTimeout(() => toast.remove(), 300); } }, 4500);
    }

    // Unified rendering helpers
    const productsTbody = document.querySelector('#productsTable tbody');
    const productTemplate = document.getElementById('tmpl-product-row');

    function renderAllProducts() {
        const allItems = getAllProducts();
        const filtered = applyFilters(allItems, state.filters);
        const sorted = state.sortColumn ? sortItems([...filtered], state.sortColumn, state.sortDirection) : filtered;
        const paginated = paginateItems(sorted, state.currentPage, state.itemsPerPage);

        // Update enhanced stats
        const totalProducts = allItems.length;
        const availableProducts = allItems.filter(item => item.available === true || item.available === 'true').length;
        const unavailableProducts = totalProducts - availableProducts;
        const averagePrice = allItems.length > 0 ?
            (allItems.reduce((sum, item) => sum + (item.price || 0), 0) / allItems.length).toFixed(2) : 0;
        const filteredCount = filtered.length;

        // Update header stats
        document.getElementById('totalProductsStat').textContent = totalProducts;
        document.getElementById('availableProductsStat').textContent = availableProducts;
        document.getElementById('unavailableProductsStat').textContent = unavailableProducts;
        document.getElementById('averagePriceStat').textContent = `$${averagePrice}`;


        // Update type counts
        const typeCounts = {
            all: totalProducts,
            cake: allItems.filter(item => item.productType === 'cake').length,
            cakeAddon: allItems.filter(item => item.productType === 'cakeAddon').length,
            flower: allItems.filter(item => item.productType === 'flower').length,
            flowerAddon: allItems.filter(item => item.productType === 'flowerAddon').length,
            balloon: allItems.filter(item => item.productType === 'balloon').length
        };

        Object.keys(typeCounts).forEach(type => {
            const countEl = document.getElementById(`${type}Count`);
            if (countEl) countEl.textContent = typeCounts[type];
        });

        // Update pagination info
        document.getElementById('productPageInfo').textContent = `Page ${paginated.currentPage} of ${paginated.totalPages}`;

        // Update pagination buttons
        document.getElementById('productPrevPage').disabled = paginated.currentPage <= 1;
        document.getElementById('productNextPage').disabled = paginated.currentPage >= paginated.totalPages;

        // Clear and render rows
        productsTbody.innerHTML = '';

        if (paginated.items.length === 0) {
            productsTbody.innerHTML = `
                <tr>
                    <td colspan="12" class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>No products found</h3>
                        <p>Try adjusting your search criteria or add a new product.</p>
                    </td>
                </tr>
            `;
            return;
        }

        paginated.items.forEach(item => {
            const row = productTemplate.content.firstElementChild.cloneNode(true);

            // Populate data
            row.querySelector('.cell-id').textContent = item.id;

            // Type badge
            const typeBadge = row.querySelector('.type-badge');
            typeBadge.textContent = item.productType;
            typeBadge.className = `type-badge ${item.productType}`;

            row.querySelector('.cell-name').textContent = item.name || '';
            row.querySelector('.cell-description').textContent = (item.description || '').substring(0, 50) + (item.description?.length > 50 ? '...' : '');
            row.querySelector('.cell-price').textContent = `$${Number(item.price || 0).toFixed(2)}`;

            // Enhanced image handling
            const firstImg = (Array.isArray(item.images) && item.images[0]) || item.image || '';
            row.querySelector('.cell-image').innerHTML = firstImg ?
                `<img src="${firstImg}" alt="${item.name}" onerror="this.style.display='none'">` :
                '<div style="width:50px;height:50px;background:#f0f0f0;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#999;"><i class="fas fa-image"></i></div>';

            // Details based on product type
            let details = '';
            if (item.productType === 'cake') {
                details = `Size: ${item.size || 'N/A'} | Layers: ${item.layers || 'N/A'}`;
            } else if (item.productType === 'cakeAddon') {
                details = `Group: ${item.optionGroup || 'N/A'} | Extra: +$${Number(item.extraPrice || 0).toFixed(2)}`;
            } else if (item.productType === 'flower') {
                details = `Category: ${item.category || 'N/A'} | Size: ${item.size || 'N/A'}`;
            } else if (item.productType === 'flowerAddon') {
                details = `Group: ${item.optionGroup || 'N/A'} | Extra: +$${Number(item.extraPrice || 0).toFixed(2)}`;
            } else if (item.productType === 'balloon') {
                details = `Type: ${item.balloonType || 'N/A'} | Color: ${item.color || 'N/A'}`;
            }
            row.querySelector('.cell-details').textContent = details;

            // Enhanced status badge
            const statusBadge = row.querySelector('.status-badge');
            const isAvailable = item.available === true || item.available === 'true';
            statusBadge.textContent = isAvailable ? 'Available' : 'Unavailable';
            statusBadge.className = `status-badge ${isAvailable ? 'available' : 'unavailable'}`;

            row.querySelector('.cell-supplier').textContent = item.supplierId || '';
            row.querySelector('.cell-scope').textContent = item.scope || '';

            // Set up actions
            row.querySelector('.edit').dataset.entity = item.productType;
            row.querySelector('.edit').dataset.id = item.id;
            row.querySelector('[data-action="delete"]').dataset.entity = item.productType;
            row.querySelector('[data-action="delete"]').dataset.id = item.id;
            row.querySelector('[data-action="view"]').dataset.entity = item.productType;
            row.querySelector('[data-action="view"]').dataset.id = item.id;


            productsTbody.appendChild(row);
        });
    }


    // Unified search and filter wiring
    const searchInput = document.getElementById('productSearch');
    const typeFilter = document.getElementById('productTypeFilter');
    const priceFilter = document.getElementById('productPriceFilter');
    const availabilityFilter = document.getElementById('productAvailabilityFilter');
    const supplierFilter = document.getElementById('productSupplierFilter');
    const sortBy = document.getElementById('productSortBy');
    const clearFilters = document.getElementById('clearProductFilters');

    function updateFilters() {
        state.filters.search = searchInput?.value || '';
        state.filters.productType = typeFilter?.value || '';
        state.filters.priceRange = priceFilter?.value || '';
        state.filters.availability = availabilityFilter?.value || '';
        state.filters.supplier = supplierFilter?.value || '';
        state.filters.sortBy = sortBy?.value || 'name';
        state.currentPage = 1; // Reset to first page when filters change
        renderAllProducts();
    }

    if (searchInput) searchInput.addEventListener('input', updateFilters);
    if (typeFilter) typeFilter.addEventListener('change', updateFilters);
    if (priceFilter) priceFilter.addEventListener('change', updateFilters);
    if (availabilityFilter) availabilityFilter.addEventListener('change', updateFilters);
    if (supplierFilter) supplierFilter.addEventListener('change', updateFilters);
    if (sortBy) sortBy.addEventListener('change', updateFilters);
    if (clearFilters) clearFilters.addEventListener('click', () => {
        state.filters = { search: '', productType: '', priceRange: '', availability: '', supplier: '', sortBy: 'name' };
        if (searchInput) searchInput.value = '';
        if (typeFilter) typeFilter.value = '';
        if (priceFilter) priceFilter.value = '';
        if (availabilityFilter) availabilityFilter.value = '';
        if (supplierFilter) supplierFilter.value = '';
        if (sortBy) sortBy.value = 'name';
        renderAllProducts();
    });

    // Modal forms
    const productModal = document.getElementById('productModal');
    const productModalTitle = document.getElementById('productModalTitle');
    const formsWrap = document.getElementById('productForms');
    const cancelProduct = document.getElementById('cancelProduct');
    const saveProduct = document.getElementById('saveProduct');
    let editing = { entity: null, id: null };

    function formField(label, id, type = 'text', attrs = '') {
        return `<div class="form-field"><label for="${id}">${label}</label><input type="${type}" id="${id}" ${attrs}></div>`;
    }
    function selectField(label, id, options) {
        const opts = options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
        return `<div class="form-field"><label for="${id}">${label}</label><select id="${id}">${opts}</select></div>`;
    }
    function textareaField(label, id, attrs = '') {
        return `<div class="form-field" style="grid-column: 1 / -1;"><label for="${id}">${label}</label><textarea id="${id}" ${attrs}></textarea></div>`;
    }

    function getFormByEntity(entity) { return formsWrap.querySelector(`form.product-form[data-entity="${entity}"]`); }

    function openProductForm(entity, values) {
        editing = { entity, id: values?.id || null };
        productModalTitle.innerHTML = `${values?.id ? 'Edit' : 'Add'} ${entity}`;
        formsWrap.querySelectorAll('form.product-form').forEach(f => f.style.display = 'none');
        const form = getFormByEntity(entity);
        if (!form) return;
        form.style.display = '';
        form.reset();
        if (values) {
            Object.keys(values).forEach(k => {
                const input = form.querySelector(`[name="${k}"]`);
                if (input) input.value = String(values[k]);
            });
            // Populate primary/gallery images for products that support multiple images
            if (['cake', 'flower', 'balloon'].includes(entity)) {
                const images = Array.isArray(values.images) ? values.images : [];
                const legacy = values.image ? [values.image] : [];
                const merged = images.length ? images : legacy;
                const primary = merged[0] || '';
                const gallery = merged.slice(1).join(', ');
                const primaryEl = form.querySelector('[name="primaryImage"]');
                const galleryEl = form.querySelector('[name="galleryImages"]');
                if (primaryEl) primaryEl.value = primary;
                if (galleryEl) galleryEl.value = gallery;
            }
        }
        openModal(productModal);
    }

    function closeProductForm() { closeModal(productModal); editing = { entity: null, id: null }; }
    if (cancelProduct) cancelProduct.addEventListener('click', closeProductForm);

    // Product details modal
    function showProductDetails(entity, item) {
        if (!item) return;

        // Create a detailed view of the product
        const details = `
            <div class="product-details">
                <div class="product-header-info">
                    <div class="product-image">
                        ${item.images && item.images.length > 0 ?
                `<img src="${item.images[0]}" alt="${item.name}" style="width: 220px; height: 220px; object-fit: cover;">` :
                '<div style="width: 220px; height: 220px; background: linear-gradient(135deg, #f0f0f0, #e0e0e0); display: flex; align-items: center; justify-content: center; color: #999; border-radius: 16px;"><i class="fas fa-image" style="font-size: 48px;"></i></div>'
            }
                    </div>
                    <div class="product-basic-info">
                        <h2>${item.name || 'Unnamed Product'}</h2>
                        <div class="product-type-badge">
                            <span class="type-badge ${entity}">${entity}</span>
                        </div>
                        <div class="product-price">
                            <strong>$${Number(item.price || item.basePrice || 0).toFixed(2)}</strong>
                        </div>
                        <div class="product-status">
                            <span class="status-badge ${item.available ? 'available' : 'unavailable'}">
                                <i class="fas fa-${item.available ? 'check-circle' : 'times-circle'}"></i>
                                ${item.available ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="product-details-grid">
                    <div class="detail-section">
                        <h4><i class="fas fa-info-circle"></i> Basic Information</h4>
                        <div class="detail-row">
                            <strong><i class="fas fa-hashtag"></i> ID:</strong> ${item.id}
                        </div>
                        <div class="detail-row">
                            <strong><i class="fas fa-align-left"></i> Description:</strong> ${item.description || 'No description available'}
                        </div>
                        ${item.category ? `<div class="detail-row"><strong><i class="fas fa-tag"></i> Category:</strong> ${item.category}</div>` : ''}
                        ${item.size ? `<div class="detail-row"><strong><i class="fas fa-expand-arrows-alt"></i> Size:</strong> ${item.size}</div>` : ''}
                        ${item.layers ? `<div class="detail-row"><strong><i class="fas fa-layer-group"></i> Layers:</strong> ${item.layers}</div>` : ''}
                        ${item.type ? `<div class="detail-row"><strong><i class="fas fa-tags"></i> Type:</strong> ${item.type}</div>` : ''}
                    </div>
                    
                    ${entity === 'cakeAddon' || entity === 'flowerAddon' ? `
                    <div class="detail-section">
                        <h4><i class="fas fa-plus-circle"></i> Add-on Information</h4>
                        <div class="detail-row">
                            <strong><i class="fas fa-layer-group"></i> Option Group:</strong> ${item.optionGroup || 'N/A'}
                        </div>
                        <div class="detail-row">
                            <strong><i class="fas fa-tag"></i> Option Name:</strong> ${item.optionName || 'N/A'}
                        </div>
                        <div class="detail-row">
                            <strong><i class="fas fa-dollar-sign"></i> Extra Price:</strong> +$${Number(item.extraPrice || 0).toFixed(2)}
                        </div>
                        ${item.enabled !== undefined ? `<div class="detail-row"><strong><i class="fas fa-toggle-${item.enabled ? 'on' : 'off'}"></i> Enabled:</strong> ${item.enabled ? 'Yes' : 'No'}</div>` : ''}
                    </div>
                    ` : ''}
                    
                    ${entity === 'balloon' ? `
                    <div class="detail-section">
                        <h4><i class="fas fa-balloon"></i> Balloon Details</h4>
                        <div class="detail-row">
                            <strong><i class="fas fa-shapes"></i> Balloon Type:</strong> ${item.balloonType || 'N/A'}
                        </div>
                        <div class="detail-row">
                            <strong><i class="fas fa-palette"></i> Color:</strong> ${item.color || 'N/A'}
                        </div>
                        <div class="detail-row">
                            <strong><i class="fas fa-expand-arrows-alt"></i> Size:</strong> ${item.size || 'N/A'}
                        </div>
                        ${item.extraDescription ? `<div class="detail-row"><strong><i class="fas fa-align-left"></i> Description:</strong> ${item.extraDescription}</div>` : ''}
                    </div>
                    ` : ''}
                    
                    <div class="detail-section">
                        <h4><i class="fas fa-cog"></i> System Information</h4>
                        <div class="detail-row">
                            <strong><i class="fas fa-truck"></i> Supplier ID:</strong> ${item.supplierId || 'N/A'}
                        </div>
                        <div class="detail-row">
                            <strong><i class="fas fa-globe"></i> Scope:</strong> ${item.scope || 'N/A'}
                        </div>
                        <div class="detail-row">
                            <strong><i class="fas fa-calendar-alt"></i> Created:</strong> ${item.created ? new Date(item.created).toLocaleDateString() : 'N/A'}
                        </div>
                    </div>
                </div>
                
                ${item.images && item.images.length > 1 ? `
                <div class="product-gallery">
                    <h4><i class="fas fa-images"></i> Gallery</h4>
                    <div class="gallery-images">
                        ${item.images.slice(1).map(img => `<img src="${img}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; margin: 4px;">`).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;

        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay open';
        modal.setAttribute('aria-hidden', 'false');
        modal.innerHTML = `
            <div class="modal product-details-modal" role="document" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3><i class="fas fa-eye"></i> Product Details</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-content">
                    ${details}
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
                    <button class="btn btn-primary" onclick="
                        this.closest('.modal-overlay').remove();
                        // Trigger edit
                        const editBtn = document.querySelector('[data-action=\"edit\"][data-entity=\"${entity}\"][data-id=\"${item.id}\"]');
                        if (editBtn) editBtn.click();
                    ">
                        <i class="fas fa-edit"></i> Edit Product
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Add product dropdown
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductDropdown = document.getElementById('addProductDropdown');

    if (addProductBtn && addProductDropdown) {
        addProductBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addProductDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!addProductBtn.contains(e.target) && !addProductDropdown.contains(e.target)) {
                addProductDropdown.classList.remove('show');
            }
        });

        // Handle dropdown item clicks
        addProductDropdown.addEventListener('click', (e) => {
            e.preventDefault();
            const type = e.target.closest('a')?.dataset.type;
            if (type) {
                openProductForm(type);
                addProductDropdown.classList.remove('show');
            }
        });
    }

    // Delegate edit/delete/view
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const entity = btn.dataset.entity;
        const id = Number(btn.dataset.id);
        const action = btn.dataset.action;
        if (!entity || !id) return;

        if (action === 'delete') {
            const map = { cake: KEYS.cakes, cakeAddon: KEYS.cakeAddons, flower: KEYS.flowers, flowerAddon: KEYS.flowerAddons, balloon: KEYS.balloons };
            const key = map[entity];
            const arr = load(key).filter(i => Number(i.id) !== id);
            save(key, arr);
            showToast('Deleted', `${entity} #${id} removed`, 'success');
            refreshAll();
        } else if (action === 'edit') {
            const map = { cake: KEYS.cakes, cakeAddon: KEYS.cakeAddons, flower: KEYS.flowers, flowerAddon: KEYS.flowerAddons, balloon: KEYS.balloons };
            const key = map[entity];
            const item = load(key).find(i => Number(i.id) === id);
            openProductForm(entity, item);
        } else if (action === 'view') {
            const map = { cake: KEYS.cakes, cakeAddon: KEYS.cakeAddons, flower: KEYS.flowers, flowerAddon: KEYS.flowerAddons, balloon: KEYS.balloons };
            const key = map[entity];
            const item = load(key).find(i => Number(i.id) === id);
            showProductDetails(entity, item);
        }
    });

    // Save handler
    saveProduct?.addEventListener('click', (e) => {
        e.preventDefault();
        if (!editing.entity) return closeProductForm();
        const map = { cake: KEYS.cakes, cakeAddon: KEYS.cakeAddons, flower: KEYS.flowers, flowerAddon: KEYS.flowerAddons, balloon: KEYS.balloons };
        const key = map[editing.entity];
        const arr = load(key);

        const form = getFormByEntity(editing.entity);
        function val(name) { const el = form?.querySelector(`[name="${name}"]`); return el ? el.value : ''; }
        function boolVal(name) { return val(name) === 'true'; }

        let data = {};
        if (editing.entity === 'cake') {
            const imgs = [val('primaryImage'), ...val('galleryImages').split(',').map(s => s.trim()).filter(Boolean)].filter(Boolean);
            data = { id: editing.id || nextId(arr), name: val('name'), description: val('description'), basePrice: Number(val('basePrice') || 0), images: imgs, size: val('size'), layers: Number(val('layers') || 0), available: boolVal('available'), supplierId: val('supplierId'), scope: val('scope'), type: val('type') };
        } else if (editing.entity === 'cakeAddon') {
            data = { id: editing.id || nextId(arr), cakeId: val('cakeId'), optionGroup: val('optionGroup'), optionName: val('optionName'), extraPrice: Number(val('extraPrice') || 0), image: val('image'), enabled: boolVal('enabled') };
        } else if (editing.entity === 'flower') {
            const imgs = [val('primaryImage'), ...val('galleryImages').split(',').map(s => s.trim()).filter(Boolean)].filter(Boolean);
            data = { id: editing.id || nextId(arr), name: val('name'), category: val('category'), size: val('size'), basePrice: Number(val('basePrice') || 0), images: imgs, available: boolVal('available'), supplierId: val('supplierId'), scope: val('scope') };
        } else if (editing.entity === 'flowerAddon') {
            data = { id: editing.id || nextId(arr), flowerId: val('flowerId'), optionGroup: val('optionGroup'), optionName: val('optionName'), extraPrice: Number(val('extraPrice') || 0), image: val('image') };
        } else if (editing.entity === 'balloon') {
            const imgs = [val('primaryImage'), ...val('galleryImages').split(',').map(s => s.trim()).filter(Boolean)].filter(Boolean);
            data = { id: editing.id || nextId(arr), name: val('name'), balloonType: val('balloonType'), color: val('color'), size: val('size'), price: Number(val('price') || 0), images: imgs, available: boolVal('available'), extraDescription: val('extraDescription'), supplierId: val('supplierId') };
        }

        if (editing.id) {
            const idx = arr.findIndex(i => Number(i.id) === Number(editing.id));
            if (idx !== -1) arr[idx] = { ...arr[idx], ...data, id: editing.id };
        } else {
            arr.push(data);
        }
        save(key, arr);
        showToast('Saved', `${editing.entity} saved successfully`, 'success');
        closeProductForm();
        refreshAll();
    });

    function refreshAll() {
        renderAllProducts();
    }

    // Seed sample data once
    function seedOnce() {
        if (!localStorage.getItem('admin_products_seeded')) {
            // Cakes
            save(KEYS.cakes, [
                { id: 1, name: 'Chocolate Birthday Cake', description: 'Rich chocolate cake with vanilla cream frosting, perfect for birthdays', basePrice: 85, images: ['../../images/ceek1.jpg', '../../images/ceek2.jpg'], size: 'Medium', layers: 2, available: true, supplierId: 'SUP-1', scope: 'public', type: 'Birthday' },
                { id: 2, name: 'Strawberry Delight', description: 'Fresh strawberry cake with cream cheese frosting', basePrice: 95, images: ['../../images/ceek3.jpg', '../../images/ceek4.jpg'], size: 'Large', layers: 3, available: true, supplierId: 'SUP-1', scope: 'public', type: 'Wedding' },
                { id: 3, name: 'Red Velvet Classic', description: 'Traditional red velvet cake with cream cheese frosting', basePrice: 75, images: ['../../images/ceek5.jpg'], size: 'Small', layers: 2, available: false, supplierId: 'SUP-1', scope: 'public', type: 'Anniversary' },
                { id: 4, name: 'Vanilla Dream', description: 'Light and fluffy vanilla cake with buttercream frosting', basePrice: 65, images: ['../../images/ceek6.jpg'], size: 'Medium', layers: 2, available: true, supplierId: 'SUP-2', scope: 'public', type: 'General' }
            ]);

            // Cake Add-ons
            save(KEYS.cakeAddons, [
                { id: 1, cakeId: 1, name: 'Chocolate Ganache Frosting', description: 'Rich and smooth chocolate ganache frosting for your cake', optionGroup: 'Frosting', optionName: 'Chocolate Ganache', extraPrice: 15, image: '../../images/ceek1.jpg', enabled: true },
                { id: 2, cakeId: 1, name: 'Vanilla Buttercream Frosting', description: 'Classic vanilla buttercream frosting, light and creamy', optionGroup: 'Frosting', optionName: 'Vanilla Buttercream', extraPrice: 10, image: '../../images/ceek2.jpg', enabled: true },
                { id: 3, cakeId: 2, name: 'Fresh Strawberry Topping', description: 'Fresh, sweet strawberries as a beautiful cake topping', optionGroup: 'Toppings', optionName: 'Fresh Strawberries', extraPrice: 20, image: '../../images/ceek3.jpg', enabled: true },
                { id: 4, cakeId: 2, name: 'Edible Flower Decoration', description: 'Beautiful edible flowers to decorate your cake', optionGroup: 'Decoration', optionName: 'Edible Flowers', extraPrice: 25, image: '../../images/ceek4.jpg', enabled: true },
                { id: 5, cakeId: 3, name: 'Cream Cheese Frosting', description: 'Traditional cream cheese frosting, perfect for red velvet', optionGroup: 'Frosting', optionName: 'Cream Cheese', extraPrice: 12, image: '../../images/ceek5.jpg', enabled: true },
                { id: 6, cakeId: 4, name: 'Colorful Sprinkles', description: 'Fun and colorful sprinkles to make your cake festive', optionGroup: 'Decoration', optionName: 'Sprinkles', extraPrice: 8, image: '../../images/ceek6.jpg', enabled: true }
            ]);

            // Flowers
            save(KEYS.flowers, [
                { id: 1, name: 'Red Rose Bouquet', description: 'Classic red roses arranged in a beautiful bouquet, perfect for romantic occasions', category: 'Rose', size: 'Large', basePrice: 120, images: ['../../images/rose.jpg', '../../images/rose2.jpg'], available: true, supplierId: 'SUP-2', scope: 'public' },
                { id: 2, name: 'Mixed Spring Bouquet', description: 'Fresh spring flowers in a colorful mixed arrangement, bringing joy and freshness', category: 'Mixed', size: 'Medium', basePrice: 85, images: ['../../images/flower1.jpg', '../../images/flower2.jpg'], available: true, supplierId: 'SUP-2', scope: 'public' },
                { id: 3, name: 'White Lily Arrangement', description: 'Elegant white lilies in a sophisticated arrangement, perfect for special occasions', category: 'Lily', size: 'Large', basePrice: 95, images: ['../../images/ceek1.jpg'], available: true, supplierId: 'SUP-3', scope: 'public' },
                { id: 4, name: 'Sunflower Bouquet', description: 'Bright and cheerful sunflowers that bring sunshine to any room', category: 'Sunflower', size: 'Medium', basePrice: 75, images: ['../../images/ceek2.jpg'], available: false, supplierId: 'SUP-2', scope: 'public' },
                { id: 5, name: 'Tulip Collection', description: 'Beautiful tulips in various colors, a perfect spring gift', category: 'Tulip', size: 'Small', basePrice: 65, images: ['../../images/ceek3.jpg'], available: true, supplierId: 'SUP-3', scope: 'public' }
            ]);

            // Flower Add-ons
            save(KEYS.flowerAddons, [
                { id: 1, flowerId: 1, name: 'Silk Ribbon Wrap', description: 'Elegant silk ribbon to beautifully wrap your flower bouquet', optionGroup: 'Wrap', optionName: 'Silk Ribbon', extraPrice: 15, image: '../../images/rose.jpg' },
                { id: 2, flowerId: 1, name: 'Lace Wrap', description: 'Delicate lace wrap for a romantic and elegant presentation', optionGroup: 'Wrap', optionName: 'Lace Wrap', extraPrice: 20, image: '../../images/rose2.jpg' },
                { id: 3, flowerId: 2, name: 'Glass Vase', description: 'Crystal clear glass vase to display your beautiful flowers', optionGroup: 'Vase', optionName: 'Glass Vase', extraPrice: 25, image: '../../images/flower1.jpg' },
                { id: 4, flowerId: 2, name: 'Ceramic Vase', description: 'Handcrafted ceramic vase for a unique and artistic touch', optionGroup: 'Vase', optionName: 'Ceramic Vase', extraPrice: 30, image: '../../images/flower2.jpg' },
                { id: 5, flowerId: 3, name: 'Greeting Card', description: 'Personalized greeting card to accompany your flower delivery', optionGroup: 'Card', optionName: 'Greeting Card', extraPrice: 5, image: '../../images/ceek1.jpg' },
                { id: 6, flowerId: 4, name: 'Same Day Delivery', description: 'Express same-day delivery service for urgent flower orders', optionGroup: 'Delivery', optionName: 'Same Day Delivery', extraPrice: 35, image: '../../images/ceek2.jpg' }
            ]);

            // Balloons
            save(KEYS.balloons, [
                { id: 1, name: 'Happy Birthday Balloon Set', description: 'Colorful birthday balloons with helium, perfect for celebrating special moments', balloonType: 'Latex', color: 'Multi', size: 'L', price: 25, images: ['../../images/ballon.jpg'], available: true, extraDescription: 'Colorful birthday balloons with helium', supplierId: 'SUP-3' },
                { id: 2, name: 'Heart Shaped Balloon', description: 'Romantic heart-shaped balloon, perfect for anniversaries and Valentine\'s Day', balloonType: 'Foil', color: 'Red', size: 'M', price: 18, images: ['../../images/ceek4.jpg'], available: true, extraDescription: 'Perfect for anniversaries and Valentine\'s Day', supplierId: 'SUP-3' },
                { id: 3, name: 'Number Balloon 1', description: 'Large gold number balloon, perfect for milestone birthdays and celebrations', balloonType: 'Foil', color: 'Gold', size: 'XL', price: 22, images: ['../../images/ceek5.jpg'], available: true, extraDescription: 'Large gold number balloon', supplierId: 'SUP-4' },
                { id: 4, name: 'Confetti Balloon', description: 'Clear balloon filled with colorful confetti for a festive surprise', balloonType: 'Latex', color: 'Clear', size: 'L', price: 20, images: ['../../images/ceek6.jpg'], available: true, extraDescription: 'Clear balloon filled with confetti', supplierId: 'SUP-3' },
                { id: 5, name: 'Star Balloon', description: 'Shiny silver star balloon that adds sparkle to any celebration', balloonType: 'Foil', color: 'Silver', size: 'M', price: 15, images: ['../../images/ceek1.jpg'], available: false, extraDescription: 'Shiny silver star balloon', supplierId: 'SUP-4' },
                { id: 6, name: 'Animal Balloon Set', description: 'Adorable set of animal-shaped balloons that kids will love', balloonType: 'Latex', color: 'Multi', size: 'S', price: 30, images: ['../../images/ceek2.jpg'], available: true, extraDescription: 'Set of animal-shaped balloons for kids', supplierId: 'SUP-3' }
            ]);

            localStorage.setItem('admin_products_seeded', '1');
        }
    }

    // One-time image migration so existing items show thumbnails
    function migrateImagesIfEmpty() {
        if (localStorage.getItem('admin_products_migrated_images')) return;
        const sets = [
            { key: KEYS.cakes, def: '../../images/ceek1.jpg' },
            { key: KEYS.flowers, def: '../../images/flower1.jpg' },
            { key: KEYS.balloons, def: '../../images/ballon.jpg' }
        ];
        let changed = false;
        sets.forEach(({ key, def }) => {
            const arr = load(key);
            const updated = arr.map(item => {
                const hasImages = Array.isArray(item.images) && item.images.length > 0;
                const hasLegacy = item.image && String(item.image).trim().length > 0;
                if (!hasImages && !hasLegacy) {
                    changed = true;
                    return { ...item, images: [def] };
                }
                if (!hasImages && hasLegacy) {
                    changed = true;
                    return { ...item, images: [item.image] };
                }
                return item;
            });
            if (changed) save(key, updated);
        });
        if (changed) localStorage.setItem('admin_products_migrated_images', '1');
    }

    // Function to reset and reseed data (for development)
    function resetAndReseed() {
        localStorage.removeItem('admin_products_seeded');
        localStorage.removeItem('admin_products_migrated_images');
        Object.values(KEYS).forEach(key => localStorage.removeItem(key));
        seedOnce();
        migrateImagesIfEmpty();
        renderAllProducts();
        showToast('Data Reset', 'Product data has been reset and reseeded with new sample products!', 'success');
    }

    // Add reset button functionality (for development)
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset Data';
    resetBtn.className = 'btn btn-warning btn-sm';
    resetBtn.style.position = 'fixed';
    resetBtn.style.bottom = '20px';
    resetBtn.style.right = '20px';
    resetBtn.style.zIndex = '1000';
    resetBtn.addEventListener('click', resetAndReseed);
    document.body.appendChild(resetBtn);

    // Enhanced functionality for new header features
    const clearSearch = document.getElementById('clearSearch');
    const refreshDataBtn = document.getElementById('refreshDataBtn');
    const bulkImportBtn = document.getElementById('bulkImportBtn');
    const bulkExportBtn = document.getElementById('bulkExportBtn');
    const clearAllFilters = document.getElementById('clearAllFilters');

    // Clear search functionality
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            const searchInput = document.getElementById('productSearch');
            if (searchInput) {
                searchInput.value = '';
                state.filters.search = '';
                renderAllProducts();
            }
        });
    }

    // Refresh data
    if (refreshDataBtn) {
        refreshDataBtn.addEventListener('click', () => {
            renderAllProducts();
            showToast('Refreshed', 'Product data has been refreshed', 'success');
        });
    }

    // Bulk import/export (placeholder functionality)
    if (bulkImportBtn) {
        bulkImportBtn.addEventListener('click', () => {
            showToast('Import', 'CSV import functionality coming soon!', 'info');
        });
    }

    if (bulkExportBtn) {
        bulkExportBtn.addEventListener('click', () => {
            const allItems = getAllProducts();
            const csvContent = convertToCSV(allItems);
            downloadCSV(csvContent, 'products.csv');
            showToast('Export', 'Products exported to CSV successfully!', 'success');
        });
    }

    // Clear all filters
    if (clearAllFilters) {
        clearAllFilters.addEventListener('click', () => {
            // Reset all filter inputs
            const searchInput = document.getElementById('productSearch');
            const typeFilter = document.getElementById('productTypeFilter');
            const priceFilter = document.getElementById('productPriceFilter');
            const availabilityFilter = document.getElementById('productAvailabilityFilter');
            const supplierFilter = document.getElementById('productSupplierFilter');
            const sortBy = document.getElementById('productSortBy');

            if (searchInput) searchInput.value = '';
            if (typeFilter) typeFilter.value = '';
            if (priceFilter) priceFilter.value = '';
            if (availabilityFilter) availabilityFilter.value = '';
            if (supplierFilter) supplierFilter.value = '';
            if (sortBy) sortBy.value = 'name';

            // Reset state
            state.filters = { search: '', productType: '', priceRange: '', availability: '', supplier: '', sortBy: 'name' };
            state.currentPage = 1;

            // Reset type filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-type="all"]').classList.add('active');

            renderAllProducts();
            showToast('Filters Cleared', 'All filters have been cleared', 'info');
        });
    }

    // CSV conversion functions
    function convertToCSV(data) {
        if (data.length === 0) return '';

        const headers = ['ID', 'Type', 'Name', 'Description', 'Price', 'Available', 'Supplier', 'Scope'];
        const csvRows = [headers.join(',')];

        data.forEach(item => {
            const row = [
                item.id,
                item.productType,
                `"${(item.name || '').replace(/"/g, '""')}"`,
                `"${(item.description || '').replace(/"/g, '""')}"`,
                item.price || 0,
                item.available ? 'Yes' : 'No',
                item.supplierId || '',
                item.scope || ''
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }

    function downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Initialize the unified product system
    seedOnce();
    migrateImagesIfEmpty();
    renderAllProducts();
});


