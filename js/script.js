/**
 * NICKO JOHN JOVEN — EXECUTIVE DIGITAL PORTFOLIO
 * Interaction Design & Motion Architecture
 * Fully grounded in factual resume details.
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initCustomCursor();
  initMagneticElements();
  initScrollProgress();
  initHeaderScrollState();
  initMobileNavigation();
  initSkillsFilter();
  initExperienceModal();
  initContactActions();
  initHeroTypewriter();
  initMacOSDock();
  initScrollAnimations();
  initScrollBackgroundCanvas();
  initCelestialSky();
});

/* --------------------------------------------------------------------------
   1. Live Real-Time Operator HUD Clock (Camarines Sur, Philippines / UTC+8)
   -------------------------------------------------------------------------- */
function initLiveClock() {
  const clockElement = document.getElementById('live-pht-clock');
  const tzStatusElement = document.getElementById('pht-status-badge');

  function updateClock() {
    // Current UTC date
    const now = new Date();
    // UTC+8 offset (Philippines Time)
    const phtOptions = {
      timeZone: 'Asia/Manila',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    
    try {
      const timeFormatter = new Intl.DateTimeFormat([], phtOptions);
      if (clockElement) {
        clockElement.textContent = timeFormatter.format(now) + ' PHT';
      }

      // Check working hours (standard business + night overlap for US clients)
      const manilaHours = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" })).getHours();
      if (tzStatusElement) {
        if (manilaHours >= 8 && manilaHours < 18) {
          tzStatusElement.textContent = 'Active (Standard Day Shift)';
        } else if (manilaHours >= 18 || manilaHours < 6) {
          tzStatusElement.textContent = 'Active (US Night Shift / Remote Overlap)';
        } else {
          tzStatusElement.textContent = 'Standby / Rapid Response';
        }
      }
    } catch (e) {
      if (clockElement) clockElement.textContent = '14:56:00 PHT';
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   2. Custom Fluid Magnetic Cursor & Hover States
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  // Check for touch / coarse pointer
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursorDot = document.querySelector('.custom-cursor');
  const cursorFollower = document.querySelector('.custom-cursor-follower');
  if (!cursorDot || !cursorFollower) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  // Smooth lerp follow loop
  function renderCursor() {
    followerX += (mouseX - followerX) * 0.16;
    followerY += (mouseY - followerY) * 0.16;

    cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover detection for interactive targets
  const interactiveTargets = document.querySelectorAll('a, button, .interactive-card, .filter-btn, .exp-expand-btn');
  interactiveTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      const cursorText = el.getAttribute('data-cursor-text');
      if (cursorText) {
        cursorFollower.textContent = cursorText;
        cursorFollower.classList.add('hovering');
      } else {
        cursorFollower.textContent = '';
        cursorFollower.classList.add('hovering-link');
      }
    });

    el.addEventListener('mouseleave', () => {
      cursorFollower.textContent = '';
      cursorFollower.classList.remove('hovering', 'hovering-link');
    });
  });

  // Hide on mouseleave window
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorFollower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorFollower.style.opacity = '1';
  });
}

/* --------------------------------------------------------------------------
   3. Magnetic Button Physics
   -------------------------------------------------------------------------- */
function initMagneticElements() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const magneticItems = document.querySelectorAll('.magnetic-target');

  magneticItems.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Controlled subtle pull (max 10px)
      const pullX = x * 0.25;
      const pullY = y * 0.25;

      btn.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
      
      const icon = btn.querySelector('.btn-icon-wrapper');
      if (icon) {
        icon.style.transform = `translate3d(${pullX * 0.4}px, ${pullY * 0.4}px, 0)`;
      }
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate3d(0, 0, 0)';
      const icon = btn.querySelector('.btn-icon-wrapper');
      if (icon) {
        icon.style.transform = 'translate3d(0, 0, 0)';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Scroll Progress Indicator & Header State
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

function initHeaderScrollState() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   5. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.nav-mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function toggleMenu() {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      drawer.classList.add('open');
      toggleBtn.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  toggleBtn.addEventListener('click', toggleMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* --------------------------------------------------------------------------
   6. Skills Matrix Filter
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-matrix-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. Factual Experience Deep-Dive Modal
   Exact factual details from Nicko's resume
   -------------------------------------------------------------------------- */
const resumeExperienceData = {
  jkent: {
    title: 'Sales Associate / Store Support',
    company: 'JKent Motorcycle Parts and Accessories',
    location: 'Naga City, Camarines Sur',
    period: 'Oct 16, 2025 – Jul 09, 2026',
    category: 'E-Commerce, Digital Content & IT Support',
    responsibilities: [
      'List, update, and maintain product listings (descriptions, pricing, variations, stock levels)',
      'Monitor and respond to customer inquiries, orders, and reviews on marketplace platforms',
      'Track order fulfillment status and coordinate with couriers for timely dispatch',
      'Set up and manage store promotions, vouchers, and flash deals to optimize turnover',
      'Monitor competitor pricing and marketplace trends to recommend positioning strategies',
      'Ensure strict store compliance with marketplace platform policies and guidelines',
      'Edit and enhance product photos using AI and Adobe Photoshop for listings and social media',
      'Design promotional graphics, banners, and digital marketing materials',
      'Edit promotional videos using AI and CapCut for product features, video ads, and social content',
      'Track sales performance and social media metrics (engagement, reach, conversion rates)',
      'Prepare comprehensive reports on marketplace sales, best-selling products, and content reach',
      'Perform basic network configuration and troubleshooting (routers, Wi-Fi connectivity)',
      'Maintain, troubleshoot, and repair office printers and provide baseline IT equipment support'
    ],
    tools: ['Adobe Photoshop', 'CapCut', 'AI Creative Tools', 'Canva', 'Marketplace Dashboards', 'Wi-Fi/Network Diagnostic Tools', 'MS Excel']
  },
  rhu: {
    title: 'Administrative Support Staff',
    company: 'Rural Health Unit I',
    location: 'Libmanan, Camarines Sur',
    period: 'Jun 23, 2025 – Oct 10, 2025',
    category: 'Public Health Administration & Data Analytics',
    responsibilities: [
      'Encode and update patient records accurately into digital systems ensuring zero discrepancy',
      'Organize and maintain a structured database of patient demographic and clinical records',
      'Enforce absolute data accuracy, completeness, and confidentiality of sensitive patient files',
      'Regularly update records to reflect new visits, treatment programs, and status changes',
      'Maintain reliable backup schedules and data security protocols for all patient repositories',
      'Build and maintain complex patient databases using advanced Spreadsheets',
      'Sort, filter, and categorize health data using advanced Excel formulas (VLOOKUP, IF statements, COUNTIF, SUMIF)',
      'Organize data by categorical dimensions (demographics, case type, visit frequency, health programs)',
      'Clean and validate dataset records to eliminate duplicates, formatting errors, or inconsistencies',
      'Generate statistical charts and graphs to visually present patient statistics and health trends to municipal health officers',
      'Prepare clear, presentation-ready formats for supervisory reviews and regional health audits',
      'Design informational leaflets, flyers, and public posters for disease prevention and public health campaigns',
      'Edit and produce educational health videos for community awareness campaigns and internal reviews'
    ],
    tools: ['Advanced MS Excel (VLOOKUP, Nested IF, SUMIF)', 'Spreadsheet Databases', 'Canva', 'Video Production Tools', 'Data Cleansing Utilities']
  },
  concentrix: {
    title: 'Advisor I (US Healthcare Provider Support)',
    company: 'Concentrix',
    location: 'Naga City, Camarines Sur',
    period: 'Jun 08, 2020 – Dec 31, 2023 (3.5+ Years)',
    category: 'US Healthcare BPO Operations & Claims Investigation',
    responsibilities: [
      'Handled inbound inquiries from US healthcare providers (physicians, clinics, hospitals, billing staff)',
      'Assisted providers with claims adjudication status, electronic submission errors, and reimbursement issues',
      'Verified network participation status; advised out-of-network providers on securing gap exceptions via predetermination',
      'Deconstructed complex claim denials, rejections, and adjustments; guided providers on next-step resolutions',
      'Guided providers step-by-step through formal claims appeals and reconsideration filings',
      'Assisted with submission and validation of corrected claims (Form CMS-1500 / UB-04 workflows)',
      'Researched and audited claim discrepancies including underpayments, duplicate billing, and CPT/ICD-10 coding errors',
      'Resolved billing and payment disputes between healthcare providers and payer plans with tact and clarity',
      'Escalated complex claims, contractual ambiguities, or credentialing bottlenecks to specialized review units',
      'Maintained consistent compliance with healthcare regulations, payer policy updates, and open enrollment guidelines',
      'Consistently met and exceeded key performance metrics: Average Handling Time (AHT), First-Call Resolution (FCR), and QA score targets'
    ],
    tools: ['Payer Claims Management Systems', 'CPT / ICD-10 Coding Reference', 'HIPAA Compliance Guidelines', 'CRM Telephony', 'MS Office']
  },
  sutherland: {
    title: 'Customer Service Associate',
    company: 'Sutherland Global Services',
    location: 'Pili, Camarines Sur',
    period: 'Jan 2020 – Feb 2020',
    category: 'E-Commerce Logistics & Customer Experience',
    responsibilities: [
      'Modified, rescheduled, or cancelled customer orders per requests with rapid turnaround',
      'Tracked live order delivery statuses and delivered real-time updates to customers',
      'Coordinated directly with local florists and delivery partners to ensure fulfillment accuracy',
      'Managed high-priority same-day and rush delivery logistics under tight operational windows',
      'Addressed customer complaints regarding delayed, damaged, incorrect, or undelivered shipments',
      'Processed refunds, redeliveries, and replacement arrangements in strict accordance with company policy',
      'De-escalated frustrated or emotionally charged customers with empathy, patience, and clear solutions',
      'Documented customer interactions, complaints, and escalations for QA tracking and process improvement'
    ],
    tools: ['Order Tracking CRM', 'Partner Logistics Portals', 'Email & Chat Support Systems']
  },
  allsource: {
    title: 'Stock Clerk / Inventory Controller',
    company: 'All Source Manpower & Consultancy Services Inc. (Deployed in PTDI)',
    location: 'Naga City, Camarines Sur',
    period: 'Apr 2018 – Jul 2019',
    category: 'Inventory Logistics & Warehouse Operations',
    responsibilities: [
      'Maintained accurate stock logs, inventory ledgers, and systematic movement tracking reports',
      'Documented and verified incoming and outgoing material shipments with high counting accuracy',
      'Assisted supervisory teams in compiling detailed reports for periodic inventory audits',
      'Safely operated warehouse equipment including hand trucks, pallet jacks, and material handlers',
      'Maintained rigorous adherence to warehouse safety protocols during lifting, handling, and stacking'
    ],
    tools: ['Inventory Logbooks', 'Spreadsheets', 'Warehouse Material Handling Equipment']
  },
  flyandbunk: {
    title: 'Administrative & Coordination Staff',
    company: 'FLY & BUNK Travel and Tours',
    location: 'Libmanan, Camarines Sur',
    period: 'Nov 2015 – Jun 2016',
    category: 'Travel Logistics & Administrative Ticketing',
    responsibilities: [
      'Assisted passengers with comprehensive route schedules, travel durations, and destination information',
      'Managed passenger inquiries regarding fare breakdowns, seat availability, and advance schedules',
      'Provided dedicated assistance to passengers with special needs (elderly, PWDs, passengers with oversized luggage)',
      'Sold passenger bus tickets across varied routes, calculating exact fares with statutory discount concessions (senior citizens, students, PWDs)',
      'Managed advance seat reservations, handled ticket cancellations, rebookings, and authorized refunds',
      'Tracked and audited seat availability metrics per trip and scheduled bus run'
    ],
    tools: ['Ticketing System', 'Reservation Logs', 'Cash & Receipt Reconciliation Ledgers']
  },
  comelec: {
    title: 'PCOS Technical Support Specialist',
    company: 'COMELEC (Commission on Elections)',
    location: 'Libmanan, Camarines Sur',
    period: 'May 2013',
    category: 'Mission-Critical Election Tech & Hardware Systems',
    responsibilities: [
      'Set up, tested, and calibrated automated Precinct Count Optical Scan (PCOS) machines prior to election day',
      'Delivered immediate on-site technical diagnostics and troubleshooting during active voting hours',
      'Resolved urgent hardware and software faults including paper jams, optical scanning calibration errors, and power/connectivity issues',
      'Trained and assisted the Board of Election Inspectors (BEI) on machine protocols and system operation',
      'Supervised official digital results transmission and the printing of election return certificates',
      'Executed secure machine shutdown, retrieval, and chain-of-custody turnover under strict statutory protocols'
    ],
    tools: ['PCOS Optical Scan Hardware', 'Diagnostic Testing Protocols', 'Secure Data Transmission Equipment']
  }
};

function initExperienceModal() {
  const modalOverlay = document.getElementById('experience-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const triggerBtns = document.querySelectorAll('.exp-expand-btn');

  if (!modalOverlay) return;

  function openModal(roleKey) {
    const data = resumeExperienceData[roleKey];
    if (!data) return;

    document.getElementById('modal-role-title').textContent = data.title;
    document.getElementById('modal-company-name').textContent = data.company;
    document.getElementById('modal-period-badge').textContent = data.period;
    document.getElementById('modal-location-text').textContent = data.location;
    document.getElementById('modal-category-text').textContent = data.category;

    const responsibilitiesList = document.getElementById('modal-responsibilities-list');
    responsibilitiesList.innerHTML = '';
    data.responsibilities.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'exp-highlight-item';
      li.textContent = item;
      responsibilitiesList.appendChild(li);
    });

    const toolsContainer = document.getElementById('modal-tools-chips');
    toolsContainer.innerHTML = '';
    data.tools.forEach((tool) => {
      const span = document.createElement('span');
      span.className = 'exp-chip';
      span.textContent = tool;
      toolsContainer.appendChild(span);
    });

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  triggerBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const roleKey = btn.getAttribute('data-role');
      openModal(roleKey);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   8. Contact Channel Actions & Interactive Utilities
   -------------------------------------------------------------------------- */
function initContactActions() {
  const copyButtons = document.querySelectorAll('.copy-trigger');
  const toast = document.getElementById('toast-notice');
  const toastMessage = document.getElementById('toast-message');

  function showToast(msg) {
    if (!toast) return;
    toastMessage.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy-val');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          showToast(`Direct value: ${textToCopy}`);
        });
      }
    });
  });

  // Dynamic vCard Generator & Downloader
  const vcardBtn = document.getElementById('download-vcard-btn');
  if (vcardBtn) {
    vcardBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const vCardData = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'FN:Nicko John Joven',
        'N:Joven;Nicko;John;;',
        'TITLE:Executive Virtual Assistant & Healthcare Support Specialist',
        'TEL;TYPE=CELL,VOICE:+639568494724',
        'EMAIL;TYPE=INTERNET,PREF:nickojohnjoven@gmail.com',
        'ADR;TYPE=WORK:;;Libmanan;Camarines Sur;;;Philippines',
        'NOTE:Virtual Assistant, US Healthcare Claims Specialist, Advanced Data & E-Commerce Coordinator. 7+ Years Experience.',
        'END:VCARD'
      ].join('\r\n');

      const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.setAttribute('download', 'Nicko_John_Joven_Contact.vcf');
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(url);
      showToast('Contact card (vCard) downloaded!');
    });
  }

  // Quick Dispatch Email Form - Direct Transmission Engine
  const dispatchForm = document.getElementById('quick-dispatch-form');
  if (dispatchForm) {
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const dateInput = document.getElementById('form-date');
    const messageInput = document.getElementById('form-message');
    const statusBanner = document.getElementById('dispatch-status-banner');
    const submitBtn = document.getElementById('dispatch-submit-btn');
    const btnText = document.getElementById('dispatch-btn-text');
    const btnIcon = document.getElementById('dispatch-btn-icon');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    const escapeHtml = (str) => {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, (s) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[s]));
    };

    const validateField = (input, errorId, condition) => {
      const errorEl = document.getElementById(errorId);
      if (!condition) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        if (errorEl) errorEl.classList.add('visible');
        return false;
      } else {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        if (errorEl) errorEl.classList.remove('visible');
        return true;
      }
    };

    // Live validation listeners
    if (nameInput) {
      nameInput.addEventListener('input', () => validateField(nameInput, 'name-error', nameInput.value.trim().length >= 2));
      nameInput.addEventListener('blur', () => validateField(nameInput, 'name-error', nameInput.value.trim().length >= 2));
    }
    if (emailInput) {
      emailInput.addEventListener('input', () => validateField(emailInput, 'email-error', emailRegex.test(emailInput.value.trim())));
      emailInput.addEventListener('blur', () => validateField(emailInput, 'email-error', emailRegex.test(emailInput.value.trim())));
    }
    if (subjectInput) {
      subjectInput.addEventListener('input', () => validateField(subjectInput, 'subject-error', subjectInput.value.trim().length >= 2));
      subjectInput.addEventListener('blur', () => validateField(subjectInput, 'subject-error', subjectInput.value.trim().length >= 2));
    }
    if (messageInput) {
      messageInput.addEventListener('input', () => validateField(messageInput, 'message-error', messageInput.value.trim().length >= 5));
      messageInput.addEventListener('blur', () => validateField(messageInput, 'message-error', messageInput.value.trim().length >= 5));
    }

    dispatchForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const senderName = nameInput ? nameInput.value.trim() : '';
      const senderEmail = emailInput ? emailInput.value.trim() : '';
      const projectType = subjectInput ? subjectInput.value.trim() : '';
      const preferredDate = dateInput ? dateInput.value.trim() : '';
      const messageBody = messageInput ? messageInput.value.trim() : '';

      // Validate all required fields
      const isNameValid = validateField(nameInput, 'name-error', senderName.length >= 2);
      const isEmailValid = validateField(emailInput, 'email-error', emailRegex.test(senderEmail));
      const isSubjectValid = validateField(subjectInput, 'subject-error', projectType.length >= 2);
      const isMessageValid = validateField(messageInput, 'message-error', messageBody.length >= 5);

      if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        if (!isNameValid && nameInput) nameInput.focus();
        else if (!isEmailValid && emailInput) emailInput.focus();
        else if (!isSubjectValid && subjectInput) subjectInput.focus();
        else if (!isMessageValid && messageInput) messageInput.focus();
        return;
      }

      // Format date presentation
      let formattedTimeline = 'Immediate / Flexible';
      if (preferredDate) {
        try {
          const d = new Date(preferredDate);
          formattedTimeline = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch {
          formattedTimeline = preferredDate;
        }
      }

      // Enter Sending State
      const originalBtnText = btnText ? btnText.textContent : 'Dispatch Email to Nicko John';
      const originalBtnIcon = btnIcon ? btnIcon.innerHTML : '';
      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Transmitting to Nicko...';
      if (btnIcon) btnIcon.innerHTML = '<span class="spinner"></span>';

      if (statusBanner) {
        statusBanner.className = 'dispatch-status-banner sending';
        statusBanner.style.display = 'flex';
        statusBanner.innerHTML = `
          <span class="spinner" style="margin-top: 3px;"></span>
          <div>
            <strong>Transmitting Encrypted Dispatch...</strong><br>
            Routing directly to Nicko John Joven's inbox (<code style="font-family: var(--font-mono); color: var(--accent-cyan);">nickojohnjoven@gmail.com</code>)...
          </div>
        `;
      }

      const emailSubject = `[Portfolio Inquiry] ${projectType}${preferredDate ? ` (Timeline: ${formattedTimeline})` : ''} - from ${senderName}`;
      const payload = {
        name: senderName,
        email: senderEmail,
        _replyto: senderEmail,
        engagement_type: projectType,
        preferred_start_date: formattedTimeline,
        message: messageBody,
        _subject: emailSubject,
        _template: 'table',
        _captcha: 'false'
      };

      try {
        const response = await fetch('https://formsubmit.co/ajax/nickojohnjoven@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok) {
          if (statusBanner) {
            statusBanner.className = 'dispatch-status-banner success';
            statusBanner.style.display = 'flex';
            statusBanner.innerHTML = `
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" stroke-width="2.2" style="flex-shrink:0; margin-top:2px;">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <div>
                <strong>Transmission Successfully Dispatched!</strong><br>
                Thank you, <strong style="color:#ffffff;">${escapeHtml(senderName)}</strong>! Your inquiry and timeline requirements (<strong>${escapeHtml(formattedTimeline)}</strong>) have been delivered to Nicko John's primary inbox at <a href="mailto:nickojohnjoven@gmail.com">nickojohnjoven@gmail.com</a>. A direct reply will be sent to <strong style="color:var(--accent-cyan);">${escapeHtml(senderEmail)}</strong> promptly.
              </div>
            `;
          }

          dispatchForm.reset();
          [nameInput, emailInput, subjectInput, dateInput, messageInput].forEach((el) => {
            if (el) {
              el.classList.remove('is-valid');
              el.classList.remove('is-invalid');
            }
          });
          showToast('Direct transmission dispatched to Nicko John!');
        } else {
          throw new Error(data.message || 'Dispatch gateway responded with an error');
        }
      } catch (err) {
        console.warn('Dispatch network notice:', err);
        const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${projectType} - from ${senderName}`);
        const mailtoBody = encodeURIComponent(
          `Hello Nicko,\n\n${messageBody}\n\n---\nSender: ${senderName}\nEmail: ${senderEmail}\nPreferred Timeline: ${formattedTimeline}\nSent via Portfolio Contact Terminal`
        );

        if (statusBanner) {
          statusBanner.className = 'dispatch-status-banner error';
          statusBanner.style.display = 'flex';
          statusBanner.innerHTML = `
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.2" style="flex-shrink:0; margin-top:2px;">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <strong>Direct Gateway Notification:</strong><br>
              If a browser extension or network filter intercepted the transmission, you can <a href="mailto:nickojohnjoven@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}">click here to open in your mail client</a> or email directly at <strong style="color:#ffffff;">nickojohnjoven@gmail.com</strong> (or call <strong>0956-849-4724</strong>).
            </div>
          `;
        }
        showToast('Direct dispatch fallback active');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.textContent = originalBtnText;
        if (btnIcon) btnIcon.innerHTML = originalBtnIcon;
      }
    });
  }

  // Back to top button
  const backToTopBtn = document.querySelector('.back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   8b. Hero Name Looping Typewriter Effect ("Hi! I'm Nick!")
   -------------------------------------------------------------------------- */
function initHeroTypewriter() {
  const container = document.getElementById('typewriter-text');
  if (!container) return;

  // Accessibility: respect reduced motion preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    container.innerHTML = '<span class="typewriter-lead">Hi! I\'m </span><span class="hero-name-yellow">Nick!</span>';
    return;
  }

  const phrase = "Hi! I'm Nick!";
  const prefixLength = 8; // "Hi! I'm " is 8 chars, "Nick!" is 5 chars

  let charIndex = 0;
  let isDeleting = false;
  let timeoutId = null;

  function render(count) {
    if (count <= 0) {
      container.innerHTML = '';
      return;
    }
    if (count <= prefixLength) {
      const lead = phrase.slice(0, count);
      container.innerHTML = `<span class="typewriter-lead">${lead}</span>`;
    } else {
      const lead = phrase.slice(0, prefixLength);
      const name = phrase.slice(prefixLength, count);
      container.innerHTML = `<span class="typewriter-lead">${lead}</span><span class="hero-name-yellow">${name}</span>`;
    }
  }

  function tick() {
    if (document.hidden) {
      timeoutId = setTimeout(tick, 300);
      return;
    }

    if (!isDeleting) {
      charIndex++;
      render(charIndex);

      if (charIndex === phrase.length) {
        // Full phrase typed: hold on screen for readability
        isDeleting = true;
        timeoutId = setTimeout(tick, 2400);
        return;
      }

      // Natural typing cadence: 85ms-120ms with slight pauses on punctuation
      let delay = 90 + Math.floor(Math.random() * 35);
      const char = phrase[charIndex - 1];
      if (char === '!') delay += 140;
      if (char === "'") delay += 70;
      if (char === ' ') delay += 40;

      timeoutId = setTimeout(tick, delay);
    } else {
      charIndex--;
      render(charIndex);

      if (charIndex === 0) {
        // Complete erase: short pause before starting next typing loop
        isDeleting = false;
        timeoutId = setTimeout(tick, 600);
        return;
      }

      // Fast, rhythmic backspace deletion
      timeoutId = setTimeout(tick, 45);
    }
  }

  // Clear static placeholder and begin typing right as hero entrance completes
  container.innerHTML = '';
  timeoutId = setTimeout(tick, 650);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !timeoutId) {
      timeoutId = setTimeout(tick, 100);
    }
  });
}

/* --------------------------------------------------------------------------
   8c. macOS-Inspired Application Dock with Fluid Spring Magnification
   -------------------------------------------------------------------------- */
function initMacOSDock() {
  const dock = document.getElementById('macos-dock');
  if (!dock) return;

  const dockItems = Array.from(dock.querySelectorAll('.dock-item'));
  if (dockItems.length === 0) return;

  // Elements for detail HUD inspection
  const hudCategory = document.getElementById('telemetry-cat');
  const hudName = document.getElementById('telemetry-name');
  const hudDesc = document.getElementById('telemetry-desc');
  const hudMeta = document.getElementById('telemetry-meta');
  const filterBtns = document.querySelectorAll('.dock-filter-btn');

  // Magnification & Spring Physics constants
  const BASE_SCALE = 1.0;
  const MAX_SCALE = 1.78;
  const MAX_LIFT = 16;
  const INFLUENCE_RADIUS = 165;
  const SPRING_SPEED = 0.22;

  // Store individual state for each icon
  const itemsState = dockItems.map((item) => {
    const wrapper = item.querySelector('.dock-icon-wrapper');
    return {
      element: item,
      wrapper: wrapper,
      currentScale: BASE_SCALE,
      targetScale: BASE_SCALE,
      currentLift: 0,
      targetLift: 0,
      currentPad: 2,
      targetPad: 2
    };
  });

  let isHovered = false;
  let animFrameId = null;

  function updatePhysics() {
    let hasMotion = false;

    itemsState.forEach((state) => {
      // Spring interpolation (lerp)
      const dScale = state.targetScale - state.currentScale;
      const dLift = state.targetLift - state.currentLift;
      const dPad = state.targetPad - state.currentPad;

      if (Math.abs(dScale) > 0.001 || Math.abs(dLift) > 0.05 || Math.abs(dPad) > 0.05) {
        state.currentScale += dScale * SPRING_SPEED;
        state.currentLift += dLift * SPRING_SPEED;
        state.currentPad += dPad * SPRING_SPEED;
        hasMotion = true;
      } else {
        state.currentScale = state.targetScale;
        state.currentLift = state.targetLift;
        state.currentPad = state.targetPad;
      }

      // Apply transformation to squircle wrapper and dynamic padding to item
      state.wrapper.style.transform = `translateY(${state.currentLift.toFixed(2)}px) scale(${state.currentScale.toFixed(3)})`;
      state.element.style.paddingLeft = `${state.currentPad.toFixed(1)}px`;
      state.element.style.paddingRight = `${state.currentPad.toFixed(1)}px`;
      state.element.style.zIndex = Math.round(state.currentScale * 12);
    });

    if (hasMotion || isHovered) {
      animFrameId = requestAnimationFrame(updatePhysics);
    } else {
      animFrameId = null;
    }
  }

  function startAnimation() {
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(updatePhysics);
    }
  }

  function handlePointerMove(clientX) {
    isHovered = true;

    itemsState.forEach((state) => {
      const rect = state.element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const dist = Math.abs(clientX - centerX);

      if (dist < INFLUENCE_RADIUS) {
        // Gaussian / Cosine bell curve
        const factor = (1 + Math.cos((dist / INFLUENCE_RADIUS) * Math.PI)) / 2;
        state.targetScale = BASE_SCALE + (MAX_SCALE - BASE_SCALE) * factor;
        state.targetLift = -MAX_LIFT * factor;
        state.targetPad = 2 + (factor * 7.5);

        if (factor > 0.08) {
          state.element.classList.add('is-magnified');
        } else {
          state.element.classList.remove('is-magnified');
        }

        if (factor > 0.82) {
          state.element.classList.add('show-tooltip');
        } else {
          state.element.classList.remove('show-tooltip');
        }
      } else {
        state.targetScale = BASE_SCALE;
        state.targetLift = 0;
        state.targetPad = 2;
        state.element.classList.remove('is-magnified');
        state.element.classList.remove('show-tooltip');
      }
    });

    startAnimation();
  }

  function resetDock() {
    isHovered = false;
    itemsState.forEach((state) => {
      state.targetScale = BASE_SCALE;
      state.targetLift = 0;
      state.targetPad = 2;
      state.element.classList.remove('is-magnified');
      state.element.classList.remove('show-tooltip');
    });
    startAnimation();
  }

  // Mouse event listeners
  dock.addEventListener('mousemove', (e) => {
    handlePointerMove(e.clientX);
  });

  dock.addEventListener('mouseleave', () => {
    resetDock();
  });

  // Touch event support for mobile & tablet screens
  dock.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX);
    }
  }, { passive: true });

  dock.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX);
    }
  }, { passive: true });

  dock.addEventListener('touchend', () => {
    setTimeout(resetDock, 500);
  });

  // App Selection & Telemetry Update
  function selectApp(item) {
    dockItems.forEach((el) => el.classList.remove('active-app'));
    item.classList.add('active-app');

    // Trigger tactile bounce
    item.classList.remove('bouncing');
    void item.offsetWidth; // trigger reflow
    item.classList.add('bouncing');
    setTimeout(() => item.classList.remove('bouncing'), 650);

    // Update Telemetry HUD
    const name = item.dataset.name;
    const catLabel = item.dataset.catLabel;
    const desc = item.dataset.desc;
    const tags = item.dataset.tags ? item.dataset.tags.split(',') : [];
    const accent = item.dataset.accent || '#38BDF8';

    if (hudName) hudName.textContent = name;
    if (hudCategory) {
      hudCategory.textContent = catLabel;
      hudCategory.style.borderColor = accent;
      hudCategory.style.color = accent;
      hudCategory.style.background = `${accent}1A`;
    }
    if (hudDesc) hudDesc.textContent = desc;
    if (hudMeta) {
      hudMeta.innerHTML = tags
        .map((tag) => `<span class="telemetry-meta-tag" style="border-color:${accent}33">${tag.trim()}</span>`)
        .join('');
    }
  }

  dockItems.forEach((item) => {
    item.addEventListener('click', () => selectApp(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectApp(item);
      }
    });
  });

  // Category Filter Pill Actions
  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        dockItems.forEach((item) => {
          const itemCat = item.dataset.category;
          if (filter === 'all' || itemCat === filter) {
            item.classList.remove('dimmed');
          } else {
            item.classList.add('dimmed');
          }
        });

        // Select the first visible item in the filtered set
        const firstVisible = dockItems.find((it) => !it.classList.contains('dimmed'));
        if (firstVisible) {
          selectApp(firstVisible);
        }
      });
    });
  }

  // Pre-select first app (Canva) on initial load
  if (dockItems.length > 0) {
    selectApp(dockItems[0]);
  }
}

/* --------------------------------------------------------------------------
   9. GSAP & ScrollTrigger Animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  // If user prefers reduced motion, skip heavy animations
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Graceful fallback: reveal all elements cleanly
    document.querySelectorAll('.gsap-fade-in').forEach(el => el.style.opacity = '1');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hero Section Staggered Entrance
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
  heroTl
    .from('.hero-meta-bar', { y: 20, opacity: 0, delay: 0.2 })
    .from('.hero-name', { y: 35, opacity: 0, duration: 1 }, '-=0.6')
    .from('.hero-headline', { y: 25, opacity: 0 }, '-=0.6')
    .from('.hero-summary', { y: 20, opacity: 0 }, '-=0.5')
    .from('.hero-actions', { y: 20, opacity: 0 }, '-=0.5')
    .from('.hero-hud-card', { x: 30, opacity: 0, duration: 1 }, '-=0.8')
    .from('.scroll-hint', { opacity: 0, duration: 0.6 }, '-=0.4');

  // Generic Section Header Animations
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach((header) => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 35,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // Pillars Grid Stagger
  const pillarCards = document.querySelectorAll('.pillar-card');
  if (pillarCards.length > 0) {
    gsap.from(pillarCards, {
      scrollTrigger: {
        trigger: '.pillars-grid',
        start: 'top 80%',
      },
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out'
    });
  }

  // Desktop Pinned Horizontal Experience Showcase
  const horizontalSection = document.querySelector('.experience-pinned-wrapper');
  const horizontalContainer = document.querySelector('.horizontal-scroll-container');

  if (horizontalSection && horizontalContainer && window.innerWidth >= 992) {
    const getTravelDistance = () => {
      // Calculate exact distance required so last card sits in view without extra empty space
      return Math.max(0, horizontalContainer.scrollWidth - window.innerWidth);
    };

    gsap.to(horizontalContainer, {
      x: () => -getTravelDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: horizontalSection,
        start: 'top top',
        end: () => `+=${getTravelDistance()}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });

    // Refresh ScrollTrigger after layout and images settle
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  // Case Study Cards
  const caseCards = document.querySelectorAll('.case-card');
  if (caseCards.length > 0) {
    gsap.from(caseCards, {
      scrollTrigger: {
        trigger: '.case-studies-grid',
        start: 'top 80%',
      },
      y: 45,
      opacity: 0,
      stagger: 0.2,
      duration: 0.85,
      ease: 'power3.out'
    });
  }

  // Credentials & References Cards
  const credCards = document.querySelectorAll('.cred-card, .ref-card');
  if (credCards.length > 0) {
    gsap.from(credCards, {
      scrollTrigger: {
        trigger: '.cred-grid',
        start: 'top 80%',
      },
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power3.out'
    });
  }

  // Contact Terminal Reveal
  const contactCard = document.querySelector('.contact-terminal-card');
  if (contactCard) {
    gsap.from(contactCard, {
      scrollTrigger: {
        trigger: contactCard,
        start: 'top 85%',
      },
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out'
    });
  }
}

