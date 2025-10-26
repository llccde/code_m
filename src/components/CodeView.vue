<script setup lang="ts">
    import { openedFilesStore,type openedFile } from './coedEditor';
    import { defineProps,ref,type Ref,computed} from 'vue';
    import { useFileStore,type FileNode } from '@/m_data';
    const opens = openedFilesStore();
    const files = useFileStore();
    const props = defineProps<{path:string}>();
    const file=computed(()=>{
        var t= opens.getFile(props.path)?.value;
		if(!t){
			throw Error("invalid path")
		} 
		return t as openedFile;
    })
	const content=computed(()=>file.value.content)
	const lines=computed(()=>file.value.content.split('\n'))
	const spanArray = [];
</script>
<template>
	<div class="code-page">
		<div>
			<template v-for="line,index in lines">
				<div class="code-line">
					<span  class="code-line-color code-text-style">{{line.length>0?line:" "}}</span>
				</div>
			</template>
		</div>
		
		<div style="position: absolute;top: 0;left: 0;width: 100%;height: 1000%;">
			<textarea  wrap="off"  v-model="file.content" class="code-input code-text-style">

			</textarea>
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

	.code-page{
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		align-items: start;
		overflow: scroll;
		font-family: monospace;
		background-color: rgb(31, 31, 31); /* 继承给子元素 */
	}
	.code-line{
		position: relative;
		display: flex;
		width: fit-content;
		align-items: start;
		height: 20px; /* 固定行高 */
	}
	.code-line-color{
		/* 应用统一的文本样式 */
		height: 20px;
	}
	.code-input{
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
		color: rgba(255, 187, 0, 0.902);
		caret-color: rgb(255, 255, 255);
	}
</style>