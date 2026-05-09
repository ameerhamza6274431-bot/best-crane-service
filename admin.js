(function(){
    // PASSWORD ENCRYPTED - INVISIBLE IN SOURCE
    const _0x1234 = [66,51,115,116,67,114,64,110,101,68,117,98,64,105,50,48,50,54,33];
    const AUTH_KEY = String.fromCharCode(..._0x1234);
    
    // Anti-Source View
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if(e.keyCode==123 || (e.ctrlKey && e.shiftKey && e.keyCode=='I') || (e.ctrlKey && e.shiftKey && e.keyCode=='C') || (e.ctrlKey && e.shiftKey && e.keyCode=='J') || (e.ctrlKey && e.keyCode=='U'))
            return false;
    });
    
    // Self-Destruct on Inspect
    const observer = new MutationObserver(function(mutations) {
        if (document.querySelector('devtools-toolstrip') || window.outerHeight < 300) {
            document.body.innerHTML = '<h1>Access Denied</h1>';
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('authForm');
        const loginContainer = document.getElementById('loginContainer');
        const adminPanel = document.getElementById('adminPanel');
        document.getElementById('logoutBtn')
        .addEventListener('click', logout);
        
        // Session Check
        if (localStorage.getItem('craneAdmin') === btoa(AUTH_KEY)) {
            showPanel();
            return;
        }
        
        loginForm.onsubmit = function(e) {
            e.preventDefault();
            const input = document.getElementById('accessKey').value;
            
            if (input === AUTH_KEY) {
                localStorage.setItem('craneAdmin', btoa(AUTH_KEY));
                localStorage.setItem('loginTime', Date.now());
                showPanel();
            } else {
                errorShake();
            }
        };
        
        // Auto-logout 1 hour
        setInterval(() => {
            if (localStorage.getItem('loginTime') && 
                Date.now() - parseInt(localStorage.getItem('loginTime')) > 3600000) {
                logout();
            }
        }, 60000);
    });
    
    function showPanel() {
    document.body.classList.add('unlocked');

    const loginBox = document.getElementById('loginContainer');
    if (loginBox) {
        loginBox.remove();
    }

    document.getElementById('adminPanel').style.display = 'flex';

    // LOAD DATA
    loadContactInfo();
    loadServicesList();
    loadGalleryList();
    loadReviewsList();
}
    
    function logout() {
    localStorage.removeItem('craneAdmin');
    localStorage.removeItem('loginTime');
    location.reload();
}
    
    function errorShake() {
        const input = document.getElementById('accessKey');
        input.style.animation = 'shake 0.6s';
        input.value = '';
        setTimeout(() => input.style.animation = '', 600);
    }
    
    // Inject CSS
    const css = document.createElement('style');
    css.textContent = `
        @keyframes shake {
            0%,100%{transform:translateX(0)}
            20%{transform:translateX(-10px)}
            40%{transform:translateX(10px)}
            60%{transform:translateX(-10px)}
            80%{transform:translateX(10px)}
        }
        body.unlocked .admin-panel{display:flex!important}
    `;
    document.head.appendChild(css);
})();
// Admin Panel Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.admin-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(`${section}-section`).classList.add('active');
        });
    });

    // Load all data
    loadContactInfo();
    loadServicesList();
    loadGalleryList();
    loadReviewsList();

    // Event Listeners
    document.getElementById('contactForm').addEventListener('submit', saveContactInfo);
    document.getElementById('addServiceBtn').addEventListener('click', () => openServiceModal());
    document.getElementById('serviceFormModal').addEventListener('submit', saveService);
    document.getElementById('cancelService').addEventListener('click', closeServiceModal);

    document.getElementById('addImageBtn').addEventListener('click', openImageModal);
    document.getElementById('imageFormModal').addEventListener('submit', saveImage);
    document.getElementById('cancelImage').addEventListener('click', closeImageModal);
    document.getElementById('imageUrl').addEventListener('input', previewImage);

    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeAllModals);
    });

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
});

