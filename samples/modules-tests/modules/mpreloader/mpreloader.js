var mpreloader = (() => {
  const moduleName = 'mpreloader'

  // эта часть отвечает за создание и работу порождаемых экземпляров объектов 
  const istances = {}
  const createInstance = (instanceName) => {
    if (istances[instanceName]) throw new Error(`mpreloader.instance '${instanceName}' already exist!`)

    const ins = {
      iname: instanceName,
      showSelectorOnRender: undefined,
      hideSelectorOnRender: undefined,
      // ----------------------------------------------
      constructor() {
        this.iEl = document.querySelector(`.${moduleName}.${this.iname}`)
      },
      render() {
        // debugger
        this.iEl.querySelector('.instance').innerHTML = this.iname
        if(this.showSelectorOnRender) {
          this.showSelectorOnRender.split(';').forEach(el => {
            if(!el) return
            document.querySelectorAll(el).forEach(el2 =>{ 
              el2.style.display = 'block'; 
              el2.style.opacity = 1; 
            })
          })
        }
        if(this.hideSelectorOnRender) 
          document.querySelectorAll(this.hideSelectorOnRender).forEach(el => {
            el.style.display = 'none'
          })
        return this
      },
      // ----------------------------------------------
    }
    istances[instanceName] = ins

    setTimeout(function (ins) { ins.constructor() }, 0, ins)
    return ins
  }
  const getInstance = (instanceName) => {
    return istances[instanceName]
  }
  const getModuleInstance = (el) => {
    const inst = istances[el.closest('.' + moduleName).dataset.instance]
    return inst
  }
  const renderAllInstance = () => {
    for (const [key, value] of Object.entries(istances)) {
      value.render() // render all module2 instances
    }
  }
  const scanAllInstance = (cbFunc) => {
    for (const [key, value] of Object.entries(istances)) {
      cbFunc(value)
    }
  }

  { //ВНИМАНИЕ! этот ОБЯЗАТЕЛЬНЫЙ кусок надо вставить перед return
    const __el = __modulesList.find(el => el.name === moduleName)
    if (__el) setTimeout(function (__el) { __modulesLoader.continueLoad(__el) }, 1, __el)
    const r = { // тут перечисляются функции и свойства модуля которые будут доступные из вне.
      moduleName,

      createInstance,
      getInstance,
      renderAllInstance,
      getModuleInstance,
      scanAllInstance,
    }
    const m = __modulesList.find(el => el.name === moduleName)
    if(m) {m.module = r} else { throw new Error(`Ошибка в модуле: ${moduleName}`)}
    return r
  }
})()
