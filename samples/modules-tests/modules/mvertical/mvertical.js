var mvertical = (() => {
  const moduleName = 'mvertical'

  // эта часть отвечает за создание и работу порождаемых экземпляров объектов 
  const istances = {}
  const createInstance = (instanceName) => {
    if (istances[instanceName]) throw new Error(`mvertical.instance '${instanceName}' already exist!`)

    const ins = {
      iname: instanceName,
      jsonUrl: '',
      jsonArray: [1,2,3],
      loadingStatus: 'free',
      // ----------------------------------------------
      constructor() {
        this.iEl = document.querySelector(`.${moduleName}.${this.iname}`)
        this.fetch()
      },
      render() {
        this.iEl.querySelector('.instance').innerHTML = this.iname
        this.iEl.querySelector('.jsonUrl').innerHTML = this.jsonUrl
        this.iEl.querySelector('.loadingStatus').innerHTML = this.loadingStatus
        const h = this.jsonArray.reduce((acc, el) => acc+=`<i>${el}</i>`, "")
        this.iEl.querySelector('.box').innerHTML = h
        return this
      },
      fetch(){
        this.jsonArray = []
        this.loadingStatus += ', loading'
        this.render()
        fetch(this.jsonUrl)
          .then(response => {
            this.loadingStatus += (response.ok ? ', ok': ', error')
            this.render()
            return response.json()
          })
          .then(response => {
            this.loadingStatus += ', ready'
            this.jsonArray = response
            this.render()
          })
      },
      getData(switch01){
        const arr = this.jsonArray.filter((v,i) => {
          if(switch01 === 0){
            return i % 2 === 0
          } else {
            return i % 2 !== 0
          }
        })
        return arr
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
    // console.log('inst: ', inst);

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
// console.log('++++ mvertical: ', mvertical);
