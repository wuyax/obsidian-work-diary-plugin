import { TFile, App } from "obsidian";
import { type ProjectItem } from './utils/group'

export async function parseDailyLog(app: App, file?: TFile | null): Promise<ProjectItem[]> {
  const targetFile = file || app.workspace.getActiveFile();
  if (!targetFile) return [];

  const content = await app.vault.read(targetFile);
  const lines = content.split("\n");

  const blocks: ProjectItem[] = [];
  let currentBlock: any = null;

  for (let line of lines) {
    line = line.trim();

    if (line.startsWith("## ")) {
      if (currentBlock) blocks.push(currentBlock as ProjectItem);

      currentBlock = {
        project: line.replace("## ", "").trim(),
        items: [],
        date: "",
        priority: "",
        module: "",
        effort: ""
      };
      continue;
    }

    if (!currentBlock) continue;

    if (line.startsWith("@")) {
      const colonIndex = line.indexOf(":");
      if (colonIndex !== -1) {
        const key = line.substring(1, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        if (key in currentBlock) {
          (currentBlock as any)[key] = value;
        }
      }
      continue;
    }

    if (line.startsWith("- ")) {
      currentBlock.items.push(line.replace("- ", "").trim());
    }
  }

  if (currentBlock) blocks.push(currentBlock as ProjectItem);

  return blocks;
}
