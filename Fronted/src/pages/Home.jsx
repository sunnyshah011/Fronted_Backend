import { useEffect } from "react";
import Hero from "../component/Hero";
import Main_Category from "../component/MainCategory";
import AllProducts from "../component/AllProducts";
import FlashSale from "../component/FlashSale";
// import TopProducts from "../component/TopProducts";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Hero />
      <Main_Category />
      {/* <TopProducts /> */}
      <FlashSale />
      <AllProducts />
    </div>
  );
};

export default Home;
