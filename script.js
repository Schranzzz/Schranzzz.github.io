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

            if (tabToActivate.dataset.tabTarget === 'projekte' && !hasProjectsBeenInitialized) {
                hasProjectsBeenInitialized = true;
                
                requestAnimationFrame(() => {
                    const aktiverSlide = document.querySelector('.projekt-slide.active');
                    if (aktiverSlide) {
                        const currentIndex = parseInt(aktiverSlide.dataset.currentIndex, 10);
                        positioniereFilmstreifen(aktiverSlide, currentIndex);
                    }
                });
            }

            const contentZIndex = 5;
            tabToActivate.style.zIndex = contentZIndex + 1;

            let zCounter = contentZIndex - 1;
            tabs.forEach(t => {
                if (t !== tabToActivate) {
                    t.style.zIndex = zCounter;
                    zCounter--;
                }
            });
        }

        tabsContainer.addEventListener('click', (event) => setActiveState(event.target.closest('.tab')));

        tabs.forEach(tab => {
            tab.addEventListener('mouseenter', () => {
                if (tab.classList.contains('active')) {
                    ordnerInhaltStapel.classList.add('is-lifted');
                }
            });

            tab.addEventListener('mouseleave', () => {
                ordnerInhaltStapel.classList.remove('is-lifted');
            });
        });

        setActiveState(document.querySelector('.tab'), true);
    }

    // =======================================================
    // LOGIK FÜR PROJEKTSEITE
    // =======================================================
    const projektContainerWrapper = document.querySelector('.ordner-inhalt[data-content="projekte"]');

    if (projektContainerWrapper) {
        const projekteContainer = document.getElementById('projekte-container');
        const customCursor = document.getElementById('custom-cursor');
        const projektInfoDescription = document.getElementById('projekt-info-description');
        const projektNav = document.getElementById('projekt-nav');
        const projektSlidesContainer = document.getElementById('projekt-slides');
        const contrastCanvas = document.createElement('canvas');
        const contrastContext = contrastCanvas.getContext('2d', { willReadFrequently: true });
        
        let aktuellerProjektIndex = 0;
        let isNavigating = false;
        let isChangingProject = false;

        const CLONE_COUNT = 5;

        const projektDaten = {

'new-tool': {
                titel: 'DUSTE',
                beschreibung: 'Stackable, modular Lithing system. <br><br> <p> </p>70x45cm  <p> </p>Aluminum, Corugated Plastic, LED bulbs.  <p> </p> 2026',
                medien: Array.from({ length: 5 }, (_, i) => ({ type: 'image', src: `Projektbilder/New_Tool/Bild (${i + 1}).jpg` }))
            },



             'tin-3d': {
                titel: 'TIN 3D PRINTER',
                beschreibung: 'Conventional tin has a relatively low melting point for a metal. This led to the idea of modifying an existing 3D printer to extrude tin. The entire project was highly experimental, and I worked based on trial and error. <br><br><p> </p> 65x65cm  <p> </p> Ender 3 3D Printer  <p> </p> 2024',
                medien: [
                    { type: 'video', src: 'Projektvideos/tin-3d.mp4' },
                    ...Array.from({ length: 6 }, (_, i) => ({ type: 'image', src: `Projektbilder/Tin_3D_Printer/Bild (${i + 1}).jpg` }))
                ]
            },

                  'faltkarre': {
                titel: 'FOLDING WHEELBARROW',
                beschreibung: 'A wheelbarrow can take up a lot of space. That‘s why I developed this folding wheelbarrow. When you need it, you fold it up quickly and when you don‘t, you store it flat as it is.<br><br> <p> </p> 120x60cm  <p> </p> Truck Tarp, plywood, Aluminum Rods, rubber. <p> </p> 2025',
                medien: Array.from({ length: 16 }, (_, i) => ({ type: 'image', src: `Projektbilder/Faltkarre/Bild (${i + 1}).jpg` }))
            },

            'ashoka-dupe': {
                titel: 'ASHOKA DUPE',
                beschreibung: 'Inspired by the legendary design of the Ashoka lamp by Etorre Sottsass for Memphis milano I created this modern recreation.  <br><br><p> </p> 60x60cm  <p> </p> Aluminum, Bulbs, PLA printed parts. <p> </p> 2025',
                medien: Array.from({ length: 3 }, (_, i) => ({ type: 'image', src: `Projektbilder/Ashoka_Dupe/Bild (${i + 1}).jpg` }))
            },



            'leiter': {
                titel: 'DECORATED LADDER',
                beschreibung: 'What could decorations for a ladder look like that would make the ladder and its exclusive ornaments a worthy successor to the traditional Christmas tree?  <br><br><p> </p> 200x100cm  <p> </p> Wooden Ladder, PLA printed parts. <p> </p> 2023',
                medien: 
                    
                    Array.from({ length: 11 }, (_, i) => ({ type: 'image', src: `Projektbilder/Leiter/Bild (${i + 1}).jpg` }))
                
            },

          

           /*  'movement': {
                titel: 'Movement to Signal',
                beschreibung: 'The “Movement to Signal” project is an experimental control element that visualizes the movement of the hands in relation to each other. It invites you to consciously movements and to explore the variations and gradations of the visual effects.',
                medien: Array.from({ length: 12 }, (_, i) => ({ type: 'image', src: `Projektbilder/Bewegung zum Signal/Bild (${i + 1}).jpg` }))
            },  */

          
/*
            'sketches': {
                titel: 'Sketches',
                beschreibung: 'Some sketches I created over the years.',
                medien: Array.from({ length: 11 }, (_, i) => ({ type: 'image', src: `Projektbilder/Sketches/Bild (${i + 1}).jpg` }))
            } */
        };
        
        const projektKeys = Object.keys(projektDaten);
        
        new Image().src = 'Projektbilder/Tin_Dripper/Bild (1).jpg';

        function muteAllVideos() {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                video.muted = true;
                video.volume = 0;
                video.play().catch(error => {});
            });
        }

        function updateProjektInfo(index) {
            const aktuellesProjekt = projektDaten[projektKeys[index]];

            if (!aktuellesProjekt || !projektInfoDescription) return;

            projektInfoDescription.innerHTML = aktuellesProjekt.beschreibung;
        }

        function scheduleProjectTextContrastUpdate() {
            requestAnimationFrame(() => {
                updateProjectTextContrast();
                setTimeout(updateProjectTextContrast, 120);
            });
        }

        function updateProjectTextContrast() {
    updateContrastForElement(projektNav);

    const projektInfo = document.querySelector('.projekt-info');
    if (projektInfo) {
        updateContrastForElement(projektInfo);
    }
}

        function updateContrastForElement(element) {
            if (!element || !contrastContext) return;

            const luminance = getLuminanceBehindElement(element);
            if (luminance === null) return;

            element.classList.toggle('is-on-light', luminance > 150);
            element.classList.toggle('is-on-dark', luminance <= 100);
        }

        function getLuminanceBehindElement(element) {
            const activeSlide = document.querySelector('.projekt-slide.active');
            if (!activeSlide) return null;

            const targetRect = element.getBoundingClientRect();
            const frames = Array.from(activeSlide.querySelectorAll('.media-frame'));
            let weightedLuminance = 0;
            let totalArea = 0;

            frames.forEach(frame => {
                const frameRect = frame.getBoundingClientRect();
                const overlap = getRectOverlap(targetRect, frameRect);

                if (!overlap) return;

                const mediaLuminance = sampleMediaFrameLuminance(frame, frameRect, overlap);
                if (mediaLuminance === null) return;

                const area = overlap.width * overlap.height;
                weightedLuminance += mediaLuminance * area;
                totalArea += area;
            });

          if (totalArea === 0) {
    return getPaperOverlayAlpha(targetRect) > 0.3 ? 232 : 0;
}

            const averageLuminance = weightedLuminance / totalArea;
            const paperOverlayAlpha = getPaperOverlayAlpha(targetRect);

            return (averageLuminance * (1 - paperOverlayAlpha)) + (232 * paperOverlayAlpha);
        }

        function getPaperOverlayAlpha(targetRect) {
    if (!projekteContainer) return 0;

    const containerRect = projekteContainer.getBoundingClientRect();
    const overlayHeight = 96;
    const centerY = targetRect.top + (targetRect.height / 2);
    const distanceFromTop = Math.max(0, centerY - containerRect.top);

    const topAlpha = distanceFromTop < overlayHeight
        ? 1 - (distanceFromTop / overlayHeight)
        : 0;

    return topAlpha;
}

        function getRectOverlap(a, b) {
            const left = Math.max(a.left, b.left);
            const top = Math.max(a.top, b.top);
            const right = Math.min(a.right, b.right);
            const bottom = Math.min(a.bottom, b.bottom);

            if (right <= left || bottom <= top) return null;

            return {
                left,
                top,
                width: right - left,
                height: bottom - top
            };
        }

        function sampleMediaFrameLuminance(frame, frameRect, overlap) {
            const media = frame.firstElementChild;
            if (!media) return null;

            const sourceWidth = media.videoWidth || media.naturalWidth || media.clientWidth;
            const sourceHeight = media.videoHeight || media.naturalHeight || media.clientHeight;

            if (!sourceWidth || !sourceHeight) return null;
            if (media.tagName === 'IMG' && !media.complete) return null;
            if (media.tagName === 'VIDEO' && media.readyState < 2) return null;

            const sampleWidth = 24;
            const sampleHeight = 24;
            const sourceX = ((overlap.left - frameRect.left) / frameRect.width) * sourceWidth;
            const sourceY = ((overlap.top - frameRect.top) / frameRect.height) * sourceHeight;
            const sourceSampleWidth = (overlap.width / frameRect.width) * sourceWidth;
            const sourceSampleHeight = (overlap.height / frameRect.height) * sourceHeight;

            contrastCanvas.width = sampleWidth;
            contrastCanvas.height = sampleHeight;
            contrastContext.clearRect(0, 0, sampleWidth, sampleHeight);

            try {
                contrastContext.drawImage(
                    media,
                    sourceX,
                    sourceY,
                    sourceSampleWidth,
                    sourceSampleHeight,
                    0,
                    0,
                    sampleWidth,
                    sampleHeight
                );
            } catch (error) {
                return null;
            }

            let pixels;

            try {
                pixels = contrastContext.getImageData(0, 0, sampleWidth, sampleHeight).data;
            } catch (error) {
                return null;
            }

            let luminance = 0;
            const pixelCount = pixels.length / 4;

            for (let i = 0; i < pixels.length; i += 4) {
                luminance += (0.2126 * pixels[i]) + (0.7152 * pixels[i + 1]) + (0.0722 * pixels[i + 2]);
            }

            luminance /= pixelCount;

            if (!frame.classList.contains('media-active')) {
                luminance = (luminance * 0.52) + (232 * 0.48);
            }

            return luminance;
        }

        function initProjekte() {
            if (!projekteContainer || !projektNav || !projektSlidesContainer || !projektInfoDescription) {
                console.error("Ein oder mehrere benötigte Elemente für die Projektseite wurden nicht gefunden.");
                return;
            }
            
            projektNav.innerHTML = '';
            projektSlidesContainer.innerHTML = '';

            projektKeys.forEach((key, index) => {
             const navItem = document.createElement('button');
navItem.className = 'projekt-nav-item';
navItem.dataset.index = index;
navItem.textContent = projektDaten[key].titel;

navItem.addEventListener('click', (e) => {
    e.stopPropagation();
    zeigeProjekt(index);
});

projektNav.appendChild(navItem);

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
        }
        
        function createMediaElement(mediaData) {
            const mediaFrame = document.createElement('div');
            mediaFrame.className = 'media-frame';
            let mediaElement;

            if (mediaData.type === 'image') {
                mediaElement = new Image();
            } else if (mediaData.type === 'video') {
                mediaElement = document.createElement('video');
            } else if (mediaData.type === 'model') {
                mediaElement = document.createElement('model-viewer');
            }

            if (mediaElement) {
                if (mediaElement.tagName === 'IMG') {
                    mediaElement.loading = 'lazy';
                }

           if (mediaElement.tagName === 'VIDEO') {
    Object.assign(mediaElement, {
        autoplay: true,
        loop: true,
        muted: true,
        playsInline: true,
        preload: 'auto'
    });

    mediaElement.addEventListener('loadedmetadata', () => {
        const aktiverSlide = document.querySelector('.projekt-slide.active');
        if (aktiverSlide) {
            const currentIndex = parseInt(aktiverSlide.dataset.currentIndex, 10);
            positioniereFilmstreifen(aktiverSlide, currentIndex);
        }
    });

    mediaElement.addEventListener('loadeddata', () => {
        const aktiverSlide = document.querySelector('.projekt-slide.active');
        if (aktiverSlide) {
            const currentIndex = parseInt(aktiverSlide.dataset.currentIndex, 10);
            positioniereFilmstreifen(aktiverSlide, currentIndex);
        }
    });
}

                if (mediaElement.tagName === 'MODEL-VIEWER') {
                    mediaElement.setAttribute('camera-controls', '');
                    mediaElement.setAttribute('auto-rotate', '');
                }

                mediaElement.src = mediaData.src;
            }

            if (mediaElement) {
                mediaFrame.appendChild(mediaElement);
            }

            return mediaFrame;
        }

        function zeigeProjekt(index, isInitial = false) {
            if (
                isChangingProject ||
                index < 0 ||
                index >= projektKeys.length ||
                (!isInitial && index === aktuellerProjektIndex)
            ) {
                return;
            }

            isChangingProject = true;
        
            const alterSlide = document.querySelector('.projekt-slide.active');
            const key = projektKeys[index];
            const neuerSlide = document.querySelector(`.projekt-slide[data-key="${key}"]`);
        
            document.querySelectorAll('.projekt-nav-item').forEach(n => n.classList.remove('active'));
document.querySelector(`.projekt-nav-item[data-index="${index}"]`).classList.add('active');
            
            const filmstrip = neuerSlide.querySelector('.media-filmstrip');
            const firstRealElementIndex = parseInt(neuerSlide.dataset.prependedClones, 10);
            
            if (isInitial) {
                if (alterSlide) alterSlide.classList.remove('active');

                neuerSlide.classList.add('active');
                neuerSlide.dataset.currentIndex = firstRealElementIndex;
                
                const firstImage = filmstrip.children[firstRealElementIndex];
                if (firstImage) {
                    firstImage.classList.add('media-active');
                }
                
                aktuellerProjektIndex = index;
                updateProjektInfo(index);
                scheduleProjectTextContrastUpdate();
                isChangingProject = false;
                return;
            }

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
                updateProjektInfo(index);
                scheduleProjectTextContrastUpdate();

                setTimeout(() => {
                    isChangingProject = false;
                }, 500);
            };
            
            const firstRealFrame = filmstrip.children[firstRealElementIndex];
            const firstRealMediaElement = firstRealFrame ? firstRealFrame.firstElementChild : null;

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
                scheduleProjectTextContrastUpdate();
                
                setTimeout(() => {
                    filmstrip.classList.remove('no-transition');
                    isNavigating = false;
                }, 50);
            } else {
                isNavigating = false;
            }
        }

        const handleNav = (direction) => {
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
            scheduleProjectTextContrastUpdate();
        };
        
        projektContainerWrapper.addEventListener('wheel', (event) => {
            event.preventDefault();

            if (isChangingProject) return;
            
            if (event.deltaY > 20) {
                zeigeProjekt(aktuellerProjektIndex + 1);
            } else if (event.deltaY < -20) {
                zeigeProjekt(aktuellerProjektIndex - 1);
            }
        });
        
        projektContainerWrapper.addEventListener('mousemove', (event) => {
            if (!customCursor) {
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
        
        projektContainerWrapper.addEventListener('mouseenter', () => {
            if (customCursor) customCursor.style.opacity = '1';
        });

        projektContainerWrapper.addEventListener('mouseleave', () => {
            if (customCursor) customCursor.style.opacity = '0';
        });
        
        projektContainerWrapper.addEventListener('click', (event) => {
            const rect = projekteContainer.getBoundingClientRect();
            const midpoint = rect.left + rect.width / 2;

            if (event.clientX < midpoint) {
                handleNav(-1);
            } else {
                handleNav(1);
            }
        });

        window.addEventListener('resize', () => {
            const aktiverSlide = document.querySelector('.projekt-slide.active');

            if (aktiverSlide && projektContainerWrapper.classList.contains('active')) {
                const currentIndex = parseInt(aktiverSlide.dataset.currentIndex, 10);
                positioniereFilmstreifen(aktiverSlide, currentIndex);
                scheduleProjectTextContrastUpdate();
            }
        });

        initProjekte();
        setInterval(() => {
            if (projektContainerWrapper.classList.contains('active')) {
                updateProjectTextContrast();
            }
        }, 650);
        
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        projektContainerWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, false);
		
        projektContainerWrapper.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        projektContainerWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;

            handleSwipe();
        }, false);

        function handleSwipe() {
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const swipeThreshold = 50;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > swipeThreshold) {
                    if (deltaX > 0) {
                        handleNav(-1);
                    } else {
                        handleNav(1);
                    }
                }
            } else {
                if (Math.abs(deltaY) > swipeThreshold) {
                    if (deltaY > 0) {
                        zeigeProjekt(aktuellerProjektIndex - 1);
                    } else {
                        zeigeProjekt(aktuellerProjektIndex + 1);
                    }
                }
            }
        }
    }

    // =======================================================
    // LOGIK FÜR MARQUEE
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
