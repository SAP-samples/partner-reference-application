//---------------------------------------------------------------
// Logger to mock the console log
//---------------------------------------------------------------

const _deepCopy = (arg) => {
  if (Buffer.isBuffer(arg)) {
    return Buffer.from(arg);
  }
  if (Array.isArray(arg)) {
    return _deepCopyArray(arg);
  }

  if (typeof arg === 'object') {
    return _deepCopyObject(arg);
  }
  return arg;
};

const _deepCopyArray = (arr) => {
  if (!arr) {
    return arr;
  }
  const clone = [];
  for (const item of arr) {
    clone.push(_deepCopy(item));
  }
  return clone;
};

const _deepCopyObject = (obj) => {
  if (!obj) {
    return obj;
  }
  const clone = {};
  for (const key in obj) {
    clone[key] = _deepCopy(obj[key]);
  }
  return clone;
};

const deepCopy = (data) => {
  if (Array.isArray(data)) {
    return _deepCopyArray(data);
  }
  return _deepCopyObject(data);
};

module.exports = (levels = {}) => {
  const _logs = {};

  const _push = (level, ...args) => {
    if (args.length > 1 || typeof args[0] !== 'object') {
      return _logs[level].push(...args);
    }
    const copy = deepCopy(args[0]);
    if (args[0].message) {
      copy.message = args[0].message;
    }
    _logs[level].push(copy);
  };

  const fn = () => {
    return {
      trace: (...args) => _push('trace', ...args),
      debug: (...args) => _push('debug', ...args),
      log: (...args) => _push('log', ...args),
      info: (...args) => _push('info', ...args),
      warn: (...args) => _push('warn', ...args),
      error: (...args) => _push('error', ...args),
      _trace: levels.trace || false,
      _debug: levels.debug || false,
      _info: levels.info || false,
      _warn: levels.warn || false,
      _error: levels.error || false
    };
  };

  fn._logs = _logs;
  fn._resetLogs = () => {
    _logs.trace = [];
    _logs.debug = [];
    _logs.log = [];
    _logs.info = [];
    _logs.warn = [];
    _logs.error = [];
  };

  fn._resetLogs();

  return fn;
};
