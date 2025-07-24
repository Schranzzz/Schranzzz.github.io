document.addEventListener('DOMContentLoaded', function() {

    // =======================================================
    // LOGIK FÜR ORDNER-TABS
    // =======================================================
    var tabsContainer = document.querySelector('.ordner-tabs');
    var tabs = document.querySelectorAll('.tab');
    var contentPages = document.querySelectorAll('.ordner-inhalt');
    var ordnerInhaltStapel = document.querySelector('.ordner-inhalt-stapel');
    
    if (tabsContainer) {
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
            if (targetContent) targetContent.classList.add('active');
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
    const projektContainer = document.querySelector('.ordner-inhalt[data-content="projekte"]');

    if (projektContainer) {
        function muteAllVideos() {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                video.muted = true;
                video.volume = 0;
                video.play().catch(error => {});
            });
        }

        // KORREKTUR: Zurück zur Version ohne .title Eigenschaften
        const projektDaten = {
            'ashoka-dupe': {
                titelBild: 'Handwritten_Titles/Ashoka_Dupe.png',
                beschreibung: 'Inspired by the legendary design of the Ashoka lamp by Etorre Sottsass for Memphis milano I created this modern recreation. <em>Modell mit der Maus ziehen zum Drehen, Mausrad zum Zoomen.</em>',
                medien: [ { type: 'model', src: 'data/Ashoka-dupe.glb' } ]
            },
            'leiter': {
                titelBild: 'Handwritten_Titles/Decorated_Ladder.png',
                beschreibung: 'What could decorations for a ladder look like that would make the ladder and its exclusive ornaments a worthy successor to the traditional Christmas tree?',
                medien: [
                    { type: 'video', src: 'Projektvideos/leiter.mp4' },
                    ...Array.from({ length: 4 }, (_, i) => ({ type: 'image', src: `Projektbilder/Leiter/Bild (${i + 1}).jpg` }))
                ]
            },
            'faltkarre': {
                titelBild: 'Handwritten_Titles/faltkarre.png',
                beschreibung: 'The wheelbarrow in private use can take up a lot of space. That‘s why I developed this folding wheelbarrow. When you need it, you fold it up quickly and when you don‘t, you store it flat as it is.',
                medien: Array.from({ length: 8 }, (_, i) => ({ type: 'image', src: `Projektbilder/Faltkarre/Bild (${i + 1}).jpg` }))
            },
            'tin-3d': {
                titelBild: 'Handwritten_Titles/Tin_3D_Printer.png',
                beschreibung: 'Conventional tin has a relatively low melting point for a metal. This led to the idea of modifying an existing 3D printer to extrude tin. The entire project was highly experimental, and I worked based on trial and error.',
                medien: [
                    { type: 'video', src: 'Projektvideos/tin-3d.mp4' },
                    ...Array.from({ length: 3 }, (_, i) => ({ type: 'image', src: `Projektbilder/Tin_3D_Printer/Bild (${i + 1}).jpg` }))
                ]
            },
            'movement': {
                titelBild: 'Handwritten_Titles/Movement_to_signal.png',
                beschreibung: 'The “Movement to signal” project is an experimental control element that visualizes the movement of the hands in relation to each other. It invites you to consciously movements and to explore the variations and gradations of the visual effects.',
                medien: Array.from({ length: 34 }, (_, i) => ({ type: 'image', src: `Projektbilder/Bewegung zum signal/Bild (${i + 1}).jpg` }))
            },
            'new-tool': {
                titelBild: 'Handwritten_Titles/Slide.png',
                beschreibung: 'SLIDE is a bag filling aid for people with motor and/or mental disabilities. Especially for people with one arm. The project was developed in cooperation with the Gottessegen workshops in Dortmund.',
                medien: Array.from({ length: 19 }, (_, i) => ({ type: 'image', src: `Projektbilder/New_Tool/Bild (${i + 1}).jpg` }))
            },
            'sketches': {
                titelBild: 'Handwritten_Titles/Sketches.png',
                beschreibung: 'Some sketches I created over the years.',
                medien: Array.from({ length: 5 }, (_, i) => ({ type: 'image', src: `Projektbilder/Sketches/Bild (${i + 1}).jpg` }))
            }
        };

        const projektNav = document.getElementById('projekt-nav');
        const projektSlidesContainer = document.getElementById('projekt-slides');
        const projektInfoBox = document.getElementById('projekt-info');
        const pfeilLinks = document.getElementById('pfeil-links');
        const pfeilRechts = document.getElementById('pfeil-rechts');

        const projektKeys = Object.keys(projektDaten);
        let aktuellerProjektIndex = 0;
        let isNavigating = false;
        let isVScrolling = false;
        const CLONE_COUNT = 5;

        function initProjekte() {
            projektNav.innerHTML = '';
            projektSlidesContainer.innerHTML = '';

            projektKeys.forEach((key, index) => {
                const projekt = projektDaten[key];
                
                const navLink = document.createElement('a');
                navLink.className = 'projekt-nav-link';
                navLink.dataset.index = index;
                // KORREKTUR: Zurück zu <img> Tags für die Titel
                navLink.innerHTML = `<img src="${projekt.titelBild}" alt="${key}">`;
                navLink.addEventListener('click', () => zeigeProjekt(index));
                projektNav.appendChild(navLink);

                const slide = document.createElement('div');
                slide.className = 'projekt-slide';
                slide.dataset.key = key;

                const filmstrip = document.createElement('div');
                filmstrip.className = 'media-filmstrip';

                const originalMedien = [];
                projekt.medien.forEach(mediaData => {
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
                        originalMedien.push(mediaElement);
                    }
                });
                
                if (originalMedien.length > 1) {
                    const count = originalMedien.length;
                    const clonesToPrepend = originalMedien.slice(-CLONE_COUNT).map(el => el.cloneNode(true));
                    const clonesToAppend = originalMedien.slice(0, CLONE_COUNT).map(el => el.cloneNode(true));
                    
                    [...clonesToPrepend, ...originalMedien, ...clonesToAppend].forEach(el => filmstrip.appendChild(el));
                    slide.dataset.prependedClones = clonesToPrepend.length;
                    slide.dataset.realCount = count;
                } else {
                    originalMedien.forEach(el => filmstrip.appendChild(el));
                    slide.dataset.prependedClones = 0;
                    slide.dataset.realCount = originalMedien.length;
                }

                filmstrip.addEventListener('transitionend', () => handleTransitionEnd(slide));
                slide.appendChild(filmstrip);
                projektSlidesContainer.appendChild(slide);
            });

            muteAllVideos();
            zeigeProjekt(0);
        }

        function zeigeProjekt(index) {
            if (index < 0 || index >= projektKeys.length) return;
            aktuellerProjektIndex = index;
            const key = projektKeys[index];
            
            document.querySelectorAll('.projekt-nav-link').forEach(n => n.classList.remove('active'));
            document.querySelector(`.projekt-nav-link[data-index="${index}"]`).classList.add('active');
            
            document.querySelectorAll('.projekt-slide').forEach(s => s.classList.remove('active'));
            const aktiverSlide = document.querySelector(`.projekt-slide[data-key="${key}"]`);
            aktiverSlide.classList.add('active');
            
            projektInfoBox.innerHTML = projektDaten[key].beschreibung;
            
            const prependedClones = parseInt(aktiverSlide.dataset.prependedClones, 10);
            
            setTimeout(() => {
                positioniereFilmstreifen(aktiverSlide, prependedClones, false);
                muteAllVideos();
            }, 50); 
        }
        
        function positioniereFilmstreifen(slide, newIndex, mitAnimation) {
            const filmstrip = slide.querySelector('.media-filmstrip');
            const medien = Array.from(filmstrip.children);
            
            if (!mitAnimation) {
                medien.forEach(el => el.classList.remove('media-active', 'was-active'));
                if(medien[newIndex]) medien[newIndex].classList.add('media-active');
            }

            const realCount = parseInt(slide.dataset.realCount, 10);
            if (realCount > 1) {
                pfeilLinks.classList.add('sichtbar');
                pfeilRechts.classList.add('sichtbar');
            } else {
                pfeilLinks.classList.remove('sichtbar');
                pfeilRechts.classList.remove('sichtbar');
            }
            if (medien.length === 0) return;

            slide.dataset.currentIndex = newIndex;

            const targetMedium = medien[newIndex];
            if (!targetMedium) return;

            const containerWidth = slide.offsetWidth;
            const mediumWidth = targetMedium.offsetWidth || containerWidth;
            const mediumOffsetLeft = targetMedium.offsetLeft;
            const translateX = (containerWidth / 2) - (mediumWidth / 2) - mediumOffsetLeft;

            filmstrip.classList.toggle('transitioning', mitAnimation);
            filmstrip.style.transform = `translateX(${translateX}px)`;
        }
        
        function handleTransitionEnd(slide) {
            isNavigating = false;

            const oldActive = slide.querySelector('.was-active');
            if (oldActive) {
                oldActive.classList.remove('media-active', 'was-active');
            }

            let currentIndex = parseInt(slide.dataset.currentIndex, 10);
            const prependedClones = parseInt(slide.dataset.prependedClones, 10);
            const realCount = parseInt(slide.dataset.realCount, 10);
            
            if (realCount <= 1) return;

            const anfangDerEchtenBilder = prependedClones;
            const endeDerEchtenBilder = prependedClones + realCount - 1;

            if (currentIndex > endeDerEchtenBilder) {
                positioniereFilmstreifen(slide, anfangDerEchtenBilder, false);
            } else if (currentIndex < anfangDerEchtenBilder) {
                positioniereFilmstreifen(slide, endeDerEchtenBilder, false);
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
                currentElement.classList.add('was-active');
            }
            if (nextElement) {
                nextElement.classList.add('media-active');
            }
            
            positioniereFilmstreifen(aktiverSlide, nextIndex, true);
        };
        
        // Event Listeners
        projektContainer.addEventListener('wheel', (event) => {
            event.preventDefault();
            if (isVScrolling) return;
            isVScrolling = true;
            if (event.deltaY > 20) zeigeProjekt(aktuellerProjektIndex + 1);
            else if (event.deltaY < -20) zeigeProjekt(aktuellerProjektIndex - 1);
            setTimeout(() => { isVScrolling = false; }, 700);
        });
        
        pfeilRechts.addEventListener('click', () => handleNav(1));
        pfeilLinks.addEventListener('click', () => handleNav(-1));

        window.addEventListener('resize', () => {
            const aktiverSlide = document.querySelector('.projekt-slide.active');
            if(aktiverSlide) {
                const currentIndex = parseInt(aktiverSlide.dataset.currentIndex, 10);
                positioniereFilmstreifen(aktiverSlide, currentIndex, false);
            }
        });

        initProjekte();
    }
});