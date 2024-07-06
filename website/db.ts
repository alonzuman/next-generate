import { promises as fs } from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), "db");

async function ensureDirExists(filePath: string) {
  const dir = path.dirname(filePath);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      console.error("Failed to create directory:", error);
      throw error;
    }
  }
}

async function readFile(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error(`Error reading file ${filePath}:`, error);
    }
    return null;
  }
}

async function read(key: string): Promise<string | string[] | null> {
  const fullPath = path.join(DB_DIR, key);
  try {
    const stats = await fs.stat(fullPath);
    if (stats.isDirectory()) {
      const files = await fs.readdir(fullPath);
      const jsonFiles = files.filter((file) => path.extname(file) === ".json");
      const contents = await Promise.all(
        jsonFiles.map((file) => readFile(path.join(fullPath, file)))
      );
      return contents.filter((content): content is string => content !== null);
    } else {
      return await readFile(fullPath + ".json");
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error(`Error reading ${key}:`, error);
    }
    return null;
  }
}

async function write(key: string, value: string): Promise<void> {
  const filePath = path.join(DB_DIR, `${key}.json`);
  try {
    await ensureDirExists(filePath);
    await fs.writeFile(filePath, value);
  } catch (error) {
    console.error(`Error writing file ${key}:`, error);
    throw error;
  }
}

export function createDB() {
  return {
    async read<T>(key: string): Promise<T | null> {
      const data = await read(key);
      if (data === null) return null;
      try {
        if (Array.isArray(data)) {
          return data.map((item) => JSON.parse(item)) as T;
        } else {
          return JSON.parse(data) as T;
        }
      } catch (error) {
        console.error(`Error parsing data for key ${key}:`, error);
        return null;
      }
    },
    async write<T>(key: string, value: T): Promise<T> {
      try {
        await write(key, JSON.stringify(value));
        return value;
      } catch (error) {
        console.error(`Error writing data for key ${key}:`, error);
        throw error;
      }
    },
  };
}

export const db = createDB();
