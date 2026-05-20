// script.js
class IdentityCardGenerator {
    constructor() {
        this.initializeEventListeners();
        this.photoData = null;
    }

    initializeEventListeners() {
        document.getElementById('identityForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateCard();
        });

        document.getElementById('photo').addEventListener('change', (e) => {
            this.handlePhotoUpload(e);
        });

        document.getElementById('exportPDF').addEventListener('click', () => {
            this.exportToPDF();
        });
    }

    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.photoData = e.target.result;
                this.updatePhotoPreview();
            };
            reader.readAsDataURL(file);
        }
    }

    updatePhotoPreview() {
        const photoPreview = document.getElementById('photoPreview');
        if (this.photoData) {
            photoPreview.innerHTML = `<img src="${this.photoData}" alt="Photo">`;
        } else {
            photoPreview.innerHTML = '<span>Photo</span>';
        }
    }

    generateCard() {
        // Récupérer les valeurs du formulaire
        const fullName = document.getElementById('fullName').value;
        const birthDate = document.getElementById('birthDate').value;
        const birthPlace = document.getElementById('birthPlace').value;
        const nationality = document.getElementById('nationality').value;
        const idNumber = document.getElementById('idNumber').value;

        // Formater la date de naissance
        const formattedBirthDate = this.formatDate(birthDate);

        // Mettre à jour l'aperçu
        document.getElementById('previewName').textContent = fullName || '-';
        document.getElementById('previewBirthDate').textContent = formattedBirthDate || '-';
        document.getElementById('previewBirthPlace').textContent = birthPlace || '-';
        document.getElementById('previewNationality').textContent = nationality || '-';
        document.getElementById('previewIdNumber').textContent = idNumber || '-';
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    }

    async exportToPDF() {
        const element = document.getElementById('cardPreview');
        const originalCard = element.innerHTML;
        
        // Créer une version optimisée pour le PDF
        const pdfContent = document.createElement('div');
        pdfContent.innerHTML = originalCard;
        pdfContent.style.padding = '20px';
        pdfContent.style.backgroundColor = 'white';
        
        // Ajouter des styles supplémentaires pour le PDF
        const style = document.createElement('style');
        style.textContent = `
            .id-card {
                width: 500px;
                margin: 0 auto;
                page-break-inside: avoid;
            }
            .photo-placeholder img {
                max-width: 100%;
                height: auto;
            }
        `;
        pdfContent.appendChild(style);
        
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: `carte_identite_${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, letterRendering: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        
        try {
            await html2pdf().set(opt).from(pdfContent).save();
            this.showNotification('PDF exporté avec succès!', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'export PDF:', error);
            this.showNotification('Erreur lors de l\'export PDF', 'error');
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    new IdentityCardGenerator();
});

// Ajouter des animations CSS supplémentaires
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);