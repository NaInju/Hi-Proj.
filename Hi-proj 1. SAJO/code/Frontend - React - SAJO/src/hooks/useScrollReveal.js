// hooks/useScrollReveal.js

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useScrollReveal() {
  useEffect(() => {
    const sections = gsap.utils.toArray("section").filter(
        section => !section.classList.contains("enter-scroll-section")
    );
    sections.forEach(section => {
      gsap.from(section, {
        y: 100,
        opacity: 0,
        duration: 0.5,
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
}