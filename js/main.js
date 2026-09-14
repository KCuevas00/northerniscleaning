/**
 * Northern Illinois Cleaning Services LLC - Main JS
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
      
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when clicking outside or on a nav link
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });

    function closeMobileMenu() {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    }
  }

  // 2. Transparent-to-Solid Navbar on Scroll
  const header = document.querySelector('.site-header');
  let ticking = false;

  function updateNavbarScroll() {
    if (!header) return;
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollPos > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbarScroll);
      ticking = true;
    }
  }

  if (header) {
    // Initial evaluation immediately on DOM ready
    updateNavbarScroll();

    // High performance passive scroll listener
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('pageshow', updateNavbarScroll);
  }

  // 3. Gallery Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // 4. Lightbox Modal for Gallery
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('.gallery-media img');
        const title = item.querySelector('.gallery-overlay h3');
        const desc = item.querySelector('.gallery-overlay p');

        if (img) lightboxImg.src = img.src;
        if (title && lightboxTitle) lightboxTitle.textContent = title.textContent;
        if (desc && lightboxDesc) lightboxDesc.textContent = desc.textContent;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // 5. FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close all other open items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });

  // 6. Contact & Estimate Form Interactive Submission
  const quoteForm = document.getElementById('contactQuoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const statusBox = document.getElementById('formStatus');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Request...';
      }

      setTimeout(() => {
        if (statusBox) {
          statusBox.className = 'form-status success';
          statusBox.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your proposal request has been received. A Northern Illinois Cleaning specialist will review your details and contact you within 24 hours.';
          statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        quoteForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Request Free Consultation';
        }
      }, 1000);
    });
  }

  // 7. Continuous Looping Video Hero Playlist with Smooth Cross-Fade
  const videoA = document.getElementById('heroVideoA');
  const videoB = document.getElementById('heroVideoB');

  if (videoA && videoB) {
    const playlist = [
      'videos/bathroom-surface-cleaning.mp4',
      'videos/spraying-wiping-surface.mp4',
      'videos/disinfecting-door-handle.mp4',
      'videos/steam-cleaning-surface.mp4'
    ];
    let currentIndex = 0;
    let activePlayer = videoA;
    let idlePlayer = videoB;
    let isTransitioning = false;
    let cycleTimer = null;
    const clipDuration = 5500; // 5.5 seconds per clip before cross-fading

    function playVideo(video) {
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {
          // Autoplay unlock on first user click or touch
          const unlockAutoplay = () => {
            activePlayer.play();
            document.removeEventListener('touchstart', unlockAutoplay);
            document.removeEventListener('click', unlockAutoplay);
          };
          document.addEventListener('touchstart', unlockAutoplay, { once: true });
          document.addEventListener('click', unlockAutoplay, { once: true });
        });
      }
    }

    // Start playing video A immediately
    playVideo(videoA);

    function nextVideo() {
      if (isTransitioning) return;
      isTransitioning = true;

      currentIndex = (currentIndex + 1) % playlist.length;
      const nextSrc = playlist[currentIndex];

      idlePlayer.src = nextSrc;
      idlePlayer.currentTime = 0;
      idlePlayer.load();

      const onPlaying = () => {
        idlePlayer.removeEventListener('playing', onPlaying);

        // Idle player is actively rendering frames - trigger smooth 1.2s cross-dissolve
        idlePlayer.classList.add('active');
        activePlayer.classList.remove('active');

        setTimeout(() => {
          activePlayer.pause();
          const temp = activePlayer;
          activePlayer = idlePlayer;
          idlePlayer = temp;
          isTransitioning = false;
        }, 1250);
      };

      idlePlayer.addEventListener('playing', onPlaying, { once: true });

      const p = idlePlayer.play();
      if (p !== undefined) {
        p.catch(err => {
          console.warn('Video transition playback error, retrying:', err);
          isTransitioning = false;
          setTimeout(nextVideo, 1000);
        });
      }
    }

    // Advance when clip naturally ends OR after clipDuration
    videoA.addEventListener('ended', nextVideo);
    videoB.addEventListener('ended', nextVideo);

    // Continuous looping timer
    cycleTimer = setInterval(nextVideo, clipDuration);
  }
});


