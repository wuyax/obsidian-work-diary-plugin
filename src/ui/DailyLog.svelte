<script lang="ts">
  import { dailyLogBlocks } from '../store/dailyLogStore'
  import { type ProjectItem } from '../utils/group'

  function mergeBlocks(blocks: ProjectItem[]): ProjectItem[] {
    const merged = new Map<string, ProjectItem>();
    blocks.forEach(block => {
      const key = block.project;
      if (!merged.has(key)) {
        merged.set(key, { ...block });
      } else {
        const existing = merged.get(key)!;
        existing.items = existing.items.concat(block.items);
      }
    });
    return Array.from(merged.values());
  }

  function copy(blocks: any[]) {
    const text = blocks
      .map(
        b => `${b.priority}: ${b.project}\n` + b.items.map((i: string, idx: number) => `${idx + 1}、${i}`).join('\n')
      )
      .join('\n\n')

    navigator.clipboard.writeText(text)
  }
</script>

<div class="diary-wrap">
  {#if $dailyLogBlocks.size === 0}
    <p>无日志数据</p>
  {:else}
    {#each Array.from($dailyLogBlocks) as [date, items]}
      {@const mergedItems = mergeBlocks(items)}
      <div class="every-day">
        <div class="date">{date}</div>
        {#each mergedItems as block}
          <h3>{block.priority}: {block.project}</h3>
          <ol>
            {#each block.items as item}
              <li>{item}</li>
            {/each}
          </ol>
        {/each}
        <div class="btn-wrap">
          <button on:click={() => copy(mergedItems)}>复制</button>
        </div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .diary-wrap {
    padding: 1em;
  }
  .every-day {
    margin-bottom: 2em;
    padding-bottom: 1em;
    border-bottom: 1px solid var(--divider-color);
  }
  .date {
    color: gray;
    font-family: fantasy;
    text-align: end;
  }
  .btn-wrap {
    display: flex;
    justify-content: center;
  }
  h3 {
    margin: 4px 0;
  }

  ol {
    margin: 0 0 1.5em 0em;
    padding: 0 0 0 2em;
  }

  li {
    line-height: 1.7;
  }

  button {
    margin-top: 2em;
    padding: 0.5em 1em;
    background-color: var(--background-secondary);
    color: var(--button-fg);
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--background-primary);
  }

  button:active {
    background-color: var(--background-primary-alt);
  }
</style>
