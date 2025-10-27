<script setup lang="ts">
    import{computed, ref,type ComputedRef} from "vue"
    import { useFileStore ,FileOrFolder,type BaseNode, type FolderNode, type FileNode} from "@/m_data";
    import { inject } from "vue";
    import { openedFilesStore } from "./coedEditor";
    import { type fileViewApiType } from "./com-body-fileView.vue";

    const paddingSize = ref(20)
    const fileView:fileViewApiType|undefined = inject("fileViewSetting")
    const m_openedFilesStore = openedFilesStore()
    const m_fileStore=useFileStore()
    const props = defineProps({
        path:String,
        depth:Number
    })
    const depth = ref(props.depth?props.depth:0);
    if(!fileView)throw Error("no file view api");
    if(props.path == null){
        throw Error("path can not be null")
    }


    const me=computed(()=> m_fileStore.resolvePath(props.path as string).f)
    if(me.value == null){
        throw Error("no file found");
    }

    const isFolder=computed(()=>{
        return me.value?.type == FileOrFolder.Folder;
    })


    var temp=()=>{
        if(!(isFolder.value)) return ref(false);
        var temp;
        if(temp = fileView.closedTag.get(props.path as string)){
            return temp 
        }
        else{
            temp = ref(false)
            fileView.closedTag.set(props.path as string,temp)
            return temp;
        }
    } 
    const closeMe=computed(temp);
    const children:ComputedRef<Array<string>> = computed(()=>{
        if(me!=null){
            if(isFolder.value){
                var paths = (me.value as FolderNode).children.map((node)=>{
                    return props.path+node.name+"/";
                })
                return paths;
            }
            else{
                return [] as Array<string>
            }
        }
        else{
            throw Error("impossible! file item is null!")
        }
        
    })
    const clickItem=()=>{
        if(isFolder.value){
            closeMe.value.value = !closeMe.value.value; // 移除setTimeout，直接修改
        }
        else{
            m_openedFilesStore.openFile(me.value?.name as string,props.path as string);
            m_openedFilesStore.bufferContent(props.path as string,(me.value as FileNode).content)
            
            m_openedFilesStore.setCurrentPage(props.path as string)
            
        }
    }
</script>

<template>
    <div name="container">
        <div name="ffItem" class="item-self">
            <div class="item-name" :style="{'padding-left': depth*paddingSize+'px' }" @click="clickItem">
                <p v-if="isFolder">
                    {{ closeMe.value ? '▶' : '▼' }}
                </p>
                <p>
                    {{ me?.name }}
                </p>
                
            </div>
        </div>
        <div name="children" v-if="!closeMe.value" ref="childrenDiv"  class="items-in-item">
            <template v-for="childPath in children"> 
                <FFItem :path="childPath" :depth="depth+1">

                </FFItem>
            </template>
        </div>
    </div>
</template>

<style lang="css" scoped>
    
    .item-name{
        color: rgb(255, 255, 255);
        display: flex;
    }
    .item-name p{
        width: 20px;
    }
    .items-in-item{
        width: 100%;
        margin: auto;
        
    }
    .item-self{
        cursor: pointer;
    }
    .item-self:hover{
        background-color: rgba(255, 255, 255, 0.094);
    }
    .container{
        width: 100%;
        height: auto;
    }
</style>