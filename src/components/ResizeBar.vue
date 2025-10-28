<script setup lang="ts">
    import { defineProps, ref, type Ref, onUnmounted } from 'vue'
    
    const props = defineProps<{
        verticalDrag: boolean
    }>()
    
    const emit = defineEmits<{
        be_drag: [d: number]
    }>()
    
    const holdOn = ref(false);
    let lastMousePosition = { x: 0, y: 0 };
    
    const mousemoveHandler = (e: MouseEvent) => {
        if (!holdOn.value) return;
        
        const newMousePosition = { x: e.clientX, y: e.clientY };
        const delta = props.verticalDrag 
            ? newMousePosition.y - lastMousePosition.y
            : newMousePosition.x - lastMousePosition.x;
            
        emit('be_drag', delta);
        lastMousePosition = newMousePosition;
    }
    
    const mouseupHandler = () => {
        holdOn.value = false;
        document.removeEventListener("mousemove", mousemoveHandler);
        document.removeEventListener("mouseup", mouseupHandler);
    }
    
    const startRecord = (e: MouseEvent) => {
        holdOn.value = true;
        lastMousePosition = { x: e.clientX, y: e.clientY };
        
        document.addEventListener("mousemove", mousemoveHandler);
        document.addEventListener("mouseup", mouseupHandler);
        
        // 防止文本选中
        e.preventDefault();
    }
    
    // 组件卸载时清理事件监听器
    onUnmounted(() => {
        document.removeEventListener("mousemove", mousemoveHandler);
        document.removeEventListener("mouseup", mouseupHandler);
    });
</script>

<style scoped>
    .resize-bar {
        background-color: rgb(from var(--bg-color) calc(r*0.8) calc(g*0.8) calc(b*0.8));
        
        cursor: col-resize;
        user-select: none; 
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }
    
    .resize-bar.vertical {
        cursor: row-resize;
    }
    
    .hold {
        background-color: var(--accent-color);
    }

    .resize-bar:not(.vertical) {
        width: 6px;
        height: 100%;
        min-height: 100%;
    }
    
    .resize-bar.vertical {
        width: 100%;
        height: 6px;
        min-width: 100%;
    }

</style>

<template>
    <div 
        :class="[
            'resize-bar', 
            props.verticalDrag ? 'vertical' : '',
            holdOn ? 'hold' : '', 
        ]" 
        @mousedown="startRecord"
    >
    </div>
</template>