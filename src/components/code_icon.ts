
import { defineStore } from "pinia";
export const useIconsStore = defineStore('icons', () => {
  // 文件类型与图标映射配置
  const fileTypeConfig = {
    'py': { icon: 'fa-brands fa-python', color: '#3776AB' },
    'js': { icon: 'fa-brands fa-js-square', color: '#F7DF1E' },
    'ts': { icon: 'fa-solid fa-code', color: '#3178C6' },
    'jsx': { icon: 'fa-brands fa-react', color: '#61DAFB' },
    'tsx': { icon: 'fa-brands fa-react', color: '#61DAFB' },
    'html': { icon: 'fa-brands fa-html5', color: '#E34F26' },
    'css': { icon: 'fa-brands fa-css3-alt', color: '#1572B6' },
    'scss': { icon: 'fa-brands fa-sass', color: '#CC6699' },
    'vue': { icon: 'fa-brands fa-vuejs', color: '#4FC08D' },
    'java': { icon: 'fa-brands fa-java', color: '#ED8B00' },
    'php': { icon: 'fa-brands fa-php', color: '#777BB4' },
    'c': { icon: 'fa-solid fa-c', color: '#A8B9CC' },
    'cpp': { icon: 'fa-solid fa-c', color: '#00599C' },
    'cs': { icon: 'fa-solid fa-code', color: '#239120' },
    'go': { icon: 'fa-solid fa-code', color: '#00ADD8' },
    'rs': { icon: 'fa-solid fa-code', color: '#DEA584' },
    'rb': { icon: 'fa-solid fa-gem', color: '#CC342D' },
    'swift': { icon: 'fa-brands fa-swift', color: '#F05138' },
    'kt': { icon: 'fa-solid fa-code', color: '#7F52FF' },
    'json': { icon: 'fa-solid fa-code', color: '#000000' },
    'xml': { icon: 'fa-solid fa-code', color: '#0060AC' },
    'md': { icon: 'fa-brands fa-markdown', color: '#000000' },
    'sql': { icon: 'fa-solid fa-database', color: '#336791' },
    'sh': { icon: 'fa-solid fa-terminal', color: '#4EAA25' },
    'dockerfile': { icon: 'fa-brands fa-docker', color: '#2496ED' },
    'yml': { icon: 'fa-solid fa-code', color: '#CB171E' },
    'yaml': { icon: 'fa-solid fa-code', color: '#CB171E' }
  }

  // 根据文件后缀获取图标配置
  const getFileIconConfig = (extension: string) => {
    // @ts-ignore
    return fileTypeConfig[extension] || { icon: 'fa-regular fa-file-code', color: '#6c757d' }
  }

  // 获取所有支持的扩展名
  const getSupportedExtensions = () => {
    return Object.keys(fileTypeConfig)
  }

  // 添加新的文件类型映射
  const addFileTypeMapping = (extension: string, config: { icon: string, color: string }) => {
    // @ts-ignore
    fileTypeConfig[extension] = config
  }

  return {
    fileTypeConfig,
    getFileIconConfig,
    getSupportedExtensions,
    addFileTypeMapping
  }
})