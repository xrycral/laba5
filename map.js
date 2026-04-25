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
    const promises = array.map(function(item) {
      return asyncFn(item); 
    });

    Promise.all(promises)
      .then(function(results) {
        resolve(results);
      })
      .catch(function(error) {
        reject(error);
      });
  });
}