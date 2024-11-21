declare class Style {
    static createInlineStyle(style: StyleProperties): string;
    static parseStyleValue(value: string): string;
    private _blocks;
    constructor();
    addStyleBlock(selector: string, value: StyleProperties): Style;
    addKeyframeBlock(name: string, value: [string, StyleProperties][]): Style;
    addOther(name: string, value: {
        [key: string]: string;
    }): Style;
    render(): string;
}
type Colors = 'black' | 'white' | 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'purple' | 'pink';
interface StyleProperties {
    all?: 'initial' | 'inherit' | 'unset';
    flex?: string;
    gridRow?: string;
    gridColumn?: string;
    gridRowStart?: string;
    gridRowEnd?: string;
    gridColumnStart?: string;
    gridColumnEnd?: string;
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky' | string;
    display?: 'block' | 'inlineBlock' | 'flex' | 'grid' | 'none' | string;
    flexDirection?: 'row' | 'column' | string;
    flexWrap?: 'nowrap' | 'wrap' | '@wrap-reverse' | string;
    flexShrink?: string;
    gridAutoRows?: string;
    gridAutoColumns?: string;
    gridTemplateRows?: string;
    gridTemplateColumns?: string;
    center?: 'horizontal' | 'vertical' | 'horizontal vertical';
    horizontalAlign?: 'start' | 'center' | 'end' | string;
    verticalAlign?: 'start' | 'center' | 'end' | string;
    gap?: string;
    rowGap?: string;
    columnGap?: string;
    background?: string;
    backgroundColor?: Colors | string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundRepeat?: string;
    backgroundX?: string;
    backgroundY?: string;
    foregroundColor?: Colors | string;
    borderStyle?: 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | 'none' | string;
    borderColor?: Colors | string;
    borderSize?: string;
    borderRadius?: string;
    font?: 'serif' | 'sans-serif' | 'monospace' | 'cursive' | 'fantasy' | string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: 'start' | 'center' | 'end' | string;
    textWrap?: 'wrap' | 'balance' | 'pretty' | 'stable' | 'nowrap' | string;
    textOverflow?: 'clip' | 'ellipsis' | string;
    textDecoration?: string;
    textDecorationLine?: 'none' | 'underline' | 'overline' | 'line-through' | 'blink' | string;
    textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy' | string;
    textDecorationColor?: Colors | string;
    textDecorationThickness?: string;
    lineHeight?: string;
    boxShadow?: string;
    textShadow?: string;
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
    width?: string;
    minWidth?: string;
    maxWidth?: string;
    height?: string;
    minHeight?: string;
    maxHeight?: string;
    margin?: string;
    marginLeft?: string;
    marginRight?: string;
    marginTop?: string;
    marginBottom?: string;
    padding?: string;
    paddingLeft?: string;
    paddingRight?: string;
    paddingTop?: string;
    paddingBottom?: string;
    opacity?: string;
    filter?: string;
    backdropFilter?: string;
    transform?: string;
    transition?: string;
    transitionProperty?: string;
    transitionDuration?: string;
    animation?: string;
    animationName?: string;
    animationDuration?: string;
    animationIterationCount?: 'infinite' | string;
    animationDirection?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse' | string;
    overflow?: 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto' | string;
    overflowX?: 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto' | string;
    overflowY?: 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto' | string;
    zIndex?: string;
    cursor?: 'default' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' | 'crosshair' | 'text' | 'vertical-text' | 'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'grab' | 'grabbing' | 'all-scroll' | 'col-resize' | 'row-resize' | 'n-resize' | 'e-resize' | 's-resize' | 'w-resize' | 'ne-resize' | 'nw-resize' | 'se-resize' | 'sw-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' | 'zoom-in' | 'zoom-out' | 'none' | string;
    userSelect?: 'auto' | 'text' | 'all' | 'none' | string;
    [key: string]: undefined | string;
}

declare class Element {
    static render(tagName: string, attributes?: ElementAttributes, children?: (undefined | Element)[]): string;
    static create(tagName: string, attributes?: ElementAttributes, children?: (undefined | Element)[]): HTMLElement;
    tagName: string;
    attributes: ElementAttributes;
    children: Element[];
    constructor(tagName: string, attributes?: ElementAttributes, children?: (undefined | Element)[]);
    addChild<E extends Element>(element: E): E;
    addChildren(elements: Element[]): void;
    render(): string;
    create(): HTMLElement;
}
interface ElementAttributes {
    id?: string;
    class?: string;
    innerHTML?: string;
    href?: string;
    style?: StyleProperties;
    [key: string]: undefined | number | string | StyleProperties;
}

declare class export_default$5{
    private _attributes;
    createAttribute(name: string, callback: (element: HTMLElement, value: string) => void): void;
    deleteAttribute(name: string): void;
    deleteAllAttributes(): void;
    getAttribute(name: string): undefined | ((element: HTMLElement, value: string) => void);
    checkElementAttributes(element: HTMLElement, attributeName?: string): void;
    checkElementAttributesRecursively(element: HTMLElement): void;
}

declare class export_default$4{
    private _listeners;
    createListener(target: EventTarget, name: string, callback: (...args: any) => any, once?: boolean): string;
    deleteListener(id: string): void;
    deleteAllTimers(): void;
}

declare class export_default$3{
    private _promises;
    handlePromise<T>(promise: Promise<T>): Promise<T>;
    abandonPromise(id: string): void;
    abandonAllPromises(): void;
}

declare class export_default$2{
    private _interval;
    private _timers;
    createTimeout(ms: number, callback: () => any): string;
    createInterval(ms: number, callback: () => any): string;
    createLoop(times: number, ms: number, callback: (count: number) => any, endCallback?: () => any): string;
    deleteTimer(id: string): void;
    deleteAllTimers(): void;
    private _createTimer;
    private _startTimer;
    private _stopTimer;
}

declare class export_default$1{
    static createStyle(content: string, modifier?: string): string;
    static updateStyles(): void;
}

declare class export_default{
    static use(plugin: Plugin): void;
    private _id;
    private _root;
    ListenerManager: export_default$4;
    TimerManager: export_default$2;
    PromiseManager: export_default$3;
    PluginManager: typeof PluginManager;
    AttributeManager: export_default$5;
    StyleManager: typeof export_default$1;
    constructor(root: HTMLElement);
    get id(): string;
    get root(): HTMLElement;
    getElementByID(id: string): null | HTMLElement;
    getElementByClassName(className: string): NodeListOf<HTMLElement>;
    isOwnedByScope(element: HTMLElement): boolean;
    listen(target: EventTarget, name: string, callback: (...args: any) => any, once?: boolean): string;
    deleteListener(id: string): void;
    createTimeout(ms: number, callback: () => any): string;
    createInterval(ms: number, callback: () => any): string;
    createLoop(times: number, ms: number, callback: (count: number) => any, endCallback?: () => any): string;
    deleteTimer(id: string): void;
    handle<T>(promise: Promise<T>): Promise<T>;
    loadHTML(html: string): void;
    remove(): void;
    private _reset;
}

declare class PluginManager {
    static addPlugin<P extends Plugin>(plugin: P): P;
    static removePlugin(id: string): void;
    static initializePlugins(scope: export_default): void;
}
interface Plugin {
    id: string;
    initialize: (scope: export_default) => any;
}

export { export_default$5 as AttributeManager, Element, type ElementAttributes, export_default$4 as ListenerManager, PluginManager, export_default$3 as PromiseManager, export_default as Scope, Style, export_default$2 as TimerManager };
