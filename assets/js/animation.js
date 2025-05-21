// アニメーション用JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // スクロールアニメーション
    const animElements = document.querySelectorAll('.anim-fade-in, .anim-slide-up, .anim-slide-left, .anim-slide-right');
    
    // 初期設定
    animElements.forEach(element => {
        element.style.opacity = '0';
    });
    
    // アニメーション実行関数
    function animateOnScroll() {
        animElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.9) {
                if (element.classList.contains('anim-fade-in')) {
                    element.style.animation = 'fadeIn 1s forwards';
                } else if (element.classList.contains('anim-slide-up')) {
                    element.style.animation = 'slideUp 1s forwards';
                } else if (element.classList.contains('anim-slide-left')) {
                    element.style.animation = 'slideLeft 1s forwards';
                } else if (element.classList.contains('anim-slide-right')) {
                    element.style.animation = 'slideRight 1s forwards';
                }
            }
        });
    }
    
    // スクロールイベント
    window.addEventListener('scroll', animateOnScroll);
    
    // ページロード時にも実行
    animateOnScroll();
});

// アニメーションのキーフレーム
document.head.insertAdjacentHTML('beforeend', `
<style>
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(40px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideLeft {
    from {
        opacity: 0;
        transform: translateX(40px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideRight {
    from {
        opacity: 0;
        transform: translateX(-40px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>
`);
