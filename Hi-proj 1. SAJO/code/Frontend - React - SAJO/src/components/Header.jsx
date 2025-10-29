// Header.jsx <= index.html의 header 섹션

import React,{ useEffect, useRef } from 'react';

function Header() {

  // langWrap
  const langWrapRef = useRef(null);
  const langToggleRef = useRef(null);
  const langIconRef = useRef(null);

  useEffect(() => {
    const header = document.getElementById('header');
    const desktopGnb = document.querySelector('#gnb');
    const mobileGnb = document.querySelector('.gnb-slide');
    const gnbToggleBtn = document.querySelector('.gnb-toggle');
    const gnbOverlay = document.querySelector('.gnb-overlay');
    const gnbCloseBtn = document.querySelector('.gnb-close');
    let gnbTimer;

    // 데스크탑 GNB 열기/닫기
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

    desktopGnb?.addEventListener('mouseenter', openGnb);
    desktopGnb?.addEventListener('mouseleave', closeGnb);

    // 모바일 GNB 열기/닫기
    gnbToggleBtn?.addEventListener('click', () => {
      mobileGnb.classList.add('active');
      gnbOverlay.classList.add('active');
      const mobileDep1Items = mobileGnb.querySelectorAll('.dep1 > li');
      mobileDep1Items.forEach(li => li.classList.add('open'));
    });

    gnbCloseBtn?.addEventListener('click', () => {
      mobileGnb.classList.remove('active');
      gnbOverlay.classList.remove('active');
    });

    gnbOverlay?.addEventListener('click', () => {
      mobileGnb.classList.remove('active');
      gnbOverlay.classList.remove('active');
    });

    // 모바일 DEP2 토글
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

    // langWrap
    const langWrap = langWrapRef.current;
    const langToggle = langToggleRef.current;
    const icon = langIconRef.current;

    if (!langWrap || !langToggle || !icon) return;

    const toggleLang = (e) => {
      e.stopPropagation();
      langWrap.classList.toggle('active');
    };

    const handleClickOutside = (e) => {
      if (!langWrap.contains(e.target)) {
        langWrap.classList.remove('active');
        icon.classList.replace('ri-arrow-up-s-fill', 'ri-arrow-down-s-fill');
      }
    };

    langToggle.addEventListener('click', toggleLang);
    document.addEventListener('click', handleClickOutside);

    return () => {
      desktopGnb?.removeEventListener('mouseenter', openGnb);
      desktopGnb?.removeEventListener('mouseleave', closeGnb);
      langToggle.removeEventListener('click', toggleLang);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


  return (
    <div id="header">
      <div className="container">
        {/* 좌측 로고 */}
        <h1>
          <a href="#">
            <span className="blind">사조그룹</span>
          </a>
        </h1>

        {/* 데스크탑용 GNB */}
        <nav id="gnb">
          <ul className="dep1">
            <li>
              <a href="https://www.sajo.co.kr/group/introduce.asp?gi=1">그룹소개</a>
              <ul className="dep2">
                <li><a href="#">사조소개</a></li>
                <li><a href="#">CEO 소개</a></li>
                <li><a href="#">사조역사관</a></li>
                <li><a href="#">그룹비전</a></li>
                <li><a href="#">경영철학</a></li>
                <li><a href="#">윤리경영</a></li>
                <li><a href="#">계열사 안내</a></li>
                <li><a href="#">CI</a></li>
                <li><a href="#">오시는 길</a></li>
              </ul>
            </li>
            <li>
              <a href="https://www.sajo.co.kr/product/brandInfo.asp">브랜드안내</a>
              <ul className="dep2">
                <li><a href="#">브랜드 소개</a></li>
                <li><a href="#">사조 레시피</a></li>
                <li><a href="#">식품안전</a></li>
              </ul>
            </li>
            <li>
              <a href="https://www.sajo.co.kr/investment/administrationResult.asp?gi=1">투자정보</a>
              <ul className="dep2">
                <li><a href="#">경영실적</a></li>
                <li><a href="#">공시정보</a></li>
                <li><a href="#">공지사항</a></li>
                <li><a href="#">공시정보관리규정</a></li>
              </ul>
            </li>
            <li>
              <a href="https://www.sajo.co.kr/prcenter/sajostoryList.asp?gi=1">홍보센터</a>
              <ul className="dep2">
                <li><a href="#">사조뉴스</a></li>
                <li><a href="#">이벤트</a></li>
                <li><a href="#">사회공헌</a></li>
                <li><a href="#">사조TV</a></li>
                <li><a href="#">소셜미디어</a></li>
              </ul>
            </li>
            <li><a href="https://recruit.sajo.co.kr/">인재채용</a></li>
            <li><a href="https://membership.sajo.co.kr/customer/online_name_verification1.asp?returnUrl=online_inconvenience.asp">고객센터</a></li>
          </ul>
        </nav>

        <div className="header-right">
          {/* 우측 lang-wrap */}
          <div className="lang-wrap" ref={langWrapRef}>
            <button className="lang-toggle" ref={langToggleRef}>
              KOR <i className="ri-arrow-down-s-fill" ref={langIconRef}></i>
            </button>
            <ul className="lang-list">
              <li><a href="#">KOR</a></li>
              <li><a href="#">ENG</a></li>
            </ul>
          </div>

          {/* 모바일용 햄버거 버튼 */}
          <button className="gnb-toggle" aria-label="모바일 메뉴 열기">☰</button>
        </div>

        {/* 오프캔버스 오버레이 */}
        <div className="gnb-overlay"></div>

        {/* 모바일용 GNB 슬라이드 메뉴 */}
        <nav className="gnb-slide">
          <button className="gnb-close" aria-label="모바일 메뉴 닫기">✕</button>
          <ul className="dep1">
            <li>
              <a href="#">그룹소개</a>
              <ul className="dep2">
                <li><a href="#">사조소개</a></li>
                <li><a href="#">CEO 소개</a></li>
                <li><a href="#">사조역사관</a></li>
                <li><a href="#">그룹비전</a></li>
                <li><a href="#">경영철학</a></li>
                <li><a href="#">윤리경영</a></li>
                <li><a href="#">계열사 안내</a></li>
                <li><a href="#">CI</a></li>
                <li><a href="#">오시는 길</a></li>
              </ul>
            </li>
            <li>
              <a href="#">브랜드안내</a>
              <ul className="dep2">
                <li><a href="#">브랜드 소개</a></li>
                <li><a href="#">사조 레시피</a></li>
                <li><a href="#">식품안전</a></li>
              </ul>
            </li>
            <li>
              <a href="#">투자정보</a>
              <ul className="dep2">
                <li><a href="#">경영실적</a></li>
                <li><a href="#">공시정보</a></li>
                <li><a href="#">공지사항</a></li>
                <li><a href="#">공시정보관리규정</a></li>
              </ul>
            </li>
            <li>
              <a href="#">홍보센터</a>
              <ul className="dep2">
                <li><a href="#">사조뉴스</a></li>
                <li><a href="#">이벤트</a></li>
                <li><a href="#">사회공헌</a></li>
                <li><a href="#">사조TV</a></li>
                <li><a href="#">소셜미디어</a></li>
              </ul>
            </li>
            <li><a href="#">인재채용</a></li>
            <li><a href="#">고객센터</a></li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Header;
