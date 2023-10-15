// IncludHtml.js
let IncludHtml = (function () {
  let _incsRoot = "./inc";
  let _incs_count = 0;
  let _finish_callback = false;

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
    remove(pparams.docEl);
  }
  function remove() {
    if (_finish_callback && --_incs_count <= 0) {
      _finish_callback();
    }
  }
  function replaceAll(src, search, replace) {
    return src.split(search).join(replace);
  }
  function processAll(container = document) {
    const incs = container.querySelectorAll(".incs");
    _incs_count = incs.length;
    if (_finish_callback && _incs_count <= 0) {
      _finish_callback();
      return;
    }
    incs.forEach((el) => {
      // log("IncludHtml: className:", el.className, el);
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
            err("IncludHtml - не найден элемент с указанным классом:", incClass);
            remove(el);
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
              return remove(el);
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
                  remove(el);
                }
              }
            })
            .catch((error) => {
              console.error("Fetch error: ", error);
            });
        }
      } else {
        err("IncludHtml - отсутствует класс incClass_???. ");
        remove(el);
      }
    });
  }

  return {
    init,
    processAll,
    replaceAll,
  };
})();
