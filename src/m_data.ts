import { defineStore } from 'pinia'
import { ref, type Ref,triggerRef} from "vue"

// 检查是否在 Electron 环境中
const inElectronFlag = window && "process" in window && 
                      "versions" in (window as any).process && 
                      (window as any).process.versions['electron'];

export enum FileOrFolder {
    File = "file",
    Folder = "folder"
}

// 使用接口定义，避免循环引用问题
export interface BaseNode {
    parent: FolderNode | null;
    type: FileOrFolder;
    name: string;
    alive:boolean
}

export interface FileNode extends BaseNode {
    type: FileOrFolder.File;
    content: string;
}

export interface FolderNode extends BaseNode {
    type: FileOrFolder.Folder;
    children: Array<FileNode | FolderNode>;
}

// 创建默认文件结构
const createDefaultFile = (): FolderNode => {
    const defaultFile: FolderNode = {
        parent: null,
        type: FileOrFolder.Folder,
        name: "rootFolder",
        alive:true,
        children: [
            {
                parent: null,
                type: FileOrFolder.Folder,
                name: "assert",
                alive:true,
                children: [
                    {
                        parent: null,
                        type: FileOrFolder.File,
                        name: "main.py",
                        alive:true,
                        content: [
                            "a=233",
                            "print(\'hello\',a)"
                        ].join("\n")

                    },
                    {
                        parent: null,
                        type: FileOrFolder.File,
                        name: "code.js",
                        alive:true,
                        content: [
                            "const a:Number=114514;",
                            "var add=(a,b)=>{return a+b;}",
                            "console.log(add(a,23333))"    
                        ].join("\n")
                    }
                ]
            },
            {
                parent: null,
                type: FileOrFolder.File,
                name: "readme.md",
                alive:true,
                content: "# title \n ## I'm a readme file\n so on~"
            },
            {
                parent: null,
                type: FileOrFolder.Folder,
                name: "src",
                alive:true,
                children: [
                    {
                        parent: null,
                        type: FileOrFolder.File,
                        name: "main.py",
                        alive:true,
                        content: 'a=1124\nprint("hello"+a)\nif(true):\n    a=2233\n    a++'
                    }
                ]
            }
        ]
    };
    
    return defaultFile;
}

// 设置父节点关系的函数
const setParent = (node: FolderNode): void => {
    node.children.forEach((child) => {
        child.parent = node;
        if (child.type === FileOrFolder.Folder) {
            setParent(child as FolderNode);
        }
    });
}

// 初始化默认文件结构
const defaultFile = createDefaultFile();
setParent(defaultFile);

export const useFileStore = defineStore("fileData", () => {
    const folderStructure: Ref<FolderNode> = ref(structuredClone(defaultFile));
    
    // 解析路径函数
    const resolvePath = (path: string): { f: FileNode | FolderNode | null } => {
        // 处理空路径
        if (!path || path === '/' ||path =="") {
            return { f: folderStructure.value };
        }
        
        // 标准化路径分隔符
        const normalizedPath = path.replace(/\\/g, '/');
        const parts = normalizedPath.split('/').filter(part => part.length > 0 && part !== '.');
        
        let currentFolder: FolderNode = folderStructure.value;
        
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLast = i === parts.length - 1;
            
            if (part === "..") {
                if (currentFolder.parent !== null) {
                    currentFolder = currentFolder.parent;
                } else {
                    throw new Error("Cannot go above root directory");
                }
                continue;
            }
            
            const found = currentFolder.children.find(child => child.name === part);
            
            if (!found) {
                throw new Error(`Path not found: ${path}`);
            }
            
            if (isLast) {
                return { f: found };
            }
            
            if (found.type === FileOrFolder.File) {
                throw new Error(`Cannot traverse into file: ${part}`);
            }
            
            currentFolder = found as FolderNode;
        }
        
        return { f: currentFolder };
    }


    const saveFile=(path:string,content:string)=>{
        
        var t = resolvePath(path);
        
        console.log(content);
        (t.f as FileNode).content = content;
        console.log(t);
    }
    // 添加一些有用的方法
    const getFileContent = (path: string): string => {
        const result = resolvePath(path);
        if (!result.f || result.f.type !== FileOrFolder.File) {
            throw new Error(`File not found: ${path}`);
        }
        return (result.f as FileNode).content;
    }

    const getFolderChildren = (path: string): Array<FileNode | FolderNode> => {
        const result = resolvePath(path);
        if (!result.f || result.f.type !== FileOrFolder.Folder) {
            throw new Error(`Folder not found: ${path}`);
        }
        return (result.f as FolderNode).children;
    }
    const getNameOf=(path:string)=>{
        try{
            var f= resolvePath(path);
            if(f == null){return null}
            else return (f as unknown  as BaseNode).name;
        }catch{
            return null
        }
    }
    

    const addFile = (folder:FolderNode, name: string, content: string = ''): void => {
        
        if(folder.children.findIndex((f)=>{return f.name==name})!=-1){
            throw Error("name repeat")
        }
        const newFile: FileNode = {
            alive:true,
            parent: folder,
            type: FileOrFolder.File,
            name : name,
            content:""
        };
        
        folder.children.push(newFile);
        triggerRef(folderStructure)
    }
    const addFolder = (pfolder:FolderNode, name: string ): void => {
        
        if(pfolder.children.findIndex((f)=>{return f.name==name})!=-1){
            throw Error("name repeat")
        }
        const newFolder: FolderNode = {
            alive:true,
            parent: pfolder,
            type: FileOrFolder.Folder,
            children:[],
            name:name,
        };
        
        pfolder.children.push( newFolder);
        triggerRef(folderStructure)
    }
    const m_triggerRef = ()=>{
        triggerRef(folderStructure)
    }
    const m_delete = (f:BaseNode)=>{
        f.alive = false;
        if(f.type==FileOrFolder.File){
            f.parent?.children.slice(f.parent.children.findIndex((v)=>{v===f}),1);
        }
        else{
            var i:any
            for(i in (f as FolderNode).children){
                m_delete(i as BaseNode);
            }
            f.alive = false;
            f.parent?.children.slice(f.parent.children.findIndex((v)=>{v===f}),1);
        }
    }
    const executePythonCode = async (code: string) => {
        if (inElectronFlag && window.electronAPI) {
            try {
                const result = await window.electronAPI.runPythonCode(code);
                console.log('Python 执行结果:', result);
                return result;
            } catch (error) {
                console.error('执行 Python 代码时出错:', error);
                throw error;
            }
        } else {
                console.warn('不在 Electron 环境中，无法执行 Python 代码');
                return null;
        }
    };

    return {
        folderStructure,
        resolvePath,
        getFileContent,
        getFolderChildren,
        addFile,
        getNameOf,
        addFolder,
        m_triggerRef,
        saveFile,
        executePythonCode
    };
});