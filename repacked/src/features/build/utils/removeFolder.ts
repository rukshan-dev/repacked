import { promises as fs } from "fs";

const removeFolder = async (folder: string): Promise<void> => {
  try {
    await fs.rm(folder, { recursive: true, force: true });
    console.log(`Folder "${folder}" removed successfully.`);
  } catch (error) {
    console.error(`Error removing folder: ${(error as Error).message}`);
    throw error;
  }
};

export default removeFolder;
