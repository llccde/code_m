<script setup lang="ts">
import { useFileStore } from '@/m_data';
import { computed, ref, onMounted, nextTick, watch } from 'vue';
import { openedFilesStore, type openedFile } from './coedEditor';

const openedFile = openedFilesStore();
const files = useFileStore();


const outputText = ref('');

const showError = ref(false);

const lines = computed(() => {
  return outputText.value.split('\n');
});

const scrollContainer = ref<HTMLElement>();

const scrollToBottom = async () => {
  await nextTick();
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  }
};

// 运行当前文件
const run = async () => {
  const currentPath = openedFile.currentPage;
  
  if (currentPath == null) {
    outputText.value = '错误: 没有打开的文件';
    showError.value = false;
    return;
  }
  
  const currentFile = openedFile.getFile(currentPath)?.value as openedFile;
  
  if (!currentFile.name.endsWith('.py')) {
    outputText.value = '只能运行 Python 文件 (.py)';
    showError.value = true;
    return;
  }
  
  showError.value = false;
  
  try {
    // 显示运行参数
    outputText.value = `> python ${currentFile.name}\n`;
    
    // 检查是否在 Electron 环境中
    if (window.electronAPI) {
      // 执行 Python 代码
      const result = await window.electronAPI.runPythonCode(currentFile.content);
      
      // 显示输出
      if (result.success) {
        outputText.value += result.stdout;
        if (result.stderr) {
          outputText.value += `\n[stderr]\n${result.stderr}`;
        }
      } else {
        outputText.value += `执行错误: ${result.error || result.stderr}`;
      }
    } else {
      outputText.value += '错误: 不在 Electron 环境中，无法执行 Python 代码';
    }
  } catch (error) {
    outputText.value += `执行异常: ${error}`;
  }
};

// 清空输出
const clearOutput = () => {
  outputText.value = '';
  showError.value = false;
};

onMounted(() => {
  scrollToBottom();
});

watch(outputText, () => {
  scrollToBottom();
});
</script>

<template>
    <div class="output-container">
        <div class="header">
            <div class="terminal-header">
                输出:
            </div>
            <div class="run-button" @click="run">
                运行◀
            </div>
            <div class="clear-button" @click="clearOutput">
                清空
            </div>
        </div>

        <div ref="scrollContainer" class="content-area">

            <div v-if="showError" class="error-message">
                {{ outputText }}
            </div>
            

            <div v-else>
                <div v-for="(line, index) in lines" :key="index" class="output-line">
                    {{ line }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.output-container {
    background-color: rgb(from var(--bg-color) calc(r*1.4) calc(g*1.2) calc(b*1.3));
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.header {
    display: flex;
    width: 100%;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.2);
    align-items: center;
    padding: 0 10px;
}

.terminal-header {
    font-size: medium;
    color: var(--text-color);
    padding: 3px 6px;
}

.run-button, .clear-button {
    border: 2px solid var(--border-color);
    border-radius: 10px;
    height: 40px;
    padding: 0 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-left: 10px;
    font-size: medium;
    color: var(--text-color);
}

.run-button:hover, .clear-button:hover {
    border-color: var(--accent-color);
}

.run-button {
    margin-left: auto;
}

.content-area {
    flex: 1;
    overflow-y: auto;
    padding: 8px 12px;
    white-space: pre-wrap; 
    word-break: break-all; 
    width: 100%;
    box-sizing: border-box;
}

.output-line {
    line-height: 1.4;
    margin-bottom: 2px;
    font-family: 'Courier New', monospace;
    color: var(--text-color);
}

.error-message {
    color: #ff6b6b;
    font-weight: bold;
    line-height: 1.4;
}

.content-area::-webkit-scrollbar {
    width: 8px;
}

.content-area::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
}

.content-area::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
}

.content-area::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.5);
}
</style>