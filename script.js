document.addEventListener('DOMContentLoaded', function() {

    var tabsContainer = document.querySelector('.ordner-tabs');
    var tabs = document.querySelectorAll('.tab');
    var contentPages = document.querySelectorAll('.ordner-inhalt');
    var ordnerInhaltStapel = document.querySelector('.ordner-inhalt-stapel');
    var ordnerInhaltSchatten = document.querySelector('.ordner-inhalt-Schatten');

    if (!tabsContainer || !ordnerInhaltStapel || !ordnerInhaltSchatten) return;

    function setActiveState(tabToActivate, isInitialLoad = false) {
        if (!tabToActivate || tabToActivate.classList.contains('active')) return;

        if (!isInitialLoad) {
            ordnerInhaltStapel.classList.add('no-transition');
            ordnerInhaltSchatten.classList.add('no-transition');
            ordnerInhaltStapel.classList.add('is-lifted');
            ordnerInhaltSchatten.classList.add('is-lifted');
            ordnerInhaltStapel.offsetHeight;
            ordnerInhaltStapel.classList.remove('no-transition');
            ordnerInhaltSchatten.classList.remove('no-transition');
        }

        tabs.forEach(function(t) { t.classList.remove('active'); });
        contentPages.forEach(function(p) { p.classList.remove('active'); });

        tabToActivate.classList.add('active');
        var targetContent = document.querySelector('.ordner-inhalt[data-content="' + tabToActivate.dataset.tabTarget + '"]');
        if (targetContent) {
            targetContent.classList.add('active');
        }

        const contentZIndex = 5; 
        tabToActivate.style.zIndex = contentZIndex + 1;
        let zCounter = contentZIndex - 1;
        tabs.forEach(function(t) {
            if (t !== tabToActivate) {
                t.style.zIndex = zCounter;
                zCounter--; 
            }
        });
    }

    tabsContainer.addEventListener('click', function(event) {
        setActiveState(event.target.closest('.tab'));
    });

    tabs.forEach(function(tab) {
        tab.addEventListener('mouseenter', function() {
            if (tab.classList.contains('active')) {
                ordnerInhaltStapel.classList.add('is-lifted');
                ordnerInhaltSchatten.classList.add('is-lifted');
            }
        });
        tab.addEventListener('mouseleave', function() {
            ordnerInhaltStapel.classList.remove('is-lifted');
            ordnerInhaltSchatten.classList.remove('is-lifted');
        });
    });

    setActiveState(document.querySelector('.tab'), true);

    // =======================================================
    // LOGIK FÜR PROJEKTSEITE
    // =======================================================

    const projektDaten = {
        'ashoka-dupe': { anzahl: 6, pfad: 'Projektbilder/Ashoka_Dupe/Bild', dateityp: 'jpg' },
        'leiter': { anzahl: 4, pfad: 'Projektbilder/Leiter/Bild', dateityp: 'jpg' },
        'faltkarre': { anzahl: 8, pfad: 'Projektbilder/Faltkarre/Bild', dateityp: 'jpg' },
        'tin-3d': { anzahl: 3, pfad: 'Projektbilder/Tin_3D_Printer/Bild', dateityp: 'jpg' },
        'movement': { anzahl: 34, pfad: 'Projektbilder/Bewegung zum signal/Bild', dateityp: 'jpg' },
        'new-tool': { anzahl: 2, pfad: 'Projektbilder/New_Tool/Bild', dateityp: 'png' },
        'sketches': { anzahl: 5, pfad: 'Projektbilder/Sketches/Bild', dateityp: 'jpg' }
    };

    const projektSeite = document.querySelector('.ordner-inhalt[data-content="projekte"]');

    if (projektSeite) {
        const detailsContainer = projektSeite.querySelector('.projekt-details-container');

        function updateGalleryAppearance(galleryContainer) {
            if (!galleryContainer) return;
            const allItems = Array.from(galleryContainer.querySelectorAll('.galerie-item'));
            if (allItems.length === 0) return;

            let topItem = null;
            let maxZ = -Infinity;

            allItems.forEach(item => {
                const z = parseInt(item.style.zIndex || '0', 10);
                if (z > maxZ) {
                    maxZ = z;
                    topItem = item;
                }
            });

            allItems.forEach(item => {
                const rot = item.dataset.rotation || 0;
                const transX = item.dataset.offsetX || 0;
                const transY = item.dataset.offsetY || 0;
                let scale = 0.95;

                item.classList.remove('is-top');

                if (item === topItem) {
                    scale = 1.0;
                    item.classList.add('is-top');
                }
                
                item.style.transform = `translate(${transX}px, ${transY}px) rotate(${rot}deg) scale(${scale})`;
            });
        }

        function erstelleGalerie(projektId) {
            if (projektId === 'ashoka-dupe') return;

            const galleryContainer = projektSeite.querySelector(`.projekt-detail[data-projekt="${projektId}"] .projekt-galerie`);
            if (!galleryContainer) return;

            galleryContainer.style.opacity = '0.5';

            setTimeout(() => {
                galleryContainer.innerHTML = '';
                const daten = projektDaten[projektId];
                if (!daten || daten.anzahl === 0) {
                    galleryContainer.innerHTML = '<p>Keine Bilder verfügbar.</p>';
                    galleryContainer.style.opacity = '1';
                    return;
                }
    
                let bilder = Array.from({length: daten.anzahl}, (_, i) => `${daten.pfad} (${i + 1}).${daten.dateityp}`);
                for (let i = bilder.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [bilder[i], bilder[j]] = [bilder[j], bilder[i]];
                }
    
                bilder.forEach((bildSrc, index) => {
                    const item = document.createElement('div');
                    item.className = 'galerie-item';
                    
                    const rotation = Math.random() * 10 - 5;
                    const offsetX = Math.random() * 20 - 10;
                    const offsetY = Math.random() * 20 - 10;
                    item.dataset.rotation = rotation;
                    item.dataset.offsetX = offsetX;
                    item.dataset.offsetY = offsetY;
                    
                    item.style.zIndex = index + 1;
                    item.innerHTML = `<img src="${bildSrc}" alt="Bild aus Projekt ${projektId}" loading="lazy">`;
                    galleryContainer.appendChild(item);
                });

                updateGalleryAppearance(galleryContainer);
                galleryContainer.style.opacity = '1';
            }, 250);
        }
        
        // ZENTRALER EVENT-HANDLER FÜR ALLE KLICKS
        projektSeite.addEventListener('click', function(event) {
            
            // Fall 1: Klick auf Marquee-Button (Projektwechsel)
            const clickedMarqueeButton = event.target.closest('.marquee-button');
            if (clickedMarqueeButton) {
                const targetProjekt = clickedMarqueeButton.dataset.projektTarget;

                projektSeite.querySelectorAll('.marquee-button').forEach(b => b.classList.remove('active'));
                clickedMarqueeButton.classList.add('active');
                
                detailsContainer.querySelectorAll('.projekt-detail').forEach(d => d.classList.remove('active'));
                
                const targetDetail = detailsContainer.querySelector(`.projekt-detail[data-projekt="${targetProjekt}"]`);
                if (targetDetail) {
                    targetDetail.classList.add('active');
                    erstelleGalerie(targetProjekt);
                    
                    const targetZettel = targetDetail.querySelector('.projekt-beschreibung');
                    if(targetZettel) {
                        detailsContainer.querySelectorAll('.projekt-beschreibung').forEach(z => z.classList.remove('is-visible'));
                        setTimeout(() => targetZettel.classList.add('is-visible'), 100);
                    }
                }
                return;
            }

            // Fall 2: Klick auf "Neu anordnen" Button
            const clickedRearrangeButton = event.target.closest('.rearrange-button');
            if(clickedRearrangeButton) {
                const aktivesProjekt = clickedRearrangeButton.closest('.projekt-detail').dataset.projekt;
                erstelleGalerie(aktivesProjekt); 
                return;
            }

            // Fall 3: Klick auf ein Bild im Stapel
            const clickedImageItem = event.target.closest('.galerie-item.is-top');
            if(clickedImageItem) {
                const galleryContainer = clickedImageItem.parentElement;
                const allItems = Array.from(galleryContainer.querySelectorAll('.galerie-item'));
                if (allItems.length <= 1) return;

                let minZ = Infinity;
                allItems.forEach(item => {
                    const z = parseInt(item.style.zIndex || '0', 10);
                    if (z < minZ) minZ = z;
                });

                clickedImageItem.style.zIndex = minZ - 1;
                updateGalleryAppearance(galleryContainer);
                return;
            }
            
            // Fall 4: Klick auf den Zettel selbst
            const clickedZettel = event.target.closest('.projekt-beschreibung');
            if(clickedZettel) {
                clickedZettel.classList.toggle('is-visible');
            }
        });

        // Start-Animation für den allerersten Zettel
        window.addEventListener('load', () => {
            const ersterZettel = document.querySelector('.projekt-detail.active .projekt-beschreibung');
            if (ersterZettel) {
                setTimeout(() => ersterZettel.classList.add('is-visible'), 500);
            }
        });
    }
});