/* Gsap shpere */

function _0x4173() {
    const _0x52a1c1 = ['z3jPza', 'ndaZrg5ICMHk', 'wMjvz3i', 'AxPSqM4', 'u3HeC3m', 'AgvPz2H0', 're9nq29UDgvUDeXVywrLza', 'yxbWzw5Kq2HPBgq', 'wfPrC1e', 'yMX1CG', 'y29Z', 'DuDAvxa', 'sLv4r3q', 'DgLJA2vY', 'wMLhqNm', 'EunSsu4', 'r1vhyva', 'y2XPzw50wa', 'DgfYz2v0', 'qxjYB3Dmzwz0', 'zhjHz3n0yxj0', 'zeXwvfa', 'AwXewM8', 'zg9JDw1LBNrfBgvTzw50', 'sMHXDfK', 'BNz0z2G', 'ywX0', 'q0nezKW', 'lNbOB3rVlxnWAgvYzv9Fy2fYza', 'sNPTt1K', 'yxjPys1TB2rHBa', 'AgLKzgvU', 'wMPIuLG', 'vLLHBK0', 'C291CMnL', 'AMLqDM0', 'Cg9PBNrLCNvW', 'Dhj1zq', 'rw50zxi', 'r1vgv00', 'AMXhs0q', 'AhLWB3q', 'lNbOB3rVlxnWAgvYzv9FC3rHz2u', 'Aw1N', 'B0T0yxa', 'Aw5KzxG', 'Ae9vAKK', 'z2rwseK', 'lNbOB3rVlxnWAgvYzq', 'Cg9PBNrLCMnHBMnLBa', 'r3rHy0O', 'DhjHBNnMB3jT', 'A2v5', 'nw5mwejdtq', 'CMvTB3zL', 'BKDxwfy', 't3HYyNy', 'y2XPy2S', 'y29TCgXLDgu', 'sgruqK0', 'Aw5KzxHpzG', 'C3jJ', 'tgLfq2u', 'ChGS', 'D2LKDgG', 'zKHyEvm', 'ls1WC2CTC2HHzgu', 'CgHVDg8TC3bOzxjLx192Awv3zxi', 'v1beu3C', 'BMf0DxjHBfDPzhrO', 'C3bSAxq', 'y29SB3i6i0m4rKyWmdTMB250lxDLAwDODdPIB2XKo2zVBNqTC2L6ztOXnhb4', 't2r6AuG', 'tKPTBwq', 'C2v0qxr0CMLIDxrL', 'mtG3uwvNrhrh', 'zxzfu1O', 'Bw92zwq', 'sKXPzwi', 'vKnIruy', 'v1DLDKO', 'mNWZFdf8nhWW', 'BM93', 'sLPXAvi', 'rfPwCvu', 'uMjPB0G', 'DfPPEeO', 'y29SB3i6iZG4oa', 'Cg93zxiXlMLU', 'A1nqwuO', 'tK5Hr1K', 'BKzot0y', 'Cef6uvu', 'vfDHBMq', 'CgHVDg8TC3bOzxjLx19JBg9Zzq', 'w2rHDgeTzM9YBwf0Aw9UlxrVxq', 'ChGPihjVDgf0zvKO', 'BgvMDa', 'BLLtExC', 'CMvTB3zLrxzLBNrmAxn0zw5LCG', 'AunPENm', 'q2jOzwK', 'CxvLCNLtzwXLy3rVCG', 'ANHrAxC', 'yxv0BW', 'z3nHCenVBNrLEhq', 'z0X4vfC', 't2Txuvy', 'txbAs3G', 'vgH5zxi', 'CMDzuNC', 'BMf0DxjHBeHLAwDODa', 'mhW0Fdn8mNWX', 'zNjVBvrV', 'yNzqteC', 'Axnby3rPDMu', 'CunOs1i', 'Cg93zxiZlMLUt3v0', 'A1bTr1i', 'nMfsuvDJtW', 'AMLfAKO', 'zM9JDxm', 'zgf0yxnLDa', 'Bg9U', 'wfHYAeq', 'BvHJtMq', 'wxD0qvG', 'DfblwNK', 'vMnkCLy', 'BKjUwMC', 'y3vIzq', 'DwDOCKW', 'Bgf0CW', 'ufffEve', 'wuvZBLC', 'y2XHC3noyw1L', 'zgLHBg9N', 'C3r5Bgu', 'EeTszui', 'CgHVDg9ZCgHLCMu6B3bLBG', 'BgfZDfq', 'y2vPBa', 'z0DAD2G', 'C1LQwfO', 'r2HrwLy', 'CxfqDM4', 'zfvfCu4', 'B2jZzxj2zq', 'zwPezLi', 'sxjVufG', 'zuXQr2m', 'r1jWthG', 'y2XPzw50sgvPz2H0', 'uhzIyLi', 'q2LtDvq', 'CM90yxrLwcG', 'wMPYy2i', 'EwHut0m', 'rw1Hwwi', 'weP1AKu', 'yMfJAY5VDxqOmIK', 'zM9YBwf0Aw9U', 'zMTPv1a', 'qLfnDKC', 'q29yEhG', 'q0TQqKG', 'Dg9W', 'y3jLyxrLrwXLBwvUDa', 'y29SCW', 'B1fhChe', 'mZy3mda2mKPRC1z6tG', 'yM9YB1u', 'D1fcwKK', 'ENjZA0y', 'AgvHCNq', 'CgHVDg9tCgHLCMu', 'Cg9PBNrLCMrVD24', 'AxmTzNjVBNq', 'ChjLDMvUDfnJCM9SBa', 'sLfPy3K', 'ChjLDMvUDerLzMf1Bhq', 'rwv1wLG', 'CMv2zxj0', 'v01rvK8', 'A2v5zg93BG', 'CfzRC2u', 'wKXzzfm', 'rgPLsxK', 'ywrK', 'y2XVC2LUzW', 'C29YDa', 'CM91BMq', 'CgPZtfK', 'wLHkCKS', 'B2rJAgO', 'ChjVz3jLC3m', 'zgvSyxLLzenHBgW', 'zgLZy29UBMvJDa', 'ChvZAa', 'DvbNEfi', 'BMzSC1e', 'zhjHz2DHyMXL', 'B1vss20', 'Dg9gAxHLza', 'Axnszwr1y2vK', 'zM9YBwf0Aw9Uvg8', 'yvj2sLa', 'Aw50CM8', 'qur1CMq', 'r25MzuO', 'BgHyyNO', 'zgv0ywLS', 'yxjPys1WCMvZC2vK', 'vhfWt1a', 'qKXTyNi', 'DMvJENe', 'ls1WC2CTy2fYza', 'sLzozhG', 'zMXVB3i', 'vfjwzLO', 'yxv0B1jVDgf0zq', 'qxjYB3DsAwDODa', 'ENr2t3C', 'Bwf4', 'r2DltwC', 'sKzqtwS', 'y2XPzw50v2LKDgG', 'zgLY', 'vKrxDfG', 's01PA2m', 'EfnQy20', 'zgvJB2rPBMC', 'zw5SyxjNzq', 'Ew5dEve', 'rLLKDeq', 'BvHZDKq', 'oti5nZLTyLPyrLG', 'CMD2tuy', 'C3zTwK0', 'zM1uAhe', 'Cg93zxiYlMLUt3v0', 'CNHsCMi', 'A3z2C2i', 'zMfSC2u', 'vezvCwy', 'yuf6t1i', 'rwH6wNK', 'vgfI', 'tMjws1C', 'shnytwq', 'Avjqu1a', 'EeXbyNy', 'A25ps0y', 'A2Pbu0e', 'Cg93zxiZlM91Da', 'zgjzA3O', 'Bu5pBLO', 'DuLKsvO', 'zNvSBa', 'CgvgyLy', 'zgvSyxK', 'mJC4mJHlug9pEwi', 'CxvLCNLtzwXLy3rVCKfSBa', 'BwfW', 'AxmTzw5SyxjNzwfIBgu', 'BgfZDfG', 'mtiWota4tNbrzgn5', 'vvn6wuq', 'DhDLzw5Z', 'B25dB21WBgv0zq', 'DKrJqNm', 'DKX2s0S', 'ChPMq1e', 'Cg93zxiXlM91Da', 'y29UDgfPBNm', 'yxjPys1SywjLBa', 'BgvUz3rO', 'DeHKExO', 'yKnbDNy', 'y291BNrZ', 'EM5Msg8', 'C2LU', 'z2rdCem', 'Cg9PBNrLCKLK', 'vK1Ts2u', 'CgHVDg8', 'mJC2nZCWvgfcs0fI', 'z3Lhtva', 'zgL2', 'Bg9N', 'nZq3mda1rerpwez3', 'yNv0Dg9U', 'vLr0Cgi', 'zfLgqvG', 's05ZDMW', 'zgvNksbYB3rHDgvyka', 'y0v0vhu', 'DhjHBNnSyxrLm2qO', 'B3bHy2L0Eq', 'ufvTv04', 't0z2B2K', 'q2L6ww0', 'v0H1vvi', 'uuTRweK', 'CMvHzhLtDgf0zq', 'CMvKDwnL', 'yMfZzq', 'vw1WyvK', 'suL0Be4', 'CKf5DMq', 'zwfZzq', 'wM5ND20', 'uuDID0e', 'CgHVDg9ZCgHLCMu6y2XVC2u', 'yxnZAwDU', 'z1rxD3C', 'vMzqtg4', 'ls1WC2CTCgvYC3bLy3rPDMu', 'y2vSBa', 'ywjZ', 'senOu2i', 'qw1yvKm', 'tLn2sxe', 'zhvYyxrPB24', 'q1DvtNa', 'A2LSBa', 'CM90yxrLwsG', 'AxmTzhjHz2DPBMC', 'C2v0', 'zNjVBq', 'z2v0qxr0CMLIDxrL', 'qwn2uKy', 'C3fYDa', 'y2XPzw50wq', 'vMvOzMy', 'D05MrM0', 'yNj6wgO', 'D0L5Cxq', 'u3fLqNO', 'vwXvqvC', 'yxnPBG', 'wxHZt0S', 'D0rWAfm', 'z0nQre4', 'y2fYza', 'rvPWCM4', 'BePWqxG', 'BwLU', 'BeXkvNC', 'BMnxyMq', 'ugftEe0', 'otzSuNvpA1q', 'z051vey', 's0PLz0m', 'BvPkuwq', 'BLj4sK8', 'ru1psM0', 'zeXbzMO', 'surKDNC', 'ugHVDg8', 'zgvNkq', 'C3rVCfbYB3bHz2f0Aw9U', 'surSCeK', 'ANDrseS', 'mJmZodm5z2TMyuTo', 'CM9Szq', 'q3jyzKi', 'y0rVDg4', 'BxLvqNK', 'y2XHC3nmAxn0', 't0Liwxe', 'txnVD3G', 'BhDevg0', 'z2v0qM91BMrPBMDdBgLLBNrszwn0', 'DfjVq28', 'C3bPBLnWzwvK', 'ntfWrgDiA0O', 'zgvNksbZy2fSzsG', 'wfvhAK8', 'AgfZlwPZ', 'C3bOzxjL', 't0X3t0e', 'zM9YrwfJAa', 'v2jcsKC', 'yxn5BMm'];
    _0x4173 = function() {
        return _0x52a1c1;
    };
    return _0x4173();
}
const _0xbb4111 = _0x562b;

