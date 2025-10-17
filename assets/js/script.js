// CanteenHub JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeFilters();
    initializeFeedbackForm();
    initializeAnimations();
    initializeSmoothScrolling();
});

// Filter functionality for dashboard
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const menuSections = document.querySelectorAll('.menu-section');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter menu items
            menuItems.forEach(item => {
                const itemType = item.getAttribute('data-type');
                const itemCategory = item.getAttribute('data-category');
                
                if (filter === 'all') {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                } else if (filter === 'veg' && itemType === 'veg') {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                } else if (filter === 'non-veg' && itemType === 'non-veg') {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                } else if (filter === itemCategory) {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('fade-in');
                }
            });
            
            // Show/hide menu sections based on filter
            menuSections.forEach(section => {
                const sectionCategory = section.getAttribute('data-category');
                const visibleItems = section.querySelectorAll('.menu-item[style*="block"]');
                
                if (filter === 'all') {
                    section.style.display = 'block';
                } else if (filter === 'veg' || filter === 'non-veg') {
                    section.style.display = 'block';
                } else if (filter === sectionCategory) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
}

// Feedback form functionality
function initializeFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    const starInputs = document.querySelectorAll('input[name="rating"]');
    const ratingText = document.getElementById('ratingText');
    
    if (feedbackForm) {
        // Star rating functionality
        starInputs.forEach(input => {
            input.addEventListener('change', function() {
                const rating = this.value;
                const ratingMessages = {
                    '1': 'Poor - We need to improve',
                    '2': 'Fair - Room for improvement',
                    '3': 'Good - Satisfactory experience',
                    '4': 'Very Good - Great experience',
                    '5': 'Excellent - Outstanding experience'
                };
                
                ratingText.textContent = ratingMessages[rating] || 'Click to rate';
                ratingText.style.color = getRatingColor(rating);
            });
        });
        
        // Form submission
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const feedbackData = Object.fromEntries(formData);
            
            // Validate required fields
            if (!feedbackData.name || !feedbackData.email || !feedbackData.dish || !feedbackData.rating || !feedbackData.feedback) {
                showAlert('Please fill in all required fields.', 'danger');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                showAlert('Thank you for your feedback! We appreciate your input and will use it to improve our service.', 'success');
                feedbackForm.reset();
                ratingText.textContent = 'Click to rate';
                ratingText.style.color = '#666';
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Log feedback data (in real app, this would be sent to server)
                console.log('Feedback submitted:', feedbackData);
            }, 2000);
        });
    }
}

// Get rating color based on rating value
function getRatingColor(rating) {
    const colors = {
        '1': '#dc3545', // Red
        '2': '#fd7e14', // Orange
        '3': '#ffc107', // Yellow
        '4': '#28a745', // Green
        '5': '#20c997'  // Teal
    };
    return colors[rating] || '#666';
}

// Initialize animations
function initializeAnimations() {
    // Add fade-in animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .stat-item, .value-item, .contact-item');
    animateElements.forEach(el => observer.observe(el));
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Show alert messages
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} custom-alert alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to page
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Search functionality (if needed)
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const menuItems = document.querySelectorAll('.menu-item');
            
            menuItems.forEach(item => {
                const title = item.querySelector('.card-title').textContent.toLowerCase();
                const description = item.querySelector('.card-text').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

// Add to cart functionality (placeholder)
function addToCart(dishName, price) {
    showAlert(`${dishName} added to cart! Price: ₹${price}`, 'success');
    
    // In a real application, this would update a cart state
    console.log(`Added to cart: ${dishName} - ₹${price}`);
}

// Favorites functionality (placeholder)
function toggleFavorite(element) {
    const icon = element.querySelector('i');
    
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        element.style.color = '#dc3545';
        showAlert('Added to favorites!', 'success');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        element.style.color = '#6c757d';
        showAlert('Removed from favorites!', 'info');
    }
}

// Price filter functionality
function filterByPrice(minPrice, maxPrice) {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const priceText = item.querySelector('.price').textContent;
        const price = parseInt(priceText.replace('₹', ''));
        
        if (price >= minPrice && price <= maxPrice) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Sort functionality
function sortMenu(sortBy) {
    const menuSections = document.querySelectorAll('.menu-section');
    
    menuSections.forEach(section => {
        const items = Array.from(section.querySelectorAll('.menu-item'));
        
        items.sort((a, b) => {
            if (sortBy === 'price-asc') {
                const priceA = parseInt(a.querySelector('.price').textContent.replace('₹', ''));
                const priceB = parseInt(b.querySelector('.price').textContent.replace('₹', ''));
                return priceA - priceB;
            } else if (sortBy === 'price-desc') {
                const priceA = parseInt(a.querySelector('.price').textContent.replace('₹', ''));
                const priceB = parseInt(b.querySelector('.price').textContent.replace('₹', ''));
                return priceB - priceA;
            } else if (sortBy === 'name') {
                const nameA = a.querySelector('.card-title').textContent;
                const nameB = b.querySelector('.card-title').textContent;
                return nameA.localeCompare(nameB);
            }
            return 0;
        });
        
        // Re-append sorted items
        const container = section.querySelector('.row');
        items.forEach(item => container.appendChild(item));
    });
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Theme toggle functionality (bonus feature)
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
}

// Initialize theme on page load
loadTheme();

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close modals/alerts
    if (e.key === 'Escape') {
        const alerts = document.querySelectorAll('.custom-alert');
        alerts.forEach(alert => alert.remove());
    }
});

// Performance optimization: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized search with debouncing
const debouncedSearch = debounce(function(searchTerm) {
    // Search implementation here
    console.log('Searching for:', searchTerm);
}, 300);

// Export functions for global use
window.CanteenHub = {
    addToCart,
    toggleFavorite,
    filterByPrice,
    sortMenu,
    toggleTheme,
    showAlert
};
