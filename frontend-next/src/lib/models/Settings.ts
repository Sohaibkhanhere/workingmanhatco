import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  colors: Record<string, string>;
  tax: { rate: number; enabled: boolean; label: string };
  shipping: { freeThreshold: number; flatRate: number; enabled: boolean };
  discounts: {
    code: string;
    type: string;
    value: number;
    minOrder: number;
    maxUses: number;
    usedCount: number;
    active: boolean;
    expiresAt?: Date;
    createdAt: Date;
  }[];
  promos: {
    title: string;
    description: string;
    discountCode: string;
    bannerText: string;
    active: boolean;
    startsAt?: Date;
    endsAt?: Date;
  }[];
  social: Record<string, string>;
  contact: Record<string, string>;
  seo: Record<string, any>;
  policies: Record<string, string>;
}

const settingsSchema = new Schema<ISettings>({
  siteName: { type: String, default: "Workin' Man Hat Co." },
  tagline: { type: String, default: "For your every day workin'man" },
  logo: { type: String, default: 'https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1754520881053-GITP2B476NHFI441CJ5Y/IMG_3617.jpeg?format=1500w' },
  favicon: { type: String, default: '' },
  colors: { type: Schema.Types.Mixed, default: {} },
  tax: {
    rate: { type: Number, default: 8.25 },
    enabled: { type: Boolean, default: true },
    label: { type: String, default: 'Sales Tax' }
  },
  shipping: {
    freeThreshold: { type: Number, default: 75 },
    flatRate: { type: Number, default: 8.99 },
    enabled: { type: Boolean, default: true }
  },
  discounts: [{
    code: { type: String, required: true },
    type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    value: { type: Number, required: true },
    minOrder: { type: Number, default: 0 },
    maxUses: { type: Number, default: -1 },
    usedCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    expiresAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
  }],
  promos: [{
    title: { type: String, required: true },
    description: { type: String, default: '' },
    discountCode: { type: String, default: '' },
    bannerText: { type: String, default: '' },
    active: { type: Boolean, default: true },
    startsAt: { type: Date },
    endsAt: { type: Date }
  }],
  social: { type: Schema.Types.Mixed, default: {} },
  contact: { type: Schema.Types.Mixed, default: {} },
  seo: { type: Schema.Types.Mixed, default: {} },
  policies: { type: Schema.Types.Mixed, default: {} }
}, { timestamps: true });

const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', settingsSchema);

export default Settings;
