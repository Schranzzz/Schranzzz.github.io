// NEUER, VEREINFACHTER INHALT FÜR script.js

document.addEventListener('DOMContentLoaded', function() {

    // =======================================================
    // LOGIK FÜR ORDNER-TABS (BLEIBT UNVERÄNDERT)
    // =======================================================
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
    // LOGIK FÜR PROJEKTSEITE (STARK VEREINFACHT)
    // =======================================================

    const projektDaten = {
        'ashoka-dupe': { anzahl: 6, pfad: 'Projektbilder/Ashoka_Dupe/Bild', dateityp: 'jpg' },
        'leiter': { anzahl: 4, pfad: 'Projektbilder/Leiter/Bild', dateityp: 'jpg' },
        'faltkarre': { anzahl: 8, pfad: 'Projektbilder/Faltkarre/Bild', dateityp: 'jpg' },
        'tin-3d': { anzahl: 3, pfad: 'Projektbilder/Tin_3D_Printer/Bild', dateityp: 'jpg' },
        'movement': { anzahl: 34, pfad: 'Projektbilder/Bewegung zum signal/Bild', dateityp: 'jpg' },
        'new-tool': { anzahl: 19, pfad: 'Projektbilder/New_Tool/Bild', dateityp: 'jpg' },
        'sketches': { anzahl: 5, pfad: 'Projektbilder/Sketches/Bild', dateityp: 'jpg' }
    };

    // Diese Funktion füllt eine Galerie mit Bildern
    function erstelleGalerie(projektId) {
        // Das 3D-Modell-Projekt hat keine Bildergalerie
        if (projektId === 'ashoka-dupe') return;

        const galleryContainer = document.querySelector(`.projekt-detail[data-projekt="${projektId}"] .projekt-galerie`);
        if (!galleryContainer) return;

        galleryContainer.innerHTML = '';
        const daten = projektDaten[projektId];
        if (!daten || daten.anzahl === 0) {
            galleryContainer.innerHTML = '<p>Keine Bilder verfügbar.</p>';
            return;
        }

        let bilder = Array.from({length: daten.anzahl}, (_, i) => `${daten.pfad} (${i + 1}).${daten.dateityp}`);

        bilder.forEach((bildSrc) => {
            const item = document.createElement('div');
            item.className = 'galerie-item';
            item.innerHTML = `<img src="${bildSrc}" alt="Bild aus Projekt ${projektId}" loading="lazy">`;
            galleryContainer.appendChild(item);
        });
    }

    // Gehe durch alle Projekte und erstelle ihre Galerien beim Laden der Seite
    document.querySelectorAll('.projekt-detail').forEach(projektDiv => {
        const projektId = projektDiv.dataset.projekt;
        if (projektId) {
            erstelleGalerie(projektId);
        }
    });

});