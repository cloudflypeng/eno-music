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
    'btn': 'bg-$eno-fill-2 hover:bg-$eno-fill-2 px-6 py-1 h-10 rounded-10 cursor-pointer',
    'btn-primary': 'btn bg-$eno-fill-2 h-10',
    'hov-item': 'hover:bg-$eno-fill-1 cursor-pointer p-2 pr-4 rounded-4 transition-all duration-300',
    'has-border': 'border border-$eno-border',
  },
})
