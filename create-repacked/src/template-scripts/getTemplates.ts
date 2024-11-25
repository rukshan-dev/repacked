import { promises as fs } from "fs";
import * as path from "path";

export type TemplateInfo = {
  path: string;
  name: string;
  description: string;
  order: number;
};

const getTemplates = async (dir: string): Promise<TemplateInfo[]> => {
  const templateInfo: TemplateInfo[] = [];

  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stats = await fs.stat(fullPath);

      if (stats.isDirectory()) {
        const packageJsonPath = path.join(fullPath, "package.json");

        try {
          await fs.access(packageJsonPath);
          const data = await fs.readFile(packageJsonPath, "utf8");
          const packageJson: TemplateInfo = JSON.parse(data).templateInfo;
          templateInfo.push({ ...packageJson, path: fullPath });
        } catch (err) {
          // Ignore errors if package.json is not found
        }
      }
    }

    return templateInfo.sort((a, b) => a.order - b.order);
  } catch (err) {
    console.error("Error reading directory:", err);
    return [];
  }
};

export default getTemplates;
