//전체 페이지 전환 

const sections = gsap.utils.toArray('section'); // => Node List 형태의 유사배열을 배열로 변환

sections.forEach(section => { //.array는 필요없음. 이미 위에 구문에서 array로 만들어서 중복됨.
    gsap.from(section, {
        y: 100, //기본 단위는 px, 퍼센트 쓰고 싶을땐 붙이면 됨.
        opacity: 0,duration: 0.5,
        scrollTrigger: {
            trigger: section,
            start: 'top 70%',
        }

    })
})

gsap.registerPlugin(ScrollTrigger);

/** ================================= HEADER ================================== */ 

const header = document.getElementById('header');
const desktopGnb = document.querySelector('#gnb');
const mobileGnb = document.querySelector('.gnb-slide');
const dep1 = desktopGnb.querySelector('.dep1');
const gnbToggleBtn = document.querySelector('.gnb-toggle');
const gnbOverlay = document.querySelector('.gnb-overlay');
const gnbCloseBtn = document.querySelector('.gnb-close');
let gnbTimer;

/** ====== 데스크탑: GNB Hover 시 헤더 확장 ====== */
function openGnb() {
  if (window.innerWidth > 1000) {
    clearTimeout(gnbTimer);
    header.classList.add('expanded');
  }
}
function closeGnb() {
  if (window.innerWidth > 1000) {
    gnbTimer = setTimeout(() => {
      header.classList.remove('expanded');
    }, 200);
  }
}

desktopGnb.addEventListener('mouseenter', openGnb);
desktopGnb.addEventListener('mouseleave', closeGnb);

/** ====== LANG-WRAP 토글 ====== */
const langWrap = document.querySelector('.lang-wrap');
const langToggle = document.querySelector('.lang-toggle');
const langIcon = langToggle.querySelector('i');

langToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  langWrap.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!langWrap.contains(e.target)) {
    langWrap.classList.remove('active');
    langIcon.classList.replace('ri-arrow-up-s-fill', 'ri-arrow-down-s-fill'); // 바깥 클릭 시 초기화
  }
});

/** ====== 모바일 GNB 슬라이드 ====== */
gnbToggleBtn.addEventListener('click', () => {
  mobileGnb.classList.add('active');
  gnbOverlay.classList.add('active');
  // ✅ dep1 > li 모두 open 클래스 추가 (dep2 보이게)
  const mobileDep1Items = mobileGnb.querySelectorAll('.dep1 > li');
  mobileDep1Items.forEach(li => li.classList.add('open'));
});
gnbCloseBtn.addEventListener('click', () => {
  mobileGnb.classList.remove('active');
  gnbOverlay.classList.remove('active');
});
gnbOverlay.addEventListener('click', () => {
  mobileGnb.classList.remove('active');
  gnbOverlay.classList.remove('active');
});

/** ====== 모바일 DEP2 토글 ====== */
const mobileDep1Links = document.querySelectorAll('.gnb-slide .dep1 > li > a');
mobileDep1Links.forEach(link => {
  link.addEventListener('click', (e) => {
    if (window.innerWidth <= 1000) {
      e.preventDefault();
      const li = link.parentElement;
      li.classList.toggle('open');
    }
  });
});

/** ============================= MAIN-VISUAL-WRAP ============================= */ 
/** main-visual-wrap 슬라이드 데이터 */
const slideData = [
  { name: '사조몰', url: 'https://sajomall.co.kr/' },
  { name: '사조회참치', url: 'https://sajosfmall.co.kr/' },
  { name: '사조김', url: 'https://smartstore.naver.com/sajoiksan' },
  { name: '사조펫', url: 'https://brand.naver.com/sajopet' },
  { name: '식자재왕몰', url: 'https://vo.la/qEHSgt' },
];

