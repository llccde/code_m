import subprocess
import sys
import time
import signal
import os
import argparse
from threading import Thread

class VueElectronManager:
    def __init__(self):
        self.vue_process = None
        self.electron_process = None
        self.is_running = True
        
        # 注册信号处理，确保Python退出时清理子进程
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
    
    def signal_handler(self, signum, frame):
        """处理中断信号，清理子进程"""
        print(f"\n接收到信号 {signum}，正在清理进程...")
        self.cleanup()
        sys.exit(0)
    
    def run_command(self, command, shell=False, wait=False):
        """运行命令并返回进程对象"""
        try:
            if shell:
                process = subprocess.Popen(
                    command,
                    shell=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    universal_newlines=True
                )
            else:
                process = subprocess.Popen(
                    command,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    universal_newlines=True
                )
            
            if wait:
                # 实时输出命令输出
                for line in iter(process.stdout.readline, ''):
                    if line:
                        print(line.strip())
                process.wait()
                return process.returncode
            else:
                return process
        except Exception as e:
            print(f"执行命令失败: {command}, 错误: {e}")
            return None
    
    def wait_for_vite_ready(self, process, timeout=60):
        """等待Vite开发服务器就绪"""
        print("等待Vite开发服务器启动...")
        start_time = time.time()

        for line in iter(process.stdout.readline, ''):
            if not self.is_running:
                break
                
            line = line.strip()
            if line:
                print(line)
                
            # 检查Vite启动完成的标志
            if "Local:" in line or "Network:" in line or "ready in" in line.lower():
                print("✓ Vite开发服务器已就绪")
                return True
                
            # 检查超时
            if time.time() - start_time > timeout:
                print("✗ Vite启动超时")
                return False
                
            # 检查进程是否已经结束
            if process.poll() is not None:
                print("✗ Vite进程异常退出")
                return False
        
        return False
    
    def monitor_vue_output(self):
        """监控Vue进程输出的线程函数"""
        if self.vue_process and self.vue_process.stdout:
            for line in iter(self.vue_process.stdout.readline, ''):
                if not self.is_running:
                    break
                if line.strip():
                    print(f"[Vue] {line.strip()}")
    
    def monitor_electron_output(self):
        """监控Electron进程输出的线程函数"""
        if self.electron_process and self.electron_process.stdout:
            for line in iter(self.electron_process.stdout.readline, ''):
                if not self.is_running:
                    break
                if line.strip():
                    print(f"[Electron] {line.strip()}")
    
    def start_dev_mode(self):
        """启动开发模式"""
        print("🚀 启动开发模式...")
        
        # 启动Vue开发服务器
        print("启动Vue开发服务器...")
        self.vue_process = self.run_command("npm run dev", shell=True)
        if not self.vue_process:
            print("✗ 启动Vue开发服务器失败")
            return False
        
        # 等待Vite就绪
        if not self.wait_for_vite_ready(self.vue_process):
            self.cleanup()
            return False
        
        # 启动监控线程
        vue_thread = Thread(target=self.monitor_vue_output, daemon=True)
        vue_thread.start()
        
        # 等待一小段时间确保Vite完全就绪
        time.sleep(2)
        
        # 启动Electron开发模式
        print("启动Electron...")
        self.electron_process = self.run_command("npm run electron-dev", shell=True)
        if not self.electron_process:
            print("✗ 启动Electron失败")
            self.cleanup()
            return False
        
        # 启动Electron输出监控
        electron_thread = Thread(target=self.monitor_electron_output, daemon=True)
        electron_thread.start()
        
        print("✓ 开发模式已启动")
        return True
    
    def start_build_mode(self):
        """启动构建模式"""
        print("🔨 启动构建模式...")
        
        # 构建Vue项目
        print("构建Vue项目...")
        build_result = self.run_command("npm run build", shell=True, wait=True)
        if build_result != 0:
            print("✗ Vue项目构建失败")
            return False
        
        print("✓ Vue项目构建完成")
        
        # 构建Electron应用
        print("构建Electron应用...")
        electron_build_result = self.run_command("npm run electron-build", shell=True, wait=True)
        if electron_build_result != 0:
            print("✗ Electron应用构建失败")
            return False
        
        print("✓ Electron应用构建完成")
        return True
    
    def wait_for_processes(self):
        """等待子进程结束"""
        try:
            # 等待Electron进程结束
            if self.electron_process:
                self.electron_process.wait()
            # 如果Electron结束了，也结束Vue进程
            if self.vue_process:
                self.vue_process.terminate()
        except KeyboardInterrupt:
            print("\n接收到中断信号，正在关闭应用...")
            self.cleanup()
    
    def cleanup(self):
        """清理所有子进程"""
        self.is_running = False
        print("正在清理进程...")
        
        # 终止Electron进程
        if self.electron_process:
            print("终止Electron进程...")
            try:
                self.electron_process.terminate()
                # 等待进程结束
                for _ in range(10):  # 最多等待5秒
                    if self.electron_process.poll() is not None:
                        break
                    time.sleep(0.5)
                else:
                    # 如果进程没有正常终止，强制杀死
                    self.electron_process.kill()
            except Exception as e:
                print(f"终止Electron进程时出错: {e}")
        
        # 终止Vue进程
        if self.vue_process:
            print("终止Vue开发服务器...")
            try:
                self.vue_process.terminate()
                # 等待进程结束
                for _ in range(10):  # 最多等待5秒
                    if self.vue_process.poll() is not None:
                        break
                    time.sleep(0.5)
                else:
                    # 如果进程没有正常终止，强制杀死
                    self.vue_process.kill()
            except Exception as e:
                print(f"终止Vue进程时出错: {e}")
        
        print("✓ 所有进程已清理")

def main():
    parser = argparse.ArgumentParser(description='Vue + Electron 项目管理脚本')
    parser.add_argument('mode', choices=['dev', 'build'], help='运行模式: dev(开发) 或 build(构建)')
    
    args = parser.parse_args()
    
    manager = VueElectronManager()
    
    try:
        if args.mode == 'dev':
            success = manager.start_dev_mode()
            if success:
                print("\n🎯 开发模式运行中... 按 Ctrl+C 退出")
                manager.wait_for_processes()
            else:
                print("✗ 开发模式启动失败")
                manager.cleanup()
                sys.exit(1)
                
        elif args.mode == 'build':
            success = manager.start_build_mode()
            if not success:
                print("✗ 构建模式执行失败")
                sys.exit(1)
            else:
                print("✓ 构建模式执行完成")
                
    except KeyboardInterrupt:
        print("\n用户中断操作")
        manager.cleanup()
    except Exception as e:
        print(f"发生错误: {e}")
        manager.cleanup()
        sys.exit(1)

if __name__ == "__main__":
    main()