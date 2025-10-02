var defer = require('./defer.js');

// API
module.exports = async;

/**
 * Runs provided callback asynchronously
 * even if callback itself is not
 * Optimized: reduced defer calls by using single flag check
 *
 * @param   {function} callback - callback to invoke
 * @returns {function} - augmented callback
 */
function async(callback)
{
  var isAsync = false;
  var pending = false;
  var pendingErr;
  var pendingResult;

  // check if async happened
  defer(function() {
    isAsync = true;
    // if callback was called synchronously, invoke it now
    if (pending)
    {
      callback(pendingErr, pendingResult);
    }
  });

  return function async_callback(err, result)
  {
    if (isAsync)
    {
      callback(err, result);
    }
    else
    {
      // store values to avoid another defer call
      pending = true;
      pendingErr = err;
      pendingResult = result;
    }
  };
}
