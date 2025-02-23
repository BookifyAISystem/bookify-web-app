import React from "react";
import Navbar from "../Navbar/Navbar";
import Banner from "../Banner/Banner"; // Import Banner
import BookInforGridRender from "../BookInfor/BookInforGridRender";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Banner /> {/* Gọi Banner */}
      <BookInforGridRender />
    </div>
  );
};

export default HomePage;
