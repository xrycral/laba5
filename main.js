import { mapCallback, mapPromise } from './map.js';

const data = [10, 20, 30];
function multiplyCb(item, index, cb) {
  setTimeout(function() {
    cb(null, item * 2);
  }, 100);
}

console.log('--- 1. Callback Version ---');
mapCallback(data, multiplyCb, function(err, results) {
  if (err) console.error('Error:', err);
  else console.log('Callback result:', results);
});

function multiplyPromise(item, index) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(item * 3);
    }, 150);
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