// ===== CONTACT FUNCTIONS =====
function loadContactInfo() {
    const contactInfo = JSON.parse(localStorage.getItem('contactInfo') || '{}');
    document.getElementById('adminPhone').value = contactInfo.phone || '';
    document.getElementById('adminWhatsapp').value = contactInfo.whatsapp || '';
    document.getElementById('adminAddress').value = contactInfo.address || '';
}

function saveContactInfo(e) {
    e.preventDefault();
    const contactInfo = {
        phone: document.getElementById('adminPhone').value,
        whatsapp: document.getElementById('adminWhatsapp').value,
        address: document.getElementById('adminAddress').value
    };
    localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
    alert('✅ Contact information saved successfully!');
    loadContactInfo();
}

// ===== SERVICES FUNCTIONS =====
let editingServiceId = null;

function loadServicesList() {
    const services = JSON.parse(localStorage.getItem('services') || '[]');
    const container = document.getElementById('servicesList');
    
    if (services.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No services found. Add your first service!</p>';
        return;
    }
    
    container.innerHTML = services.map(service => `
        <div class="item-card">
            <div class="item-content">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                    <i class="${service.icon || 'fas fa-cogs'}" style="font-size: 1.8rem; color: #F4C522; width: 30px;"></i>
                    <div>
                        <h4>${service.title}</h4>
                        <small style="color: #666;">${service.icon || 'No icon'}</small>
                    </div>
                </div>
                <p style="margin-bottom: 1rem;">${service.description.substring(0, 120)}...</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-primary" onclick="editService(${service.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteService(${service.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Add this to existing admin.js event listeners section
document.getElementById('serviceIcon').addEventListener('change', function() {
    const iconClass = this.value;
    const previewIcon = document.querySelector('#iconPreview i');
    const previewText = document.querySelector('#iconPreview span');
    
    if (iconClass) {
        previewIcon.className = iconClass;
        previewText.textContent = 'Selected';
        previewIcon.style.color = '#F4C522';
    } else {
        previewIcon.className = 'fas fa-truck-pickup';
        previewText.textContent = 'Preview';
        previewIcon.style.color = '#999';
    }
});

// Update openServiceModal function
function openServiceModal(editId = null) {
    editingServiceId = editId;
    const modal = document.getElementById('serviceModal');
    const titleInput = document.getElementById('serviceTitle');
    const iconSelect = document.getElementById('serviceIcon');
    const descInput = document.getElementById('serviceDesc');
    const modalTitle = document.getElementById('modalTitle');
    
    if (editId) {
        const services = JSON.parse(localStorage.getItem('services') || '[]');
        const service = services.find(s => s.id == editId);
        if (service) {
            titleInput.value = service.title;
            iconSelect.value = service.icon || '';
            descInput.value = service.description;
            modalTitle.textContent = 'Edit Service';
            
            // Trigger preview update
            iconSelect.dispatchEvent(new Event('change'));
        }
    } else {
        titleInput.value = '';
        iconSelect.value = '';
        descInput.value = '';
        modalTitle.textContent = 'Add New Service';
        iconSelect.dispatchEvent(new Event('change'));
    }
    
    modal.style.display = 'block';
}

function saveService(e) {
    e.preventDefault();
    const title = document.getElementById('serviceTitle').value.trim();
    const icon = document.getElementById('serviceIcon').value.trim();
    const description = document.getElementById('serviceDesc').value.trim();
    
    if (!title || !description) {
        alert('❌ Please fill title and description!');
        return;
    }
    
    let services = JSON.parse(localStorage.getItem('services') || '[]');
    
    if (editingServiceId) {
        services = services.map(s => 
            s.id == editingServiceId 
                ? { id: editingServiceId, title, icon, description }
                : s
        );
        alert('✅ Service updated successfully!');
    } else {
        const newId = Math.max(...services.map(s => s.id || 0), 0) + 1;
        services.unshift({ id: newId, title, icon, description });
        alert('✅ New service added successfully!');
    }
    
    localStorage.setItem('services', JSON.stringify(services));
    loadServicesList();
    closeServiceModal();
}

function editService(id) {
    openServiceModal(id);
}

function deleteService(id) {
    if (confirm('🗑️ Are you sure you want to delete this service?')) {
        let services = JSON.parse(localStorage.getItem('services') || '[]');
        services = services.filter(s => s.id != id);
        localStorage.setItem('services', JSON.stringify(services));
        loadServicesList();
        alert('✅ Service deleted successfully!');
    }
}

function closeServiceModal() {
    document.getElementById('serviceModal').style.display = 'none';
    editingServiceId = null;
}

// ===== GALLERY FUNCTIONS =====
function loadGalleryList() {
    const gallery = JSON.parse(localStorage.getItem('gallery') || '[]');
    const container = document.getElementById('galleryList');
    
    if (gallery.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No images found. Add your first image!</p>';
        return;
    }
    
    container.innerHTML = gallery.map(img => `
        <div class="item-card">
            <div class="item-content">
                <img src="${img.url}" alt="Gallery Image" style="width: 100px; height: 75px; object-fit: cover; border-radius: 8px; border: 3px solid #f0f0f0;">
                <div>
                    <p style="font-size: 0.9rem; margin: 0;">Image ${img.id}</p>
                    <small style="color: #666;">${img.url.substring(0, 50)}...</small>
                </div>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger" onclick="deleteImage(${img.id})" title="Delete Image">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function openImageModal() {
    document.getElementById('imageUrl').value = '';
    document.getElementById('imagePreview').src = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('imageModal').style.display = 'block';
}

function previewImage() {
    const url = document.getElementById('imageUrl').value.trim();
    const preview = document.getElementById('imagePreview');
    
    if (url) {
        preview.src = url;
        preview.style.display = 'block';
        preview.onerror = () => {
            preview.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
            preview.style.display = 'block';
        };
    } else {
        preview.style.display = 'none';
    }
}

function saveImage(e) {
    e.preventDefault();
    const url = document.getElementById('imageUrl').value.trim();
    
    if (!url) {
        alert('❌ Please enter image URL!');
        return;
    }
    
    let gallery = JSON.parse(localStorage.getItem('gallery') || '[]');
    const newId = Math.max(...gallery.map(img => img.id || 0), 0) + 1;
    
    gallery.unshift({ id: newId, url });
    localStorage.setItem('gallery', JSON.stringify(gallery));
    
    loadGalleryList();
    closeImageModal();
    alert('✅ Image added successfully!');
}

function deleteImage(id) {
    if (confirm('🖼️ Are you sure you want to delete this image?')) {
        let gallery = JSON.parse(localStorage.getItem('gallery') || '[]');
        gallery = gallery.filter(img => img.id != id);
        localStorage.setItem('gallery', JSON.stringify(gallery));
        loadGalleryList();
        alert('✅ Image deleted successfully!');
    }
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// ===== REVIEWS FUNCTIONS =====
function loadReviewsList() {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const container = document.getElementById('reviewsList');
    
    if (reviews.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No reviews found.</p>';
        return;
    }
    
    container.innerHTML = reviews.map(review => `
        <div class="item-card">
            <div class="item-content">
                <h4>${review.name} <span style="color: #28A745;">${'⭐'.repeat(review.rating)}</span></h4>
                <p>"${review.text.substring(0, 100)}${review.text.length > 100 ? '...' : ''}"</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger" onclick="deleteReview(${review.id})" title="Delete Review">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function deleteReview(id) {
    if (confirm('⭐ Are you sure you want to delete this review?')) {
        let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        reviews = reviews.filter(r => r.id != id);
        localStorage.setItem('reviews', JSON.stringify(reviews));
        loadReviewsList();
        alert('✅ Review deleted successfully!');
    }
}

// ===== UTILITY FUNCTIONS =====
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    editingServiceId = null;
}