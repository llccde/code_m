<script setup lang="ts">
    import{computed, ref,type ComputedRef, nextTick, triggerRef} from "vue"
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

    
    const showFolderInput = ref(false)
    const showFileInput = ref(false)
    const showDeleteConfirm = ref(false)
    const newName = ref("")
    const folderInputRef = ref<HTMLInputElement | null>(null)
    const fileInputRef = ref<HTMLInputElement | null>(null)

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
            closeMe.value.value = !closeMe.value.value;
        }
        else{
            m_openedFilesStore.openFile(me.value?.name as string,props.path as string);
            m_openedFilesStore.bufferContent(props.path as string,(me.value as FileNode).content)
            m_openedFilesStore.setCurrentPage(props.path as string)
        }
    }

    // 创建文件夹功能
    const createFolder = () => {
        showFolderInput.value = true
        showFileInput.value = false
        showDeleteConfirm.value = false
        newName.value = ""
        nextTick(() => {
            if (folderInputRef.value) {
                folderInputRef.value.focus()
            }
        })
    }

    // 创建文件功能
    const createFile = () => {
        showFileInput.value = true
        showFolderInput.value = false
        showDeleteConfirm.value = false
        newName.value = ""
        nextTick(() => {
            if (fileInputRef.value) {
                fileInputRef.value.focus()
            }
        })
    }

    // 确认创建文件夹
    const confirmCreateFolder = () => {
        if (newName.value.trim() && isFolder.value) {
            try {
                m_fileStore.addFolder(me.value as FolderNode, newName.value.trim())
                showFolderInput.value = false
                newName.value = ""
                // 确保文件夹是展开状态
                closeMe.value.value = false
            } catch (error) {
                console.error("创建文件夹失败:", error)
                // 可以添加用户提示
            }
        }
    }

    // 确认创建文件
    const confirmCreateFile = () => {
        if (newName.value.trim() && isFolder.value) {
            try {
                m_fileStore.addFile(me.value as FolderNode, newName.value.trim())
                showFileInput.value = false
                newName.value = ""
                // 确保文件夹是展开状态
                closeMe.value.value = false
            } catch (error) {
                console.error("创建文件失败:", error)
                // 可以添加用户提示
            }
        }
    }

    // 取消创建
    const cancelCreate = () => {
        showFolderInput.value = false
        showFileInput.value = false
        newName.value = ""
    }

    // 删除功能
    const deleteItem = () => {
        showDeleteConfirm.value = true
        showFolderInput.value = false
        showFileInput.value = false
    }

    // 确认删除
    const confirmDelete = () => {
        if (me.value && me.value.parent) {
            try {
                // 从父节点的children中移除当前节点
                const parent = me.value.parent as FolderNode
                const index = parent.children.findIndex(child => child === me.value)
                if (index !== -1) {
                    parent.children.splice(index, 1)
                    // 触发响应式更新
                    m_fileStore.m_triggerRef();
                }
                showDeleteConfirm.value = false
            } catch (error) {
                console.error("删除失败:", error)
            }
        }
    }

    // 取消删除
    const cancelDelete = () => {
        showDeleteConfirm.value = false
    }

    // 处理输入框按键事件
    const handleInputKeydown = (event: KeyboardEvent, type: 'folder' | 'file') => {
        if (event.key === 'Enter') {
            if (type === 'folder') {
                confirmCreateFolder()
            } else {
                confirmCreateFile()
            }
        } else if (event.key === 'Escape') {
            cancelCreate()
        }
    }

    // 处理删除确认框按键事件
    const handleDeleteKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            confirmDelete()
        } else if (event.key === 'Escape') {
            cancelDelete()
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
                <p style="margin-right: auto;">
                    {{ me?.name }}
                </p>
                <div class="add">
                    <span 
                        v-if="isFolder" 
                        class="material-symbols-outlined" 
                        style="justify-self: end;"
                        @click.stop="createFolder"
                        title="新建文件夹"
                    >
                        create_new_folder
                    </span>
                    <span 
                        v-if="isFolder" 
                        class="material-symbols-outlined"
                        @click.stop="createFile"
                        title="新建文件"
                    >
                        note_add
                    </span>
                    <span 
                        v-if="!(me?.parent==null)" 
                        class="material-symbols-outlined"
                        @click.stop="deleteItem"
                        title="删除"
                    >
                        delete
                    </span>
                </div>
            </div>
        </div>
        
        
        <div v-if="showFolderInput" class="input-item" :style="{'padding-left': (depth+1)*paddingSize+'px' }">
            <span>📁</span>
            <input
                ref="folderInputRef"
                v-model="newName"
                type="text"
                placeholder="输入文件夹名称"
                @keydown="(e) => handleInputKeydown(e, 'folder')"
                @blur="cancelCreate"
                class="name-input"
            />
        </div>
        
        
        <div v-if="showFileInput" class="input-item" :style="{'padding-left': (depth+1)*paddingSize+'px' }">
            <span>📄</span>
            <input
                ref="fileInputRef"
                v-model="newName"
                type="text"
                placeholder="输入文件名称"
                @keydown="(e) => handleInputKeydown(e, 'file')"
                @blur="cancelCreate"
                class="name-input"
            />
        </div>
        
        
        <div v-if="showDeleteConfirm" class="delete-confirm" :style="{'padding-left': depth*paddingSize+'px' }">
            <div class="confirm-box">
                <p>确认删除 "{{ me?.name }}"？</p>
                <div class="confirm-buttons">
                    <button @click="confirmDelete" class="confirm-btn confirm-btn-delete">删除</button>
                    <button @click="cancelDelete" class="confirm-btn confirm-btn-cancel">取消</button>
                </div>
            </div>
        </div>
        
        <div name="children" v-if="!closeMe.value" ref="childrenDiv" class="items-in-item">
            <template v-for="childPath in children"> 
                <FFItem :path="childPath" :depth="depth+1">
                </FFItem>
            </template>
        </div>
    </div>
</template>

<style lang="css" scoped>
    .add{
        display: flex;
        justify-content: end;
        visibility: hidden;
    }
    .item-name{
        color: var(--text-color);
        display: flex;
        align-items: center;
    }
    .item-name p{
        margin: 0;
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
    .item-self:hover .add{
        visibility: visible;
    }
    .container{
        width: 100%;
        height: auto;
    }
    
    /* 输入框样式 */
    .input-item {
        display: flex;
        align-items: center;
        padding: 4px 0;
        color: var(--text-color);
    }
    
    .input-item span {
        margin-right: 8px;
        font-size: 14px;
    }
    
    .name-input {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 4px;
        color: var(--text-color);
        padding: 4px 8px;
        font-size: 14px;
        outline: none;
        width: 150px;
    }
    
    .name-input:focus {
        border-color: var(--accent-color);
    }
    
    /* 删除确认框样式 */
    .delete-confirm {
        padding: 8px 0;
    }
    
    .confirm-box {
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.3);
        border-radius: 6px;
        padding: 12px;
        max-width: 200px;
    }
    
    .confirm-box p {
        margin: 0 0 12px 0;
        color: var(--text-color);
        font-size: 14px;
    }
    
    .confirm-buttons {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
    }
    
    .confirm-btn {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: background-color 0.2s;
    }
    
    .confirm-btn-delete {
        background: #ff4444;
        color: white;
    }
    
    .confirm-btn-delete:hover {
        background: #cc0000;
    }
    
    .confirm-btn-cancel {
        background: rgba(255, 255, 255, 0.2);
        color: var(--text-color);
    }
    
    .confirm-btn-cancel:hover {
        background: rgba(255, 255, 255, 0.3);
    }
    
    /* 图标样式 */
    .material-symbols-outlined {
        font-size: 18px;
        cursor: pointer;
        padding: 2px;
        border-radius: 3px;
        transition: background-color 0.2s;
    }
    
    .material-symbols-outlined:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
</style>