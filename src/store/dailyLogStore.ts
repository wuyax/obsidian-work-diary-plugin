import { writable } from 'svelte/store'
import { type GroupedData } from '../utils/group'

export const dailyLogBlocks = writable<GroupedData>(new Map())
export const viewMode = writable<string>('single')
