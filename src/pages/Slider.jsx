import { getSlider } from "@/services/SliderService";
import React, { useState, useEffect } from "react";


export default function Slider() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSlider();
      setSlides(data.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <div className="relative w-full h-[700px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0"
            }`}
        >
          <img
            data-aos="fade-in"
            data-aos-duration="800"
            src={slide.img_url}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          {/* <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center px-4">
            <h1 data-aos="fade-up" data-aos-delay="600" className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              {slide.title}
            </h1>
            <p data-aos="fade-up" data-aos-delay="400" className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl">
              {slide.description}
            </p>
            <div data-aos="zoom-in" data-aos-delay="800">
              <button className="mt-6 bg-white text-black font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-200 transition">
                Xem ngay
              </button>
            </div>

          </div> */}
        </div>
      ))}

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition  ${current === index ? "bg-white" : "bg-gray-400"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
