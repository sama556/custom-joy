document.addEventListener('DOMContentLoaded', function () {
    // Enhanced Product Management System
    console.log('Enhanced Product Management System Initialized');

    // Mobile Navigation
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');

    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function () {
            sidebar.classList.toggle('open');
            mobileMenuToggle.classList.toggle('active');

            // Update icon
            const icon = mobileMenuToggle.querySelector('i');
            if (sidebar.classList.contains('open')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', function (event) {
            if (window.innerWidth <= 768 &&
                !sidebar.contains(event.target) &&
                !mobileMenuToggle.contains(event.target) &&
                sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                mobileMenuToggle.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });

        // Close sidebar when window is resized to desktop
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('open');
                mobileMenuToggle.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });
    }

    // Product Details Modal
    const productDetailsModal = document.getElementById('productDetailsModal');
    const productDetailsContent = document.getElementById('productDetailsContent');
    const productDetailsTitle = document.getElementById('productDetailsTitle');
    const closeProductDetailsBtn = document.getElementById('closeProductDetailsBtn');
    const closeProductDetails = document.getElementById('closeProductDetails');
    const editProductFromDetails = document.getElementById('editProductFromDetails');


    function openModal(modal) {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
    }
    function closeModal(modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    }

    // Reusable small multi-select modal logic for checkbox groups
    const multiSelectModal = document.getElementById('multiSelectModal');
    const multiSelectTitle = document.getElementById('multiSelectTitle');
    const multiSelectContent = document.getElementById('multiSelectContent');
    const cancelMultiSelect = document.getElementById('cancelMultiSelect');
    const confirmMultiSelect = document.getElementById('confirmMultiSelect');
    const multiSelectSearch = document.getElementById('multiSelectSearch');
    const multiSelectSelectAll = document.getElementById('multiSelectSelectAll');
    const multiSelectClear = document.getElementById('multiSelectClear');
    let activeCheckboxGroup = null; // {form, groupEl, nameAttr}

    function openMultiSelectForGroup(groupEl) {
        if (!groupEl) return;
        const form = groupEl.closest('form');
        activeCheckboxGroup = { form, groupEl, nameAttr: (groupEl.querySelector('input[type="checkbox"]')?.getAttribute('name') || '') };
        // Title from previous label sibling or fallback
        const labelEl = groupEl.parentElement?.querySelector('label');
        const title = (labelEl?.textContent?.trim() || 'Select Options');
        const titleSpan = multiSelectTitle?.querySelector('span');
        if (titleSpan) titleSpan.textContent = title; else multiSelectTitle.textContent = title;

        // Build modal list
        multiSelectContent.innerHTML = '';
        const options = Array.from(groupEl.querySelectorAll('input[type="checkbox"]'));
        options.forEach((cb, idx) => {
            const id = `msel_${Date.now()}_${idx}`;
            const wrapper = document.createElement('div');
            wrapper.className = 'form-field';
            const optionLabel = document.createElement('label');
            const clone = cb.cloneNode(true);
            clone.id = id;
            optionLabel.setAttribute('for', id);
            optionLabel.appendChild(clone);
            optionLabel.appendChild(document.createTextNode(' ' + (cb.parentElement?.textContent?.trim() || cb.value)));
            wrapper.appendChild(optionLabel);
            multiSelectContent.appendChild(wrapper);
        });
        openModal(multiSelectModal);
        if (multiSelectSearch) multiSelectSearch.value = '';
    }

    function applyMultiSelect() {
        if (!activeCheckboxGroup) return;
        const { groupEl, nameAttr } = activeCheckboxGroup;
        if (!nameAttr) { closeModal(multiSelectModal); return; }
        // Read selections from modal and sync back to original group checkboxes
        const modalChecks = multiSelectContent.querySelectorAll(`input[type="checkbox"][name="${nameAttr}"]`);
        const originalChecks = groupEl.querySelectorAll(`input[type="checkbox"][name="${nameAttr}"]`);
        const selectedValues = new Set(Array.from(modalChecks).filter(cb => cb.checked).map(cb => cb.value));
        originalChecks.forEach(cb => { cb.checked = selectedValues.has(cb.value); });
        closeModal(multiSelectModal);
        activeCheckboxGroup = null;
    }

    cancelMultiSelect?.addEventListener('click', () => { closeModal(multiSelectModal); activeCheckboxGroup = null; });
    if (multiSelectModal) multiSelectModal.addEventListener('click', (e) => { if (e.target === multiSelectModal) { closeModal(multiSelectModal); activeCheckboxGroup = null; } });
    confirmMultiSelect?.addEventListener('click', applyMultiSelect);

    // Filtering inside modal
    multiSelectSearch?.addEventListener('input', () => {
        const term = multiSelectSearch.value.toLowerCase();
        Array.from(multiSelectContent.children).forEach(row => {
            const text = row.textContent?.toLowerCase() || '';
            row.style.display = text.includes(term) ? '' : 'none';
        });
    });

    // Bulk actions
    multiSelectSelectAll?.addEventListener('click', () => {
        multiSelectContent.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = true; });
    });
    multiSelectClear?.addEventListener('click', () => {
        multiSelectContent.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    });

    // Transform checkbox groups into modal pickers (show a field with icon + summary)
    function getGroupLabel(groupEl) {
        // The .checkbox-group is inside a .form-field; use its label
        const field = groupEl.closest('.form-field');
        const labelEl = field ? field.querySelector(':scope > label') : null;
        return (labelEl?.textContent || '').trim() || 'Select Options';
    }

    function getSelectionsFromGroup(groupEl) {
        return Array.from(groupEl.querySelectorAll('input[type="checkbox"]'))
            .filter(cb => cb.checked)
            .map(cb => cb.parentElement?.textContent?.trim() || cb.value);
    }

    function updatePickerSummary(picker, groupEl) {
        const summary = picker.querySelector('.modal-picker-summary');
        if (!summary) return;
        const selected = getSelectionsFromGroup(groupEl);
        if (selected.length === 0) {
            summary.textContent = 'No selection';
            summary.classList.add('empty');
        } else if (selected.length <= 2) {
            summary.textContent = selected.join(', ');
            summary.classList.remove('empty');
        } else {
            summary.textContent = `${selected.length} selected`;
            summary.classList.remove('empty');
        }
    }

    function createModalPickerForGroup(groupEl) {
        const field = groupEl.closest('.form-field');
        if (!field || field.querySelector('.modal-picker')) return; // already created
        // Hide the raw checkbox group
        groupEl.style.display = 'none';
        // Create picker UI
        const picker = document.createElement('div');
        picker.className = 'modal-picker';
        picker.innerHTML = `
            <button type="button" class="btn btn-outline modal-picker-trigger" aria-haspopup="dialog">
                <i class="fas fa-list" style="margin-right:8px;"></i>
                <span class="modal-picker-label">${getGroupLabel(groupEl)}</span>
            </button>
            <div class="modal-picker-summary" style="margin-top:6px;font-size:12px;color:#666;">No selection</div>
        `;
        field.appendChild(picker);
        updatePickerSummary(picker, groupEl);

        // Click to open modal
        picker.querySelector('.modal-picker-trigger')?.addEventListener('click', (e) => {
            e.preventDefault();
            openMultiSelectForGroup(groupEl);
        });
    }

    function setupModalPickersForCake() {
        const cakeForm = document.querySelector('form.product-form[data-entity="cake"]');
        if (!cakeForm) return;
        cakeForm.querySelectorAll('.checkbox-group').forEach(createModalPickerForGroup);
    }

    function setupModalPickersForFlower() {
        const flowerForm = document.querySelector('form.product-form[data-entity="flower"]');
        if (!flowerForm) return;
        flowerForm.querySelectorAll('.checkbox-group').forEach(createModalPickerForGroup);
    }

    // Build pickers on load
    setupModalPickersForCake();
    setupModalPickersForFlower();

    // Also rebuild pickers whenever we open the cake form (in case of dynamic reset)
    const originalOpenProductFormForPicker = window.openProductForm;
    window.openProductForm = function (entity, item) {
        if (originalOpenProductFormForPicker) originalOpenProductFormForPicker(entity, item);
        if (entity === 'cake') {
            setupModalPickersForCake();
        }
        if (entity === 'flower') {
            setupModalPickersForFlower();
        }
    };

    // After applying modal selection, refresh summaries
    const originalApplyMulti = applyMultiSelect;
    function applyMultiSelectAndRefresh() {
        const groupRef = activeCheckboxGroup?.groupEl;
        originalApplyMulti();
        if (groupRef) {
            const picker = groupRef.closest('.form-field')?.querySelector('.modal-picker');
            if (picker) updatePickerSummary(picker, groupRef);
        }
    }
    // Rebind confirm button to our wrapper
    if (confirmMultiSelect) {
        confirmMultiSelect.removeEventListener('click', applyMultiSelect);
        confirmMultiSelect.addEventListener('click', applyMultiSelectAndRefresh);
    }

    // Product Details Modal Functions
    function showProductDetails(product) {
        if (!product) {
            showToast('Not found', 'Product not found.', 'error');
            return;
        }
        const productType = product.productType || 'product';

        // Helper function to get product image
        function getProductImage(product) {
            const image = product.primaryImage || product.image || (product.images && product.images.length > 0 ? product.images[0] : null);
            return image;
        }

        // Helper function to check if product has image
        function hasProductImage(product) {
            return !!(product.primaryImage || product.image || (product.images && product.images.length > 0));
        }

        // Update modal header with dynamic icon and title
        const iconMap = {
            'cake': 'fas fa-birthday-cake',
            'cakeAddon': 'fas fa-plus-circle',
            'flower': 'fas fa-seedling',
            'flowerAddon': 'fas fa-plus-circle',
            'balloon': 'fas fa-balloon',
            'party': 'fas fa-calendar-check'
        };

        const icon = iconMap[productType] || 'fas fa-box';
        const iconElement = document.getElementById('productDetailsIcon');
        if (iconElement) {
            iconElement.className = icon;
        }

        productDetailsTitle.textContent = `${productType.charAt(0).toUpperCase() + productType.slice(1)} Details`;

        const subtitle = document.getElementById('productDetailsSubtitle');
        if (subtitle) {
            subtitle.textContent = `View and manage ${productType} information`;
        }

        // If static modals exist, populate and show them, else fallback to dynamic rendering
        const staticIds = { cake: 'cakeDetailsModal', flower: 'flowerDetailsModal', balloon: 'balloonDetailsModal' };
        if (staticIds[productType]) {
            const modalId = staticIds[productType];
            const modal = document.getElementById(modalId);
            if (modal) {
                if (productType === 'cake') {
                    const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v || 'N/A'; };
                    const setImg = (id, v) => { const el = document.getElementById(id); if (el) el.src = v || 'https://via.placeholder.com/300x300?text=No+Image'; };
                    setImg('cakeDetImage', getProductImage(product));
                    setText('cakeDetName', product.name);
                    setText('cakeDetId', `ID: ${product.id || 'N/A'}`);
                    setText('cakeDetPrice', `﷼${Number(product.basePrice || product.price || 0).toFixed(2)}`);
                    const avail = document.getElementById('cakeDetAvailability'); if (avail) avail.innerHTML = `<i class="fas fa-${product.available ? 'check-circle' : 'times-circle'}"></i> ${product.available ? 'Available' : 'Unavailable'}`;
                    const scope = document.getElementById('cakeDetScope'); if (scope && product.scope) scope.innerHTML = `<i class="fas fa-${product.scope === 'private' ? 'lock' : 'globe'}"></i> ${product.scope === 'private' ? 'Private' : 'Public'}`;
                    setText('cakeDetDescription', product.description);
                    setText('cakeDetType', product.type);
                    setText('cakeDetSize', product.size);
                    setText('cakeDetLayers', product.layers);
                    setText('cakeDetMainFlavor', product.mainFlavor);
                    setText('cakeDetFillings', product.fillings);
                    setText('cakeDetFrosting', product.frosting);
                    setText('cakeDetShape', product.shape);
                    setText('cakeDetSizeDiameter', product.sizeDiameter);
                    setText('cakeDetLayersAlt', product.layersAlt);
                    setText('cakeDetBaseColors', product.baseColors);
                    setText('cakeDetDecorations', product.decorations);
                    setText('cakeDetWriting', product.writingText ? `${product.writingText} (${product.writingColor || 'Default'})` : 'None');
                    setText('cakeDetCandles', product.candles);
                    setText('cakeDetTopper', product.topper ? `${product.topper}${product.topperText ? ' - ' + product.topperText : ''}` : 'None');
                    setText('cakeDetEdibleImage', product.edibleImage || 'No');
                } else if (productType === 'flower') {
                    const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v || 'N/A'; };
                    const setImg = (id, v) => { const el = document.getElementById(id); if (el) el.src = v || 'https://via.placeholder.com/300x300?text=No+Image'; };
                    setImg('flowerDetImage', getProductImage(product));
                    setText('flowerDetName', product.name);
                    setText('flowerDetId', `ID: ${product.id || 'N/A'}`);
                    setText('flowerDetPrice', `﷼${Number(product.basePrice || 0).toFixed(2)}`);
                    const avail = document.getElementById('flowerDetAvailability'); if (avail) avail.innerHTML = `<i class="fas fa-${product.available ? 'check-circle' : 'times-circle'}"></i> ${product.available ? 'Available' : 'Unavailable'}`;
                    const scope = document.getElementById('flowerDetScope'); if (scope && product.scope) scope.innerHTML = `<i class="fas fa-${product.scope === 'private' ? 'lock' : 'globe'}"></i> ${product.scope === 'private' ? 'Private' : 'Public'}`;
                    setText('flowerDetType', product.type);
                    setText('flowerDetColor', product.flowerColor);
                    setText('flowerDetStem', product.stemCount);
                    setText('flowerDetFillers', product.fillersGreens);
                    setText('flowerDetPackaging', product.packaging);
                    setText('flowerDetRibbon', product.ribbonColor);
                    setText('flowerDetCard', product.greetingCard ? (product.greetingText ? `${product.greetingCard} - ${product.greetingText}` : product.greetingCard) : 'No');
                    setText('flowerDetAccessories', product.accessories);
                    setText('flowerDetArrangement', product.arrangementStyle);
                } else if (productType === 'balloon') {
                    const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v || 'N/A'; };
                    const setImg = (id, v) => { const el = document.getElementById(id); if (el) el.src = v || 'https://via.placeholder.com/300x300?text=No+Image'; };
                    setImg('balloonDetImage', getProductImage(product));
                    setText('balloonDetName', product.name);
                    setText('balloonDetId', `ID: ${product.id || 'N/A'}`);
                    setText('balloonDetPrice', `﷼${Number(product.price || 0).toFixed(2)}`);
                    const avail = document.getElementById('balloonDetAvailability'); if (avail) avail.innerHTML = `<i class="fas fa-${product.available ? 'check-circle' : 'times-circle'}"></i> ${product.available ? 'Available' : 'Unavailable'}`;
                    setText('balloonDetType', product.balloonType);
                    setText('balloonDetColor', product.color);
                    setText('balloonDetSize', product.size);
                    setText('balloonDetExtra', product.extraDescription);
                }
                openModal(modal);
                return;
            }
        }

        let detailsHTML = `
            <div class="product-hero-section">
                <div class="product-image-container">
                    <div class="product-image-wrapper">
                        <img src="${getProductImage(product) || 'https://via.placeholder.com/300x300?text=No+Image'}" 
                             alt="${product.name}" class="product-main-image">
                        <div class="image-overlay">
                            <div class="product-type-indicator">
                                <i class="fas ${iconMap[productType] || 'fa-box'}"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="product-summary">
                    <div class="product-title-section">
                        <h1 class="product-title">${product.name || 'Unnamed Product'}</h1>
                        <div class="product-meta">
                            <span class="product-id">ID: ${product.id || 'N/A'}</span>
                            <span class="product-type-tag ${productType}">
                                <i class="fas ${iconMap[productType] || 'fa-box'}"></i>
                                ${productType.charAt(0).toUpperCase() + productType.slice(1)}
                            </span>
                        </div>
                    </div>
                    <div class="product-pricing">
                        <div class="price-main">﷼${Number(product.price || product.basePrice || 0).toFixed(2)}</div>
                        <div class="price-label">Base Price</div>
                    </div>
                    <div class="product-status-section">
                        <div class="status-indicator ${product.available === true || product.available === 'true' ? 'available' : 'unavailable'}">
                            <i class="fas fa-${product.available === true || product.available === 'true' ? 'check-circle' : 'times-circle'}"></i>
                            <span>${product.available === true || product.available === 'true' ? 'Available' : 'Unavailable'}</span>
                        </div>
                        ${product.scope ? `
                        <div class="scope-indicator ${product.scope}">
                            <i class="fas fa-${product.scope === 'private' ? 'lock' : 'globe'}"></i>
                            <span>${product.scope === 'private' ? 'Private' : 'Public'}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <div class="product-details-sections">
        `;

        // Add specific details based on product type
        if (productType === 'cake') {
            detailsHTML += `
                   <div class="detail-section modern-section">
                       <div class="section-header">
                           <div class="section-icon">
                               <i class="fas fa-birthday-cake"></i>
                           </div>
                           <div class="section-title">
                               <h3>Cake Information</h3>
                               <p>Complete cake details and specifications</p>
                           </div>
                       </div>
                       <div class="section-content">
                           <div class="info-grid">
                               <div class="info-item">
                                   <div class="info-label">Description</div>
                                   <div class="info-value">${product.description || 'No description available'}</div>
                               </div>
                               <div class="info-item">
                                   <div class="info-label">Size</div>
                                   <div class="info-value">${product.size || 'N/A'}</div>
                               </div>
                               <div class="info-item">
                                   <div class="info-label">Number of Layers</div>
                                   <div class="info-value">${product.layers || 'N/A'}</div>
                               </div>
                               <div class="info-item">
                                   <div class="info-label">Cake Type</div>
                                   <div class="info-value">${product.type || 'N/A'}</div>
                               </div>
                               <div class="info-item">
                                   <div class="info-label">Main Flavor</div>
                                   <div class="info-value">${product.mainFlavor || 'N/A'}</div>
                               </div>
                               <div class="info-item">
                                   <div class="info-label">Fillings</div>
                                   <div class="info-value">${product.fillings || 'N/A'}</div>
                               </div>
                               <div class="info-item">
                                   <div class="info-label">Frosting</div>
                                   <div class="info-value">${product.frosting || 'N/A'}</div>
                               </div>
                               <div class="info-item">
                                   <div class="info-label">Shape</div>
                                   <div class="info-value">${product.shape || 'N/A'}</div>
                               </div>
                               <div class="info-item">
                                   <div class="info-label">Size/Diameter</div>
                                   <div class="info-value">${product.sizeDiameter || 'N/A'}</div>
                               </div>
                               <div class="info-item">
                                   <div class="info-label">Layers (Detailed)</div>
                                   <div class="info-value">${product.layersAlt || 'N/A'}</div>
                               </div>
                               <div class="info-item">
                                   <div class="info-label">Base Colors</div>
                                   <div class="info-value">${product.baseColors || 'N/A'}</div>
                               </div>
                               <div class="info-item">
                                   <div class="info-label">Decorations</div>
                                   <div class="info-value">${product.decorations || 'N/A'}</div>
                               </div>
                               <div class="info-item">
                                   <div class="info-label">Writing</div>
                                   <div class="info-value">${product.writingText ? product.writingText + ' (' + (product.writingColor || 'Default') + ')' : 'None'}</div>
                               </div>
                               <div class="info-item">
                                   <div class="info-label">Candles</div>
                                   <div class="info-value">${product.candles || 'None'}</div>
                               </div>
                               <div class="info-item">
                                   <div class="info-label">Topper</div>
                                   <div class="info-value">${product.topper || 'None'}${product.topperText ? ' - ' + product.topperText : ''}</div>
                               </div>
                               <div class="info-item">
                                   <div class="info-label">Edible Image</div>
                                   <div class="info-value">${product.edibleImage || 'No'}</div>
                               </div>
                               <div class="info-item">
                                   <div class="info-label">Image Status</div>
                                   <div class="info-value ${hasProductImage(product) ? 'has-image' : 'no-image'}">
                                       <i class="fas fa-${hasProductImage(product) ? 'check-circle' : 'times-circle'}"></i>
                                       ${hasProductImage(product) ? 'Image uploaded' : 'No image'}
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
               `;

            // Add Cake Add-ons section
            if (product.addons && product.addons.length > 0) {
                detailsHTML += `
                       <div class="detail-section modern-section addons-section">
                           <div class="section-header">
                               <div class="section-icon">
                                   <i class="fas fa-plus-circle"></i>
                               </div>
                               <div class="section-title">
                                   <h3>Cake Add-ons</h3>
                                   <p>${product.addons.length} add-on${product.addons.length !== 1 ? 's' : ''} available</p>
                               </div>
                           </div>
                           <div class="section-content">
                               <div class="addons-grid">
                   `;
                product.addons.forEach(addon => {
                    detailsHTML += `
                           <div class="addon-card">
                               <div class="addon-header">
                                   <div class="addon-title">
                                       <h4>${addon.name || 'Unnamed Add-on'}</h4>
                                       <span class="addon-id">ID: ${addon.id || 'N/A'}</span>
                                   </div>
                                   <div class="addon-price">
                                       <span class="price-amount">+$${Number(addon.price || 0).toFixed(2)}</span>
                                       <span class="price-label">Additional</span>
                                   </div>
                               </div>
                               <div class="addon-details">
                                   <div class="addon-info-grid">
                                       <div class="addon-info-item">
                                           <span class="info-label">Option Type</span>
                                           <span class="info-value">${addon.optionTypeName || 'N/A'}</span>
                                       </div>
                                       <div class="addon-info-item">
                                           <span class="info-label">Status</span>
                                           <span class="info-value status-${addon.active === true || addon.active === 'true' ? 'active' : 'inactive'}">
                                               <i class="fas fa-${addon.active === true || addon.active === 'true' ? 'check-circle' : 'times-circle'}"></i>
                                               ${addon.active === true || addon.active === 'true' ? 'Active' : 'Inactive'}
                                           </span>
                                       </div>
                                       <div class="addon-info-item">
                                           <span class="info-label">Image</span>
                                           <span class="info-value ${addon.image ? 'has-image' : 'no-image'}">
                                               <i class="fas fa-${addon.image ? 'check-circle' : 'times-circle'}"></i>
                                               ${addon.image ? 'Available' : 'Not available'}
                                           </span>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       `;
                });
                detailsHTML += `
                               </div>
                           </div>
                       </div>
                   `;
            }
        } else if (productType === 'cakeAddon') {
            detailsHTML += `
                <div class="detail-section modern-section">
                    <div class="section-header">
                        <div class="section-icon">
                            <i class="fas fa-plus-circle"></i>
                        </div>
                        <div class="section-title">
                            <h3>Cake Add-on Information</h3>
                            <p>Add-on details and specifications</p>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-label">Add-on ID</div>
                                <div class="info-value">${product.id || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Cake ID</div>
                                <div class="info-value">${product.cakeId || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Option Type Name</div>
                                <div class="info-value">${product.optionTypeName || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Option Name</div>
                                <div class="info-value">${product.optionName || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Additional Price</div>
                                <div class="info-value price-highlight">$${Number(product.additionalPrice || 0).toFixed(2)}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Image Status</div>
                                <div class="info-value ${product.image ? 'has-image' : 'no-image'}">
                                    <i class="fas fa-${product.image ? 'check-circle' : 'times-circle'}"></i>
                                    ${product.image ? 'Image uploaded' : 'No image'}
                                </div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Status</div>
                                <div class="info-value status-${product.active === true || product.active === 'true' ? 'active' : 'inactive'}">
                                    <i class="fas fa-${product.active === true || product.active === 'true' ? 'check-circle' : 'times-circle'}"></i>
                                    ${product.active === true || product.active === 'true' ? 'Active' : 'Inactive'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (productType === 'flower') {
            detailsHTML += `
                <div class="detail-section modern-section">
                    <div class="section-header">
                        <div class="section-icon">
                            <i class="fas fa-seedling"></i>
                        </div>
                        <div class="section-title">
                            <h3>Flower Information</h3>
                            <p>Complete flower details and specifications</p>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-label">Type</div>
                                <div class="info-value">${product.type || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Color</div>
                                <div class="info-value">${product.flowerColor || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Stem Count / Size</div>
                                <div class="info-value">${product.stemCount || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Fillers & Greens</div>
                                <div class="info-value">${product.fillersGreens || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Packaging</div>
                                <div class="info-value">${product.packaging || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Ribbon Color</div>
                                <div class="info-value">${product.ribbonColor || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Greeting Card</div>
                                <div class="info-value">${product.greetingCard || 'No'}${product.greetingText ? ' - ' + product.greetingText : ''}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Accessories</div>
                                <div class="info-value">${product.accessories || 'None'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Arrangement Style</div>
                                <div class="info-value">${product.arrangementStyle || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Image Status</div>
                                <div class="info-value ${hasProductImage(product) ? 'has-image' : 'no-image'}">
                                    <i class="fas fa-${hasProductImage(product) ? 'check-circle' : 'times-circle'}"></i>
                                    ${hasProductImage(product) ? 'Image uploaded' : 'No image'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Add Flower Add-ons section
            if (product.addons && product.addons.length > 0) {
                detailsHTML += `
                    <div class="detail-section modern-section addons-section">
                        <div class="section-header">
                            <div class="section-icon">
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            <div class="section-title">
                                <h3>Flower Add-ons</h3>
                                <p>${product.addons.length} add-on${product.addons.length !== 1 ? 's' : ''} available</p>
                            </div>
                        </div>
                        <div class="section-content">
                            <div class="addons-grid">
                `;
                product.addons.forEach(addon => {
                    detailsHTML += `
                        <div class="addon-card">
                            <div class="addon-header">
                                <div class="addon-title">
                                    <h4>${addon.name || 'Unnamed Add-on'}</h4>
                                    <span class="addon-id">ID: ${addon.id || 'N/A'}</span>
                                </div>
                                <div class="addon-price">
                                    <span class="price-amount">+﷼${Number(addon.price || 0).toFixed(2)}</span>
                                    <span class="price-label">Additional</span>
                                </div>
                            </div>
                            <div class="addon-details">
                                <div class="addon-info-grid">
                                    <div class="addon-info-item">
                                        <span class="info-label">Option Type</span>
                                        <span class="info-value">${addon.optionTypeName || 'N/A'}</span>
                                    </div>
                                    <div class="addon-info-item">
                                        <span class="info-label">Image</span>
                                        <span class="info-value ${addon.image ? 'has-image' : 'no-image'}">
                                            <i class="fas fa-${addon.image ? 'check-circle' : 'times-circle'}"></i>
                                            ${addon.image ? 'Available' : 'Not available'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                detailsHTML += `
                            </div>
                        </div>
                    </div>
                `;
            }
        } else if (productType === 'flowerAddon') {
            detailsHTML += `
                <div class="detail-section modern-section">
                    <div class="section-header">
                        <div class="section-icon">
                            <i class="fas fa-plus"></i>
                        </div>
                        <div class="section-title">
                            <h3>Flower Add-on Information</h3>
                            <p>Add-on details and specifications</p>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-label">Add-on ID</div>
                                <div class="info-value">${product.id || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Flower ID</div>
                                <div class="info-value">${product.flowerId || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Option Type Name</div>
                                <div class="info-value">${product.optionTypeName || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Option Name</div>
                                <div class="info-value">${product.optionName || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Additional Price</div>
                                <div class="info-value price-highlight">﷼${Number(product.additionalPrice || 0).toFixed(2)}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Image Status</div>
                                <div class="info-value ${product.image ? 'has-image' : 'no-image'}">
                                    <i class="fas fa-${product.image ? 'check-circle' : 'times-circle'}"></i>
                                    ${product.image ? 'Image uploaded' : 'No image'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (productType === 'balloon') {
            detailsHTML += `
                <div class="detail-section modern-section">
                    <div class="section-header">
                        <div class="section-icon">
                            <i class="fas fa-balloon"></i>
                        </div>
                        <div class="section-title">
                            <h3>Balloon Information</h3>
                            <p>Complete balloon details and specifications</p>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-label">Balloon Type</div>
                                <div class="info-value">${product.balloonType || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Color</div>
                                <div class="info-value">${product.color || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Size</div>
                                <div class="info-value">${product.size || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Image Status</div>
                                <div class="info-value ${hasProductImage(product) ? 'has-image' : 'no-image'}">
                                    <i class="fas fa-${hasProductImage(product) ? 'check-circle' : 'times-circle'}"></i>
                                    ${hasProductImage(product) ? 'Image uploaded' : 'No image'}
                                </div>
                            </div>
                            <div class="info-item full-width">
                                <div class="info-label">Additional Description</div>
                                <div class="info-value">${product.extraDescription || 'No additional description'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;


        } else if (productType === 'party') {
            detailsHTML += `
                <div class="detail-section modern-section">
                        <div class="section-header">
                        <div class="section-icon"><i class="fas fa-calendar-check"></i></div>
                        <div class="section-title"><h3>Party Planning Information</h3><p>Complete package details</p></div>
                        </div>
                        <div class="section-content">
                        <div class="info-grid">
                            <div class="info-item"><div class="info-label">Service Number</div><div class="info-value">${product.serviceNumber || 'N/A'}</div></div>
                            <div class="info-item"><div class="info-label">Package Name</div><div class="info-value">${product.name || 'N/A'}</div></div>
                            <div class="info-item full-width"><div class="info-label">Package Description</div><div class="info-value">${product.description || 'N/A'}</div></div>
                            <div class="info-item full-width"><div class="info-label">Package Contents</div><div class="info-value">${product.contents || 'N/A'}</div></div>
                            <div class="info-item"><div class="info-label">Category</div><div class="info-value">${product.category || 'N/A'}</div></div>
                            <div class="info-item"><div class="info-label">Duration</div><div class="info-value">${product.duration || 'N/A'}</div></div>
                            <div class="info-item"><div class="info-label">Availability</div><div class="info-value">${product.available ? 'Available' : 'Unavailable'}</div></div>
                            </div>
                        </div>
                    </div>
                `;
        }

        detailsHTML += `</div>`;
        productDetailsContent.innerHTML = detailsHTML;

        // Set data attributes for edit button
        if (editProductFromDetails) {
            editProductFromDetails.dataset.productId = product.id;
            editProductFromDetails.dataset.productType = productType;
        }

        openModal(productDetailsModal);
    }

    // Basic sign out modal wiring (reuse pattern from overview.js)
    const openSignOutBtn = document.getElementById('openSignOut');
    const signOutModal = document.getElementById('signOutModal');
    const cancelSignOutBtn = document.getElementById('cancelSignOut');
    const confirmSignOutBtn = document.getElementById('confirmSignOut');

    if (openSignOutBtn) openSignOutBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(signOutModal); });
    if (cancelSignOutBtn) cancelSignOutBtn.addEventListener('click', () => closeModal(signOutModal));
    if (signOutModal) signOutModal.addEventListener('click', (e) => { if (e.target === signOutModal) closeModal(signOutModal); });
    if (confirmSignOutBtn) confirmSignOutBtn.addEventListener('click', () => { closeModal(signOutModal); showToast('Signed out', 'You have been signed out successfully.', 'success'); });

    // Product Details Modal Event Listeners
    if (closeProductDetailsBtn) {
        closeProductDetailsBtn.addEventListener('click', () => {
            closeModal(productDetailsModal);
        });
    }
    if (closeProductDetails) {
        closeProductDetails.addEventListener('click', () => {
            closeModal(productDetailsModal);
        });
    }

    // Fallback: Use event delegation for close buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('#closeProductDetails') || e.target.closest('#closeProductDetailsBtn')) {
            if (productDetailsModal) {
                closeModal(productDetailsModal);
            }
        }
    });
    if (productDetailsModal) productDetailsModal.addEventListener('click', (e) => { if (e.target === productDetailsModal) closeModal(productDetailsModal); });
    // Close handlers for static modals via data-close
    document.querySelectorAll('[data-close]')?.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-close');
            const modal = document.getElementById(id);
            if (modal) closeModal(modal);
        });
    });
    // Generic close: any .modal-close or .enhanced-close inside a .modal-overlay
    document.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.modal-close, .enhanced-close');
        if (!closeBtn) return;
        const overlay = closeBtn.closest('.modal-overlay');
        if (overlay) closeModal(overlay);
    });
    // Click outside to close for static overlays as well
    ['cakeDetailsModal', 'flowerDetailsModal', 'balloonDetailsModal'].forEach(id => {
        const overlay = document.getElementById(id);
        if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(overlay); });
    });
    if (editProductFromDetails) editProductFromDetails.addEventListener('click', () => {
        closeModal(productDetailsModal);
        // Trigger edit functionality
        const productId = editProductFromDetails.dataset.productId;
        const productType = editProductFromDetails.dataset.productType;
        if (productId && productType) {
            // Find and trigger edit
            const editBtn = document.querySelector(`[data-action="edit"][data-id="${productId}"][data-entity="${productType}"]`);
            if (editBtn) editBtn.click();
        }
    });

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
        balloons: 'admin_products_balloons',
        parties: 'admin_products_parties',
        themes: 'admin_products_themes'
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

        const keyToType = {
            [KEYS.cakes]: 'cake',
            [KEYS.cakeAddons]: 'cakeAddon',
            [KEYS.flowers]: 'flower',
            [KEYS.flowerAddons]: 'flowerAddon',
            [KEYS.balloons]: 'balloon',
            [KEYS.parties]: 'party',
            [KEYS.themes]: 'theme'
        };

        Object.values(KEYS).forEach(storageKey => {
            const items = load(storageKey);
            const type = keyToType[storageKey] || 'product';
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
        const totalProductsEl = document.getElementById('totalProductsStat');
        const availableProductsEl = document.getElementById('availableProductsStat');
        const unavailableProductsEl = document.getElementById('unavailableProductsStat');
        const averagePriceEl = document.getElementById('averagePriceStat');

        if (totalProductsEl) totalProductsEl.textContent = totalProducts;
        if (availableProductsEl) availableProductsEl.textContent = availableProducts;
        if (unavailableProductsEl) unavailableProductsEl.textContent = unavailableProducts;
        if (averagePriceEl) averagePriceEl.textContent = `$${averagePrice}`;


        // Update type counts
        const typeCounts = {
            all: totalProducts,
            cake: allItems.filter(item => item.productType === 'cake').length,
            flower: allItems.filter(item => item.productType === 'flower').length,
            balloon: allItems.filter(item => item.productType === 'balloon').length,
            party: allItems.filter(item => item.productType === 'party').length,
            theme: allItems.filter(item => item.productType === 'theme').length
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
                    <td colspan="7" class="empty-state">
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

            // Type badge
            const typeBadge = row.querySelector('.type-badge');
            typeBadge.textContent = item.productType;
            typeBadge.className = `type-badge ${item.productType}`;

            row.querySelector('.cell-name').textContent = item.name || '';
            row.querySelector('.cell-description').textContent = (item.description || '').substring(0, 50) + (item.description?.length > 50 ? '...' : '');
            row.querySelector('.cell-price').textContent = `$${Number(item.price || 0).toFixed(2)}`;

            // Details based on product type
            let details = '';
            if (item.productType === 'cake') {
                details = `Type: ${item.type || 'N/A'} | Size: ${item.size || 'N/A'} | Layers: ${item.layers || 'N/A'}`;
            } else if (item.productType === 'cakeAddon') {
                details = `Type: ${item.optionTypeName || 'N/A'} | Extra: +$${Number(item.additionalPrice || 0).toFixed(2)}`;
            } else if (item.productType === 'flower') {
                details = `Type: ${item.type || 'N/A'} | Color: ${item.flowerColor || 'N/A'} | Stems: ${item.stemCount || 'N/A'}`;
            } else if (item.productType === 'flowerAddon') {
                details = `Type: ${item.optionTypeName || 'N/A'} | Extra: +$${Number(item.additionalPrice || 0).toFixed(2)}`;
            } else if (item.productType === 'balloon') {
                details = `Type: ${item.balloonType || 'N/A'} | Color: ${item.color || 'N/A'}`;
            } else if (item.productType === 'party') {
                details = `Service: ${item.serviceNumber || 'N/A'} | Category: ${item.category || 'N/A'} | Duration: ${item.duration || 'N/A'}`;
            }
            row.querySelector('.cell-details').textContent = details;

            // Enhanced status badge
            const statusBadge = row.querySelector('.status-badge');
            const isAvailable = item.available === true || item.available === 'true';
            statusBadge.textContent = isAvailable ? 'Available' : 'Unavailable';
            statusBadge.className = `status-badge ${isAvailable ? 'available' : 'unavailable'}`;

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
                // handle checkbox groups named like name[]
                const group = form.querySelectorAll(`input[name="${k}[]"]`);
                if (group && group.length) {
                    const selectedValues = String(values[k] ?? '').split(',').map(s => s.trim()).filter(Boolean);
                    Array.from(group).forEach(cb => { cb.checked = selectedValues.includes(cb.value); });
                    return;
                }
                const input = form.querySelector(`[name="${k}"]`);
                if (!input) return;
                if (input.type === 'file') return;
                if (input.tagName === 'SELECT' && input.multiple) {
                    const selectedValues = String(values[k] ?? '').split(',').map(s => s.trim()).filter(Boolean);
                    Array.from(input.options).forEach(opt => { opt.selected = selectedValues.includes(opt.value); });
                    return;
                }
                input.value = String(values[k] ?? '');
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
                // Skip file inputs - they can't be set programmatically
                if (primaryEl && primaryEl.type !== 'file') primaryEl.value = primary;
                if (galleryEl && galleryEl.type !== 'file') galleryEl.value = gallery;
            }
        }
        openModal(productModal);
    }

    function closeProductForm() { closeModal(productModal); editing = { entity: null, id: null }; }
    if (cancelProduct) cancelProduct.addEventListener('click', closeProductForm);


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
            const map = { cake: KEYS.cakes, cakeAddon: KEYS.cakeAddons, flower: KEYS.flowers, flowerAddon: KEYS.flowerAddons, balloon: KEYS.balloons, party: KEYS.parties, theme: KEYS.themes };
            const key = map[entity];
            const arr = load(key).filter(i => Number(i.id) !== id);
            save(key, arr);
            showToast('Deleted', `${entity} #${id} removed`, 'success');
            refreshAll();
        } else if (action === 'edit') {
            const map = { cake: KEYS.cakes, cakeAddon: KEYS.cakeAddons, flower: KEYS.flowers, flowerAddon: KEYS.flowerAddons, balloon: KEYS.balloons, party: KEYS.parties, theme: KEYS.themes };
            const key = map[entity];
            const item = load(key).find(i => Number(i.id) === id);
            openProductForm(entity, item);
        } else if (action === 'view') {
            const map = { cake: KEYS.cakes, cakeAddon: KEYS.cakeAddons, flower: KEYS.flowers, flowerAddon: KEYS.flowerAddons, balloon: KEYS.balloons, party: KEYS.parties, theme: KEYS.themes };
            const key = map[entity];
            const item = load(key).find(i => Number(i.id) === id);
            if (item) {
                item.productType = entity; // ensure productType is present for static modal routing
                showProductDetails(item);
            } else {
                showToast('Not found', `${entity} #${id} was not found`, 'error');
            }
        }
    });

    // Save handler
    saveProduct?.addEventListener('click', (e) => {
        e.preventDefault();
        if (!editing.entity) return closeProductForm();
        const map = { cake: KEYS.cakes, cakeAddon: KEYS.cakeAddons, flower: KEYS.flowers, flowerAddon: KEYS.flowerAddons, balloon: KEYS.balloons, party: KEYS.parties };
        const key = map[editing.entity];
        const arr = load(key);

        const form = getFormByEntity(editing.entity);
        function val(name) { const el = form?.querySelector(`[name="${name}"]`); return el ? el.value : ''; }
        function valMulti(name) {
            // checkbox groups use name like field[]
            const checkboxes = form?.querySelectorAll(`input[name="${name}[]"]`);
            if (checkboxes && checkboxes.length) {
                const vals = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
                if (vals.includes('nothing')) return '';
                return vals.join(', ');
            }
            // fallback to multi-selects if any remain
            const el = form?.querySelector(`[name="${name}"]`);
            if (el && el.multiple) {
                const values = Array.from(el.selectedOptions).map(o => o.value).filter(Boolean);
                if (values.includes('nothing')) return '';
                return values.join(', ');
            }
            return el ? el.value : '';
        }
        function boolVal(name) { return val(name) === 'true'; }

        let data = {};
        if (editing.entity === 'cake') {
            const imgs = [val('primaryImage'), ...val('galleryImages').split(',').map(s => s.trim()).filter(Boolean)].filter(Boolean);
            data = {
                id: editing.id || nextId(arr),
                cakeId: val('cakeId'),
                name: val('name'),
                description: val('description'),
                basePrice: Number(val('basePrice') || 0),
                images: imgs,
                size: val('size'),
                layers: val('layers'),
                available: boolVal('available'),
                scope: val('scope'),
                type: val('cakeType'),
                // addons/customization
                mainFlavor: valMulti('mainFlavor'),
                fillings: valMulti('fillings'),
                frosting: valMulti('frosting'),
                shape: valMulti('shape'),
                sizeDiameter: valMulti('sizeDiameter'),
                layersAlt: valMulti('layersAlt'),
                baseColors: valMulti('baseColors'),
                decorations: valMulti('decorations'),
                writingText: val('writingText'),
                writingColor: val('writingColor'),
                candles: valMulti('candles'),
                topper: valMulti('topper'),
                topperText: val('topperText'),
                edibleImage: val('edibleImage'),
                addons: currentAddons.filter(addon => addon.type === 'cake')
            };
        } else if (editing.entity === 'cakeAddon') {
            data = { id: editing.id || nextId(arr), cakeId: val('cakeId'), optionTypeName: val('optionTypeName'), optionName: val('optionName'), additionalPrice: Number(val('additionalPrice') || 0), image: val('image'), active: boolVal('active') };
        } else if (editing.entity === 'flower') {
            const imgs = [val('primaryImage'), ...val('galleryImages').split(',').map(s => s.trim()).filter(Boolean)].filter(Boolean);
            data = {
                id: editing.id || nextId(arr),
                name: val('name'),
                type: val('type'),
                basePrice: Number(val('basePrice') || 0),
                images: imgs,
                available: boolVal('available'),
                scope: val('scope'),
                // new flower fields
                flowerColor: val('flowerColor'),
                stemCount: val('stemCount'),
                fillersGreens: valMulti('fillersGreens'),
                packaging: val('packaging'),
                ribbonColor: val('ribbonColor'),
                greetingCard: val('greetingCard'),
                greetingText: val('greetingText'),
                accessories: valMulti('accessories'),
                arrangementStyle: val('arrangementStyle'),
                addons: currentAddons.filter(addon => addon.type === 'flower')
            };
        } else if (editing.entity === 'flowerAddon') {
            data = { id: editing.id || nextId(arr), flowerId: val('flowerId'), optionTypeName: val('optionTypeName'), optionName: val('optionName'), additionalPrice: Number(val('additionalPrice') || 0), image: val('image') };
        } else if (editing.entity === 'balloon') {
            const imgs = [val('primaryImage'), ...val('galleryImages').split(',').map(s => s.trim()).filter(Boolean)].filter(Boolean);
            data = { id: editing.id || nextId(arr), name: val('name'), balloonType: val('balloonType'), color: val('color'), size: val('size'), price: Number(val('price') || 0), images: imgs, available: boolVal('available'), extraDescription: val('extraDescription'), supplierId: val('supplierId'), addons: currentAddons.filter(addon => addon.type === 'balloon') };
        } else if (editing.entity === 'party') {
            const imgs = [val('primaryImage')].filter(Boolean);
            data = {
                id: editing.id || nextId(arr),
                serviceNumber: val('serviceNumber'),
                name: val('name'),
                description: val('description'),
                contents: val('contents'),
                price: Number(val('price') || 0),
                images: imgs,
                category: val('category'),
                duration: val('duration'),
                available: boolVal('available'),
                scope: val('scope')
            };
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

                { id: 2, name: 'Strawberry Dream Cake', description: 'Fresh strawberry cake with cream cheese frosting', basePrice: 95, images: ['../images/ceek3.jpg', '../images/ceek4.jpg'], size: 'Large', layers: 3, available: true, scope: 'public' },

                { id: 5, name: 'Lemon Zest Cake', description: 'Tangy lemon cake with citrus glaze', basePrice: 70, images: ['../images/ceek1.jpg'], size: 'Medium', layers: 2, available: true, scope: 'private' },
                { id: 6, name: 'Carrot Spice Cake', description: 'Moist carrot cake with cream cheese frosting', basePrice: 80, images: ['../images/ceek2.jpg'], size: 'Large', layers: 3, available: true, scope: 'public' }
            ]);

            // Cake Add-ons
            save(KEYS.cakeAddons, [
                { id: 1, cakeId: 1, name: 'Chocolate Ganache Frosting', description: 'Rich and smooth chocolate ganache frosting for your cake', optionTypeName: 'Frosting', optionName: 'Chocolate Ganache', additionalPrice: 15, image: '../images/ceek1.jpg', active: true },
                { id: 2, cakeId: 1, name: 'Vanilla Buttercream Frosting', description: 'Classic vanilla buttercream frosting, light and creamy', optionTypeName: 'Frosting', optionName: 'Vanilla Buttercream', additionalPrice: 10, image: '../images/ceek2.jpg', active: true },
                { id: 3, cakeId: 2, name: 'Fresh Strawberry Topping', description: 'Fresh, sweet strawberries as a beautiful cake topping', optionTypeName: 'Toppings', optionName: 'Fresh Strawberries', additionalPrice: 20, image: '../images/ceek3.jpg', active: true },
                { id: 4, cakeId: 2, name: 'Edible Flower Decoration', description: 'Beautiful edible flowers to decorate your cake', optionTypeName: 'Decoration', optionName: 'Edible Flowers', additionalPrice: 25, image: '../images/ceek4.jpg', active: true },
                { id: 5, cakeId: 3, name: 'Cream Cheese Frosting', description: 'Traditional cream cheese frosting, perfect for red velvet', optionTypeName: 'Frosting', optionName: 'Cream Cheese', additionalPrice: 12, image: '../images/ceek5.jpg', active: true },
                { id: 6, cakeId: 4, name: 'Colorful Sprinkles', description: 'Fun and colorful sprinkles to make your cake festive', optionTypeName: 'Decoration', optionName: 'Sprinkles', additionalPrice: 8, image: '../images/ceek6.jpg', active: true }
            ]);

            // Flowers
            save(KEYS.flowers, [
                { id: 1, name: 'Red Rose Bouquet', description: 'Classic red roses arranged in a beautiful bouquet, perfect for romantic occasions', type: 'Rose', size: 'Large', basePrice: 120, images: ['../../images/rose.jpg', '../../images/rose2.jpg'], available: true, scope: 'public' },
                { id: 2, name: 'Mixed Spring Bouquet', description: 'Fresh spring flowers in a colorful mixed arrangement, bringing joy and freshness', type: 'Mixed', size: 'Medium', basePrice: 85, images: ['../../images/flower1.jpg', '../../images/flower2.jpg'], available: true, scope: 'public' },
                { id: 3, name: 'White Lily Arrangement', description: 'Elegant white lilies in a sophisticated arrangement, perfect for special occasions', type: 'Lily', size: 'Large', basePrice: 95, images: ['../../images/ceek1.jpg'], available: true, scope: 'public' },
                { id: 4, name: 'Sunflower Bouquet', description: 'Bright and cheerful sunflowers that bring sunshine to any room', type: 'Sunflower', size: 'Medium', basePrice: 75, images: ['../../images/ceek2.jpg'], available: false, scope: 'public' },
                { id: 5, name: 'Tulip Collection', description: 'Beautiful tulips in various colors, a perfect spring gift', type: 'Tulip', size: 'Small', basePrice: 65, images: ['../../images/ceek3.jpg'], available: true, scope: 'public' },
                { id: 6, name: 'Orchid Elegance', description: 'Exotic orchids in a stunning arrangement for special occasions', type: 'Orchid', size: 'Medium', basePrice: 110, images: ['../../images/ceek4.jpg'], available: true, scope: 'private' }
            ]);

            // Flower Add-ons
            save(KEYS.flowerAddons, [
                { id: 1, flowerId: 1, name: 'Silk Ribbon Wrap', description: 'Elegant silk ribbon to beautifully wrap your flower bouquet', optionTypeName: 'Wrap', optionName: 'Silk Ribbon', additionalPrice: 15, image: '../images/rose.jpg' },
                { id: 2, flowerId: 1, name: 'Lace Wrap', description: 'Delicate lace wrap for a romantic and elegant presentation', optionTypeName: 'Wrap', optionName: 'Lace Wrap', additionalPrice: 20, image: '../images/rose2.jpg' },
                { id: 3, flowerId: 2, name: 'Glass Vase', description: 'Crystal clear glass vase to display your beautiful flowers', optionTypeName: 'Vase', optionName: 'Glass Vase', additionalPrice: 25, image: '../images/flower1.jpg' },
                { id: 4, flowerId: 2, name: 'Ceramic Vase', description: 'Handcrafted ceramic vase for a unique and artistic touch', optionTypeName: 'Vase', optionName: 'Ceramic Vase', additionalPrice: 30, image: '../images/flower2.jpg' },
                { id: 5, flowerId: 3, name: 'Greeting Card', description: 'Personalized greeting card to accompany your flower delivery', optionTypeName: 'Card', optionName: 'Greeting Card', additionalPrice: 5, image: '../images/ceek1.jpg' },
                { id: 6, flowerId: 4, name: 'Same Day Delivery', description: 'Express same-day delivery service for urgent flower orders', optionTypeName: 'Delivery', optionName: 'Same Day Delivery', additionalPrice: 35, image: '../images/ceek2.jpg' }
            ]);

            // Balloons
            save(KEYS.balloons, [
                { id: 1, name: 'Happy Birthday Balloon Set', description: 'Colorful birthday balloons with helium, perfect for celebrating special moments', balloonType: 'Latex', color: 'Multi', size: 'L', price: 25, images: ['../../images/ballon.jpg'], available: true, extraDescription: 'Colorful birthday balloons with helium' },
                { id: 2, name: 'Heart Shaped Balloon', description: 'Romantic heart-shaped balloon, perfect for anniversaries and Valentine\'s Day', balloonType: 'Foil', color: 'Red', size: 'M', price: 18, images: ['../../images/ceek4.jpg'], available: true, extraDescription: 'Perfect for anniversaries and Valentine\'s Day' },
                { id: 3, name: 'Number Balloon 1', description: 'Large gold number balloon, perfect for milestone birthdays and celebrations', balloonType: 'Foil', color: 'Gold', size: 'XL', price: 22, images: ['../../images/ceek5.jpg'], available: true, extraDescription: 'Large gold number balloon' },
                { id: 4, name: 'Confetti Balloon', description: 'Clear balloon filled with colorful confetti for a festive surprise', balloonType: 'Latex', color: 'Clear', size: 'L', price: 20, images: ['../../images/ceek6.jpg'], available: true, extraDescription: 'Clear balloon filled with confetti' },
                { id: 5, name: 'Star Balloon', description: 'Shiny silver star balloon that adds sparkle to any celebration', balloonType: 'Foil', color: 'Silver', size: 'M', price: 15, images: ['../../images/ceek1.jpg'], available: false, extraDescription: 'Shiny silver star balloon' },
                { id: 6, name: 'Animal Balloon Set', description: 'Adorable set of animal-shaped balloons that kids will love', balloonType: 'Latex', color: 'Multi', size: 'S', price: 30, images: ['../../images/ceek2.jpg'], available: true, extraDescription: 'Set of animal-shaped balloons for kids' },
                { id: 7, name: 'Rainbow Balloon Bouquet', description: 'Beautiful rainbow-colored balloon bouquet for any celebration', balloonType: 'Latex', color: 'Rainbow', size: 'L', price: 35, images: ['../../images/ceek3.jpg'], available: true, extraDescription: 'Rainbow balloon bouquet for celebrations' }
            ]);

            // Parties (Party Planning)
            save(KEYS.parties, [
                { id: 1, serviceNumber: 'PP-1001', name: 'Kids Birthday Basic', description: '2-hour kids party with games and snacks', contents: 'Decorations, Games Host, Music, Snacks', price: 150, images: ['../../images/ballon.jpg'], category: 'Kids', duration: '2 hours', available: true, scope: 'public' },
                { id: 2, serviceNumber: 'PP-2001', name: 'Corporate Mixer', description: '4-hour corporate gathering with light catering', contents: 'Venue Setup, Light Catering, Background Music', price: 600, images: ['../../images/boxjpg.jpg'], category: 'Corporate', duration: '4 hours', available: true, scope: 'private' }
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

    // Ensure Party data exists even if seeded previously without it
    function ensurePartiesIfMissing() {
        const existing = load(KEYS.parties);
        if (!Array.isArray(existing) || existing.length === 0) {
            save(KEYS.parties, [
                { id: 1, serviceNumber: 'PP-1001', name: 'Kids Birthday Basic', description: '2-hour kids party with games and snacks', contents: 'Decorations, Games Host, Music, Snacks', price: 150, images: ['../../images/ballon.jpg'], category: 'Kids', duration: '2 hours', available: true, scope: 'public' },
                { id: 2, serviceNumber: 'PP-2001', name: 'Corporate Mixer', description: '4-hour corporate gathering with light catering', contents: 'Venue Setup, Light Catering, Background Music', price: 600, images: ['../../images/boxjpg.jpg'], category: 'Corporate', duration: '4 hours', available: true, scope: 'private' }
            ]);
        }
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

    // Regenerate Products Button
    const regenerateBtn = document.getElementById('regenerateProductsBtn');
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to regenerate all products? This will replace all existing data with fresh sample products.')) {
                resetAndReseed();
            }
        });
    }

    // Addon Management Functions
    let currentAddons = [];

    function addAddon(type) {
        const nameInput = document.getElementById(type === 'cake' ? 'addon-name' : `${type}-addon-name`);
        const descriptionInput = document.getElementById(type === 'cake' ? 'addon-description' : `${type}-addon-description`);
        const priceInput = document.getElementById(type === 'cake' ? 'addon-price' : `${type}-addon-price`);
        const name = (nameInput?.value || '').trim();
        const description = (descriptionInput?.value || '').trim();
        const price = parseFloat(priceInput?.value || '0') || 0;
        if (!name) { showToast('Error', 'Please enter an add-on name', 'error'); return; }
        const addonData = { id: Date.now(), name, description, price, type };
        currentAddons.push(addonData);
        renderAddons(type);
        if (nameInput) nameInput.value = '';
        if (descriptionInput) descriptionInput.value = '';
        if (priceInput) priceInput.value = '';
        showToast('Success', 'Add-on added successfully', 'success');
    }

    function removeAddon(type, addonId) {
        currentAddons = currentAddons.filter(addon => addon.id !== addonId);
        renderAddons(type);
    }

    function updateAddon(type, addonId, field, value) {
        const addon = currentAddons.find(addon => addon.id === addonId);
        if (addon) { addon[field] = value; }
    }

    function renderAddons(type) {
        const addonsList = document.getElementById(`${type}AddonsList`);
        if (!addonsList) return;
        addonsList.innerHTML = '';
        const typeAddons = currentAddons.filter(addon => addon.type === type);
        typeAddons.forEach(addon => {
            const container = document.createElement('div');
            container.className = 'addon-item';
            container.setAttribute('data-addon-id', String(addon.id));
            container.innerHTML = `
                <div class="addon-details">
                    <h4>${addon.name || 'New Add-on'}</h4>
                    <p>${addon.description || 'No description'}</p>
                    <p><strong>Price:</strong> $${Number(addon.price).toFixed(2)}</p>
                </div>
                <div class="addon-actions">
                    <button type="button" class="btn btn-sm btn-outline" onclick="editAddon('${type}', ${addon.id})"><i class="fas fa-edit"></i></button>
                    <button type="button" class="btn btn-sm btn-danger" onclick="removeAddon('${type}', ${addon.id})"><i class="fas fa-trash"></i></button>
                </div>
            `;
            addonsList.appendChild(container);
        });
    }

    function editAddon(type, addonId) {
        const addonsList = document.getElementById(`${type}AddonsList`);
        if (!addonsList) return;
        const addon = currentAddons.find(a => a.id === addonId);
        if (!addon) return;
        const addonItem = addonsList.querySelector(`[data-addon-id="${addonId}"]`);
        if (!addonItem) return;
        const editForm = document.createElement('div');
        editForm.className = 'addon-edit-form';
        editForm.innerHTML = `
            <div class="edit-form-container">
                <div class="edit-input-group">
                    <div class="form-field"><label>Name</label><input type="text" value="${addon.name}" class="edit-name"></div>
                    <div class="form-field"><label>Description</label><input type="text" value="${addon.description}" class="edit-description"></div>
                    <div class="form-field"><label>Price</label><input type="number" step="0.01" value="${addon.price}" class="edit-price"></div>
                    <div class="form-field">
                        <button type="button" class="btn btn-success btn-sm" onclick="saveAddonEdit('${type}', ${addonId})"><i class="fas fa-save"></i> Save</button>
                        <button type="button" class="btn btn-secondary btn-sm" onclick="cancelAddonEdit('${type}', ${addonId})"><i class="fas fa-times"></i> Cancel</button>
                    </div>
                </div>
            </div>
        `;
        addonItem.style.display = 'none';
        addonItem.parentNode?.insertBefore(editForm, addonItem.nextSibling);
    }

    function saveAddonEdit(type, addonId) {
        const addon = currentAddons.find(addon => addon.id === addonId);
        if (!addon) return;

        const editForm = document.querySelector(`[data-addon-id="${addonId}"]`).nextElementSibling;
        const nameInput = editForm.querySelector('.edit-name');
        const descriptionInput = editForm.querySelector('.edit-description');
        const priceInput = editForm.querySelector('.edit-price');

        const name = nameInput.value.trim();
        const description = descriptionInput.value.trim();
        const price = parseFloat(priceInput.value) || 0;

        if (!name) {
            showToast('Error', 'Please enter an add-on name', 'error');
            return;
        }

        addon.name = name;
        addon.description = description;
        addon.price = price;

        renderAddons(type);
        showToast('Success', 'Add-on updated successfully', 'success');
    }

    function cancelAddonEdit(type, addonId) {
        const addonItem = document.querySelector(`[data-addon-id="${addonId}"]`);
        const editForm = addonItem.nextElementSibling;

        addonItem.style.display = 'block';
        editForm.remove();
    }

    // Add event listeners for addon buttons
    document.getElementById('addCakeAddon')?.addEventListener('click', () => addAddon('cake'));
    document.getElementById('addFlowerAddon')?.addEventListener('click', () => addAddon('flower'));
    document.getElementById('addBalloonAddon')?.addEventListener('click', () => addAddon('balloon'));

    // Make functions globally available
    window.addAddon = addAddon;
    window.removeAddon = removeAddon;
    window.editAddon = editAddon;
    window.saveAddonEdit = saveAddonEdit;
    window.cancelAddonEdit = cancelAddonEdit;

    // Clear addons when opening a new form
    function clearAddons() {
        currentAddons = [];
        renderAddons('cake');
        renderAddons('flower');
        renderAddons('balloon');
    }

    // Update the openProductForm function to clear addons
    const originalOpenProductForm = window.openProductForm;
    window.openProductForm = function (entity, item) {
        clearAddons();

        // Load existing addons if editing
        if (item && item.addons && item.addons.length > 0) {
            currentAddons = [...item.addons];
            renderAddons(entity);
        }

        if (originalOpenProductForm) {
            originalOpenProductForm(entity, item);
        }
    };

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
    ensurePartiesIfMissing();
    renderAllProducts();
});


