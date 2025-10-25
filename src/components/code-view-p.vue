<script setup lang="ts">
    import { ref,type Ref,defineProps,computed,type ComputedRef } from 'vue'
    import { openedFilesStore, type openedFile } from './coedEditor';
    import { FileOrFolder, useFileStore,type FileNode} from '@/m_data';
    const openedFiles = openedFilesStore();
    const fileStore = useFileStore();
    const props = defineProps({
        path:String
    })
    const currentFile= computed(()=>{
        if(props.path){
            var file = fileStore.resolvePath(props.path);
            if(!file || !(file.f)){throw Error("file not found")}
            if(file.f.type!=FileOrFolder.File){throw Error("file type error")}

            var open = openedFiles.openFile((file as unknown as FileNode).name,props.path)
            if(!open) throw Error("impossible!")
            return open;
        }
    })as ComputedRef<Ref<openedFile>>
    

</script>
<template>

</template>
<style>
</style>