import fs from 'fs'
import path from 'path'
import Parser from 'rss-parser'
import { RssFetchItem } from './types/rssReaderTypes'

const parser = new Parser()

/**
 * JSON ファイルから RSS URL を読み取る
 */
export function loadRssList(configPath: string) {
  const fullPath = path.resolve(configPath)
  const fileContent = fs.readFileSync(fullPath, 'utf-8')
  const jsonData = JSON.parse(fileContent)

  if (!jsonData.rss_list || typeof jsonData.rss_list !== 'object') {
    throw new Error('Invalid rss_list.json format')
  }

  return jsonData.rss_list
}

/**
 * RSS URL からフィードを取得
 */
export async function fetchRss(
  url: string,
  category: string
): Promise<RssFetchItem[] | null> {
  const rssFetchList: RssFetchItem[] = []
  try {
    const rssFeed = await parser.parseURL(url)
    rssFeed.items.forEach((item) => {
      console.log(`${item.title}, ${item.link}, ${item.pubDate}`)
      const rssFetchItem: RssFetchItem = {
        title: item.title || '',
        link: item.link || '',
        date: item.pubDate || new Date().toISOString(),
        category: category,
      }
      rssFetchList.push(rssFetchItem)
    })
    return rssFetchList
  } catch (error) {
    console.error(`Error fetching RSS from ${url}:`, error)
    return null
  }
}
