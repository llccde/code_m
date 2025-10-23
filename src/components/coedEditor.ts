import { createPinia, defineStore } from "pinia";
import {  type Ref,ref,computed } from "vue";
import { type FileNode } from "@/m_data";
export type openedFile={
    name:String ;
    content:Array<string>;
    saved:boolean;
    path:string;

}
export const openedFilesStore=defineStore("openedFilesStore",()=>{
    const openedFiles:Ref<Array<Ref<openedFile>>> = ref([])
    const openFile:(file:FileNode,path:string)=>Ref<openedFile> = (file,path)=>{
        var ex = openedFiles.value.find(s=>s.value.path==path);
        if(ex){
            return ex;
        }
        var temp:openedFile={
            name:file.name,
            content:file.content.split("\n"),
            saved:true,
            path:path

        }
        var t = ref(temp)
        openedFiles.value.push(t)
        return t;
    }
    const closeFile:(path:string)=>void=(path)=>{
        var n = openedFiles.value.findIndex((f)=>{return f.value.path == path});
        if(n!=-1){
            openedFiles.value.splice(n);
        }
    }
})
