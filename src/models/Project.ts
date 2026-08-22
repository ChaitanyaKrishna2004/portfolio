import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/lib/db";
import type {
  ArchitectureLayer,
  GalleryItem,
  ProjectFeature,
  ProjectInfo,
  ProjectPoints,
} from "@/types/content";

export class Project extends Model {
  declare id: string;
  declare slug: string;
  declare title: string;
  declare role: string;
  declare category: string;
  declare problem: string;
  declare solution: string;
  declare outcome: string;
  declare description: string;
  declare overview: string;
  declare about: string;
  declare videoUrl: string | null;
  declare githubUrl: string | null;
  declare demoUrl: string | null;
  declare techCard: string[];
  declare techDetail: string[];
  declare gallery: GalleryItem[];
  declare features: ProjectFeature[];
  declare architecture: ArchitectureLayer[];
  declare points: ProjectPoints;
  declare projectInfo: ProjectInfo;
  declare sortOrder: number;
  declare isFeatured: boolean;
  declare isPublished: boolean;
}

Project.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    slug: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    title: { type: DataTypes.STRING(120), allowNull: false },
    role: { type: DataTypes.STRING(120) },
    category: { type: DataTypes.STRING(80) },

    // Home-page card copy
    problem: { type: DataTypes.TEXT },
    solution: { type: DataTypes.TEXT },
    outcome: { type: DataTypes.TEXT },

    // Detail-page copy
    description: { type: DataTypes.TEXT },
    overview: { type: DataTypes.TEXT },
    about: { type: DataTypes.TEXT },

    videoUrl: { type: DataTypes.TEXT },
    githubUrl: { type: DataTypes.TEXT },
    demoUrl: { type: DataTypes.TEXT },

    // techCard drives the chips on the home card, techDetail the ones on the
    // detail page — today they differ per project, so they stay separate.
    techCard: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    techDetail: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    gallery: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    features: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    architecture: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    points: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: { highlights: [], learnings: [], challenges: [] },
    },
    projectInfo: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },

    sortOrder: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 0 },
    isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    isPublished: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { sequelize, modelName: "Project", tableName: "projects" }
);
