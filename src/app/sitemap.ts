// ==========================================
// Sitemap — 自动生成站点地图，提升 SEO
// ==========================================

import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXTAUTH_URL || "https://aitools.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 静态路由
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tools/tool`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/tools/templates`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/apps`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/students`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/dev-tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // 动态博客路由
  const blogSlugs = ["er-diagram-guide", "uml-guide"];
  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 动态工具路由
  const appsSlugs = [
    "flowchart-generator",
    "er-diagram-generator",
    "uml-generator",
    "sequence-generator",
    "gantt-generator",
    "mindmap-generator",
    "json-formatter",
    "sql-generator",
  ];
  const appsRoutes: MetadataRoute.Sitemap = appsSlugs.map((slug) => ({
    url: `${BASE_URL}/apps/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticRoutes, ...blogRoutes, ...appsRoutes];
}
