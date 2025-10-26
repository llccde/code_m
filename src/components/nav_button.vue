<script setup lang="ts">
    import { computed, defineProps,ref,type Ref, } from 'vue';
    import { openedFilesStore,type openedFile } from './coedEditor';
    import { useFileStore } from '@/m_data';
    const props = defineProps<{
        file:openedFile
    }>()

    const opened = openedFilesStore();
    const files = useFileStore();
    const emit = defineEmits<{
        (e:"closeClick",saved:boolean):void
    }>()

    const closeClick = ()=>{
        opened.closeFile(props.file.path)
    }
    const choiceMe = ()=>{
        opened.setCurrentPage(props.file.path)
    }
    
</script>
<template>
    <div :class="['button-root',opened.currentPage == props.file.path?'be-choice':'']" @click="choiceMe">
        <div class="file-name">
            {{props.file.name}}
        </div>
        <div class="close-button" style="font-weight: lighter; " @click.stop="closeClick">
            ⨉
        </div>
    </div>
    
</template>
<style scoped>
    
    .button-root{
        display: flex;
        width: auto;
        min-width: 100px;
        height: 100%;
        align-items: center;
        justify-content: center;
        border: solid 1px rgb(154, 154, 154);
        color: rgb(228, 228, 228);
    }
    .button-root .close-button{
        visibility: hidden;
    }
    .button-root:hover{
        background-color: rgba(240, 248, 255, 0.053);
    }
    .be-choice{
        background-color: rgba(240, 248, 255, 0.053);
        border-top: 2px solid rgb(0, 102, 255);
    }
    .button-root:hover .close-button{
        visibility: visible;
    }
    .file-name{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .close-button{
        border: none;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        height: 18px;
        width: 18px;
        font-size: 15px;
        border-radius: 5px;
        margin-left: 5px;
        margin-right: 5px;
        padding-bottom: 1px;
        
        
    }
    .close-button:hover{
        background-color: rgba(255, 255, 255, 0.295);
    }
</style>