import { TFile, App } from "obsidian";

export async function parseDailyLog(app: App): Promise<any[]> {
  const file = app.workspace.getActiveFile();
  if (!file) return [];

  const content = await app.vault.read(file);
  const lines = content.split("\n");

  const blocks: any[] = [];
  let currentBlock: any = null;

  for (let line of lines) {
    line = line.trim();

    if (line.startsWith("## ")) {
      if (currentBlock) blocks.push(currentBlock);

      currentBlock = {
        project: line.replace("## ", "").trim(),
        items: [],
      };
      continue;
    }

    if (line.startsWith("@")) {
      const colonIndex = line.indexOf(":");
      if (colonIndex !== -1) {
        const key = line.substring(1, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        currentBlock[key] = value;
      }
      continue;
    }

    if (line.startsWith("- ")) {
      currentBlock.items.push(line.replace("- ", "").trim());
    }
  }

  if (currentBlock) blocks.push(currentBlock);

  return blocks;
}
