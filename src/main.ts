import { Plugin } from 'obsidian'
import { DailyLogView, VIEW_TYPE_DAILY_LOG } from './view'

export default class DailyWorkLogPlugin extends Plugin {
  async onload() {
    this.registerView(VIEW_TYPE_DAILY_LOG, leaf => new DailyLogView(leaf))

    this.addRibbonIcon('clipboard-list', 'Show Daily Work Log', () => {
      this.activateView()
    })

    // ⭐ 关键：监听 active file 变化
    this.registerEvent(
      this.app.workspace.on('active-leaf-change', () => {
        const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_DAILY_LOG)

        if (leaves.length === 0) return

        const view = leaves[0]?.view as DailyLogView
        view.refresh()
      })
    )
  }
  async refreshView() {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_DAILY_LOG)
    if (leaves.length === 0) return

    const view = leaves[0]?.view as any
    if (view?.refresh) {
      await view.refresh()
    }
  }

  async activateView() {
    const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE_DAILY_LOG)[0] ?? this.app.workspace.getRightLeaf(false)

    await leaf?.setViewState({
      type: VIEW_TYPE_DAILY_LOG,
      active: true
    })

    this.app.workspace.revealLeaf(leaf!)
    // ⭐ 手动首次刷新（只一次）
    const view = leaf?.view as any
    if (view?.refresh) {
      await view.refresh()
    }
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_DAILY_LOG)
  }
}
