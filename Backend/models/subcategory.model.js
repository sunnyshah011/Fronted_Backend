  import mongoose from "mongoose";

  const subcategorySchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      slug: { type: String, required: true },
      category: { type: mongoose.Schema.Types.ObjectId, ref: "category", required: true },
    },
    { timestamps: true }
  );


  const SubCategoryModel = mongoose.models.subcategory || mongoose.model("subcategory", subcategorySchema);

  export default SubCategoryModel

