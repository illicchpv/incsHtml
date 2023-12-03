document.addEventListener("DOMContentLoaded", async function () {

  IncludHtml.doIncludAll(
    {
      preload: ["./components/main.html", "./components/products.html", "./components/about.html", "./components/-products.json",],
      insertType: "append",
      incInner: false,
      replace: [
        { from: '../img/', to: './img/' },
      ],
      incFromId: "extId",
      routerParams: routerParams,
    },
    () => { // вызывается когда IncludHtml всё сделал
      // console.log('IncludHtml.doIncludAll отработал')
    }
  );

});

const routerParams = {
  urls: [
    { url: '', hash: '!main', includ_url: './components/main.html#extId', title: 'main page' },
    { url: '!main', hash: '!main', includ_url: './components/main.html#extId', title: 'main page' },
    { url: '!products', hash: '!products', includ_url: './components/products.html#extId', title: 'products page' },
    { url: '!about', hash: '!about', includ_url: './components/about.html#extId', title: 'about page' },
  ],

  // вызывается при изменении url стр.
  hashChangeHandler: (urlObj, pageParams) => { //  ([эемент из urls], pageParams) => {
    console.log('=============hashchangeHandler', 'urlObj:', urlObj, 'pageParams:', pageParams)
    
    // помечаем <a с подходящими текущему urlObj href
    IncludHtml.markSelectedLink(routerParams, urlObj, 'header__nav-item', 'header__nav-item_selected')

    // меняем заголовок стр.
    document.title = urlObj.title
    // замена элементов стр. с классом incs-route
    document.querySelectorAll('.incs-route').forEach((el) => {
      el.innerHTML = ''
      // в результате вызова IncludHtml.doInsertInto
      // в main добавляются элемены прописанные в его атрибуте data-incs='{ "incFile": "./inc/main.html#extId" }'
      //  т.е. содержимым ./inc/main.html с id="extId"
      IncludHtml.doInsertInto(
        el,
        () => { // 👍 IncludHtml.doInsertInto Finish: Ok
          // console.log("👍 IncludHtml.doInsertInto Finish: Ok");
        }
      )
    })
  },

  // вызывается при изменении параметров в url стр. вызывается до hashChangeHandler
  paramChangeHandler: (urlObj, pageParams) => { //  (routePage, pageParams)
    console.log('=============paramChangeHandler', 'urlObj:', urlObj, 'pageParams:', pageParams)
    routerParams.hashChangeHandler(urlObj, pageParams)
  },

  // вызывается при локальных переходах по якорям стр
  localLinkHandler: (urlObj, pageParams, link) => { //  (routePage, pageParams, link) 
    console.log('=============localLinkHandler', 'urlObj:', urlObj, 'pageParams:', pageParams, 'link:', link)
  },
}
