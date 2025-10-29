// BrandInfo.jsx

import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';
import 'swiper/css'; // 필수

Swiper.use([Autoplay]);
function BrandInfo() {

  const topRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const topSwiper = new Swiper(topRef.current, {
      loop: true,
      slidesPerView: 'auto',
      spaceBetween: 20,
      speed: 4000,
      allowTouchMove: false,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
    });

    const bottomSwiper = new Swiper(bottomRef.current, {
      loop: true,
      slidesPerView: 'auto',
      spaceBetween: 20,
      speed: 8000,
      allowTouchMove: false,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        reverseDirection: true,
      },
    });

    return () => {
      topSwiper.destroy();
      bottomSwiper.destroy();
    };
  }, []);

  return (
    <section className="brand-info">
      <div className="container">
        <h2 className="sec-title">브랜드</h2>

        {/* 상단 스와이퍼 */}
        <div className="brand-swiper top">
          <div className="swiper brand-swiper" ref={topRef}>
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <a href="https://dr.sajo.co.kr/" target="_blank" rel="noreferrer">
                  <span className="blind">대림선어묵</span>
                  <img src="./img/logo/daelilmsunfishcake_logo.png" alt="대림선어묵 로고" />
                </a>
              </div>
              <div className="swiper-slide">
                <a href="#">
                  <span className="blind">사조참치</span>
                  <img src="./img/logo/sajotuna_logo.png" alt="사조참치 로고" />
                </a>
              </div>
              <div className="swiper-slide">
                <a href="#">
                  <span className="blind">해표</span>
                  <img src="./img/logo/haepyo_namuwiki.svg" alt="해표 로고" />
                </a>
              </div>
              <div className="swiper-slide">
                <a href="https://sf.sajo.co.kr/" target="_blank" rel="noreferrer">
                  <span className="blind">사조회참치</span>
                  <img src="./img/logo/sajotunasasimi_logo.png" alt="사조회 참치 로고" />
                </a>
              </div>
              <div className="swiper-slide">
                <a href="https://sajomall.co.kr/goods/event_sale.php?sno=312" target="_blank" rel="noreferrer">
                  <span className="blind">대림선만두</span>
                  <img src="./img/logo/daelimsun-green-logo.jpg" alt="대림선 로고" />
                </a>
              </div>
              <div className="swiper-slide">
                <a href="https://won.sajo.co.kr/" target="_blank" rel="noreferrer">
                  <span className="blind">진품육</span>
                  <img src="./img/logo/jinpoomyook_logo.png" alt="진품육 로고" />
                </a>
              </div>
              <div className="swiper-slide">
                <a href="https://oy.sajo.co.kr/" target="_blank" rel="noreferrer">
                  <span className="blind">오양</span>
                  <img src="./img/logo/oyang_logo.png" alt="오양 로고" />
                </a>
              </div>
              <div className="swiper-slide">
                <a href="https://do.sajo.co.kr/" target="_blank" rel="noreferrer">
                  <span className="blind">맥선</span>
                  <img src="./img/logo/macksun_logo.png" alt="맥선 로고" />
                </a>
              </div>
              <div className="swiper-slide">
                <a href="http://ewangmart.com/" target="_blank" rel="noreferrer">
                  <span className="blind">식자재왕</span>
                  <img src="./img/logo/sikjajaewang_logo.png" alt="식사재왕 로고" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 스와이퍼 */}
        <div className="brand-swiper bottom">
          <div className="swiper brand-swiper reverse" ref={bottomRef}>
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <a href="https://www.sajomall.co.kr/goods/goods_list.php?cateCd=008" target="_blank" rel="noreferrer">
                  <span className="blind">옵티원</span>
                  <img src="./img/logo/optione_logo.png" alt="옵티원 로고" />
                </a>
              </div>
              <div className="swiper-slide">
                <a href="#">
                  <span className="blind">러브잇</span>
                  <img src="./img/logo/loveat_logo_2.png" alt="러브잇 로고" />
                </a>
              </div>
              <div className="swiper-slide">
                <a href="#">
                  <span className="blind">캣푸드</span>
                  <img src="./img/logo/catfood_logo.png" alt="캣푸드 로고" />
                </a>
              </div>
              <div className="swiper-slide">
                <a href="#">
                  <span className="blind">투펫</span>
                  <img src="./img/logo/topet_logo.png" alt="투펫 로고" />
                </a>
              </div>
              <div className="swiper-slide">
                <a href="#">
                  <span className="blind">페씨아</span>
                  <img src="./img/logo/pessia_logo.png" alt="페씨아 로고" />
                </a>
              </div>
              <div className="swiper-slide">
                <a href="https://www.castlexseoul.com/" target="_blank" rel="noreferrer">
                  <span className="blind">캐슬렉스 서울</span>
                  <img src="./img/logo/castlex_seoul_logo.png" alt="캐슬렉스 서울 로고" />
                </a>
              </div>
              <div className="swiper-slide">
                <a href="http://www.castlex-iseongdae.com/" target="_blank" rel="noreferrer">
                  <span className="blind">캐슬렉스 이성대</span>
                  <img src="./img/logo/castlex_isungdae_logo.png" alt="캐슬렉스 이성대 로고" />
                </a>
              </div>
              <div className="swiper-slide">
                <a href="https://www.castlexjj.com/" target="_blank" rel="noreferrer">
                  <span className="blind">캐슬렉스 제주</span>
                  <img src="./img/logo/castlex_jeju_logo.png" alt="캐슬렉스 제주 로고" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrandInfo;