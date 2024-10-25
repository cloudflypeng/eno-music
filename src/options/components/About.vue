<script setup>
import Logo from '../../assets/512px.png'

const btn = 'w-1/4 inline-block flex items-center gap-1 text-[14px] rounded-2 px-4 py-3 bg-opacity-30 hover:bg-opacity-50'
</script>

<template>
  <section class="h-screen flex flex-col items-center overflow-auto">
    <!-- logo -->
    <img :src="Logo" alt="logo" class="h-[200px] object-contain">
    <div class="bg-$eno-fill-4 p-5 rounded-3 w-160">
      <!-- 联系方式 -->
      <div class="text-lg mb-1">
        联系方式
      </div>
      <div class="flex gap-3 justify-center mb-3">
        <a href="https://discord.gg/HPv2WDrvhq" :class="`${btn} color-purple-3 bg-purple-3`">
          <div class="i-mingcute:discord-line w-[20px] text-[20px]" />
          <span class="text-[14px]`">Discord</span>
        </a>
        <a href="https://github.com/cloudflypeng" :class="`${btn} color-gray-300 bg-gray-3`">
          <div class="i-mingcute:github-line w-1em h-1em" />
          <span class="text-[14px]">Github</span>
        </a>
        <a href="https://qm.qq.com/q/jeLnZehRyo" :class="`${btn} color-blue bg-blue`">
          <div class="i-mingcute:qq-line w-1em h-1em" />
          <span class="text-[14px]">群:762231762</span>
        </a>
        <a href="https://afdian.com/a/meanc" :class="`${btn} color-pink bg-pink`">
          <div class="i-mingcute:flash-line w-1em h-1em" />
          <span class="text-[14px]">爱发电</span>
        </a>
      </div>
      <div class="text-lg mb-1">
        其他说明
      </div>
      <!-- info -->
      <ul class="flex flex-col text-md pl-3 gap-1 inline-block">
        <li>本项目仅供学习交流使用，不得用于商业用途</li>
        <li>使用歌手功能, 需要当前浏览器登录过bilibili</li>
        <li>需要交流反馈可以添加qq群和discord, 长期在线</li>
        <li>统计用户达到30000 or 日活达到1000 or 爱发电赞助破千 开启手机版移植🫡🫡</li>
      </ul>
    </div>
  </section>
</template>
