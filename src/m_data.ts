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
}

export interface FileNode extends BaseNode {
    type: FileOrFolder.File;
    content: string;
}

export interface FolderNode extends BaseNode {
    type: FileOrFolder.Folder;
    children: Array<FileNode | FolderNode>;
}
export interface openedFile{
    path:string;
    content:Array<string>;
    saved:boolean;
    name:string;
}
// 创建默认文件结构
const createDefaultFile = (): FolderNode => {
    const defaultFile: FolderNode = {
        parent: null,
        type: FileOrFolder.Folder,
        name: "rootFolder",
        children: [
            {
                parent: null,
                type: FileOrFolder.Folder,
                name: "assert",
                children: [
                    {
                        parent: null,
                        type: FileOrFolder.File,
                        name: "main.py",
                        content: 'a=1124\nprint("hello"+a)\nif(true):\n    a=2233\n    a++'
                    }
                ]
            },
            {
                parent: null,
                type: FileOrFolder.File,
                name: "readme.md",
                content: "# title \n ## I'm a readme file\n so on~"
            },
            {
                parent: null,
                type: FileOrFolder.Folder,
                name: "src",
                children: [
                    {
                        parent: null,
                        type: FileOrFolder.File,
                        name: "main.py",
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

    // 添加文件/文件夹的方法
    const addFile = (path: string, name: string, content: string = ''): void => {
        const result = resolvePath(path);
        if (!result.f || result.f.type !== FileOrFolder.Folder) {
            throw new Error(`Cannot add file to non-folder: ${path}`);
        }
        
        const parentFolder = result.f as FolderNode;
        parentFolder.children.filter((f)=>{f.name!=name});
        const newFile: FileNode = {
            parent: parentFolder,
            type: FileOrFolder.File,
            name,
            content
        };
        
        parentFolder.children.push(newFile);
        triggerRef(folderStructure)
    }

    return {
        folderStructure,
        resolvePath,
        getFileContent,
        getFolderChildren,
        addFile
    };
});