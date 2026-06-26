// ============================================
// MALETA DO BARBEIRO — Clean Quiz + Scroll Reveal
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initNavbar();
    initQuiz();
    handleBrokenImages();
    initVSL();
});

// === Handle images that fail to load ===
function handleBrokenImages() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            // For hero bg, just hide it (the gradient handles the background)
            if (this.id === 'heroBgImg') {
                this.style.display = 'none';
                return;
            }
            // For quiz images, hide them
            if (this.classList.contains('quiz-img')) {
                this.style.display = 'none';
                return;
            }
            // For other images, show a subtle placeholder
            this.style.background = '#161619';
            this.style.border = '1px dashed #2a2a34';
            this.alt = '';
        });
    });
}

// === Scroll Reveal ===
function initReveal() {
    // Add .reveal to all major elements
    const selectors = [
        '.text-block', '.jobs-replaced', '.split-text', '.split-image',
        '.callout', '.pain-points', '.benefits-strip', '.proof-layout',
        '.photo-strip', '.steps', '.step', '.benefit',
        '#quizIntro > *', '.section-label', '.section h2'
    ];

    document.querySelectorAll(selectors.join(',')).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = Math.min(i * 0.04, 0.3) + 's';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// === Navbar scroll ===
function initNavbar() {
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    });
}

// === Quiz ===
function initQuiz() {
    const container = document.getElementById('quizContainer');
    if (!container) return; // Not on the quiz page

    const result = document.getElementById('quizResult');
    const bar = document.getElementById('progressBar');
    const curQ = document.getElementById('currentQ');
    const totQ = document.getElementById('totalQ');

    const questions = document.querySelectorAll('.q');
    const total = questions.length;
    let current = 0;
    let points = 0;

    if (totQ) totQ.textContent = total;
    updateBar();

    document.querySelectorAll('.opt').forEach(opt => {
        opt.addEventListener('click', function () {
            const q = this.closest('.q');
            q.querySelectorAll('.opt').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');

            points += parseInt(this.dataset.pts);

            setTimeout(() => {
                if (current < total - 1) {
                    q.style.opacity = '0';
                    q.style.transition = 'opacity 0.25s';
                    setTimeout(() => {
                        q.classList.remove('active');
                        q.style.opacity = '';
                        q.style.transition = '';
                        current++;
                        questions[current].classList.add('active');
                        curQ.textContent = current + 1;
                        updateBar();
                    }, 250);
                } else {
                    showResult();
                }
            }, 500);
        });
    });

    function updateBar() {
        bar.style.width = ((current + 1) / total) * 100 + '%';
    }

    function showResult() {
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.4s';
        setTimeout(() => {
            container.style.display = 'none';
            result.style.display = 'block';
            result.style.opacity = '0';
            requestAnimationFrame(() => {
                result.style.transition = 'opacity 0.6s ease';
                result.style.opacity = '1';
            });

            const maxPts = 22;
            const pct = Math.max(Math.min(Math.round((points / maxPts) * 100), 98), 87);

            const circle = document.getElementById('scoreCircle');
            const text = document.getElementById('scoreText');
            const circ = 339.292;

            setTimeout(() => {
                circle.style.strokeDashoffset = circ - (pct / 100) * circ;
                let n = 0;
                const timer = setInterval(() => {
                    n++;
                    text.textContent = n + '%';
                    if (n >= pct) clearInterval(timer);
                }, 18);
            }, 400);

            result.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 400);
    }
}

// === Smooth anchor links ===
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// === VSL Timer ===
function initVSL() {
    const vslVideo = document.getElementById('vslVideo');
    const resultCta = document.getElementById('resultCta');
    const urgencyText = document.getElementById('urgencyText');

    if (vslVideo && resultCta) {
        vslVideo.addEventListener('timeupdate', () => {
            // Show CTA at 2 minutes 26 seconds (146 seconds)
            if (vslVideo.currentTime >= 146) {
                resultCta.style.display = 'inline-flex';
                if (urgencyText) urgencyText.style.display = 'block';
            }
        });
    }
}
