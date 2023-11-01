/// <reference path="./editor.d.ts"/>
/// <reference path="./message.d.ts"/>
/// <reference path="./utils.d.ts"/>

import type { EventEmitter } from 'events';
import type { BrowserWindow } from 'electron';
import type { SpawnOptions } from 'child_process';

declare global {
    export namespace Editor {
        export namespace Dialog {
            export type DialogMode = 'normal' | 'command';

            export const __protected__: {
                getMode(): DialogMode;
                setMode(mode: DialogMode): void;
            }
        }
        export namespace EditMode {
            export const __protected__: {

            }
        }
        export namespace I18n {
            export type I18nRegisterMap = {
                [key: string]: I18nRegisterMap | string;
            };
            export const __protected__: {
                /**
                 * 动态注册 i18n 数据
                 * Dynamic registration of i18n data
                 *
                 * @param language 语言 language
                 * @param key 翻译路径 Translation path
                 * @param map 翻译表 Translation table
                 */
                register(language: string, key: string, map: I18nRegisterMap): void;

                /**
                 * 导出语言数据
                 * @param language 
                 */
                exportLanguageData(language?: string): I18nRegisterMap;
                /**
                 * 查询当前的语言列表
                 */
                getLanguageList(): string[];
            }
        }
        export namespace Layout {
            export interface CacheLayoutInfo {
                builtin: Record<string, any>;
                custom: Record<string, any>;
                version: string;
            }

            export const __protected__: {
                /**
                 * 初始化布局系统
                 * Initialize the layout system
                 */
                init(layout: Editor.Layout.ILayout): void;
                add(name: string, layout?: Editor.Layout.ILayout): void;
                remove(name: string): void;
                query(name?: string): Promise<Editor.Layout.ILayout>;
                queryList(): Promise<CacheLayoutInfo>;
                on(action: string, handle: (...args: any[]) =>  void): EventEmitter;
                once(action: string, handle: (...args: any[]) =>  void): EventEmitter;
                emit(action: string): boolean;
                removeListener(action: string, handle: (...args: any[]) =>  void): EventEmitter;
            };
        }
        export namespace Panel {
            export interface IPCOpenKitPanelOption {
                // 传给面板的参数
                params: (string | boolean | number | {[key: string]: string | boolean | number})[];
                // 在面板上绑定的事件
                listeners: string[];
                // 当前面板的 id
                kitID: number;
                // 屏幕在完整的渲染区域的坐标
                // 多屏幕的时候，会有空区域，用于计算窗口的显示位置
                screen: {
                    x: number;
                    y: number;
                    width: number;
                    height: number;
                };
                position: {
                    x: number;
                    y: number;
                };
            }
            export interface KitOpenOption extends IPCOpenKitPanelOption {
                webContentID: number;
            }
            export interface OpenKitPanelOption {
                // 打开面板的传入参数
                params?: (string | boolean | number | {[key: string]: string | boolean | number})[];
                // 绑定在元素上的事件
                listeners?: { [key: string]: (...args: any[]) => void };
                // 显示在哪一个元素上
                elem: Element;
            }
            export const __protected__: {
                preloadKit(): void;
                openKit(name: string, options: OpenKitPanelOption): void;
                closeKit(name): void;
                holdKit(): void;
                /**
                 * 打开指定面板的开发者工具
                 * @param name 
                 */
                _openDevTools(name: string): void;
            }
        }
        export namespace Logger {

            export const __protected__: {
                record(str: string): void;

                /**
                 * 监听 Logger 内发送的事件
                 * Listeners for events sent in the Logger
                 * 谨慎使用，之后会被移除
                 * Use with caution and it will be removed later
                 *
                 * @param action 监听动作 Monitor actions
                 * @param handle 处理函数 The processing function
                 */
                on(action: string, handle: (...args: any[]) => void): EventEmitter;
                /**
                 * 监听 Logger 内发送的事件
                 * Listeners for events sent in the Logger
                 * 谨慎使用，之后会被移除
                 * Use with caution and it will be removed later
                 *
                 * @param action 监听动作 Monitor actions
                 * @param handle 处理函数 The processing function
                 */
                once(action: string, handle: (...args: any[]) => void): EventEmitter;
                /**
                 * 触发一个监听事件
                 *
                 * @param action 监听动作 Monitor actions
                 * @param args[]
                 */
                emit(action: string, ...args: any[]): boolean;
                /**
                 * 移除监听的事件
                 * Removes listener event
                 * 谨慎使用，之后会被移除
                 * Use with caution and it will be removed later
                 *
                 * @param action 监听动作 Monitor actions
                 * @param handle 处理函数 The processing function
                 */
                removeListener(action: string, handle: (...args: any[]) => void): EventEmitter;
            };
        }
        export namespace Menu {

            export const __protected__: {
                /**
                 * 添加一个菜单
                 * Add a menu
                 * 只有主进程可以使用
                 * Only the main process can use it
                 *
                 * @param path
                 * @param options
                 */
                add(path: string, options: BaseMenuItem): void;

                /**
                 * 删除一个菜单
                 * Delete a menu
                 * 只有主进程可以使用
                 * Only the main process can use it
                 *
                 * @param path
                 * @param options
                 */
                remove(path: string, options: BaseMenuItem): void;

                /**
                 * 应用之前的菜单修改
                 * Apply the previous menu changes
                 * 只有主进程可以使用
                 * Only the main process can use it
                 */
                apply(): void;

                /**
                 * 添加分组信息
                 * Add grouping information
                 *
                 * @param path
                 * @param name
                 * @param order
                 */
                addGroup(path: string, name: string, order?: number): void;

                /**
                 * 删除分组信息
                 * Delete grouping information
                 *
                 * @param path
                 * @param name
                 */
                removeGroup(path: string, name: string): void;

                /**
                 * 查询当前弹出的右键菜单的模版信息
                 */
                queryPopup(): Promise<ContextMenuItem[]>;

                /**
                 * 查询当前弹出的右键菜单的模版信息
                 * @param searcher 选择器
                 */
                clickPopup(searcher: string): Promise<void>;

                /**
                 * 查询主菜单的模版信息
                 */
                queryMain(): Promise<{[key: string]: MainMenuItem}>;

                /**
                 * 查询当前弹出的右键菜单的模版信息
                 * @param searcher 选择器
                 */
                clickMain(searcher: string): Promise<void>;
                disconnectMainMenu(): void;
                connectMainMenu(): void;
            }
        }
        export namespace Message {
            export interface MessageRegisterInfo {
                [message: string]: MessageInfo;
            }
            export const __protected__: {
                /**
                 * 请勿使用
                 * Do not use
                 * 马上会被删除
                 * It will be deleted immediately
                 *
                 * @param name
                 * @param messageInfo
                 */
                __register__(name: string, messageInfo: MessageRegisterInfo): void;
                /**
                 * 请勿使用
                 * Do not use
                 * 马上会被删除
                 * It will be deleted immediately
                 *
                 * @param name
                 */
                __unregister__(name: string): void;
                __eb__: EventEmitter;
                /**
                 * 新增一个广播消息监听器
                 * Add a new broadcast message listener
                 * 不监听的时候，需要主动取消监听
                 * When not listening, you need to take the initiative to cancel listening
                 *
                 * @param message 消息名 Message name
                 * @param func 处理函数 The processing function
                 */
                addBroadcastListener(message: string, func: Function): void;
                /**
                 * 新增一个广播消息监听器
                 * Removes a broadcast message listener
                 *
                 * @param message 消息名 Message name
                 * @param func 处理函数 The processing function
                 */
                removeBroadcastListener(message: string, func: Function): void;
            }
        }
        export namespace Network {
            export const __protected__: {
                /**
                 * 测试是否可以联通 passport.cocos.com 服务器
                 * Test whether you can connect to the passport.cocos.com server
                 */
                testConnectServer(): Promise<boolean>;
            }
        }
        export namespace Package {

            export type packageType = 'builtin' | 'cover' | 'local' | 'global' | 'other';

            export interface IDisableInfo {
                name: string;
                time: number;
            }

            export const __protected__: {
                /**
                 * 启动已经扫描到的插件
                 */
                startup(handle: (name: string, path: string) => Promise<void>): Promise<void>;
                /**
                 * 记录关闭的插件
                 * @param path 
                 */
                 addDisableInfo(path: string): void;
                 /**
                  * 移除记录的关闭信息
                  * @param path 
                  */
                 removeDisableInfo(path: string): void;
                /**
                 * 获取一个插件是否被有被关闭的记录信息
                 * @param path 
                 */
                queryDisbaleInfo(path: string): Promise<IDisableInfo | void>;
                /**
                 * 关闭同名的其他更高优先级的插件
                 * @param path 
                 */
                disableOther(path: string): Promise<void>;
                /**
                 * 关闭后打开同名的插件，根据优先级顺序打开
                 * @param path 
                 */
                enableOther(path: string): Promise<void>;
                /**
                 * 扫描一个目录，并将返回目录内的所有插件路径数组
                 * @param dir
                 */
                scan(dir: string): Promise<string[]>;
                /**
                 * 传入插件目录，返回插件的类别
                 * @param dir 
                 */
                checkType(dir: string): packageType;
                /**
                 * 检查是否能够在当前版本打开
                 * @param version
                 */
                checkVersion(version: string): boolean;
                /**
                 * 检查是否需要刷新插件数据
                 * @param path 
                 */
                checkReload(path: string): boolean;
                /**
                 * 格式化一个路径地址
                 * @param path 
                 */
                normalizePath(path: string): string;
                /**
                 * 监听插件事件
                 */
                on(action: string, handle: (...args: any[]) => void): any;
                /**
                 * 监听一次插件事件
                 */
                once(action: string, handle: (...args: any[]) => void): any;
                /**
                 * 触发一个监听事件
                 */
                emit(action: string, ...args: any[]): any;
                /**
                 * 移除监听插件的事件
                 */
                removeListener(action: string, handle: (...args: any[]) => void): any;
                /**
                 * 比对版本号
                 * A > B => 1
                 * A = B => 0
                 * A < B => -1
                 * @param versionA 版本号
                 * @param versionB 版本号
                 */
                compareVersion(versionA: string, versionB: string): number;
            };
        }
        export namespace Profile {
            export const __protected__: {
                /**
                 * 迁移插件某个版本的本地配置数据到指定版本
                 * Migrate the local configuration data of a certain version of the plugin to the target version
                 *
                 * @param pkgName
                 * @param profileVersion
                 * @param profileData
                 * @param targetVersion
                 */
                migrateLocal(pkgName: string, profileVersion: string, profileData: Record<string, any>, targetVersion?: string): Promise<boolean>;
                /**
                 * 迁移插件某个版本的全局配置数据到指定版本
                 * Migrate the global configuration data of a certain version of the plugin to the target version
                 *
                 * @param pkgName
                 * @param profileVersion
                 * @param profileData
                 * @param targetVersion
                 */
                migrateGlobal(pkgName: string, profileVersion: string, profileData: Record<string, any>, targetVersion?: string): Promise<boolean>;
                /**
                 * 迁移插件某个版本的项目配置数据到指定版本
                 * Migrate the project configuration data of a certain version of the plugin to the target version
                 *
                 * @param pkgName
                 * @param profileVersion
                 * @param profileData
                 * @param targetVersion
                 */
                migrateProject(pkgName: string, profileVersion: string, profileData: Record<string, any>, targetVersion?: string): Promise<boolean>;
                /**
                 * 生成 profiles 对象
                 * @param name
                 */
                ensureProfiles(name: string): any;
                /**
                 * 监听 profile 事件
                 * 谨慎使用，之后会被移除
                 * Use with caution and it will be removed later
                 */
                on(action: string, handle: (...args: any[]) => void): EventEmitter;
                /**
                 * 监听一次 profile 事件
                 * 谨慎使用，之后会被移除
                 * Use with caution and it will be removed later
                 */
                once(action: string, handle: (...args: any[]) => void): EventEmitter;
                /**
                 * 触发一个监听事件
                 */
                emit(action: string, ...args: any[]): boolean;
                /**
                 * 移除监听的 profile 事件
                 * 谨慎使用，之后会被移除
                 * Use with caution and it will be removed later
                 */
                removeListener(action: string, handle: (...args: any[]) => void): EventEmitter;
                _registerMigration(pkgName: string, migrations: any[]): void;
            }
        }
        export namespace Project {
            export const __protected__: {
                type: string;
                /**
                 * 当前项目路径
                 * Current project path
                 */
                path: string;
                /**
                 * 当前项目 uuid
                 * The current project UUID
                 */
                uuid: string;
                /**
                 * 当前项目名称(取自 package.json)
                 * The current project name
                 */
                name: string;
                /**
                 * 当前项目临时文件夹
                 * Temporary folder for current project
                 */
                tmpDir: string;

                /**
                 * 创建一个项目
                 * Creating a project
                 * 谨慎使用，之后会被移除
                 * Use with caution and it will be removed later
                 */
                create(): void;
                /**
                 * 打开一个项目
                 * Open a project
                 * 谨慎使用，之后会被移除
                 * Use with caution and it will be removed later
                 *
                 * @param path
                 */
                open(path?: string): void;
                /**
                 * 添加一个项目
                 * Add a project
                 * 谨慎使用，之后会被移除
                 * Use with caution and it will be removed later
                 *
                 * @param path
                 */
                add(path: string): void;
                /**
                 * 获取最后打开的编辑器版本号
                 */
                getLastEditorVersion(): Promise<string>;
            }
        }

        export namespace User {
            export const __protected__: {
                /**
                 * 通过插件名，获取证书信息
                 * @param pluginName
                 */
                queryLicenseByPluginName(pluginName: string);
                /**
                 * 通过证书名，获取证书信息
                 * @param name
                 */
                queryLicenseByName(name: string);
            }
        }

        export namespace Selection {
            export const __protected__: {
                /**
                 * 监听 profile 事件
                 * 谨慎使用，之后会被移除
                 * Use with caution and it will be removed later
                 */
                on(action: string, handle: (...args: any[]) => void): EventEmitter;
                /**
                 * 监听一次 profile 事件
                 * 谨慎使用，之后会被移除
                 * Use with caution and it will be removed later
                 */
                once(action: string, handle: (...args: any[]) => void): EventEmitter;
                /**
                 * 触发一个监听事件
                 */
                emit(action: string, ...args: any[]): boolean;
                /**
                 * 移除监听的 profile 事件
                 * 谨慎使用，之后会被移除
                 * Use with caution and it will be removed later
                 */
                removeListener(action: string, handle: (...args: any[]) => void): EventEmitter;
            }
        }
        export namespace Startup {
            export const ready: {
                readonly window: any;
                readonly package: any;
            };
            export function window(): Promise<void>;
            export function manager(skipLogin: boolean): Promise<void>;
            export function package(): Promise<void>;
            export function build(options: any, debug: boolean): Promise<any>;
            export function on(action: string, handle: Function): EventEmitter;
            export function removeListener(action: string, handle: Function): EventEmitter;
            export function once(action: string, handle: Function): EventEmitter;

            export interface builtinJSON {
                // 关闭的内置插件
                disableBuiltin?: string[];
                // 启动的外部插件
                extensions?: string[];
                // 
                env?: {
                    // 更改编辑器配置目录
                    HOME?: string;
                    // 更改启动项目
                    PROJECT?: string;
                    // 启动默认使用的布局信息，支持文件路径和 json 对象
                    LAYOUT?: string;
            
                    // 启动默认使用的语言
                    LANGUAGE?: string;
            
                    // 主窗口钩子，在 Editor 执行后立即执行
                    // MAIN_WINDOW_HOOK?: string;
                    // 主窗口特殊的样式
                    // MAIN_WINDOW_STYLE?: string;
                    // 主窗口上的 Header
                    // MAIN_WINDOW_HEADER?: string; 
                    // 叠加新的头部内容
                    MAIN_WINDOW_CUSTOM_HEADER?: string;
                    // 控制内置头部区域显示
                    MAIN_WINDOW_ORIGIN_HEADER?: {
                        ALL?: boolean, // ALL 是控制整个头部的显示；配置为 false 为隐藏; undefined 等同于 true 为显示;
                        CENTER?: boolean, // 中间预览操作区域；true / false 同上意义
                        RIGHT?: boolean, // 右边区域，但不包括关闭窗口的三个按钮区域
                    };
           
                    // 主窗口上的 Footer
                    MAIN_WINDOW_FOOTER?: string;
            
                    // 所有窗口钩子，在 Editor 执行后立即执行
                    WINDOW_HOOK?: string;
                    // 所有窗口的样式
                    WINDOW_STYLE?: string;
                };
            }
        }
        export namespace UI {
            export const __protected__: {
                registerTranslator(handle: (key: string) => string): void;
                Base: any;
                Button: any;
                Input: any;
                NumInput: any;
                Loading: any;
                Checkbox: any;
                Section: any;
                Select: any;
                Bit: any;
                Slider: any;
                ColorPicker: any;
                Color: any;
                DragItem: any;
                DragArea: any;
                DragObject: any;
                Prop: any;
                Tooltip: any;
                TextArea: any;
                Progress: any;
                Label: any;
                Code: any;
                Tab: any;
                Gradient: any;
                GradientPicker: any;
                Icon: any;
                File: any;
                Link: any;
                Image: any;
                QRCode: any;
                Markdown: any;
                Curve: any;
                CurveEditor: any;
                NodeGraph: any;
                Setting: any;
                Radio: any;
                RadioGroup: any;
                ScaleSlider: any;
            }
        }
        export namespace Metrics {
            export interface trackEventInfo {
                sendToCocosAnalyticsOnly?: boolean;
                // 是否只发送到新的统计后台
                sendToNewCocosAnalyticsOnly?: boolean;
                [propName: string]: any;
            }
            export interface trackWithTimerEventInfo {
                category: string; // 分组目录
                id: string; // 事件行为 ID
                value: number; // 事件值
            }
            export interface trackOptions {
                uid: string;
                cid: string;
                debug?: boolean;
            }
            export interface trackExceptionInfo {
                code: number;
                message: string;
            }
            export interface trackMemoryUsage {
                rss: number; // 常驻集大小 - 为无法与其他进程共享的进程分配的内存量
                heapTotal: number; // 堆的总大小
                heapUsed: number; // 堆使用的内存量
                external: number; // 由 V8 管理的与 JavaScript 对象绑定的 C++ 对象使用的内存量。
            }
            export interface trackTimeEndOptions {
                output?: boolean;
                label?: string;
                value?: number;
            }
            export interface trackTimeEndInfo {
                message: string;
                options: trackTimeEndOptions;
                time?: number;
            }
            export interface MetricsData {
                index: number;
                funcName: string,
                time: number,
                info?: trackEventInfo | trackWithTimerEventInfo | trackTimeEndInfo | trackExceptionInfo;
                process?: string;
                memoryInfo?: trackMemoryUsage;
            }
            /**
             * 追踪一个事件
             * Track an event
             * 请勿使用
             * Do not use
             *
             * @param info 跟踪的错误信息 Error message for trace
             */
            export function trackEvent(info: trackEventInfo): any;
            /**
             * 数据自增统计接口，添加的数据会与缓存数据结合递增
             * @param info 统计事件数据
             * @returns
             */
             export function _trackEventWithTimer(info: trackWithTimerEventInfo): any;
            /**
             * 追踪一个异常
             * Tracing an exception
             * 请勿使用
             * Do not use
             *
             * @param info 跟踪的错误信息 Error message for trace
             */
            export function trackException(info: trackExceptionInfo): any;
            /**
             * 追踪进程内存占用情况
             * Track process memory usage
             * @param process - 进程名
             * @param memoryInfo - 内存信息
             */
            export function trackProcessMemory(process: string, memoryInfo: trackMemoryUsage): void;
            /**
             * 开始追踪时间
             * Start tracking time
             * @param message
             */
            export function trackTimeStart(message: string): void;
            /**
             * 结束追踪时间
             * End tracking time
             * @param message 
             * @param options 输出选项 { output：是否 console.debug 打印; label: 打印的消息名词的替换文本，支持 i18n: 写法; value: 直接打印计算好的统计时间}
             * @return 返回统计时间
             */
            export function trackTimeEnd(message: string, options?: { output?: boolean, label?: string, value?: number }): Promise<number>;
            /**
             * 结束统计，用于结束统计，并上传一些需要统计的数据/耗时
             */
            export function close(): Promise<boolean>;

            export const __protected__: {
                /**
                 * 统计崩溃事件
                 * @param info 统计事件数据
                 * @returns
                 */
                _trackCrashEvent(info: trackEventInfo): Promise<any>;
                /**
                 * 发送收集的统计数据
                 */
                _sendEventGroup();
                /**
                 * 注册上层插件调用的接口
                 * @param key
                 * @param func
                 */
                register(key: string, func: any);
                /**
                 * 重置存储统计数据列表与标记
                 */
                reset();
                /**
                 * 获取初始化数据
                 */
                getMetricInitData(): any;
                /**
                 * 设置初始化数据
                 * @param data
                 */
                setMetricInitData(data: any);
                /**
                 * 获取存储统计的数据
                 */
                getTrackInfoList(): any[];
                /**
                 * 获取存储耗时 Map
                 */
                getTrackTimeStartMap(): Map<string, number>;
                /**
                 * 获取上传插件注册的处理函数数组
                 */
                getTrackAwaitHandler(): any[];
                /**
                 * 获取存储内存信息
                 */
                getProcessMemoryMap(): Map<string, number>;
                /**
                 * 开始追踪进程内存
                 * Start tracking process memory
                 * @param message
                 * @param memory
                 */
                trackProcessMemoryStart(message: string, memory?: trackMemoryUsage);
                /**
                 * 结束追踪进程内存
                 * End trace process memory
                 * @param message
                 * @param memory
                 * @return 返回进程内存增量
                 */
                trackProcessMemoryEnd(message: string, memory?: trackMemoryUsage): Promise<number>;
            }
        }

        export namespace Utils {
            export namespace Process {
                // export interface IQuickSpawnOption extends SpawnOptions {
                //     cwd?: string;
                //     env?: any;
                //     // 输出等级，默认 = 0，即 log 级别以上都打印
                //     logLevel?: LogLevel;
                
                //     downGradeWaring?: boolean; // 警告将会转为 log 打印，默认为 false
                //     downGradeLog?: boolean; // log 将会转为 debug 打印，默认为 true
                //     downGradeError?: boolean; // 错误将会转为警告打印，默认为 false

                //     onlyPrintWhenError?: boolean; // 默认为 true, 日志都正常收集，但仅在发生错误时打印信息，其他时候静默处理

                //     prefix?: string; // 日志输出前缀
                // }
                // /**
                //  * 快速开启子进程，无需再自行监听输出，将会返回一个标记完成的 promise 对象
                //  * @param command 命令
                //  * @param cmdParams 参数数组
                //  * @param options 可选，开启的一些参数配置
                //  */
                //  export function quickSpawn(command: string, cmdParams: string[], options?: IQuickSpawnOption):Promise<boolean>;
            }
        }
        export namespace Module {
            export type RequireOptions = {
                root?: string;
            };
            export type ImportProjectModuleDelegate = (url: string) => Promise<unknown>;

            export const __protected__: {
                /**
                 * 动态加载一个脚本模块
                 * @param file
                 */
                requireFile(file: string, options?: RequireOptions): any;
                /**
                 * 删除加载的模块文件的缓存
                 * @param file
                 */
                removeCache(file: string): any;
                setImportProjectModuleDelegate(delegate: ImportProjectModuleDelegate): void;
            }
        }
        export namespace Windows {
            interface IWindowOptions {
                frame?: boolean;
                center?: boolean;
                width?: number;
                height?: number;
                minWidth?: number;
                minHeight?: number;
                titleBarStyle?: 'hiddenInset';
                titleBarOverlay?: number;
                autoHideMenuBar?: boolean;
                menuBarVisibility?: boolean;
                transparent?: boolean;
                resizable?: boolean;
                fullscreen?: boolean;
                minimizable?: boolean;
                show?: boolean;
                webPreferences?: {
                    nodeIntegration?: boolean;
                    webviewTag?: boolean;
                    // backgroundThrottling?: boolean;
                    enableRemoteModule?: boolean;
                    contextIsolation?: boolean;
                    backgroundThrottling?: boolean;
                };
            }

            export const __protected__: {
                startup(): void;
                maximize(): void;
                minimize(): void;
                close(): void;
                open(HTML: string, options?: IWindowOptions, userData?: {[key: string]: any}): Promise<string>;
            
                queryUserData(winID?: string): any;
                changeUserData(data: {[key: string]: any}, winID?: string): void;
                changeMinSize(width: number, height: number, winID?: string): void;
            
                generateBlank(): void;
                openSubWindow(size: { width: number, height: number }, userData: {[key: string]: any})
                openSimpleWindow(size: { width: number, height: number }, userData: {[key: string]: any})
            
                setBeforeOpenHook(func: (windows: any) => void): void;
                setAfterOpenHook(func: (windows: any) => void): void;
            };
        }

        export namespace Task {
            export const __protected__: {
                /**
                 * 添加一个同步任务
                 * Add a synchronous task
                 * 会在主窗口显示一个遮罩层
                 * A mask layer is displayed in the main window
                 *
                 * @param title 任务名字 The task name
                 * @param describe 任务描述 Task description
                 * @param message 任务内容 Content of the task
                 */
                addSyncTask(title: string, describe?: string, message?: string): void;
                /**
                 * 更新某一个同步任务显示的数据
                 * Update the data displayed by a synchronous task
                 *
                 * @param title 任务名字 The task name
                 * @param describe 任务描述 Task description
                 * @param message 任务内容 Content of the task
                 */
                updateSyncTask(title: string, describe?: string, message?: string): void;
                /**
                 * 删除一个同步任务
                 * Delete a synchronous task
                 *
                 * @param title 任务的名字 The name of the task
                 */
                removeSyncTask(title: string): void;
                /**
                 * 是否正在显示遮罩
                 */
                hasSyncTask(): Promise<boolean>;
                /**
                 * 页面进程立即同步一次主进程数据
                 * The page process synchronizes the master process data immediately
                 * 谨慎使用，之后会被移除
                 * Use with caution and it will be removed later
                 */
                sync(): void;
                /**
                 * 监听插件事件
                 */
                on(action: string, handle: (...args: any[]) => void): EventEmitter;
                /**
                 * 监听一次插件事件
                 */
                once(action: string, handle: (...args: any[]) => void): EventEmitter;
                /**
                 * 触发一个监听事件
                 */
                emit(action: string, ...args: any[]): boolean;
                /**
                 * 移除监听插件的事件
                 */
                removeListener(action: string, handle: (...args: any[]) => void): EventEmitter;
            }
        }
    }
}
export {};
