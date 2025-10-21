import { defineStore } from 'pinia'
import{ref} from "vue"

var inElectronFlag = window &&  "process" in window &&  "versions" in (window as any).process && (window as any).process.versions['electron'];

const defaultFile={
    type:"folder",
    name:"rootFolder",
    child:[{
        type:"file",
        name:"readme.md",
        content:"#tile \n ##i'm a readme file\n so on~"
    },{
        type:"folder",
        name:"src",
        child:[{
            type:"file",
            name:"main.py",
            content:"a=1124\nprint(\"hello\"+a)\nif(true):\n    a=2233\n    a++"
        }
        ]
    }
    ]
}
export const md = ()=>{
    if(inElectronFlag){
        return{
            
        }
    }else{
        return
        ()=>{
            const fileTree=ref(structuredClone(defaultFile))
            /**
             * @type {import("vue").Ref<Array<{
             *  path:string,
             *  name:string,
             *  content:Array<{
             *      lineContent:string
             * }>
             * }>>}
             */
            const openFiles=ref([])
        }
        
    }
}