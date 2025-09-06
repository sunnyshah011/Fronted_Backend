  import mongoose from "mongoose";

  const subcategorySchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      slug: { type: String, required: true },
      category: { type: mongoose.Schema.Types.ObjectId, ref: "category", required: true },
    },
    { timestamps: true }
  );


subcategorySchema.pre("validate", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

  const SubCategoryModel = mongoose.models.subcategory || mongoose.model("subcategory", subcategorySchema);

  export default SubCategoryModel

