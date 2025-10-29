// Financial.jsx

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Financial() {
  const revenueRef = useRef(null);
  const profitRef = useRef(null);
  const assetRef = useRef(null);

  useEffect(() => {
    const animateCount = (element, end, duration = 1000) => {
      let start = 0;
      let startTime = null;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percent = Math.min(progress / duration, 1);
        element.innerText = Math.floor(percent * end).toLocaleString();

        if (progress < duration) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    ScrollTrigger.create({
      trigger: '.financial-section',
      start: 'top 80%',
      // markers: true, // 개발 중일 때만 활성화
      onEnter: () => {
        animateCount(revenueRef.current, 41295);
        animateCount(profitRef.current, 1549);
        animateCount(assetRef.current, 35885);
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="financial-section">
      <h2 className="financial-title sec-title">주요 재무 지표</h2>
      <div className="bg-container">
        <div className="financial-grid">
          <div className="financial-item">
            <div className="financial-label">매출액</div>
            <div className="financial-number" ref={revenueRef}>0</div>
            <div className="financial-note">전년 대비 +5,003억 증가</div>
          </div>
          <div className="financial-item">
            <div className="financial-label">영업이익</div>
            <div className="financial-number" ref={profitRef}>0</div>
            <div className="financial-note">전년 대비 감소</div>
          </div>
          <div className="financial-item">
            <div className="financial-label">총자산</div>
            <div className="financial-number" ref={assetRef}>0</div>
            <div className="financial-note">전년 대비 +2,804억 증가</div>
          </div>
        </div>

        <div className="grid-bg">
          <img
            src="./img/fisherman_cassiano-psomas-C6aNNakl7ok-unsplash.jpg"
            alt="어부 배경 이미지"
          />
        </div>
      </div>
    </section>
  );
}

export default Financial;