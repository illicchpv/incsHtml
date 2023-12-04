document.addEventListener("DOMContentLoaded", async function () {

  IncludHtml.doIncludAll(
    { // defProps  , "./components/-products.json"
      preload: ["./components/main.html", "./components/products.html", "./components/about.html",],
      insertType: "append",
      incInner: false,
      replace: [
        { from: '../img/', to: './img/' },
      ],
      incFromId: "extId",
      routerParams: routerParams,
    },
    (defProps) => { // вызывается когда IncludHtml.doIncludAll всё сделал 
      // console.log('IncludHtml.doIncludAll отработал')
    }
  );

});

const routerParams = {
  urls: [
    { url: '', hash: '!main', includ_url: './components/main.html#extId', title: 'main page' },
    { url: '!main', hash: '!main', includ_url: './components/main.html#extId', title: 'main page' },
    { url: '!products', hash: '!products', includ_url: './components/products.html#extId', title: 'products page' },
    { url: '!about', hash: '!about/1', includ_url: './components/about.html#extId', title: 'about page' },
    { url: '!about/1', hash: '!about/1', includ_url: './components/about.html#extId', title: 'about page' },
    { url: '!about/2', hash: '!about/2', includ_url: './components/about.html#extId', title: 'about page' },
    { url: '!about/3', hash: '!about/3', includ_url: './components/about.html#extId', title: 'about page' },
  ],

  // вызывается при изменении url стр.
  hashChangeHandler: (urls, urlObj, pageParams) => { //  (urlObj - [эемент из urls], pageParams) => {
    console.log('=============hashchangeHandler', 'urlObj:', urlObj, 'pageParams:', pageParams)
    { // отрисовка нового варианта стр.

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
          (defProps) => {  // вызывается когда IncludHtml.doInsertInto всё сделал
            // console.log("👍 IncludHtml.doInsertInto Finish: Ok");
          }
        )
      })

      // помечаем <a с подходящими текущему urlObj href
      // console.log("помечаем <a с подходящими текущему urlObj href");
      IncludHtml.markSelectedLink(urls, urlObj, 'nav-item', 'nav-item_selected')
    }
  },

  // // вызывается при изменении параметров в url стр. вызывается до hashChangeHandler
  // paramChangeHandler: (urls, urlObj, pageParams) => { //  (routePage, pageParams)
  //   console.log('=============paramChangeHandler', 'urlObj:', urlObj, 'pageParams:', pageParams)
  // },

  // вызывается при локальных переходах по якорям стр
  localLinkHandler: (urls, urlObj, pageParams, link) => { //  (routePage, pageParams, link) 
    console.log('=============localLinkHandler', 'urlObj:', urlObj, 'pageParams:', pageParams, 'link:', link)
  },
}
