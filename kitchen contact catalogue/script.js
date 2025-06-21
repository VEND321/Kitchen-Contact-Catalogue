document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding content
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // FAQ functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            question.classList.toggle('active');
            const answer = question.nextElementSibling;
            answer.classList.toggle('show');
        });
    });
    
    // WhatsApp order functionality
    const orderButtons = document.querySelectorAll('.item-btn');
    const whatsappBtns = document.querySelectorAll('.btn-whatsapp');
    const successMessage = document.getElementById('success-message');
    const itemCount = document.getElementById('item-count');
    let orderItems = [];
    
    // Quantity selector functionality
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value) || 1;
            
            if (this.classList.contains('minus') && value > 1) {
                value--;
            } else if (this.classList.contains('plus')) {
                value++;
            }
            
            input.value = value;
        });
    });
    
    orderButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemCard = button.closest('.item-card');
            const quantityInput = itemCard.querySelector('.quantity-input');
            const quantity = parseInt(quantityInput.value) || 1;
            
            const itemName = button.getAttribute('data-item');
            const itemPrice = button.getAttribute('data-price');
            
            // Check if item already exists in order
            const existingItemIndex = orderItems.findIndex(item => item.name === itemName);
            
            if (existingItemIndex !== -1) {
                // Update quantity if item exists
                orderItems[existingItemIndex].quantity += quantity;
            } else {
                // Add new item
                orderItems.push({
                    name: itemName,
                    price: itemPrice,
                    quantity: quantity
                });
            }
            
            // Show success message
            itemCount.textContent = orderItems.reduce((sum, item) => sum + item.quantity, 0);
            successMessage.style.display = 'flex';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
            
            // Update button text temporarily
            const originalText = button.textContent;
            button.textContent = 'Added!';
            button.style.backgroundColor = '#2ecc71';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '#f39c12';
            }, 1500);
            
            // Pulse WhatsApp buttons to draw attention
            whatsappBtns.forEach(btn => {
                btn.classList.add('pulse');
                setTimeout(() => {
                    btn.classList.remove('pulse');
                }, 3000);
            });
        });
    });
    
    // Generate WhatsApp message when clicking WhatsApp buttons
    whatsappBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (orderItems.length > 0 && !btn.hasAttribute('data-no-items')) {
                e.preventDefault();
                
                let message = "Hello Kitchen Contact, I'd like to place an order for the following items:\n\n";
                
                orderItems.forEach(item => {
                    const totalPrice = item.quantity * parseInt(item.price);
                    message += `- ${item.name} (Qty: ${item.quantity}): ₦${item.price} each = ₦${totalPrice}\n`;
                });
                
                // Calculate total
                const grandTotal = orderItems.reduce((sum, item) => {
                    return sum + (item.quantity * parseInt(item.price));
                }, 0);
                
                message += `\nTotal: ₦${grandTotal}\n`;
                message += "\nPlease confirm availability. Thank you!";
                
                const encodedMessage = encodeURIComponent(message);
                window.open(`https://wa.me/2348188726102?text=${encodedMessage}`, '_blank');
                
                // Fallback in case window.open is blocked
                setTimeout(function() {
                    window.location.href = `https://web.whatsapp.com/send?phone=2348188726102&text=${encodedMessage}`;
                }, 2000);
            }
        });
    });
    
    // PDF Download functionality
    const downloadPdfBtn = document.getElementById('downloadPdf');
    
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', (e) => {
            // In a real implementation, this would link to an actual PDF
            // This is just a fallback
            if (!document.querySelector('asset/catalogue.pdf')) {
                e.preventDefault();
                alert('Downloading our catalogue...');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});