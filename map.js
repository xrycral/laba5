export function mapCallback(array, asyncFn, finalCallback) {
  if (array.length === 0) {
    return finalCallback(null, []);
  }

  const results = [];
  let completed = 0;

  for (let i = 0; i < array.length; i++) {
    asyncFn(array[i], i, function(err, result) {
      if (err) {
        console.log("Debug: caught error");
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