document.addEventListener("DOMContentLoaded", function () {
  /** Swiper 초기화 */
  const swiper = new Swiper('.main-visual-inner', {
    loop: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 20,
    speed: 600,
    navigation: {
      nextEl: '#main-visual-wrap .swiper-next',
      prevEl: '#main-visual-wrap .swiper-prev',
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

  /** 슬라이드 클릭 시 현재 슬라이드 링크로 이동 */
  document.querySelectorAll('#main-visual-wrap .slide-contents').forEach((cont) => {
    cont.addEventListener('click', () => {
      const realIndex = swiper.realIndex;
      if (slideData[realIndex]) {
        window.open(slideData[realIndex].url, '_blank');
      }
    });
  });

  /** 하단 버튼 클릭 시 슬라이드 이동 */
  document.querySelectorAll('#main-visual-wrap .goto-site-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(btn.getAttribute('data-index'), 10);
      swiper.slideToLoop(index);
    });
  });

  /** 버튼 내부 아이콘 클릭 시 새 탭 이동 */
  document.querySelectorAll('#main-visual-wrap .goto-site-btn i').forEach((icon, index) => {
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      const url = slideData[index]?.url;
      if (url) window.open(url, '_blank');
    });
  });

  /** 현재 활성화된 버튼 스타일 적용 */
  function updateActiveButton(index) {
    document.querySelectorAll('#main-visual-wrap .goto-site-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
  }

  /** 양 옆 네비게이션 버튼에 다음 슬라이드 이름 표시 */
  function updatePreviewText(currentIndex) {
    const total = slideData.length;
    const nextIndex = (currentIndex + 1) % total;
    const prevIndex = (currentIndex - 1 + total) % total;

    const nextBtn = document.querySelector('#main-visual-wrap .swiper-next');
    const prevBtn = document.querySelector('#main-visual-wrap .swiper-prev');

    nextBtn.setAttribute('data-preview', slideData[nextIndex].name);
    prevBtn.setAttribute('data-preview', slideData[prevIndex].name);
  }

  /** ✅ 화면 크기에 따라 슬라이드 배경 이미지 교체 */
  function updateSlideImages() {
  const isMobile = window.innerWidth <= 700;

  const imgNames = [
    'mainvisual_1_sajomall',
    'mainvisual_2_sajosasimimall',
    'mainvisual_3_sajogim',
    'mainvisual_4_sajopet',
    'mainvisual_5_sikjajaemall',
  ];

  // 실제 슬라이드만 선택 (복제 제외)
  const slideCards = document.querySelectorAll(
    '.main-visual-inner .swiper-slide:not(.swiper-slide-duplicate) .slide-card'
  );

  slideCards.forEach((card) => {
    const parentSlide = card.closest('.swiper-slide');
    const index = parseInt(parentSlide.dataset.index, 10);

    // index가 유효한지 확인 후 배경 이미지 설정
    if (!isNaN(index) && imgNames[index]) {
      const imgPath = isMobile
        ? `./img/main_visual/mobile/${imgNames[index]}_m.png`
        : `./img/main_visual/${imgNames[index]}.png`;

      card.style.backgroundImage = `url('${imgPath}')`;
    }
  });
}

  // 페이지 로드 & 리사이즈 시 이미지 교체 실행
  updateSlideImages();
  window.addEventListener('resize', updateSlideImages);

});

/** =============================== SAJO SCROLL ================================= */ 
// 1. 메인 타임라인: 캔 → 로고 → 블러 → 위로 이동 → 디스크립션 등장
const mainTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".sajo-scroll-section",
    start: "top top",
    end: "top+=2400 top", // ✅ 기존 600 → 4배 느리게
    scrub: true,
    marker: true,
  }
});

mainTimeline
  .from(".sajo-can", { opacity: 0, y: 50 })
  .to(".sajo-logo", { opacity: 1, color: "#fff" })  // 로고 흰색으로 등장
  .to(".sajo-can img", { filter: "blur(10px)", opacity: 0.8})
  .to([".sajo-can",".sajo-logo"], { y: -50 })
  .to(".sajo-description", { opacity: 1 });


const transitionTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".sajo-scroll-section",
    start: "top+=2500 top",
    end: "top+=2700 top",
    scrub: true,
  }
});

// 2. 디스크립션 고정 상태 이후: 배경 흰색, 로고 축소, 디스크립션 퇴장

// 공통 애니메이션
transitionTimeline.to(".sajo-scroll-section", { backgroundColor: "#fff" });
transitionTimeline.to(".sajo-description", { opacity: 0 }, "<");

