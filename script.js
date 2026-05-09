//  dynamic SEO
function addSEOStructuredData() {
    const services = JSON.parse(localStorage.getItem('services') || '[]');
    
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Crane Rental Services Dubai",
        "itemListElement": services.map((service, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": service.title,
            "description": service.description,
            "url": "https://bestcraneservice.ae/#services"
        }))
    };
    
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.textContent = JSON.stringify(serviceSchema);
    document.head.appendChild(schemaScript);
}

// Call in DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initData();
    loadServices();
    loadGallery();
    loadReviews();
    loadContactInfo();
    addSEOStructuredData(); // SEO Boost!
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize data from localStorage with ICONS
function initData() {
    // Services data WITH ICONS
    if (!localStorage.getItem('services')) {
        const services = [
            {
                id: 1,
                title: "Mobile Cranes for Rent (25-100Ton)",
                description: "Heavy Lifting, Construction Support, Machinery & Glass Panel Loading/Unloading Service UAE. We offer mobile crane rentals from 25 to 100 tons for construction, heavy lifting and industrial tasks.",
                icon: "fas fa-truck"
            },
            {
                id: 2,
                title: "Mobile Crane Rental Service",
                description: "24/7 mobile crane rental services in Musaffah Abu Dhabi. From 20 to 100 ton cranes, we provide expert operators, fast response & safe lifting.",
                icon: "fas fa-cube"
            },
            {
                id: 3,
                title: "Crane in Musaffah",
                description: "Affordable Crane Rental in Musaffah, Abu Dhabi! Mobile cranes at very cheap rates, perfect for construction, lifting & heavy-duty work. Minimum 2 hours rental!",
                icon: "fas fa-map-marker-alt"
            },
            {
                id: 4,
                title: "Crane Operation",
                description: "Reliable crane services for lifting accidental vehicles, rescuing stranded cars and loading all types of scrap materials. Experienced operators ensure safe handling.",
                icon: "fas fa-hard-hat"
            },
            {
                id: 5,
                title: "Crane Hire",
                description: "Heavy lifting with flexible rental plans available on daily, weekly and monthly basis. All cranes maintained to highest safety standards.",
                icon: "fas fa-tools"
            },
            {
                id: 6,
                title: "Sheds Installation",
                description: "Mobile crane services for installing sheds, shelters, rooftops, and more. Safe, efficient lifting for construction sites and heavy machinery.",
                icon: "fas fa-building"
            },
            {
                id: 7,
                title: "Heavy Weight Lifting Equipment",
                description: "Specialize in heavy lifting for equipment and machinery up to 500 tons. Safe handling for construction, industrial projects, and equipment installation.",
                icon: "fas fa-weight-hanging"
            },
            {
                id: 8,
                title: "Glass Bundle Uploading/Unloading",
                description: "Expert mobile crane services for safely loading/unloading large glass sheets/bundles onto trucks with precision and care.",
                icon: "fas fa-window-maximize"
            },
            {
                id: 9,
                title: "Weight Lifting for Building Projects",
                description: "Professional heavy lifting services for building projects using mobile cranes up to 100 tons. Ideal for steel structures and concrete slabs.",
                icon: "fas fa-layer-group"
            }
        ];
        localStorage.setItem('services', JSON.stringify(services));
    }

    // Gallery images
    if (!localStorage.getItem('gallery')) {

    const gallery = [
        {
            id: 1,
            url: "images/25-TON-CRANE.jpg"
        },
        {
            id: 2,
            url: "images/50-TON-CRANE.jpg"
        },
        {
            id: 3,
            url: "images/75-TON-CRANE.jpg"
        },
        {
            id: 4,
            url: "images/100-TON-CRANE.jpg"
        },
        {
            id: 5,
            url: "images/5-TON-FORKLIFT.jpg"
        },
        {
            id: 6,
            url: "images/10-TON-FORKLIFT.jpg"
        },
        {
            id: 7,
            url: "images/BOOM-LOADER.jpg"
        },
        {
            id: 8,
            url: "images/BOOM-LOADER2.jpg"
        },
        {
            id: 9,
            url: "images/CRAWL-CRANE.jpg"
        },
        {
            id: 10,
            url: "images/CRAWL-CRANE2.jpg"
        },
        {
            id: 11,
            url: "images/TOWER-CRANE.jpg"
        },
        {
            id: 12,
            url: "images/TOWER-CRANE2.jpg"
        }
    ];

    localStorage.setItem('gallery', JSON.stringify(gallery));
}

    // Reviews data
    if (!localStorage.getItem('reviews')) {
        const reviews = [
            {
                id: 1,
                name: "Ahmed Khan",
                rating: 5,
                text: "Excellent service! Fast response and professional operators. Highly recommended for Musaffah area.",
                date: new Date().toISOString()
            },
            {
                id: 2,
                name: "Fatima Ali",
                rating: 5,
                text: "Very reliable 24/7 service. Got our heavy machinery lifted safely within 2 hours of calling.",
                date: new Date().toISOString()
            }
        ];
        localStorage.setItem('reviews', JSON.stringify(reviews));
    }

    // Contact info
    if (!localStorage.getItem('contactInfo')) {
        const contactInfo = {
            phone: "0504591121",
            whatsapp: "+971504591121",
            address: "M18 Parking Lot, Mussafah, Abu Dhabi"
        };
        localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
    }
}

