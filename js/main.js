/* ============================================
   LUMA — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Header Scroll Effect ---
  const header = document.querySelector('.header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // --- Mobile Menu ---
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active');
      menuToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Scroll Reveal ---
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  if (reveals.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  }

  // --- Carousel ---
  document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel__track');
    const prevBtn = carousel.querySelector('.carousel__btn--prev');
    const nextBtn = carousel.querySelector('.carousel__btn--next');
    if (!track) return;

    let scrollAmount = 0;
    const getSlideWidth = () => {
      const slide = track.querySelector('.carousel__slide');
      if (!slide) return 300;
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap) || 24;
      return slide.offsetWidth + gap;
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const slideWidth = getSlideWidth();
        const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;
        scrollAmount = Math.min(scrollAmount + slideWidth, maxScroll);
        track.style.transform = `translateX(-${scrollAmount}px)`;
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const slideWidth = getSlideWidth();
        scrollAmount = Math.max(scrollAmount - slideWidth, 0);
        track.style.transform = `translateX(-${scrollAmount}px)`;
      });
    }

    // Touch/drag support
    let isDragging = false;
    let startX = 0;
    let startScroll = 0;

    track.addEventListener('pointerdown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startScroll = scrollAmount;
      track.style.transition = 'none';
      track.setPointerCapture(e.pointerId);
    });

    track.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const diff = startX - e.clientX;
      const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;
      scrollAmount = Math.max(0, Math.min(startScroll + diff, maxScroll));
      track.style.transform = `translateX(-${scrollAmount}px)`;
    });

    track.addEventListener('pointerup', () => {
      isDragging = false;
      track.style.transition = '';
    });
  });

  // --- Accordion ---
  document.querySelectorAll('.accordion__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const content = trigger.nextElementSibling;
      const isOpen = trigger.classList.toggle('is-open');

      if (isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }

      trigger.setAttribute('aria-expanded', isOpen);
    });
  });

  // --- Quantity Selector ---
  document.querySelectorAll('.quantity-selector').forEach(selector => {
    const minusBtn = selector.querySelector('.quantity-selector__btn--minus');
    const plusBtn = selector.querySelector('.quantity-selector__btn--plus');
    const valueEl = selector.querySelector('.quantity-selector__value');
    if (!minusBtn || !plusBtn || !valueEl) return;

    let qty = 1;
    minusBtn.addEventListener('click', () => {
      if (qty > 1) {
        qty--;
        valueEl.textContent = qty;
      }
    });

    plusBtn.addEventListener('click', () => {
      if (qty < 10) {
        qty++;
        valueEl.textContent = qty;
      }
    });
  });

  // --- Shade Selector ---
  document.querySelectorAll('.shade-selector__grid').forEach(grid => {
    const swatches = grid.querySelectorAll('.shade-selector__swatch');
    swatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        swatches.forEach(s => s.classList.remove('is-active'));
        swatch.classList.add('is-active');

        const shadeName = swatch.dataset.shade;
        const label = grid.closest('.shade-selector')?.querySelector('.shade-selector__current');
        if (label && shadeName) {
          label.textContent = shadeName;
        }
      });
    });
  });

  // --- Product Card Swatches ---
  document.querySelectorAll('.product-card .swatches').forEach(swatchGroup => {
    swatchGroup.querySelectorAll('.swatch').forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        e.preventDefault();
        swatchGroup.querySelectorAll('.swatch').forEach(s => s.classList.remove('is-active'));
        swatch.classList.add('is-active');
      });
    });
  });

  // --- Filter Toggles (Shop Page) ---
  document.querySelectorAll('.filters__title').forEach(title => {
    title.addEventListener('click', () => {
      title.classList.toggle('is-collapsed');
      const options = title.nextElementSibling;
      if (options) {
        options.style.display = title.classList.contains('is-collapsed') ? 'none' : '';
      }
    });
  });

  document.querySelectorAll('.filters__option').forEach(option => {
    option.addEventListener('click', () => {
      option.classList.toggle('is-active');
    });
  });

  // Mobile filter toggle
  const filterToggle = document.querySelector('.filters__mobile-toggle');
  const filterSidebar = document.querySelector('.filters__sidebar');
  if (filterToggle && filterSidebar) {
    filterToggle.addEventListener('click', () => {
      filterSidebar.classList.toggle('is-open');
      const isOpen = filterSidebar.classList.contains('is-open');
      filterToggle.textContent = isOpen ? 'Hide Filters' : 'Show Filters';
    });
  }

  // --- Gallery Thumbnails (Product Page) ---
  const galleryMain = document.querySelector('.gallery__main');
  const galleryThumbs = document.querySelectorAll('.gallery__thumb');
  if (galleryMain && galleryThumbs.length > 0) {
    galleryThumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        galleryThumbs.forEach(t => t.classList.remove('is-active'));
        thumb.classList.add('is-active');
        // Swap background color to simulate image change
        const bg = thumb.querySelector('.gallery__thumb-placeholder');
        const mainPlaceholder = galleryMain.querySelector('.gallery__main-placeholder');
        if (bg && mainPlaceholder) {
          mainPlaceholder.style.background = window.getComputedStyle(bg).background;
        }
      });
    });
  }

  // --- Newsletter Form ---
  const newsletterForm = document.querySelector('.newsletter__form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter__input');
      if (input && input.value.trim()) {
        const btn = newsletterForm.querySelector('.newsletter__submit');
        if (btn) {
          btn.textContent = 'Thank you!';
          btn.style.background = 'var(--rose-gold)';
          input.value = '';
          setTimeout(() => {
            btn.textContent = 'Subscribe';
            btn.style.background = '';
          }, 3000);
        }
      }
    });
  }

});
