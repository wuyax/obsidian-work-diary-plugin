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
    const date = item.date
    const existing = map.get(date) || []
    existing.push(item)
    map.set(date, existing)
  })

  return map
}
