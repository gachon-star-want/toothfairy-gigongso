document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. Navigation & Mobile Menu Toggle
    // ==========================================================================
    const header = document.querySelector('.header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky header class trigger
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle open/close
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        
        // Animated bars
        const bars = mobileToggle.querySelectorAll('.bar');
        if (navMenu.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const bars = mobileToggle.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });

    // ==========================================================================
    // 2. Animated Counter for Stats Section
    // ==========================================================================
    const stats = document.querySelectorAll('.stat-num');
    let counted = false;

    const countUp = () => {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            let count = 0;
            const duration = 1500; // milliseconds
            const increment = target / (duration / 16); // ~60fps
            
            const updateCount = () => {
                count += increment;
                if (count < target) {
                    stat.innerText = Math.floor(count);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.innerText = target;
                }
            };
            
            updateCount();
        });
    };

    // Trigger counter when in viewport
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                countUp();
                counted = true;
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // ==========================================================================
    // 3. File Upload Simulation & Drag and Drop
    // ==========================================================================
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    let selectedFiles = [];

    // Trigger file dialog
    dropzone.addEventListener('click', (e) => {
        if (e.target.className !== 'file-item-delete') {
            fileInput.click();
        }
    });

    // Drag-over styling
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    // Drop handler
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });

    // Selection handler
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    });

    function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            selectedFiles.push(files[i]);
        }
        renderFileList();
    }

    function renderFileList() {
        fileList.innerHTML = '';
        selectedFiles.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'file-item';
            
            // Format file size
            const sizeKB = (file.size / 1024).toFixed(1);
            
            item.innerHTML = `
                <span class="file-item-name">${file.name} (${sizeKB} KB)</span>
                <span class="file-item-delete" data-index="${index}">&times;</span>
            `;
            
            fileList.appendChild(item);
        });
    }

    // Delete file handler
    fileList.addEventListener('click', (e) => {
        if (e.target.classList.contains('file-item-delete')) {
            const index = parseInt(e.target.getAttribute('data-index'), 10);
            selectedFiles.splice(index, 1);
            renderFileList();
        }
    });

    // ==========================================================================
    // 4. Form Submission & Fake Door Pretotype Tracking
    // ==========================================================================
    const leadForm = document.getElementById('leadForm');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    
    const modalClinic = document.getElementById('modalClinic');
    const modalClient = document.getElementById('modalClient');
    const modalTicket = document.getElementById('modalTicket');

    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Gather Form Data
        const clinicName = document.getElementById('clinicName').value;
        const clientName = document.getElementById('clientName').value;
        const phone = document.getElementById('phone').value;
        const serviceType = document.getElementById('serviceType').value;
        const message = document.getElementById('message').value;
        const privacyAgree = document.getElementById('privacyAgree').checked;

        if (!privacyAgree) {
            alert('개인정보 동의가 필요합니다.');
            return;
        }

        // 2. Pretotype Conversion Logging (Simulated Analytics Event)
        const eventData = {
            clinicName,
            clientName,
            phone,
            serviceType,
            message,
            fileCount: selectedFiles.length,
            submittedAt: new Date().toISOString(),
            platform: navigator.platform,
            userAgent: navigator.userAgent
        };
        
        console.log('Pretotype Lead Conversion Captured:', eventData);
        
        // Save to localStorage so user can verify if they inspect
        const previousLeads = JSON.parse(localStorage.getItem('tooth_fairy_leads') || '[]');
        previousLeads.push(eventData);
        localStorage.setItem('tooth_fairy_leads', JSON.stringify(previousLeads));

        // 3. Generate Mock Ticket Number
        const ticketNum = 'TF-' + Math.floor(100000 + Math.random() * 900000);

        // 4. Populate and Show Modal
        modalClinic.innerText = clinicName;
        modalClient.innerText = clientName + ' 원장님/실장님';
        modalTicket.innerText = ticketNum;

        successModal.classList.add('active');

        // 5. Reset Form
        leadForm.reset();
        selectedFiles = [];
        renderFileList();
    });

    // Close Modal Handler
    closeModal.addEventListener('click', () => {
        successModal.classList.remove('active');
    });

    // Close Modal on clicking outside card
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });
});
