import { mapCallback, mapPromise, mapWithAbort } from './map.js';

const data = [10, 20, 30];

function multiplyCb(item, index, cb) {
  setTimeout(function() { cb(null, item * 2); }, 100);
}

console.log('--- 1. Callback Version ---');
mapCallback(data, multiplyCb, function(err, results) {
  if (err) console.error('Error:', err);
  else console.log('Callback result:', results);
});

function multiplyPromise(item, index) {
  return new Promise(function(resolve) {
    setTimeout(function() { resolve(item * 3); }, 150);
  });
}

async function runPromiseDemo() {
  console.log('\n--- 2. Promise Version ---');
  try {
    const results = await mapPromise(data, multiplyPromise);
    console.log('Promise result:', results);
  } catch (err) {
    console.error('Error:', err);
  }
}

setTimeout(runPromiseDemo, 200);

async function runAbortDemo() {
  console.log('\n--- 3. AbortController Version ---');
  
  const controller = new AbortController();
  
  setTimeout(function() {
    controller.abort();
  }, 30);

  try {
    const results = await mapWithAbort(
      [100, 200], 
      function(item, index, sig) {
        return new Promise(function(resolve, reject) {
          if (sig && sig.aborted) {
            return reject(new Error('AbortError'));
          }

          const timer = setTimeout(function() {
            if (sig) sig.removeEventListener('abort', onAbort);
            resolve(item + 50);
          }, 100);

          function onAbort() {
            clearTimeout(timer); 
            reject(new Error('AbortError'));
          }

          if (sig) {
            sig.addEventListener('abort', onAbort);
          }
        });
      }, 
      controller.signal
    );
    console.log('Abort result:', results);
  } catch (err) {
    console.log('Abort triggered:', err.message); 
  }
}

setTimeout(runAbortDemo, 500);