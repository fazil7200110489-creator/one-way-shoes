import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  images: [{ type: String }],
  sizes: [{ type: Number }],
  colors: [{ type: String }],
  stock: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  limited: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

const OrderSchema = new Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  productName: { type: String },
  size: { type: Number },
  color: { type: String },
  amount: { type: Number },
  paymentScreenshot: { type: String },
  status: { 
    type: String, 
    enum: ["Pending", "Verified", "Rejected", "Shipped", "Delivered"], 
    default: "Pending" 
  },
}, { timestamps: true });

export const Product = models.Product || model("Product", ProductSchema);
export const Order = models.Order || model("Order", OrderSchema);
