// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 모바일 메뉴 토글
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // 메뉴 링크 클릭 시 모바일 메뉴 닫기
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // 스크롤 시 헤더 스타일 변경
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(127, 176, 105, 0.2)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(127, 176, 105, 0.1)';
        }
    });
    
    // 부드러운 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 스크롤 애니메이션
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 애니메이션 대상 요소들
    const animateElements = document.querySelectorAll('.course-card, .teacher-card, .feature, .gallery-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // 통계 숫자 카운트 애니메이션
    const stats = document.querySelectorAll('.stat-number');
    
    const countUp = (element, target) => {
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (target.toString().includes('%')) {
                element.textContent = Math.floor(current) + '%';
            } else if (target.toString().includes('+')) {
                element.textContent = Math.floor(current) + '+';
            } else if (target.toString().includes('년')) {
                element.textContent = Math.floor(current) + '년';
            } else {
                element.textContent = Math.floor(current);
            }
        }, 20);
    };
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target.textContent;
                const numericValue = parseInt(target.replace(/[^0-9]/g, ''));
                countUp(entry.target, numericValue);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // 폼 제출 처리
    const contactForm = document.querySelector('.contact-form form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 폼 데이터 수집
        const formData = new FormData(this);
        const studentName = this.querySelector('input[type="text"]').value;
        const grade = this.querySelectorAll('input[type="text"]')[1].value;
        const phone = this.querySelector('input[type="tel"]').value;
        const course = this.querySelector('select').value;
        const message = this.querySelector('textarea').value;
        
        // 간단한 유효성 검사
        if (!studentName || !grade || !phone || !course) {
            showNotification('모든 필수 항목을 입력해주세요.', 'error');
            return;
        }
        
        // 전화번호 형식 검사
        const phoneRegex = /^[0-9-]+$/;
        if (!phoneRegex.test(phone)) {
            showNotification('올바른 전화번호 형식을 입력해주세요.', 'error');
            return;
        }
        
        // 성공 메시지 표시
        showNotification('상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.', 'success');
        
        // 폼 초기화
        this.reset();
    });
    
    // 알림 메시지 표시 함수
    function showNotification(message, type) {
        // 기존 알림이 있다면 제거
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // 새 알림 생성
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // 스타일 적용
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#7FB069' : '#e74c3c'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // 애니메이션으로 표시
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 3초 후 자동 제거
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // 갤러리 아이템 클릭 효과
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // 클릭 효과 애니메이션
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }, 150);
        });
    });
    
    // 코스 카드 호버 효과 개선
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 강사 카드 호버 효과
    const teacherCards = document.querySelectorAll('.teacher-card');
    
    teacherCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const avatar = this.querySelector('.teacher-avatar');
            avatar.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            const avatar = this.querySelector('.teacher-avatar');
            avatar.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // 페이지 로드 시 환영 애니메이션
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroButtons = document.querySelector('.hero-buttons');
        
        if (heroTitle) {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }
        
        setTimeout(() => {
            if (heroSubtitle) {
                heroSubtitle.style.opacity = '1';
                heroSubtitle.style.transform = 'translateY(0)';
            }
        }, 300);
        
        setTimeout(() => {
            if (heroButtons) {
                heroButtons.style.opacity = '1';
                heroButtons.style.transform = 'translateY(0)';
            }
        }, 600);
    }, 500);
    
    // 초기 히어로 요소들 숨김
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons');
    heroElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // 스크롤 진행률 표시
    const createScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(45deg, #7FB069, #A7D129);
            z-index: 10001;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        });
    };
    
    createScrollProgress();
});

// 페이지 로드 완료 후 추가 초기화
window.addEventListener('load', function() {
    // 모든 이미지와 리소스가 로드된 후 실행할 코드
    console.log('봄빛 수학학원 홈페이지가 완전히 로드되었습니다! 🌸');
    
    // 로딩 애니메이션이 있다면 여기서 제거
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
}); 