<script lang="ts">
  import { dailyLogBlocks, viewMode } from '../store/dailyLogStore'
  import { type ProjectItem } from '../utils/group'
  import { quarterlySumarizePrompt } from '../utils/prompts'

  function copy(blocks: ProjectItem[], mode: string) {
    let text = ''
    if (mode === 'quarterly') {
      text = quarterlySumarizePrompt + "\n"
      text += "## Quarterly Work Summary\n\n"
      blocks.forEach(b => {
        text += `### Project: ${b.project}\n`
        text += `- Module: ${b.module}\n`
        text += `- Total Effort: ${b.effort} hours\n`
        text += `- Key Contributions:\n`
        b.items.forEach((item: string) => {
          text += `  - ${item}\n`
        })
        text += `\n`
      })
    } else {
      text = blocks
        .map(
          b => `${b.priority || ''}: ${b.project}\n` + b.items.map((i: string, idx: number) => `${idx + 1}、${i}`).join('\n')
        )
        .join('\n\n')
    }

    navigator.clipboard.writeText(text)
  }
</script>

<div class="diary-wrap">
  <div class="mode-selector">
    <select bind:value={$viewMode}>
      <option value="single">Current File</option>
      <option value="monthly">Monthly View</option>
      <option value="quarterly">Quarterly View</option>
    </select>
  </div>

  {#if $dailyLogBlocks.size === 0}
    <p>无日志数据</p>
  {:else}
    {#each Array.from($dailyLogBlocks) as [period, items]}
      <div class="every-day">
        <div class="date">{period}</div>
        {#each items as block}
          <h3>{block.priority || ''} {block.project}</h3>
          <div class="meta">
            <span>Module: {block.module}</span> | <span>Effort: {block.effort}</span>
          </div>
          <ol>
            {#each block.items as item}
              <li>{item}</li>
            {/each}
          </ol>
        {/each}
        <div class="btn-wrap">
          <button on:click={() => copy(items, $viewMode)}>
            {$viewMode === 'quarterly' ? 'Copy for LLM' : '复制'}
          </button>
        </div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .diary-wrap {
    padding: 1em;
    height: 100%;
    overflow: auto;
  }
  .mode-selector {
    margin-bottom: 1em;
    display: flex;
    justify-content: flex-end;
  }
  .mode-selector select {
    padding: 4px;
    border-radius: 4px;
    background: var(--background-modifier-form-field);
    color: var(--text-normal);
  }
  .every-day {
    margin-bottom: 2em;
    padding-bottom: 1em;
    border-bottom: 1px solid var(--divider-color);
  }
  .date {
    color: var(--text-muted);
    font-family: var(--font-monospace);
    text-align: end;
    font-weight: bold;
    font-size: 1.1em;
  }
  .meta {
    font-size: 0.85em;
    color: var(--text-muted);
    margin-bottom: 0.5em;
  }
  .btn-wrap {
    display: flex;
    justify-content: center;
  }
  h3 {
    margin: 8px 0 4px 0;
  }

  ol {
    margin: 0 0 1.5em 0em;
    padding: 0 0 0 2em;
  }

  li {
    line-height: 1.6;
    margin-bottom: 4px;
  }

  button {
    margin-top: 1em;
    padding: 0.5em 1.5em;
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }

  button:hover {
    opacity: 0.9;
  }

  button:active {
    transform: translateY(1px);
  }
</style>
