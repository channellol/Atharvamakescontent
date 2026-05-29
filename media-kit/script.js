document.addEventListener('DOMContentLoaded', () => {
  
  // Tab Navigation Logic
  const tabs = document.querySelectorAll('.tab');
  const pages = document.querySelectorAll('.page');
  const addressBar = document.getElementById('address-bar');

  // Page titles for address bar mapping
  const pageTitles = {
    'page-creator': 'Who is Atharva Bhutada?',
    'page-analytics': 'Atharva / Analytics & Content',
    'page-brands': 'Atharva / Partnerships & Collabs',
    'page-audience': 'Atharva / Audience Insights',
    'page-contact': 'mailto:atharvabhutada169@gmail.com'
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs and pages
      tabs.forEach(t => t.classList.remove('active'));
      pages.forEach(p => p.classList.add('hidden'));
      pages.forEach(p => p.classList.remove('active'));

      // Add active to clicked tab and target page
      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const targetPage = document.getElementById(targetId);
      targetPage.classList.remove('hidden');
      targetPage.classList.add('active');

      // Update Address Bar
      addressBar.value = pageTitles[targetId] || 'Atharva Workspace';
    });
  });

  // Search History Dropdown Toggle
  const searchDropdownBtn = document.getElementById('search-dropdown-btn');
  const searchHistory = document.getElementById('search-history');
  
  searchDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    searchHistory.classList.toggle('hidden');
  });

  // Hide dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchHistory.contains(e.target) && e.target !== searchDropdownBtn) {
      searchHistory.classList.add('hidden');
    }
  });

  // Easter Egg: ideas.txt Modal
  const ideasTrigger = document.getElementById('ideas-trigger');
  const ideasModal = document.getElementById('ideas-modal');
  const closeModalBtn = document.querySelector('.close-modal');

  ideasTrigger.addEventListener('click', () => {
    ideasModal.classList.remove('hidden');
  });

  closeModalBtn.addEventListener('click', () => {
    ideasModal.classList.add('hidden');
  });

  // Media Kit Link Logic
  const mediaKitTrigger = document.getElementById('media-kit-trigger');
  if (mediaKitTrigger) {
    mediaKitTrigger.addEventListener('click', () => {
      window.open('https://drive.google.com/file/d/1FmDAKEw1vJO_vkd7cucYZg5CC7WPMqGi/view?usp=sharing', '_blank');
    });
  }

  // Close modal when clicking outside of the window
  ideasModal.addEventListener('click', (e) => {
    if (e.target === ideasModal) {
      ideasModal.classList.add('hidden');
    }
  });

  // Interactive dragging with CSS variables
  let zIndexCounter = 100;

  const makeDraggable = (el, handleSelector) => {
    let isDragging = false;
    let startX, startY;
    let currentX = 0, currentY = 0;
    
    // Read existing translation if any
    const style = window.getComputedStyle(el);
    const dragXStr = style.getPropertyValue('--drag-x');
    const dragYStr = style.getPropertyValue('--drag-y');
    if (dragXStr) currentX = parseFloat(dragXStr) || 0;
    if (dragYStr) currentY = parseFloat(dragYStr) || 0;
    
    const handle = handleSelector ? el.querySelector(handleSelector) : el;
    if (!handle) return;
    
    handle.style.cursor = 'grab';

    const startDrag = (clientX, clientY, target) => {
      if (target.tagName === 'BUTTON' || target.classList.contains('win-btn') || target.classList.contains('close-modal') || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return false;
      
      isDragging = true;
      handle.style.cursor = 'grabbing';
      
      zIndexCounter++;
      el.style.zIndex = zIndexCounter;
      el.style.position = 'relative'; // ensure z-index works
      
      startX = clientX - currentX;
      startY = clientY - currentY;
      
      if (el.classList.contains('sticky-note')) {
        el.style.setProperty('--scale', '1.05');
        el.style.setProperty('--rot', '0deg');
      }
      
      el.style.transition = 'none'; // remove transition for smooth drag
      return true;
    };

    const moveDrag = (clientX, clientY) => {
      if (!isDragging) return;
      
      currentX = clientX - startX;
      currentY = clientY - startY;
      
      el.style.setProperty('--drag-x', `${currentX}px`);
      el.style.setProperty('--drag-y', `${currentY}px`);
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      handle.style.cursor = 'grab';
      
      el.style.transition = ''; // restore CSS transition
      
      if (el.classList.contains('sticky-note')) {
        el.style.setProperty('--scale', '1');
        const randomRot = Math.random() * 6 - 3;
        el.style.setProperty('--rot', `${randomRot}deg`);
      }
    };

    // Mouse Event Listeners
    handle.addEventListener('mousedown', (e) => {
      startDrag(e.clientX, e.clientY, e.target);
    });

    document.addEventListener('mousemove', (e) => {
      moveDrag(e.clientX, e.clientY);
    });

    document.addEventListener('mouseup', endDrag);

    // Touch Event Listeners for Mobile Devices
    handle.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (startDrag(touch.clientX, touch.clientY, e.target)) {
          // Prevent default touch gestures (e.g. scrolling/refreshing) only during drag initiation
          e.preventDefault();
        }
      }
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        moveDrag(touch.clientX, touch.clientY);
        // Prevent scroll gestures while actively dragging
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('touchend', endDrag);
    document.addEventListener('touchcancel', endDrag);
  };

  document.querySelectorAll('.window-card').forEach(card => {
    if (!card.closest('.modal')) {
      makeDraggable(card, '.window-header');
    }
  });
  
  document.querySelectorAll('.sticky-note').forEach(note => {
    makeDraggable(note, null);
  });

  // Send Email logic
  const sendEmailBtn = document.getElementById('send-email-btn');
  if (sendEmailBtn) {
    sendEmailBtn.addEventListener('click', () => {
      const subject = document.getElementById('email-subject').value;
      const body = document.getElementById('email-body').value;
      
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=atharvabhutada169@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, '_blank');
    });
  }

  // Send WhatsApp logic
  const sendWaBtn = document.getElementById('send-wa-btn');
  if (sendWaBtn) {
    sendWaBtn.addEventListener('click', () => {
      const subject = document.getElementById('email-subject').value;
      const body = document.getElementById('email-body').value;
      
      const text = `Subject: ${subject}\n\n${body}`;
      const waUrl = `https://wa.me/917075969025?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    });
  }

});
