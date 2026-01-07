import mongoose, { Schema, models, model } from "mongoose";

const ProductSchema = new Schema(
  {
    image: {
  type: String,
},

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt auto
  }
);

// Hot-reload safe export (Next.js specific)
const Product = models.Product || model("Product", ProductSchema);

export default Product;
