import path from 'path'
import * as fs from 'fs'
import type _sharp from 'sharp'

export type CreateIconVariation = {
  prefix: string,
  rel: string,
  sizes: number[],
  type?: string | null
}

export const variations: CreateIconVariation[] = [
  {
    prefix: 'apple-icon',
    rel: 'apple-touch-icon',
    sizes: [57, 60, 72, 76, 114, 120, 144, 152, 180],
    type: null,
  },
  {
    prefix: 'icon',
    rel: 'icon',
    sizes: [16, 32, 96, 192],
    type: 'image/png',
  },
]

export interface CreateIconsOptions {
  file: string,
  dir: string,
  rootDir: string,
  publicDir: string,
}

export type CreateIconsFn = (options: CreateIconsOptions) => Promise<boolean>

export const createIcons: CreateIconsFn = async (options: CreateIconsOptions): Promise<boolean> => {
  const dir: string = path.join(options.rootDir, options.publicDir, options.dir)
  const source: string = path.join(options.rootDir, options.file)
  const sharp = (await import('sharp')) as unknown as typeof _sharp

  if (!fs.existsSync(source)) {
    return false
  }

  const destination = (size: number, prefix: string) => path.join(dir, `${ prefix }-${ size }x${ size }.png`)

  for (const variation of variations as CreateIconVariation[]) {
    for (const size of variation.sizes as number[]) {
      try {
        if (!fs.existsSync(path.join(options.rootDir, options.publicDir, options.dir))) {
          fs.mkdirSync(path.join(options.rootDir, options.publicDir, options.dir), { recursive: true })
        }
        await sharp(source).resize(size, size).toFile(destination(size, variation.prefix))
      } catch (err) {
        console.error(err)
        return false
      }
    }
  }

  return true
}
