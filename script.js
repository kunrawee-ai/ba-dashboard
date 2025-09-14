// Update current time
function updateTime() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    const timeString = now.toLocaleDateString('th-TH', options);
    document.getElementById('update-time').textContent = timeString;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update time
    updateTime();
    setInterval(updateTime, 60000); // Update every minute
    
    // Animate progress bars on scroll
    animateProgressBars();
    
    // Add interactive features
    addInteractiveFeatures();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Add filter functionality
    addFilterFunctionality();
});

// Animate progress bars when they come into view
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.style.width;
                progressBar.style.width = '0';
                
                setTimeout(() => {
                    progressBar.style.width = targetWidth;
                }, 100);
                
                observer.unobserve(progressBar);
            }
        });
    }, {
        threshold: 0.1
    });
    
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Add interactive hover effects and click handlers
function addInteractiveFeatures() {
    // Add click to expand for job items
    const jobItems = document.querySelectorAll('.job-item');
    jobItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            // Toggle expanded class
            this.classList.toggle('expanded');
            
            // Show more details if needed
            const details = this.querySelector('.job-details');
            if (details) {
                if (this.classList.contains('expanded')) {
                    details.style.maxHeight = details.scrollHeight + 'px';
                } else {
                    details.style.maxHeight = null;
                }
            }
        });
    });
    
    // Add hover effect for cards
    const cards = document.querySelectorAll('.gap-card, .scope-card, .decision-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Priority table row highlighting
    const tableRows = document.querySelectorAll('.priority-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#edf2f7';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
}

// Initialize tooltips for additional information
function initializeTooltips() {
    // Add tooltips to priority badges
    const priorityBadges = document.querySelectorAll('.priority-badge');
    priorityBadges.forEach(badge => {
        badge.style.cursor = 'help';
        badge.title = getPriorityTooltip(badge.textContent);
    });
    
    // Add tooltips to job statuses
    const jobStatuses = document.querySelectorAll('.job-status');
    jobStatuses.forEach(status => {
        status.style.cursor = 'help';
        status.title = getStatusTooltip(status.textContent);
    });
}

// Get tooltip text for priority levels
function getPriorityTooltip(priority) {
    const tooltips = {
        'P1': 'Critical Priority - ต้องทำเสร็จภายใน Q3',
        'P2': 'High Priority - ควรเริ่มภายใน Q3-Q4',
        'P3': 'Medium Priority - สามารถรอถึง Q4 หรือปีหน้าได้'
    };
    return tooltips[priority] || 'Standard Priority';
}

// Get tooltip text for job statuses
function getStatusTooltip(status) {
    if (status.includes('โฟกัส')) {
        return 'กำลังทำงานอย่างเต็มที่ในช่วงนี้';
    } else if (status.includes('เสร็จ')) {
        return 'ดำเนินการเสร็จสิ้นแล้ว พร้อมใช้งาน';
    } else if (status.includes('Q3') || status.includes('Q4')) {
        return 'วางแผนจะเริ่มในไตรมาสที่ระบุ';
    } else if (status.includes('2025')) {
        return 'โครงการระยะยาว เริ่มปีหน้า';
    }
    return 'สถานะของโครงการ';
}

// Add filter functionality for different views
function addFilterFunctionality() {
    // Create filter buttons
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    filterContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        background: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;
    
    filterContainer.innerHTML = `
        <h4 style="margin: 0 0 10px 0; color: #2d3748;">ตัวกรอง</h4>
        <button class="filter-btn" data-filter="all">ทั้งหมด</button>
        <button class="filter-btn" data-filter="focus">โฟกัสปัจจุบัน</button>
        <button class="filter-btn" data-filter="completed">เสร็จแล้ว</button>
        <button class="filter-btn" data-filter="planned">วางแผน</button>
    `;
    
    document.body.appendChild(filterContainer);
    
    // Style filter buttons
    const filterButtons = filterContainer.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.style.cssText = `
            padding: 8px 16px;
            border: 1px solid #e2e8f0;
            background: white;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        btn.addEventListener('mouseenter', function() {
            this.style.background = '#667eea';
            this.style.color = 'white';
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.background = 'white';
                this.style.color = '#2d3748';
            }
        });
        
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.style.background = 'white';
                b.style.color = '#2d3748';
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            this.style.background = '#667eea';
            this.style.color = 'white';
            
            // Apply filter
            applyFilter(this.dataset.filter);
        });
    });
    
    // Set default filter
    filterButtons[0].click();
}

// Apply filter to job items
function applyFilter(filter) {
    const jobItems = document.querySelectorAll('.job-item');
    
    jobItems.forEach(item => {
        const status = item.querySelector('.job-status').textContent;
        let shouldShow = false;
        
        switch(filter) {
            case 'all':
                shouldShow = true;
                break;
            case 'focus':
                shouldShow = status.includes('โฟกัส');
                break;
            case 'completed':
                shouldShow = status.includes('เสร็จ');
                break;
            case 'planned':
                shouldShow = status.includes('Q4') || status.includes('2025') || status.includes('📅');
                break;
        }
        
        item.style.display = shouldShow ? 'block' : 'none';
    });
}

// Add smooth scrolling for navigation
function addSmoothScrolling() {
    // Create navigation menu
    const navMenu = document.createElement('nav');
    navMenu.className = 'nav-menu';
    navMenu.style.cssText = `
        position: fixed;
        top: 50%;
        left: 20px;
        transform: translateY(-50%);
        z-index: 999;
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    navMenu.innerHTML = `
        <ul style="list-style: none; padding: 0; margin: 0;">
            <li><a href="#objectives" class="nav-link">วัตถุประสงค์</a></li>
            <li><a href="#gaps" class="nav-link">Gap Analysis</a></li>
            <li><a href="#scopes" class="nav-link">Scope งาน</a></li>
            <li><a href="#priority" class="nav-link">Priority Matrix</a></li>
            <li><a href="#resources" class="nav-link">ทรัพยากร</a></li>
            <li><a href="#impact" class="nav-link">ผลกระทบ</a></li>
            <li><a href="#decisions" class="nav-link">การตัดสินใจ</a></li>
        </ul>
    `;
    
    document.body.appendChild(navMenu);
    
    // Add smooth scroll behavior
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.style.cssText = `
            display: block;
            padding: 8px 0;
            color: #4a5568;
            text-decoration: none;
            transition: color 0.3s ease;
        `;
        
        link.addEventListener('mouseenter', function() {
            this.style.color = '#667eea';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.color = '#4a5568';
        });
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Add section IDs for navigation
function addSectionIds() {
    const sections = {
        '.objectives-section': 'objectives',
        '.gap-analysis': 'gaps',
        '.scope-section': 'scopes',
        '.priority-matrix': 'priority',
        '.resource-section': 'resources',
        '.impact-section': 'impact',
        '.decisions-section': 'decisions'
    };
    
    Object.keys(sections).forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.id = sections[selector];
        }
    });
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', function() {
    addSectionIds();
    addSmoothScrolling();
});

// Export to PDF functionality (placeholder)
function exportToPDF() {
    alert('ฟังก์ชัน Export to PDF จะพร้อมใช้งานเร็วๆ นี้\nกรุณาใช้ Print to PDF จากเบราว์เซอร์ในระหว่างนี้');
}

// Add export button
document.addEventListener('DOMContentLoaded', function() {
    const exportBtn = document.createElement('button');
    exportBtn.textContent = '📄 Export PDF';
    exportBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 25px;
        font-size: 1em;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    exportBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.6)';
    });
    
    exportBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
    });
    
    exportBtn.addEventListener('click', exportToPDF);
    
    document.body.appendChild(exportBtn);
});

// Add print styles
function addPrintStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @media print {
            .filter-container,
            .nav-menu,
            button {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

addPrintStyles();