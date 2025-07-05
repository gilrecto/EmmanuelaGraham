// import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';

// import styles bundle
import 'swiper/css/bundle';

class ProductMediaGallery extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		const sectionId = this.id?.split('ProductMediaGallery-')[1];
		const galleryId = `Slider-Gallery-${sectionId}`;
		const thumbsId = `Slider-Thumbnails-${sectionId}`;

		const mainEl = this.querySelector(`#${galleryId}`);
		const thumbsEl = this.querySelector(`#${thumbsId}`);

		if (!mainEl || !thumbsEl) return;

		const thumbsSwiper = new Swiper(thumbsEl, {
			direction: window.innerWidth >= 992 ? 'vertical' : 'horizontal',
			slidesPerView: 4,
			spaceBetween: 5,
			freeMode: true,
			watchSlidesProgress: true,
			breakpoints: {
				992: {
					direction: 'vertical',
					spaceBetween: 20,
				},
				0: {
					direction: 'horizontal',
				},
			},
		});

		new Swiper(mainEl, {
			slidesPerView: 1,
			spaceBetween: 10,
			loop: true,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			pagination: {
				el: ".swiper-pagination",
			},
			thumbs: {
				swiper: thumbsSwiper,
			},
			breakpoints: {
				750: {
					loop: false,
				}
			},
			on: {
				init: () => {
					this.setActiveThumb(sectionId);
				},
				slideChange: (swiper) => {
					this.setActiveThumb(sectionId, swiper.activeIndex);
				},
			},
		});
	}

	setActiveThumb(sectionId, index = 0) {
		const slides = this.querySelectorAll(`#Slider-Thumbnails-${sectionId} .swiper-slide`);
		slides.forEach((slide, i) => {
			slide.setAttribute('aria-current', i === index ? 'true' : 'false');
		});
	}
}

customElements.define('product-media-gallery', ProductMediaGallery);