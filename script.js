class GameHistory {
    constructor() {
        this.sections = document.querySelectorAll('.game-era');
        this.videos = document.querySelectorAll('.bg-video');
        this.current = 0;
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        this.addEventListeners();
        this.preloadVideos();
        this.startVideoPlayback();
    }

    preloadVideos() {
        this.videos.forEach(video => video.play());
    }

    startVideoPlayback() {
        this.videos[0].play();
    }

    switchContent(index) {
        if(this.isAnimating || index === this.current) return;
        
        this.isAnimating = true;
        const direction = index > this.current ? 'next' : 'prev';
        
        this.sections[this.current].classList.remove('active');
        this.videos[this.current].classList.remove('active');
        
        this.current = index;
        
        this.sections[this.current].classList.add('active');
        this.videos[this.current].classList.add('active');
        this.videos[this.current].play();
        
        this.updateTimeline();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }

    updateTimeline() {
        document.querySelectorAll('.timeline-item').forEach((item, i) => {
            item.classList.toggle('active', i === this.current);
        });
    }

    handleWheel = (e) => {
        if(this.isAnimating) return;
        
        const delta = Math.sign(e.deltaY);
        const newIndex = Math.min(Math.max(this.current + delta, 0), this.sections.length - 1);
        
        if(newIndex !== this.current) {
            this.switchContent(newIndex);
        }
    }

    handleTouch = (e) => {
        if(this.isAnimating) return;
        
        const touchEnd = e.changedTouches[0].clientY;
        const delta = this.touchStart - touchEnd;
        
        if(Math.abs(delta) > 50) {
            const direction = delta > 0 ? 1 : -1;
            const newIndex = Math.min(Math.max(this.current + direction, 0), this.sections.length - 1);
            this.switchContent(newIndex);
        }
    }

    addEventListeners() {
        window.addEventListener('wheel', this.handleWheel, { passive: false });
        window.addEventListener('touchstart', (e) => {
            this.touchStart = e.touches[0].clientY;
        });
        window.addEventListener('touchend', this.handleTouch);
        
        document.querySelectorAll('.timeline-item').forEach((item, i) => {
            item.addEventListener('click', () => this.switchContent(i));
        });
    }
}

// Инициализация
const gameHistory = new GameHistory();