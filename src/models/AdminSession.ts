import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/lib/db";

export class AdminSession extends Model {
  declare id: string;
  declare userId: string;
  declare tokenHash: string;
  declare ipAddress: string | null;
  declare userAgent: string | null;
  declare expiresAt: Date;
}

AdminSession.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    // Only the hash is stored — a leaked table cannot be replayed as sessions.
    tokenHash: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    ipAddress: { type: DataTypes.INET },
    userAgent: { type: DataTypes.TEXT },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    modelName: "AdminSession",
    tableName: "admin_sessions",
    indexes: [{ fields: ["expires_at"] }],
  }
);
