import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { createIcons, CreateIconsOptions } from './lib/create-icons'
import defu from 'defu'

export interface ModuleOptions extends Omit<CreateIconsOptions, 'rootDir'> {
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-favicon',
    configKey: 'favicon',
  },
  defaults: {
    file: 'assets/icon.png',
    publicDir: 'public',
    dir: 'favicons',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.hook('app:resolve', async (app) => {
      if (!await createIcons({
        ...options,
        rootDir: app.dir,
      })) {
        console.warn(`[nuxt-favicon] No icon found at ${ options.file } (relative to ${ app.dir }). Skipping favicon generation.`)
      }
    })

    nuxt.options.runtimeConfig.public.nuxtFavicons = defu(nuxt.options.runtimeConfig.public.nuxtFavicons, options)

    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
