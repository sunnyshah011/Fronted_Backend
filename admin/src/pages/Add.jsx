import React from "react";
import { assets } from "../assets/admin_assets/assets";

const Add = () => {
  return (
    <form action="">
      <div className="mb-4">
        <p className="mb-3">Upload Image</p>
        <div className="flex gap-3">
          <label htmlFor="image1">
            <img className="w-20" src={assets.upload_area} alt="" />
            <input type="file" id="image1" hidden />
          </label>

          <label htmlFor="image2">
            <img className="w-20" src={assets.upload_area} alt="" />
            <input type="file" id="image2" hidden />
          </label>

          <label htmlFor="image3">
            <img className="w-20" src={assets.upload_area} alt="" />
            <input type="file" id="image3" hidden />
          </label>

          <label htmlFor="image4">
            <img className="w-20" src={assets.upload_area} alt="" />
            <input type="file" id="image4" hidden />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input
          className="w-full max-w-[300px] px-3 py-2 "
          type="text"
          placeholder="product name"
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea
          className="w-full max-w-[300px] px-3 py-2 "
          type="text"
          placeholder="write prduct description"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select className="w-full px-3 py-2" name="" id="">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Sub-Category</p>
          <select className="w-full px-3 py-2" name="" id="">
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            className="w-full px-3 py-2 sm:w-[120px] "
            type="Number"
            placeholder="25"
          />
        </div>
      </div>

      <div>
        <p className="mb-2">Product size</p>
        <div className="flex gap-3">
          <div>
            <p className="bg-slate-200 px-3 py-1 cursor-pointer">S</p>
          </div>
          <div>
            <p className="bg-slate-200 px-3 py-1 cursor-pointer">M</p>
          </div>
          <div>
            <p className="bg-slate-200 px-3 py-1 cursor-pointer">XL</p>
          </div>
          <div>
            <p className="bg-slate-200 px-3 py-1 cursor-pointer">XXL</p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <input type="checkbox" id="bestseller" />
        <label className="cursor-pointer" htmlFor="bestseller">Add to Bestseller</label>
      </div>


      <button className="bg-black py-2 px-10 mt-5 text-white">ADD</button>
    </form>
  );
};

export default Add;
