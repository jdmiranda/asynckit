// Cache the best defer method to avoid repeated checks
var cachedDefer = typeof setImmediate == 'function'
  ? setImmediate
  : (
    typeof process == 'object' && typeof process.nextTick == 'function'
    ? process.nextTick
    : null
  );

module.exports = defer;

/**
 * Runs provided function on next iteration of the event loop
 * Optimized: defer method is cached at module load time
 *
 * @param {function} fn - function to run
 */
function defer(fn)
{
  if (cachedDefer)
  {
    cachedDefer(fn);
  }
  else
  {
    setTimeout(fn, 0);
  }
}
