import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// auto-generate slug
// categorySchema.pre("validate", function (next) {
//   if (this.name) {
//     this.slug = slugify(this.name, { lower: true });
//   }
//   next();
// });

const CategoryModel =
  mongoose.models.category || mongoose.model("category", categorySchema);

export default CategoryModel;
