import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/lib/db";
import type { BlogCover } from "@/types/content";

export class BlogPost extends Model {
  declare id: string;
  declare slug: string;
  declare title: string;
  declare excerpt: string;
  declare content: string;
  declare category: string;
  declare tags: string[];
  declare cover: BlogCover | null;
  declare readTime: string | null;
  declare relatedSlugs: string[] | null;
  declare isFeatured: boolean;
  declare isPublished: boolean;
  declare publishedAt: Date;
  declare viewCount: number;
}

BlogPost.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    slug: { type: DataTypes.STRING(160), allowNull: false, unique: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    excerpt: { type: DataTypes.TEXT },
    // Raw MDX, exactly as it lived in src/content/blog/*.mdx.
    content: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.STRING(60) },
    tags: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    cover: { type: DataTypes.JSONB },
    // Null means "compute from word count on save".
    readTime: { type: DataTypes.STRING(20) },
    // Null means "fall back to recent posts in the same category".
    relatedSlugs: { type: DataTypes.JSONB },
    // Pins a post to the big hero card; falls back to newest when none is set.
    isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isPublished: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    publishedAt: { type: DataTypes.DATE, allowNull: false },
    viewCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    sequelize,
    modelName: "BlogPost",
    tableName: "blog_posts",
    indexes: [{ fields: ["published_at"] }, { fields: ["category"] }],
  }
);
