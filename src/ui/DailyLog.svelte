<script lang="ts">
  import { dailyLogBlocks } from "../store/dailyLogStore";

  function copy(blocks: any[]) {
    const text = blocks
      .map(
        (b) =>
          `${b.priority}: ${b.project}\n` +
          b.items.map((i:string, idx:number) => `${idx + 1}、${i}`).join("\n")
      )
      .join("\n\n");

    navigator.clipboard.writeText(text);
  }
</script>

<div class="diary-wrap">
  {#if $dailyLogBlocks.length === 0}
  <p>无日志数据</p>
  {:else}
    {#each $dailyLogBlocks as block}
      <h3>{block.priority}: {block.project}</h3>
      <ol>
        {#each block.items as item}
          <li>{item}</li>
        {/each}
      </ol>
    {/each}

    <button on:click={() => copy($dailyLogBlocks)}>复制</button>
  {/if}
</div>

<style>
  .diary-wrap {
    padding: 1em;
  }
  h3 {
    margin: 0;
  }

  ol {
    margin: 0 0 1.5em 0em;
  }

  button {
    margin-top: 2em;
    padding: 0.5em 1em;
    background-color: var(--button-bg);
    color: var(--button-fg);
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--button-hover-bg);
  }
</style>