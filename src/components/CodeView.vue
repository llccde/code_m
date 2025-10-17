<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

// 文本内容
const textContent = ref('')

// 颜色表数据结构：按行存储，每行是一个颜色数组
const colorTable = ref<string[][]>([[]])

// 容器元素引用
const containerRef = ref<HTMLElement>()
const textareaRef = ref<HTMLTextAreaElement>()

// 生成随机颜色
const getRandomColor = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']
  return colors[Math.floor(Math.random() * colors.length)]
}

// 更新颜色表
const updateColorTable = () => {
  const lines = textContent.value.split('\n')
  const newColorTable: string[][] = []
  
  lines.forEach((line, lineIndex) => {
    const lineColors: string[] = []
    let currentColor = getRandomColor()
    let colorChangeCounter = 0
    const changeInterval = Math.floor(Math.random() * 3) + 2 // 每2-4个字符换颜色
    
    for (let i = 0; i < line.length; i++) {
      if (colorChangeCounter >= changeInterval) {
        currentColor = getRandomColor()
        colorChangeCounter = 0
      }
      lineColors.push(currentColor?currentColor:"rgb(100,150,75)")
      colorChangeCounter++
    }
    
    newColorTable.push(lineColors)
  })
  
  colorTable.value = newColorTable
}

// 监听文本变化，更新颜色表
watch(textContent, updateColorTable, { immediate: true })

// 渲染彩色文本
const renderColoredText = computed(() => {
  return textContent.value.split('\n').map((line, lineIndex) => {
    const colors = colorTable.value[lineIndex] || []
    return line.split('').map((char, charIndex) => {
      const color = colors[charIndex] || '#000000'
      return `<span style="color: ${color}">${char}</span>`
    }).join('')
  }).join('<br>')
})

// 同步滚动
const syncScroll = () => {
  if (containerRef.value && textareaRef.value) {
    containerRef.value.scrollTop = textareaRef.value.scrollTop
    containerRef.value.scrollLeft = textareaRef.value.scrollLeft
  }
}

// 导出编辑内容的方法
const exportContent = () => {
  return {
    text: textContent.value,
    colorTable: colorTable.value
  }
}

// 调整文本区域高度
const adjustTextareaHeight = () => {
  nextTick(() => {
    if (textareaRef.value && containerRef.value) {
      textareaRef.value.style.height = 'auto'
      const newHeight = Math.max(textareaRef.value.scrollHeight, containerRef.value.clientHeight)
      textareaRef.value.style.height = newHeight + 'px'
      containerRef.value.style.height = newHeight + 'px'
    }
  })
}

watch(textContent, adjustTextareaHeight, { immediate: true })
</script>

<template>
  <div class="editor-container">
    <div 
      ref="containerRef"
      class="color-display"
      v-html="renderColoredText"
    ></div>
    <textarea
      ref="textareaRef"     
      v-model="textContent"
      class="text-input"
      @scroll="syncScroll"
      @input="adjustTextareaHeight"
    ></textarea>     
  </div>
</template>

<style scoped>
.editor-container {
  position: relative;
  width: 100%;
  min-height: 200px;
  height: 100%;
  border: 1px solid #ccc;
  overflow: auto;
  font-family: monospace;
  line-height: 1.4;
}

.color-display {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 8px;
  white-space: pre;
  pointer-events: none;
  z-index: 1;
}

.text-input {
  position: relative;
  width: 100%;
  min-height: 200px;
  padding: 8px;
  border: none;
  outline: none;
  background: transparent;
  color: transparent;
  caret-color: black;
  resize: none;
  font-family: monospace;
  line-height: 1.4;
  white-space: pre;
  overflow: auto;
  z-index: 2;
}

/* 确保文本区域和显示层的字体和大小一致 */
.color-display,
.text-input {
  font-size: 14px;
  font-family: 'Courier New', monospace;
}
</style>