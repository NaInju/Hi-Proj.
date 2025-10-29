// ProductInfo.jsx

import React, { useEffect, useRef, useCallback } from 'react';
import Swiper from 'swiper';
import { Navigation, Pagination, EffectFade, Controller } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

Swiper.use([Navigation, Pagination, EffectFade, Controller]);

function ProductInfo() {

  const leftSwiperRef = useRef(null);
  const rightSwiperRef = useRef(null);

  const leftInstance = useRef(null);
  const rightInstance = useRef(null);
  const mobileInstance = useRef(null);

  const mobileBackgroundImages = [
    './img/product_bg_1_m.jpg',
    './img/product_bg_2_m.jpg',
    './img/product_bg_3_m.jpg',
    './img/product_bg_4_m.jpg',
    './img/product_bg_5_m.jpg',
  ];

  // autoplay 상태에 맞게 아이콘/ARIA 갱신
  const updateToggleBtnUI = (swiper, btn) => {
    if (!btn || !swiper?.autoplay) return;
    const running = swiper.autoplay.running;
    const icon = btn.querySelector('i');

    // ARIA
    btn.setAttribute('aria-pressed', (!running).toString());
    btn.setAttribute('title', running ? '일시정지' : '재생');
    btn.setAttribute('aria-label', running ? '일시정지' : '재생');

    // 아이콘 (동그란 스타일)
    if (icon) {
      icon.className = running ? 'ri-pause-circle-fill' : 'ri-play-circle-fill';
    }
  };

  // 버튼과 스와이퍼 연결
  const bindAutoplayToggle = (swiper, btn) => {
    if (!btn || !swiper) return;

    // 최초 UI 동기화
    updateToggleBtnUI(swiper, btn);

    // 클릭 토글
    btn.onclick = () => {
      if (!swiper.autoplay) return;
      if (swiper.autoplay.running) swiper.autoplay.stop();
      else swiper.autoplay.start();
      updateToggleBtnUI(swiper, btn);
    };

    // 상태 변화에 따라 자동 갱신
    swiper.on('autoplayStart', () => updateToggleBtnUI(swiper, btn));
    swiper.on('autoplayStop', () => updateToggleBtnUI(swiper, btn));
    swiper.on('slideChange', () => updateToggleBtnUI(swiper, btn));
  };

  const updateMobileBackground = useCallback((index) => {
    const bgTarget = document.querySelector('.product-section');
    if (bgTarget && mobileBackgroundImages[index]) {
      bgTarget.style.backgroundImage = `url(${mobileBackgroundImages[index]})`;
      bgTarget.style.backgroundSize = 'cover';
      bgTarget.style.backgroundPosition = 'center';
      bgTarget.style.transition = 'background-image 0.6s ease';
    }
  }, []);

  const initDesktopSwipers = useCallback(() => {
    leftInstance.current = new Swiper(leftSwiperRef.current, {
      direction: 'horizontal',
      speed: 800,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      loop: false,
      slidesPerView: 1,
      spaceBetween: 0,
      observer: true,
      observeParents: true,
      pagination: {
        el: '.product-section .swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.product-section .swiper-button-next',
        prevEl: '.product-section .swiper-button-prev',
      },
    });

    // 데스크톱: 페이지네이션 옆 재생/정지 버튼 연결
    const desktopToggleBtn = leftSwiperRef.current?.querySelector('.swiper-autoplay-toggle');
    bindAutoplayToggle(leftInstance.current, desktopToggleBtn);


    leftInstance.current.on('slideChange', function () {
      const index = leftInstance.current.realIndex;
      rightInstance.current.slideTo(index);
    });

    rightInstance.current = new Swiper(rightSwiperRef.current, {
      direction: 'vertical',
      effect: 'fade',
      fadeEffect: { crossFade: true },
      speed: 800,
      allowTouchMove: false,
    });

    leftInstance.current.controller.control = rightInstance.current;
    rightInstance.current.controller.control = leftInstance.current;
  }, []);

  const initMobileSwiper = useCallback(() => {
    mobileInstance.current = new Swiper(rightSwiperRef.current, {
      direction: 'horizontal',
      speed: 600,
      slidesPerView: 1,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.product-section .swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.product-section .swiper-button-next',
        prevEl: '.product-section .swiper-button-prev',
      },
      on: {
        init: function () {
          updateMobileBackground(this.realIndex);
        },
        slideChange: function () {
          updateMobileBackground(this.realIndex);
        },
      },
    });
    // 모바일: 페이지네이션 옆 재생/정지 버튼 연결
    const mobileToggleBtn = rightSwiperRef.current?.querySelector('.mobile-autoplay-toggle');
    bindAutoplayToggle(mobileInstance.current, mobileToggleBtn);

  }, [updateMobileBackground]);

  const destroyDesktopSwipers = () => {
    if (leftInstance.current) {
      leftInstance.current.destroy();
      leftInstance.current = null;
    }
    if (rightInstance.current) {
      rightInstance.current.destroy();
      rightInstance.current = null;
    }
  };

  const destroyMobileSwiper = () => {
    if (mobileInstance.current) {
      mobileInstance.current.destroy();
      mobileInstance.current = null;
    }
  };

  const handleResponsiveSwiper = useCallback(() => {
    const isMobile = window.innerWidth <= 700;

    if (isMobile) {
      destroyDesktopSwipers();
      if (!mobileInstance.current) {
        initMobileSwiper();
      }
    } else {
      destroyMobileSwiper();
      if (!leftInstance.current && !rightInstance.current) {
        initDesktopSwipers();
      }
      const bgTarget = document.querySelector('.product-section');
      if (bgTarget) {
        bgTarget.style.backgroundImage = '';
      }
    }
  }, [initDesktopSwipers, initMobileSwiper]);

  useEffect(() => {
    handleResponsiveSwiper();
    window.addEventListener('resize', handleResponsiveSwiper);
    return () => {
      window.removeEventListener('resize', handleResponsiveSwiper);
      destroyDesktopSwipers();
      destroyMobileSwiper();
    };
  }, [handleResponsiveSwiper]);

  return (
    <section className="product-info">
      <div className="container">
        <div className="product-section">
          {/* 왼쪽 이미지 슬라이드 */}
          <div className="swiper left-swiper" ref={leftSwiperRef}>
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <img src="./img/products/pd_bg/sajo_tuna_product_bg.png" alt="" />
              </div>
              <div className="swiper-slide">
                <img src="./img/products/pd_bg/sajo_gim_product_bg.jpg" alt="" />
              </div>
              <div className="swiper-slide">
                <img src="./img/products/pd_bg/sajo_royalcrab_product_bg.png" alt="" />
              </div>
              <div className="swiper-slide">
                <img src="./img/products/pd_bg/sajo_mandoo_product_bg.jpg" alt="" />
              </div>
              <div className="swiper-slide">
                <img src="./img/products/pd_bg/sajo_tunasasimi_product_bg.jpg" alt="" />
              </div>
            </div>
            <div className="swiper-pagination"></div>
              <button
                type="button"
                className="swiper-autoplay-toggle"
                aria-pressed="false"
                aria-label="일시정지"
                title="일시정지"
              >
                <i className="ri-pause-circle-fill"></i>
              </button>
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </div>

          {/* 오른쪽 텍스트 + 이미지 그리드 */}
          <div className="swiper right-swiper" ref={rightSwiperRef}>
            <div className="swiper-wrapper">

              {/* 이 아래는 슬라이드 1~5 반복 구조라 필요한 만큼 잘라 재사용 가능 */}
              {/* 예: 제품명, 설명, 이미지 등 JSON 데이터로 추출해서 map 돌릴 수도 있음 */}

              <div className="swiper-slide">
                <div className="prod-grid">
                  <div className="prod-text">
                    <div className='prod-text-box'>
                      <strong>사조참치</strong>
                      <p>자연의 신선함을 담은<br/>대한민국 대표 참치 브랜드.<br/>
                      신뢰할 수 있는 품질로<br/>오랜 시간 사랑받고 있습니다.</p>
                    </div>
                  </div>
                  <div className="prod-img">
                    <img src="./img/products/grid_visual/sajotuna_can_product_1000002397_detail_078.png" alt="사조참치" />
                    <div className="prod-overlay">
                      <strong className='prod-name'>사조참치 살코기</strong>
                      <p className='prod-desc'>
                        담백한 참치 본연의 맛을 살린 정통 참치.<br/>
                        샐러드나 김밥 등 다양한 요리에 잘 어울립니다.
                      </p>
                    </div>
                  </div>
                  <div className="prod-img">
                    <img src="./img/products/grid_visual/bluetuna_can_product_1000002399_detail_054.png" alt="마일드참치" />
                    <div className="prod-overlay">
                      <strong className='prod-name'>마일드참치</strong>
                      <p className='prod-desc'>
                        부드럽고 고소한 맛의 저유 참치.<br/>
                        부담 없이 가볍게 즐길 수 있는<br/>일상용 제품입니다.
                      </p>
                    </div>
                  </div>
                  <div className="prod-img">
                    <img src="./img/products/grid_visual/redtuna_can_product_1000002400_detail_012.png" alt="고추참치" />
                    <div className="prod-overlay">
                      <strong className='prod-name'>고추참치</strong>
                      <p className='prod-desc'> 
                        청양고추의 매콤함이 더해진 참치.<br/>
                        밥반찬이나 비빔 요리에<br/>매력적인 매운맛을 선사합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 슬라이드 2~5 생략 없이 다 포함돼 있음. 필요하면 분할해서 컴포넌트화 가능 */}

              <div className="swiper-slide">
                <div className="prod-grid">
                  <div className="prod-text">
                    <div className='prod-text-box'>
                      <strong>해표</strong>
                      <p>
                        깨끗한 바다의 맛과<br/>정직한 품질로 사랑받는 브랜드.<br/>
                        언제나 신선하고<br/>건강한 식탁을 만듭니다.
                      </p>
                    </div>
                  </div>
                  <div className="prod-img">
                    <img src="./img/products/grid_visual/basakdolgim_prod_thumb.png" alt="바삭돌김" />
                    <div className="prod-overlay">
                      <strong className='prod-name'>더 고소한 김 바삭 돌김</strong>
                      <p className='prod-desc'>
                        청정해역 김을 바삭하게 구워낸 정통 돌김.<br/>
                        고소한 풍미와 바삭한 식감이 일품입니다.
                      </p>
                    </div>
                  </div>
                  <div className="prod-img">
                    <img src="./img/products/grid_visual/chamgirumgim_prod_thumb.png" alt="참기름김" />
                    <div className="prod-overlay">
                      <strong className='prod-name'>더 고소한 김 참기름</strong>
                      <p className='prod-desc'>
                        향긋한 참기름으로 구워낸 풍미 가득한 김.<br/>
                        밥 반찬은 물론 간식으로도 완벽합니다.
                      </p>
                    </div>
                  </div>
                  <div className="prod-img">
                    <img src="./img/products/grid_visual/thegosohanparaegim_prod_thumb.png" alt="파래김" style={{ width: "100%" }} />
                    <div className="prod-overlay">
                      <strong className='prod-name'>더 고소한 김 파래김</strong>
                      <p className='prod-desc'>
                        신선한 파래를 더해 감칠맛을 살린 김.<br/>
                        은은한 향과 부드러운 식감이 조화를 이룹니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 슬라이드 3 */}
              <div className="swiper-slide">
                <div className="prod-grid">
                  <div className="prod-text">
                    <div className='prod-text-box'>
                      <strong>대림선 맛살</strong>
                      <p>
                        신선한 해산물의 맛을 담은<br/>종합 수산 브랜드.<br/>
                        언제나 믿을 수 있는 품질과<br/>풍부한 맛을 제공합니다.
                      </p>
                    </div>
                  </div>
                  <div className="prod-img">
                    <img
                      src="./img/products/grid_visual/crabia_prod_thumb.png"
                      alt="크라비아"
                      style={{ width: "90%" }}
                    />
                    <div className="prod-overlay">
                      <strong className='prod-name'>크라비아</strong>
                      <p className='prod-desc'>
                        게살 본연의 풍미를 살린 프리미엄 맛살.<br/>
                        샐러드나 초밥 등에도 잘 어울리는<br/>고급형 제품입니다.
                      </p>
                    </div>
                  </div>
                  <div className="prod-img">
                    <img
                      src="./img/products/grid_visual/royalcrab_prod_thumb.png"
                      alt="로얄크랩"
                      style={{ width: "95%" }}
                    />
                    <div className="prod-overlay">
                      <strong className='prod-name'>로얄크랩</strong>
                      <p className='prod-desc'>
                        부드럽고 진한 게살 맛을 느낄 수 있는<br/>풍미 깊은 맛살.<br/>
                        특별한 식탁을 위한 프리미엄 선택입니다.
                      </p>
                    </div>
                  </div>
                  <div className="prod-img">
                    <img
                      src="./img/products/grid_visual/oyangmatsal_prod_thumb.png"
                      alt="오양맛살"
                    />
                    <div className="prod-overlay">
                      <strong className='prod-name'>오양맛살</strong>
                      <p className='prod-desc'>
                        쫄깃하고 감칠맛이 살아 있는<br/>스테디셀러 맛살.<br/>
                        언제 어디서나 간편하게 즐길 수 있는<br/>국민 간식입니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 슬라이드 4 */}
              <div className="swiper-slide">
                <div className="prod-grid">
                  <div className="prod-text">
                    <div className='prod-text-box'>
                      <strong>대림선 만두</strong>
                      <p>정성 가득한 재료와 맛으로<br/>사랑받는 종합식품 브랜드.<br/>
                        든든한 한 끼부터<br/>간편한 간식까지 함께합니다.</p>
                    </div>
                  </div>
                  <div className="prod-img">
                    <img
                      src="./img/products/grid_visual/gogisonmandu_prod_thumb.png"
                      alt="고기손만두"
                    />
                    <div className="prod-overlay">
                      <strong className='prod-name'>고기손만두</strong>
                      <p className='prod-desc'>
                        손으로 빚은 듯한 촉촉한 피와 풍부한 고기 속.<br/>
                        집밥처럼 따뜻한 정통 손만두의 맛을 담았습니다.
                      </p>
                    </div>
                  </div>
                  <div className="prod-img">
                    <img
                      src="./img/products/grid_visual/gimchisonmandu_prod_thumb.png"
                      alt="김치손만두"
                    />
                    <div className="prod-overlay">
                      <strong className='prod-name'>김치손만두</strong>
                      <p className='prod-desc'>
                        아삭한 김치와 고기의 조화가 어우러진<br/>매콤한 손만두.<br/>
                        깊은 감칠맛으로 입맛을 확 살려줍니다.
                      </p>
                    </div>
                  </div>
                  <div className="prod-img">
                    <img
                      src="./img/products/grid_visual/gogiwanggyoja_prod_thumb.png"
                      alt="고기왕교자"
                    />
                    <div className="prod-overlay">
                      <strong className='prod-name'>육즙가득 고기 왕교자</strong>
                      <p className='prod-desc'>
                        큼직한 크기와 풍성한 육즙이 살아 있는 교자만두.<br/>
                        바삭하게 구워 먹으면 더욱 맛있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- 슬라이드 5 --> */}
              <div className="swiper-slide">
                <div className="prod-grid">
                  <div className="prod-text">
                    <div className='prod-text-box'>
                      <strong>사조회참치</strong>
                      <p>
                        바다의 신선함을 그대로 담은<br/>프리미엄 참치 브랜드.<br/>
                        깊고 풍부한 맛으로<br/>한층 특별한 식탁을 완성합니다.
                      </p>
                    </div>
                  </div>
                  <div className="prod-img">
                    <img src="./img/products/grid_visual/sajotunasasimi_detail01.jpg" alt="눈다랑어 속살스테이크" />
                    <div className="prod-overlay">
                      <strong className="prod-name">눈다랑어 속살스테이크</strong>
                      <p className="prod-desc">
                        눈다랑어의 속살은 마블링이 없어<br />부드러운 식감에 지방질이 적어<br />
                        담백한 풍미가 가득 담겨있는 부위
                      </p>
                    </div>
                  </div>
                  <div className="prod-img">
                    <img src="./img/products/grid_visual/sajotunasasimi_detail02.jpg" alt="눈다랑어 대뱃살" />
                    <div className="prod-overlay">
                      <strong className="prod-name">눈다랑어 대뱃살</strong>
                      <p className="prod-desc">
                        눈다랑어의 뱃살은<br />
                        탐스러운 선홍빛을 띄며<br />하얀 마블링도 풍부해<br />
                        쫄깃한 식감과 고소함이 가득한<br />가성비가 뛰어난 부위
                      </p>
                    </div>
                  </div>
                  <div className="prod-img">
                    <img src="./img/products/grid_visual/sajotunasasimi-detail03.jpg" alt="참다랑어 배꼽살" />
                    <div className="prod-overlay">
                      <strong className="prod-name">참다랑어 배꼽살</strong>
                      <p className="prod-desc">
                        배꼽 모양과 닮아 배꼽살이라 부르며<br />
                        풍부한 마블링으로 고소하고<br />
                        오독오독 씹히는 식감이 일품인 고급부위
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 모바일 전용 내비게이션 */}
            <div className="mobile-swiper-controls">
              <div className="swiper-button-prev mobile-button-prev"></div>
              <div className="swiper-pagination mobile-pagination"></div>
              <button
                type="button"
                className="mobile-autoplay-toggle"
                aria-pressed="false"
                aria-label="일시정지"
                title="일시정지"
              >
                <i className="ri-pause-circle-fill"></i>
              </button>
              <div className="swiper-button-next mobile-button-next"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductInfo;
