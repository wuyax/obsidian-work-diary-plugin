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
        priority: "P4",
        items: [],
      };
      continue;
    }

    if (line && line.startsWith("@priority:")) {
      currentBlock.priority = line.split(":")[1]?.trim();
      continue;
    }

    if (line.startsWith("- ")) {
      currentBlock.items.push(line.replace("- ", "").trim());
    }
  }

  if (currentBlock) blocks.push(currentBlock);

  return blocks;
}
