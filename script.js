document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    const dynamicImage = document.getElementById('dynamic-image');

    // Mappage des images
    
    const images = {
        'confiance': './assets/confiance.png',
        'estime': './assets/estime.png',
        'stress': './assets/stress.png',
        'objectifs': './assets/objectifs.png',
        'emotions': './assets/emotions.png'
    };

    const styles = {
        btn: {
            active: ['bg-dark-100', 'text-white', 'shadow-md', 'transform', 'scale-105', 'origin-left'],
            inactive: ['bg-light-300', 'hover:bg-pink-100']
        },
        icon: {
            active: ['bg-dark-200', 'text-white'],
            inactive: ['bg-light-50', 'text-white']
        }
    };

    
    function updateButtonStyle(btn, isActive) {
        const iconBox = btn.querySelector('div');
        
        if (isActive) {
            // Mode Actif
            btn.classList.remove(...styles.btn.inactive);
            btn.classList.add(...styles.btn.active);
            
            iconBox.classList.remove(...styles.icon.inactive);
            iconBox.classList.add(...styles.icon.active);
        } else {
            // Mode Inactif
            btn.classList.remove(...styles.btn.active);
            btn.classList.add(...styles.btn.inactive);
            
            iconBox.classList.remove(...styles.icon.active);
            iconBox.classList.add(...styles.icon.inactive);
        }
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');

            // 1. Réinitialiser tous les boutons en mode INACTIF
            buttons.forEach(b => updateButtonStyle(b, false));

            // 2. Mettre le bouton cliqué en mode ACTIF
            updateButtonStyle(btn, true);


            // 3. Gestion du texte (Contenu)
            contents.forEach(content => content.classList.remove('active'));
            const activeContent = document.getElementById(targetId);
            if(activeContent) activeContent.classList.add('active');

            // 4. Gestion de l'image
            if(dynamicImage && images[targetId]) {
                dynamicImage.style.opacity = 0;
                setTimeout(() => {
                    dynamicImage.src = images[targetId];
                    dynamicImage.style.opacity = 1;
                }, 200);
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('newsletter-form');
    const consentCheckbox = document.getElementById('newsletter-consent');
    const emailInput = document.getElementById('newsletter-email');
    const submitBtn = document.getElementById('newsletter-btn');

    const popup = document.getElementById('success-popup');
    const closeBtn = document.getElementById('close-popup');
    const btnClosePopup = document.getElementById('btn-close-popup');

    // Fonction qui vérifie les deux conditions
    function checkFormState() {
        // 1. Est-ce que la case est cochée ?
        const isChecked = consentCheckbox.checked;
        // 2. Est-ce que l'email n'est pas vide ? (trim retire les espaces)
        const isEmailFilled = emailInput.value.trim() !== "";

        // SI les deux sont OK
        if (isChecked && isEmailFilled) {
            submitBtn.disabled = false;
            // On enlève le style "désactivé"
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            // On ajoute le style "actif" (hover)
            submitBtn.classList.add('hover:bg-dark-100', 'hover:text-white');
        } else {
            // SINON on désactive
            submitBtn.disabled = true;
            // On remet le style "désactivé"
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            // On enlève le style "actif"
            submitBtn.classList.remove('hover:bg-dark-100', 'hover:text-white');
        }
    }

    if(consentCheckbox && emailInput && submitBtn) {
        // On écoute le changement de la case
        consentCheckbox.addEventListener('change', checkFormState);
        // On écoute la frappe dans le champ email
        emailInput.addEventListener('input', checkFormState);
    }

    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // STOP ! On empêche le rechargement de page

            // Petit effet de chargement sur le bouton
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Envoi...";
            submitBtn.disabled = true;

            // On prépare les données pour Brevo
            const formData = new FormData(form);

            // Envoi des données via FETCH (En arrière-plan)
            fetch(form.action, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // Important pour que Brevo accepte la requête venant de ton site
            })
            .then(() => {
                // SUCCÈS !
                
                // 1. On affiche la popup
                popup.classList.remove('hidden');
                
                // 2. On vide le formulaire
                form.reset();
                
                // 3. On remet le bouton à zéro
                submitBtn.innerText = originalText;
                checkFormState(); // Pour le redésactiver
            })
            .catch((error) => {
                console.error('Erreur:', error);
                alert("Une erreur s'est produite. Veuillez réessayer.");
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    function hidePopup() {
        popup.classList.add('hidden');
    }

    if(closeBtn) closeBtn.addEventListener('click', hidePopup);
    if(btnClosePopup) btnClosePopup.addEventListener('click', hidePopup);
    
    // Fermer si on clique en dehors de la boîte
    if(popup) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) hidePopup();
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. SÉLECTION DES ÉLÉMENTS
    const modal = document.getElementById('interest-modal');
    const closeBtn = document.getElementById('close-interest-modal');
    const form = document.getElementById('interest-form');
    const submitBtn = document.getElementById('interest-submit-btn');
    const successMsg = document.getElementById('interest-success-msg');
    const openButtons = document.querySelectorAll('.open-modal-btn');

    // 2. OUVERTURE DE LA POPUP
    // On active tous les boutons qui ont la classe .open-modal-btn
    openButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Empêche le saut de page si c'est un lien
            
            // On remet le formulaire à zéro à chaque ouverture
            if(form) {
                form.reset();
                form.classList.remove('hidden');
            }
            if(successMsg) successMsg.classList.add('hidden');
            
            // On affiche la modale
            if(modal) modal.classList.remove('hidden');
        });
    });

    // 3. FERMETURE DE LA POPUP
    function hideModal() {
        if(modal) modal.classList.add('hidden');
    }

    // Clic sur la croix
    if(closeBtn) closeBtn.addEventListener('click', hideModal);

    // Clic en dehors de la boîte (sur le fond gris)
    if(modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) hideModal();
        });
    }

    // 4. SOUMISSION DU FORMULAIRE (AJAX VERS BREVO)
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // On bloque le rechargement de page

            // Effet visuel "Chargement..."
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Envoi...";
            submitBtn.disabled = true;

            // Récupération des données
            const formData = new FormData(form);

            // Envoi à Brevo
            fetch(form.action, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // Indispensable pour Brevo
            })
            .then(() => {
                // SUCCÈS
                // 1. On cache le formulaire
                form.classList.add('hidden');
                // 2. On affiche le message de succès
                successMsg.classList.remove('hidden');
                
                // 3. On remet le bouton à l'état initial (pour la prochaine fois)
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;

                // 4. (Optionnel) Fermeture automatique après 2.5 secondes
                setTimeout(() => {
                    hideModal();
                }, 2500);
            })
            .catch((error) => {
                // ERREUR
                console.error('Erreur:', error);
                alert("Une erreur s'est produite lors de l'envoi.");
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const legalModal = document.getElementById('legal-modal');
    const openLegalBtn = document.getElementById('open-legal-modal');
    const closeLegalBtn = document.getElementById('close-legal-modal');
    const btnCloseLegalBottom = document.getElementById('btn-close-legal');

    // Ouvrir
    if(openLegalBtn) {
        openLegalBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Empêche de remonter en haut de page
            if(legalModal) legalModal.classList.remove('hidden');
        });
    }

    // Fonction Fermer
    function hideLegalModal() {
        if(legalModal) legalModal.classList.add('hidden');
    }

    // Clic Croix
    if(closeLegalBtn) closeLegalBtn.addEventListener('click', hideLegalModal);
    
    // Clic Bouton du bas
    if(btnCloseLegalBottom) btnCloseLegalBottom.addEventListener('click', hideLegalModal);

    // Clic en dehors
    if(legalModal) {
        legalModal.addEventListener('click', (e) => {
            if (e.target === legalModal) hideLegalModal();
        });
    }
});