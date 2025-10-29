// EnterScroll.jsx

import React, { useEffect } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

console.log("ScrollTrigger 함수:", typeof ScrollTrigger); // "function" 나와야 함
console.log("ScrollTrigger 등록 확인:", ScrollTrigger); // ✅ function이면 등록할 준비 완료

function EnterScroll() {
  useEffect(() => {
    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".enter-scroll-section",
        start: "top top",
        end: "top+=4000 top",
        scrub: true,
        // markers: true,
      },
    });

    mainTimeline
      .from(".sajo-can img", { opacity: 0, y: 50 })
      .to(".sajo-logo", { opacity: 1, color: "#fff" })
      .to(".sajo-can img", { filter: "blur(10px)", opacity: 0.8 })
      .to([".sajo-can img", ".sajo-logo"], { y: -50 })
      .to(".sajo-description", { opacity: 1 });

    const transitionTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".enter-scroll-section",
        start: "top+=4200 top",
        end: "top+=4400 top",
        scrub: true,
      },
    });

    transitionTimeline.to(".enter-scroll-section", { backgroundColor: "#fff" });
    transitionTimeline.to(".sajo-description", { opacity: 0 }, "<");

    ScrollTrigger.matchMedia({
      "(max-width: 500px)": function () {
        gsap.to(".sajo-logo", {
          scale: 0.2,
          y: -200,
          scrollTrigger: {
            trigger: ".enter-scroll-section",
            start: "top+=4200 top",
            end: "top+=4400 top",
            scrub: true,
          },
        });
      },
      "(max-width: 800px)": function () {
        gsap.to(".sajo-logo", {
          scale: 0.3,
          y: -300,
          scrollTrigger: {
            trigger: ".enter-scroll-section",
            start: "top+=4200 top",
            end: "top+=4400 top",
            scrub: true,
          },
        });
      },
      "(min-width: 801px)": function () {
        gsap.to(".sajo-logo", {
          scale: 0.3,
          y: -350,
          scrollTrigger: {
            trigger: ".enter-scroll-section",
            start: "top+=4200 top",
            end: "top+=4400 top",
            scrub: true,
          },
        });
      },
    });

    const colors = ["#02164E", "#00831D", "#D90000"];
    const panels = document.querySelectorAll(".keyword-panel");
    const baseStart = 4500;
    const stay = 2000;
    const fade = 600;

    panels.forEach((panel, i) => {
      const start = baseStart + i * (stay + fade);
      const end = start + (i === panels.length - 1 ? 1500 : stay);

      gsap.fromTo(
        panel,
        { y: 100, opacity: 0 },
        {
          y: -40,
          opacity: 1,
          scrollTrigger: {
            trigger: ".enter-scroll-section",
            start: `top+=${start} top`,
            end: `top+=${end} top`,
            scrub: true,
            snap: 0.1,
            onEnter: () => gsap.to(".sajo-logo", { color: colors[i], duration: 0.3 }),
            onEnterBack: () => gsap.to(".sajo-logo", { color: colors[i], duration: 0.3 }),
          },
        }
      );

      if (i !== panels.length - 1) {
        gsap.to(panel, {
          opacity: 0,
          y: -100,
          scrollTrigger: {
            trigger: ".enter-scroll-section",
            start: `top+=${end} top`,
            end: `top+=${end + fade} top`,
            scrub: true,
          },
        });
      }
    });

    ScrollTrigger.create({
      trigger: ".enter-scroll-section",
      start: "top+=4800 top",
      end: "top+=4900 top",
      scrub: true,
      onEnterBack: () => {
        gsap.to(".sajo-logo", { color: "#fff", duration: 0.3 });
      },
      onLeave: () => {
        document.querySelector('.enter-scroll-section').style.position = 'static';
      },
    });

    ScrollTrigger.refresh();
  }, []);

  return (
    <section className="enter-scroll-section">
      <div className="sajo-sticky">
        <div className="sajo-can">
          <img
            src="./img/products/grid_visual/sajotuna_can_product_1000002397_detail_078.png"
            alt="사조참치"
          />
        </div>
        <div className="sajo-logo">SAJO</div>
        <div className="sajo-description">
          언제 어디서나 고객이 안심하고{" "}
          <span className="mobile-br">
            <br />
          </span>
          선택할 수 있는 기업, 사조입니다
        </div>
        <div className="keyword-panel" style={{ color: "var(--main-navy)" }}>
          <strong>CHALLENGE
            <br />
          </strong>
          <span>미래를 향한 끊임없는 도전</span>
        </div>
        <div className="keyword-panel" style={{ color: "var(--main-green)" }}>
          <strong>CONFIDENCE
            <br />
          </strong>
          <span>고객에게 믿음을 파는 기업</span>
        </div>
        <div className="keyword-panel" style={{ color: "var(--main-red)" }}>
          <strong>PASSION
            <br />
          </strong>
          <span>최고의 맛을 창조하는 뜨거운 열정</span>
        </div>
      </div>
    </section>
  );
}

export default EnterScroll;