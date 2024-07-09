import React from "react";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Link from "next/link";
import SampleImage from "../../../../public/bedroom.jpg";
import Image from "next/image";
export default function ProductsList() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-heading">Shop these real-life spaces</h2>
        <div className="w-full h-[350px] md:h-[480px]">
          <Swiper
            modules={[Navigation, Autoplay]}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            breakpoints={{
              740: {
                slidesPerView: 2,
                spaceBetween: 20,
              },

              1024: {
                loop: true,
                slidesPerView: 3.5,
                spaceBetween: 24,
              },
            }}
            className="relative w-full h-full"
          >
            {Array(6)
              .fill(0)
              .map((item, index) => (
                <SwiperSlide className="overflow-hidden" key={index}>
                  <Link href="" className="w-full h-full relative">
                    <Image
                      src={SampleImage}
                      alt="product"
                      width="0"
                      height="0"
                      className="object-cover w-full h-full transition-all duration-300  rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
                    <div className="absolute bottom-10 left-10 text-white text-4xl uppercase font-semibold">
                      Bed Room
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
