// ESG.jsx

import React from 'react';

function ESG() {
  return (
    <section id="ESG" className="esg-section">
      <div className="container">
        <hgroup className="esg-head">
          <h2 className="esg-title sec-title">지속가능경영 ESG</h2>
          <p className="esg-desc">
            사조그룹은 환경 보호, 사회적 책임, 윤리적 지배구조를 통해
            지속가능한 미래를 만들어갑니다.
          </p>
        </hgroup>

        <div className="esg-card-wrapper">
          {/* 환경 */}
          <div
            className="esg-card"
            style={{
              backgroundImage: "url('./img/ESG/Environment-markus-spiske-GnxktpZHjcM-unsplash.jpg')",
            }}
          >
            <div className="content">
              <h3>E – 환경(Environment)</h3>
              <p>
                친환경 제품 개발과 탄소 배출 저감을 통해 지속 가능한 지구를 위한 노력을 실천하고 있습니다.
              </p>
              <a href="#" className="esg-link">자세히 보기 →</a>
            </div>
          </div>

          {/* 사회 */}
          <div
            className="esg-card"
            style={{
              backgroundImage: "url('./img/ESG/Social-shane-rounce-DNkoNXQti3c-unsplash.jpg')",
            }}
          >
            <div className="content">
              <h3>S – 사회(Social)</h3>
              <p>
                협력사, 고객, 지역사회를 위한 사회적 책임을 다하며, 모두가 함께 성장하는 환경을 조성합니다.
              </p>
              <a href="#" className="esg-link">자세히 보기 →</a>
            </div>
          </div>

          {/* 지배구조 */}
          <div
            className="esg-card"
            style={{
              backgroundImage: "url('./img/ESG/Governance-khampha-phimmachak-IRUcIOMOiEI-unsplash.jpg')",
            }}
          >
            <div className="content">
              <h3>G – 지배구조(Governance)</h3>
              <p>
                투명한 경영과 윤리적 의사결정을 통해 신뢰받는 기업문화를 만들어가고 있습니다.
              </p>
              <a href="#" className="esg-link">자세히 보기 →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ESG;