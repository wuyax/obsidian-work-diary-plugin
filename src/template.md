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
@module: omni-ui
@effort: 6

- work diary goes here
---