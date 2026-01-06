import { ItemView, WorkspaceLeaf } from 'obsidian'
import { mount, unmount } from 'svelte'
import DailyLog from './ui/DailyLog.svelte'
import { parseDailyLog } from './parser'
import { dailyLogBlocks } from './store/dailyLogStore'
import { groupByDateMap, type ProjectItem } from './utils/group'

export const VIEW_TYPE_DAILY_LOG = 'daily-work-log-view'

export class DailyLogView extends ItemView {
  private appUI: any = null
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

    // 首次加载
    await this.refresh()
  }

  async refresh() {
    console.log('Refreshing Daily Log View...')
    const blocks = await parseDailyLog(this.app)
    console.log('🚀 ~ DailyLogView ~ refresh ~ blocks:', blocks)
    const data = groupByDateMap(blocks as ProjectItem[])
    dailyLogBlocks.set(data)
  }

  async onClose() {
    if (this.appUI) {
      unmount(this.appUI)
      this.appUI = null
    }
  }
}
