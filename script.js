document.addEventListener('DOMContentLoaded', function () {

    if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0)) {
        document.body.classList.add('touch-device');
    }

    // ==========================================================================
    // ABOUT OVERLAY
    // ==========================================================================
    const menuBtn      = document.getElementById('menu-dots');
    const aboutOverlay = document.getElementById('about-overlay');
    const closeBtn     = document.getElementById('about-close');

    if (menuBtn && aboutOverlay && closeBtn) {
        menuBtn.addEventListener('click',  () => aboutOverlay.classList.add('active'));
        closeBtn.addEventListener('click', () => aboutOverlay.classList.remove('active'));
        aboutOverlay.addEventListener('click', (e) => {
            if (e.target === aboutOverlay) aboutOverlay.classList.remove('active');
        });
    }

    // ==========================================================================
    // PROJECT VIEW
    // ==========================================================================
    const contentPane = document.querySelector('.view-pane[data-content="projects"]');
    if (!contentPane) return;

    const carouselContainer = document.getElementById('carousel-container');
    const customCursor      = document.getElementById('custom-cursor');
    const titleEl           = document.getElementById('project-title');
    const descriptionEl     = document.getElementById('project-description');
    const slidesContainer   = document.getElementById('project-slides');
    const projectGrid       = document.getElementById('project-grid');
    const projectDetail     = document.getElementById('project-detail');
    const backBtn           = document.getElementById('back-to-grid');

    let currentProjectIndex = 0;
    let isNavigating        = false;
    let isChangingProject   = false;

    const CLONE_COUNT = 5;

    // --------------------------------------------------------------------------
    // PROJECT DATA
    // --------------------------------------------------------------------------
    const projectData = {

        'new-tool': {
            title: 'DUSTE',
            description: 'Stackable, modular Lithing system. <br><br> <p> </p>70x45cm  <p> </p>Aluminum, Corugated Plastic, LED bulbs.  <p> </p> 2026',
            media: Array.from({ length: 5 }, (_, i) => ({ type: 'image', src: `Projektbilder/New_Tool/Bild (${i + 1}).jpg` }))
        },

        'tin-3d': {
            title: 'TIN 3D PRINTER',
            description: 'Conventional tin has a relatively low melting point for a metal. This led to the idea of modifying an existing 3D printer to extrude tin. The entire project was highly experimental, and I worked based on trial and error. <br><br><p> </p> 65x65cm  <p> </p> Ender 3 3D Printer  <p> </p> 2024',
            media: [
                { type: 'video', src: 'Projektvideos/tin-3d.mp4' },
                ...Array.from({ length: 6 }, (_, i) => ({ type: 'image', src: `Projektbilder/Tin_3D_Printer/Bild (${i + 1}).jpg` }))
            ]
        },

        'faltkarre': {
            title: 'FOLDING WHEELBARROW',
            description: 'A wheelbarrow can take up a lot of space. That\'s why I developed this folding wheelbarrow. When you need it, you fold it up quickly and when you don\'t, you store it flat as it is.<br><br> <p> </p> 120x60cm  <p> </p> Truck Tarp, plywood, Aluminum Rods, rubber. <p> </p> 2025',
            media: Array.from({ length: 16 }, (_, i) => ({ type: 'image', src: `Projektbilder/Faltkarre/Bild (${i + 1}).jpg` }))
        },

        'ashoka-dupe': {
            title: 'ASHOKA DUPE',
            description: 'Inspired by the legendary design of the Ashoka lamp by Etorre Sottsass for Memphis milano I created this modern recreation.  <br><br><p> </p> 60x60cm  <p> </p> Aluminum, Bulbs, PLA printed parts. <p> </p> 2025',
            media: Array.from({ length: 3 }, (_, i) => ({ type: 'image', src: `Projektbilder/Ashoka_Dupe/Bild (${i + 1}).jpg` }))
        },

        'leiter': {
            title: 'DECORATED LADDER',
            description: 'What could decorations for a ladder look like that would make the ladder and its exclusive ornaments a worthy successor to the traditional Christmas tree?  <br><br><p> </p> 200x100cm  <p> </p> Wooden Ladder, PLA printed parts. <p> </p> 2023',
            media: Array.from({ length: 11 }, (_, i) => ({ type: 'image', src: `Projektbilder/Leiter/Bild (${i + 1}).jpg` }))
        }

    };

    const projectKeys = Object.keys(projectData);

    // --------------------------------------------------------------------------
    // UTILITIES
    // --------------------------------------------------------------------------
    function muteAllVideos() {
        document.querySelectorAll('video').forEach(video => {
            video.muted  = true;
            video.volume = 0;
            video.play().catch(() => {});
        });
    }

    function updateDescription(index) {
        const project = projectData[projectKeys[index]];
        if (!project) return;
        if (titleEl)       titleEl.textContent    = project.title;
        if (descriptionEl) descriptionEl.innerHTML = project.description;
    }

    function updateDots(slide, realIndex) {
        slide.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === realIndex);
        });
    }

    // --------------------------------------------------------------------------
    // FILMSTRIP POSITIONING
    // --------------------------------------------------------------------------
    function positionFilmstrip(slide, index) {
        const filmstrip = slide.querySelector('.filmstrip');
        if (!slide || !filmstrip) return;

        slide.dataset.currentIndex = index;

        const target = filmstrip.children[index];
        if (!target) return;

        const containerWidth = slide.offsetWidth;
        if (containerWidth === 0) {
            requestAnimationFrame(() => positionFilmstrip(slide, index));
            return;
        }

        const x = (containerWidth / 2) - (target.offsetWidth / 2) - target.offsetLeft;
        filmstrip.style.transform = `translateX(${x}px)`;
    }

    // --------------------------------------------------------------------------
    // INFINITE LOOP WRAPPING
    // --------------------------------------------------------------------------
    function onTransitionEnd(slide) {
        const filmstrip       = slide.querySelector('.filmstrip');
        const currentIndex    = parseInt(slide.dataset.currentIndex, 10);
        const prependedClones = parseInt(slide.dataset.prependedClones, 10);
        const realCount       = parseInt(slide.dataset.realCount, 10);

        if (realCount <= 1) {
            isNavigating = false;
            return;
        }

        const firstRealIndex = prependedClones;
        const lastRealIndex  = prependedClones + realCount - 1;
        let correctedIndex   = -1;

        if (currentIndex > lastRealIndex)  correctedIndex = firstRealIndex + (currentIndex - 1 - lastRealIndex);
        if (currentIndex < firstRealIndex) correctedIndex = lastRealIndex  - (firstRealIndex - 1 - currentIndex);

        if (correctedIndex !== -1) {
            filmstrip.classList.add('no-transition');

            const frames = Array.from(filmstrip.children);
            frames.forEach(f => f.classList.remove('media-active'));
            frames[correctedIndex].classList.add('media-active');

            positionFilmstrip(slide, correctedIndex);
            updateDots(slide, correctedIndex - prependedClones);

            setTimeout(() => {
                filmstrip.classList.remove('no-transition');
                clearTimeout(navigate.resetTimer);
                isNavigating = false;
            }, 50);
        } else {
            clearTimeout(navigate.resetTimer);
            isNavigating = false;
        }
    }

    // --------------------------------------------------------------------------
    // CAROUSEL NAVIGATION
    // --------------------------------------------------------------------------
    const navigate = (direction) => {
        const activeSlide = document.querySelector('.project-slide.active');
        if (!activeSlide || isNavigating) return;

        isNavigating = true;
        clearTimeout(navigate.resetTimer);
        navigate.resetTimer = setTimeout(() => { isNavigating = false; }, 800);

        const filmstrip    = activeSlide.querySelector('.filmstrip');
        const frames       = Array.from(filmstrip.children);
        const currentIndex = parseInt(activeSlide.dataset.currentIndex, 10);
        const nextIndex    = currentIndex + direction;

        const currentFrame = frames[currentIndex];
        const nextFrame    = frames[nextIndex];

        if (currentFrame) setTimeout(() => { currentFrame.classList.remove('media-active'); }, 250);
        if (nextFrame)    nextFrame.classList.add('media-active');

        filmstrip.classList.add('transitioning');
        positionFilmstrip(activeSlide, nextIndex);

        const prependedClones = parseInt(activeSlide.dataset.prependedClones, 10);
        const realCount       = parseInt(activeSlide.dataset.realCount, 10);
        const rawRealIndex    = nextIndex - prependedClones;
        const wrappedIndex    = ((rawRealIndex % realCount) + realCount) % realCount;
        updateDots(activeSlide, wrappedIndex);
    };
    navigate.resetTimer = null;

    // --------------------------------------------------------------------------
    // VIEW SWITCHING
    // --------------------------------------------------------------------------
    const inDetailView = () => projectDetail.classList.contains('active');

    function openProject(index) {
        projectGrid.style.display = 'none';
        projectDetail.classList.add('active');

        if (index === currentProjectIndex && document.querySelector('.project-slide.active')) {
            requestAnimationFrame(() => {
                const activeSlide = document.querySelector('.project-slide.active');
                if (activeSlide) positionFilmstrip(activeSlide, parseInt(activeSlide.dataset.currentIndex, 10));
            });
        } else {
            showProject(index, currentProjectIndex === -1);
            requestAnimationFrame(() => {
                const activeSlide = document.querySelector('.project-slide.active');
                if (activeSlide) positionFilmstrip(activeSlide, parseInt(activeSlide.dataset.currentIndex, 10));
            });
        }
    }

    function showGrid() {
        projectDetail.classList.remove('active');
        projectGrid.style.display = 'grid';
    }

    if (backBtn) backBtn.addEventListener('click', showGrid);

    const msgBtn = document.getElementById('message-btn');
    if (msgBtn) {
        msgBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.open('https://mail.google.com/mail/?view=cm&to=leonremmert1@gmail.com', '_blank', 'noopener');
        });
    }

    // --------------------------------------------------------------------------
    // SHOW PROJECT (crossfade)
    // --------------------------------------------------------------------------
    function showProject(index, isFirstOpen = false) {
        if (
            isChangingProject ||
            index < 0 ||
            index >= projectKeys.length ||
            (!isFirstOpen && index === currentProjectIndex)
        ) return;

        isChangingProject = true;

        const prevSlide  = document.querySelector('.project-slide.active');
        const key        = projectKeys[index];
        const nextSlide  = document.querySelector(`.project-slide[data-key="${key}"]`);
        const filmstrip  = nextSlide.querySelector('.filmstrip');
        const startIndex = parseInt(nextSlide.dataset.prependedClones, 10);

        if (isFirstOpen) {
            if (prevSlide) prevSlide.classList.remove('active');

            nextSlide.classList.add('active');
            nextSlide.dataset.currentIndex = startIndex;

            const firstFrame = filmstrip.children[startIndex];
            if (firstFrame) firstFrame.classList.add('media-active');

            currentProjectIndex = index;
            updateDescription(index);
            isChangingProject = false;
            return;
        }

        const crossfade = () => {
            if (prevSlide) prevSlide.classList.remove('active');

            nextSlide.classList.add('active');
            filmstrip.classList.remove('transitioning');
            filmstrip.classList.add('no-transition');

            const frames = Array.from(filmstrip.children);
            frames.forEach(f => f.classList.remove('media-active'));
            frames[startIndex].classList.add('media-active');

            positionFilmstrip(nextSlide, startIndex);
            requestAnimationFrame(() => filmstrip.classList.remove('no-transition'));

            updateDots(nextSlide, 0);
            muteAllVideos();

            currentProjectIndex = index;
            updateDescription(index);

            setTimeout(() => { isChangingProject = false; }, 1100);
        };

        const firstFrame = filmstrip.children[startIndex];
        const firstMedia = firstFrame ? firstFrame.firstElementChild : null;

        if (firstMedia && firstMedia.tagName === 'IMG' && !firstMedia.complete) {
            firstMedia.onload  = crossfade;
            firstMedia.onerror = crossfade;
        } else {
            crossfade();
        }
    }

    // --------------------------------------------------------------------------
    // MEDIA ELEMENT FACTORY
    // --------------------------------------------------------------------------
    function createMediaElement(mediaData) {
        const frame     = document.createElement('div');
        frame.className = 'slide-frame';

        let el;

        if (mediaData.type === 'image') {
            el         = new Image();
            el.loading = 'lazy';
        } else if (mediaData.type === 'video') {
            el = document.createElement('video');
            Object.assign(el, {
                autoplay:    true,
                loop:        true,
                muted:       true,
                playsInline: true,
                preload:     'auto'
            });
            el.addEventListener('loadedmetadata', () => {
                const activeSlide = document.querySelector('.project-slide.active');
                if (activeSlide) positionFilmstrip(activeSlide, parseInt(activeSlide.dataset.currentIndex, 10));
            });
            el.addEventListener('loadeddata', () => {
                const activeSlide = document.querySelector('.project-slide.active');
                if (activeSlide) positionFilmstrip(activeSlide, parseInt(activeSlide.dataset.currentIndex, 10));
            });
        } else if (mediaData.type === 'model') {
            el = document.createElement('model-viewer');
            el.setAttribute('camera-controls', '');
            el.setAttribute('auto-rotate', '');
        }

        if (el) {
            el.src = mediaData.src;
            frame.appendChild(el);
        }

        return frame;
    }

    // --------------------------------------------------------------------------
    // INIT
    // --------------------------------------------------------------------------
    function init() {
        if (!carouselContainer || !slidesContainer || !descriptionEl) {
            console.error('Required elements not found.');
            return;
        }

        projectGrid.innerHTML     = '';
        slidesContainer.innerHTML = '';

        projectKeys.forEach((key, index) => {

            // Grid tile
            const gridItem     = document.createElement('div');
            gridItem.className = 'project-grid-item';

            const firstMedia = projectData[key].media[0];
            if (firstMedia.type === 'image') {
                const img   = new Image();
                img.src     = firstMedia.src;
                img.alt     = projectData[key].title;
                img.loading = 'lazy';
                gridItem.appendChild(img);
            } else if (firstMedia.type === 'video') {
                const vid       = document.createElement('video');
                vid.src         = firstMedia.src;
                vid.muted       = true;
                vid.autoplay    = true;
                vid.loop        = true;
                vid.playsInline = true;
                gridItem.appendChild(vid);
            }

            if (projectData[key].pinned) {
                const pin = document.createElement('div');
                pin.className = 'grid-pin';
                pin.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2 5.5A3.5 3.5 0 0 1 5.5 2h13A3.5 3.5 0 0 1 22 5.5v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z"/><rect x="11" y="7.5" width="2" height="8.5" rx="1"/><path d="M11 16h2l-1 5z"/></svg>`;
                gridItem.appendChild(pin);
            }

            gridItem.addEventListener('click', (e) => { e.stopPropagation(); openProject(index); });
            projectGrid.appendChild(gridItem);

            // Slide
            const slide      = document.createElement('div');
            slide.className  = 'project-slide';
            slide.dataset.key = key;

            const filmstrip     = document.createElement('div');
            filmstrip.className = 'filmstrip';

            const mediaItems = projectData[key].media;

            if (mediaItems.length > 1) {
                const count      = mediaItems.length;
                const cloneCount = Math.min(count, CLONE_COUNT);
                const prepend    = mediaItems.slice(-cloneCount);
                const append     = mediaItems.slice(0, cloneCount);
                const allMedia   = [...prepend, ...mediaItems, ...append];

                allMedia.forEach(m => filmstrip.appendChild(createMediaElement(m)));

                slide.dataset.prependedClones = cloneCount;
                slide.dataset.realCount       = count;
            } else {
                mediaItems.forEach(m => filmstrip.appendChild(createMediaElement(m)));
                slide.dataset.prependedClones = 0;
                slide.dataset.realCount       = mediaItems.length;
            }

            filmstrip.addEventListener('transitionend', (e) => {
                if (e.target === filmstrip) onTransitionEnd(slide);
            });

            slide.appendChild(filmstrip);

            // Carousel dots
            const realCount = parseInt(slide.dataset.realCount, 10);
            if (realCount > 1) {
                const dots     = document.createElement('div');
                dots.className = 'carousel-dots';
                for (let i = 0; i < realCount; i++) {
                    const dot     = document.createElement('span');
                    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                    dots.appendChild(dot);
                }
                slide.appendChild(dots);
            }

            slidesContainer.appendChild(slide);
        });

        currentProjectIndex = -1;
        showGrid();
    }

    // --------------------------------------------------------------------------
    // EVENT LISTENERS
    // --------------------------------------------------------------------------
    contentPane.addEventListener('wheel', (e) => {
        if (!inDetailView()) return;
        e.preventDefault();
        if (isChangingProject) return;

        const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        if (isHorizontal) {
            if (e.deltaX > 20)       navigate(1);
            else if (e.deltaX < -20) navigate(-1);
        } else {
            if (e.deltaY > 20)       showProject(currentProjectIndex + 1);
            else if (e.deltaY < -20) showProject(currentProjectIndex - 1);
        }
    });

    contentPane.addEventListener('mousemove', (e) => {
        if (!inDetailView() || !customCursor) return;

        customCursor.style.opacity = '1';
        customCursor.style.left    = `${e.clientX}px`;
        customCursor.style.top     = `${e.clientY}px`;

        const rect        = carouselContainer.getBoundingClientRect();
        const mid         = rect.left + rect.width / 2;
        const cursorLeft  = document.getElementById('cursor-left');
        const cursorRight = document.getElementById('cursor-right');

        if (e.clientX < mid) {
            if (cursorLeft)  cursorLeft.style.display  = 'block';
            if (cursorRight) cursorRight.style.display = 'none';
        } else {
            if (cursorLeft)  cursorLeft.style.display  = 'none';
            if (cursorRight) cursorRight.style.display = 'block';
        }
    });

    contentPane.addEventListener('mouseenter', () => {
        if (!inDetailView()) return;
        if (customCursor) customCursor.style.opacity = '1';
    });

    contentPane.addEventListener('mouseleave', () => {
        if (customCursor) customCursor.style.opacity = '0';
    });

    contentPane.addEventListener('click', (e) => {
        if (!inDetailView()) return;
        const rect = carouselContainer.getBoundingClientRect();
        const mid  = rect.left + rect.width / 2;
        if (e.clientX < mid) navigate(-1);
        else                  navigate(1);
    });

    window.addEventListener('resize', () => {
        const activeSlide = document.querySelector('.project-slide.active');
        if (activeSlide) positionFilmstrip(activeSlide, parseInt(activeSlide.dataset.currentIndex, 10));
    });

    // Touch — prevent scroll in detail view
    contentPane.addEventListener('touchmove', (e) => {
        if (projectDetail.classList.contains('active')) e.preventDefault();
    }, { passive: false });

    // Live drag state
    let dragAxis      = null;   // 'x' | 'y' | null
    let dragBaseX     = 0;      // filmstrip translateX at touch start
    let dragStartX    = 0;
    let dragStartY    = 0;
    let dragStartTime = 0;

    carouselContainer.addEventListener('touchstart', (e) => {
        if (isChangingProject) return;
        const activeSlide = document.querySelector('.project-slide.active');
        if (!activeSlide) return;

        const filmstrip = activeSlide.querySelector('.filmstrip');
        const matrix    = new DOMMatrix(getComputedStyle(filmstrip).transform);
        dragBaseX     = matrix.m41;
        dragStartX    = e.changedTouches[0].clientX;
        dragStartY    = e.changedTouches[0].clientY;
        dragStartTime = Date.now();
        dragAxis      = null;

        // Freeze filmstrip in place during drag
        filmstrip.classList.remove('transitioning');
        filmstrip.classList.add('no-transition');
    }, { passive: true });

    carouselContainer.addEventListener('touchmove', (e) => {
        const activeSlide = document.querySelector('.project-slide.active');
        if (!activeSlide) return;

        const dX = e.changedTouches[0].clientX - dragStartX;
        const dY = e.changedTouches[0].clientY - dragStartY;

        // Lock axis on first meaningful move
        if (!dragAxis && (Math.abs(dX) > 4 || Math.abs(dY) > 4)) {
            dragAxis = Math.abs(dX) >= Math.abs(dY) ? 'x' : 'y';
        }

        if (dragAxis === 'x') {
            const filmstrip = activeSlide.querySelector('.filmstrip');
            filmstrip.style.transform = `translateX(${dragBaseX + dX}px)`;
        }
    }, { passive: true });

    carouselContainer.addEventListener('touchend', (e) => {
        const activeSlide = document.querySelector('.project-slide.active');
        if (!activeSlide) return;

        const filmstrip = activeSlide.querySelector('.filmstrip');
        const dX        = e.changedTouches[0].clientX - dragStartX;
        const dY        = e.changedTouches[0].clientY - dragStartY;
        const elapsed   = Math.max(1, Date.now() - dragStartTime);
        const velocity  = Math.abs(dX) / elapsed; // px/ms
        const realCount = parseInt(activeSlide.dataset.realCount, 10);

        filmstrip.classList.remove('no-transition');

        if (dragAxis === 'x') {
            const snapThreshold = activeSlide.offsetWidth * 0.2; // 20% of width
            const shouldNav     = realCount > 1 &&
                (Math.abs(dX) > snapThreshold || velocity > 0.3);

            if (shouldNav) {
                // Let navigate() take over from current drag position
                isNavigating = false;
                navigate(dX > 0 ? -1 : 1);
            } else {
                // Snap back to current slide
                const idx = parseInt(activeSlide.dataset.currentIndex, 10);
                filmstrip.classList.add('transitioning');
                positionFilmstrip(activeSlide, idx);
                filmstrip.addEventListener('transitionend',
                    () => filmstrip.classList.remove('transitioning'),
                    { once: true }
                );
            }
        } else if (dragAxis === 'y') {
            if (Math.abs(dY) > 50) {
                if (dY > 0) showProject(currentProjectIndex - 1);
                else        showProject(currentProjectIndex + 1);
            }
        }

        dragAxis = null;
    }, { passive: true });

    // --------------------------------------------------------------------------
    // START
    // --------------------------------------------------------------------------
    init();

    requestAnimationFrame(() => {
        const activeSlide = document.querySelector('.project-slide.active');
        if (activeSlide) positionFilmstrip(activeSlide, parseInt(activeSlide.dataset.currentIndex, 10));
    });

});
