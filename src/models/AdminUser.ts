import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/lib/db";

export class AdminUser extends Model {
  declare id: string;
  declare email: string;
  declare passwordHash: string;
  declare name: string;
  declare role: string;
  declare lastLoginAt: Date | null;
  declare isActive: boolean;
}

AdminUser.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING(160), allowNull: false, unique: true, validate: { isEmail: true } },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    name: { type: DataTypes.STRING(120) },
    role: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: "owner",
      validate: { isIn: [["owner", "editor"]] },
    },
    lastLoginAt: { type: DataTypes.DATE },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { sequelize, modelName: "AdminUser", tableName: "admin_users" }
);
