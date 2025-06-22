import { loadRssList, fetchRss } from './rssFetcher'

async function main(): Promise<void> {
  console.log('RSS Fetcher Started')

  const configPath = './config/rss_list.json'
  const rssList = loadRssList(configPath)

  const categories = Object.keys(rssList)
  // console.log(`Found ${categories.length} categories.`)

  for (const category of categories) {
    // console.log(`\n== Fetching category: ${category} ==`)

    const urls = rssList[category]
    for (const url of urls) {
      console.log(`Fetching: ${url}`)
      const rssContent = await fetchRss(url, category)
      if (!rssContent) {
        console.error(`Failed to fetch RSS from ${url}`)
        continue
      }
      // console.log(`Fetched ${url}, length=${rssContent.length} characters\n`)
    }
  }

  console.log('RSS Fetcher Finished')
}

main().catch((error) => {
  console.error('Unexpected error in main():', error)
})
