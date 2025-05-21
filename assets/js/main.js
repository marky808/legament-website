// メインJavaScript

document.addEventListener('DOMContentLoaded', function() {
    // メニュートグル
    const menuToggle = document.querySelector('.menu-toggle');
    const globalNav = document.querySelector('.global-nav');
    
    if (menuToggle && globalNav) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            globalNav.classList.toggle('active');
        });
    }
    
    // お問い合わせフォームバリデーション
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            let isValid = true;
            
            // 名前チェック
            const nameInput = document.getElementById('name');
            const nameError = document.getElementById('nameError');
            if (nameInput.value.trim() === '') {
                nameError.textContent = 'お名前を入力してください';
                nameInput.classList.add('is-invalid');
                isValid = false;
            } else {
                nameError.textContent = '';
                nameInput.classList.remove('is-invalid');
            }
            
            // メールアドレスチェック
            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('emailError');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (emailInput.value.trim() === '') {
                emailError.textContent = 'メールアドレスを入力してください';
                emailInput.classList.add('is-invalid');
                isValid = false;
            } else if (!emailPattern.test(emailInput.value)) {
                emailError.textContent = '有効なメールアドレスを入力してください';
                emailInput.classList.add('is-invalid');
                isValid = false;
            } else {
                emailError.textContent = '';
                emailInput.classList.remove('is-invalid');
            }
            
            // 電話番号チェック（任意）
            const phoneInput = document.getElementById('phone');
            const phoneError = document.getElementById('phoneError');
            const phonePattern = /^[0-9\-\(\)]{10,}$/;
            
            if (phoneInput.value.trim() !== '' && !phonePattern.test(phoneInput.value.replace(/[\s-]/g, ''))) {
                phoneError.textContent = '有効な電話番号を入力してください';
                phoneInput.classList.add('is-invalid');
                isValid = false;
            } else {
                phoneError.textContent = '';
                phoneInput.classList.remove('is-invalid');
            }
            
            // お問い合わせ内容チェック
            const inquiryTypeInput = document.getElementById('inquiry_type');
            const inquiryTypeError = document.getElementById('inquiryTypeError');
            
            if (inquiryTypeInput.value === '') {
                inquiryTypeError.textContent = 'お問い合わせ内容を選択してください';
                inquiryTypeInput.classList.add('is-invalid');
                isValid = false;
            } else {
                inquiryTypeError.textContent = '';
                inquiryTypeInput.classList.remove('is-invalid');
            }
            
            // お問い合わせ詳細チェック
            const messageInput = document.getElementById('message');
            const messageError = document.getElementById('messageError');
            
            if (messageInput.value.trim() === '') {
                messageError.textContent = 'お問い合わせ詳細を入力してください';
                messageInput.classList.add('is-invalid');
                isValid = false;
            } else {
                messageError.textContent = '';
                messageInput.classList.remove('is-invalid');
            }
            
            // プライバシーポリシーチェック
            const privacyInput = document.getElementById('privacy');
            const privacyError = document.getElementById('privacyError');
            
            if (!privacyInput.checked) {
                privacyError.textContent = 'プライバシーポリシーに同意してください';
                isValid = false;
            } else {
                privacyError.textContent = '';
            }
            
            // フォームの送信中止（検証失敗時）
            if (!isValid) {
                e.preventDefault();
            }
        });
    }
});
