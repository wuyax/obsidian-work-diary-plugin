# Obsidian Work Diary Plugin

A specialized work logging and aggregation tool for Obsidian, designed to help you track projects, calculate effort, and generate professional summaries using AI.

## Key Features

- **Multi-dimensional Logging**: Track work by project, module, priority, and effort.
- **Weekly View**: Quick overview of your current week's progress.
- **Monthly View**: Automatically aggregates all weekly logs into a monthly summary, merging identical projects/modules and summing up effort units.
- **Quarterly View (AI Optimized)**: Synthesizes quarterly data and provides a specialized prompt for LLMs to generate professional performance reviews.
- **One-click Export**: Copy formatted work logs or AI-ready prompts to your clipboard.

## Setup Instructions

### 1. Install Template
The plugin relies on a specific metadata format. It is recommended to use the **Templater** plugin to create your weekly log files.

Create a new template file (e.g., `work-diary-template.md`) with the following content:

```markdown
<%*
const weekId = tp.date.now("GGGG-[W]WW");
const date = tp.date.now("YYYY-MM-DD")
await tp.file.rename(weekId);
_%>---
type: daily-work-log
week: <% weekId %>
---

## Project Name
@date: <% date %>
@priority: P0
@module: UI-Design
@effort: 4

- Finished the main dashboard layout
- Refactored navigation component
---
```

### 2. Create Log Files
- Files must be named in the format `YYYY-W##` (e.g., `2026-W01.md`).
- Use the template above to ensure the parser can read your data.

## How to Use

1. **Activate View**: Click the **Notebook** icon in the ribbon (left sidebar) or use the command palette to open "Daily Work Log".
2. **Logging**: Write your work entries in the active weekly file using the `## Project` and `@key: value` format.
3. **Switching Modes**: Use the dropdown in the plugin sidebar to switch between:
   - **Current File**: View logs from the currently active file.
   - **Monthly View**: Aggregated summary for the current month.
   - **Quarterly View**: High-level summary for the current quarter.
4. **Exporting**:
   - In **Weekly/Monthly** mode: Click **Copy** to get a formatted list of work.
   - In **Quarterly** mode: Click **Copy for LLM** to get a complete prompt + data package, then paste it into ChatGPT/Claude to generate your quarterly report.

## Data Format Reference

The parser looks for the following markers:
- `## Project Name`: Defines a project block.
- `@date: YYYY-MM-DD`: Used for monthly/quarterly grouping.
- `@priority: P0-P4`: Importance level.
- `@module: name`: Component or sub-system name.
- `@effort: number`: Numeric value representing time or complexity.
- `- item`: Individual work record.
- `---`: Separator between blocks.
