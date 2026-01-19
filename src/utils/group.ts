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
  return Array.from(merged.values())
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
