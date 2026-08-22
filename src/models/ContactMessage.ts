import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/lib/db";

export class ContactMessage extends Model {
  declare id: string;
  declare name: string;
  declare email: string;
  declare subject: string | null;
  declare message: string;
  declare ipAddress: string | null;
  declare userAgent: string | null;
  declare status: string;
  declare repliedAt: Date | null;
  declare createdAt: Date;
}

ContactMessage.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(160), allowNull: false, validate: { isEmail: true } },
    subject: { type: DataTypes.STRING(200) },
    message: { type: DataTypes.TEXT, allowNull: false },
    // Kept for rate limiting and spam triage, not displayed anywhere.
    ipAddress: { type: DataTypes.INET },
    userAgent: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: "new",
      validate: { isIn: [["new", "read", "replied", "spam"]] },
    },
    repliedAt: { type: DataTypes.DATE },
  },
  {
    sequelize,
    modelName: "ContactMessage",
    tableName: "contact_messages",
    indexes: [{ fields: ["status"] }, { fields: ["created_at"] }],
  }
);
