class PasswordGenerator {
    constructor() {
        this.lengthSlider = document.getElementById('lengthSlider');
        this.lengthValue = document.getElementById('lengthValue');
        this.passwordOutput = document.getElementById('passwordOutput');
        this.copyBtn = document.getElementById('copyBtn');
        this.generateBtn = document.getElementById('generateBtn');
        this.strengthFill = document.getElementById('strengthFill');
        this.strengthText = document.getElementById('strengthText');
        
        this.checkboxes = {
            uppercase: document.getElementById('uppercase'),
            lowercase: document.getElementById('lowercase'),
            numbers: document.getElementById('numbers'),
            symbols: document.getElementById('symbols')
        };
        
        this.characters = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };
        
        this.init();
    }
    
    init() {
        this.lengthSlider.addEventListener('input', () => {
            this.lengthValue.textContent = this.lengthSlider.value;
            this.generatePassword();
        });
        
        Object.values(this.checkboxes).forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.generatePassword();
            });
        });
        
        this.generateBtn.addEventListener('click', () => {
            this.generatePassword();
        });
        
        this.copyBtn.addEventListener('click', () => {
            this.copyToClipboard();
        });
        
        // Generate initial password
        this.generatePassword();
    }
    
    generatePassword() {
        const length = parseInt(this.lengthSlider.value);
        let charset = '';
        
        // Build character set based on selected options
        if (this.checkboxes.uppercase.checked) charset += this.characters.uppercase;
        if (this.checkboxes.lowercase.checked) charset += this.characters.lowercase;
        if (this.checkboxes.numbers.checked) charset += this.characters.numbers;
        if (this.checkboxes.symbols.checked) charset += this.characters.symbols;
        
        // Ensure at least one character type is selected
        if (!charset) {
            this.passwordOutput.value = '';
            this.updateStrength(0);
            return;
        }
        
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        
        this.passwordOutput.value = password;
        this.updateStrength(this.calculateStrength(password));
    }
    
    calculateStrength(password) {
        let score = 0;
        
        // Length score
        if (password.length >= 8) score += 25;
        if (password.length >= 12) score += 25;
        
        // Character variety score
        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 10;
        if (/[0-9]/.test(password)) score += 15;
        if (/[^a-zA-Z0-9]/.test(password)) score += 15;
        
        return Math.min(score, 100);
    }
    
    updateStrength(score) {
        this.strengthFill.className = 'strength-fill';
        
        if (score < 30) {
            this.strengthFill.classList.add('weak');
            this.strengthText.textContent = 'Weak Password';
        } else if (score < 60) {
            this.strengthFill.classList.add('fair');
            this.strengthText.textContent = 'Fair Password';
        } else if (score < 80) {
            this.strengthFill.classList.add('good');
            this.strengthText.textContent = 'Good Password';
        } else {
            this.strengthFill.classList.add('strong');
            this.strengthText.textContent = 'Strong Password';
        }
    }
    
    async copyToClipboard() {
        const password = this.passwordOutput.value;
        
        if (!password) return;
        
        try {
            await navigator.clipboard.writeText(password);
            this.showCopySuccess();
        } catch (err) {
            // Fallback for older browsers
            this.passwordOutput.select();
            document.execCommand('copy');
            this.showCopySuccess();
        }
    }
    
    showCopySuccess() {
        this.copyBtn.classList.add('copied');
        
        setTimeout(() => {
            this.copyBtn.classList.remove('copied');
        }, 2000);
    }
}

// Initialize the password generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
});