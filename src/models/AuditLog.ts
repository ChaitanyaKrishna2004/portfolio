import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/lib/db";

export class AuditLog extends Model {
  declare id: string;
  declare userId: string | null;
  declare action: string;
  declare entity: string;
  declare entityId: string | null;
  declare diff: Record<string, unknown> | null;
  declare createdAt: Date;
}

AuditLog.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID },
    action: {
      type: DataTypes.STRING(12),
      allowNull: false,
      validate: { isIn: [["create", "update", "delete", "login", "logout"]] },
    },
    entity: { type: DataTypes.STRING(60), allowNull: false },
    entityId: { type: DataTypes.UUID },
    diff: { type: DataTypes.JSONB },
  },
  {
    sequelize,
    modelName: "AuditLog",
    tableName: "audit_logs",
    updatedAt: false,
    indexes: [{ fields: ["entity", "entity_id"] }, { fields: ["created_at"] }],
  }
);
