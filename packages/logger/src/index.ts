import { format } from 'date-fns';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  err?: Error;
  [key: string]: string | number | string[] | number[] | Error | undefined;
}

const isValidLogLevel = (level: string): level is LogLevel => ['debug', 'info', 'warn', 'error'].includes(level);
const LOG_LEVEL: LogLevel = isValidLogLevel(process.env.LOG_LEVEL || '') ? (process.env.LOG_LEVEL as LogLevel) : 'info';

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Helper to determine if the current log level permits logging
const shouldLog = (level: LogLevel): boolean => LEVELS[level] >= LEVELS[LOG_LEVEL];

// Color codes for each log level
const colors: Record<LogLevel, string> = {
  debug: '\x1b[36m', // Cyan
  info: '\x1b[32m', // Green
  warn: '\x1b[33m', // Yellow
  error: '\x1b[31m', // Red
};

// Prefixes for each log level
const levelPrefixes: Record<LogLevel, string> = {
  debug: '[🐛 DEBUG]',
  info: '[ℹ️ INFO]',
  warn: '[⚠️ WARN]',
  error: '[❌ ERROR]',
};

// Custom date formatter using date-fns
const formatDate = (date: Date) => format(date, 'yyyy-MM-dd HH:mm:ss.SSS');

/**
 * Logs a message at the specified log level with optional additional information.
 *
 * @param level - The severity level of the log message.
 * @param message - The message to log.
 * @param options - Additional options for the log message.
 * @param options.err - An optional error object to include a stack trace for warnings and errors.
 * @param options.[key] - Any additional key-value pairs to include in the log message.
 *
 * The log message will be formatted with a timestamp, log level prefix, and the message.
 * For warnings and errors, a stack trace will be included if provided.
 * Additional options will be appended to the log message.
 * The log message will be output to the appropriate console method based on the log level.
 */
const log = (level: LogLevel, message: string, options: LogOptions = {}) => {
  if (!shouldLog(level)) return;

  const date = formatDate(new Date());
  const color = colors[level];
  const resetColor = '\x1b[0m';
  const prefix = levelPrefixes[level];

  // Base log message
  let logMessage = `${color}[${date}] - ${prefix} - ${message}${resetColor}\n`;

  // Add stack trace for warnings and errors
  if (level === 'warn' || level === 'error') {
    const stack = options.err ? options.err.stack : new Error().stack;
    logMessage += `  stack: ${stack}\n`;
  }

  // Append additional options
  for (const [key, value] of Object.entries(options)) {
    if (key !== 'err') {
      logMessage += `  ${key}: ${JSON.stringify(value)}\n`;
    }
  }

  // Output to the appropriate console method
  switch (level) {
    case 'debug':
      console.debug(logMessage);
      break;
    case 'info':
      console.info(logMessage);
      break;
    case 'warn':
      console.warn(logMessage);
      break;
    case 'error':
      console.error(logMessage);
      break;
  }
};

/**
 * Logs a debug message.
 *
 * @param message - The message to log.
 * @param options - Optional logging options.
 */
export const debug = (message: string, options?: LogOptions) => log('debug', message, options);

/**
 * Logs an info message.
 *
 * @param message - The message to log.
 * @param options - Optional logging options.
 */
export const info = (message: string, options?: LogOptions) => log('info', message, options);

/**
 * Logs a warning message.
 *
 * @param message - The message to log.
 * @param options - Optional logging options.
 */
export const warn = (message: string, options?: LogOptions) => log('warn', message, options);

/**
 * Logs an error message.
 *
 * @param message - The message to log.
 * @param options - Optional logging options.
 */
export const error = (message: string, options?: LogOptions) => log('error', message, options);
