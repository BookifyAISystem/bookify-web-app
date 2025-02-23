import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Banner.css";

// Import trực tiếp hình ảnh
import banner1 from "../../assets/images/banner1.png";
import banner2 from "../../assets/images/banner2.png";

const BannerSlider = () => {
  return (
    <div className="banner-slider">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
      >
        <SwiperSlide>
          <img src={banner1} alt="Discount Voucher 30%" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={banner2} alt="Special Offer" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default BannerSlider;
