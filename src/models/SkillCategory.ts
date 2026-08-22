import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/lib/db";
import type { SkillItem } from "@/types/content";

export class SkillCategory extends Model {
  declare id: string;
  declare name: string;
  declare slug: string;
  declare skills: SkillItem[];
  declare sortOrder: number;
  declare isDefault: boolean;
  declare isVisible: boolean;
}

SkillCategory.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    // Display name keeps its decoration, e.g. "✦ Full Stack".
    name: { type: DataTypes.STRING(60), allowNull: false },
    slug: { type: DataTypes.STRING(60), allowNull: false, unique: true },
    skills: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    sortOrder: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 0 },
    // The category the Skills orbit opens on.
    isDefault: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isVisible: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { sequelize, modelName: "SkillCategory", tableName: "skill_categories" }
);
