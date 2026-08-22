import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/lib/db";

export class Experience extends Model {
  declare id: string;
  declare role: string;
  declare company: string;
  declare companyUrl: string | null;
  declare duration: string;
  declare impact: string;
  declare points: string[];
  declare stack: string[];
  declare sortOrder: number;
  declare isCurrent: boolean;
}

Experience.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    role: { type: DataTypes.STRING(120), allowNull: false },
    company: { type: DataTypes.STRING(120), allowNull: false },
    companyUrl: { type: DataTypes.TEXT },
    duration: { type: DataTypes.STRING(60) },
    impact: { type: DataTypes.TEXT },
    // Key responsibilities, in display order.
    points: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    stack: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    sortOrder: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 0 },
    isCurrent: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { sequelize, modelName: "Experience", tableName: "experiences" }
);
