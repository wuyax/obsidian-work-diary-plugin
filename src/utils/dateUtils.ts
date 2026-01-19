import { type ProjectItem } from './group'

export function parseWeekFilename(filename: string): { year: number; week: number } | null {
  const match = filename.match(/^(\d{4})-W(\d{2})$/)
  if (!match || !match[1] || !match[2]) return null
  return {
    year: parseInt(match[1]),
    week: parseInt(match[2])
  }
}

export function getStartDateOfWeek(year: number, week: number): Date {
  const simple = new Date(year, 0, 1 + (week - 1) * 7)
  const dow = simple.getDay()
  const ISOweekStart = simple
  if (dow <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
  }
  return ISOweekStart
}

export function formatMonth(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function formatQuarter(date: Date): string {
  const year = date.getFullYear()
  const quarter = Math.floor(date.getMonth() / 3) + 1
  return `${year}-Q${quarter}`
}

export function getMonthsForWeek(year: number, week: number): string[] {
  const start = getStartDateOfWeek(year, week)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  
  const startMonth = formatMonth(start)
  const endMonth = formatMonth(end)
  
  if (startMonth === endMonth) return [startMonth]
  return [startMonth, endMonth]
}

export function getQuarterForWeek(year: number, week: number): string {
  const start = getStartDateOfWeek(year, week)
  const thursday = new Date(start)
  thursday.setDate(start.getDate() + 3)
  return formatQuarter(thursday)
}

export function isItemInMonth(item: ProjectItem, month: string): boolean {
  return item.date.startsWith(month)
}

export function isItemInQuarter(item: ProjectItem, quarter: string): boolean {
  if (!item.date) return false
  const date = new Date(item.date)
  if (isNaN(date.getTime())) return false
  return formatQuarter(date) === quarter
}
