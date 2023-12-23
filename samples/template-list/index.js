document.addEventListener("DOMContentLoaded", async function () {

  IncludHtml.doIncludAll(
    {
      preload: ["./components/card.html", "./components/cardList.json"],
      replace: [ { from: '../img/', to: './img/' }, ],
    },
    (defProps) => { // вызывается когда IncludHtml.doIncludAll всё сделал 
      console.log('IncludHtml.doIncludAll отработал')
    }
  );
  // incFromId: "extId", // default
  // insertType: "append", "prepend", "replace", // "replace" - default
  // incInner: true, // true - default, false - из from берётся outerHTML

});  

