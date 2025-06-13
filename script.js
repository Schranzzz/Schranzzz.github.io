document.addEventListener('DOMContentLoaded', function() {

    let galleryInterval = null; 

    var tabsContainer = document.querySelector('.ordner-tabs');
    var tabs = document.querySelectorAll('.tab');
    var contentPages = document.querySelectorAll('.ordner-inhalt');
    var ordnerInhaltStapel = document.querySelector('.ordner-inhalt-stapel');
    var ordnerInhaltSchatten = document.querySelector('.ordner-inhalt-Schatten');

    if (!tabsContainer || !ordnerInhaltStapel || !ordnerInhaltSchatten) return;

    function setActiveState(tabToActivate, isInitialLoad = false) {
        if (!tabToActivate || tabToActivate.classList.contains('active')) return;

        if (tabToActivate.dataset.tabTarget !== 'projekte') {
            clearInterval(galleryInterval);
        }

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
    // LOGIK FÜR PROJEKTSEITE (MARQUEE & GALERIE-STAPEL)
    // =======================================================

    const projektDaten = {
        'ashoka-dupe': { anzahl: 6, pfad: 'Projektbilder/Ashoka_Dupe/Bild', dateityp: 'jpg' },
        'leiter': { anzahl: 4, pfad: 'Projektbilder/Leiter/Bild', dateityp: 'jpg' },
        'faltkarre': { anzahl: 5, pfad: 'Projektbilder/Faltkarre/Bild', dateityp: 'png' },
        'tin-3d': { anzahl: 3, pfad: 'Projektbilder/Tin_3D_Printer/Bild', dateityp: 'jpg' },
        'movement': { anzahl: 34, pfad: 'Projektbilder/Bewegung zum signal/Bild', dateityp: 'jpg' },
        'new-tool': { anzahl: 2, pfad: 'Projektbilder/New_Tool/Bild', dateityp: 'png' },
        'sketches': { anzahl: 5, pfad: 'Projektbilder/Sketches/Bild', dateityp: 'jpg' }
    };

    const projektSeite = document.querySelector('.ordner-inhalt[data-content="projekte"]');

    if (projektSeite) {
        const detailsContainer = projektSeite.querySelector('.projekt-details-container');

        // NEUE HELFERFUNKTION: Aktualisiert das Aussehen aller Bilder im Stapel
        function updateGalleryAppearance(galleryContainer) {
            if (!galleryContainer) return;
            const allItems = Array.from(galleryContainer.querySelectorAll('.galerie-item'));
            if (allItems.length === 0) return;

            let topItem = null;
            let maxZ = -Infinity;

            // 1. Finde das oberste Bild (höchster z-index)
            allItems.forEach(item => {
                const z = parseInt(item.style.zIndex || '0', 10);
                if (z > maxZ) {
                    maxZ = z;
                    topItem = item;
                }
            });

            // 2. Wende Stile an: Das oberste Bild wird groß & scharf, der Rest klein & unscharf
            allItems.forEach(item => {
                const rot = item.dataset.rotation || 0;
                const transX = item.dataset.offsetX || 0;
                const transY = item.dataset.offsetY || 0;
                let scale = 0.95; // Standard-Skalierung für Bilder im Hintergrund

                item.classList.remove('is-top');

                if (item === topItem) {
                    scale = 1.0; // Das oberste Bild ist 100% groß
                    item.classList.add('is-top');
                }
                
                // Setze die transform-Eigenschaft mit der korrekten Skalierung
                item.style.transform = `translate(${transX}px, ${transY}px) rotate(${rot}deg) scale(${scale})`;
            });
        }


        // Funktion zum Erstellen des Bild-Stapels (leicht angepasst)
        function erstelleGalerie(projektId) {
            if (projektId === 'ashoka-dupe') {
                return; // Ashoka Dupe hat ein 3D-Modell, keine Galerie
            }

            const galleryContainer = projektSeite.querySelector(`.projekt-detail[data-projekt="${projektId}"] .projekt-galerie`);
            if (!galleryContainer) return;

            galleryContainer.style.opacity = '0.5';

            setTimeout(() => {
                galleryContainer.innerHTML = '';
                const daten = projektDaten[projektId];
                if (!daten || daten.anzahl === 0) {
                    galleryContainer.innerHTML = '<p>Für dieses Projekt sind noch keine Bilder verfügbar.</p>';
                    return;
                }
    
                let bilder = Array.from({length: daten.anzahl}, (_, i) => `${daten.pfad} (${i + 1}).${daten.dateityp}`);
    
                // Bilder einmalig mischen für eine zufällige Startreihenfolge
                for (let i = bilder.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [bilder[i], bilder[j]] = [bilder[j], bilder[i]];
                }
    
                bilder.forEach((bildSrc, index) => {
                    const item = document.createElement('div');
                    item.className = 'galerie-item';
                    
                    // Speichere die zufälligen Werte im Dataset, anstatt sie direkt anzuwenden
                    const rotation = Math.random() * 10 - 5;
                    const offsetX = Math.random() * 20 - 10;
                    const offsetY = Math.random() * 20 - 10;
                    item.dataset.rotation = rotation;
                    item.dataset.offsetX = offsetX;
                    item.dataset.offsetY = offsetY;
                    
                    item.style.zIndex = index + 1;
                    item.innerHTML = `<img src="${bildSrc}" alt="Bild aus dem Projekt ${projektId}" loading="lazy">`;
                    galleryContainer.appendChild(item);
                });

                // Rufe die neue Funktion auf, um initial das Aussehen zu setzen
                updateGalleryAppearance(galleryContainer);
                galleryContainer.style.opacity = '1';

            }, 250);
        }
        
        // Funktion, die aufgerufen wird, wenn ein Projekt-Button geklickt wird
        function zeigeProjektGalerie(projektId) {
            clearInterval(galleryInterval); 
            erstelleGalerie(projektId);
        }

        // Event-Listener für die ganze Projekt-Seite (Event Delegation)
        projektSeite.addEventListener('click', function(event) {
            
            // Klick auf einen Marquee-Button (Projektwechsel)
            const clickedMarqueeButton = event.target.closest('.marquee-button');
            if (clickedMarqueeButton) {
                const targetProjekt = clickedMarqueeButton.dataset.projektTarget;
                projektSeite.querySelectorAll('.marquee-button').forEach(b => b.classList.remove('active'));
                clickedMarqueeButton.classList.add('active');
                
                detailsContainer.querySelectorAll('.projekt-detail').forEach(d => d.classList.remove('active'));
                
                const targetDetail = detailsContainer.querySelector(`.projekt-detail[data-projekt="${targetProjekt}"]`);
                if (targetDetail) {
                    targetDetail.classList.add('active');
                    zeigeProjektGalerie(targetProjekt);
                }
            }

            // Klick auf den "Neu anordnen" Button
            const clickedRearrangeButton = event.target.closest('.rearrange-button');
            if(clickedRearrangeButton) {
                const aktivesProjekt = clickedRearrangeButton.closest('.projekt-detail').dataset.projekt;
                erstelleGalerie(aktivesProjekt); 
            }

            // Klick auf ein Bild im Stapel (nur das oberste ist dank CSS klickbar)
            const clickedImageItem = event.target.closest('.galerie-item.is-top');
            if(clickedImageItem) {
                const galleryContainer = clickedImageItem.parentElement;
                const allItems = Array.from(galleryContainer.querySelectorAll('.galerie-item'));
                if (allItems.length <= 1) return; // Nichts zu tun bei nur einem Bild

                let minZ = Infinity;
                allItems.forEach(item => {
                    const z = parseInt(item.style.zIndex || '0', 10);
                    if (z < minZ) {
                        minZ = z;
                    }
                });

                // Setze das geklickte Bild auf einen z-index unter dem niedrigsten
                clickedImageItem.style.zIndex = minZ - 1;

                // Aktualisiere das Aussehen aller Bilder. Die Logik findet das neue oberste Bild.
                updateGalleryAppearance(galleryContainer);
            }
        });

        // =======================================================
        // ZETTEL-EFFEKT (Angepasst für Hereinrutschen)
        // =======================================================

        function hideAllZettel() {
            detailsContainer.querySelectorAll('.projekt-beschreibung').forEach(zettel => {
                zettel.classList.remove('is-visible');
            });
        }

        detailsContainer.querySelectorAll('.beschreibung-toggle').forEach(button => {
            button.addEventListener('click', () => {
                button.closest('.projekt-beschreibung').classList.remove('is-visible');
            });
        });

        projektSeite.addEventListener('click', function(event) {
            const clickedMarqueeButton = event.target.closest('.marquee-button');
            if (clickedMarqueeButton) {
                hideAllZettel();
                const targetProjekt = clickedMarqueeButton.dataset.projektTarget;
                const targetDetail = detailsContainer.querySelector(`.projekt-detail[data-projekt="${targetProjekt}"]`);
                if(targetDetail) {
                    const targetZettel = targetDetail.querySelector('.projekt-beschreibung');
                    if (targetZettel) {
                        setTimeout(() => {
                            targetZettel.classList.add('is-visible');
                        }, 100);
                    }
                }
            }
        });

        window.addEventListener('load', () => {
            const ersterZettel = document.querySelector('.projekt-detail.active .projekt-beschreibung');
            if (ersterZettel) {
                ersterZettel.classList.add('is-visible');
            }
        });
    }
});