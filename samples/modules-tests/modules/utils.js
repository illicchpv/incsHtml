function stringToDomElement(str){
  let doc = new DOMParser().parseFromString(str, "text/xml");
  return doc.firstChild 
}

function getRndIntInclusive(n, m, lg){
  const min = Math.min(n,m)
  const max = Math.max(n,m)
  let r = Math.round(Math.random()*(max - min) + min)
  if(lg)
    console.log('r: ', r, min, max);
  return r
}
/* debounce
Usage sample:
const handleMouseMove = debounce((mouseEvent) => {  // Do stuff with the event!}, 250);
   document.addEventListener('mousemove', handleMouseMove);    // Add listener
   document.removeEventListener('mousemove', handleMouseMove); // Remove listener
*/
function debounce(callback, wait) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(this, arguments), wait);
  };
}
// const debounce = (callback, wait) => {
//   let timeoutId;
//   return (...args) => {
//     window.clearTimeout(timeoutId);
//     timeoutId = window.setTimeout(() => {
//       callback(...args);
//     }, wait);
//   };
// }
