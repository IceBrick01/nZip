import type { Element } from '@lightbery/scope'

interface Page {
  (args: any): {
    title: string
    description: string
    keywords?: string
    content: Element | undefined  
  }
}

interface GalleryData {
  error?: string
  id: number
  media_id: string
  title: {
    english: string
    japanese: string
    pretty: string
  }
  images: {
    pages: Array<ImageData>
    cover: ImageData
    thumbnail: ImageData
  }
  scanlator: string
  upload_date: number
  tags: Array<TagData>
  num_pages: number
  num_favorites: number
}

interface ImageData {
  t: string
  w: number
  h: number
}

interface TagData {
  id: number
  type: string
  name: string
  url: string
  count: number
}

export type { Page, GalleryData }
