// 定义数据类型
export interface ProjectItem {
  project: string
  items: string[]
  date: string
  priority: string
  module: string
  effort: string
}

// 定义分组后的数据类型
export type GroupedData = Map<string, ProjectItem[]>

export function groupByDateMap(items: ProjectItem[]): GroupedData {
  const map = new Map<string, ProjectItem[]>()

  items.forEach(item => {
    const date = item.date || 'Unknown Date'
    const existing = map.get(date) || []
    existing.push(item)
    map.set(date, existing)
  })

  return map
}

function mergeSameItemsWithDiffProgress(items: string[]): string[] {
  // 假设 items 格式为 ["Task A 50%", "Task A 100%", "Task B 30%"]
  // Task A 只保留进度最高的 "Task A 100%"
  const merged = new Map<string, { key: string; progress: number }>()

  items.forEach(item => {
    // 使用正则提取进度百分比,支持 % 前后有空格
    const progressMatch = item.match(/(\d+)\s*%/)
    const progress = progressMatch ? parseInt(progressMatch[1]!, 10) : 0

    // 移除进度部分,得到任务名称
    // 匹配并移除数字 + 可选空格 + %
    const key = item.replace(/\d+\s*%/g, '').trim()

    if (!merged.has(key)) {
      merged.set(key, { key, progress })
    } else {
      const existing = merged.get(key)!
      if (progress > existing.progress) {
        merged.set(key, { key, progress })
      }
    }
  })

  let data = Array.from(merged.values()).map(({ key, progress }) => `${key} ${progress}%`)
  return data
}

export function aggregateByProject(items: ProjectItem[]): ProjectItem[] {
  const merged = new Map<string, ProjectItem>()
  items.forEach(item => {
    const key = `${item.project}-${item.module}`
    if (!merged.has(key)) {
      merged.set(key, { ...item, items: [...item.items] })
    } else {
      const existing = merged.get(key)!
      existing.items = [...new Set([...existing.items, ...item.items])]
      const currentEffort = parseFloat(existing.effort) || 0
      const newEffort = parseFloat(item.effort) || 0
      existing.effort = (currentEffort + newEffort).toString()
    }
  })
  const sorted = Array.from(merged.values()).sort((a, b) => {
    if (a.project !== b.project) {
      return a.project.localeCompare(b.project)
    }
    const priorityOrder: Record<string, number> = { P0: 0, P1: 1, P2: 2, P3: 3, P4: 4 }
    const pA = priorityOrder[a.priority] ?? 99
    const pB = priorityOrder[b.priority] ?? 99
    return pA - pB
  })
  // 合并相同任务但不同进度的条目
  sorted.forEach(item => {
    item.items = mergeSameItemsWithDiffProgress(item.items)
  })
  return sorted
}

export function groupByMonthMap(items: ProjectItem[]): GroupedData {
  const map = new Map<string, ProjectItem[]>()
  items.forEach(item => {
    const month = item.date.substring(0, 7)
    const existing = map.get(month) || []
    existing.push(item)
    map.set(month, existing)
  })

  const aggregatedMap = new Map<string, ProjectItem[]>()
  map.forEach((monthItems, month) => {
    aggregatedMap.set(month, aggregateByProject(monthItems))
  })
  return aggregatedMap
}

export function groupByQuarterMap(items: ProjectItem[]): GroupedData {
  const map = new Map<string, ProjectItem[]>()
  items.forEach(item => {
    const date = new Date(item.date)
    const quarter = !isNaN(date.getTime())
      ? `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`
      : 'Unknown Quarter'
    const existing = map.get(quarter) || []
    existing.push(item)
    map.set(quarter, existing)
  })

  const aggregatedMap = new Map<string, ProjectItem[]>()
  map.forEach((quarterItems, quarter) => {
    aggregatedMap.set(quarter, aggregateByProject(quarterItems))
  })
  return aggregatedMap
}
