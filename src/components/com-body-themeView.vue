<!-- themeView.vue -->
<script setup lang="ts">
    import { inject, ref, type Ref } from 'vue';
    
    // 从父组件注入主题相关功能
    const setTheme = inject<((name: string) => void)>("setTheme");
    const currentTheme = inject<Ref<string>>("currentTheme");
    
    // 主题选项
    const themeOptions = [
        { id: "dark", name: "暗黑主题", description: "经典的深色主题" },
        { id: "colorful", name: "彩色主题", description: "明亮的彩色主题" }
    ];
    
    // 选择主题
    const selectTheme = (themeId: string) => {
        if (setTheme) {
            setTheme(themeId);
        }
    };
</script>

<template>
    <div class="root-items">
        <div class="title">
            主题设置
        </div>
        <div class="theme-content">
            <div 
                v-for="theme in themeOptions" 
                :key="theme.id"
                :class="['theme-item', { 'active': currentTheme === theme.id }]"
                @click="selectTheme(theme.id)"
            >
                <div class="theme-preview" :class="theme.id"></div>
                <div class="theme-info">
                    <div class="theme-name">{{ theme.name }}</div>
                    <div class="theme-description">{{ theme.description }}</div>
                </div>
                <div class="theme-check" v-if="currentTheme === theme.id">✓</div>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
    .root-items {
        width: 100%;
        height: 100%;
        --tab-size: 20px;
        color: var(--text-color, rgb(127, 127, 127));
        background-color: var(--bg-color, rgb(42, 42, 42));
        padding: 0;
        margin: 0;
        font-family: Arial, sans-serif;
    }
    
    .title {
        width: 100%;
        font-size: medium;
        border-bottom: 3px solid var(--border-color, black);
        padding: 8px 0 8px 7px;
        box-sizing: border-box;
    }
    
    .theme-content {
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .theme-item {
        display: flex;
        align-items: center;
        padding: 12px;
        border: 1px solid var(--border-color, #555);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        background-color: rgba(255, 255, 255, 0.05);
    }
    
    .theme-item:hover {
        background-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
    }
    
    .theme-item.active {
        border-color: var(--accent-color, rgb(0, 102, 255));
        box-shadow: 0 0 0 1px var(--accent-color, rgb(0, 102, 255));
    }
    
    .theme-preview {
        width: 50px;
        height: 30px;
        border-radius: 4px;
        margin-right: 12px;
        border: 1px solid var(--border-color, #555);
    }
    
    .theme-preview.dark {
        background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
    }
    
    .theme-preview.colorful {
        background: linear-gradient(135deg, #1e1e2e 0%, #313244 100%);
    }
    
    .theme-info {
        flex: 1;
    }
    
    .theme-name {
        font-weight: bold;
        margin-bottom: 4px;
    }
    
    .theme-description {
        font-size: 0.85em;
        opacity: 0.8;
    }
    
    .theme-check {
        color: var(--accent-color, rgb(0, 102, 255));
        font-weight: bold;
    }
</style>