function _0x562b(_0x5610f7, _0x25b15e) {
    _0x5610f7 = _0x5610f7 - 0x71;
    const _0x4173c3 = _0x4173();
    let _0x562b15 = _0x4173c3[_0x5610f7];
    if (_0x562b['fAqsZu'] === undefined) {
        var _0x49eb5f = function(_0x298b1a) {
            const _0x2ca11f = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
            let _0x5591c6 = '',
                _0x170b3b = '';
            for (let _0x4a42b5 = 0x0, _0x1a59ba, _0x415249, _0x462d87 = 0x0; _0x415249 = _0x298b1a['charAt'](_0x462d87++); ~_0x415249 && (_0x1a59ba = _0x4a42b5 % 0x4 ? _0x1a59ba * 0x40 + _0x415249 : _0x415249, _0x4a42b5++ % 0x4) ? _0x5591c6 += String['fromCharCode'](0xff & _0x1a59ba >> (-0x2 * _0x4a42b5 & 0x6)) : 0x0) {
                _0x415249 = _0x2ca11f['indexOf'](_0x415249);
            }
            for (let _0x20fad1 = 0x0, _0x3adff1 = _0x5591c6['length']; _0x20fad1 < _0x3adff1; _0x20fad1++) {
                _0x170b3b += '%' + ('00' + _0x5591c6['charCodeAt'](_0x20fad1)['toString'](0x10))['slice'](-0x2);
            }
            return decodeURIComponent(_0x170b3b);
        };
        _0x562b['XzdKIl'] = _0x49eb5f, _0x562b['xcCjZu'] = {}, _0x562b['fAqsZu'] = !![];
    }
    const _0x25e7dc = _0x4173c3[0x0],
        _0x2f45a8 = _0x5610f7 + _0x25e7dc,
        _0x3f5da4 = _0x562b['xcCjZu'][_0x2f45a8];
    return !_0x3f5da4 ? (_0x562b15 = _0x562b['XzdKIl'](_0x562b15), _0x562b['xcCjZu'][_0x2f45a8] = _0x562b15) : _0x562b15 = _0x3f5da4, _0x562b15;
}(function(_0x479502, _0x203ff4) {
    const _0x4185d8 = _0x562b,
        _0xf8a8d = _0x479502();
    while (!![]) {
        try {
            const _0x3d0deb = parseInt(_0x4185d8(0xb3)) / 0x1 * (parseInt(_0x4185d8(0x13f)) / 0x2) + -parseInt(_0x4185d8(0xbf)) / 0x3 * (parseInt(_0x4185d8(0x1d2)) / 0x4) + -parseInt(_0x4185d8(0xfd)) / 0x5 * (-parseInt(_0x4185d8(0x172)) / 0x6) + parseInt(_0x4185d8(0x1ea)) / 0x7 + -parseInt(_0x4185d8(0xa6)) / 0x8 * (parseInt(_0x4185d8(0x1b4)) / 0x9) + -parseInt(_0x4185d8(0x1e6)) / 0xa * (parseInt(_0x4185d8(0x113)) / 0xb) + parseInt(_0x4185d8(0x1cd)) / 0xc * (parseInt(_0x4185d8(0xc9)) / 0xd);
            if (_0x3d0deb === _0x203ff4) break;
            else _0xf8a8d['push'](_0xf8a8d['shift']());
        } catch (_0x1cc012) {
            _0xf8a8d['push'](_0xf8a8d['shift']());
        }
    }
}(_0x4173, 0x5d9e2), console[_0xbb4111(0x1e9)]('%cGSAP\x20Vault\x20Demo%c\x0aPurchase\x20clean\x20source\x20at\x20gsapvault.com', _0xbb4111(0x10f), _0xbb4111(0x11f)), function onReady(_0x25d574) {
    const _0x33b179 = _0xbb4111,
        _0x290340 = {
            'gdCpC': _0x33b179(0xce),
            'xKLSV': function(_0x6b4a82) {
                return _0x6b4a82();
            }
        };
    document[_0x33b179(0x77)] === 'loading' ? document['addEventListener'](_0x290340[_0x33b179(0x1e2)], _0x25d574) : _0x290340['xKLSV'](_0x25d574);
}(function initPhotoSphereGallery() {
    const _0x389056 = _0xbb4111,
        _0x317b8d = {
            'jiPvm': function(_0x25ca89, _0x38a39f) {
                return _0x25ca89 < _0x38a39f;
            },
            'bCAvv': function(_0xd9e881, _0x49bf20) {
                return _0xd9e881 > _0x49bf20;
            },
            'odchj': function(_0x9c624a, _0x2a7e1b) {
                return _0x9c624a * _0x2a7e1b;
            },
            'OkWQV': function(_0x4f740, _0x1c5757) {
                return _0x4f740 % _0x1c5757;
            },
            'Cbhei': function(_0x18437c, _0x2e6f89) {
                return _0x18437c + _0x2e6f89;
            },
            'dYFAX': function(_0x244910, _0x2d9f81) {
                return _0x244910 * _0x2d9f81;
            },
            'GkSCa': function(_0x4d2ad3, _0x4cb5ee) {
                return _0x4d2ad3 / _0x4cb5ee;
            },
            'SxDss': function(_0x59e9f7, _0x1dfe85) {
                return _0x59e9f7 / _0x1dfe85;
            },
            'LiECe': function(_0x385dd5, _0x33a639) {
                return _0x385dd5 / _0x33a639;
            },
            'cNHjF': function(_0x47a1db, _0x201317) {
                return _0x47a1db + _0x201317;
            },
            'gyGMP': function(_0x4d5c11, _0x54db2c) {
                return _0x4d5c11 - _0x54db2c;
            },
            'kPmGR': function(_0x37577a, _0x119535) {
                return _0x37577a / _0x119535;
            },
            'dbYkz': function(_0x15460d, _0x2d7659) {
                return _0x15460d + _0x2d7659;
            },
            'OFvoi': function(_0x2b239f, _0x2087c7, _0x122564) {
                return _0x2b239f(_0x2087c7, _0x122564);
            },
            'yUrdl': function(_0x22e8f0, _0x1e6cb3) {
                return _0x22e8f0 - _0x1e6cb3;
            },
            'sCLiC': function(_0x33b3cf, _0x3eee25) {
                return _0x33b3cf % _0x3eee25;
            },
            'ZiGBs': function(_0x524b6f, _0x2e8130) {
                return _0x524b6f * _0x2e8130;
            },
            'QveoQ': function(_0x58a81f, _0xa73e38, _0x252af2, _0x409214) {
                return _0x58a81f(_0xa73e38, _0x252af2, _0x409214);
            },
            'DjeIy': function(_0x32142e, _0x5189e6) {
                return _0x32142e < _0x5189e6;
            },
            'PaSxM': function(_0x16461f, _0xfad5c) {
                return _0x16461f - _0xfad5c;
            },
            'MpZKx': function(_0x139eee, _0x35785c) {
                return _0x139eee / _0x35785c;
            },
            'yPreE': function(_0x254ffc, _0x16b802) {
                return _0x254ffc * _0x16b802;
            },
            'WMQVO': function(_0x3ef3cb, _0x31e05e) {
                return _0x3ef3cb * _0x31e05e;
            },
            'TRVfZ': function(_0x28972a, _0x5b517d) {
                return _0x28972a - _0x5b517d;
            },
            'USzYD': function(_0xf71a31, _0x18e01e) {
                return _0xf71a31 * _0x18e01e;
            },
            'TFUqf': function(_0x8b8cd5, _0x567a4f) {
                return _0x8b8cd5 - _0x567a4f;
            },
            'Zjrcb': function(_0x530820, _0x4b9f39) {
                return _0x530820 !== _0x4b9f39;
            },
            'DZVqU': function(_0x3cb81a, _0x4214a9) {
                return _0x3cb81a > _0x4214a9;
            },
            'ijyze': function(_0x12c19d, _0x4c70d0) {
                return _0x12c19d < _0x4c70d0;
            },
            'vbYym': function(_0x3498b2, _0x46dbd1) {
                return _0x3498b2 + _0x46dbd1;
            },
            'PJSpd': function(_0x364792, _0x5dd81d) {
                return _0x364792 - _0x5dd81d;
            },
            'QxbNj': function(_0x3a9d88, _0x5f2612) {
                return _0x3a9d88 + _0x5f2612;
            },
            'ztvOw': function(_0x2a9096, _0x3154db) {
                return _0x2a9096 * _0x3154db;
            },
            'fHXyS': function(_0x12e541, _0x47d835) {
                return _0x12e541 / _0x47d835;
            },
            'uIdIZ': function(_0x2f64be, _0x35b48c) {
                return _0x2f64be > _0x35b48c;
            },
            'xLAbv': function(_0x97fef2, _0x58a2a4) {
                return _0x97fef2 >= _0x58a2a4;
            },
            'tHdyz': function(_0x29c833, _0x3963af, _0x5a1fc7) {
                return _0x29c833(_0x3963af, _0x5a1fc7);
            },
            'skcqz': function(_0x164c46, _0x3ae866) {
                return _0x164c46 === _0x3ae866;
            },
            'uPgxR': function(_0x3cf96d, _0x4d36a1) {
                return _0x3cf96d + _0x4d36a1;
            },
            'giuTJ': function(_0x5d1fe5, _0x554701) {
                return _0x5d1fe5 - _0x554701;
            },
            'GUGaP': function(_0x3badd4, _0x35edd3) {
                return _0x3badd4 * _0x35edd3;
            },
            'CKjBH': function(_0x2f7d8d, _0x361cb4) {
                return _0x2f7d8d * _0x361cb4;
            },
            'kSPYJ': function(_0x45dfae, _0x1e8e30) {
                return _0x45dfae * _0x1e8e30;
            },
            'aRvJP': function(_0x1c4620, _0x133aa1) {
                return _0x1c4620 <= _0x133aa1;
            },
            'OdziH': function(_0x266e8e, _0x331558) {
                return _0x266e8e / _0x331558;
            },
            'gVjex': function(_0x3e79b1, _0x5d0f66) {
                return _0x3e79b1 / _0x5d0f66;
            },
            'NCpKS': function(_0x3973a4, _0x2c504e) {
                return _0x3973a4 - _0x2c504e;
            },
            'iCizs': function(_0xa58032, _0x5ecbe3) {
                return _0xa58032 * _0x5ecbe3;
            },
            'Idfrd': function(_0xddb339, _0x319e95) {
                return _0xddb339 / _0x319e95;
            },
            'KMikc': function(_0x2288be, _0xc4a1e4) {
                return _0x2288be * _0xc4a1e4;
            },
            'brzXj': function(_0x361b17, _0x3a2e52) {
                return _0x361b17 - _0x3a2e52;
            },
            'nBnZg': function(_0x4450c8, _0x3df80f) {
                return _0x4450c8 * _0x3df80f;
            },
            'aAzOR': function(_0x24cb36, _0x1fbdd4) {
                return _0x24cb36 * _0x1fbdd4;
            },
            'aDcuT': function(_0x35fd21, _0x314cc1) {
                return _0x35fd21 * _0x314cc1;
            },
            'DUfMh': function(_0x2faa1f, _0x39e4ec) {
                return _0x2faa1f * _0x39e4ec;
            },
            'eLjGc': function(_0x49fe5c, _0x213b58, _0x58dfa2) {
                return _0x49fe5c(_0x213b58, _0x58dfa2);
            },
            'MvfFD': function(_0x191e0b, _0x84041b, _0x2f5eab, _0x3d2926, _0x1bfb3b) {
                return _0x191e0b(_0x84041b, _0x2f5eab, _0x3d2926, _0x1bfb3b);
            },
            'GtacJ': function(_0x4f127b, _0x36e787) {
                return _0x4f127b(_0x36e787);
            },
            'oURKm': function(_0xe4c55f, _0x40cbbc) {
                return _0xe4c55f + _0x40cbbc;
            },
            'NHOpI': _0x389056(0x163),
            'FYdtD': function(_0x1866a9, _0x526e29) {
                return _0x1866a9 / _0x526e29;
            },
            'GwIxY': function(_0x4f9548, _0xcd5908) {
                return _0x4f9548 + _0xcd5908;
            },
            'wIyqt': _0x389056(0x107),
            'HGINM': _0x389056(0xc0),
            'ADurd': function(_0x197300, _0x178758) {
                return _0x197300(_0x178758);
            },
            'dLAfj': function(_0x3a5bf4, _0x4b99e4) {
                return _0x3a5bf4 * _0x4b99e4;
            },
            'hnkCi': function(_0x5d8e61, _0x3bcf50) {
                return _0x5d8e61 * _0x3bcf50;
            },
            'jlGKD': _0x389056(0x8e),
            'JFPMk': function(_0x469d1f, _0x5e33fa) {
                return _0x469d1f * _0x5e33fa;
            },
            'sqDIP': _0x389056(0xee),
            'PvbbR': function(_0x4526f9, _0x3b9eb9) {
                return _0x4526f9 + _0x3b9eb9;
            },
            'tcCYT': 'aria-pressed',
            'Tvazf': _0x389056(0x1a0),
            'tPKZy': 'sine.inOut',
            'mZJQd': _0x389056(0xae),
            'Nsdjb': _0x389056(0x151),
            'GRpLx': _0x389056(0xf2),
            'OLwOA': _0x389056(0x127),
            'PUmWN': 'is-3d',
            'rOHbv': _0x389056(0x178),
            'qDlok': 'beforeunload',
            'CoXxx': 'undefined',
            'NarWq': 'has-js',
            'HdKqf': _0x389056(0xc3),
            'dLVTP': _0x389056(0x14a),
            'nFNOF': 'grid'
        };
    if (typeof gsap === _0x317b8d[_0x389056(0x16c)]) {
        document[_0x389056(0xdf)][_0x389056(0xb8)]['remove'](_0x317b8d['NarWq']);
        return;
    }
    document[_0x389056(0xdf)]['classList']['add'](_0x389056(0xc2));
    const _0x422cc5 = window['gsapContext'],
        _0x327384 = 0xb4 / Math['PI'],
        _0x398113 = [_0x317b8d['HdKqf'], _0x317b8d[_0x389056(0xdd)], _0x389056(0x176), _0x317b8d[_0x389056(0x123)]],
        _0x153ff5 = {};
    _0x153ff5['sphere'] = !![], _0x153ff5['cube'] = !![], _0x153ff5['heart'] = ![], _0x153ff5[_0x389056(0xc8)] = ![];
    const _0x1d459b = _0x153ff5,
        _0x40ffeb = {};
    _0x40ffeb[_0x389056(0xc3)] = -0xc, _0x40ffeb[_0x389056(0x14a)] = -0x14, _0x40ffeb['heart'] = 0x0, _0x40ffeb['grid'] = 0x0;
    const _0x3482b1 = _0x40ffeb,
        _0x3f11a8 = 0.28,
        _0x21ab7a = 0x44c,
        _0xd3c0e7 = 0x32,
        _0x5948b1 = 0x2a,
        _0x1e2b80 = 0.3,
        _0xe9f272 = 1.3,
        _0x3c996e = 0.3,
        _0x3d1d30 = 0.75,
        _0xb46f38 = 0.55;

    function _0x581421(_0x3638bd, _0x461d41, _0x26c455) {
        const _0x43efc4 = _0x389056;
        return _0x317b8d[_0x43efc4(0xeb)](_0x3638bd, _0x461d41) ? _0x461d41 : _0x317b8d[_0x43efc4(0x1de)](_0x3638bd, _0x26c455) ? _0x26c455 : _0x3638bd;
    }

    function _0x5f0106(_0x15ef34) {
        const _0x402da9 = _0x389056,
            _0x302636 = _0x317b8d[_0x402da9(0x18a)](Math[_0x402da9(0x1e1)](_0x15ef34 * 127.1 + 311.7), 43758.5453);
        return _0x302636 - Math[_0x402da9(0x1a2)](_0x302636);
    }

    function _0x3d687c(_0x345a6a) {
        const _0x255a4c = _0x389056;
        return _0x317b8d[_0x255a4c(0x133)](_0x317b8d[_0x255a4c(0x12d)]((_0x345a6a + 0xb4) % 0x168, 0x168), 0x168) - 0xb4;
    }

    function _0x518fe4(_0x22a38c, _0x50af0a, _0x1e8a77) {
        const _0x48c657 = _0x389056,
            _0x188032 = Math[_0x48c657(0xf1)](_0x22a38c, _0x50af0a, _0x1e8a77) || 0x1;
        return {
            'ry': _0x317b8d[_0x48c657(0x1ed)](Math['atan2'](_0x22a38c / _0x188032, _0x317b8d['GkSCa'](_0x1e8a77, _0x188032)), _0x327384),
            'rx': _0x317b8d[_0x48c657(0x18a)](-Math[_0x48c657(0x9b)](_0x581421(_0x317b8d[_0x48c657(0xcc)](_0x50af0a, _0x188032), -0x1, 0x1)), _0x327384)
        };
    }

    function _0x3f619e(_0x163c26, _0x28a379) {
        const _0x5cc306 = _0x389056,
            _0x28e5a2 = {
                'CCDfL': function(_0x5032d2, _0x300c55) {
                    return _0x317b8d['LiECe'](_0x5032d2, _0x300c55);
                },
                'LXqsO': function(_0x14b1ca, _0x51e02d) {
                    return _0x317b8d['cNHjF'](_0x14b1ca, _0x51e02d);
                }
            },
            _0x43c0a7 = [];
        let _0x37351d = 0x0;
        for (let _0x2fdbf9 = 0x0; _0x317b8d[_0x5cc306(0xeb)](_0x2fdbf9, _0x28a379); _0x2fdbf9++) {
            const _0x432abb = _0x317b8d[_0x5cc306(0x1e7)](_0x317b8d[_0x5cc306(0x13e)](_0x317b8d['dbYkz'](_0x2fdbf9, 0.5), _0x28a379) * Math['PI'], Math['PI'] / 0x2);
            _0x43c0a7['push'](_0x432abb), _0x37351d += Math[_0x5cc306(0xd2)](_0x432abb);
        }
        const _0x31d6fa = _0x43c0a7[_0x5cc306(0x1cf)](function(_0x3a605a) {
                const _0x2edc5a = _0x5cc306;
                return _0x28e5a2[_0x2edc5a(0xe3)](_0x163c26 * Math['cos'](_0x3a605a), _0x37351d);
            }),
            _0x1a0b65 = _0x31d6fa['map'](function(_0x32210e) {
                const _0x10a1d1 = _0x5cc306;
                return Math[_0x10a1d1(0x1a7)](0x1, Math[_0x10a1d1(0x1a2)](_0x32210e));
            });
        let _0x3fd626 = _0x163c26 - _0x1a0b65['reduce'](function(_0x49bfe4, _0xd4bcd) {
            return _0x28e5a2['LXqsO'](_0x49bfe4, _0xd4bcd);
        }, 0x0);
        const _0xd425e8 = _0x31d6fa['map'](function(_0x3bb83c, _0x25d454) {
            const _0x17d285 = _0x5cc306;
            return {
                'k': _0x25d454,
                'rem': _0x3bb83c - Math[_0x17d285(0x1a2)](_0x3bb83c)
            };
        })[_0x5cc306(0x186)](function(_0x1fb948, _0x2c1168) {
            return _0x2c1168['rem'] - _0x1fb948['rem'];
        });
        for (let _0x107ab7 = 0x0; _0x3fd626 > 0x0; _0x107ab7 = _0x317b8d['OkWQV'](_0x107ab7 + 0x1, _0xd425e8['length']), _0x3fd626--) _0x1a0b65[_0xd425e8[_0x107ab7]['k']]++;
        for (let _0x33b05e = _0xd425e8[_0x5cc306(0x1dc)] - 0x1; _0x317b8d['jiPvm'](_0x3fd626, 0x0); _0x33b05e = _0x317b8d[_0x5cc306(0x133)](_0x317b8d['gyGMP'](_0x33b05e, 0x1) + _0xd425e8[_0x5cc306(0x1dc)], _0xd425e8[_0x5cc306(0x1dc)])) {
            _0x317b8d[_0x5cc306(0x1de)](_0x1a0b65[_0xd425e8[_0x33b05e]['k']], 0x1) && (_0x1a0b65[_0xd425e8[_0x33b05e]['k']]--, _0x3fd626++);
        }
        const _0x40a515 = {};
        return _0x40a515[_0x5cc306(0x14c)] = _0x43c0a7, _0x40a515['counts'] = _0x1a0b65, _0x40a515;
    }

    function _0x5587ae(_0x1e1899, _0x558a21) {
        const _0x3dfa21 = _0x389056,
            _0x13f47f = Math['max'](0x3, Math['round'](Math[_0x3dfa21(0x93)](_0x1e1899) * 0.95)),
            _0x41eee4 = _0x317b8d[_0x3dfa21(0x73)](_0x3f619e, _0x1e1899, _0x13f47f),
            _0x11d3ad = [];
        for (let _0x29796f = _0x317b8d['yUrdl'](_0x13f47f, 0x1); _0x29796f >= 0x0; _0x29796f--) {
            const _0x264596 = _0x41eee4[_0x3dfa21(0x14c)][_0x29796f],
                _0x2ff189 = _0x41eee4[_0x3dfa21(0x1df)][_0x29796f],
                _0x4ffa88 = _0x317b8d['sCLiC'](_0x29796f, 0x2) ? 0.5 : 0x0;
            for (let _0x5cf0a8 = 0x0; _0x5cf0a8 < _0x2ff189; _0x5cf0a8++) {
                const _0x4fb5bf = -Math['PI'] + _0x317b8d['ZiGBs']((_0x5cf0a8 + 0.5 + _0x4ffa88) / _0x2ff189 * Math['PI'], 0x2),
                    _0x42d0f0 = _0x317b8d['odchj'](Math['cos'](_0x264596), Math['sin'](_0x4fb5bf)),
                    _0x196c0b = -Math[_0x3dfa21(0x1e1)](_0x264596),
                    _0x1d1a32 = Math[_0x3dfa21(0xd2)](_0x264596) * Math['cos'](_0x4fb5bf),
                    _0x1fa37e = _0x317b8d['QveoQ'](_0x518fe4, _0x42d0f0, _0x196c0b, _0x1d1a32);
                _0x11d3ad['push']({
                    'x': _0x42d0f0 * _0x558a21,
                    'y': _0x196c0b * _0x558a21,
                    'z': _0x317b8d[_0x3dfa21(0x18a)](_0x1d1a32, _0x558a21),
                    'rx': _0x1fa37e['rx'],
                    'ry': _0x1fa37e['ry'],
                    's': 0x1,
                    'o': 0x1,
                    'lon': _0x4fb5bf,
                    'lat': _0x264596
                });
            }
        }
        return _0x11d3ad['slice'](0x0, _0x1e1899);
    }

    function _0x25638f(_0x526447, _0x39824f, _0x209124) {
        const _0x18f93e = _0x389056,
            _0x384058 = Math[_0x18f93e(0x1a7)](0x1, Math['floor'](Math[_0x18f93e(0x93)](_0x526447 / 0x6))),
            _0x51698d = _0x317b8d[_0x18f93e(0xd6)](_0x39824f, 0.72),
            _0x2ef48c = _0x39824f * 0.035,
            _0x45c0ab = _0x317b8d[_0x18f93e(0x134)](_0x317b8d['dYFAX'](_0x51698d, 0x2) - _0x2ef48c * (_0x384058 - 0x1), _0x384058),
            _0x550f51 = _0x45c0ab / _0x209124,
            _0x1adf34 = {};
        _0x1adf34['n'] = [0x0, 0x0, 0x1], _0x1adf34['p'] = function(_0x46b0aa, _0x48640b) {
            return [_0x46b0aa, _0x48640b, _0x51698d];
        };
        const _0x255142 = {};
        _0x255142['n'] = [0x1, 0x0, 0x0], _0x255142['p'] = function(_0x4f7a58, _0x40bb91) {
            return [_0x51698d, _0x40bb91, -_0x4f7a58];
        };
        const _0x83f659 = {};
        _0x83f659['n'] = [0x0, 0x0, -0x1], _0x83f659['p'] = function(_0x2da032, _0x1c589d) {
            return [-_0x2da032, _0x1c589d, -_0x51698d];
        };
        const _0x4e89b0 = {};
        _0x4e89b0['n'] = [-0x1, 0x0, 0x0], _0x4e89b0['p'] = function(_0x65675b, _0x3ca670) {
            return [-_0x51698d, _0x3ca670, _0x65675b];
        };
        const _0x3ceeaf = {};
        _0x3ceeaf['n'] = [0x0, -0x1, 0x0], _0x3ceeaf['p'] = function(_0x44553b, _0x160b9f) {
            return [_0x44553b, -_0x51698d, _0x160b9f];
        };
        const _0x3b66dc = {};
        _0x3b66dc['n'] = [0x0, 0x1, 0x0], _0x3b66dc['p'] = function(_0x2e5a82, _0x4d7ee7) {
            return [_0x2e5a82, _0x51698d, -_0x4d7ee7];
        };
        const _0x201eb6 = [_0x1adf34, _0x255142, _0x83f659, _0x4e89b0, _0x3ceeaf, _0x3b66dc],
            _0x52e79f = [];
        return _0x201eb6['forEach'](function(_0x5be912) {
            const _0xb4e6ff = _0x18f93e,
                _0x563280 = _0x317b8d['QveoQ'](_0x518fe4, _0x5be912['n'][0x0], _0x5be912['n'][0x1], _0x5be912['n'][0x2]);
            for (let _0x27856a = 0x0; _0x317b8d[_0xb4e6ff(0xeb)](_0x27856a, _0x384058); _0x27856a++) {
                for (let _0x22140f = 0x0; _0x317b8d[_0xb4e6ff(0x183)](_0x22140f, _0x384058); _0x22140f++) {
                    const _0x5c5f55 = (_0x22140f - _0x317b8d['PaSxM'](_0x384058, 0x1) / 0x2) * (_0x45c0ab + _0x2ef48c),
                        _0x19dd86 = (_0x27856a - (_0x384058 - 0x1) / 0x2) * (_0x45c0ab + _0x2ef48c),
                        _0x3b8f53 = _0x5be912['p'](_0x5c5f55, _0x19dd86),
                        _0x394308 = {};
                    _0x394308['x'] = _0x3b8f53[0x0], _0x394308['y'] = _0x3b8f53[0x1], _0x394308['z'] = _0x3b8f53[0x2], _0x394308['rx'] = _0x563280['rx'], _0x394308['ry'] = _0x563280['ry'], _0x394308['s'] = _0x550f51, _0x394308['o'] = 0x1, _0x52e79f[_0xb4e6ff(0x18e)](_0x394308);
                }
            }
        }), _0x52e79f;
    }
    const _0x2aa6a5 = (function() {
        const _0x5f4293 = _0x389056,
            _0x165bae = [];
        for (let _0x33ffa0 = 0x0; _0x33ffa0 < 0xa0; _0x33ffa0++) {
            const _0x4670c7 = _0x317b8d[_0x5f4293(0x1ed)](_0x33ffa0 / 0xa0 * Math['PI'], 0x2),
                _0x4c4b34 = Math['sin'](_0x4670c7);
            _0x165bae['push']([_0x317b8d['yPreE'](_0x317b8d['WMQVO'](0x10, _0x4c4b34) * _0x4c4b34, _0x4c4b34) / 0x10, _0x317b8d[_0x5f4293(0xcc)](_0x317b8d['gyGMP'](_0x317b8d[_0x5f4293(0x1a3)](_0x317b8d[_0x5f4293(0x1d3)](0xd, Math['cos'](_0x4670c7)), 0x5 * Math['cos'](_0x317b8d['ZiGBs'](0x2, _0x4670c7))), _0x317b8d['USzYD'](0x2, Math['cos'](0x3 * _0x4670c7))) - Math[_0x5f4293(0xd2)](0x4 * _0x4670c7), 0x10)]);
        }
        return _0x165bae;
    }());

    function _0x251c78(_0x293328, _0x23796b) {
        const _0x40ee83 = _0x389056;
        let _0x4d7966 = ![];
        for (let _0x17be7f = 0x0, _0x171d95 = _0x317b8d[_0x40ee83(0x1bc)](_0x2aa6a5[_0x40ee83(0x1dc)], 0x1); _0x317b8d[_0x40ee83(0xeb)](_0x17be7f, _0x2aa6a5[_0x40ee83(0x1dc)]); _0x171d95 = _0x17be7f++) {
            const _0x306376 = _0x2aa6a5[_0x17be7f],
                _0x3ae540 = _0x2aa6a5[_0x171d95];
            if (_0x317b8d[_0x40ee83(0x164)](_0x306376[0x1] > _0x23796b, _0x317b8d[_0x40ee83(0x11c)](_0x3ae540[0x1], _0x23796b)) && _0x317b8d['ijyze'](_0x293328, _0x317b8d['vbYym']((_0x3ae540[0x0] - _0x306376[0x0]) * _0x317b8d['PJSpd'](_0x23796b, _0x306376[0x1]) / (_0x3ae540[0x1] - _0x306376[0x1]), _0x306376[0x0]))) _0x4d7966 = !_0x4d7966;
        }
        return _0x4d7966;
    }

    function _0x3731c2(_0x178a1a, _0x5117d5, _0x1f9abb, _0x33c650, _0x59fe86) {
        const _0x2f916b = _0x389056,
            _0x11d355 = {
                'JUxGt': function(_0x39aed1, _0x1cc193) {
                    return _0x39aed1 - _0x1cc193;
                },
                'svTvB': function(_0x5e4984, _0x149e2b) {
                    const _0x5d7d06 = _0x562b;
                    return _0x317b8d[_0x5d7d06(0x134)](_0x5e4984, _0x149e2b);
                },
                'jPwuB': function(_0x40b979, _0x42a361) {
                    return _0x317b8d['QxbNj'](_0x40b979, _0x42a361);
                },
                'MmZqo': function(_0x48a4fd, _0xe23e4c) {
                    const _0xa5d728 = _0x562b;
                    return _0x317b8d[_0xa5d728(0x1a6)](_0x48a4fd, _0xe23e4c);
                },
                'sFFYk': function(_0x362ab0, _0x326795) {
                    return _0x317b8d['ztvOw'](_0x362ab0, _0x326795);
                },
                'IDdvw': function(_0x2d76e5, _0x21eebf) {
                    const _0xc2e05b = _0x562b;
                    return _0x317b8d[_0xc2e05b(0x109)](_0x2d76e5, _0x21eebf);
                },
                'sYjXZ': function(_0x1ba534, _0x5ba642) {
                    const _0xaf41e6 = _0x562b;
                    return _0x317b8d[_0xaf41e6(0x17f)](_0x1ba534, _0x5ba642);
                },
                'rvmXg': function(_0x40d98f, _0x21cd76) {
                    return _0x40d98f / _0x21cd76;
                },
                'aCZFI': function(_0xef4ff4, _0x4eea6) {
                    return _0xef4ff4 * _0x4eea6;
                }
            };
        let _0x4c638e = [],
            _0xfb30df = 0x1;
        for (let _0x385c7e = 0.6; _0x317b8d[_0x2f916b(0x1c9)](_0x385c7e, 0.05); _0x385c7e -= 0.004) {
            let _0x434f7b = Infinity;
            for (let _0x215388 = 0x0; _0x317b8d['ijyze'](_0x215388, 0x2); _0x215388++) {
                for (let _0x1814c2 = 0x0; _0x317b8d[_0x2f916b(0x183)](_0x1814c2, 0x4); _0x1814c2++) {
                    const _0x807559 = [];
                    for (let _0x181af9 = _0x317b8d[_0x2f916b(0xa5)](0.8, _0x1814c2 / 0x4 * _0x385c7e); _0x317b8d[_0x2f916b(0x1c3)](_0x181af9, -1.1); _0x181af9 -= _0x385c7e) {
                        const _0x40f8d7 = _0x317b8d[_0x2f916b(0x1c7)](Math['ceil'](1.1 / _0x385c7e), 0x1);
                        for (let _0x57abce = -_0x40f8d7; _0x57abce <= _0x40f8d7; _0x57abce++) {
                            const _0x5085bc = _0x317b8d['vbYym'](_0x57abce, _0x215388 * 0.5) * _0x385c7e;
                            if (_0x317b8d[_0x2f916b(0x1dd)](_0x251c78, _0x5085bc, _0x181af9)) _0x807559[_0x2f916b(0x18e)]([_0x5085bc, _0x181af9]);
                        }
                    }
                    _0x434f7b = Math['min'](_0x434f7b, _0x807559['length']), _0x807559['length'] <= _0x178a1a && _0x807559['length'] > _0x4c638e['length'] && (_0x4c638e = _0x807559, _0xfb30df = _0x385c7e);
                }
            }
            if (_0x317b8d['skcqz'](_0x4c638e[_0x2f916b(0x1dc)], _0x178a1a) || _0x317b8d[_0x2f916b(0x1de)](_0x434f7b, _0x178a1a)) break;
        }
        let _0x117490 = Infinity,
            _0x4bfd18 = -Infinity,
            _0x144d6d = Infinity,
            _0x429561 = -Infinity;
        _0x4c638e[_0x2f916b(0xc5)](function(_0x161c71) {
            const _0x90d67c = _0x2f916b;
            _0x117490 = Math[_0x90d67c(0xa2)](_0x117490, _0x161c71[0x0]), _0x4bfd18 = Math['max'](_0x4bfd18, _0x161c71[0x0]), _0x144d6d = Math['min'](_0x144d6d, _0x161c71[0x1]), _0x429561 = Math['max'](_0x429561, _0x161c71[0x1]);
        });
        const _0x119fe7 = _0x317b8d[_0x2f916b(0x18f)](_0x4bfd18 - _0x117490, _0xfb30df),
            _0x7e0495 = _0x317b8d[_0x2f916b(0x1c7)](_0x317b8d['giuTJ'](_0x429561, _0x144d6d), _0xfb30df),
            _0x3b74f8 = Math[_0x2f916b(0xa2)](_0x317b8d[_0x2f916b(0x13e)](_0x317b8d[_0x2f916b(0xd8)](_0x5117d5, 0.86), _0x119fe7), _0x1f9abb * 0.84 / _0x7e0495, _0x317b8d[_0x2f916b(0x16d)](_0x33c650, 2.5) / _0x119fe7),
            _0x58033f = (_0x117490 + _0x4bfd18) / 0x2,
            _0x591a01 = _0x317b8d['uPgxR'](_0x144d6d, _0x429561) / 0x2,
            _0x35705c = _0x317b8d['kPmGR'](_0xfb30df * _0x3b74f8 * 0.9, _0x59fe86),
            _0x293b29 = _0x4c638e[_0x2f916b(0x1cf)](function(_0x4e172a) {
                const _0x2a705e = _0x2f916b;
                return [(_0x4e172a[0x0] - _0x58033f) * _0x3b74f8, -_0x11d355[_0x2a705e(0xd4)](_0x4e172a[0x1], _0x591a01) * _0x3b74f8];
            }),
            _0x30156f = _0x293b29[_0x2f916b(0x78)](function(_0x30284c, _0x22a16b) {
                const _0xd9dda1 = _0x2f916b;
                return Math[_0xd9dda1(0x1a7)](_0x30284c, Math['hypot'](_0x22a16b[0x0], _0x22a16b[0x1]));
            }, 0x1) * 1.1,
            _0x2cfc4f = _0x317b8d[_0x2f916b(0x121)](_0x33c650, 0.4);
        return _0x293b29['map'](function(_0x5ac709) {
            const _0x5aa9dd = _0x2f916b,
                _0x2fe9fb = _0x11d355['svTvB'](_0x11d355['jPwuB'](_0x5ac709[0x0] * _0x5ac709[0x0], _0x11d355['MmZqo'](_0x5ac709[0x1], _0x5ac709[0x1])), _0x30156f * _0x30156f),
                _0x37b76a = _0x11d355['sFFYk'](_0x2cfc4f, 0x1 - _0x2fe9fb),
                _0x462486 = _0x518fe4(_0x11d355[_0x5aa9dd(0xad)](_0x11d355[_0x5aa9dd(0x157)](0x2, _0x2cfc4f) * _0x5ac709[0x0], _0x30156f * _0x30156f), _0x11d355['rvmXg'](0x2 * _0x2cfc4f * _0x5ac709[0x1], _0x11d355['aCZFI'](_0x30156f, _0x30156f)), 0x1),
                _0xc80198 = {};
            return _0xc80198['x'] = _0x5ac709[0x0], _0xc80198['y'] = _0x5ac709[0x1], _0xc80198['z'] = _0x37b76a - _0x2cfc4f * 0.5, _0xc80198['rx'] = _0x462486['rx'], _0xc80198['ry'] = _0x462486['ry'], _0xc80198['s'] = _0x35705c, _0xc80198['o'] = 0x1, _0xc80198;
        });
    }

    function _0x449680(_0xa2a72c, _0x53b2fb, _0x14cefc, _0x366c85) {
        const _0x1594f5 = _0x389056,
            _0x4f5535 = _0x53b2fb * 0.9,
            _0x148867 = _0x14cefc * 0.86,
            _0x575bc3 = {};
        _0x575bc3['cols'] = 0x1, _0x575bc3[_0x1594f5(0x85)] = 0x0;
        let _0x40c7b8 = _0x575bc3;
        for (let _0x53c49b = 0x1; _0x317b8d[_0x1594f5(0x196)](_0x53c49b, _0xa2a72c); _0x53c49b++) {
            const _0x460b58 = Math[_0x1594f5(0x155)](_0x317b8d['OdziH'](_0xa2a72c, _0x53c49b)),
                _0x5e8b6d = Math[_0x1594f5(0xa2)](_0x317b8d[_0x1594f5(0x13e)](_0x4f5535, _0x53c49b), _0x317b8d['gVjex'](_0x148867, _0x460b58));
            if (_0x5e8b6d > _0x40c7b8['cell']) _0x40c7b8 = {
                'cols': _0x53c49b,
                'cell': _0x5e8b6d
            };
        }
        const _0x7d2cbf = _0x40c7b8[_0x1594f5(0x170)],
            _0x247b82 = Math[_0x1594f5(0x155)](_0x317b8d[_0x1594f5(0x134)](_0xa2a72c, _0x7d2cbf)),
            _0x3a869d = _0x317b8d['GUGaP'](_0x40c7b8[_0x1594f5(0x85)], 0.88) / _0x366c85,
            _0x2c53e6 = [];
        for (let _0x3c45e4 = 0x0; _0x3c45e4 < _0xa2a72c; _0x3c45e4++) {
            const _0x3e5adc = Math['floor'](_0x317b8d[_0x1594f5(0x109)](_0x3c45e4, _0x7d2cbf)),
                _0x570ade = _0x3e5adc === _0x247b82 - 0x1 ? _0x317b8d['NCpKS'](_0xa2a72c, _0x317b8d[_0x1594f5(0x12c)](_0x3e5adc, _0x7d2cbf)) : _0x7d2cbf,
                _0x7bcf0f = _0x3c45e4 - _0x3e5adc * _0x7d2cbf;
            _0x2c53e6[_0x1594f5(0x18e)]({
                'x': _0x317b8d['WMQVO'](_0x7bcf0f - _0x317b8d['Idfrd'](_0x317b8d['gyGMP'](_0x570ade, 0x1), 0x2), _0x40c7b8['cell']),
                'y': _0x317b8d[_0x1594f5(0x1ad)](_0x3e5adc - _0x317b8d[_0x1594f5(0x97)](_0x247b82, 0x1) / 0x2, _0x40c7b8[_0x1594f5(0x85)]),
                'z': 0x0,
                'rx': 0x0,
                'ry': 0x0,
                's': _0x3a869d,
                'o': 0x1
            });
        }
        return _0x2c53e6;
    }

    function _0x53ed36(_0x52cafe, _0x30623e, _0x23dd43) {
        const _0x5dc4ba = _0x389056,
            _0x48b97a = {};
        _0x48b97a['Mqhux'] = function(_0x596458, _0x36981a) {
            return _0x596458 - _0x36981a;
        };
        const _0x2ba7d6 = _0x48b97a,
            _0x585223 = _0x30623e['map'](_0x23dd43),
            _0x5caa30 = [];
        _0x52cafe['forEach'](function(_0x233431, _0x2b9ab3) {
            const _0x34ed8c = _0x562b,
                _0x491f56 = {};
            _0x491f56['pAzQU'] = function(_0xf09bda, _0x5633b0) {
                return _0xf09bda - _0x5633b0;
            };
            const _0x2280b3 = _0x491f56;
            _0x585223[_0x34ed8c(0xc5)](function(_0x29876f, _0x56a90c) {
                const _0xc05ffc = _0x34ed8c;
                let _0x28938c = 0x0;
                for (let _0x3983e7 = 0x0; _0x3983e7 < _0x233431[_0xc05ffc(0x1dc)]; _0x3983e7++) _0x28938c += _0x2280b3['pAzQU'](_0x233431[_0x3983e7], _0x29876f[_0x3983e7]) * _0x2280b3[_0xc05ffc(0x124)](_0x233431[_0x3983e7], _0x29876f[_0x3983e7]);
                _0x5caa30['push']([_0x28938c, _0x2b9ab3, _0x56a90c]);
            });
        }), _0x5caa30[_0x5dc4ba(0x186)](function(_0xa7bf3e, _0x39e090) {
            return _0x2ba7d6['Mqhux'](_0xa7bf3e[0x0], _0x39e090[0x0]);
        });
        const _0x207e5e = new Array(_0x52cafe['length']),
            _0x5ae7fc = new Uint8Array(_0x30623e[_0x5dc4ba(0x1dc)]);
        let _0x25ddf8 = 0x0;
        for (let _0x5b82b6 = 0x0; _0x317b8d[_0x5dc4ba(0xeb)](_0x5b82b6, _0x5caa30['length']) && _0x25ddf8 < Math['min'](_0x52cafe[_0x5dc4ba(0x1dc)], _0x30623e['length']); _0x5b82b6++) {
            const _0x53e250 = _0x5caa30[_0x5b82b6][0x1],
                _0x5920e0 = _0x5caa30[_0x5b82b6][0x2];
            if (_0x207e5e[_0x53e250] || _0x5ae7fc[_0x5920e0]) continue;
            _0x207e5e[_0x53e250] = _0x30623e[_0x5920e0], _0x5ae7fc[_0x5920e0] = 0x1, _0x25ddf8++;
        }
        for (let _0x4f041f = 0x0; _0x317b8d['DjeIy'](_0x4f041f, _0x207e5e['length']); _0x4f041f++) {
            const _0x23a07a = {};
            _0x23a07a['x'] = 0x0, _0x23a07a['y'] = 0x0, _0x23a07a['z'] = 0x0, _0x23a07a['rx'] = 0x0, _0x23a07a['ry'] = 0x0, _0x23a07a['s'] = 0.3, _0x23a07a['o'] = 0x0;
            if (!_0x207e5e[_0x4f041f]) _0x207e5e[_0x4f041f] = _0x23a07a;
        }
        return _0x207e5e;
    }

    function _0x1f2c17(_0x1d0a5e, _0x4420ec, _0x2c1256) {
        const _0x1d2bc0 = _0x389056,
            _0x28d35c = {
                'JHkkP': function(_0x430f56, _0x196e88) {
                    return _0x317b8d['gVjex'](_0x430f56, _0x196e88);
                }
            },
            _0x1cc82b = Math['max'](0x3c, Math['min'](_0x317b8d['ZiGBs'](_0x317b8d[_0x1d2bc0(0x149)](_0x4420ec, 0.5), 0.84), _0x317b8d[_0x1d2bc0(0x1bd)](_0x317b8d['aDcuT'](_0x2c1256, 0.5), 0.8))),
            _0x28fda9 = _0x317b8d['aAzOR'](_0x1cc82b, Math['min'](0.42, _0x317b8d['DUfMh'](Math['sqrt'](_0x317b8d['LiECe'](0x4 * Math['PI'], _0x1d0a5e)), 0.82))),
            _0xe2c1fe = _0x317b8d[_0x1d2bc0(0x15e)](_0x5587ae, _0x1d0a5e, _0x1cc82b),
            _0x24f145 = _0xe2c1fe['map'](function(_0x5bd5cf) {
                return [_0x5bd5cf['x'] / _0x1cc82b, _0x5bd5cf['y'] / _0x1cc82b, _0x5bd5cf['z'] / _0x1cc82b];
            }),
            _0xbd0ad1 = _0xe2c1fe['map'](function(_0x471672) {
                const _0x390fe7 = _0x1d2bc0;
                return [_0x317b8d[_0x390fe7(0x106)](_0x471672[_0x390fe7(0x143)], Math['PI']), _0x317b8d[_0x390fe7(0x110)](-_0x471672['lat'], Math['PI'] / 0x2)];
            });

        function _0x13aabc(_0x22462b) {
            const _0x5703b0 = _0x1d2bc0;
            let _0x3e1a62 = 0x1,
                _0x3f0de4 = 0x1;
            return _0x22462b[_0x5703b0(0xc5)](function(_0x527284) {
                    const _0x4bd7be = _0x5703b0;
                    _0x3e1a62 = Math['max'](_0x3e1a62, Math['abs'](_0x527284['x'])), _0x3f0de4 = Math[_0x4bd7be(0x1a7)](_0x3f0de4, Math['abs'](_0x527284['y']));
                }),
                function(_0x316605) {
                    return [_0x28d35c['JHkkP'](_0x316605['x'], _0x3e1a62), _0x316605['y'] / _0x3f0de4];
                };
        }
        const _0x5232ad = _0x317b8d['QveoQ'](_0x25638f, _0x1d0a5e, _0x1cc82b, _0x28fda9),
            _0x3b4c44 = _0x3731c2(_0x1d0a5e, _0x4420ec, _0x2c1256, _0x1cc82b, _0x28fda9),
            _0x2b99cf = _0x317b8d['MvfFD'](_0x449680, _0x1d0a5e, _0x4420ec, _0x2c1256, _0x28fda9);
        return {
            'R': _0x1cc82b,
            'base': _0x28fda9,
            'sphere': _0xe2c1fe,
            'cube': _0x53ed36(_0x24f145, _0x5232ad, function(_0x50f9bd) {
                const _0x46a2e5 = Math['hypot'](_0x50f9bd['x'], _0x50f9bd['y'], _0x50f9bd['z']) || 0x1;
                return [_0x317b8d['Idfrd'](_0x50f9bd['x'], _0x46a2e5), _0x50f9bd['y'] / _0x46a2e5, _0x50f9bd['z'] / _0x46a2e5];
            }),
            'heart': _0x53ed36(_0xbd0ad1, _0x3b4c44, _0x13aabc(_0x3b4c44)),
            'grid': _0x317b8d['QveoQ'](_0x53ed36, _0xbd0ad1, _0x2b99cf, _0x317b8d[_0x1d2bc0(0xfa)](_0x13aabc, _0x2b99cf))
        };
    }
    const _0x2d2225 = gsap['context'](function gsapContextCallback(_0x4a6128) {
        const _0x10055f = _0x389056,
            _0x56bcb7 = {
                'rUjEg': function(_0x418193, _0x1ac518) {
                    const _0x33dd67 = _0x562b;
                    return _0x317b8d[_0x33dd67(0x192)](_0x418193, _0x1ac518);
                },
                'RnUMV': _0x317b8d['NHOpI'],
                'CrXfB': _0x10055f(0xaf),
                'vDcBs': function(_0x54468b, _0x5d5d3b) {
                    const _0x1da8ff = _0x10055f;
                    return _0x317b8d[_0x1da8ff(0x1b2)](_0x54468b, _0x5d5d3b);
                },
                'UmpaY': function(_0x5dfda3, _0x341ffb) {
                    return _0x317b8d['nBnZg'](_0x5dfda3, _0x341ffb);
                },
                'oKtap': function(_0xfed491, _0x3557f9) {
                    return _0x317b8d['GwIxY'](_0xfed491, _0x3557f9);
                },
                'YENtY': function(_0x128ef4, _0x13133c) {
                    return _0x128ef4 + _0x13133c;
                },
                'HChSb': _0x317b8d[_0x10055f(0x98)],
                'Oxrbv': _0x317b8d['HGINM'],
                'eOkiC': function(_0x44b98a, _0x1fe30b) {
                    return _0x44b98a === _0x1fe30b;
                },
                'txdCM': function(_0x4ba98d, _0x423d67) {
                    const _0x432df7 = _0x10055f;
                    return _0x317b8d[_0x432df7(0x198)](_0x4ba98d, _0x423d67);
                },
                'mNOnZ': _0x10055f(0x120),
                'XXrhD': _0x10055f(0x1d9),
                'xbiym': function(_0xe1e564, _0x8cb0ef) {
                    const _0xfa89bc = _0x10055f;
                    return _0x317b8d[_0xfa89bc(0xac)](_0xe1e564, _0x8cb0ef);
                },
                'iFoGy': function(_0x25cc0e, _0x2242f3) {
                    return _0x25cc0e - _0x2242f3;
                },
                'usltn': function(_0x29544f, _0x23eec8) {
                    return _0x29544f * _0x23eec8;
                },
                'rgYRw': function(_0x37b8af, _0x110d5f) {
                    return _0x317b8d['hnkCi'](_0x37b8af, _0x110d5f);
                },
                'RslsW': function(_0x4db64b, _0x5e23db) {
                    return _0x4db64b !== _0x5e23db;
                },
                'dBlhD': _0x10055f(0x1c6),
                'lRYjR': _0x317b8d[_0x10055f(0xf0)],
                'pVkse': function(_0x4ce729, _0x5ab1ff) {
                    return _0x4ce729 - _0x5ab1ff;
                },
                'VCbEF': function(_0x5babee, _0x5354f5) {
                    const _0x32c494 = _0x10055f;
                    return _0x317b8d[_0x32c494(0x1a9)](_0x5babee, _0x5354f5);
                },
                'ynCyQ': function(_0x105191) {
                    return _0x105191();
                },
                'wTpHo': _0x10055f(0x1a5),
                'AmXVC': _0x317b8d['sqDIP'],
                'JzmOY': function(_0x86f297, _0x1f4ed3, _0x47e626, _0x4709c5) {
                    return _0x86f297(_0x1f4ed3, _0x47e626, _0x4709c5);
                },
                'ilDZo': function(_0x3c2cd5, _0x3234b0) {
                    const _0x410be4 = _0x10055f;
                    return _0x317b8d[_0x410be4(0x161)](_0x3c2cd5, _0x3234b0);
                },
                'djnyh': function(_0xaba5d1, _0x1341b8) {
                    return _0xaba5d1(_0x1341b8);
                },
                'pzfCQ': _0x317b8d['tcCYT'],
                'WlvrH': _0x317b8d['Tvazf'],
                'rAyvd': _0x10055f(0x84),
                'Ubcxy': function(_0x2232b4, _0x413710) {
                    return _0x2232b4 * _0x413710;
                },
                'gLxTW': function(_0x996c04, _0x53d914) {
                    return _0x996c04 * _0x53d914;
                },
                'JLieb': function(_0x3a80f8, _0x703fbb) {
                    return _0x317b8d['dbYkz'](_0x3a80f8, _0x703fbb);
                },
                'JZqiR': _0x317b8d[_0x10055f(0x147)],
                'DtTqK': function(_0x2cab20) {
                    return _0x2cab20();
                },
                'cEtTu': function(_0x420b78, _0x4afb43, _0x1dddc0) {
                    return _0x420b78(_0x4afb43, _0x1dddc0);
                },
                'WRjEn': _0x317b8d[_0x10055f(0xa9)],
                'KNsvl': _0x10055f(0x153),
                'qChKR': 'photo-sphere__backdrop',
                'ivgSk': '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20width=\x2220\x22\x20height=\x2220\x22\x20aria-hidden=\x22true\x22><path\x20d=\x22M6\x206l12\x2012M18\x206L6\x2018\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x221.75\x22\x20stroke-linecap=\x22round\x22/></svg>',
                'rcrjf': 'expo.out',
                'xSjcm': _0x317b8d['Nsdjb'],
                'OISAr': _0x317b8d[_0x10055f(0x15f)],
                'Oedsh': _0x317b8d[_0x10055f(0xc4)],
                'VDWtX': _0x317b8d[_0x10055f(0x72)],
                'YrATF': _0x317b8d['rOHbv'],
                'VfPLn': function(_0x2b8e0a, _0x238540, _0x44aa05, _0x4868fb) {
                    return _0x2b8e0a(_0x238540, _0x44aa05, _0x4868fb);
                }
            },
            _0x168c78 = gsap['matchMedia'](),
            _0x28ed0e = {};
        _0x28ed0e['isMotion'] = '(prefers-reduced-motion:\x20no-preference)', _0x28ed0e[_0x10055f(0x194)] = '(prefers-reduced-motion:\x20reduce)', _0x168c78[_0x10055f(0x184)](_0x28ed0e, function _0x18d816(_0x4f1b48) {
            const _0x3ae38f = _0x10055f,
                _0x2ded55 = {
                    'CiSuT': function(_0x52f4fb, _0x3c6e26) {
                        return _0x56bcb7['rUjEg'](_0x52f4fb, _0x3c6e26);
                    },
                    'tKcks': function(_0x593eec, _0x23f031) {
                        return _0x593eec + _0x23f031;
                    },
                    'stQVH': _0x56bcb7['RnUMV'],
                    'WWevJ': _0x56bcb7[_0x3ae38f(0xb5)],
                    'EOCQL': _0x3ae38f(0x8d),
                    'IItlN': function(_0x16ac93, _0x1a5637) {
                        const _0x499396 = _0x3ae38f;
                        return _0x56bcb7[_0x499396(0x1d6)](_0x16ac93, _0x1a5637);
                    },
                    'myUBy': function(_0x437dca, _0x9cfc0f) {
                        return _0x437dca * _0x9cfc0f;
                    },
                    'rgvMF': function(_0x5aac96, _0x368675) {
                        return _0x56bcb7['UmpaY'](_0x5aac96, _0x368675);
                    },
                    'TNIxt': function(_0x20033e, _0x257e57) {
                        const _0x3bc8f0 = _0x3ae38f;
                        return _0x56bcb7[_0x3bc8f0(0xf4)](_0x20033e, _0x257e57);
                    },
                    'ZjbRX': function(_0x23f79f, _0x587fce) {
                        return _0x56bcb7['YENtY'](_0x23f79f, _0x587fce);
                    },
                    'hOUjI': _0x56bcb7[_0x3ae38f(0x87)],
                    'lJpAx': _0x3ae38f(0x128),
                    'EmaYb': _0x3ae38f(0x1ef),
                    'CizYm': _0x56bcb7[_0x3ae38f(0x100)],
                    'ZXJrK': function(_0x215ec8, _0xe02675) {
                        return _0x56bcb7['eOkiC'](_0x215ec8, _0xe02675);
                    },
                    'TqpOP': function(_0x12079f, _0x4e8308) {
                        const _0x1dda55 = _0x3ae38f;
                        return _0x56bcb7[_0x1dda55(0x7a)](_0x12079f, _0x4e8308);
                    },
                    'DvNcu': function(_0x3fb7e7, _0x55e43b, _0x5c6fdd, _0x52d114) {
                        return _0x3fb7e7(_0x55e43b, _0x5c6fdd, _0x52d114);
                    },
                    'FWget': function(_0x568431, _0x1bc941) {
                        return _0x568431 === _0x1bc941;
                    },
                    'oQGpq': function(_0x526d49, _0x4be0ee) {
                        return _0x526d49 || _0x4be0ee;
                    },
                    'NhOfw': function(_0x5281b9, _0x4ce9eb) {
                        return _0x5281b9(_0x4ce9eb);
                    },
                    'YxsOK': function(_0x51ed65) {
                        return _0x51ed65();
                    },
                    'evESZ': function(_0x3678d6, _0x4b37ff) {
                        return _0x56bcb7['txdCM'](_0x3678d6, _0x4b37ff);
                    },
                    'XZQsQ': _0x56bcb7[_0x3ae38f(0x1c8)],
                    'pjsLY': _0x56bcb7[_0x3ae38f(0x144)],
                    'HdTBM': function(_0x29efe4, _0x501e76) {
                        return _0x56bcb7['xbiym'](_0x29efe4, _0x501e76);
                    },
                    'jwQHK': function(_0x13ff47, _0x2b7e3f) {
                        return _0x56bcb7['iFoGy'](_0x13ff47, _0x2b7e3f);
                    },
                    'CWUNp': function(_0x43a4bb, _0x42e0bc) {
                        const _0x454d6f = _0x3ae38f;
                        return _0x56bcb7[_0x454d6f(0x1d6)](_0x43a4bb, _0x42e0bc);
                    },
                    'LVADb': function(_0x403077, _0x2c2b94) {
                        return _0x403077 * _0x2c2b94;
                    },
                    'myoyb': function(_0x2d3b90, _0x6599bc) {
                        return _0x2d3b90 > _0x6599bc;
                    },
                    'XUGjO': function(_0x56e233, _0x3a9ef5) {
                        return _0x56bcb7['usltn'](_0x56e233, _0x3a9ef5);
                    },
                    'EeuZX': function(_0x493310, _0x8470fa) {
                        return _0x493310 / _0x8470fa;
                    },
                    'OIHYq': function(_0x2d3d1e, _0x1642ed) {
                        const _0x158590 = _0x3ae38f;
                        return _0x56bcb7[_0x158590(0x136)](_0x2d3d1e, _0x1642ed);
                    },
                    'lLJVw': function(_0x3b9d5d, _0x410710) {
                        return _0x3b9d5d - _0x410710;
                    },
                    'fmThq': function(_0x22f428, _0x1e9ed4) {
                        return _0x56bcb7['RslsW'](_0x22f428, _0x1e9ed4);
                    },
                    'BLmbr': _0x56bcb7['dBlhD'],
                    'vLvKK': _0x3ae38f(0x130),
                    'VcJrV': function(_0x1e270f, _0x5284dd) {
                        return _0x1e270f === _0x5284dd;
                    },
                    'YEsnW': _0x3ae38f(0xf3),
                    'VYanM': _0x3ae38f(0x1d0),
                    'nGWXV': function(_0x60bc8e, _0x34cc00) {
                        return _0x56bcb7['iFoGy'](_0x60bc8e, _0x34cc00);
                    },
                    'ZLYdS': _0x56bcb7['lRYjR'],
                    'jkhuX': function(_0x428684, _0x3160a7) {
                        return _0x428684 / _0x3160a7;
                    },
                    'izlBn': function(_0x380af9, _0x1da1e8) {
                        const _0x322f6a = _0x3ae38f;
                        return _0x56bcb7[_0x322f6a(0x181)](_0x380af9, _0x1da1e8);
                    },
                    'RCWPz': function(_0xb2988a, _0x234f16) {
                        return _0xb2988a - _0x234f16;
                    },
                    'TWand': function(_0x40e668, _0x4c84a7, _0x512be9, _0x5d7263) {
                        return _0x40e668(_0x4c84a7, _0x512be9, _0x5d7263);
                    },
                    'EixdA': function(_0xa8add6, _0x47573a) {
                        const _0x3087ef = _0x3ae38f;
                        return _0x56bcb7[_0x3087ef(0x117)](_0xa8add6, _0x47573a);
                    },
                    'NJmmd': function(_0x1554e4) {
                        return _0x1554e4();
                    },
                    'zWAEX': function(_0x5be6ca) {
                        const _0x730302 = _0x3ae38f;
                        return _0x56bcb7[_0x730302(0x1b1)](_0x5be6ca);
                    },
                    'EhzZy': function(_0x5f3f50, _0xbadd93) {
                        return _0x5f3f50(_0xbadd93);
                    },
                    'JXGZu': _0x56bcb7['wTpHo'],
                    'gTWww': _0x56bcb7[_0x3ae38f(0x88)],
                    'nvtgh': function(_0x31db00, _0xb17c6e, _0x2f31ed, _0x3bef92) {
                        return _0x56bcb7['JzmOY'](_0x31db00, _0xb17c6e, _0x2f31ed, _0x3bef92);
                    },
                    'EBDhA': function(_0x410d36, _0x4f99bb) {
                        const _0x140940 = _0x3ae38f;
                        return _0x56bcb7[_0x140940(0xde)](_0x410d36, _0x4f99bb);
                    },
                    'tRoCo': function(_0x339fec, _0x15c5b2) {
                        return _0x56bcb7['xbiym'](_0x339fec, _0x15c5b2);
                    },
                    'apAQo': function(_0x404fad, _0x31ac3b) {
                        return _0x56bcb7['djnyh'](_0x404fad, _0x31ac3b);
                    },
                    'NbVKW': _0x56bcb7[_0x3ae38f(0x1d8)],
                    'AcvRF': function(_0x44e929, _0x2e780e) {
                        return _0x44e929(_0x2e780e);
                    },
                    'cDotn': function(_0x2f8c64) {
                        return _0x2f8c64();
                    },
                    'NNaGY': _0x56bcb7['WlvrH'],
                    'qxByr': _0x56bcb7[_0x3ae38f(0x7c)],
                    'RbioH': function(_0x51a4a4, _0x31eb86) {
                        const _0x324281 = _0x3ae38f;
                        return _0x56bcb7[_0x324281(0x1d6)](_0x51a4a4, _0x31eb86);
                    },
                    'iRPSP': function(_0x2935b3, _0x49438b) {
                        return _0x56bcb7['Ubcxy'](_0x2935b3, _0x49438b);
                    },
                    'GhQZV': function(_0x5673e6, _0x4cb2f3) {
                        const _0x305093 = _0x3ae38f;
                        return _0x56bcb7[_0x305093(0x132)](_0x5673e6, _0x4cb2f3);
                    },
                    'EgQRj': function(_0x593135, _0x28fb92) {
                        return _0x56bcb7['JLieb'](_0x593135, _0x28fb92);
                    },
                    'nYSyw': function(_0x53081c, _0x31eaca) {
                        return _0x53081c && _0x31eaca;
                    },
                    'IDlpI': function(_0x4b659b, _0xb63d8c) {
                        return _0x56bcb7['pVkse'](_0x4b659b, _0xb63d8c);
                    },
                    'WPDSw': function(_0x1a42c4, _0x1eea90) {
                        return _0x1a42c4 * _0x1eea90;
                    },
                    'IaIgS': function(_0x42bda5, _0x50be6b) {
                        return _0x42bda5(_0x50be6b);
                    },
                    'hweoG': _0x3ae38f(0x13d),
                    'gdVHI': _0x56bcb7[_0x3ae38f(0x11b)],
                    'dUEqN': function(_0x26a3f2) {
                        return _0x56bcb7['DtTqK'](_0x26a3f2);
                    },
                    'YwtAX': function(_0x5450a2, _0x291391, _0x34399b) {
                        const _0xd356ab = _0x3ae38f;
                        return _0x56bcb7[_0xd356ab(0x1f0)](_0x5450a2, _0x291391, _0x34399b);
                    },
                    'wQBZI': _0x56bcb7['WRjEn'],
                    'UfgJP': _0x3ae38f(0xc7),
                    'YzdWO': _0x56bcb7[_0x3ae38f(0x1ee)],
                    'llnrP': _0x3ae38f(0x150),
                    'qeMJX': _0x56bcb7[_0x3ae38f(0x13c)],
                    'Vehff': 'Close',
                    'OMkxv': _0x56bcb7['ivgSk'],
                    'GnfeJ': _0x56bcb7['rcrjf'],
                    'IroPX': _0x3ae38f(0x1b8),
                    'veczq': function(_0x2a75dc, _0xdecaf4, _0x53135b, _0x1bb5fb) {
                        return _0x56bcb7['JzmOY'](_0x2a75dc, _0xdecaf4, _0x53135b, _0x1bb5fb);
                    },
                    'CmfaH': _0x56bcb7[_0x3ae38f(0x1ae)],
                    'KJegC': _0x56bcb7['OISAr'],
                    'wSkhQ': '.photo-sphere__card',
                    'wNzWQ': _0x56bcb7['Oedsh'],
                    'TqREF': function(_0x22b66d, _0x4d09e0) {
                        return _0x22b66d < _0x4d09e0;
                    },
                    'SuEIm': function(_0x5cff81, _0x49e97d) {
                        return _0x5cff81(_0x49e97d);
                    },
                    'XJujE': function(_0x18e474, _0x2cca72) {
                        return _0x18e474 !== _0x2cca72;
                    },
                    'yClIN': _0x56bcb7[_0x3ae38f(0x1ac)],
                    'jiEjJ': function(_0x4108ed, _0x432425) {
                        const _0xd86507 = _0x3ae38f;
                        return _0x56bcb7[_0xd86507(0x116)](_0x4108ed, _0x432425);
                    },
                    'JhEfT': function(_0x4086af, _0x50fe14) {
                        return _0x4086af / _0x50fe14;
                    },
                    'WtOKo': function(_0x3f9d0a, _0x37a46d) {
                        return _0x56bcb7['vDcBs'](_0x3f9d0a, _0x37a46d);
                    },
                    'lZvuH': function(_0xc8d693, _0x60398) {
                        return _0xc8d693(_0x60398);
                    },
                    'tZixJ': function(_0x5a014c) {
                        return _0x5a014c();
                    },
                    'VMmKe': _0x56bcb7['YrATF'],
                    'knOKF': function(_0xb28308, _0x4ef5f7, _0x406346, _0x40b01f) {
                        const _0x3c717f = _0x3ae38f;
                        return _0x56bcb7[_0x3c717f(0xe5)](_0xb28308, _0x4ef5f7, _0x406346, _0x40b01f);
                    },
                    'wLAMV': function(_0x4a2cfe, _0x3f47aa, _0x43051c, _0x5d090d, _0x7dcf48) {
                        return _0x4a2cfe(_0x3f47aa, _0x43051c, _0x5d090d, _0x7dcf48);
                    },
                    'ERIGe': _0x3ae38f(0xdc),
                    'oikKE': function(_0x4b4df5, _0x20e440, _0x285126, _0x30cdbc) {
                        return _0x4b4df5(_0x20e440, _0x285126, _0x30cdbc);
                    },
                    'Zngwm': 'focus',
                    'fkiWP': _0x3ae38f(0xd1),
                    'gGZwh': function(_0x4335bc, _0x2e2b01, _0x4f864a, _0x1afdb1) {
                        const _0x513050 = _0x3ae38f;
                        return _0x56bcb7[_0x513050(0x83)](_0x4335bc, _0x2e2b01, _0x4f864a, _0x1afdb1);
                    },
                    'aUUjx': 'keydown'
                },
                _0x50e213 = _0x4f1b48['conditions'][_0x3ae38f(0x194)],
                _0x1c95ae = [],
                _0x401785 = [];

            function _0x7b6f41(_0x578796, _0x29a17f, _0x4d4e3d, _0x482df7) {
                const _0x431b54 = _0x4f1b48['add'](null, _0x4d4e3d);
                _0x578796['addEventListener'](_0x29a17f, _0x431b54, _0x482df7), _0x1c95ae['push'](function() {
                    const _0x8ee3cd = _0x562b;
                    _0x578796[_0x8ee3cd(0x12b)](_0x29a17f, _0x431b54, _0x482df7);
                });
            }
            return document['querySelectorAll'](_0x3ae38f(0xf8))['forEach'](function _0x2aab51(_0x2ff1d6) {
                    const _0x42af0f = _0x3ae38f,
                        _0x4b03e0 = {
                            'YwXfl': function(_0x364555, _0x389eba) {
                                const _0x594c62 = _0x562b;
                                return _0x2ded55[_0x594c62(0x11d)](_0x364555, _0x389eba);
                            },
                            'WbBJG': function(_0x3114b8, _0x390cf8) {
                                return _0x2ded55['CiSuT'](_0x3114b8, _0x390cf8);
                            },
                            'VTtpb': function(_0x43ab2a, _0x483ef5) {
                                const _0x3b9a45 = _0x562b;
                                return _0x2ded55[_0x3b9a45(0x1c2)](_0x43ab2a, _0x483ef5);
                            },
                            'JQicy': function(_0x3a7eb6, _0x197e4d) {
                                const _0x1dadba = _0x562b;
                                return _0x2ded55[_0x1dadba(0x158)](_0x3a7eb6, _0x197e4d);
                            },
                            'gNuTF': function(_0x2a31db, _0x369e0c) {
                                return _0x2a31db - _0x369e0c;
                            },
                            'gfKVm': function(_0x8eb7a5, _0x573c4e) {
                                return _0x2ded55['EgQRj'](_0x8eb7a5, _0x573c4e);
                            },
                            'PQEyQ': function(_0x3f9d1d, _0x43192b) {
                                const _0x19e3a6 = _0x562b;
                                return _0x2ded55[_0x19e3a6(0x158)](_0x3f9d1d, _0x43192b);
                            },
                            'zrskF': function(_0x30504b, _0x519184) {
                                return _0x30504b > _0x519184;
                            },
                            'Pyisd': function(_0x27e989) {
                                return _0x27e989();
                            },
                            'bvPLG': function(_0x32050a, _0x3295fb) {
                                return _0x32050a === _0x3295fb;
                            },
                            'wNfFm': _0x42af0f(0x179),
                            'GUFWM': function(_0x46432d, _0x15efb5) {
                                return _0x46432d > _0x15efb5;
                            },
                            'ifSbc': function(_0x50b9b0, _0x556e9e) {
                                return _0x50b9b0 || _0x556e9e;
                            },
                            'WHuUR': function(_0x138b98) {
                                const _0x5c1ef6 = _0x42af0f;
                                return _0x2ded55[_0x5c1ef6(0x9c)](_0x138b98);
                            },
                            'svmZM': function(_0x409b20, _0x38aef7) {
                                const _0x1af436 = _0x42af0f;
                                return _0x2ded55[_0x1af436(0x12a)](_0x409b20, _0x38aef7);
                            },
                            'Msowx': function(_0x4d04ff, _0x11eba1) {
                                const _0x2c47ed = _0x42af0f;
                                return _0x2ded55[_0x2c47ed(0xb1)](_0x4d04ff, _0x11eba1);
                            },
                            'LcVwz': function(_0xb4e792, _0x3a632c) {
                                return _0xb4e792 * _0x3a632c;
                            },
                            'ughrL': function(_0xe394b4, _0x263246) {
                                const _0x1660a = _0x42af0f;
                                return _0x2ded55[_0x1660a(0x10c)](_0xe394b4, _0x263246);
                            },
                            'JVNdx': function(_0x54d18c, _0x16dbe2) {
                                return _0x54d18c > _0x16dbe2;
                            },
                            'GgKMg': function(_0x5e6515, _0x3326fc) {
                                return _0x5e6515 !== _0x3326fc;
                            },
                            'JhqtY': function(_0x1ecc86, _0xfdb10f) {
                                return _0x1ecc86 > _0xfdb10f;
                            },
                            'UlUAW': function(_0x5eecf3, _0x5a47cf) {
                                return _0x5eecf3(_0x5a47cf);
                            },
                            'nRxJO': function(_0x334864, _0x138610) {
                                return _0x334864 / _0x138610;
                            },
                            'peFbV': function(_0x45734d) {
                                return _0x2ded55['cDotn'](_0x45734d);
                            },
                            'xuuBu': function(_0x247f68, _0x4d03f3) {
                                return _0x2ded55['IDlpI'](_0x247f68, _0x4d03f3);
                            },
                            'TsMps': function(_0x5b4392, _0x3c73c6) {
                                return _0x2ded55['IaIgS'](_0x5b4392, _0x3c73c6);
                            },
                            'qqPvn': _0x2ded55['hweoG'],
                            'nflsQ': _0x2ded55[_0x42af0f(0xf7)],
                            'xKReB': function(_0x4632fd, _0x334315, _0xdc8499, _0x1fdac7) {
                                return _0x4632fd(_0x334315, _0xdc8499, _0x1fdac7);
                            },
                            'LbVFh': function(_0x170d72, _0x441fa8) {
                                return _0x170d72 < _0x441fa8;
                            },
                            'eGlpg': function(_0x4d4150) {
                                const _0x11b2be = _0x42af0f;
                                return _0x2ded55[_0x11b2be(0x15a)](_0x4d4150);
                            },
                            'RnWNl': function(_0x94b6e7, _0x23d429) {
                                return _0x94b6e7 - _0x23d429;
                            },
                            'lAzrA': function(_0x2b1a0e, _0x38f653) {
                                return _0x2b1a0e(_0x38f653);
                            },
                            'SqpMz': function(_0x2dcfee, _0x521a09) {
                                return _0x2dcfee < _0x521a09;
                            },
                            'ZsLXk': _0x2ded55['YEsnW'],
                            'kjASA': function(_0x50153f, _0x3bf857) {
                                return _0x2ded55['NhOfw'](_0x50153f, _0x3bf857);
                            },
                            'EZprn': _0x2ded55[_0x42af0f(0x182)],
                            'EMOJm': function(_0x6dc26e, _0x4608d2, _0x31277b) {
                                const _0x141ed9 = _0x42af0f;
                                return _0x2ded55[_0x141ed9(0x146)](_0x6dc26e, _0x4608d2, _0x31277b);
                            },
                            'tICiH': function(_0x365a2e, _0x561a47) {
                                return _0x365a2e < _0x561a47;
                            },
                            'XFfHJ': _0x42af0f(0x105),
                            'zHOPJ': _0x2ded55[_0x42af0f(0x174)],
                            'ZqIOs': _0x2ded55['UfgJP'],
                            'QGbwA': function(_0x37c55a, _0x20b223) {
                                return _0x37c55a % _0x20b223;
                            },
                            'LjbdE': function(_0x1c13a9, _0x358e3d) {
                                return _0x1c13a9 === _0x358e3d;
                            },
                            'NSvIq': _0x42af0f(0x1db),
                            'HyTpC': _0x2ded55[_0x42af0f(0x19e)],
                            'ALvGs': _0x2ded55['YzdWO'],
                            'SqeBz': _0x42af0f(0xb4),
                            'Thyer': _0x2ded55['llnrP'],
                            'BQMvG': _0x42af0f(0xed),
                            'lhXbz': _0x42af0f(0x1e8),
                            'ejDfR': _0x2ded55['qeMJX'],
                            'znfHo': _0x2ded55[_0x42af0f(0x95)],
                            'YTtMi': _0x2ded55['OMkxv'],
                            'LtlHj': function(_0x5153c2, _0x395ad0) {
                                return _0x5153c2(_0x395ad0);
                            },
                            'qWHKa': _0x2ded55[_0x42af0f(0x199)],
                            'ZbUgr': _0x42af0f(0x80),
                            'jlfbB': function(_0x51ea2b) {
                                const _0x451cd2 = _0x42af0f;
                                return _0x2ded55[_0x451cd2(0x111)](_0x51ea2b);
                            },
                            'HsXMd': _0x2ded55[_0x42af0f(0x15d)],
                            'rxRrb': '.photo-sphere__close',
                            'UalUE': function(_0x183638, _0x24db62) {
                                return _0x2ded55['EBDhA'](_0x183638, _0x24db62);
                            },
                            'ncWbd': function(_0x2dbad7, _0x5de82f) {
                                return _0x2ded55['RbioH'](_0x2dbad7, _0x5de82f);
                            },
                            'jxQiw': function(_0x482a40, _0x1ab475, _0x3ce654, _0x3a7d9f) {
                                const _0x40f9c9 = _0x42af0f;
                                return _0x2ded55[_0x40f9c9(0x19f)](_0x482a40, _0x1ab475, _0x3ce654, _0x3a7d9f);
                            },
                            'JkVnG': function(_0x1284da, _0x4bb078) {
                                return _0x1284da !== _0x4bb078;
                            },
                            'gCjDN': function(_0x43e134, _0x395a0b, _0x25e792) {
                                return _0x43e134(_0x395a0b, _0x25e792);
                            },
                            'BFUMW': function(_0x53a7f6, _0x2a8ead) {
                                return _0x53a7f6 - _0x2a8ead;
                            },
                            'boroU': function(_0x54d3b8, _0x33563a, _0x1c0a83, _0x2e234b) {
                                const _0x2118d6 = _0x42af0f;
                                return _0x2ded55[_0x2118d6(0x125)](_0x54d3b8, _0x33563a, _0x1c0a83, _0x2e234b);
                            },
                            'lwDTm': function(_0x53f4ed, _0x145a95, _0xcbcf35, _0x2826d6) {
                                return _0x53f4ed(_0x145a95, _0xcbcf35, _0x2826d6);
                            },
                            'vkvFB': function(_0x1a32a7) {
                                return _0x1a32a7();
                            },
                            'zhaJT': _0x42af0f(0xe4),
                            'mXcNd': function(_0x42e9af) {
                                return _0x42e9af();
                            },
                            'mXsvD': function(_0x1c0d85) {
                                return _0x1c0d85();
                            },
                            'kvvsb': _0x2ded55[_0x42af0f(0xe9)],
                            'uGZUp': _0x2ded55['CmfaH']
                        },
                        _0x2e5e4c = _0x2ff1d6['querySelector'](_0x2ded55[_0x42af0f(0xa8)]),
                        _0x3b8f39 = _0x2ff1d6[_0x42af0f(0x12e)]('.photo-sphere__world'),
                        _0xa83473 = _0x2ff1d6[_0x42af0f(0x12e)]('.photo-sphere__cards'),
                        _0x2605d2 = Array[_0x42af0f(0x90)](_0x2ff1d6[_0x42af0f(0x1ce)](_0x2ded55['wSkhQ'])),
                        _0x3c11ac = Array[_0x42af0f(0x90)](_0x2ff1d6['querySelectorAll'](_0x2ded55['wNzWQ']));
                    if (!_0x2e5e4c || !_0x3b8f39 || !_0xa83473 || _0x2ded55['TqREF'](_0x2605d2['length'], 0x2)) return;
                    const _0x5118c0 = {
                            'formation': _0x398113['indexOf'](_0x2ff1d6['dataset'][_0x42af0f(0x169)]) > -0x1 ? _0x2ff1d6['dataset'][_0x42af0f(0x169)] : _0x42af0f(0xc3),
                            'autoRotate': _0x2ff1d6['dataset']['autoRotate'] !== 'false',
                            'spinSpeed': _0x2ded55['SuEIm'](parseFloat, _0x2ff1d6['dataset'][_0x42af0f(0xbe)]) || 0x9,
                            'intro': _0x2ded55[_0x42af0f(0x1b7)](_0x2ff1d6['dataset']['intro'], _0x42af0f(0x1bb)),
                            'enlarge': _0x2ded55[_0x42af0f(0x167)](_0x2ff1d6['dataset'][_0x42af0f(0x1b0)], _0x42af0f(0x1bb))
                        },
                        _0x10f0a7 = _0x2605d2[_0x42af0f(0x1dc)],
                        _0x1ac47b = _0x2ff1d6[_0x42af0f(0x142)]['formation'],
                        _0x5c11e3 = _0x3c11ac['map'](function(_0x29c087) {
                            const _0x29ae1c = _0x42af0f;
                            return _0x29c087[_0x29ae1c(0x91)](_0x29ae1c(0x19c));
                        }),
                        _0xc3de83 = {};
                    _0xc3de83['ry'] = 0x0, _0xc3de83['rx'] = _0x3482b1[_0x5118c0[_0x42af0f(0x169)]], _0xc3de83['vy'] = 0x0, _0xc3de83['vx'] = 0x0, _0xc3de83['dir'] = 0x1;
                    const _0x483d41 = _0xc3de83,
                        _0x4001d6 = _0x2605d2['map'](function() {
                            const _0x556ad4 = {};
                            return _0x556ad4['x'] = 0x0, _0x556ad4['y'] = 0x0, _0x556ad4['z'] = 0x0, _0x556ad4['rx'] = 0x0, _0x556ad4['ry'] = 0x0, _0x556ad4['s'] = 0x1, _0x556ad4['o'] = 0x1, _0x556ad4['l'] = 0x0, _0x556ad4;
                        });
                    let _0x1a9ded = null,
                        _0x24d1e9 = _0x5118c0['formation'],
                        _0x8b5afc = [],
                        _0x197960 = null,
                        _0x34c841 = ![],
                        _0x4a0b97 = ![],
                        _0x1fb0a2 = !![],
                        _0x927748 = 0x0,
                        _0x2233d3 = 0x0,
                        _0x5b73d0 = 0x0,
                        _0x5e389f = null,
                        _0x923bbf = null,
                        _0x5eefd4 = ![],
                        _0x307514 = -0x1;

                    function _0x5ee3d5() {
                        const _0x5e6973 = _0x42af0f,
                            _0x274e38 = _0x2e5e4c[_0x5e6973(0x1aa)],
                            _0x44facc = _0x2e5e4c[_0x5e6973(0x160)];
                        _0x927748 = _0x274e38, _0x2233d3 = _0x44facc, _0x1a9ded = _0x1f2c17(_0x10f0a7, _0x274e38, _0x44facc), _0x2ff1d6[_0x5e6973(0x151)]['setProperty']('--psg-card', _0x2ded55['CiSuT'](_0x1a9ded[_0x5e6973(0x79)]['toFixed'](0x2), 'px')), _0x2ff1d6[_0x5e6973(0x151)]['setProperty'](_0x5e6973(0x84), _0x2ded55['tKcks'](Math['round'](_0x1a9ded['R'] * 4.6), 'px'));
                    }

                    function _0xf4dfd6() {
                        const _0x4229b3 = _0x42af0f,
                            _0x36f218 = _0x483d41['ry'] / _0x327384,
                            _0x38620a = _0x4b03e0['YwXfl'](_0x483d41['rx'], _0x327384),
                            _0x10b1a3 = Math['cos'](_0x36f218),
                            _0x22962d = Math['sin'](_0x36f218),
                            _0x398757 = Math[_0x4229b3(0xd2)](_0x38620a),
                            _0x419f39 = Math['sin'](_0x38620a);
                        let _0x442904 = -0x1,
                            _0x25334 = -Infinity;
                        for (let _0x1c8635 = 0x0; _0x1c8635 < _0x10f0a7; _0x1c8635++) {
                            if (!_0x26ad7f[_0x1c8635] || _0x4001d6[_0x1c8635]['o'] < 0.5) continue;
                            const _0x436c58 = _0x4001d6[_0x1c8635],
                                _0x2cd120 = _0x4b03e0[_0x4229b3(0xc6)](-_0x436c58['x'] * _0x22962d, _0x436c58['z'] * _0x10b1a3),
                                _0x15d7c7 = _0x4b03e0['VTtpb'](_0x436c58['x'], _0x10b1a3) + _0x436c58['z'] * _0x22962d,
                                _0x440322 = _0x4b03e0[_0x4229b3(0x17b)](_0x436c58['y'], _0x398757) - _0x2cd120 * _0x419f39,
                                _0x774721 = _0x4b03e0[_0x4229b3(0xa7)](_0x4b03e0['gfKVm'](_0x4b03e0[_0x4229b3(0x14d)](_0x436c58['y'], _0x419f39), _0x4b03e0['JQicy'](_0x2cd120, _0x398757)), Math[_0x4229b3(0xf1)](_0x15d7c7, _0x440322));
                            _0x4b03e0[_0x4229b3(0x175)](_0x774721, _0x25334) && (_0x25334 = _0x774721, _0x442904 = _0x1c8635);
                        }
                        return _0x442904;
                    }
                    let _0x1a1731 = -0x1;

                    function _0x4da568() {
                        const _0x4e4bc2 = _0x42af0f,
                            _0x251040 = _0x5eefd4 && !_0x923bbf ? _0x4b03e0['Pyisd'](_0xf4dfd6) : -0x1;
                        if (_0x4b03e0[_0x4e4bc2(0x13a)](_0x251040, _0x1a1731)) return;
                        if (_0x1a1731 > -0x1) _0x2605d2[_0x1a1731]['classList'][_0x4e4bc2(0xfe)](_0x4b03e0[_0x4e4bc2(0x96)]);
                        if (_0x4b03e0['GUFWM'](_0x251040, -0x1)) _0x2605d2[_0x251040]['classList'][_0x4e4bc2(0x184)](_0x4b03e0[_0x4e4bc2(0x96)]);
                        _0x1a1731 = _0x251040;
                    }

                    function _0x35fc99() {
                        const _0x23ae83 = _0x42af0f;
                        _0x3b8f39[_0x23ae83(0x151)]['transform'] = _0x2ded55['stQVH'] + _0x483d41['rx'][_0x23ae83(0x193)](0x3) + _0x2ded55[_0x23ae83(0x118)], _0xa83473[_0x23ae83(0x151)]['transform'] = _0x2ded55['tKcks'](_0x2ded55['EOCQL'] + _0x483d41['ry'][_0x23ae83(0x193)](0x3), 'deg)');
                        const _0x14629d = _0x483d41['ry'] / _0x327384,
                            _0x3ae450 = _0x2ded55[_0x23ae83(0x7b)](_0x483d41['rx'], _0x327384),
                            _0x3bd0de = Math['cos'](_0x14629d),
                            _0x2b43c8 = Math['sin'](_0x14629d),
                            _0x5ca599 = Math[_0x23ae83(0xd2)](_0x3ae450),
                            _0x300148 = Math['sin'](_0x3ae450),
                            _0x17b687 = _0x1a9ded['R'];
                        for (let _0x277c6f = 0x0; _0x277c6f < _0x10f0a7; _0x277c6f++) {
                            const _0x5974c1 = _0x4001d6[_0x277c6f],
                                _0x68d384 = 0x1 + _0x1e2b80 * _0x5974c1['l'],
                                _0xeb99de = _0x2ded55['myUBy'](_0x5974c1['x'], _0x68d384),
                                _0x1947e1 = _0x2ded55['rgvMF'](_0x5974c1['y'], _0x68d384),
                                _0x153ff4 = _0x2ded55[_0x23ae83(0xb7)](_0x5974c1['z'], _0x68d384),
                                _0x34d276 = _0x2605d2[_0x277c6f];
                            _0x34d276[_0x23ae83(0x151)][_0x23ae83(0xfb)] = _0x2ded55['TNIxt'](_0x2ded55[_0x23ae83(0x162)](_0x2ded55['CiSuT'](_0x2ded55[_0x23ae83(0xe8)](_0x23ae83(0x1f1) + _0xeb99de[_0x23ae83(0x193)](0x2) + 'px,' + _0x1947e1[_0x23ae83(0x193)](0x2), _0x2ded55[_0x23ae83(0xf6)]) + _0x153ff4[_0x23ae83(0x193)](0x2), _0x2ded55[_0x23ae83(0xa1)]), _0x5974c1['ry'][_0x23ae83(0x193)](0x2)) + _0x2ded55[_0x23ae83(0x166)] + _0x5974c1['rx'][_0x23ae83(0x193)](0x2) + _0x2ded55[_0x23ae83(0x74)] + _0x5974c1['s'][_0x23ae83(0x193)](0x4), ')');
                            if (_0x2ded55[_0x23ae83(0x189)](_0x277c6f, _0x307514)) _0x34d276[_0x23ae83(0x151)]['opacity'] = '0';
                            else _0x34d276['style']['opacity'] = _0x5974c1['o'] < 0.999 ? _0x5974c1['o']['toFixed'](0x3) : '';
                            const _0x3e8712 = _0x2ded55[_0x23ae83(0x1b5)](-_0xeb99de, _0x2b43c8) + _0x2ded55[_0x23ae83(0x19d)](_0x153ff4, _0x3bd0de),
                                _0x2c04ac = _0x2ded55[_0x23ae83(0x19d)](_0x1947e1, _0x300148) + _0x3e8712 * _0x5ca599,
                                _0x696426 = _0x2ded55['DvNcu'](_0x581421, -_0x2c04ac / _0x17b687, 0x0, 0x1);
                            _0x34d276[_0x23ae83(0x151)]['setProperty'](_0x23ae83(0x10a), (_0x696426 * 0.8)['toFixed'](0x3));
                        }
                        _0x4da568();
                    }

                    function _0x284fa1() {
                        const _0xd87365 = _0x42af0f;
                        for (let _0x236394 = 0x0; _0x236394 < _0x8b5afc['length']; _0x236394++) {
                            if (_0x8b5afc[_0x236394][_0xd87365(0x13b)]() || _0x8b5afc[_0x236394][_0xd87365(0x18b)]() < 0x1) return !![];
                        }
                        return ![];
                    }

                    function _0x39bbae() {
                        const _0x418a3b = _0x42af0f;
                        if (_0x50e213 || !_0x5118c0['autoRotate'] || _0x5eefd4) return 0x0;
                        return _0x2ded55['FWget'](_0x24d1e9, 'heart') ? Math[_0x418a3b(0x1e1)](_0x2ded55[_0x418a3b(0xb7)](_0x5b73d0, 0.7)) * 0xe : 0x0;
                    }

                    function _0x19e504(_0x102674) {
                        const _0xe4dcea = _0x42af0f;
                        _0x5b73d0 += _0x102674;
                        let _0x4d4dd5 = _0x4b03e0['ifSbc'](!!_0x197960, !!_0x5e389f) || _0x4b03e0[_0xe4dcea(0x75)](_0x284fa1);
                        if (_0x4b03e0[_0xe4dcea(0x1b6)](!_0x197960, !_0x5e389f) && !_0x923bbf) {
                            if (_0x1d459b[_0x24d1e9]) {
                                const _0x990607 = _0x50e213 || !_0x5118c0[_0xe4dcea(0x1a4)] || _0x5eefd4 ? 0x0 : _0x5118c0['spinSpeed'] * _0x483d41['dir'];
                                _0x483d41['vy'] += (_0x990607 - _0x483d41['vy']) * (0x1 - Math['exp'](-_0x102674 * 1.1)), _0x483d41['ry'] += _0x483d41['vy'] * _0x102674;
                                if (Math['abs'](_0x483d41['vy']) > 0.01) _0x4d4dd5 = !![];
                            } else {
                                const _0x4f7a13 = _0x50e213 ? 0x3c : 0x28,
                                    _0x2e23dd = _0x50e213 ? 15.5 : 0x8,
                                    _0x129056 = _0x39bbae();
                                _0x483d41['vy'] += _0x4b03e0['VTtpb'](_0x4b03e0['gNuTF'](_0x4b03e0['VTtpb'](_0x4b03e0['Msowx'](_0x129056, _0x483d41['ry']), _0x4f7a13), _0x4b03e0['LcVwz'](_0x483d41['vy'], _0x2e23dd)), _0x102674), _0x483d41['ry'] += _0x4b03e0[_0xe4dcea(0x14b)](_0x483d41['vy'], _0x102674);
                                if (_0x4b03e0[_0xe4dcea(0x1a1)](Math['abs'](_0x483d41['vy']), 0.01) || Math[_0xe4dcea(0x86)](_0x129056 - _0x483d41['ry']) > 0.01 || _0x4b03e0[_0xe4dcea(0x1a8)](_0x129056, 0x0)) _0x4d4dd5 = !![];
                            }
                            const _0x435bb0 = _0x50e213 ? 0x3c : 0x1e,
                                _0x28e4f3 = _0x50e213 ? 15.5 : 0x8;
                            _0x483d41['vx'] += _0x4b03e0[_0xe4dcea(0x14b)](_0x4b03e0['gNuTF'](_0x4b03e0['VTtpb'](_0x3482b1[_0x24d1e9] - _0x483d41['rx'], _0x435bb0), _0x483d41['vx'] * _0x28e4f3), _0x102674), _0x483d41['rx'] += _0x4b03e0[_0xe4dcea(0x1ec)](_0x483d41['vx'], _0x102674);
                            if (_0x4b03e0[_0xe4dcea(0xef)](Math[_0xe4dcea(0x86)](_0x483d41['vx']), 0.01) || _0x4b03e0[_0xe4dcea(0xe0)](Math['abs'](_0x4b03e0[_0xe4dcea(0xba)](_0x3482b1[_0x24d1e9], _0x483d41['rx'])), 0.01)) _0x4d4dd5 = !![];
                        }
                        return _0x4d4dd5;
                    }

                    function _0x59005c(_0x34d6e8, _0x298ac6) {
                        const _0x405293 = _0x42af0f;
                        if (!_0x2ff1d6['isConnected']) {
                            _0x4b03e0[_0x405293(0x75)](_0x207498);
                            return;
                        }
                        const _0x3f29ab = _0x4b03e0[_0x405293(0x9a)](_0x19e504, Math[_0x405293(0xa2)](_0x4b03e0[_0x405293(0xaa)](_0x298ac6, 0x3e8), 0.05));
                        _0x4b03e0[_0x405293(0x1cb)](_0x35fc99);
                        if (!_0x3f29ab) _0x207498();
                    }

                    function _0x207498() {
                        const _0x489de5 = _0x42af0f;
                        if (!_0x4a0b97) return;
                        gsap[_0x489de5(0xd5)][_0x489de5(0xfe)](_0x59005c), _0x4a0b97 = ![];
                    }

                    function _0x1d2586() {
                        const _0x3cc183 = _0x42af0f;
                        if (_0x2ded55[_0x3cc183(0x171)](_0x4a0b97, !_0x1fb0a2) || document[_0x3cc183(0xe7)] || !_0x1a9ded) return;
                        gsap['ticker'][_0x3cc183(0x184)](_0x59005c), _0x4a0b97 = !![];
                    }

                    function _0xad9b19() {
                        const _0x39a312 = _0x42af0f;
                        _0x2ff1d6['dataset']['formation'] = _0x24d1e9, _0x3c11ac[_0x39a312(0xc5)](function(_0xc41dab) {
                            const _0x82ef11 = _0x39a312;
                            _0xc41dab[_0x82ef11(0x112)](_0x82ef11(0x19c), _0xc41dab[_0x82ef11(0x142)][_0x82ef11(0x195)] === _0x24d1e9 ? 'true' : _0x82ef11(0x1bb));
                        });
                    }

                    function _0x467e0c() {
                        const _0x4992b2 = _0x42af0f;
                        _0x8b5afc[_0x4992b2(0xc5)](function(_0x3bda32) {
                            const _0x3daacd = _0x4992b2;
                            _0x3bda32[_0x3daacd(0x8c)]();
                        }), _0x8b5afc = [];
                    }

                    function _0x2b20af(_0x2e9319) {
                        _0x467e0c(), _0x1a9ded[_0x2e9319]['forEach'](function(_0x19528a, _0x471fa) {
                            const _0x13d11c = _0x562b,
                                _0x5058d6 = {};
                            _0x5058d6['x'] = _0x19528a['x'], _0x5058d6['y'] = _0x19528a['y'], _0x5058d6['z'] = _0x19528a['z'], _0x5058d6['rx'] = _0x19528a['rx'], _0x5058d6['ry'] = _0x19528a['ry'], _0x5058d6['s'] = _0x19528a['s'], _0x5058d6['o'] = _0x19528a['o'], _0x5058d6['l'] = 0x0, Object[_0x13d11c(0x81)](_0x4001d6[_0x471fa], _0x5058d6);
                        });
                    }

                    function _0x2fd5f4(_0x43c6a9) {
                        const _0x92f87a = _0x42af0f;
                        if (!_0x1a9ded || _0x398113[_0x92f87a(0x104)](_0x43c6a9) < 0x0) return;
                        _0x2ded55['NhOfw'](_0x838a72, !![]);
                        const _0x5c9236 = _0x1d459b[_0x24d1e9];
                        _0x24d1e9 = _0x43c6a9, _0x2ded55['YxsOK'](_0xad9b19), _0x467e0c();
                        if (_0x5c9236 && !_0x1d459b[_0x43c6a9]) _0x483d41['ry'] = _0x2ded55[_0x92f87a(0x114)](_0x3d687c, _0x483d41['ry']);
                        const _0x19de09 = _0x1a9ded[_0x43c6a9];
                        if (_0x50e213) {
                            const _0x32211f = gsap['timeline'](),
                                _0x21f46c = {};
                            _0x21f46c['o'] = 0x0, _0x21f46c[_0x92f87a(0x8a)] = 0.18, _0x21f46c[_0x92f87a(0x7d)] = _0x2ded55[_0x92f87a(0xd0)], _0x32211f['to'](_0x4001d6, _0x21f46c)[_0x92f87a(0x184)](function() {
                                const _0x28308c = _0x92f87a,
                                    _0x28793a = _0x28308c(0x138)['split']('|');
                                let _0x48c1b5 = 0x0;
                                while (!![]) {
                                    switch (_0x28793a[_0x48c1b5++]) {
                                        case '0':
                                            _0x19de09['forEach'](function(_0xb5739f, _0x35e8fd) {
                                                const _0x4b790b = _0x28308c,
                                                    _0x31fb43 = {};
                                                _0x31fb43['x'] = _0xb5739f['x'], _0x31fb43['y'] = _0xb5739f['y'], _0x31fb43['z'] = _0xb5739f['z'], _0x31fb43['rx'] = _0xb5739f['rx'], _0x31fb43['ry'] = _0xb5739f['ry'], _0x31fb43['s'] = _0xb5739f['s'], _0x31fb43['o'] = 0x0, _0x31fb43['l'] = 0x0, Object[_0x4b790b(0x81)](_0x4001d6[_0x35e8fd], _0x31fb43);
                                            });
                                            continue;
                                        case '1':
                                            _0x483d41['vx'] = 0x0;
                                            continue;
                                        case '2':
                                            _0x483d41['rx'] = _0x3482b1[_0x43c6a9];
                                            continue;
                                        case '3':
                                            _0x483d41['vy'] = 0x0;
                                            continue;
                                        case '4':
                                            _0x483d41['ry'] = 0x0;
                                            continue;
                                    }
                                    break;
                                }
                            })['to'](_0x4001d6, {
                                'o': function(_0x3632e9) {
                                    return _0x19de09[_0x3632e9]['o'];
                                },
                                'duration': 0.3,
                                'ease': _0x2ded55[_0x92f87a(0x188)]
                            }), _0x8b5afc[_0x92f87a(0x18e)](_0x32211f), _0x1d2586();
                            return;
                        }
                        _0x19de09['forEach'](function(_0x267c84, _0x1903ac) {
                            const _0x11fdef = _0x92f87a,
                                _0x5c2bfc = _0x4001d6[_0x1903ac],
                                _0x207cb9 = _0x267c84['ry'] + 0x168 * Math[_0x11fdef(0x187)](_0x4b03e0['YwXfl'](_0x4b03e0['gNuTF'](_0x5c2bfc['ry'], _0x267c84['ry']), 0x168)),
                                _0x5b48c8 = _0x267c84['rx'] + 0x168 * Math[_0x11fdef(0x187)](_0x4b03e0['xuuBu'](_0x5c2bfc['rx'], _0x267c84['rx']) / 0x168),
                                _0x37a520 = _0x4b03e0['TsMps'](_0x5f0106, _0x1903ac) * _0x3c996e,
                                _0x4d4204 = {};
                            _0x4d4204['x'] = _0x267c84['x'], _0x4d4204['y'] = _0x267c84['y'], _0x4d4204['z'] = _0x267c84['z'], _0x4d4204['rx'] = _0x5b48c8, _0x4d4204['ry'] = _0x207cb9, _0x4d4204['s'] = _0x267c84['s'], _0x4d4204['o'] = _0x267c84['o'], _0x4d4204[_0x11fdef(0x8a)] = _0xe9f272, _0x4d4204['ease'] = _0x4b03e0['qqPvn'], _0x4d4204[_0x11fdef(0x1cc)] = _0x37a520, _0x8b5afc[_0x11fdef(0x18e)](gsap['to'](_0x5c2bfc, _0x4d4204)), _0x8b5afc['push'](gsap['to'](_0x5c2bfc, {
                                'keyframes': [{
                                    'l': 0x1,
                                    'duration': _0x4b03e0['VTtpb'](_0xe9f272, 0.45),
                                    'ease': 'sine.out'
                                }, {
                                    'l': 0x0,
                                    'duration': _0x4b03e0['LcVwz'](_0xe9f272, 0.55),
                                    'ease': _0x4b03e0[_0x11fdef(0x190)]
                                }],
                                'delay': _0x37a520
                            }));
                        }), _0x1d2586();
                    }

                    function _0x2c9826(_0x5d2457, _0x1ce25a) {
                        const _0x5a1516 = _0x42af0f;
                        if (_0x5e389f) _0x5e389f['kill']();
                        _0x5e389f = null;
                        let _0x1aa3fe = 0x0,
                            _0x2b56e2 = 0x0;
                        _0x1d459b[_0x24d1e9] && (_0x1aa3fe = -_0x4001d6[_0x5d2457]['ry'], _0x1aa3fe += 0x168 * Math['round']((_0x483d41['ry'] - _0x1aa3fe) / 0x168), _0x2b56e2 = _0x4b03e0[_0x5a1516(0x152)](_0x581421, _0x3d687c(-_0x4001d6[_0x5d2457]['rx']), -0x5a, 0x5a));
                        _0x483d41['vy'] = 0x0, _0x483d41['vx'] = 0x0;
                        const _0x2e0e97 = Math[_0x5a1516(0xf1)](_0x1aa3fe - _0x483d41['ry'], _0x2b56e2 - _0x483d41['rx']);
                        if (_0x50e213 || _0x4b03e0['LbVFh'](_0x2e0e97, 0.5)) {
                            const _0x31bca7 = '4|0|1|3|2' [_0x5a1516(0x10e)]('|');
                            let _0x549478 = 0x0;
                            while (!![]) {
                                switch (_0x31bca7[_0x549478++]) {
                                    case '0':
                                        _0x483d41['rx'] = _0x2b56e2;
                                        continue;
                                    case '1':
                                        _0x4b03e0['eGlpg'](_0x35fc99);
                                        continue;
                                    case '2':
                                        return;
                                    case '3':
                                        if (_0x1ce25a) _0x4b03e0[_0x5a1516(0x1cb)](_0x1ce25a);
                                        continue;
                                    case '4':
                                        _0x483d41['ry'] = _0x1aa3fe;
                                        continue;
                                }
                                break;
                            }
                        }
                        _0x5e389f = gsap['to'](_0x483d41, {
                            'ry': _0x1aa3fe,
                            'rx': _0x2b56e2,
                            'duration': _0x581421(_0x4b03e0['YwXfl'](_0x2e0e97, 0xa0), 0.25, 0.7),
                            'ease': _0x4b03e0[_0x5a1516(0x159)],
                            'onComplete': function() {
                                _0x5e389f = null;
                                if (_0x1ce25a) _0x1ce25a();
                            }
                        }), _0x1d2586();
                    }

                    function _0x365aeb(_0x3f6cdc) {
                        const _0x564b29 = _0x42af0f,
                            _0x465dc8 = _0x3f6cdc[_0x564b29(0xbc)](),
                            _0x1e0431 = _0x2ff1d6[_0x564b29(0xbc)]();
                        return {
                            'left': _0x4b03e0['RnWNl'](_0x465dc8['left'], _0x1e0431[_0x564b29(0x129)]),
                            'top': _0x465dc8['top'] - _0x1e0431['top'],
                            'width': _0x465dc8['width'],
                            'height': _0x465dc8[_0x564b29(0xcd)]
                        };
                    }

                    function _0x54b67b(_0x2db898) {
                        const _0x46f410 = _0x42af0f,
                            _0xbfc8aa = _0x2ff1d6['clientWidth'],
                            _0x46b147 = _0x2ff1d6['clientHeight'],
                            _0x20af89 = _0x581421(_0x2ded55[_0x46f410(0x103)](Math[_0x46f410(0xa2)](_0xbfc8aa, _0x46b147), 0.07), 0x10, 0x40),
                            _0x43a808 = _0x2db898[_0x46f410(0x10d)] || 0x1,
                            _0x1d50c3 = _0x2db898[_0x46f410(0x137)] || 0x1;
                        let _0x156164 = _0x2ded55[_0x46f410(0xb2)](_0xbfc8aa, _0x20af89 * 0x2),
                            _0x3a3736 = _0x2ded55[_0x46f410(0x8b)](_0x2ded55['LVADb'](_0x156164, _0x1d50c3), _0x43a808);
                        _0x2ded55['myoyb'](_0x3a3736, _0x46b147 - _0x2ded55[_0x46f410(0x103)](_0x20af89, 0x2)) && (_0x3a3736 = _0x46b147 - _0x2ded55[_0x46f410(0xc1)](_0x20af89, 0x2), _0x156164 = _0x2ded55[_0x46f410(0x17d)](_0x3a3736 * _0x43a808, _0x1d50c3));
                        const _0x4b4d74 = Math[_0x46f410(0xa2)](0x1, _0x2ded55['CWUNp'](_0x2ded55[_0x46f410(0xb9)](_0x43a808, 0x2), _0x156164));
                        return _0x156164 *= _0x4b4d74, _0x3a3736 *= _0x4b4d74, {
                            'left': _0x2ded55[_0x46f410(0x7b)](_0xbfc8aa - _0x156164, 0x2),
                            'top': _0x2ded55[_0x46f410(0xa3)](_0x46b147, _0x3a3736) / 0x2,
                            'width': _0x156164,
                            'height': _0x3a3736
                        };
                    }

                    function _0x86a32b(_0x19f08c) {
                        const _0x3e1024 = _0x42af0f;
                        if (!_0x5118c0['enlarge'] || _0x923bbf || !_0x1a9ded || _0x284fa1() || !(_0x19f08c >= 0x0 && _0x4b03e0['SqpMz'](_0x19f08c, _0x10f0a7))) return;
                        const _0x139130 = _0x2605d2[_0x19f08c],
                            _0x7c755a = _0x139130[_0x3e1024(0x12e)](_0x4b03e0['ZsLXk']);
                        if (!_0x26ad7f[_0x19f08c]) return;
                        const _0x1f5466 = _0x4b03e0['kjASA'](_0x18ee0f, _0x7c755a);
                        _0x197960 = null, _0x2e5e4c['classList']['remove'](_0x4b03e0[_0x3e1024(0xa0)]);
                        const _0xc54b70 = {};
                        _0xc54b70['index'] = _0x19f08c, _0xc54b70['img'] = _0x7c755a, _0xc54b70[_0x3e1024(0x1ca)] = _0x1f5466, _0xc54b70['tweens'] = [], _0xc54b70['el'] = null, _0xc54b70[_0x3e1024(0x1e5)] = null, _0x923bbf = _0xc54b70;
                        const _0x4f9f8c = _0x923bbf;
                        _0x4b03e0[_0x3e1024(0xab)](_0x2c9826, _0x19f08c, function() {
                            if (_0x923bbf === _0x4f9f8c) _0x4b03e0['lAzrA'](_0xe22bb3, _0x4f9f8c);
                        });
                    }

                    function _0x228929(_0x43b15e) {
                        const _0x3a5a76 = _0x42af0f;
                        if (_0x43b15e['alt']) return _0x43b15e['alt'];
                        const _0x5ae380 = _0x43b15e['getAttribute']('src');
                        for (let _0xcc3f4 = 0x0; _0x4b03e0['tICiH'](_0xcc3f4, _0x10f0a7); _0xcc3f4++) {
                            const _0x55da65 = _0x2605d2[_0xcc3f4][_0x3a5a76(0x12e)](_0x3a5a76(0xf3));
                            if (_0x55da65 && _0x55da65[_0x3a5a76(0xe2)] && _0x55da65[_0x3a5a76(0x91)](_0x4b03e0['XFfHJ']) === _0x5ae380) return _0x55da65[_0x3a5a76(0xe2)];
                        }
                        return _0x4b03e0['zHOPJ'];
                    }

                    function _0x18ee0f(_0x214875) {
                        const _0x8a2f93 = _0x42af0f;
                        if (!_0x214875['dataset'][_0x8a2f93(0x1ca)]) return null;
                        const _0x1306b6 = new Image();
                        return _0x1306b6[_0x8a2f93(0x1af)] = _0x4b03e0['ZqIOs'], _0x1306b6[_0x8a2f93(0x105)] = _0x214875[_0x8a2f93(0x142)]['full'], _0x1306b6;
                    }

                    function _0x2114d2(_0x6c3ad, _0x1b32eb) {
                        const _0x483fa3 = _0x42af0f,
                            _0x3ec927 = {
                                'jtKQO': function(_0x575360, _0x181cc2) {
                                    const _0x241b84 = _0x562b;
                                    return _0x2ded55[_0x241b84(0x1b7)](_0x575360, _0x181cc2);
                                },
                                'QKkXI': function(_0x446331, _0x372a37) {
                                    return _0x446331 !== _0x372a37;
                                },
                                'wDphS': _0x2ded55['BLmbr'],
                                'yhTOC': _0x2ded55[_0x483fa3(0x1d7)]
                            };
                        if (!_0x1b32eb || _0x1b32eb[_0x483fa3(0x102)] && _0x1b32eb[_0x483fa3(0x10d)] && _0x2ded55[_0x483fa3(0x148)](_0x6c3ad['source'], _0x1b32eb)) return;
                        _0x1b32eb['decode']()['then'](function() {
                            const _0x58fbfe = _0x483fa3;
                            if (_0x3ec927['jtKQO'](_0x923bbf, _0x6c3ad) || _0x6c3ad[_0x58fbfe(0x185)] || _0x3ec927[_0x58fbfe(0x76)](_0x6c3ad['full'], _0x1b32eb) || !_0x1b32eb[_0x58fbfe(0x10d)]) return;
                            _0x6c3ad[_0x58fbfe(0x1e5)][_0x58fbfe(0x105)] = _0x1b32eb['src'], _0x6c3ad['source'] = _0x1b32eb;
                            const _0x3fa178 = _0x54b67b(_0x1b32eb),
                                _0x17ceb3 = {};
                            _0x17ceb3['duration'] = 0.6, _0x17ceb3['ease'] = _0x3ec927[_0x58fbfe(0x9d)], _0x17ceb3['overwrite'] = _0x3ec927[_0x58fbfe(0x165)];
                            if (_0x50e213) gsap['set'](_0x6c3ad[_0x58fbfe(0x1e5)], _0x3fa178);
                            else _0x6c3ad['tweens']['push'](gsap['to'](_0x6c3ad[_0x58fbfe(0x1e5)], Object[_0x58fbfe(0x81)](_0x17ceb3, _0x3fa178)));
                        }, function() {});
                    }

                    function _0x53418b(_0x55dcdd) {
                        const _0x1646f9 = _0x42af0f,
                            _0x29760d = _0x923bbf;
                        if (!_0x29760d || !_0x29760d['el'] || _0x29760d['closing']) return;
                        let _0x1200b5 = _0x29760d[_0x1646f9(0xf5)];
                        for (let _0x281aa5 = 0x0; _0x281aa5 < _0x10f0a7; _0x281aa5++) {
                            _0x1200b5 = _0x4b03e0[_0x1646f9(0x7f)](_0x1200b5 + _0x55dcdd + _0x10f0a7, _0x10f0a7);
                            if (_0x26ad7f[_0x1200b5] && _0x2605d2[_0x1200b5]['querySelector']('img')['alt']) break;
                        }
                        if (_0x4b03e0['LjbdE'](_0x1200b5, _0x29760d['index'])) return;
                        const _0x1510b7 = _0x2605d2[_0x1200b5]['querySelector']('img');
                        _0x29760d[_0x1646f9(0x1d4)][_0x1646f9(0xc5)](function(_0x2c8229) {
                            _0x2c8229['kill']();
                        }), _0x29760d['tweens'] = [], _0x29760d['index'] = _0x1200b5, _0x29760d[_0x1646f9(0xf3)] = _0x1510b7, _0x29760d[_0x1646f9(0x1ca)] = _0x18ee0f(_0x1510b7);
                        const _0x4070ea = _0x29760d['full'] && _0x29760d[_0x1646f9(0x1ca)]['complete'] && _0x29760d[_0x1646f9(0x1ca)]['naturalWidth'] > 0x0;
                        _0x29760d[_0x1646f9(0xea)] = _0x4070ea ? _0x29760d[_0x1646f9(0x1ca)] : _0x1510b7, _0x29760d['photo'][_0x1646f9(0x105)] = _0x4070ea ? _0x29760d[_0x1646f9(0x1ca)][_0x1646f9(0x105)] : _0x1510b7['currentSrc'] || _0x1510b7['src'], _0x29760d['photo'][_0x1646f9(0xe2)] = _0x228929(_0x1510b7), _0x29760d['el']['setAttribute'](_0x4b03e0[_0x1646f9(0x89)], _0x228929(_0x1510b7)), _0x307514 = _0x1200b5;
                        const _0x177906 = _0x54b67b(_0x29760d[_0x1646f9(0xea)]);
                        if (_0x50e213) gsap[_0x1646f9(0x8f)](_0x29760d[_0x1646f9(0x1e5)], _0x177906);
                        else {
                            const _0xdc2c4b = {};
                            _0xdc2c4b[_0x1646f9(0x8a)] = 0.45, _0xdc2c4b['ease'] = _0x4b03e0['HyTpC'];
                            const _0x4336cf = {};
                            _0x4336cf[_0x1646f9(0x71)] = 0x0, _0x4336cf['x'] = _0x55dcdd * 0x28;
                            const _0x2dd047 = {};
                            _0x2dd047[_0x1646f9(0x71)] = 0x1, _0x2dd047['x'] = 0x0, _0x2dd047[_0x1646f9(0x8a)] = 0.4, _0x2dd047[_0x1646f9(0x7d)] = 'power2.out', _0x29760d[_0x1646f9(0x1d4)]['push'](gsap['to'](_0x29760d['photo'], Object[_0x1646f9(0x81)](_0xdc2c4b, _0x177906)), gsap[_0x1646f9(0x139)](_0x29760d['photo'], _0x4336cf, _0x2dd047));
                        }
                        _0x4b03e0['EMOJm'](_0x2114d2, _0x29760d, _0x29760d[_0x1646f9(0x1ca)]), _0x2c9826(_0x1200b5);
                        const _0x1fd11c = {};
                        _0x1fd11c[_0x1646f9(0xf5)] = _0x1200b5, _0x1fd11c[_0x1646f9(0x9f)] = _0x2605d2[_0x1200b5];
                        const _0x4d5479 = {};
                        _0x4d5479['detail'] = _0x1fd11c, _0x2ff1d6['dispatchEvent'](new CustomEvent(_0x4b03e0['ALvGs'], _0x4d5479));
                    }

                    function _0xe22bb3(_0x21959f) {
                        const _0x3b28a5 = _0x42af0f,
                            _0xb8911e = _0x2605d2[_0x21959f[_0x3b28a5(0xf5)]],
                            _0x25617b = _0x365aeb(_0xb8911e),
                            _0x17af8f = document['createElement'](_0x3b28a5(0x1e8));
                        _0x17af8f['className'] = _0x3b28a5(0x10b), _0x17af8f['setAttribute'](_0x4b03e0[_0x3b28a5(0x99)], _0x4b03e0[_0x3b28a5(0x135)]), _0x17af8f[_0x3b28a5(0x112)](_0x3b28a5(0xe6), _0x4b03e0[_0x3b28a5(0x16b)]), _0x17af8f[_0x3b28a5(0x112)](_0x4b03e0['NSvIq'], _0x4b03e0[_0x3b28a5(0x9a)](_0x228929, _0x21959f[_0x3b28a5(0xf3)]));
                        const _0x2f77e5 = document['createElement'](_0x4b03e0[_0x3b28a5(0x19a)]);
                        _0x2f77e5[_0x3b28a5(0x14f)] = _0x4b03e0[_0x3b28a5(0x15c)];
                        const _0x1049b6 = document['createElement']('img');
                        _0x1049b6['className'] = 'photo-sphere__photo', _0x1049b6['alt'] = _0x228929(_0x21959f[_0x3b28a5(0xf3)]), _0x1049b6[_0x3b28a5(0x191)] = ![];
                        const _0x25f58a = document[_0x3b28a5(0x16f)](_0x3b28a5(0x1eb));
                        _0x25f58a['type'] = _0x3b28a5(0x1eb), _0x25f58a['className'] = _0x3b28a5(0x126), _0x25f58a[_0x3b28a5(0x112)](_0x4b03e0['NSvIq'], _0x4b03e0[_0x3b28a5(0x1e0)]), _0x25f58a['innerHTML'] = _0x4b03e0['YTtMi'], _0x17af8f['append'](_0x2f77e5, _0x1049b6, _0x25f58a);
                        const _0x46b877 = _0x21959f['full'] && _0x21959f[_0x3b28a5(0x1ca)][_0x3b28a5(0x102)] && _0x21959f[_0x3b28a5(0x1ca)][_0x3b28a5(0x10d)] > 0x0,
                            _0x2e6a3e = _0x46b877 ? _0x21959f[_0x3b28a5(0x1ca)] : _0x21959f[_0x3b28a5(0xf3)];
                        _0x1049b6['src'] = _0x46b877 ? _0x21959f['full'][_0x3b28a5(0x105)] : _0x21959f[_0x3b28a5(0xf3)]['currentSrc'] || _0x21959f['img'][_0x3b28a5(0x105)], _0x21959f['el'] = _0x17af8f, _0x21959f['photo'] = _0x1049b6, _0x21959f[_0x3b28a5(0xea)] = _0x2e6a3e, gsap[_0x3b28a5(0x8f)](_0x1049b6, _0x25617b), _0x2ff1d6[_0x3b28a5(0xcf)](_0x17af8f), _0x307514 = _0x21959f['index'], _0x35fc99();
                        const _0x4200a5 = {};
                        _0x4200a5[_0x3b28a5(0x17a)] = !![], _0x25f58a['focus'](_0x4200a5);
                        const _0x7788ab = _0x4b03e0['LtlHj'](_0x54b67b, _0x2e6a3e);
                        if (_0x50e213) {
                            gsap['set'](_0x1049b6, _0x7788ab);
                            const _0x5dbeca = {};
                            _0x5dbeca[_0x3b28a5(0x71)] = 0x0, _0x5dbeca[_0x3b28a5(0x8a)] = 0.2, _0x5dbeca[_0x3b28a5(0x7d)] = 'power1.out', _0x21959f[_0x3b28a5(0x1d4)]['push'](gsap['from'](_0x17af8f, _0x5dbeca));
                        } else {
                            const _0x417330 = {};
                            _0x417330['opacity'] = 0x0, _0x417330['duration'] = 0.45, _0x417330['ease'] = 'power1.out';
                            const _0x2a06be = {};
                            _0x2a06be[_0x3b28a5(0x8a)] = _0x3d1d30, _0x2a06be['ease'] = _0x4b03e0['qWHKa'];
                            const _0x19d090 = {};
                            _0x19d090[_0x3b28a5(0x71)] = 0x0, _0x19d090['scale'] = 0.8, _0x19d090[_0x3b28a5(0x8a)] = 0.35, _0x19d090[_0x3b28a5(0x1cc)] = 0.25, _0x19d090[_0x3b28a5(0x7d)] = _0x3b28a5(0x168), _0x21959f[_0x3b28a5(0x1d4)][_0x3b28a5(0x18e)](gsap['from'](_0x2f77e5, _0x417330), gsap['to'](_0x1049b6, Object[_0x3b28a5(0x81)](_0x2a06be, _0x7788ab)), gsap['from'](_0x25f58a, _0x19d090));
                        }
                        _0x2114d2(_0x21959f, _0x21959f['full']);
                        const _0x11d553 = {};
                        _0x11d553['index'] = _0x21959f['index'], _0x11d553[_0x3b28a5(0x9f)] = _0xb8911e;
                        const _0x138a5d = {};
                        _0x138a5d['detail'] = _0x11d553, _0x2ff1d6['dispatchEvent'](new CustomEvent(_0x4b03e0['ALvGs'], _0x138a5d));
                    }

                    function _0x838a72(_0x300aa8) {
                        const _0x109c0b = _0x42af0f,
                            _0xc169f5 = _0x923bbf;
                        if (!_0xc169f5 || _0xc169f5['closing']) return;
                        _0xc169f5['closing'] = !![];
                        _0x5e389f && (_0x5e389f[_0x109c0b(0x8c)](), _0x5e389f = null);
                        _0xc169f5[_0x109c0b(0x1d4)][_0x109c0b(0xc5)](function(_0x3411ea) {
                            _0x3411ea['kill']();
                        });
                        const _0x52a55d = function() {
                            const _0x504f24 = _0x109c0b,
                                _0x33ac5e = '2|1|3|4|6|5|0' ['split']('|');
                            let _0x314472 = 0x0;
                            while (!![]) {
                                switch (_0x33ac5e[_0x314472++]) {
                                    case '0':
                                        _0x1d2586();
                                        continue;
                                    case '1':
                                        if (_0x923bbf !== _0xc169f5) return;
                                        continue;
                                    case '2':
                                        if (_0xc169f5['el']) _0xc169f5['el'][_0x504f24(0xfe)]();
                                        continue;
                                    case '3':
                                        _0x923bbf = null;
                                        continue;
                                    case '4':
                                        _0x307514 = -0x1;
                                        continue;
                                    case '5':
                                        if (_0xc169f5['el']) {
                                            const _0x22713c = {};
                                            _0x22713c['index'] = _0xc169f5['index'], _0x22713c['card'] = _0x2605d2[_0xc169f5[_0x504f24(0xf5)]];
                                            const _0x40bd25 = {};
                                            _0x40bd25[_0x504f24(0x19b)] = _0x22713c, _0x2ff1d6['dispatchEvent'](new CustomEvent(_0x4b03e0[_0x504f24(0xca)], _0x40bd25));
                                            const _0x2f3cf3 = {};
                                            _0x2f3cf3[_0x504f24(0x17a)] = !![];
                                            if (!_0x300aa8) _0x2e5e4c['focus'](_0x2f3cf3);
                                        }
                                        continue;
                                    case '6':
                                        _0x4b03e0['Pyisd'](_0x35fc99);
                                        continue;
                                }
                                break;
                            }
                        };
                        if (!_0xc169f5['el'] || _0x300aa8) {
                            _0x4b03e0['jlfbB'](_0x52a55d);
                            return;
                        }
                        if (_0x50e213) {
                            const _0x1ff066 = {};
                            _0x1ff066['opacity'] = 0x0, _0x1ff066['duration'] = 0.2, _0x1ff066['ease'] = _0x109c0b(0x120), _0x1ff066[_0x109c0b(0x1d5)] = _0x52a55d, gsap['to'](_0xc169f5['el'], _0x1ff066);
                            return;
                        }
                        const _0x4de72b = _0x365aeb(_0x2605d2[_0xc169f5[_0x109c0b(0xf5)]]),
                            _0x3f3fbe = {};
                        _0x3f3fbe[_0x109c0b(0x71)] = 0x0, _0x3f3fbe['duration'] = _0xb46f38, _0x3f3fbe['ease'] = _0x4b03e0[_0x109c0b(0x1c1)], gsap['to'](_0xc169f5['el'][_0x109c0b(0x12e)]('.photo-sphere__backdrop'), _0x3f3fbe);
                        const _0xf867fc = {};
                        _0xf867fc['opacity'] = 0x0, _0xf867fc['duration'] = 0.15, gsap['to'](_0xc169f5['el']['querySelector'](_0x4b03e0[_0x109c0b(0x1b9)]), _0xf867fc);
                        const _0x4a932c = {};
                        _0x4a932c[_0x109c0b(0x8a)] = _0xb46f38, _0x4a932c[_0x109c0b(0x7d)] = _0x109c0b(0x13d), _0x4a932c['onComplete'] = _0x52a55d, gsap['to'](_0xc169f5[_0x109c0b(0x1e5)], Object[_0x109c0b(0x81)](_0x4a932c, _0x4de72b));
                    }
                    const _0x26ad7f = _0x2605d2[_0x42af0f(0x1cf)](function(_0x1848a0) {
                            const _0x1f2ce8 = _0x42af0f,
                                _0x1caaab = _0x5118c0['enlarge'] && !!_0x1848a0['querySelector'](_0x2ded55[_0x1f2ce8(0x14e)]) && !_0x1848a0[_0x1f2ce8(0x12e)]('a');
                            if (_0x1caaab) _0x1848a0['classList'][_0x1f2ce8(0x184)](_0x2ded55[_0x1f2ce8(0xe9)]);
                            return _0x1caaab;
                        }),
                        _0x18bc9f = _0x2605d2['map'](function(_0x421569) {
                            return _0x421569['getBoundingClientRect']();
                        }),
                        _0x578b86 = _0x2605d2['map'](function(_0x35aa0d) {
                            const _0x37a82c = _0x42af0f;
                            return _0x35aa0d[_0x37a82c(0x91)]('style');
                        });
                    _0x2ff1d6[_0x42af0f(0xb8)]['add'](_0x2ded55[_0x42af0f(0xd7)]), _0x5ee3d5();
                    const _0x7ce229 = _0x2e5e4c['getBoundingClientRect'](),
                        _0x5b28f6 = _0x2ded55[_0x42af0f(0x140)](_0x7ce229['left'], _0x2ded55['JhEfT'](_0x7ce229[_0x42af0f(0x108)], 0x2)),
                        _0x383251 = _0x7ce229[_0x42af0f(0x16e)] + _0x2ded55['WtOKo'](_0x7ce229['height'], 0x2);
                    if (_0x5118c0[_0x42af0f(0x197)] && !_0x50e213) {
                        const _0x4887db = '3|2|0|4|1' [_0x42af0f(0x10e)]('|');
                        let _0x5ee596 = 0x0;
                        while (!![]) {
                            switch (_0x4887db[_0x5ee596++]) {
                                case '0':
                                    _0x35fc99();
                                    continue;
                                case '1':
                                    _0x8b5afc[_0x42af0f(0x18e)](gsap[_0x42af0f(0x18c)](0.35, function() {
                                        const _0x430374 = _0x42af0f;
                                        _0x4b03e0[_0x430374(0x1c5)](_0x2fd5f4, _0x24d1e9);
                                    }));
                                    continue;
                                case '2':
                                    _0x483d41['rx'] = 0x0;
                                    continue;
                                case '3':
                                    _0x18bc9f[_0x42af0f(0xc5)](function(_0x1a1334, _0x345acf) {
                                        const _0x30d1ab = _0x42af0f;
                                        Object['assign'](_0x4001d6[_0x345acf], {
                                            'x': _0x1a1334['left'] + _0x1a1334[_0x30d1ab(0x108)] / 0x2 - _0x5b28f6,
                                            'y': _0x4b03e0['UalUE'](_0x1a1334[_0x30d1ab(0x16e)], _0x4b03e0[_0x30d1ab(0xa4)](_0x1a1334['height'], 0x2)) - _0x383251,
                                            'z': 0x0,
                                            'rx': 0x0,
                                            'ry': 0x0,
                                            's': _0x1a1334['width'] / _0x1a9ded[_0x30d1ab(0x79)],
                                            'o': 0x1,
                                            'l': 0x0
                                        });
                                    });
                                    continue;
                                case '4':
                                    _0x2ded55[_0x42af0f(0xb6)](_0xad9b19);
                                    continue;
                            }
                            break;
                        }
                    } else _0x2ded55['lZvuH'](_0x2b20af, _0x24d1e9), _0x483d41['rx'] = _0x3482b1[_0x24d1e9], _0x2ded55['cDotn'](_0xad9b19), _0x2ded55['dUEqN'](_0x35fc99);
                    _0x2ded55[_0x42af0f(0x11e)](_0x1d2586), _0x3c11ac[_0x42af0f(0xc5)](function(_0x5c000f) {
                        const _0x539f03 = _0x42af0f;
                        _0x4b03e0[_0x539f03(0x12f)](_0x7b6f41, _0x5c000f, _0x539f03(0x101), function() {
                            const _0x4b1c9f = _0x539f03;
                            _0x2fd5f4(_0x5c000f['dataset'][_0x4b1c9f(0x195)]);
                        });
                    }), _0x2ded55['veczq'](_0x7b6f41, _0x2e5e4c, _0x2ded55[_0x42af0f(0x1e4)], function(_0x5e921c) {
                        const _0x396b5e = _0x42af0f,
                            _0x385bf5 = _0x396b5e(0x119)['split']('|');
                        let _0x4333fc = 0x0;
                        while (!![]) {
                            switch (_0x385bf5[_0x4333fc++]) {
                                case '0':
                                    _0x1d2586();
                                    continue;
                                case '1':
                                    if (_0x1d459b[_0x24d1e9]) _0x483d41['vy'] = 0x0;
                                    continue;
                                case '2':
                                    if (_0x4b03e0['JkVnG'](_0x5e921c[_0x396b5e(0x1eb)], 0x0)) return;
                                    continue;
                                case '3':
                                    _0x197960 = {
                                        'id': _0x5e921c[_0x396b5e(0x1e3)],
                                        'startX': _0x5e921c[_0x396b5e(0xd9)],
                                        'startY': _0x5e921c[_0x396b5e(0x94)],
                                        'lastX': _0x5e921c[_0x396b5e(0xd9)],
                                        'lastY': _0x5e921c[_0x396b5e(0x94)],
                                        'lastT': performance['now'](),
                                        'vy': 0x0,
                                        'vx': 0x0,
                                        'moved': ![]
                                    };
                                    continue;
                                case '4':
                                    _0x483d41['vx'] = 0x0;
                                    continue;
                            }
                            break;
                        }
                    }), _0x7b6f41(_0x2e5e4c, 'pointermove', function(_0x35112e) {
                        const _0x26faf7 = _0x42af0f;
                        if (!_0x197960 || _0x2ded55[_0x26faf7(0x1b7)](_0x35112e[_0x26faf7(0x1e3)], _0x197960['id'])) return;
                        if (!_0x197960['moved']) {
                            if (Math['hypot'](_0x2ded55[_0x26faf7(0xff)](_0x35112e['clientX'], _0x197960['startX']), _0x35112e['clientY'] - _0x197960['startY']) < 0x4) return;
                            _0x197960[_0x26faf7(0x115)] = !![], _0x2e5e4c[_0x26faf7(0xb8)][_0x26faf7(0x184)](_0x2ded55[_0x26faf7(0x182)]);
                            try {
                                _0x2e5e4c['setPointerCapture'](_0x35112e[_0x26faf7(0x1e3)]);
                            } catch (_0x297cd9) {}
                        }
                        const _0x2ec86a = performance[_0x26faf7(0x11a)](),
                            _0x5be693 = _0x2ded55['jkhuX'](Math['max'](0x1, _0x2ded55[_0x26faf7(0xcb)](_0x2ec86a, _0x197960[_0x26faf7(0x154)])), 0x3e8),
                            _0x96eea6 = _0x2ded55['RCWPz'](_0x35112e[_0x26faf7(0xd9)], _0x197960[_0x26faf7(0x1d1)]) * _0x3f11a8,
                            _0x3dae59 = _0x2ded55['rgvMF']((_0x35112e[_0x26faf7(0x94)] - _0x197960['lastY']) * _0x3f11a8, 0.8);
                        _0x197960['lastX'] = _0x35112e['clientX'], _0x197960['lastY'] = _0x35112e['clientY'], _0x197960[_0x26faf7(0x154)] = _0x2ec86a;
                        const _0x5f06f8 = _0x483d41['ry'];
                        _0x483d41['ry'] += _0x96eea6, !_0x1d459b[_0x24d1e9] && (_0x483d41['ry'] = _0x2ded55[_0x26faf7(0x125)](_0x581421, _0x483d41['ry'], Math[_0x26faf7(0xa2)](-_0x5948b1, _0x5f06f8), Math['max'](_0x5948b1, _0x5f06f8))), _0x483d41['rx'] = _0x581421(_0x483d41['rx'] - _0x3dae59, -_0xd3c0e7, _0xd3c0e7), _0x197960['vy'] = _0x2ded55['tKcks'](_0x2ded55[_0x26faf7(0x1b5)](_0x197960['vy'], 0.5), _0x2ded55[_0x26faf7(0x103)](_0x96eea6 / _0x5be693, 0.5)), _0x197960['vx'] = _0x2ded55['EixdA'](_0x197960['vx'], 0.5) + _0x2ded55['IItlN'](-_0x3dae59, _0x5be693) * 0.5, _0x1d2586();
                    });

                    function _0x539242(_0x8a8ff7) {
                        const _0x50ab6b = _0x42af0f;
                        if (!_0x197960 || _0x8a8ff7 && _0x8a8ff7['pointerId'] !== _0x197960['id']) return;
                        const _0x27582d = _0x197960;
                        _0x197960 = null, _0x2e5e4c[_0x50ab6b(0xb8)]['remove']('is-dragging');
                        if (!_0x27582d[_0x50ab6b(0x115)]) return;
                        _0x34c841 = !![], _0x4b03e0[_0x50ab6b(0x9e)](setTimeout, function() {
                            _0x34c841 = ![];
                        }, 0x0);
                        const _0x427e3f = _0x4b03e0['BFUMW'](performance[_0x50ab6b(0x11a)](), _0x27582d['lastT']) > 0x5a;
                        if (!_0x50e213 && !_0x427e3f) {
                            _0x483d41['vy'] = _0x4b03e0[_0x50ab6b(0x173)](_0x581421, _0x27582d['vy'], -_0x21ab7a, _0x21ab7a), _0x483d41['vx'] = _0x4b03e0[_0x50ab6b(0xbb)](_0x581421, _0x27582d['vx'], -_0x21ab7a, _0x21ab7a) * 0.5;
                            if (Math[_0x50ab6b(0x86)](_0x483d41['vy']) > _0x5118c0['spinSpeed']) _0x483d41[_0x50ab6b(0x1ab)] = _0x483d41['vy'] > 0x0 ? 0x1 : -0x1;
                        } else _0x483d41['vy'] = 0x0, _0x483d41['vx'] = 0x0;
                        _0x4b03e0['vkvFB'](_0x1d2586);
                    }
                    _0x2ded55[_0x42af0f(0x1c4)](_0x7b6f41, _0x2e5e4c, _0x42af0f(0xec), _0x539242), _0x7b6f41(_0x2e5e4c, _0x42af0f(0xf9), _0x539242), _0x7b6f41(_0x2e5e4c, 'lostpointercapture', _0x539242), _0x2ded55['wLAMV'](_0x7b6f41, _0x2e5e4c, 'click', function(_0x5d30f0) {
                        const _0x381f96 = _0x42af0f;
                        _0x34c841 && (_0x5d30f0['preventDefault'](), _0x5d30f0[_0x381f96(0xb0)]());
                    }, !![]), _0x7b6f41(_0x2e5e4c, _0x2ded55['ERIGe'], function(_0x581f46) {
                        const _0x3690e7 = _0x42af0f;
                        _0x581f46[_0x3690e7(0x17c)]();
                    }), _0x2ded55[_0x42af0f(0x1c4)](_0x7b6f41, _0x2e5e4c, _0x42af0f(0x101), function(_0x4bd45d) {
                        const _0x53c76f = _0x42af0f;
                        if (_0x34c841 || !_0x5118c0['enlarge']) return;
                        const _0x4028ee = _0x4bd45d[_0x53c76f(0xda)]['closest'](_0x4b03e0['zhaJT']);
                        if (!_0x4028ee) return;
                        _0x4b03e0[_0x53c76f(0x9a)](_0x86a32b, _0x2605d2['indexOf'](_0x4028ee));
                    }), _0x2ded55['oikKE'](_0x7b6f41, _0x2e5e4c, _0x2ded55[_0x42af0f(0x7e)], function() {
                        if (!_0x2e5e4c['matches'](':focus-visible')) return;
                        _0x5eefd4 = !![], _0x35fc99(), _0x1d2586();
                    }), _0x7b6f41(_0x2e5e4c, _0x2ded55[_0x42af0f(0x16a)], function() {
                        const _0x4fbd16 = _0x42af0f;
                        _0x5eefd4 = ![], _0x2ded55[_0x4fbd16(0x111)](_0x35fc99), _0x2ded55['zWAEX'](_0x1d2586);
                    }), _0x7b6f41(_0x2ff1d6, _0x42af0f(0x101), function(_0x1b6d4c) {
                        const _0x47b316 = _0x42af0f;
                        if (_0x923bbf && _0x923bbf['el'] && _0x923bbf['el'][_0x47b316(0x1da)](_0x1b6d4c[_0x47b316(0xda)])) _0x2ded55['NhOfw'](_0x838a72, ![]);
                    }), _0x2ded55[_0x42af0f(0x156)](_0x7b6f41, _0x2ff1d6, _0x2ded55['aUUjx'], function(_0x27b29e) {
                        const _0x394d9b = _0x42af0f;
                        if (!_0x923bbf || !_0x923bbf['el']) return;
                        if (_0x2ded55['ZXJrK'](_0x27b29e['key'], 'Escape')) _0x27b29e['preventDefault'](), _0x2ded55[_0x394d9b(0x1be)](_0x838a72, ![]);
                        else {
                            if (_0x27b29e[_0x394d9b(0xfc)] === _0x394d9b(0x1bf)) _0x27b29e[_0x394d9b(0x17c)](), _0x923bbf['el'][_0x394d9b(0x12e)]('.photo-sphere__close')[_0x394d9b(0x141)]();
                            else(_0x27b29e['key'] === 'ArrowLeft' || _0x27b29e['key'] === _0x2ded55['JXGZu']) && (_0x27b29e['preventDefault'](), _0x53418b(_0x2ded55['ZXJrK'](_0x27b29e['key'], _0x2ded55['JXGZu']) ? 0x1 : -0x1));
                        }
                    }), _0x7b6f41(_0x2e5e4c, _0x42af0f(0x180), function(_0x1190da) {
                        const _0x309745 = _0x42af0f;
                        if ((_0x1190da[_0x309745(0xfc)] === _0x2ded55[_0x309745(0x82)] || _0x1190da['key'] === '\x20') && _0x5118c0['enlarge']) {
                            _0x1190da[_0x309745(0x17c)]();
                            if (!_0x1190da['repeat']) _0x2ded55['NhOfw'](_0x86a32b, _0xf4dfd6());
                            return;
                        }
                        const _0x124590 = {};
                        _0x124590[_0x309745(0xdb)] = -0x1, _0x124590['ArrowRight'] = 0x1;
                        const _0x1bdf16 = _0x124590[_0x1190da['key']],
                            _0x55d48c = {};
                        _0x55d48c['ArrowUp'] = 0x1, _0x55d48c['ArrowDown'] = -0x1;
                        const _0x3ab037 = _0x55d48c[_0x1190da[_0x309745(0xfc)]];
                        if (!_0x1bdf16 && !_0x3ab037) return;
                        _0x1190da[_0x309745(0x17c)]();
                        if (_0x1bdf16) {
                            if (_0x50e213) _0x483d41['ry'] += _0x1bdf16 * 0xf;
                            else {
                                if (_0x1d459b[_0x24d1e9]) _0x483d41['vy'] = _0x2ded55[_0x309745(0xe1)](_0x581421, _0x2ded55['EBDhA'](_0x483d41['vy'], _0x1bdf16 * 0x46), -0x118, 0x118), _0x483d41['dir'] = _0x1bdf16;
                                else _0x483d41['vy'] += _0x2ded55[_0x309745(0xbd)](_0x1bdf16, 0x78);
                            }
                        }
                        if (_0x3ab037) {
                            if (_0x50e213) _0x483d41['rx'] = _0x2ded55['TWand'](_0x581421, _0x483d41['rx'] + _0x3ab037 * 0xa, -_0xd3c0e7, _0xd3c0e7);
                            else _0x483d41['vx'] += _0x2ded55['XUGjO'](_0x3ab037, 0x5a);
                        }
                        _0x1d2586();
                    });
                    const _0x2f9862 = new ResizeObserver(function() {
                        const _0x353fb1 = _0x42af0f;
                        if (_0x2e5e4c['clientWidth'] === _0x927748 && _0x2e5e4c['clientHeight'] === _0x2233d3) return;
                        _0x838a72(!![]), _0x5ee3d5(), _0x2b20af(_0x24d1e9), _0x35fc99(), _0x4b03e0[_0x353fb1(0x145)](_0x1d2586);
                    });
                    _0x2f9862[_0x42af0f(0x15b)](_0x2e5e4c);
                    const _0x15e995 = new IntersectionObserver(function(_0x2163a5) {
                        const _0x4257ca = _0x42af0f;
                        _0x1fb0a2 = _0x2163a5[_0x4b03e0[_0x4257ca(0xba)](_0x2163a5[_0x4257ca(0x1dc)], 0x1)]['isIntersecting'];
                        if (_0x1fb0a2) _0x4b03e0[_0x4257ca(0x1b3)](_0x1d2586);
                        else _0x207498();
                    });
                    _0x15e995['observe'](_0x2ff1d6), _0x7b6f41(document, 'visibilitychange', function() {
                        if (document['hidden']) _0x207498();
                        else _0x1d2586();
                    }), _0x2ff1d6[_0x42af0f(0x177)] = {
                        'morphTo': _0x4f1b48[_0x42af0f(0x184)](null, function(_0x3fa98d) {
                            _0x2ded55['apAQo'](_0x2fd5f4, _0x3fa98d);
                        }),
                        'open': _0x4f1b48[_0x42af0f(0x184)](null, function(_0x3c394b) {
                            _0x86a32b(_0x3c394b, ![]);
                        }),
                        'close': _0x4f1b48['add'](null, function() {
                            _0x2ded55['EhzZy'](_0x838a72, ![]);
                        })
                    }, _0x401785[_0x42af0f(0x18e)](function() {
                        const _0x3cba3e = _0x42af0f,
                            _0x5d922f = {
                                'MqKTQ': function(_0x49f2ec, _0x2c6195) {
                                    return _0x2ded55['ZXJrK'](_0x49f2ec, _0x2c6195);
                                },
                                'uuvFP': _0x2ded55[_0x3cba3e(0x1c0)]
                            };
                        _0x207498(), _0x2ded55[_0x3cba3e(0x92)](_0x838a72, !![]);
                        if (_0x5e389f) _0x5e389f[_0x3cba3e(0x8c)]();
                        _0x2ded55['cDotn'](_0x467e0c), _0x2605d2['forEach'](function(_0x883f08) {
                            const _0x256889 = _0x3cba3e;
                            _0x883f08['classList'][_0x256889(0xfe)](_0x4b03e0[_0x256889(0x1ba)], _0x4b03e0['wNfFm']);
                        }), _0x2f9862[_0x3cba3e(0x18d)](), _0x15e995['disconnect'](), delete _0x2ff1d6[_0x3cba3e(0x177)], _0x2ff1d6[_0x3cba3e(0xb8)][_0x3cba3e(0xfe)]('is-3d'), _0x2e5e4c['classList']['remove'](_0x2ded55['ZLYdS']), _0x2ff1d6['style']['removeProperty'](_0x2ded55[_0x3cba3e(0x122)]), _0x2ff1d6[_0x3cba3e(0x151)]['removeProperty'](_0x2ded55['qxByr']), _0x3b8f39['style'][_0x3cba3e(0xfb)] = '', _0xa83473['style'][_0x3cba3e(0xfb)] = '', _0x2605d2[_0x3cba3e(0xc5)](function(_0x3c64ee, _0x1eec8f) {
                            const _0x4f4fb7 = _0x3cba3e;
                            if (_0x4b03e0[_0x4f4fb7(0x13a)](_0x578b86[_0x1eec8f], null)) _0x3c64ee['removeAttribute'](_0x4b03e0['uGZUp']);
                            else _0x3c64ee[_0x4f4fb7(0x112)](_0x4b03e0[_0x4f4fb7(0xd3)], _0x578b86[_0x1eec8f]);
                        });
                        if (_0x1ac47b === undefined) delete _0x2ff1d6['dataset'][_0x3cba3e(0x169)];
                        else _0x2ff1d6['dataset']['formation'] = _0x1ac47b;
                        _0x3c11ac['forEach'](function(_0x56be01, _0x1936f5) {
                            const _0x25403b = _0x3cba3e;
                            if (_0x5d922f['MqKTQ'](_0x5c11e3[_0x1936f5], null)) _0x56be01['removeAttribute'](_0x25403b(0x19c));
                            else _0x56be01['setAttribute'](_0x5d922f['uuvFP'], _0x5c11e3[_0x1936f5]);
                        });
                    });
                }),
                function _0x4e06e7() {
                    const _0x422974 = _0x3ae38f;
                    _0x1c95ae[_0x422974(0xc5)](function(_0x126780) {
                        _0x126780();
                    }), _0x401785[_0x422974(0xc5)](function(_0x38a0c5) {
                        _0x38a0c5();
                    });
                };
        });
        const _0x2bd2ac = function() {
            const _0x42e2ac = _0x10055f;
            _0x4a6128[_0x42e2ac(0x17e)]();
        };
        return window['addEventListener'](_0x317b8d['qDlok'], _0x2bd2ac),
            function _0x12b828() {
                const _0x4ed1f2 = _0x10055f;
                window[_0x4ed1f2(0x12b)]('beforeunload', _0x2bd2ac);
                if (window['gsapContext'] === _0x4a6128) {
                    document[_0x4ed1f2(0xdf)]['classList']['remove']('has-js');
                    if (_0x422cc5 === undefined) delete window[_0x4ed1f2(0x131)];
                    else window['gsapContext'] = _0x422cc5;
                }
            };
    });
    window[_0x389056(0x131)] = _0x2d2225;
}));



