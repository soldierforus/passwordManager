function doWork(){
  throw new Error('Unable to do work');
}

try {
  doWork();
} catch (e) {
  console.log('something went wrong' + '\n'+ e);
} finally {
  console.log('finally')
}

console.log('try catch ended');
