const types = {
  info: 'Info',
  success: 'Success',
  warn: 'Warn',
  error: 'Error',
  debug: 'Debug'
}

export default class Log {
  /**
   * Log an info message to the console
   * @param content Content to log
   */
  static info(...content: any[]): void {
    this.log('info', ...content)
  }

  /**
   * Log a success message to the console
   * @param content Content to log
   */
  static success(...content: any[]): void {
    this.log('success', ...content)
  }

  /**
   * Log a warning message to the console
   * @param content Content to log
   */
  static warn(...content: any[]): void {
    this.log('warn', ...content)
  }

  /**
   * Log an error message to the console
   * @param content Content to log
   */
  static error(...content: any[]): void {
    this.log('error', ...content)
  }

  /**
   * Log a debug message to the console
   * @param content Content to log
   */
  static debug(...content: any[]): void {
    this.log('debug', ...content)
  }

  /**
   * Log a message to the console
   * @param type The type of message to log
   * @param content The content to log
   */
  private static log(type: keyof typeof types, ...content: any[]): void {
    if (process.env.NODE_ENV === 'development' && type === 'debug') {
      const stack = new Error().stack?.split('\n')[3].trim()
      const location = stack ? stack.substring(stack.indexOf('(') + 1, stack.indexOf(')')) : 'unknown location'
      console.log(`[${types[type]}] ${this.datetime()} [${location}]:`, ...content)
    } else {
      console.log(`[${types[type]}] ${this.datetime()}:`, ...content)
    }
  }

  /**
   * Get the current datetime
   * @returns Current datetime in the format of YYYY-MM-DD HH:MM:SS
   */
  private static datetime(): string {
    const date = new Date()
    // YYYY-MM-DD HH:MM:SS
    return date.toISOString().replace('T', ' ').replace('Z', '').slice(0, 19)
  }
}