// ✅ 반응형으로 로고 애니메이션 분기
ScrollTrigger.matchMedia({
  // 모바일
  "(max-width: 500px)": function () {
    gsap.to(".sajo-logo", {
      scale: 0.2,   // 모바일은 덜 작게
      y: -200,      // 이동도 덜
      scrollTrigger: {
        trigger: ".sajo-scroll-section",
        start: "top+=2500 top",
        end: "top+=2700 top",
        scrub: true,
      }
    });
  },

  "(max-width: 800px)": function () {
    gsap.to(".sajo-logo", {
      scale: 0.3,   // 모바일은 덜 작게
      y: -300,      // 이동도 덜
      scrollTrigger: {
        trigger: ".sajo-scroll-section",
        start: "top+=2500 top",
        end: "top+=2700 top",
        scrub: true,
      }
    });
  },

  // 데스크탑
  "(min-width: 801px)": function () {
    gsap.to(".sajo-logo", {
      scale: 0.3,
      y: -350,
      scrollTrigger: {
        trigger: ".sajo-scroll-section",
        start: "top+=2500 top",
        end: "top+=2700 top",
        scrub: true,
      }
    });
  }
});

// 3. 키워드 패널: 순차 등장, 로고 색상 변경
const colors = ['#02164E', '#00831D', '#D90000'];
const panels = document.querySelectorAll(".keyword-panel");

const baseStart = 2800;  // ✅ 2500 뒤에서 여유 있게 시작
const stay = 1300;
const fade = 300;

panels.forEach((panel, i) => {
  const start = baseStart + i * (stay + fade);
  const end = start + (i === panels.length - 1 ? 1500 : stay);

  // 등장
  gsap.fromTo(panel,
    { y: 100, opacity: 0 },
    {
      y: -40,
      opacity: 1,
      scrollTrigger: {
        trigger: ".sajo-scroll-section",
        start: `top+=${start} top`,
        end: `top+=${end} top`,
        scrub: true,
        snap: 0.1,
        onEnter: () => gsap.to(".sajo-logo", { color: colors[i], duration: 0.3 }),
        onEnterBack: () => gsap.to(".sajo-logo", { color: colors[i], duration: 0.3 }),
      }
    }
  );

  // 퇴장 (마지막 패널 제외)
  if (i !== panels.length - 1) {
    gsap.to(panel, {
      opacity: 0,
      y: -100,
      scrollTrigger: {
        trigger: ".sajo-scroll-section",
        start: `top+=${end} top`,
        end: `top+=${end + fade} top`,
        scrub: true,
      }
    });
  }
});

// 4. 키워드 패널 영역 벗어날 때 로고 색상 흰색으로 복귀
ScrollTrigger.create({
  trigger: ".sajo-scroll-section",
  start: "top+=4800 top", // ✅ 이전보다 훨씬 뒤로
  end: "top+=4900 top",
  scrub: true,
  onEnterBack: () => {
    gsap.to(".sajo-logo", { color: "#fff", duration: 0.3 });
  }
});


ScrollTrigger.refresh();

/** =============================== BRAND SWIPER ================================= */ 

const topSwiper = new Swiper('.brand-swiper.top .swiper', {
  loop: true,
  slidesPerView: 'auto',
  spaceBetween: 20,
  speed: 4000, // 천천히 흐르게
  allowTouchMove: false, // 사용자가 끌 수 없게
  autoplay: {
    delay: 0, // 계속 흐르게
    disableOnInteraction: false,
  },
});

