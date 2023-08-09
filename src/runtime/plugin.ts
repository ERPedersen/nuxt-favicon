import { defineNuxtPlugin } from '#app'
import { variations } from '../lib/create-icons'
import { ModuleOptions } from '../module'

type PluginOptions = ModuleOptions

export default defineNuxtPlugin((nuxtApp) => {

  const link: any[] = []


  const options: PluginOptions = useRuntimeConfig().public.nuxtFavicons as PluginOptions

  for (const variation of variations) {
    for (const size of variation.sizes) {
      link.push({
        rel: variation.rel,
        sizes: `${ size }x${ size }`,
        href: `/${ options.dir }/${ variation.prefix }-${ size }x${ size }.png`,
        type: variation.type,
      })
    }
  }

  nuxtApp.hook('app:created', () => {
    useHead({
      link: link,
    })
  })
})