/* --------------------------------------------------------------------------
   10. High-Performance Smooth Scroll Background Canvas (240 Orbital Frames)
   -------------------------------------------------------------------------- */
function initScrollBackgroundCanvas() {
  const canvas = document.getElementById('scroll-bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  const TOTAL_FRAMES = 240;
  const framePath = (i) => `assets/bg-scroll/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;

  const frames = new Array(TOTAL_FRAMES + 1);
  const loaded = new Array(TOTAL_FRAMES + 1).fill(false);

  let targetFrame = 1;
  let currentFrame = 1;
  let lastDrawnIndex = -1;
  let isAnimating = false;
  let hasFirstPaint = false;

  // 1. Sizing and Cover math with devicePixelRatio support
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    renderCurrentFrame(true);
  }

  function drawCoverImage(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1280;
    const ih = img.naturalHeight || 720;

    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const nx = (cw - nw) * 0.5;
    const ny = (ch - nh) * 0.5;

    ctx.drawImage(img, nx, ny, nw, nh);
  }

  // 2. Nearest Loaded Frame Resolver (prevents blank flashes during fast scrub)
  function getNearestLoadedFrame(index) {
    const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(index)));
    if (loaded[clamped]) return { img: frames[clamped], index: clamped };

    for (let d = 1; d < TOTAL_FRAMES; d++) {
      const prev = clamped - d;
      if (prev >= 1 && loaded[prev]) return { img: frames[prev], index: prev };
      const next = clamped + d;
      if (next <= TOTAL_FRAMES && loaded[next]) return { img: frames[next], index: next };
    }
    return null;
  }

  function renderCurrentFrame(force = false) {
    const targetIdx = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(currentFrame)));
    const resolved = getNearestLoadedFrame(targetIdx);
    if (!resolved) return;

    if (force || resolved.index !== lastDrawnIndex) {
      drawCoverImage(resolved.img);
      lastDrawnIndex = resolved.index;
      hasFirstPaint = true;
    }
  }

  // 3. Smooth Lerp Animation Loop
  function tick() {
    const diff = targetFrame - currentFrame;

    if (Math.abs(diff) > 0.02) {
      currentFrame += diff * 0.12; // Buttery-smooth easing
      renderCurrentFrame();
      requestAnimationFrame(tick);
    } else {
      currentFrame = targetFrame;
      renderCurrentFrame();
      isAnimating = false;
    }
  }

  function onScroll() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const progress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;

    targetFrame = 1 + progress * (TOTAL_FRAMES - 1);

    if (!isAnimating) {
      isAnimating = true;
      requestAnimationFrame(tick);
    }
  }

  // 4. Initial Frame Priority Preload (Instant background presentation)
  const firstFrame = new Image();
  firstFrame.src = framePath(1);
  firstFrame.onload = () => {
    frames[1] = firstFrame;
    loaded[1] = true;
    renderCurrentFrame(true);
  };

  // 5. Background Batch Preloading for all 240 frames
  function preloadRemainingFrames() {
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        frames[i] = img;
        loaded[i] = true;
        // If current frame hasn't rendered or user reached this frame, repaint
        if (!hasFirstPaint || Math.abs(Math.round(currentFrame) - i) <= 1) {
          renderCurrentFrame();
        }
      };
    }
  }

  // Start initial setup
  resizeCanvas();
  onScroll();
  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  // Start preloading remaining frames
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => preloadRemainingFrames());
  } else {
    setTimeout(preloadRemainingFrames, 40);
  }
}

/* --------------------------------------------------------------------------
   11. Cosmic Falling Commits & Celestial Particles Engine
   -------------------------------------------------------------------------- */
function initCelestialSky() {
  const canvas = document.getElementById('celestial-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  // Entity Collections
  const fallingCommits = [];

  // Falling "Code Commits" / Cosmic Data Sparkles
  class FallingCommit {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * -height;
      this.speed = Math.random() * 1.3 + 0.6;
      this.size = Math.random() * 2 + 1.2;
      this.opacity = Math.random() * 0.65 + 0.25;
      this.color = Math.random() > 0.4 ? '56, 189, 248' : '16, 185, 129';
      this.drift = (Math.random() - 0.5) * 0.45;
    }

    update() {
      this.y += this.speed;
      this.x += this.drift;
      if (this.y > height) {
        this.reset();
        this.y = 0;
      }
    }

    draw() {
      ctx.save();
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.shadowColor = `rgba(${this.color}, 0.8)`;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Initialize Falling Commits (32 ambient floating particles)
  for (let i = 0; i < 32; i++) {
    const c = new FallingCommit();
    c.y = Math.random() * height; // Spread initially
    fallingCommits.push(c);
  }

  let isPageVisible = true;
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
  });

  // Animation Loop
  function animate() {
    if (isPageVisible) {
      ctx.clearRect(0, 0, width, height);

      // Render & update Falling Commits
      fallingCommits.forEach((commit) => {
        commit.update();
        commit.draw();
      });
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}


