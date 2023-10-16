// IncludHtml.js
let IncludHtml = (function () {
  let _incsRoot = "./inc";
  let _incs_count = 0;
  let _finish_callback = false;

  function replaceAll(src, search, replace) {
    return src.split(search).join(replace);
  }
  function _remove() {
    if (_finish_callback && --_incs_count <= 0) {
      _finish_callback();
    }
  }

  /*
  function init(incsRoot = "./inc", doProcessAll = true, finish_callback = false ) {
    _incsRoot = incsRoot;
    _finish_callback = finish_callback;
    if(doProcessAll)
      processAll()
  }
  function process(pparams) {
    const cb = pparams.docEl.dataset.incs__calback;
    if (cb) {
      const h = eval(`(p)=>{ ${cb}(p); }`);
      try {
        h(pparams);
      } catch (e) {
        console.warn("catch error in call " + cb + "(pprops)", e);
      }
    }
    pparams.docEl.replaceWith(pparams.externEl);
    _remove(pparams.docEl);
  }
  function processAll(container = document) {
    const incs = container.querySelectorAll(".incs");
    _incs_count = incs.length;
    if (_finish_callback && _incs_count <= 0) {
      _finish_callback();
      return;
    }
    incs.forEach((el) => {
      // console.log("IncludHtml: className:", el.className, el);
      let incId = false,
        incClass = false,
        incFrom = false;
      el.classList.forEach((cl) => {
        if (!incId && cl.startsWith("incId_")) {
          incId = cl;
        }
        if (!incClass && cl.startsWith("incClass_")) {
          incClass = cl.substring(9);
        }
        if (!incFrom && cl.startsWith("incFrom_")) {
          incFrom = cl.substring(8);
        }
      });
      // pparams = { incId,incFrom,incClass,docEl,externEl,externUrl}
      const pparams = {
        incId: incId,
        incFrom: incFrom,
        incClass: incClass,
        docEl: el,
        externEl: null,
        externUrl: null,
      };
      if (incClass) {
        if (!incFrom) {
          const docElement = document.querySelector("." + incClass);
          if (docElement) {
            const externEl = docElement.cloneNode(true);
            externEl.classList.remove(incClass);
            pparams.externEl = externEl;
            process(pparams);
          } else {
            console.error("IncludHtml - не найден элемент с указанным классом:", incClass);
            _remove(el);
          }
        } else {
          const url = (_incsRoot + "/" + incFrom).replace("//", "/") + ".inc.html";
          // console.log("url:", url);
          pparams.externUrl = url;
          fetch(url)
            .then((response) => {
              if (response.ok) {
                return response.text();
              }
              return _remove(el);
            })
            .then((data) => {
              if (data) {
                const parser = new DOMParser(),
                  content = "text/html",
                  DOM = parser.parseFromString(data, content);
                const externEl = DOM.body.querySelector('.'+pparams.incClass);
                if (externEl) {
                  externEl.classList.remove(pparams.incClass);
                  pparams.externEl = externEl;
                  process(pparams);
                } else {
                  console.error("Не найден элемент с классом - " + pparams.incClass + "\r\nВ файле: ", url);
                  _remove(el);
                }
              }
            })
            .catch((error) => {
              console.error("Fetch error: ", error);
            });
        }
      } else {
        console.error("IncludHtml - отсутствует класс incClass_???. ");
        _remove(el);
      }
    });
  }
  */

  function doIncludAll( selector, finish_callback = false){
    _finish_callback = finish_callback;
    const incs = document.querySelectorAll(selector);
    _incs_count = incs.length;
    if (_finish_callback && _incs_count <= 0) {
      _finish_callback();
      return;
    }
    
    incs.forEach((el) => {
      let params = el.dataset.incs
      if(!params){
        console.error("IncludHtml - нет json параметров");
        _remove(el);
        return
      }
      try{
        params = JSON.parse(params)
      }catch(e){
        console.error(e)
      }
      let errSt = !params;
      errSt = errSt || !params.incFromId
      if(!errSt){
        // params.incFromId
        // params.incFile
        // params.onLoadCalback
        params.docEl = el
        params.extEl = null
        params.extUrl = null
        if(!params.incFile){ // вставка элемента из текущего документа
          const docElement = document.getElementById(params.incFromId);
          if (docElement) {
            const extEl = docElement.cloneNode(true);
            extEl.removeAttribute('id');
            params.extEl = extEl
            doProcess(params);
          } else {
            console.error("IncludHtml - не найден элемент с указанным id:", params.incFromId);
            _remove(el);
          }
        } else {  // вставка элемента из документа внешнего html файла
          const url = params.incFile
          if(!url){
            console.error("IncludHtml - не задана extUrl");
            _remove(el);
            return
          }
          fetch(url)
            .then((response) => {
              if (response.ok) {
                return response.text();
              }
              return _remove(el);
            })
            .then((data) => {
              if (data) {
                const parser = new DOMParser(),
                  content = "text/html",
                  DOM = parser.parseFromString(data, content);
                const extEl = DOM.getElementById(params.incFromId); // DOM.body.querySelector('.'+pparams.incClass);
                if (extEl) {
                  extEl.removeAttribute('id');
                  params.extEl = extEl
                  doProcess(params);
                } else {
                  console.error("Не найден элемент с id: " + params.incFromId + "\r\nВ файле: ", url);
                  _remove(el);
                }
              }
            })
            .catch((error) => {
              console.error("Fetch error: ", error);
            })
          ;
        }
      }
    });
  }
  function doProcess(params) {
    const cb = params.onLoadCalback
    if (cb) {
      const handler = eval(`(p)=>{ ${cb}(p); }`);
      try {
        handler(params);
      } catch (e) {
        console.warn("catch error in call " + cb + "(params)", e);
      }
    }
    // debugger
    if(params.incInner){
      params.docEl.outerHTML = params.extEl.innerHTML;
    }else{
      params.docEl.replaceWith(params.extEl);
    }
    _remove(params.docEl);
  }

  return {
    replaceAll,
    doIncludAll,
  };
})();
