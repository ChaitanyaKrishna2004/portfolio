import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/lib/db";

export class Media extends Model {
  declare id: string;
  declare provider: string;
  declare publicId: string | null;
  declare url: string;
  declare type: string;
  declare altText: string | null;
  declare width: number | null;
  declare height: number | null;
  declare durationSec: number | null;
  declare bytes: number | null;
  declare format: string | null;
  declare folder: string | null;
  declare uploadedBy: string | null;
  declare isArchived: boolean;
}

Media.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    // "local" until S3/Cloudinary credentials are configured; the rest of the
    // app only ever reads `url`, so switching providers is a data change.
    provider: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "local",
      validate: { isIn: [["local", "s3", "cloudinary"]] },
    },
    publicId: { type: DataTypes.STRING(200) },
    url: { type: DataTypes.TEXT, allowNull: false },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "image",
      validate: { isIn: [["image", "video", "document"]] },
    },
    altText: { type: DataTypes.STRING(200) },
    width: { type: DataTypes.INTEGER },
    height: { type: DataTypes.INTEGER },
    durationSec: { type: DataTypes.DECIMAL(10, 2) },
    bytes: { type: DataTypes.BIGINT },
    format: { type: DataTypes.STRING(12) },
    folder: { type: DataTypes.STRING(120) },
    uploadedBy: { type: DataTypes.UUID },
    isArchived: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { sequelize, modelName: "Media", tableName: "media" }
);
