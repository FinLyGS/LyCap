class CaptchaModal {
    constructor() {
        this.container = document.getElementById('LyCap');
        if (!this.container) {
            console.error('Elemento com ID LyCap não encontrado');
            return;
        }
        
        this.createElements();
        this.initialize();
    }
    
    createElements() {
        // Cria o botão de verificação
        this.verifyButton = document.createElement('button');
        this.verifyButton.className = 'verify-button';
        this.verifyButton.id = 'verifyButton';
        this.verifyButton.innerHTML = '<i class="fas fa-shield-alt"></i> Verificar';
        
        // Cria a modal
        this.captchaModal = document.createElement('div');
        this.captchaModal.className = 'modal';
        this.captchaModal.id = 'captchaModal';
        
        // Cria o botão de fechar
        this.modalClose = document.createElement('button');
        this.modalClose.className = 'modal-close';
        this.modalClose.id = 'modalClose';
        this.modalClose.innerHTML = '<i class="fas fa-times"></i>';
        
        // Cria o conteúdo da modal
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        // Cria o iframe
        this.captchaFrame = document.createElement('iframe');
        this.captchaFrame.id = 'captchaFrame';
        this.captchaFrame.src = 'https://LyCap.finlysocial.xyz/index.html';
        
        // Monta a estrutura
        modalContent.appendChild(this.captchaFrame);
        this.captchaModal.appendChild(this.modalClose);
        this.captchaModal.appendChild(modalContent);
        
        // Adiciona os elementos ao container
        this.container.appendChild(this.verifyButton);
        this.container.appendChild(this.captchaModal);
        
        // Adiciona o Font Awesome se não estiver presente
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const fontAwesome = document.createElement('link');
            fontAwesome.rel = 'stylesheet';
            fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
            document.head.appendChild(fontAwesome);
        }
        
        // Adiciona os estilos necessários
        this.addStyles();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --primary-color: #6366f1;
                --primary-hover: #4f46e5;
                --modal-bg: rgba(0, 0, 0, 0.5);
            }
            
            .verify-button {
                padding: 12px 24px;
                background: linear-gradient(90deg, #7C2A2A, #E24D4D);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .verify-button:hover {
                background: linear-gradient(90deg, #5e1e1e, #c43a3a);
                transform: translateY(-2px);
            }
            
            .modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--modal-bg);
                z-index: 1000;
                justify-content: center;
                align-items: center;
            }
            
            .modal.active {
                display: flex;
            }
            
            .modal-content {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                animation: modalFadeIn 0.3s ease;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            .modal-close {
                position: absolute;
                top: 20px;
                right: 20px;
                background: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
                z-index: 1001;
            }
            
            .modal-close:hover {
                transform: rotate(90deg);
                background: #f1f5f9;
            }
            
            iframe {
                border: none;
                width: 100%;
                height: 100%;
            }
            
            @media (max-width: 480px) {
                .modal-content {
                    border-radius: 0;
                }
            }
            
            @media (prefers-color-scheme: dark) {
                .modal-content {
                    background: #1a1b1e;
                }
                
                .modal-close {
                    background: #2d3748;
                    color: #e2e8f0;
                }
                
                .modal-close:hover {
                    background: #4a5568;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    initialize() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Abre o modal
        this.verifyButton.addEventListener('click', () => this.openModal());
        
        // Fecha o modal
        this.modalClose.addEventListener('click', () => this.closeModal());
        
        // Fecha o modal ao clicar fora
        this.captchaModal.addEventListener('click', (e) => {
            if (e.target === this.captchaModal) {
                this.closeModal();
            }
        });
        
        // Escuta mensagens do iframe
        window.addEventListener('message', (event) => this.handleMessage(event));
        
        // Previne que o formulário seja enviado se não estiver verificado
        document.querySelector('form')?.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
    
    openModal() {
        this.captchaModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.captchaModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    handleMessage(event) {
        if (event.data.type === 'captchaSuccess') {
            this.isVerified = true;
            this.verifyButton.innerHTML = '<i class="fas fa-check"></i> Verificado';
            this.verifyButton.style.background = 'linear-gradient(90deg, #10b981, #059669)';
            this.closeModal();
        }
    }
    
    handleFormSubmit(e) {
        if (!this.isVerified) {
            e.preventDefault();
            alert('Por favor, complete a verificação de segurança.');
        }
    }
    
    // Método para resetar o estado de verificação
    resetVerification() {
        this.isVerified = false;
        this.verifyButton.innerHTML = '<i class="fas fa-shield-alt"></i> Verificar';
        this.verifyButton.style.background = 'linear-gradient(90deg, #7C2A2A, #E24D4D)';
    }
}

// Inicializa a modal quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.captchaModal = new CaptchaModal();
}); 