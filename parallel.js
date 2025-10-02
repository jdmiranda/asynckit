var iterate    = require('./lib/iterate.js')
  , initState  = require('./lib/state.js')
  , terminator = require('./lib/terminator.js')
  ;

// Public API
module.exports = parallel;

/**
 * Runs iterator over provided array elements in parallel
 * Optimized: track job count instead of using Object.keys()
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function parallel(list, iterator, callback)
{
  var state = initState(list);
  var jobsCount = 0;

  while (state.index < (state['keyedList'] || list).length)
  {
    jobsCount++;
    iterate(list, iterator, state, function(error, result)
    {
      if (error)
      {
        callback(error, result);
        return;
      }

      jobsCount--;
      // looks like it's the last one
      if (jobsCount === 0)
      {
        callback(null, state.results);
        return;
      }
    });

    state.index++;
  }

  return terminator.bind(state, callback);
}
