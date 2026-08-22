import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/lib/db";
import type { SectionContent } from "@/types/content";

export const SECTION_KEYS = [
  "hero",
  "about",
  "skills",
  "projects",
  "experience",
  "achievements",
  "contact",
  "blog",
] as const;

export class PageSection extends Model {
  declare id: string;
  declare key: string;
  declare eyebrow: string | null;
  declare title: string | null;
  declare titleHighlight: string | null;
  declare description: string | null;
  declare content: SectionContent;
  declare sortOrder: number;
  declare isVisible: boolean;
}

PageSection.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    key: { type: DataTypes.STRING(40), allowNull: false, unique: true },
    eyebrow: { type: DataTypes.STRING(60) },
    // `title` is the plain part of the heading, `titleHighlight` the gradient span.
    title: { type: DataTypes.STRING(120) },
    titleHighlight: { type: DataTypes.STRING(60) },
    description: { type: DataTypes.TEXT },
    content: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    sortOrder: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 0 },
    isVisible: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { sequelize, modelName: "PageSection", tableName: "page_sections" }
);
