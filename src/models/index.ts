import { sequelize } from "@/lib/db";

import { SiteSetting } from "./SiteSetting";
import { PageSection } from "./PageSection";
import { SkillCategory } from "./SkillCategory";
import { Project } from "./Project";
import { Experience } from "./Experience";
import { BlogPost } from "./BlogPost";
import { Media } from "./Media";
import { ContactMessage } from "./ContactMessage";
import { AdminUser } from "./AdminUser";
import { AdminSession } from "./AdminSession";
import { AuditLog } from "./AuditLog";

/* ---------- associations ---------- */
// Only the three hard relations survive the JSONB collapse. Everything else is
// either self-contained or a soft reference held inside a JSONB payload.

AdminUser.hasMany(AdminSession, { foreignKey: "userId", as: "sessions", onDelete: "CASCADE" });
AdminSession.belongsTo(AdminUser, { foreignKey: "userId", as: "user" });

AdminUser.hasMany(AuditLog, { foreignKey: "userId", as: "auditLogs", onDelete: "SET NULL" });
AuditLog.belongsTo(AdminUser, { foreignKey: "userId", as: "user" });

AdminUser.hasMany(Media, { foreignKey: "uploadedBy", as: "uploads", onDelete: "SET NULL" });
Media.belongsTo(AdminUser, { foreignKey: "uploadedBy", as: "uploader" });

export {
  sequelize,
  SiteSetting,
  PageSection,
  SkillCategory,
  Project,
  Experience,
  BlogPost,
  Media,
  ContactMessage,
  AdminUser,
  AdminSession,
  AuditLog,
};
