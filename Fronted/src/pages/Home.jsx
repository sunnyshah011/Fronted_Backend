import { useEffect } from "react";
import Hero from "../component/Hero";
import P_Category from "../component/MainCategory";
import AllProducts from "../component/AllProducts";
import FlashSale from "../component/FlashSale";
import TopProducts from "../component/TopProducts";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Hero />
      <P_Category />
      <TopProducts />
      <FlashSale />
      <AllProducts />
    </div>
  );
};

export default Home;
