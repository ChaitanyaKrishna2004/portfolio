import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/lib/db";
import type { ButtonMap, NavLink, SocialLink, TextMap } from "@/types/content";

export class SiteSetting extends Model {
  declare id: string;
  declare brandName: string;
  declare brandSuffix: string;
  declare metaTitle: string;
  declare metaDescription: string;
  declare profilePhotoId: string | null;
  declare ogImageId: string | null;
  declare profilePhotoUrl: string | null;
  declare resumeUrl: string | null;
  declare availabilityText: string | null;
  declare footerTagline: string | null;
  declare copyrightName: string | null;
  declare defaultTheme: string;
  declare navLinks: NavLink[];
  declare socialLinks: SocialLink[];
  declare buttons: ButtonMap;
  declare uiTexts: TextMap;
}

SiteSetting.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    brandName: { type: DataTypes.STRING(80), allowNull: false },
    brandSuffix: { type: DataTypes.STRING(8), defaultValue: "." },
    metaTitle: { type: DataTypes.STRING(160), allowNull: false },
    metaDescription: { type: DataTypes.TEXT },
    profilePhotoId: { type: DataTypes.UUID },
    ogImageId: { type: DataTypes.UUID },
    // Denormalized so the layout renders without joining media.
    profilePhotoUrl: { type: DataTypes.TEXT },
    resumeUrl: { type: DataTypes.TEXT },
    availabilityText: { type: DataTypes.STRING(120) },
    footerTagline: { type: DataTypes.STRING(160) },
    copyrightName: { type: DataTypes.STRING(120) },
    defaultTheme: {
      type: DataTypes.STRING(10),
      defaultValue: "dark",
      validate: { isIn: [["dark", "light", "system"]] },
    },
    navLinks: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    socialLinks: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    buttons: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    uiTexts: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
  },
  { sequelize, modelName: "SiteSetting", tableName: "site_settings" }
);
