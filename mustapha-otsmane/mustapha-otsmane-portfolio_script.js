// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handler
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! I will get back to you soon.');
    this.reset();
});

// Add animation to elements when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply initial styles and observe elements
document.querySelectorAll('.project-card, .expertise-card, .interest-item, .event-item, .skill-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(element);
});

// Lightbox functionality
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const currentIndexSpan = document.getElementById('currentIndex');
const totalImagesSpan = document.getElementById('totalImages');
const galleryItems = document.querySelectorAll('.gallery-item');

let currentEvent = '';
let currentIndex = 0;

// Event image data
const eventImages = {
    qnexus: [
        { src: '../assets-mustapha-otsmane/qml.jpg', alt: 'QML Workshop at QNexus 25' },
        { src: '../assets-mustapha-otsmane/qva.jpg', alt: 'QVA Workshop at QNexus 25' },
        { src: '../assets-mustapha-otsmane/prf.jpg', alt: 'Interview with Professor at QNexus 25' }
    ],
    aws: [
        { src: '../assets-mustapha-otsmane/aws1.jpg', alt: 'Cloud Architecture session at AWS Discovery' },
        { src: '../assets-mustapha-otsmane/aws3.jpg', alt: 'Speaker session with Bilal Kalem' },
    ]
};

// Open lightbox when gallery item is clicked
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        currentEvent = item.getAttribute('data-event');
        currentIndex = parseInt(item.getAttribute('data-index'));
        openLightbox(currentEvent, currentIndex);
    });
});

// Open lightbox function
function openLightbox(event, index) {
    const images = eventImages[event];
    if (images && images[index]) {
        lightboxImage.src = images[index].src;
        lightboxImage.alt = images[index].alt;
        currentIndexSpan.textContent = index + 1;
        totalImagesSpan.textContent = images.length;
        lightboxModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Close lightbox
lightboxClose.addEventListener('click', () => {
    lightboxModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close lightbox when clicking outside the image
lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
        lightboxModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Navigate to previous image
lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    const images = eventImages[currentEvent];
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImage.src = images[currentIndex].src;
    lightboxImage.alt = images[currentIndex].alt;
    currentIndexSpan.textContent = currentIndex + 1;
});

// Navigate to next image
lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    const images = eventImages[currentEvent];
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImage.src = images[currentIndex].src;
    lightboxImage.alt = images[currentIndex].alt;
    currentIndexSpan.textContent = currentIndex + 1;
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightboxModal.style.display === 'flex') {
        if (e.key === 'Escape') {
            lightboxModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowLeft') {
            lightboxPrev.click();
        } else if (e.key === 'ArrowRight') {
            lightboxNext.click();
        }
    }
});