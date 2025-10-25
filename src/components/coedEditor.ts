import { createPinia, defineStore } from "pinia";
import {  type Ref,ref,computed, popScopeId } from "vue";
import { type FileNode } from "@/m_data";
export type openedFile={
    name:String ;
    saved:boolean;
    path:string;
    content:Ref<string>[];
    
}
export const openedFilesStore=defineStore("openedFilesStore",()=>{
    const openedFiles:Ref<Array<Ref<openedFile>>> = ref([])
    const openedPaths=computed(()=>{
        return openedFiles.value.map((f)=>{
            return f.value.path;
        })
    }) 
    const currentPage:Ref<string|null> = ref(null)
    const setCurrentPage = (data:string|null)=>{
        if(data!=null&&openedFiles.value.findIndex(p=>p.value.path==data) == -1){
            throw Error("file was not open")
        }
        currentPage.value = data;
    }



    const bufferContent = (path:string,content:string)=>{
        var file = getFile(path);
        if(!file){
            throw Error("file not open");
        }
        var data = content.split("\n").map(data=>ref(data));
        file.value.content = data;
        
    }
    const openFile:(name:string,path:string)=>Ref<openedFile> = (name = "",path)=>{
        var ex = openedFiles.value.find(s=>s.value.path==path);
        if(ex){
            return ex;
        }
        var n:string = "unName";
        if(path){
            if(path.includes("/")){
                n = path.split('/').pop() as string;
            }else{
                n = path.split('\\').pop() as string
            }
        }
        var temp:openedFile={
            name:name!=""?name:n,
            saved:true,
            path:path,
            content:[]

        }
        var t = ref(temp)
        openedFiles.value.push(t)
        return t;
    }
    const getFile=(path:string)=>{
        var ex = openedFiles.value.find(s=>s.value.path==path);
        if(ex){
            return ex;
        }
    }
    const closeFile:(path:string)=>void=(path)=>{
        var n = openedFiles.value.findIndex((f)=>{return f.value.path == path});
        if(n!=-1){
            openedFiles.value.splice(n,1);
            if(currentPage.value == path){
                if(openedFiles.value.length==0){
                    setCurrentPage(null)
                }
                else if(n<openedFiles.value.length){
                    setCurrentPage((openedFiles.value[n] as Ref<openedFile>).value.path)
                }
                else{
                    setCurrentPage((openedFiles.value[openedFiles.value.length-1] as Ref<openedFile>).value.path)
                }
            }

        }
    }
    return{openedFiles,openFile,closeFile,getFile,bufferContent,currentPage,setCurrentPage}
})
