var parallel  = require('./parallel.js');

// Public API
module.exports = batch;

/**
 * Runs iterator over provided array elements in batches
 * Optimized: batch processing to reduce overhead
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {number} batchSize - number of items to process in each batch
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 */
function batch(list, batchSize, iterator, callback)
{
  // handle case where batchSize is not provided
  if (typeof batchSize === 'function')
  {
    callback = iterator;
    iterator = batchSize;
    batchSize = 10; // default batch size
  }

  var isArray = Array.isArray(list);
  var items = isArray ? list : Object.keys(list);
  var results = isArray ? [] : {};
  var batches = [];

  // create batches
  for (var i = 0; i < items.length; i += batchSize)
  {
    var batchItems = items.slice(i, i + batchSize);
    batches.push(batchItems);
  }

  var batchIndex = 0;

  /**
   * Process a single batch of items
   *
   * @param   {array} currentBatch - batch items to process
   * @param   {function} batchCallback - callback when batch is done
   */
  function processBatch(currentBatch, batchCallback)
  {
    var batchList = isArray ? currentBatch : currentBatch.reduce(function(obj, key)
    {
      obj[key] = list[key];
      return obj;
    }, {});

    parallel(batchList, iterator, function(error, batchResults)
    {
      if (error)
      {
        batchCallback(error);
        return;
      }

      // merge results
      if (isArray)
      {
        results = results.concat(batchResults);
      }
      else
      {
        Object.keys(batchResults).forEach(function(key)
        {
          results[key] = batchResults[key];
        });
      }

      batchCallback(null);
    });
  }

  /**
   * Process the next batch in sequence
   */
  function processNextBatch()
  {
    if (batchIndex >= batches.length)
    {
      callback(null, results);
      return;
    }

    var currentBatch = batches[batchIndex];
    batchIndex++;

    processBatch(currentBatch, function(error)
    {
      if (error)
      {
        callback(error, results);
        return;
      }

      processNextBatch();
    });
  }

  processNextBatch();
}
