class Captcha {
    constructor() {
        this.captchaImage = document.getElementById('captchaImage');
        this.captchaInput = document.getElementById('captchaInput');
        this.verifyButton = document.getElementById('verifyButton');
        this.resultMessage = document.getElementById('resultMessage');
        this.timerElement = document.getElementById('timer');
        this.attempts = 0;
        this.maxAttempts = 3;
        this.cooldownTime = 30; // segundos
        this.timeLeft = 120; // 2 minutos
        this.timerInterval = null;
        this.isVerified = false;
        this.challengeTypes = ['text'];
        this.currentChallengeType = this.getRandomChallengeType();
        
        this.initialize();
    }

    getRandomChallengeType() {
        return this.challengeTypes[Math.floor(Math.random() * this.challengeTypes.length)];
    }

    initialize() {
        this.generateCaptcha();
        this.startTimer();
        this.setupEventListeners();
    }

    generateCaptcha() {
        if (this.currentChallengeType === 'text') {
            this.generateTextCaptcha();
        } else {
            this.generateEmojiCaptcha();
        }
    }

    generateTextCaptcha() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let captchaText = '';
        for (let i = 0; i < 6; i++) {
            captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        this.correctAnswer = captchaText;
        
        // Aplica efeitos visuais ao texto
        this.captchaImage.innerHTML = this.applyVisualEffects(captchaText);
    }

    generateEmojiCaptcha() {
        const emojis = ['⬆️', '➡️', '⬇️', '⬅️'];
        const directions = ['cima', 'direita', 'baixo', 'esquerda'];
        const randomIndex = Math.floor(Math.random() * emojis.length);
        const targetEmoji = emojis[randomIndex];
        const targetDirection = directions[randomIndex];
        
        // Gera um emoji aleatório para girar
        const emojiToRotate = emojis[Math.floor(Math.random() * emojis.length)];
        
        this.correctAnswer = targetDirection;
        this.captchaImage.innerHTML = `
            <div class="emoji-challenge">
                <div class="target-arrow">${targetEmoji}</div>
                <div class="rotate-instruction">Gire o emoji para a direção da seta:</div>
                <div class="emoji-to-rotate">${emojiToRotate}</div>
            </div>
        `;
    }

    applyVisualEffects(text) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const char = text.charAt(i);
            const rotation = Math.floor(Math.random() * 30) - 15; // -15 a 15 graus
            const scale = 0.8 + Math.random() * 0.4; // 0.8 a 1.2
            const skew = Math.floor(Math.random() * 10) - 5; // -5 a 5 graus
            result += `<span style="display:inline-block;transform:rotate(${rotation}deg) scale(${scale}) skew(${skew}deg);">${char}</span>`;
        }
        return result;
    }

    setupEventListeners() {
        this.verifyButton.addEventListener('click', () => this.verify());
        
        // Previne copiar e colar
        this.captchaInput.addEventListener('copy', (e) => e.preventDefault());
        this.captchaInput.addEventListener('paste', (e) => e.preventDefault());
        this.captchaInput.addEventListener('cut', (e) => e.preventDefault());
        
        // Previne arrastar e soltar
        this.captchaInput.addEventListener('dragstart', (e) => e.preventDefault());
        this.captchaInput.addEventListener('drop', (e) => e.preventDefault());
    }

    verify() {
        if (this.isVerified) return;
        
        const userInput = this.captchaInput.value.trim().toLowerCase();
        
        if (this.currentChallengeType === 'emoji') {
            const validDirections = ['cima', 'direita', 'baixo', 'esquerda'];
            if (!validDirections.includes(userInput)) {
                this.showResult('Por favor, digite uma direção válida (cima, direita, baixo ou esquerda)', false);
                return;
            }
        }
        
        if (userInput === this.correctAnswer.toLowerCase()) {
            this.isVerified = true;
            this.showResult('Verificação bem-sucedida!', true);
            this.disableInput();
            this.sendVerificationSuccess();
        } else {
            this.attempts++;
            if (this.attempts >= this.maxAttempts) {
                this.showResult('Muitas tentativas incorretas. Tente novamente em 30 segundos.', false);
                this.disableInput();
                this.startCooldown();
            } else {
                this.showResult('Resposta incorreta. Tente novamente.', false);
                this.captchaInput.value = '';
                this.generateCaptcha();
            }
        }
    }

    showResult(message, isSuccess) {
        this.resultMessage.textContent = message;
        this.resultMessage.className = isSuccess ? 'success' : 'error';
        this.resultMessage.classList.add('shake');
        setTimeout(() => this.resultMessage.classList.remove('shake'), 500);
    }

    disableInput() {
        this.captchaInput.disabled = true;
        this.verifyButton.disabled = true;
    }

    startCooldown() {
        let cooldown = this.cooldownTime;
        this.verifyButton.textContent = `Tente novamente em ${cooldown}s`;
        
        const cooldownInterval = setInterval(() => {
            cooldown--;
            this.verifyButton.textContent = `Tente novamente em ${cooldown}s`;
            
            if (cooldown <= 0) {
                clearInterval(cooldownInterval);
                this.resetCaptcha();
            }
        }, 1000);
    }

    resetCaptcha() {
        this.attempts = 0;
        this.captchaInput.value = '';
        this.captchaInput.disabled = false;
        this.verifyButton.disabled = false;
        this.verifyButton.textContent = 'Verificar';
        this.generateCaptcha();
        this.resetTimer();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.showResult('Tempo expirado!', false);
                this.disableInput();
                this.resetTimer();
            }
        }, 1000);
    }

    updateTimer() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (this.timeLeft <= 30) {
            this.timerElement.classList.add('warning');
        }
    }

    resetTimer() {
        clearInterval(this.timerInterval);
        this.timeLeft = 120;
        this.updateTimer();
        this.timerElement.classList.remove('warning');
        this.startTimer();
    }

    sendVerificationSuccess() {
        window.parent.postMessage({ type: 'captchaSuccess' }, '*');
    }
}

// Inicializa o captcha quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new Captcha();
}); 
