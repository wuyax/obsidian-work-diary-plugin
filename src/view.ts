import { ItemView, WorkspaceLeaf, TFile } from 'obsidian'
import { mount, unmount } from 'svelte'
import DailyLog from './ui/DailyLog.svelte'
import { parseDailyLog } from './parser'
import { dailyLogBlocks, viewMode } from './store/dailyLogStore'
import { groupByDateMap, groupByMonthMap, groupByQuarterMap, type ProjectItem } from './utils/group'
import { get } from 'svelte/store'

export const VIEW_TYPE_DAILY_LOG = 'daily-work-log-view'

export class DailyLogView extends ItemView {
  private appUI: any = null
  private unsubscribe: (() => void) | null = null

  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
  }

  getViewType(): string {
    return VIEW_TYPE_DAILY_LOG
  }

  getDisplayText(): string {
    return 'Daily Work Log'
  }
  async onOpen() {
    this.containerEl.empty()

    this.appUI = mount(DailyLog, {
      target: this.containerEl
    })

    this.unsubscribe = viewMode.subscribe(() => {
      this.refresh()
    })

    // 首次加载
    await this.refresh()
  }

  async refresh() {
    console.log('Refreshing Daily Log View...')
    const mode = get(viewMode)
    let items: ProjectItem[] = []

    if (mode === 'single') {
      items = await parseDailyLog(this.app)
    } else {
      const files = this.app.vault.getMarkdownFiles().filter(f => /^\d{4}-W\d{2}$/.test(f.basename))
      for (const file of files) {
        const fileItems = await parseDailyLog(this.app, file)
        items.push(...fileItems)
      }
    }

    let data
    if (mode === 'monthly') {
      data = groupByMonthMap(items)
    } else if (mode === 'quarterly') {
      data = groupByQuarterMap(items)
    } else {
      data = groupByDateMap(items)
    }
    
    dailyLogBlocks.set(data)
  }

  async onClose() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
    if (this.appUI) {
      unmount(this.appUI)
      this.appUI = null
    }
  }
}
