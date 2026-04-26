class AbortError extends Error {
  constructor(message = 'Operation was aborted') {
    super(message);
    this.name = 'AbortError';
  }
}

export function mapCallback(array, asyncFn, finalCallback) {
  if (array.length === 0) {
    return finalCallback(null, []);
  }

  const results = [];
  let completed = 0;
  let hasError = false;

  for (let i = 0; i < array.length; i++) {
    asyncFn(array[i], i, function(err, result) {
      if (hasError) return;

      if (err) {
        hasError = true;
        finalCallback(err);
        return;
      }
      
      results[i] = result;
      completed++;
      
      if (completed === array.length) {
        finalCallback(null, results);
      }
    });
  }
}

export function mapPromise(array, asyncFn) {
  return new Promise(function(resolve, reject) {
    const promises = array.map(function(item, index) {
      return asyncFn(item, index); 
    });

    Promise.all(promises).then(resolve).catch(reject);
  });
}

export function mapWithAbort(array, asyncFn, signal) {
  return new Promise(function(resolve, reject) {
    if (signal && signal.aborted) {
      return reject(new AbortError('Aborted before start'));
    }

    function onAbort() {
      reject(new AbortError('Operation aborted by user'));
    }

    if (signal) {
      signal.addEventListener('abort', onAbort);
    }

    const promises = array.map(function(item, index) {
      return asyncFn(item, index, signal).then(function(result) {
        if (signal && signal.aborted) {
          throw new AbortError('Operation was aborted');
        }
        return result;
      });
    });

    Promise.all(promises)
      .then(function(results) {
        if (signal) signal.removeEventListener('abort', onAbort);
        resolve(results);
      })
      .catch(function(error) {
        if (signal) signal.removeEventListener('abort', onAbort);
        reject(error);
      });
  });
}