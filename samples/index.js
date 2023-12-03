document.addEventListener("DOMContentLoaded", async function () {

  IncludHtml.doIncludAll(
    {
      insertType: "replace",
      incInner: true,
      replace: [
        { from: '../img/', to: './img/' },
      ],
      incFromId: "extId",
    },
    () => { // вызывается когда IncludHtml всё сделал
      // console.log('IncludHtml отработал')
    }
  );

});