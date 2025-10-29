// News.jsx

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function News() {
  const listRef = useRef([]);

  useEffect(() => {
    listRef.current.forEach((li) => {
      gsap.fromTo(
        li,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: li,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
    // ✅ 트리거 강제 새로고침
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const newsItems = [
    {
      link: "https://www.sajo.co.kr/prcenter/sajostoryView.asp?gi=2&idx=3044&board_group_idx=3",
      img: "./img/news/news1_checking_0186.jpg",
      cate: "푸디스트",
      title: "장마철 대비 전 사업장 안전 점검 실시",
      desc:
        "식자재 전문기업 푸디스트가 장마철 집중호우와 강풍으로 인한 안전사고를 예방하기 위해 특별 점검을 실시했다고 18일 밝혔다.이번 점검은 전국 급식 사업장, 물류센터, 직영 마트 등 모든 사업장을 대상으로 진행됐다. 회사 측은 침수 위험지역, 붕괴 우려 구간, 누수 가능성 등 현장별 위험 요소를 점검하고 현장 근로자들의 의견을 수렴해 실질적인 안전대책을 마련했다고 설명했다.",
      date: "2025.06.18.",
    },
    {
      link: "https://www.sajo.co.kr/prcenter/sajostoryView.asp?gi=2&idx=3011&board_group_idx=3",
      img: "./img/news/news2_restaurant.jpg",
      cate: "푸디스트",
      title: "“구내식당이 가성비 맛집”…상반기 위탁급식 식수 25% 증가",
      desc:
        "푸디스트는 올 상반기에 다양한 외식 유명 브랜드와 협업을 통해 급식의 외식화를 주도하면서 위탁급식 사업장의 식수 인원과 직장인들의 만족도를 동시에 높였다고 12일 밝혔다.푸디스트에 따르면 올 상반기 브랜드 콜라보 메뉴를 제공한 날에는 위탁급식 사업장의 식수 인원이 평소보다 25% 증가했으며, 고객만족도 역시 매우 높게 나타난 것으로 분석됐다.",
      date: "2025.06.18.",
    },
    {
      link: "https://www.sajo.co.kr/prcenter/sajostoryView.asp?gi=2&idx=3010&board_group_idx=3",
      img: "./img/news/news3_dumpling_dr020sfs031.jpg",
      cate: "사조대림",
      title: "이색 원물 만두 2종 출시… “통째로 넣었다”",
      desc:
        "사조대림이 트렌디한 원재료를 통째로 넣어 식감과 재미를 더한 이색 만두 신제품 ‘통오징어 만두’와 ‘통비프 포테이토 만두’를 출시했다고 2일 밝혔다.이번 신제품은 특색 있는 만두소에 통오징어나 길게 썬 감자 등 원물을 그대로 첨가한 전병 스타일의 만두로 기존 제품과는 차별화된 레시피와 비주얼이 특징이다.‘통오징어 만두’는 백짬뽕 스타일의 해물 만두소 위에 통으로 썬 오징어 몸통을 그대로 올린 제품이다. 돼지고기, 숙주, 오징어 다이스 등으로 구성한 만두소에 불향을 더해 짬뽕 특유의 얼큰한 맛을 살렸으며, 여기에 오징어 몸통을 더해 쫄깃하고 풍성한 식감을 완성했다.",
      date: "2025.06.18.",
    },
  ];

  return (
    <section className="news-wrap">
      <div className="container">
        <div className="news-header">
          <h2 className="sec-title">뉴스</h2>
          <a href="#" className="more-link">더보기</a>
        </div>
        <div className="cont-box">
          <ul className="news-list">
            {newsItems.map((item, idx) => (
              <li key={idx} ref={el => (listRef.current[idx] = el)}>
                <a href={item.link} target="_blank" rel="noreferrer">
                  <div className="thumb-img">
                    <img src={item.img} alt={item.title} />
                  </div>
                  <div className="news-txt">
                    <span className="news-cate">{item.cate}</span>
                    <strong className="news-title">{item.title}</strong>
                    <p>{item.desc}</p>
                    <span className="date">{item.date}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default News;
