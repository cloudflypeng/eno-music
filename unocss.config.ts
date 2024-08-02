import { defineConfig } from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
  ],
  transformers: [
    transformerDirectives(),
  ],
  shortcuts: {
    'btn': 'hover:bg-$eno-fill-2 px-6 py-1 h-10 rounded-10 cursor-pointer',
    'btn-primary': 'btn bg-$eno-fill-2 h-10',
  },
})
