document.addEventListener('DOMContentLoaded', function() {

    // ... (Der obere Teil des Codes mit der Tab-Logik bleibt unverändert) ...
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
    // LOGIK FÜR PROJEKTSEITE (MARQUEE & GALERIE)
    // =======================================================

    const projektDaten = {
        'ashoka-dupe': { anzahl: 6, pfad: 'Projektbilder/Ashoka_Dupe/Bild', dateityp: 'jpg' },
        'leiter': { anzahl: 4, pfad: 'Projektbilder/Leiter/Bild', dateityp: 'jpg' },
        'faltkarre': { anzahl: 5, pfad: 'Projektbilder/Faltkarre/Bild', dateityp: 'png' },
        'tin-3d': { anzahl: 3, pfad: 'Projektbilder/Tin_3D_Printer/Bild', dateityp: 'jpg' },
        'movement': { anzahl: 44, pfad: 'Projektbilder/Bewegung zum signal/Bild', dateityp: 'jpg' },
        'new-tool': { anzahl: 2, pfad: 'Projektbilder/New_Tool/Bild', dateityp: 'png' },
        'sketches': { anzahl: 5, pfad: 'Projektbilder/Sketches/Bild', dateityp: 'jpg' }
    };

    const projektSeite = document.querySelector('.ordner-inhalt[data-content="projekte"]');

    if (projektSeite) {
        function erstelleGalerie(projektId) {
            const galleryContainer = projektSeite.querySelector(`.projekt-detail[data-projekt="${projektId}"] .projekt-galerie`);
            if (!galleryContainer) return;

            galleryContainer.innerHTML = '';

            const daten = projektDaten[projektId];
            if (!daten || daten.anzahl === 0) {
                galleryContainer.innerHTML = '<p>Für dieses Projekt sind noch keine Bilder verfügbar.</p>';
                return;
            }

            let bilder = [];
            for (let i = 1; i <= daten.anzahl; i++) {
                // HIER IST DIE KORREKTUR: Leerzeichen vor der Klammer
                const bildPfad = `${daten.pfad} (${i}).${daten.dateityp}`;
                bilder.push(bildPfad);
            }

            for (let i = bilder.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [bilder[i], bilder[j]] = [bilder[j], bilder[i]];
            }

            const groessen = ['', '', '', 'galerie-item--wide', 'galerie-item--tall', 'galerie-item--big'];

            bilder.forEach(bildSrc => {
                const item = document.createElement('div');
                const zufallsGroesse = groessen[Math.floor(Math.random() * groessen.length)];
                
                item.className = 'galerie-item';
                if(zufallsGroesse) {
                    item.classList.add(zufallsGroesse);
                }

                const img = document.createElement('img');
                img.src = bildSrc;
                img.alt = `Bild aus dem Projekt ${projektId}`;
                img.loading = 'lazy';

                item.appendChild(img);
                galleryContainer.appendChild(item);
            });
        }

        const detailsContainer = projektSeite.querySelector('.projekt-details-container');

        projektSeite.addEventListener('click', function(event) {
            
            const clickedMarqueeButton = event.target.closest('.marquee-button');
            if (clickedMarqueeButton) {
                const targetProjekt = clickedMarqueeButton.dataset.projektTarget;
                projektSeite.querySelectorAll('.marquee-button').forEach(b => b.classList.remove('active'));
                projektSeite.querySelectorAll(`.marquee-button[data-projekt-target="${targetProjekt}"]`).forEach(b => b.classList.add('active'));
                detailsContainer.querySelectorAll('.projekt-detail').forEach(d => d.classList.remove('active'));
                
                const targetDetail = detailsContainer.querySelector(`.projekt-detail[data-projekt="${targetProjekt}"]`);
                if (targetDetail) {
                    targetDetail.classList.add('active');
                    erstelleGalerie(targetProjekt);
                }
            }

            const clickedRearrangeButton = event.target.closest('.rearrange-button');
            if(clickedRearrangeButton) {
                const aktivesProjekt = clickedRearrangeButton.closest('.projekt-detail').dataset.projekt;
                erstelleGalerie(aktivesProjekt);
            }
        });

        const startProjekt = 'ashoka-dupe';
        erstelleGalerie(startProjekt);
    }
});