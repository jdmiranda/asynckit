// API
module.exports = createCache;

/**
 * Creates a simple LRU cache for iterator results
 * Optimized: cache frequently accessed iterator results
 *
 * @param   {number} maxSize - maximum cache size
 * @returns {object} - cache object with get/set methods
 */
function createCache(maxSize)
{
  maxSize = maxSize || 100;
  var cache = {};
  var keys = [];

  return {
    get: function(key)
    {
      return cache[key];
    },
    set: function(key, value)
    {
      if (!(key in cache) && keys.length >= maxSize)
      {
        // Remove oldest entry
        var oldKey = keys.shift();
        delete cache[oldKey];
      }

      if (!(key in cache))
      {
        keys.push(key);
      }

      cache[key] = value;
    },
    has: function(key)
    {
      return key in cache;
    },
    clear: function()
    {
      cache = {};
      keys = [];
    }
  };
}
