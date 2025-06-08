document.addEventListener('DOMContentLoaded', function() {

    var tabsContainer = document.querySelector('.ordner-tabs');
    var tabs = document.querySelectorAll('.tab');
    var contentPages = document.querySelectorAll('.ordner-inhalt');
    var ordnerInhaltStapel = document.querySelector('.ordner-inhalt-stapel');

    if (!tabsContainer || !ordnerInhaltStapel) return;

    function setActiveState(tabToActivate, isInitialLoad = false) {
        if (!tabToActivate || tabToActivate.classList.contains('active')) return;

        // Beim Klick Inhalt sofort anheben (ohne Animation)
        if (!isInitialLoad) {
            ordnerInhaltStapel.classList.add('no-transition');
            ordnerInhaltStapel.classList.add('is-lifted');
            ordnerInhaltStapel.offsetHeight; // Browser-Reflow erzwingen
            ordnerInhaltStapel.classList.remove('no-transition');
        }

        // Aktive Klassen bei allen entfernen
        tabs.forEach(function(t) {
            t.classList.remove('active');
        });
        contentPages.forEach(function(p) {
            p.classList.remove('active');
        });

        // Neue aktive Klassen setzen
        tabToActivate.classList.add('active');
        var targetContent = document.querySelector('.ordner-inhalt[data-content="' + tabToActivate.dataset.tabTarget + '"]');
        if (targetContent) {
            targetContent.classList.add('active');
        }

        // =======================================================
        // FINALE, KORREKTE z-index LOGIK
        // =======================================================
        const contentZIndex = 5; // Der z-index vom .ordner-inhalt-stapel

        // Setze den aktiven Tab VOR den Inhalt
        tabToActivate.style.zIndex = contentZIndex + 1; // -> 6

        // Setze alle inaktiven Tabs HINTER den Inhalt
        let zCounter = contentZIndex - 1; // Startet bei 4
        tabs.forEach(function(t) {
            if (t !== tabToActivate) {
                t.style.zIndex = zCounter;
                zCounter--; // Nächster wird 3, dann 2...
            }
        });
    }

    // Event Listener für Klicks
    tabsContainer.addEventListener('click', function(event) {
        setActiveState(event.target.closest('.tab'));
    });

    // Event Listener für Hover-Effekte
    tabs.forEach(function(tab) {
        tab.addEventListener('mouseenter', function() {
            if (tab.classList.contains('active')) {
                ordnerInhaltStapel.classList.add('is-lifted');
            }
        });
        tab.addEventListener('mouseleave', function() {
            ordnerInhaltStapel.classList.remove('is-lifted');
        });
    });

    // Initialen Zustand setzen (beim Laden der Seite)
    setActiveState(document.querySelector('.tab'), true);
});