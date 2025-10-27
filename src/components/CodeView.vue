<script setup lang="ts">
    import { openedFilesStore, type openedFile } from './coedEditor';
    import { defineProps, ref, type Ref, computed, onMounted, onUpdated, nextTick } from 'vue';
    import { useFileStore, type FileNode } from '@/m_data';
    import { highlighter } from './code_theme';
	const HL = highlighter();

    const opens = openedFilesStore();
    const files = useFileStore();
    const props = defineProps<{path: string}>();
    
    // 创建 DOM 引用
    const frontRef = ref<HTMLElement | null>(null);
    const inputRef = ref<HTMLElement | null>(null);
    const textareaRef = ref<HTMLTextAreaElement | null>(null);
    
    const file = computed(() => {
        var t = opens.getFile(props.path)?.value;
        if(!t) {
            throw Error("invalid path")
        } 
        return t as openedFile;
    })
    const content = computed(() => file.value.content)
	const color = computed(()=>{
		if(!HL.isInitialized){
			return null;
		}else{
			return HL.js?.codeToTokens(content.value,{
				lang: 'javascript',
  				theme: 'nord'})
		}
	})


    const lines = computed(() => file.value.content.split('\n'))
    const spanArray = [];
    
    // 更新输入框高度的函数
    const updateInputHeight_and_Width = () => {
        nextTick(() => {
            if (frontRef.value && inputRef.value && textareaRef.value) {

                const frontHeight = frontRef.value.offsetHeight;
                
                inputRef.value.style.height = `${frontHeight}px`;
                textareaRef.value.style.height = `${frontHeight}px`;


				const frontWidth = frontRef.value.offsetWidth;
                
                inputRef.value.style.width = `${frontWidth}px`;
                textareaRef.value.style.width = `${frontWidth}px`;
                
                console.log('更新高度:', frontHeight);
            }
        });
    };
    
    // 组件挂载后执行
    onMounted(() => {
        updateInputHeight_and_Width();
        
        // 监听窗口大小变化
        window.addEventListener('resize', updateInputHeight_and_Width);
    });
    
    // 监听内容变化，更新高度
    onUpdated(() => {
        updateInputHeight_and_Width();
    });
</script>

<template>

	<div class="code-page">
		<div id="front" ref="frontRef">
			<template v-for="line in color?.tokens" :key="index">
				<div class="code-line">
					<template v-for="token in line">
						<span class="code-line-color code-text-style" :style="{color:token.color}">{{ token.content}}</span>
					</template>
					
				</div>
			</template>
		</div>
		
		<div id="input" ref="inputRef" class="input-container">
			<textarea 
                ref="textareaRef"
                wrap="off" 
                v-model="file.content" 
                class="code-input code-text-style"
            ></textarea>
		</div>
	</div>
</template>

<style lang="css" scoped>
	.code-text-style {
		font-family: monospace;
		font-size: 16px;
		line-height: 20px;
		letter-spacing: 0px;
		white-space: pre;
	}

	.code-page {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		align-items: start;
		overflow: scroll;
		font-family: monospace;
		background-color: rgb(31, 31, 31);
	}
	
	.code-line {
		position: relative;
		display: flex;
		width: fit-content;
		align-items: start;
		height: 20px;
	}
	
	.code-line-color {

		height: 20px;
	}
	
	.input-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		/* 高度将通过 JavaScript 动态设置 */
	}
	
	.code-input {
		width: 100%;
		height: 100%;
		background-color: transparent;
		border: none;
		outline: none;
		resize: none;
		padding: 0;
		margin: 0;
		overflow: auto;
		vertical-align: top;
		color: rgba(255, 187, 0, 0);
		caret-color: rgb(255, 255, 255);
	}
</style>