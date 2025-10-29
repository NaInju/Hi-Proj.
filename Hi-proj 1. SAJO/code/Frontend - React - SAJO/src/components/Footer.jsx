// Footer.jsx

import React, { useRef } from 'react';

function Footer() {
  const contactListRef = useRef(null);
  const familyListRef = useRef(null);

  const handleContactOpen = () => {
    contactListRef.current?.classList.add('active');
  };

  const handleContactClose = () => {
    contactListRef.current?.classList.remove('active');
  };

  const handleFamilyToggle = () => {
    familyListRef.current?.classList.toggle('active');
  };

  const handleFamilyClose = () => {
    familyListRef.current?.classList.remove('active');
  };

  return (
    <footer id="footer">
      <div className="container">
        <div className="footer-links">
          {/* 좌측 상담전화 영역 */}
          <div className="footer-tel">
            <div className="tel1">
              <h2>소비자 상담전화</h2>
              <p>
                평일 09:00~17:00 운영<br />
                점심시간 12:00~13:00<br />
                토,일,공휴일 휴무
              </p>
            </div>
            <button className="contact-view" onClick={handleContactOpen}>연락처 보기</button>

            <div className="contact-list" ref={contactListRef}>
              <strong>사조그룹 소비자 상담전화</strong>
              <button className="contact-close" onClick={handleContactClose}>
                <i className="ri-close-line"></i>
                <span className="blind">연락처 닫기</span>
              </button>

              <div className="contact-cols">
                <div className="contact-col">
                  <ul>
                    <li><strong>사조대림</strong><p>080-900-6133</p></li>
                    <li><strong>사조오양</strong><p>080-015-3434</p></li>
                    <li><strong>사조산업</strong><p>080-008-8700</p></li>
                    <li><strong>사조씨푸드</strong><p>080-4681-6516</p></li>
                  </ul>
                </div>
                <div className="contact-col">
                  <ul>
                    <li>
                      <strong>사조동아원</strong>
                      <p>제분BU 문의<br />080-370-3377</p>
                      <p>생물자원사료 문의<br />041-350-6300</p>
                      <p>반려동물사료 문의<br />02-789-9677</p>
                    </li>
                  </ul>
                </div>
                <div className="contact-col">
                  <ul>
                    <li><strong>사조원</strong><p>063-770-3000</p></li>
                    <li><strong>푸디스트</strong><p>02-1811-9696</p></li>
                    <li><strong>사조CPK</strong><p>1566-7847</p></li>
                    <li><strong>홈페이지장애 문의</strong><p>02-3149-5747</p></li>
                  </ul>
                </div>
              </div>

              <p className="contact-note">
                ※회사별 대표 연락처 및 위치 안내{" "}
                <a href="https://www.sajo.co.kr/group/map.asp" target="_blank" rel="noreferrer">
                  바로가기
                </a>
              </p>
            </div>
          </div>

          {/* 우측 메뉴 영역 */}
          <div className="footer-right">
            <div className="family-link">
              <div className="family-site">
                <button className="toggle-family" onClick={handleFamilyToggle}>FAMILY SITES</button>
                <div className="family-list" ref={familyListRef}>
                  <button className="family-close" onClick={handleFamilyClose}>
                    <i className="ri-close-line"></i>
                    <span className="blind">패밀리 사이트 닫기</span>
                  </button>
                  <ul>
                    {[
                      "사조그룹", "사조산업", "사조씨푸드", "삼아벤처", "사조원", "사조축산부문",
                      "사조대림", "사조오양", "사조동아원", "사조 CPK", "사조 C&C", "푸디스트",
                      "사조시스템즈", "사조몰", "사조회참치몰", "사조김스토어", "사조펫스토어", "식자재왕몰",
                      "사조인재채용", "캐슬렉스 서울", "캐슬렉스 이성대", "캐슬렉스 제주",
                      "사조희망나눔재단", "취암장학재단"
                    ].map((site, i) => (
                      <li key={i}><a href="#" target="_blank" rel="noreferrer">{site}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="footer-menu">
              <a href="https://www.sajo.co.kr/brand/personalInfo.asp" target="_blank" rel="noreferrer">개인정보취급방침</a>
              <a href="https://www.sajo.co.kr/brand/emailRefusal.asp" target="_blank" rel="noreferrer">이메일 무단수집거부</a>
              <a href="https://www.sajo.co.kr/group/ethicsManagement.asp?gi=6" target="_blank" rel="noreferrer">온라인신문고</a>
            </div>

            <div className="corp-info">
              <p className="copyright" style={{ border: "1px solid white" }}>
                &copy; SAJO. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;