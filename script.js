class Carousel {
    constructor(container, options = {}) {
        this.container = container;
        this.carousel = container.querySelector('.carousel') || container.querySelector('.carousel2');
        this.images = this.carousel.querySelectorAll('img');
        this.navContainer = container.querySelector('.carousel-nav') || container.querySelector('.carousel2-nav');
        this.prevButton = container.querySelector('#prev');
        this.nextButton = container.querySelector('#next');
        this.currentIndex = 0;
        this.autoSlideInterval = null;

        this.options = {
            autoSlideInterval: 5000,
            transition: 'transform 0.5s ease',
            ...options
        };

        this.init();
    }

    init() {
        this.setupStyles();
        this.createNavDots();
        this.setupNavigationButtons();
        this.startAutoSlide();
    }

    setupStyles() {
        Object.assign(this.container.style, {
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
        });

        Object.assign(this.carousel.style, {
            display: 'flex',
            width: '100%',
            height: '100%',
            transition: this.options.transition,
        });

        this.images.forEach((img) => {
            if (this.carousel.classList.contains('carousel2')) {
                Object.assign(img.style, {
                    width: '100%',
                    height: '80%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    flexShrink: '0',
                    margin: 'auto',
                });
            } else {
                Object.assign(img.style, {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    flexShrink: '0',
                });
            }
        });

        if (this.navContainer) {
            Object.assign(this.navContainer.style, {
                position: 'absolute',
                bottom: this.carousel.classList.contains('carousel2') ? '10px' : '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '10px',
                zIndex: '5',
            });
        }

        if (this.prevButton && this.nextButton) {
            const buttonContainer = this.prevButton.parentElement;
            Object.assign(buttonContainer.style, {
                position: 'absolute',
                top: '50%',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                transform: 'translateY(-20%)',
                zIndex: '10',
            });

            [this.prevButton, this.nextButton].forEach((button) => {
                Object.assign(button.style, {
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '30px',
                    fontSize: '24px',
                });
            });

            if (this.container.classList.contains('carousel-container2')) {
                Object.assign(this.container.style, {
                    width: '100%',
                    height: '50%',
                    margin: '0 auto',
                });
            }
        }
    }

    createNavDots() {
        if (!this.navContainer) return;

        this.navContainer.innerHTML = '';
        this.images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('nav-dot');

            Object.assign(dot.style, {
                width: '12px',
                height: '12px',
                backgroundColor: '#999',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
            });

            if (index === 0) {
                dot.classList.add('active');
                dot.style.backgroundColor = 'white';
            }

            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.restartAutoSlide();
            });

            this.navContainer.appendChild(dot);
        });
    }

    setupNavigationButtons() {
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => {
                this.prevSlide();
                this.restartAutoSlide();
            });
        }

        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.nextSlide();
                this.restartAutoSlide();
            });
        }
    }

    goToSlide(index) {
        this.currentIndex = index;
        const offset = -index * 100;

        this.carousel.style.transition = this.options.transition;
        this.carousel.style.transform = `translateX(${offset}%)`;

        const dots = this.navContainer?.querySelectorAll('.nav-dot') || [];
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            dot.style.backgroundColor = i === index ? 'white' : '#999';
        });
    }

    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.goToSlide(prevIndex);
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        this.goToSlide(nextIndex);
    }

    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, this.options.autoSlideInterval);
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
        }
    }

    restartAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const carouselContainers = document.querySelectorAll('.carousel-container, .carousel-container2');
    carouselContainers.forEach(container => {
        new Carousel(container, {
            autoSlideInterval: 5000,
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });

                history.replaceState(null, '', location.pathname);
            }
        });
    });
});
