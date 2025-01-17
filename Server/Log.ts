export default class Log {
  static info(...content: any[]): void {
    console.log('[Info]:', ...content)
  }

  static success(...content: any[]): void {
    console.log('[Success]:', ...content)
  }

  static warn(...content: any[]): void {
    console.log('[Warn]:', ...content)
  }

  static error(...content: any[]): void {
    console.log('[Error]:', ...content)
  }

  static debug(...content: any[]): void {
    console.log('[Debug]:', ...content)
  }
}
