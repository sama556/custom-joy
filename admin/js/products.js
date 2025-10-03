document.addEventListener('DOMContentLoaded', function () {
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

    // Tabs switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.dataset.tab;
            document.getElementById(`tab-${tabId}`).classList.add('active');
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

    // State helpers
    function load(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } }
    function save(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
    function nextId(items) { return items.length ? Math.max(...items.map(i => Number(i.id) || 0)) + 1 : 1; }

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

    // Rendering helpers
    const cakesTbody = document.querySelector('#cakesTable tbody');
    const cakeAddonsTbody = document.querySelector('#cakeAddonsTable tbody');
    const flowersTbody = document.querySelector('#flowersTable tbody');
    const flowerAddonsTbody = document.querySelector('#flowerAddonsTable tbody');
    const balloonsTbody = document.querySelector('#balloonsTable tbody');
    const tmpl = {
        cake: document.getElementById('tmpl-cake-row'),
        cakeAddon: document.getElementById('tmpl-cakeAddon-row'),
        flower: document.getElementById('tmpl-flower-row'),
        flowerAddon: document.getElementById('tmpl-flowerAddon-row'),
        balloon: document.getElementById('tmpl-balloon-row')
    };

    function renderCakes() {
        const items = load(KEYS.cakes);
        const search = (document.getElementById('cakeSearch')?.value || '').toLowerCase();
        const filtered = items.filter(i => `${i.name || ''} ${i.description || ''}`.toLowerCase().includes(search));
        document.getElementById('cakeCount').textContent = `${filtered.length} items`;
        cakesTbody.innerHTML = '';
        filtered.forEach(i => {
            const row = tmpl.cake.content.firstElementChild.cloneNode(true);
            row.querySelector('.cell-id').textContent = i.id;
            row.querySelector('.cell-name').textContent = i.name || '';
            row.querySelector('.cell-description').textContent = i.description || '';
            row.querySelector('.cell-basePrice').textContent = Number(i.basePrice || 0).toFixed(2);
            const firstImg = (Array.isArray(i.images) && i.images[0]) || i.image || '';
            row.querySelector('.cell-image').innerHTML = firstImg ? `<img src="${firstImg}" alt="">` : '';
            row.querySelector('.cell-size').textContent = i.size || '';
            row.querySelector('.cell-layers').textContent = i.layers || '';
            row.querySelector('.cell-available').textContent = i.available ? 'Yes' : 'No';
            row.querySelector('.cell-supplierId').textContent = i.supplierId || '';
            row.querySelector('.cell-scope').textContent = i.scope || '';
            row.querySelector('.cell-type').textContent = i.type || '';
            row.querySelector('.edit').dataset.entity = 'cake';
            row.querySelector('.edit').dataset.id = i.id;
            row.querySelector('[data-action="delete"]').dataset.entity = 'cake';
            row.querySelector('[data-action="delete"]').dataset.id = i.id;
            cakesTbody.appendChild(row);
        });
    }

    function renderCakeAddons() {
        const items = load(KEYS.cakeAddons);
        const search = (document.getElementById('cakeAddonSearch')?.value || '').toLowerCase();
        const filtered = items.filter(i => `${i.optionGroup || ''} ${i.optionName || ''}`.toLowerCase().includes(search));
        document.getElementById('cakeAddonCount').textContent = `${filtered.length} items`;
        cakeAddonsTbody.innerHTML = '';
        filtered.forEach(i => {
            const row = tmpl.cakeAddon.content.firstElementChild.cloneNode(true);
            row.querySelector('.cell-id').textContent = i.id;
            row.querySelector('.cell-cakeId').textContent = i.cakeId || '';
            row.querySelector('.cell-optionGroup').textContent = i.optionGroup || '';
            row.querySelector('.cell-optionName').textContent = i.optionName || '';
            row.querySelector('.cell-extraPrice').textContent = Number(i.extraPrice || 0).toFixed(2);
            row.querySelector('.cell-image').innerHTML = i.image ? `<img src="${i.image}" alt="">` : '';
            row.querySelector('.cell-enabled').textContent = i.enabled ? 'Yes' : 'No';
            row.querySelector('.edit').dataset.entity = 'cakeAddon';
            row.querySelector('.edit').dataset.id = i.id;
            row.querySelector('[data-action="delete"]').dataset.entity = 'cakeAddon';
            row.querySelector('[data-action="delete"]').dataset.id = i.id;
            cakeAddonsTbody.appendChild(row);
        });
    }

    function renderFlowers() {
        const items = load(KEYS.flowers);
        const search = (document.getElementById('flowerSearch')?.value || '').toLowerCase();
        const filtered = items.filter(i => `${i.name || ''} ${i.category || ''}`.toLowerCase().includes(search));
        document.getElementById('flowerCount').textContent = `${filtered.length} items`;
        flowersTbody.innerHTML = '';
        filtered.forEach(i => {
            const row = tmpl.flower.content.firstElementChild.cloneNode(true);
            row.querySelector('.cell-id').textContent = i.id;
            row.querySelector('.cell-name').textContent = i.name || '';
            row.querySelector('.cell-category').textContent = i.category || '';
            row.querySelector('.cell-size').textContent = i.size || '';
            row.querySelector('.cell-basePrice').textContent = Number(i.basePrice || 0).toFixed(2);
            const flowerFirst = (Array.isArray(i.images) && i.images[0]) || i.image || '';
            row.querySelector('.cell-image').innerHTML = flowerFirst ? `<img src="${flowerFirst}" alt="">` : '';
            row.querySelector('.cell-available').textContent = i.available ? 'Yes' : 'No';
            row.querySelector('.cell-supplierId').textContent = i.supplierId || '';
            row.querySelector('.cell-scope').textContent = i.scope || '';
            row.querySelector('.edit').dataset.entity = 'flower';
            row.querySelector('.edit').dataset.id = i.id;
            row.querySelector('[data-action="delete"]').dataset.entity = 'flower';
            row.querySelector('[data-action="delete"]').dataset.id = i.id;
            flowersTbody.appendChild(row);
        });
    }

    function renderFlowerAddons() {
        const items = load(KEYS.flowerAddons);
        const search = (document.getElementById('flowerAddonSearch')?.value || '').toLowerCase();
        const filtered = items.filter(i => `${i.optionGroup || ''} ${i.optionName || ''}`.toLowerCase().includes(search));
        document.getElementById('flowerAddonCount').textContent = `${filtered.length} items`;
        flowerAddonsTbody.innerHTML = '';
        filtered.forEach(i => {
            const row = tmpl.flowerAddon.content.firstElementChild.cloneNode(true);
            row.querySelector('.cell-id').textContent = i.id;
            row.querySelector('.cell-flowerId').textContent = i.flowerId || '';
            row.querySelector('.cell-optionGroup').textContent = i.optionGroup || '';
            row.querySelector('.cell-optionName').textContent = i.optionName || '';
            row.querySelector('.cell-extraPrice').textContent = Number(i.extraPrice || 0).toFixed(2);
            const flAddonFirst = (Array.isArray(i.images) && i.images[0]) || i.image || '';
            row.querySelector('.cell-image').innerHTML = flAddonFirst ? `<img src="${flAddonFirst}" alt="">` : '';
            row.querySelector('.edit').dataset.entity = 'flowerAddon';
            row.querySelector('.edit').dataset.id = i.id;
            row.querySelector('[data-action=\"delete\"]').dataset.entity = 'flowerAddon';
            row.querySelector('[data-action=\"delete\"]').dataset.id = i.id;
            flowerAddonsTbody.appendChild(row);
        });
    }

    function renderBalloons() {
        const items = load(KEYS.balloons);
        const search = (document.getElementById('balloonSearch')?.value || '').toLowerCase();
        const filtered = items.filter(i => `${i.name || ''} ${i.balloonType || ''} ${i.color || ''}`.toLowerCase().includes(search));
        document.getElementById('balloonCount').textContent = `${filtered.length} items`;
        balloonsTbody.innerHTML = '';
        filtered.forEach(i => {
            const row = tmpl.balloon.content.firstElementChild.cloneNode(true);
            row.querySelector('.cell-id').textContent = i.id;
            row.querySelector('.cell-name').textContent = i.name || '';
            row.querySelector('.cell-balloonType').textContent = i.balloonType || '';
            row.querySelector('.cell-color').textContent = i.color || '';
            row.querySelector('.cell-size').textContent = i.size || '';
            row.querySelector('.cell-price').textContent = Number(i.price || 0).toFixed(2);
            const balloonFirst = (Array.isArray(i.images) && i.images[0]) || i.image || '';
            row.querySelector('.cell-image').innerHTML = balloonFirst ? `<img src="${balloonFirst}" alt="">` : '';
            row.querySelector('.cell-available').textContent = i.available ? 'Yes' : 'No';
            row.querySelector('.cell-extraDescription').textContent = i.extraDescription || '';
            row.querySelector('.cell-supplierId').textContent = i.supplierId || '';
            row.querySelector('.edit').dataset.entity = 'balloon';
            row.querySelector('.edit').dataset.id = i.id;
            row.querySelector('[data-action=\"delete\"]').dataset.entity = 'balloon';
            row.querySelector('[data-action=\"delete\"]').dataset.id = i.id;
            balloonsTbody.appendChild(row);
        });
    }

    // Search wiring
    ['cakeSearch', 'cakeAddonSearch', 'flowerSearch', 'flowerAddonSearch', 'balloonSearch'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => {
            if (id === 'cakeSearch') renderCakes();
            if (id === 'cakeAddonSearch') renderCakeAddons();
            if (id === 'flowerSearch') renderFlowers();
            if (id === 'flowerAddonSearch') renderFlowerAddons();
            if (id === 'balloonSearch') renderBalloons();
        });
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

    // Add buttons
    document.getElementById('addCakeBtn')?.addEventListener('click', () => openProductForm('cake'));
    document.getElementById('addCakeAddonBtn')?.addEventListener('click', () => openProductForm('cakeAddon'));
    document.getElementById('addFlowerBtn')?.addEventListener('click', () => openProductForm('flower'));
    document.getElementById('addFlowerAddonBtn')?.addEventListener('click', () => openProductForm('flowerAddon'));
    document.getElementById('addBalloonBtn')?.addEventListener('click', () => openProductForm('balloon'));

    // Delegate edit/delete
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const entity = btn.dataset.entity;
        const id = Number(btn.dataset.id);
        const isDelete = btn.dataset.action === 'delete';
        if (!entity || !id) return;
        if (isDelete) {
            const map = { cake: KEYS.cakes, cakeAddon: KEYS.cakeAddons, flower: KEYS.flowers, flowerAddon: KEYS.flowerAddons, balloon: KEYS.balloons };
            const key = map[entity];
            const arr = load(key).filter(i => Number(i.id) !== id);
            save(key, arr);
            showToast('Deleted', `${entity} #${id} removed`, 'success');
            refreshAll();
        } else if (btn.classList.contains('edit')) {
            const map = { cake: KEYS.cakes, cakeAddon: KEYS.cakeAddons, flower: KEYS.flowers, flowerAddon: KEYS.flowerAddons, balloon: KEYS.balloons };
            const key = map[entity];
            const item = load(key).find(i => Number(i.id) === id);
            openProductForm(entity, item);
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
        renderCakes();
        renderCakeAddons();
        renderFlowers();
        renderFlowerAddons();
        renderBalloons();
    }

    // Seed sample data once
    function seedOnce() {
        if (!localStorage.getItem('admin_products_seeded')) {
            save(KEYS.cakes, [
                { id: 1, name: 'Birthday Cake', description: 'Vanilla cream', basePrice: 80, images: ['../../images/ceek1.jpg', '../../images/ceek2.jpg'], size: 'Medium', layers: 2, available: true, supplierId: 'SUP-1', scope: 'public', type: 'General' }
            ]);
            save(KEYS.cakeAddons, [
                { id: 1, cakeId: 1, optionGroup: 'Frosting', optionName: 'Chocolate', extraPrice: 10, image: '', enabled: true }
            ]);
            save(KEYS.flowers, [
                { id: 1, name: 'Rose Bouquet', category: 'Rose', size: 'Large', basePrice: 120, images: ['../../images/rose.jpg', '../../images/rose2.jpg'], available: true, supplierId: 'SUP-2', scope: 'public' }
            ]);
            save(KEYS.flowerAddons, [
                { id: 1, flowerId: 1, optionGroup: 'Wrap', optionName: 'Silk', extraPrice: 15, image: '' }
            ]);
            save(KEYS.balloons, [
                { id: 1, name: 'Anniversary Balloon', balloonType: 'Foil', color: 'Gold', size: 'L', price: 25, images: ['../../images/ballon.jpg'], available: true, extraDescription: 'Heart-shaped', supplierId: 'SUP-3' }
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

    seedOnce();
    migrateImagesIfEmpty();
    refreshAll();
});


