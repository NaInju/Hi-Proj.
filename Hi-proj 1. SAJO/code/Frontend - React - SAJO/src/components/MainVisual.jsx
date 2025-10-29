// MainVisual.jsx <= index.html mainvisual 섹션

import React,{useEffect} from 'react';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';


const slideData = [
  { name: '사조몰', url: 'https://sajomall.co.kr/' },
  { name: '사조회참치', url: 'https://sajosfmall.co.kr/' },
  { name: '사조김', url: 'https://smartstore.naver.com/sajoiksan' },
  { name: '사조펫', url: 'https://brand.naver.com/sajopet' },
  { name: '식자재왕몰', url: 'https://vo.la/qEHSgt' },
];

function MainVisual() {

  useEffect(() => {
    const swiper = new Swiper('.main-visual-inner', {
      modules: [Navigation, Autoplay],
      loop: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      spaceBetween: 20,
      speed: 600,
      autoplay: {
        delay: 3000, // 3초마다 한 장씩
        disableOnInteraction: false // 유저가 버튼 눌러도 자동 재생 유지
      },
      navigation: {
        nextEl: '#main-visual-wrap .swiper-button-next',
        prevEl: '#main-visual-wrap .swiper-button-prev',
      },
      on: {
        init: function () {
          updatePreviewText(this.realIndex);
          updateActiveButton(this.realIndex);
        },
        slideChange: function () {
          updatePreviewText(this.realIndex);
          updateActiveButton(this.realIndex);
        },
      },
    });

    document.querySelectorAll('#main-visual-wrap .slide-contents').forEach((cont) => {
      cont.addEventListener('click', () => {
        const realIndex = swiper.realIndex;
        if (slideData[realIndex]) {
          window.open(slideData[realIndex].url, '_blank');
        }
      });
    });

    document.querySelectorAll('#main-visual-wrap .goto-site-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.getAttribute('data-index'), 10);
        swiper.slideToLoop(index);
      });
    });

    document.querySelectorAll('#main-visual-wrap .goto-site-btn i').forEach((icon, index) => {
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = slideData[index]?.url;
        if (url) window.open(url, '_blank');
      });
    });

    function updateActiveButton(index) {
      document.querySelectorAll('#main-visual-wrap .goto-site-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
      });
    }

    function updatePreviewText(currentIndex) {
      const total = slideData.length;
      const nextIndex = (currentIndex + 1) % total;
      const prevIndex = (currentIndex - 1 + total) % total;

      const nextBtn = document.querySelector('#main-visual-wrap .swiper-button-next');
      const prevBtn = document.querySelector('#main-visual-wrap .swiper-button-prev');

      nextBtn.setAttribute('data-preview', slideData[nextIndex].name);
      prevBtn.setAttribute('data-preview', slideData[prevIndex].name);
    }

    function updateSlideImages() {
      const isMobile = window.innerWidth <= 700;

      const imgNames = [
        'mainvisual_1_sajomall',
        'mainvisual_2_sajosasimimall',
        'mainvisual_3_sajogim',
        'mainvisual_4_sajopet',
        'mainvisual_5_sikjajaemall',
      ];

      const slideCards = document.querySelectorAll(
        '.main-visual-inner .swiper-slide:not(.swiper-slide-duplicate) .slide-card'
      );

      slideCards.forEach((card) => {
        const parentSlide = card.closest('.swiper-slide');
        const index = parseInt(parentSlide.dataset.index, 10);

        if (!isNaN(index) && imgNames[index]) {
          const imgPath = isMobile
            ? `./img/main_visual/mobile/${imgNames[index]}_m.png`
            : `./img/main_visual/${imgNames[index]}.png`;

          card.style.backgroundImage = `url('${imgPath}')`;
        }
      });
    }

    updateSlideImages();
    window.addEventListener('resize', updateSlideImages);

    return () => {
      window.removeEventListener('resize', updateSlideImages);
    };
  }, []);

  return (
    <div id="main-visual-wrap">
      <div className="main-visual-inner swiper mainSwiper">
        <div className="swiper-wrapper">
          {/* 슬라이드 1 */}
          <div
            className="swiper-slide"
            data-index="0"
          >
            <a
              href="https://sajomall.co.kr/"
              target="_blank"
              className="slide-card"
              style={{ backgroundImage: "url('./img/main_visual/mainvisual_1_sajomall.png')" }}
              rel="noreferrer"
            >
              <div className="slide-text">
                <strong>사조몰</strong>
                <p>안심하고 믿을 수 있는 사조의 맛있는 먹거리</p>
              </div>
              <div className="card-overlay">
                <span className="cta-text">
                  click <i className="ri-cursor-fill"></i>
                </span>
              </div>
            </a>
          </div>

          {/* 슬라이드 2 */}
          <div className="swiper-slide" data-index="1">
            <a
              href="https://sajosfmall.co.kr/"
              target="_blank"
              className="slide-card"
              style={{ backgroundImage: "url('./img/main_visual/mainvisual_2_sajosasimimall.png')" }}
              rel="noreferrer"
            >
              <div className="slide-text">
                <strong>사조회참치</strong>
                <p>50년 역사, 사조가 전하는 씨푸드</p>
              </div>
              <div className="card-overlay">
                <span className="cta-text">
                  click <i className="ri-cursor-fill"></i>
                </span>
              </div>
            </a>
          </div>

          {/* 슬라이드 3 */}
          <div className="swiper-slide" data-index="2">
            <a
              href="https://smartstore.naver.com/sajoiksan"
              target="_blank"
              className="slide-card"
              style={{ backgroundImage: "url('./img/main_visual/mainvisual_3_sajogim.png')" }}
              rel="noreferrer"
            >
              <div className="slide-text">
                <strong>사조김</strong>
                <p>엄선된 좋은 원초, 바다에서 식탁까지</p>
              </div>
              <div className="card-overlay">
                <span className="cta-text">
                  click <i className="ri-cursor-fill"></i>
                </span>
              </div>
            </a>
          </div>

          {/* 슬라이드 4 */}
          <div className="swiper-slide" data-index="3">
            <a
              href="https://brand.naver.com/sajopet"
              target="_blank"
              className="slide-card"
              style={{ backgroundImage: "url('./img/main_visual/mainvisual_4_sajopet.png')" }}
              rel="noreferrer"
            >
              <div className="slide-text">
                <strong>사조펫</strong>
                <p>반려동물의 건강한 삶<br />사조펫과 함께하세요</p>
              </div>
              <div className="card-overlay">
                <span className="cta-text">
                  click <i className="ri-cursor-fill"></i>
                </span>
              </div>
            </a>
          </div>

          {/* 슬라이드 5 */}
          <div className="swiper-slide" data-index="4">
            <a
              href="https://vo.la/qEHSgt"
              target="_blank"
              className="slide-card"
              style={{ backgroundImage: "url('./img/main_visual/mainvisual_5_sikjajaemall.png')" }}
              rel="noreferrer"
            >
              <div className="slide-text">
                <strong>식자재왕몰</strong>
                <p>식자재가 필요할 땐 식자재 전문몰, 식자재왕마트</p>
              </div>
              <div className="card-overlay">
                <span className="cta-text">
                  click <i className="ri-cursor-fill"></i>
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* 내비게이션 */}
        <div className="swiper-navigation-wrap">
          <button className="swiper-button-prev" data-preview="">{'‹'}</button>
          <button className="swiper-button-next" data-preview="">{'›'}</button>
        </div>
      </div>

      {/* 페이지네이션 & 버튼 */}
      <div className="main-visual-buttons">
        <button className="goto-site-btn" data-index="0" data-url="https://sajomall.co.kr/">
          사조몰 <i className="ri-external-link-line" aria-hidden="true"></i>
        </button>
        <button className="goto-site-btn" data-index="1" data-url="https://sajosfmall.co.kr/">
          사조회참치 <i className="ri-external-link-line" aria-hidden="true"></i>
        </button>
        <button className="goto-site-btn" data-index="2" data-url="https://smartstore.naver.com/sajoiksan">
          사조김 <i className="ri-external-link-line" aria-hidden="true"></i>
        </button>
        <button className="goto-site-btn" data-index="3" data-url="https://brand.naver.com/sajopet">
          사조펫 <i className="ri-external-link-line" aria-hidden="true"></i>
        </button>
        <button className="goto-site-btn" data-index="4" data-url="https://vo.la/qEHSgt">
          식자재왕몰 <i className="ri-external-link-line" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
}

export default MainVisual;