const bottomSwiper = new Swiper('.brand-swiper.bottom .swiper', {
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
  


/** =========================== PRODUCT-INFO SWIPER ============================ */ 
document.addEventListener('DOMContentLoaded', () => {
  let leftSwiper = null;
  let rightSwiper = null;
  let mobileRightSwiper = null;

  /** ✅ 모바일용 배경 이미지 경로 배열 */
  const mobileBackgroundImages = [
    './img/product_bg_1_m.jpg',
    './img/product_bg_2_m.jpg',
    './img/product_bg_3_m.jpg',
    './img/product_bg_4_m.jpg',
  ];

  /** ✅ 모바일 배경 변경 함수 */
  function updateMobileBackground(index) {
    const bgTarget = document.querySelector('.product-section');
    if (bgTarget && mobileBackgroundImages[index]) {
      bgTarget.style.backgroundImage = `url(${mobileBackgroundImages[index]})`;
      bgTarget.style.backgroundSize = 'cover';
      bgTarget.style.backgroundPosition = 'center';
      bgTarget.style.transition = 'background-image 0.6s ease';
    }
  }

  const initDesktopSwipers = () => {
    leftSwiper = new Swiper('.product-section .left-swiper', {
      direction: 'horizontal',
      speed: 800,
      slidesPerView: 1,
      spaceBetween: 0,
      centeredSlides: false,
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

    rightSwiper = new Swiper('.product-section .right-swiper', {
      direction: 'vertical',
      effect: 'fade',
      fadeEffect: { crossFade: true },
      speed: 800,
      allowTouchMove: false,
    });

    leftSwiper.controller.control = rightSwiper;
    rightSwiper.controller.control = leftSwiper;
  };

  const initMobileSwiper = () => {
    mobileRightSwiper = new Swiper('.product-section .right-swiper', {
      direction: 'horizontal',
      speed: 600,
      slidesPerView: 1,
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
        }
      }
    });
  };

  const destroyDesktopSwipers = () => {
    if (leftSwiper) {
      leftSwiper.destroy();
      leftSwiper = null;
    }
    if (rightSwiper) {
      rightSwiper.destroy();
      rightSwiper = null;
    }
  };

  const destroyMobileSwiper = () => {
    if (mobileRightSwiper) {
      mobileRightSwiper.destroy();
      mobileRightSwiper = null;
    }
  };

  const handleResponsiveSwiper = () => {
    const isMobile = window.innerWidth <= 700;

    if (isMobile) {
      destroyDesktopSwipers();
      if (!mobileRightSwiper) {
        initMobileSwiper();
      }
    } else {
      destroyMobileSwiper();
      if (!leftSwiper && !rightSwiper) {
        initDesktopSwipers();
      }

      /** 데스크탑에서는 배경 이미지 제거하거나 다른 처리 가능 */
      const bgTarget = document.querySelector('.product-section');
      if (bgTarget) {
        bgTarget.style.backgroundImage = '';
      }
    }
  };

  handleResponsiveSwiper();
  window.addEventListener('resize', handleResponsiveSwiper);
});

/** ============================= financial section ============================== */ 
gsap.registerPlugin(ScrollTrigger);

function animateCount(id, end, duration = 2000) {
  const element = document.getElementById(id);
  let start = 0;
  const step = (timestamp) => {
    if (!element.startTime) element.startTime = timestamp;
    const progress = timestamp - element.startTime;
    const percent = Math.min(progress / duration, 1);
    element.innerText = Math.floor(percent * end).toLocaleString();
    if (progress < duration) {
      window.requestAnimationFrame(step);
    } else {
      element.startTime = null;
    }
  };
  window.requestAnimationFrame(step);
}

// 스크롤 트리거로 실행
ScrollTrigger.create({
  trigger: '.financial-section',
  start: 'top 80%',
  marker: true,
  onEnter: () => {
    animateCount("revenue", 41295);
    animateCount("profit", 1549);
    animateCount("asset", 35885);
  }
});


/** news-wrap */ 
gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll('.news-list li').forEach((li, i) => {
  gsap.from(li, {
    opacity: 0,
    y: 100,
    scrollTrigger: {
      trigger: li,
      start: "top bottom",
      toggleActions: "play none none reverse"
    }
  });
});


/** ESG */
    
/** ================================= FOOTER ================================== */ 
document.addEventListener('DOMContentLoaded', function () {
  // 연락처 보기/닫기
  const contactBtn = document.querySelector('.contact-view');
  const contactList = document.querySelector('.contact-list');
  const contactClose = document.querySelector('.contact-close');

  if (contactBtn && contactList) {
    contactBtn.addEventListener('click', () => {
      contactList.classList.add('active');
    });
  }

  if (contactClose && contactList) {
    contactClose.addEventListener('click', () => {
      contactList.classList.remove('active');
    });
  }

  // 패밀리 사이트 열기/닫기
  const familyToggle = document.querySelector('.toggle-family');
  const familyList = document.querySelector('.family-list');
  const familyClose = document.querySelector('.family-close');

  if (familyToggle && familyList) {
    familyToggle.addEventListener('click', () => {
      familyList.classList.toggle('active');
    });
  }

  if (familyClose && familyList) {
    familyClose.addEventListener('click', () => {
      familyList.classList.remove('active');
    });
  }
});