const componentsUrl = "https://aclive.ru/Methed-lib/template-list/"
const jsonUrl = (componentsUrl + "cardList.json").toLowerCase()

document.addEventListener("DOMContentLoaded", async function () {

  IncludHtml.doIncludAll(
    {
      preload: ["https://aclive.ru/Methed-lib/template-list/card.html", jsonUrl],
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

