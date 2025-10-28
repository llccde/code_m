<script setup lang="ts">
    import { openedFilesStore, type openedFile } from './coedEditor';
    import { defineProps, ref, type Ref, computed, onMounted, onUpdated, nextTick } from 'vue';
    import { useFileStore, type FileNode } from '@/m_data';
    import { highlighter } from './code_theme';
	import type { BundledLanguage } from 'shiki';
    const HL = highlighter();

    const opens = openedFilesStore();
    const files = useFileStore();
    const props = defineProps<{path: string}>();
    

    const frontRef = ref<HTMLElement | null>(null);
    const inputRef = ref<HTMLElement | null>(null);
	const page = ref<HTMLElement | null>(null);
    const textareaRef = ref<HTMLTextAreaElement | null>(null);
    

    const contextMenuVisible = ref(false);
    const contextMenuX = ref(0);
    const contextMenuY = ref(0);
    
    const file = computed(() => {
        var t = opens.getFile(props.path)?.value;
        if(!t) {
            throw Error("invalid path")
        } 
        return t as openedFile;
    })
    const content = computed(() => file.value.content)
    const type = computed(()=>{
        var temp = props.path.substring(props.path.lastIndexOf('.') + 1);
        if(!temp){
            return "txt"
        }
        if(temp[temp.length-1] == '/'){
            return temp.slice(0, -1);
        }
        else return temp;
        
    })

	const color = computed(() => {
		if (!HL.isInitialized) {
			return null;
		} else {
			try {
				const result = HL.light?.codeToTokens(content.value, {
					lang: type.value as BundledLanguage,
					theme: 'dark-plus'
				});
				if (!result) {
					throw new Error('Highlighter returned null or undefined');
				}
				
				return result;
			} catch (error) {
				console.warn('代码高亮失败，使用白色文本渲染:', error);
				return {
					tokens: content.value.split('\n').map(line => [
						{
							content: line,
							color: '#FFFFFF' 
						}
					])
				};
			}
		}
	});

    const lines = computed(() => file.value.content.split('\n'))
    const spanArray = [];
    

	const updateInputHeight_and_Width = () => {
		nextTick(() => {
			// 确保所有需要的元素都已存在
			if (frontRef.value && inputRef.value && textareaRef.value && page.value) {
				const frontHeight = frontRef.value.offsetHeight;
				const frontWidth = frontRef.value.offsetWidth;
				const pageHeight = page.value.offsetHeight;
				const pageWidth = page.value.offsetWidth;

				// 仅当front高度超过page时才修改高度
				if (frontHeight > pageHeight) {
					const adjustedHeight = Math.max(frontHeight, 100); // 保持最小100px的限制
					inputRef.value.style.height = `${adjustedHeight}px`;
					textareaRef.value.style.height = `${adjustedHeight}px`;
					console.log('更新高度:', adjustedHeight);
				}

				// 仅当front宽度超过page时才修改宽度
				if (frontWidth > pageWidth) {
					const adjustedWidth = Math.max(frontWidth, 100); // 保持最小100px的限制
					inputRef.value.style.width = `${adjustedWidth}px`;
					textareaRef.value.style.width = `${adjustedWidth}px`;
					console.log('更新宽度:', adjustedWidth);
				}
			}
		});
	};

    const showContextMenu = (event: MouseEvent) => {
        event.preventDefault();
        contextMenuX.value = event.clientX;
        contextMenuY.value = event.clientY;
        contextMenuVisible.value = true;
    };
    
    const hideContextMenu = () => {
        contextMenuVisible.value = false;
    };
    
  
    const copyText = () => {
        if (textareaRef.value) {
            const textarea = textareaRef.value;
            const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
            if (selectedText) {
                navigator.clipboard.writeText(selectedText).then(() => {
                    console.log('文本已复制到剪贴板');
                }).catch(err => {
                    console.error('复制失败:', err);
                });
            }
        }
        hideContextMenu();
    };
    
    
    const pasteText = async () => {
        if (textareaRef.value) {
            try {
                const text = await navigator.clipboard.readText();
                const textarea = textareaRef.value;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                
                
                const newValue = textarea.value.substring(0, start) + text + textarea.value.substring(end);
                file.value.content = newValue;
                
                
                nextTick(() => {
                    textarea.selectionStart = start + text.length;
                    textarea.selectionEnd = start + text.length;
                    textarea.focus();
                });
            } catch (err) {
                console.error('粘贴失败:', err);
            }
        }
        hideContextMenu();
    };
    
    const undoText = () => {
        if (textareaRef.value) {

            document.execCommand('undo');
        }
        hideContextMenu();
    };
	const save=()=>{
		
			var i = files.resolvePath(props.path);
			if(! i ){
				throw Error();
			}

			(i as unknown as FileNode).content = file.value.content;
			hideContextMenu();
		
	}
    onMounted(() => {
        updateInputHeight_and_Width();
        
        
        document.addEventListener('click', hideContextMenu);
        window.addEventListener('resize', updateInputHeight_and_Width);
    });
    
    onUpdated(() => {
        updateInputHeight_and_Width();
    });
</script>

<template>
    <div class="code-page" ref="page">
        <div id="front" ref="frontRef">
            <template v-for="line,index in color?.tokens" :key="index">
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
                @contextmenu="showContextMenu"
				placeholder="请输入文字..."
            ></textarea>
        </div>
        
        <!-- 右键菜单 -->
        <div 
            v-if="contextMenuVisible" 
            class="context-menu"
            :style="{ left: contextMenuX + 'px', top: contextMenuY + 'px' }"
            @click.stop
        >
            <div class="context-menu-item" @click="copyText">复制</div>
            <div class="context-menu-item" @click="pasteText">粘贴</div>
            <div class="context-menu-item" @click="undoText">撤销</div>
			<div class="context-menu-item" @click="save">保存</div>
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
        background-color:  rgb(from var(--bg-color) calc(r*1.3) calc(g*1.3) calc(b*1.3))
    }
    ::-webkit-scrollbar {
    width: 12px;
    height: 8px;
    
    }

    ::-webkit-scrollbar-track {
    background: transparent; 
    }

    ::-webkit-scrollbar-thumb {
    background:  rgba(244, 244, 244, 0.265);
    border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
    background: var(--accent-color);
    }


    ::-webkit-scrollbar-button {
    display: none;
    }


    ::-webkit-scrollbar-corner {
    background: transparent;
    }
    .code-line {

        position: relative;
        display: flex;
        width: fit-content;
        min-width: 100%;
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
		height: 100%;
		min-height: 100px;
       
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
    
    
    .context-menu {
        position: fixed;
        background: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        min-width: 120px;
        padding: 4px 0;
    }
    
    .context-menu-item {
        padding: 8px 16px;
        color: #e0e0e0;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
    }
    
    .context-menu-item:hover {
        background-color: #3d3d3d;
    }
    
    .context-menu-item:not(:last-child) {
        border-bottom: 1px solid #444;
    }
</style>