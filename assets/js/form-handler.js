// URLパラメータ取得処理と送信完了メッセージ表示

document.addEventListener('DOMContentLoaded', function() {
    // CSRF対策のためのトークン設定
    const generateToken = () => {
        // ランダムなトークン生成（32バイト）
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
    };
    
    // トークンをフォームに設定
    const csrfToken = document.getElementById('csrf_token');
    if (csrfToken) {
        // ローカルストレージからトークンを取得または新規生成
        let token = localStorage.getItem('csrf_token');
        if (!token) {
            token = generateToken();
            localStorage.setItem('csrf_token', token);
        }
        csrfToken.value = token;
    }
    
    // URLパラメータを取得
    const urlParams = new URLSearchParams(window.location.search);
    const sentParam = urlParams.get('sent');
    const errorParam = urlParams.get('error');
    
    // フォームと完了メッセージのDOM要素
    const formContainer = document.getElementById('formContainer');
    const completionMessage = document.getElementById('completionMessage');
    
    // 送信完了時
    if (sentParam === 'success' && formContainer && completionMessage) {
        formContainer.style.display = 'none';
        completionMessage.style.display = 'block';
        
        // URLパラメータをクリア（履歴に残さずにURLを書き換え）
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // エラー時
    if (errorParam === 'true' && formContainer) {
        // エラーフィールドの強調表示
        const errorFields = urlParams.get('fields');
        if (errorFields) {
            const fieldList = errorFields.split(',');
            
            fieldList.forEach(field => {
                const inputField = document.getElementById(field);
                const errorMessage = document.getElementById(field + 'Error');
                
                if (inputField) {
                    inputField.classList.add('is-invalid');
                }
                
                if (errorMessage) {
                    if (field === 'name') {
                        errorMessage.textContent = 'お名前を入力してください';
                    } else if (field === 'email') {
                        errorMessage.textContent = 'メールアドレスを入力してください';
                    } else if (field === 'inquiry_type') {
                        errorMessage.textContent = 'お問い合わせ内容を選択してください';
                    } else if (field === 'message') {
                        errorMessage.textContent = 'お問い合わせ詳細を入力してください';
                    } else if (field === 'privacy') {
                        errorMessage.textContent = 'プライバシーポリシーに同意してください';
                    }
                }
            });
        }
        
        // 特定のエラー理由の処理
        const errorReason = urlParams.get('reason');
        if (errorReason) {
            if (errorReason === 'csrf') {
                alert('セキュリティエラーが発生しました。ページを再読み込みして再度お試しください。');
            } else if (errorReason === 'invalid_email') {
                const emailError = document.getElementById('emailError');
                const emailInput = document.getElementById('email');
                
                if (emailError) {
                    emailError.textContent = '有効なメールアドレスを入力してください';
                }
                
                if (emailInput) {
                    emailInput.classList.add('is-invalid');
                }
            } else if (errorReason === 'invalid_phone') {
                const phoneError = document.getElementById('phoneError');
                const phoneInput = document.getElementById('phone');
                
                if (phoneError) {
                    phoneError.textContent = '有効な電話番号を入力してください';
                }
                
                if (phoneInput) {
                    phoneInput.classList.add('is-invalid');
                }
            } else if (errorReason === 'mail_error') {
                alert('メール送信中にエラーが発生しました。しばらく経ってから再度お試しください。');
            }
        }
        
        // URLパラメータをクリア（履歴に残さずにURLを書き換え）
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});
