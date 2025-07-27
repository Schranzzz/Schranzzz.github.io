document.addEventListener('DOMContentLoaded', function() {

    // =======================================================
    // LOGIK FÜR ORDNER-TABS
    // =======================================================
    var tabsContainer = document.querySelector('.ordner-tabs');
    var tabs = document.querySelectorAll('.tab');
    var contentPages = document.querySelectorAll('.ordner-inhalt');
    var ordnerInhaltStapel = document.querySelector('.ordner-inhalt-stapel');
    
    if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0)) {
        document.body.classList.add('touch-device');
    }
    
    if (tabsContainer) {
        // --- FIX: Flag to check if projects tab has been viewed once ---
        let hasProjectsBeenInitialized = false;

        function setActiveState(tabToActivate, isInitialLoad = false) {
            if (!tabToActivate || tabToActivate.classList.contains('active')) return;
            if (!isInitialLoad) {
                ordnerInhaltStapel.classList.add('no-transition');
                ordnerInhaltStapel.classList.add('is-lifted');
                ordnerInhaltStapel.offsetHeight;
                ordnerInhaltStapel.classList.remove('no-transition');
            }
            tabs.forEach(t => t.classList.remove('active'));
            contentPages.forEach(p => p.classList.remove('active'));
            tabToActivate.classList.add('active');
            var targetContent = document.querySelector('.ordner-inhalt[data-content="' + tabToActivate.dataset.tabTarget + '"]');
            if (targetContent) {
                targetContent.classList.add('active');
            }

            // --- THE DEFINITIVE FIX ---
            // This runs ONLY when the projects tab is made active for the very first time.
            if (tabToActivate.dataset.tabTarget === 'projekte' && !hasProjectsBeenInitialized) {
                hasProjectsBeenInitialized = true; // Never run this again
                
                // Use requestAnimationFrame to wait for the browser to be ready to paint.
                // This is the most reliable way to ensure layout dimensions are available.
                requestAnimationFrame(() => {
                    const aktiverSlide = document.querySelector('.projekt-slide.active');
                    if (aktiverSlide) {
                        const currentIndex = parseInt(aktiverSlide.dataset.currentIndex, 10);
                        positioniereFilmstreifen(aktiverSlide, currentIndex);
                    }
                });
            }
            // --- END OF FIX ---

            const contentZIndex = 5;
            tabToActivate.style.zIndex = contentZIndex + 1;
            let zCounter = contentZIndex - 1;
            tabs.forEach(t => { if (t !== tabToActivate) { t.style.zIndex = zCounter; zCounter--; } });
        }
        tabsContainer.addEventListener('click', (event) => setActiveState(event.target.closest('.tab')));
        tabs.forEach(tab => {
            tab.addEventListener('mouseenter', () => { if (tab.classList.contains('active')) { ordnerInhaltStapel.classList.add('is-lifted'); } });
            tab.addEventListener('mouseleave', () => { ordnerInhaltStapel.classList.remove('is-lifted'); });
        });
        setActiveState(document.querySelector('.tab'), true);
    }

    // =======================================================
    // LOGIK FÜR PROJEKTSEITE
    // =======================================================
    const projektContainerWrapper = document.querySelector('.ordner-inhalt[data-content="projekte"]');

    if (projektContainerWrapper) {S
        const projekteContainer = document.getElementById('projekte-container');
        const customCursor = document.getElementById('custom-cursor');
        const infoToggleButton = document.getElementById('info-toggle-button');
        const overlayTitleImg = document.getElementById('overlay-title-img');
        const overlayDescription = document.getElementById('overlay-description');
        const projektNav = document.getElementById('projekt-nav');
        const projektSlidesContainer = document.getElementById('projekt-slides');
        const infoPaper = document.getElementById('info-paper');
        
        let isInfoOverlayOpen = false;
        let aktuellerProjektIndex = 0;
        let isNavigating = false;
        let isChangingProject = false;
        const CLONE_COUNT = 5;

        const projektDaten = {
            'ashoka-dupe': {
                titel: 'Ashoka Dupe',
                titelBild: 'Handwritten_Titles/Ashoka_Dupe.png',
                beschreibung: 'Inspired by the legendary design of the Ashoka lamp by Etorre Sottsass for Memphis milano I created this modern recreation. <em>Modell mit der Maus ziehen zum Drehen, Mausrad zum Zoomen.</em>',
                medien: Array.from({ length: 5 }, (_, i) => ({ type: 'image', src: `Projektbilder/Ashoka_Dupe/Bild (${i + 1}).jpg` }))
            },
            'leiter': {
                titel: 'Decorated Ladder',
                titelBild: 'Handwritten_Titles/Decorated_Ladder.png',
                beschreibung: 'What could decorations for a ladder look like that would make the ladder and its exclusive ornaments a worthy successor to the traditional Christmas tree?',
                medien: [
                    { type: 'video', src: 'Projektvideos/leiter.mp4' },
                    ...Array.from({ length: 11 }, (_, i) => ({ type: 'image', src: `Projektbilder/Leiter/Bild (${i + 1}).jpg` }))
                ]
            },
            'faltkarre': {
                titel: 'Folding Wheelbarrow',
                titelBild: 'Handwritten_Titles/faltkarre.png',
                beschreibung: 'The wheelbarrow in private use can take up a lot of space. That‘s why I developed this folding wheelbarrow. When you need it, you fold it up quickly and when you don‘t, you store it flat as it is.',
                medien: Array.from({ length: 16 }, (_, i) => ({ type: 'image', src: `Projektbilder/Faltkarre/Bild (${i + 1}).jpg` }))
            },
            'tin-3d': {
                titel: 'Tin 3D Printer',
                titelBild: 'Handwritten_Titles/Tin_3D_Printer.png',
                beschreibung: 'Conventional tin has a relatively low melting point for a metal. This led to the idea of modifying an existing 3D printer to extrude tin. The entire project was highly experimental, and I worked based on trial and error.',
                medien: [
                    { type: 'video', src: 'Projektvideos/tin-3d.mp4' },
                    ...Array.from({ length: 6 }, (_, i) => ({ type: 'image', src: `Projektbilder/Tin_3D_Printer/Bild (${i + 1}).jpg` }))
                ]
            },
            'movement': {
                titel: 'Movement to Signal',
                titelBild: 'Handwritten_Titles/Movement_to_Signal.png',
                beschreibung: 'The “Movement to Signal” project is an experimental control element that visualizes the movement of the hands in relation to each other. It invites you to consciously movements and to explore the variations and gradations of the visual effects.',
                medien: Array.from({ length: 12 }, (_, i) => ({ type: 'image', src: `Projektbilder/Bewegung zum Signal/Bild (${i + 1}).jpg` }))
            },
            'new-tool': {
                titel: 'SLIDE',
                titelBild: 'Handwritten_Titles/Slide.png',
                beschreibung: 'SLIDE is a bag filling aid for people with motor and/or mental disabilities. Especially for people with one arm. The project was developed in cooperation with the Gottessegen workshops in Dortmund.',
                medien: Array.from({ length: 9 }, (_, i) => ({ type: 'image', src: `Projektbilder/New_Tool/Bild (${i + 1}).jpg` }))
            },
            'sketches': {
                titel: 'Sketches',
                titelBild: 'Handwritten_Titles/Sketches.png',
                beschreibung: 'Some sketches I created over the years.',
                medien: Array.from({ length: 11 }, (_, i) => ({ type: 'image', src: `Projektbilder/Sketches/Bild (${i + 1}).jpg` }))
            }
        };
        
        const projektKeys = Object.keys(projektDaten);
        
        new Image().src = 'Projektbilder/Ashoka_Dupe/Bild (1).jpg';

        function muteAllVideos() {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                video.muted = true;
                video.volume = 0;
                video.play().catch(error => {});
            });
        }

        function toggleInfoOverlay(event) {
            if (event) event.stopPropagation();
            isInfoOverlayOpen = !isInfoOverlayOpen;
            projekteContainer.classList.toggle('info-overlay-active');

            if (isInfoOverlayOpen) {
                const aktuellesProjekt = projektDaten[projektKeys[aktuellerProjektIndex]];
                overlayTitleImg.src = aktuellesProjekt.titelBild;
                overlayTitleImg.alt = aktuellesProjekt.titel;
                overlayDescription.innerHTML = aktuellesProjekt.beschreibung;
            } else {
                if (customCursor) customCursor.style.opacity = '0';
            }
        }

        function initProjekte() {
            if (!projekteContainer || !projektNav || !projektSlidesContainer || !infoToggleButton) {
                console.error("Ein oder mehrere benötigte Elemente für die Projektseite wurden nicht gefunden.");
                return;
            }
            
            projektNav.innerHTML = '';
            projektSlidesContainer.innerHTML = '';

            projektKeys.forEach((key, index) => {
                const navDot = document.createElement('span');
                navDot.className = 'projekt-nav-dot';
                navDot.dataset.index = index;
                navDot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (isInfoOverlayOpen) return;
                    zeigeProjekt(index);
                });
                projektNav.appendChild(navDot);

                const slide = document.createElement('div');
                slide.className = 'projekt-slide';
                slide.dataset.key = key;

                const filmstrip = document.createElement('div');
                filmstrip.className = 'media-filmstrip';

                const originalMedien = projektDaten[key].medien;
                
                if (originalMedien.length > 1) {
                    const count = originalMedien.length;
                    const actualCloneCount = Math.min(count, CLONE_COUNT);
                    const clonesToPrepend = originalMedien.slice(-actualCloneCount);
                    const clonesToAppend = originalMedien.slice(0, actualCloneCount);
                    const allMediaData = [...clonesToPrepend, ...originalMedien, ...clonesToAppend];
                    
                    allMediaData.forEach(mediaData => {
                        filmstrip.appendChild(createMediaElement(mediaData));
                    });
                    
                    slide.dataset.prependedClones = clonesToPrepend.length;
                    slide.dataset.realCount = count;
                } else {
                    originalMedien.forEach(mediaData => {
                        filmstrip.appendChild(createMediaElement(mediaData));
                    });
                    slide.dataset.prependedClones = 0;
                    slide.dataset.realCount = originalMedien.length;
                }

                filmstrip.addEventListener('transitionend', (e) => {
                    if (e.target === filmstrip) {
                        handleTransitionEnd(slide);
                    }
                });
                slide.appendChild(filmstrip);
                projektSlidesContainer.appendChild(slide);
            });

            zeigeProjekt(0, true);
            infoToggleButton.addEventListener('click', toggleInfoOverlay);
            if (infoPaper) {
                infoPaper.addEventListener('click', toggleInfoOverlay);
            }
        }
        
        function createMediaElement(mediaData) {
            let mediaElement;
            if (mediaData.type === 'image') mediaElement = new Image();
            else if (mediaData.type === 'video') mediaElement = document.createElement('video');
            else if (mediaData.type === 'model') mediaElement = document.createElement('model-viewer');

            if(mediaElement) {
                if (mediaElement.tagName === 'IMG') mediaElement.loading = 'lazy';
                if (mediaElement.tagName === 'VIDEO') Object.assign(mediaElement, { autoplay: true, loop: true, muted: true, playsInline: true });
                if (mediaElement.tagName === 'MODEL-VIEWER') {
                     mediaElement.setAttribute('camera-controls', '');
                     mediaElement.setAttribute('auto-rotate', '');
                }
                mediaElement.src = mediaData.src;
            }
            return mediaElement;
        }

        function zeigeProjekt(index, isInitial = false) {
            if (isChangingProject || isInfoOverlayOpen || index < 0 || index >= projektKeys.length || (!isInitial && index === aktuellerProjektIndex)) {
                return;
            }
            isChangingProject = true;
        
            const alterSlide = document.querySelector('.projekt-slide.active');
            const key = projektKeys[index];
            const neuerSlide = document.querySelector(`.projekt-slide[data-key="${key}"]`);
        
            document.querySelectorAll('.projekt-nav-dot').forEach(n => n.classList.remove('active'));
            document.querySelector(`.projekt-nav-dot[data-index="${index}"]`).classList.add('active');
            
            const filmstrip = neuerSlide.querySelector('.media-filmstrip');
            const firstRealElementIndex = parseInt(neuerSlide.dataset.prependedClones, 10);
            
            // On initial load, just set the state. Positioning is handled by the click logic.
            if (isInitial) {
                if(alterSlide) alterSlide.classList.remove('active');
                neuerSlide.classList.add('active');
                neuerSlide.dataset.currentIndex = firstRealElementIndex;
                
                // Pre-activate the first image to make it sharp from the start
                const firstImage = filmstrip.children[firstRealElementIndex];
                if (firstImage) {
                    firstImage.classList.add('media-active');
                }
                
                aktuellerProjektIndex = index;
                isChangingProject = false;
                return;
            }

            // For all subsequent clicks, perform the full crossfade
            const performCrossfade = () => {
                if (alterSlide) {
                    alterSlide.classList.remove('active');
                }
                neuerSlide.classList.add('active');
                
                const medien = Array.from(filmstrip.children);
                medien.forEach(el => el.classList.remove('media-active'));
                
                medien[firstRealElementIndex].classList.add('media-active');
                
                positioniereFilmstreifen(neuerSlide, firstRealElementIndex);
                muteAllVideos();
        
                aktuellerProjektIndex = index;
                setTimeout(() => { isChangingProject = false; }, 500);
            };
            
            const firstRealMediaElement = filmstrip.children[firstRealElementIndex];
            if (firstRealMediaElement && firstRealMediaElement.tagName === 'IMG' && !firstRealMediaElement.complete) {
                firstRealMediaElement.onload = performCrossfade;
                firstRealMediaElement.onerror = performCrossfade;
            } else {
                performCrossfade();
            }
        }
        
        function positioniereFilmstreifen(slide, newIndex) {
            const filmstrip = slide.querySelector('.media-filmstrip');
            if (!slide || !filmstrip) return;
            
            slide.dataset.currentIndex = newIndex;
            const targetMedium = filmstrip.children[newIndex];
            if (!targetMedium) return;

            const containerWidth = slide.offsetWidth;

            // This should not happen with requestAnimationFrame, but as a fallback:
            if (containerWidth === 0) {
                 console.warn("Positioning failed, retrying...");
                 requestAnimationFrame(() => positioniereFilmstreifen(slide, newIndex));
                 return;
            }
            
            const mediumWidth = targetMedium.offsetWidth;
            const mediumOffsetLeft = targetMedium.offsetLeft;
            const translateX = (containerWidth / 2) - (mediumWidth / 2) - mediumOffsetLeft;

            filmstrip.style.transform = `translateX(${translateX}px)`;
        }
        
        function handleTransitionEnd(slide) {
            const filmstrip = slide.querySelector('.media-filmstrip');
            let currentIndex = parseInt(slide.dataset.currentIndex, 10);
            const prependedClones = parseInt(slide.dataset.prependedClones, 10);
            const realCount = parseInt(slide.dataset.realCount, 10);
            
            if (realCount <= 1) {
                isNavigating = false;
                return;
            }

            const anfangDerEchtenBilder = prependedClones;
            const endeDerEchtenBilder = prependedClones + realCount - 1;
            
            let neuerEchterIndex = -1;

            if (currentIndex > endeDerEchtenBilder) {
                neuerEchterIndex = anfangDerEchtenBilder + (currentIndex - 1 - endeDerEchtenBilder);
            }
            if (currentIndex < anfangDerEchtenBilder) {
                 neuerEchterIndex = endeDerEchtenBilder - (anfangDerEchtenBilder - 1 - currentIndex);
            }

            if (neuerEchterIndex !== -1) {
                filmstrip.classList.add('no-transition');
                
                const medien = Array.from(filmstrip.children);
                medien.forEach(el => el.classList.remove('media-active'));
                medien[neuerEchterIndex].classList.add('media-active');

                positioniereFilmstreifen(slide, neuerEchterIndex);
                
                setTimeout(() => {
                    filmstrip.classList.remove('no-transition');
                    isNavigating = false;
                }, 50);
            } else {
                isNavigating = false;
            }
        }

        const handleNav = (direction) => {
            if (isInfoOverlayOpen) return;
            const aktiverSlide = document.querySelector('.projekt-slide.active');
            if (!aktiverSlide || isNavigating) return;
            isNavigating = true;

            const filmstrip = aktiverSlide.querySelector('.media-filmstrip');
            const medien = Array.from(filmstrip.children);
            const currentIndex = parseInt(aktiverSlide.dataset.currentIndex, 10);
            const nextIndex = currentIndex + direction;

            const currentElement = medien[currentIndex];
            const nextElement = medien[nextIndex];
            
            if (currentElement) {
                setTimeout(() => {
                    currentElement.classList.remove('media-active');
                }, 250);
            }

            if (nextElement) {
                nextElement.classList.add('media-active');
            }
            
            filmstrip.classList.add('transitioning');
            positioniereFilmstreifen(aktiverSlide, nextIndex);
        };
        
        projektContainerWrapper.addEventListener('wheel', (event) => {
            if (isInfoOverlayOpen) return;
            event.preventDefault();
            if (isChangingProject) return;
            
            if (event.deltaY > 20) zeigeProjekt(aktuellerProjektIndex + 1);
            else if (event.deltaY < -20) zeigeProjekt(aktuellerProjektIndex - 1);
        });
        
        projektContainerWrapper.addEventListener('mousemove', (event) => {
            if (isInfoOverlayOpen || !customCursor) {
                if (customCursor) customCursor.style.opacity = '0';
                return;
            }
            customCursor.style.opacity = '1';
            customCursor.style.left = `${event.clientX}px`;
            customCursor.style.top = `${event.clientY}px`;
            
            const rect = projekteContainer.getBoundingClientRect();
            const midpoint = rect.left + rect.width / 2;
            if (event.clientX < midpoint) {
                customCursor.textContent = '<';
            } else {
                customCursor.textContent = '>';
            }
        });
        
        projektContainerWrapper.addEventListener('mouseenter', () => { if(customCursor && !isInfoOverlayOpen) customCursor.style.opacity = '1'; });
        projektContainerWrapper.addEventListener('mouseleave', () => { if(customCursor) customCursor.style.opacity = '0'; });
        
        projektContainerWrapper.addEventListener('click', (event) => {
            if (event.target.closest('.info-toggle-button') || event.target.closest('.info-paper') || event.target.closest('.info-overlay')) return;
            if (isInfoOverlayOpen) return;
            
            const rect = projekteContainer.getBoundingClientRect();
            const midpoint = rect.left + rect.width / 2;
            if (event.clientX < midpoint) handleNav(-1); else handleNav(1);
        });

        window.addEventListener('resize', () => {
            const aktiverSlide = document.querySelector('.projekt-slide.active');
            if(aktiverSlide && projektContainerWrapper.classList.contains('active')) {
                const currentIndex = parseInt(aktiverSlide.dataset.currentIndex, 10);
                positioniereFilmstreifen(aktiverSlide, currentIndex);
            }
        });

        initProjekte();
        
        let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;

        projektContainerWrapper.addEventListener('touchstart', (e) => {
            if (isInfoOverlayOpen) return;
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, false);
		
        projektContainerWrapper.addEventListener('touchmove', (e) => { 
            if (isInfoOverlayOpen) return;
            e.preventDefault(); 
        }, { passive: false });

        projektContainerWrapper.addEventListener('touchend', (e) => {
            if (isInfoOverlayOpen) return;
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, false); 

        function handleSwipe() {
            const deltaX = touchEndX - touchStartX, deltaY = touchEndY - touchStartY, swipeThreshold = 50;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > swipeThreshold) { if (deltaX > 0) handleNav(-1); else handleNav(1); }
            } else {
                if (Math.abs(deltaY) > swipeThreshold) { if (deltaY > 0) zeigeProjekt(aktuellerProjektIndex - 1); else zeigeProjekt(aktuellerProjektIndex + 1); }
            }
        }
    }

    // =======================================================
    // LOGIK FÜR MARQUEE (Wird am Ende ausgeführt)
    // =======================================================
    const marqueeContainers = document.querySelectorAll('.marquee-container');
    marqueeContainers.forEach(container => {
        const sharpContent = container.querySelector('.marquee-content.sharp');
        const blurryContent = container.querySelector('.marquee-content.blurry');

        if (sharpContent && blurryContent) {
            const originalChildren = Array.from(sharpContent.children);
            
            originalChildren.forEach(child => {
                sharpContent.appendChild(child.cloneNode(true));
                blurryContent.appendChild(child.cloneNode(true));
            });
        }
    });

});