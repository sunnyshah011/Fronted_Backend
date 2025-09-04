// import { useState } from "react";
// import { assets } from "../assets/admin_assets/assets";
// import axios from "axios";
// import { BackendUrl } from "../App";
// import { toast } from "react-toastify";

// const Add = ({ token }) => {
//   const [image1, setImage1] = useState(false);
//   const [image2, setImage2] = useState(false);
//   const [image3, setImage3] = useState(false);
//   const [image4, setImage4] = useState(false);

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [sizes, setSizes] = useState([]);
//   const [category, setCategory] = useState("Men");
//   const [subcategory, setSubCategory] = useState("Topwear");
//   const [bestseller, setBestseller] = useState(false);

//   const onSubmitHandler = async (e) => {
//     e.preventDefault(); // Prevent form reload

//     try {
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("description", description);
//       formData.append("price", price);
//       formData.append("category", category);
//       formData.append("subCategory", subcategory);
//       formData.append("sizes", JSON.stringify(sizes)); // we cannot send array directly we should change into string

//       console.log("FormData before sending:", formData);

//       image1 && formData.append("image1", image1);
//       image2 && formData.append("image2", image2);
//       image3 && formData.append("image3", image3);
//       image4 && formData.append("image4", image4);

//       const response = await axios.post(
//         BackendUrl + "/api/product/add",
//         formData,
//         { headers: { token } }
//       );

//       if (response.data.success) {
//         toast.success(response.data.message);
//         setName("");
//         setDescription("");
//         setImage1(false);
//         setImage2(false);
//         setImage3(false);
//         setImage4(false);
//         setPrice("");
//       } else {
//         toast.error(response.data.message);
//       }

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <form onSubmit={onSubmitHandler}>
//       <div className="mb-4">
//         <p className="mb-3">Upload Image</p>
//         <div className="flex gap-3">
//           <label htmlFor="image1">
//             <img
//               className="w-20"
//               src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
//               alt=""
//             />
//             <input
//               onChange={(e) => setImage1(e.target.files[0])}
//               type="file"
//               id="image1"
//               hidden
//             />
//           </label>

//           <label htmlFor="image2">
//             <img
//               className="w-20"
//               src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
//               alt=""
//             />
//             <input
//               onChange={(e) => setImage2(e.target.files[0])}
//               type="file"
//               id="image2"
//               hidden
//             />
//           </label>

//           <label htmlFor="image3">
//             <img
//               className="w-20"
//               src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
//               alt=""
//             />
//             <input
//               onChange={(e) => setImage3(e.target.files[0])}
//               type="file"
//               id="image3"
//               hidden
//             />
//           </label>

//           <label htmlFor="image4">
//             <img
//               className="w-20"
//               src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
//               alt=""
//             />
//             <input
//               onChange={(e) => setImage4(e.target.files[0])}
//               type="file"
//               id="image4"
//               hidden
//             />
//           </label>
//         </div>
//       </div>

//       <div className="w-full">
//         <p className="mb-2">Product name</p>
//         <input
//           onChange={(e) => setName(e.target.value)}
//           value={name}
//           className="w-full max-w-[300px] px-3 py-2 "
//           type="text"
//           placeholder="product name"
//         />
//       </div>

//       <div className="w-full">
//         <p className="mb-2">Product description</p>
//         <textarea
//           onChange={(e) => setDescription(e.target.value)}
//           value={description}
//           className="w-full max-w-[300px] px-3 py-2 "
//           type="text"
//           placeholder="write prduct description"
//         />
//       </div>

//       <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
//         <div>
//           <p className="mb-2">Category</p>
//           <select
//             onChange={(e) => setCategory(e.target.value)}
//             className="w-full px-3 py-2"
//             name=""
//             id=""
//           >
//             <option value="Men">Men</option>
//             <option value="Women">Women</option>
//             <option value="Kids">Kids</option>
//           </select>
//         </div>

//         <div>
//           <p onChange={(e) => setSubCategory(e.target.value)} className="mb-2">
//             Sub-Category
//           </p>
//           <select className="w-full px-3 py-2" name="" id="">
//             <option value="Topwear">Topwear</option>
//             <option value="Bottomwear">Bottomwear</option>
//             <option value="Winterwear">Winterwear</option>
//           </select>
//         </div>

//         <div>
//           <p className="mb-2">Product Price</p>
//           <input
//             onChange={(e) => setPrice(e.target.value)}
//             value={price}
//             className="w-full px-3 py-2 sm:w-[120px] "
//             type="Number"
//             placeholder="Price"
//             required
//           />
//         </div>
//       </div>

