const types = {
  info: 'Info',
  success: 'Success',
  warn: 'Warn',
  error: 'Error',
  debug: 'Debug'
}

export default class Log {
  static info(...content: any[]): void {
    this.log('info', ...content)
  }

  static success(...content: any[]): void {
    this.log('success', ...content)
  }

  static warn(...content: any[]): void {
    this.log('warn', ...content)
  }

  static error(...content: any[]): void {
    this.log('error', ...content)
  }

  static debug(...content: any[]): void {
    this.log('debug', ...content)
  }

  private static log(type: keyof typeof types, ...content: any[]): void {
    if (process.env.DEV === 'true' && type === 'debug') {
      const stack = new Error().stack?.split('\n')[3].trim()
      const location = stack ? stack.substring(stack.indexOf('(') + 1, stack.indexOf(')')) : 'unknown location'
      console.log(`[${types[type]}] ${this.datetime()} [${location}]:`, ...content)
    } else {
      console.log(`[${types[type]}] ${this.datetime()}:`, ...content)
    }
  }

  private static datetime(): string {
    const date = new Date()
    // YYYY-MM-DD HH:MM:SS
    return date.toISOString().replace('T', ' ').replace('Z', '').slice(0, 19)
  }
}