// Load Services WITH ICONS
function loadServices() {
    const services = JSON.parse(localStorage.getItem('services') || '[]');
    const servicesGrid = document.getElementById('servicesGrid');
    const serviceTypeSelect = document.getElementById('serviceType');
    
    servicesGrid.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>
            <h3>${service.title}</h3>
            <p>${service.description.substring(0, 150)}...</p>
        </div>
    `).join('');

    // Populate service type dropdown
    serviceTypeSelect.innerHTML = '<option value="">Select Service</option>' + 
        services.map(service => 
            `<option value="${service.id}">${service.title}</option>`
        ).join('');
}

// Rest of the functions remain the same...
function loadGallery() {
    const gallery = JSON.parse(localStorage.getItem('gallery') || '[]');
    const galleryGrid = document.getElementById('galleryGrid');
    
    galleryGrid.innerHTML = gallery.map(img => `
        <div class="gallery-item">
            <img src="${img.url}" alt="Crane Service ${img.id}" loading="lazy">
        </div>
    `).join('');
}

function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const reviewsGrid = document.getElementById('reviewsGrid');
    
    reviewsGrid.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="rating">${'⭐'.repeat(review.rating)}</div>
                <div class="reviewer-name">${review.name}</div>
            </div>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');
}

function loadContactInfo() {
    const contactInfo = JSON.parse(localStorage.getItem('contactInfo') || '{}');
    const contactInfoDiv = document.getElementById('contactInfo');
    
    contactInfoDiv.innerHTML = `
        <div class="contact-item">
            <i class="fas fa-phone"></i>
            <div>
                <h3>Phone</h3>
                <p><a href="tel:${contactInfo.phone}">${contactInfo.phone}</a></p>
            </div>
        </div>
        <div class="contact-item">
            <i class="fab fa-whatsapp"></i>
            <div>
                <h3>WhatsApp</h3>
                <p><a href="https://wa.me/${contactInfo.whatsapp}" target="_blank">${contactInfo.whatsapp}</a></p>
            </div>
        </div>
        <div class="contact-item">
            <i class="fas fa-map-marker-alt"></i>
            <div>
                <h3>Address</h3>
                <p>${contactInfo.address}</p>
            </div>
        </div>
    `;
}

// Service Form Submission
document.getElementById('serviceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        serviceType: document.getElementById('serviceType').value,
        details: document.getElementById('details').value,
        timestamp: new Date().toISOString()
    };

    alert('Thank you! Your service request has been submitted. We will contact you soon via WhatsApp.');
    this.reset();
    window.open(`https://wa.me/+971504591121?text=Service Request: ${formData.name} - ${formData.details}`, '_blank');
});

// Review Form Submission
document.getElementById('reviewForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const review = {
        id: Date.now(),
        name: document.getElementById('reviewName').value,
        rating: parseInt(document.getElementById('rating').value),
        text: document.getElementById('reviewText').value,
        date: new Date().toISOString()
    };

    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    reviews.unshift(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    loadReviews();
    alert('Thank you for your review!');
    this.reset();
});

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', function() {
    initData();
    loadServices();
    loadGallery();
    loadReviews();
    loadContactInfo();
    
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(28, 36, 52, 0.98)';
        } else {
            header.style.background = 'rgba(28, 36, 52, 0.95)';
        }
    });
});