//       <div>
//         <p className="mb-2">Product size</p>
//         <div className="flex gap-3">
//           <div
//             onClick={() =>
//               setSizes((pre) =>
//                 pre.includes("S")
//                   ? pre.filter((item) => item !== "S")
//                   : [...pre, "S"]
//               )
//             }
//           >
//             <p
//               className={`${
//                 sizes.includes("S") ? "bg-pink-100" : "bg-slate-200"
//               } px-3 py-1 cursor-pointer`}
//             >
//               S
//             </p>
//           </div>
//           <div
//             onClick={() =>
//               setSizes((pre) =>
//                 pre.includes("M")
//                   ? pre.filter((item) => item !== "M")
//                   : [...pre, "M"]
//               )
//             }
//           >
//             <p
//               className={`${
//                 sizes.includes("M") ? "bg-pink-100" : "bg-slate-200"
//               } px-3 py-1 cursor-pointer`}
//             >
//               M
//             </p>
//           </div>
//           <div
//             onClick={() =>
//               setSizes((pre) =>
//                 pre.includes("XL")
//                   ? pre.filter((item) => item !== "XL")
//                   : [...pre, "XL"]
//               )
//             }
//           >
//             <p
//               className={`${
//                 sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200"
//               } px-3 py-1 cursor-pointer`}
//             >
//               XL
//             </p>
//           </div>
//           <div
//             onClick={() =>
//               setSizes((pre) =>
//                 pre.includes("XXL")
//                   ? pre.filter((item) => item !== "XXL")
//                   : [...pre, "XXL"]
//               )
//             }
//           >
//             <p
//               className={`${
//                 sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200"
//               } px-3 py-1 cursor-pointer`}
//             >
//               XXL
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="mt-3 flex gap-2">
//         <input
//           onChange={() => setBestseller((pre) => !pre)}
//           checked={bestseller}
//           type="checkbox"
//           id="bestseller"
//         />
//         <label className="cursor-pointer" htmlFor="bestseller">
//           Add to Bestseller
//         </label>
//       </div>

//       <button className="bg-black py-2 px-10 mt-5 text-white">ADD</button>
//     </form>
//   );
// };

// export default Add;

import { useState, useEffect } from "react";
import axios from "axios";
import { BackendUrl } from "../App";
import { toast } from "react-toastify";

const AddProduct = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [images, setImages] = useState({});
  const [colors, setColors] = useState([]);
  const [attributes, setAttributes] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // Fetch categories
  const loadCategories = async () => {
    const res = await axios.get(BackendUrl + "/api/categories");
    setCategories(res.data.categories || []); // <-- pick categories array
  };

  //fetch subcategories
  const loadSubcategories = async (categoryId) => {
    try {
      const res = await axios.get(
        `${BackendUrl}/api/subcategories/category/${categoryId}`
      );
      setSubcategories(res.data.subcategories || []);
    } catch (err) {
      console.error(err);
    }
  };

  // On category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(""); // reset subcategory
    loadSubcategories(categoryId); // fetch related subcategories
  };

    useEffect(() => {
      loadCategories();
    }, []);

  // Fetch categories and subcategories
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const catRes = await axios.get(`${BackendUrl}/api/category/list`);
  //     const subRes = await axios.get(`${BackendUrl}/api/subcategory/list`);
  //     setCategories(catRes.data.categories);
  //     setSubcategories(subRes.data.subcategories);
  //   };
  //   fetchData();
  // }, []);

  const handleImageChange = (e, field) =>
    setImages({ ...images, [field]: e.target.files[0] });

  const addAttribute = () =>
    setAttributes([...attributes, { name: "", value: "", unit: "" }]);
  const handleAttrChange = (index, key, val) => {
    const newAttrs = [...attributes];
    newAttrs[index][key] = val;
    setAttributes(newAttrs);
  };
  const removeAttribute = (index) =>
    setAttributes(attributes.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubcategory) return toast.error("Select a subcategory");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("subcategory", selectedSubcategory);
    formData.append("colors", JSON.stringify(colors));
    formData.append("attributes", JSON.stringify(attributes));

    ["image1", "image2", "image3", "image4"].forEach(
      (f) => images[f] && formData.append(f, images[f])
    );

    try {
      const res = await axios.post(`${BackendUrl}/api/product/add`, formData, {
        headers: { token },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setName("");
        setDescription("");
        setPrice("");
        setStock("");
        setColors([]);
        setAttributes([]);
        setImages({});
      } else toast.error(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />

      <select
        value={selectedCategory}
        onChange={(e) => handleCategoryChange(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={selectedSubcategory}
        onChange={(e) => setSelectedSubcategory(e.target.value)}
      >
        <option value="">Select Subcategory</option>
        {subcategories.map((sub) => (
          <option key={sub._id} value={sub._id}>
            {sub.name}
          </option>
        ))}
      </select>

      <div>
        <p>Colors (comma separated):</p>
        <input
          type="text"
          value={colors.join(",")}
          onChange={(e) => setColors(e.target.value.split(","))}
        />
      </div>

      <div>
        <p>Attributes:</p>
        {attributes.map((attr, i) => (
          <div key={i}>
            <input
              placeholder="Name"
              value={attr.name}
              onChange={(e) => handleAttrChange(i, "name", e.target.value)}
            />
            <input
              placeholder="Value"
              value={attr.value}
              onChange={(e) => handleAttrChange(i, "value", e.target.value)}
            />
            <input
              placeholder="Unit"
              value={attr.unit}
              onChange={(e) => handleAttrChange(i, "unit", e.target.value)}
            />
            <button type="button" onClick={() => removeAttribute(i)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addAttribute}>
          Add Attribute
        </button>
      </div>

      <div>
        <p>Images:</p>
        {["image1", "image2", "image3", "image4"].map((f) => (
          <input
            key={f}
            type="file"
            onChange={(e) => handleImageChange(e, f)}
          />
        ))}
      </div>

      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProduct;
