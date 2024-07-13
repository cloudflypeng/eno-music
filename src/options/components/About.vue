<script setup>
import Logo from '../../assets/512px.png'

const btn = 'inline-block flex items-center gap-1 text-lg rounded-4 px-4 py-2 bg-opacity-80 hover:bg-opacity-100 color-black'
</script>

<template>
  <section class="h-screen flex flex-col justify-center items-center overflow-auto">
    <!-- logo -->
    <img :src="Logo" alt="logo" class="h-[300px] object-contain">
    <!-- 联系方式 -->
    <div class="flex gap-3 justify-center mb-10">
      <a href="https://discord.gg/Byq4zv9x" :class="`${btn} bg-[#a0a7f8]`">
        <div class="i-mingcute:discord-line w-1em h-1em" />
        <span>Discord</span>
      </a>
      <a href="https://github.com/cloudflypeng" :class="`${btn} bg-white`">
        <div class="i-mingcute:github-line w-1em h-1em" />
        <span>Github</span>
      </a>
      <a href="https://qm.qq.com/q/jeLnZehRyo" :class="`${btn} bg-[#7ec6f7]`">
        <div class="i-mingcute:qq-line w-1em h-1em" />
        <span>群:762231762</span>
      </a>
    </div>
    <!-- info -->
    <span class="flex flex-col text-lg inline-block mb-25">
      <li>本项目仅供学习交流使用，不得用于商业用途</li>
      <li>使用歌手功能, 需要当前浏览器登录过bilibili</li>
      <li>需要交流反馈可以添加qq群和discord, 长期在线</li>
    </span>
  </section>
</template>
