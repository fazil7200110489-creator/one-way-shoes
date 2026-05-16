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
  isLimitedEdition: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  rotationImages: [{ type: String }],
  model3DUrl: { type: String },
}, { timestamps: true });

const OrderSchema = new Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  productName: { type: String },
  size: { type: String },
  color: { type: String },
  quantity: { type: Number, default: 1 },
  amount: { type: Number },
  paymentScreenshot: { type: String },
  status: { 
    type: String, 
    enum: ["Pending Verification", "Verified", "Rejected", "Shipped", "Delivered"], 
    default: "Pending Verification" 
  },
}, { timestamps: true });

export const Product = models.Product || model("Product", ProductSchema);
export const Order = models.Order || model("Order", OrderSchema);

const AdminSettingsSchema = new Schema({
  profile: {
    name: { type: String, default: "Admin" },
    email: { type: String, default: "admin@onewayshoes.com" },
    storeName: { type: String, default: "ONE WAY SHOES" },
    storeLogo: { type: String, default: "https://i.pravatar.cc/150?u=admin" }
  },
  notifications: {
    orderAlerts: { type: Boolean, default: true },
    paymentAlerts: { type: Boolean, default: true },
    lowStockAlerts: { type: Boolean, default: true },
    limitedEditionAlerts: { type: Boolean, default: true },
    whatsappNotifications: { type: Boolean, default: true }
  },
  mobileExperience: {
    compactMode: { type: Boolean, default: false },
    reducedAnimations: { type: Boolean, default: false },
    highPerformanceMode: { type: Boolean, default: true },
    imageQualityOptimization: { type: Boolean, default: true },
    mobileUploadOptimization: { type: Boolean, default: true }
  },
  regional: {
    currency: { type: String, default: "INR" },
    timezone: { type: String, default: "Asia/Kolkata" },
    language: { type: String, default: "English" },
    region: { type: String, default: "India" }
  },
  security: {
    password: { type: String, required: true } // Usually hashed
  }
}, { timestamps: true });

export const AdminSettings = models.AdminSettings || model("AdminSettings", AdminSettingsSchema);
