<script setup lang="ts">
    import { defineEmits } from 'vue'

    // 定义 emits
    const emit = defineEmits<{
        (e: "choiceToolView", id: number): void
    }>()
    
    // 点击事件处理函数
    const choice = (id: number) => {
        emit("choiceToolView", id)
    }
</script>

<style lang="css" scoped>
    .com-root {
        background-color: rgb(from var(--bg-color) calc(r*0.8) calc(g*0.8) calc(b*0.8));
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 10px;
    }
    
    .tool-list {
        display: flex;
        flex-direction: column;
        justify-content: start;
        width: 100%;
    }
    
    .tool-icon {
        width: 60px;
        height: 60px;
        padding: 5px;
        margin-top: 5px;
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        color: rgb(from var(--text-color) calc(r*0.8) calc(g*0.8) calc(b*0.8));
        cursor: pointer;
        transition: all 0.2s ease;
        border-radius: 8px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .tool-icon:hover {
        background-color: rgba(255, 255, 255, 0.1);
        transform: scale(1.1);
    }
    
    .tool-icon.active {
        background-color: rgba(0, 102, 255, 0.3);
        color: rgb(0, 102, 255);
    }
</style>

<template>
    <div class="com-root">

        <div class="tool-list">
            <span 
                class="material-symbols-outlined tool-icon" 
                @click="choice(0)"
                title="文件浏览器"
            >
                folder
            </span>
            <span  
                class="material-symbols-outlined tool-icon" 
                @click="choice(1)"
                title="主题设置"
            >
                opacity
            </span>
        </div>
    </div>
</template>