var mintegrationVH = (() => {
  const moduleName = 'mintegrationVH'

  // эта часть отвечает за создание и работу порождаемых экземпляров объектов 
  const istances = {}
  const createInstance = (instanceName) => {
    if (istances[instanceName]) throw new Error(`mintegrationVH.instance '${instanceName}' already exist!`)

    const ins = {
      iname: instanceName,
      moduleInstancesList: [],
      switchPosition: 1,
      jsonArrayList: [],
      // ----------------------------------------------
      constructor() {
        this.iEl = document.querySelector(`.${moduleName}.${this.iname}`)
        // console.log('moduleInstancesList: ', this.moduleInstancesList);
        // this.switchPosition
        // setTimeout(()=> {this.toggleSwitch(true)}, 10*1000)
        this.doWaitInstances()
      },
      // <about doWaitInstances
      rcountCnt: 0,
      moduleInstancesReady: false,
      doWaitTimeStart: 0,
      doWaitMaxDelta: 3*1000,
      doWaitInstances(){
        // console.log('doWaitInstances');
        this.doWaitTimeStart = Date.now()
        const cbFunc = this.getData.bind(this)
        this._waitInstances(this, cbFunc)
      },
      _waitInstances(_this, cbFunc){
        cbFunc.bind(_this)
        // console.log('this.moduleInstancesReady: ', _this.moduleInstancesReady);
        const rcount = () => {
          _this.rcountCnt++
          // console.log('----------rcount() ', _this.rcountCnt);
          for(let el of _this.moduleInstancesList){
            const inst = el.m.getInstance(el.i)
            if(!inst) {
              // console.log('wait: !inst: ', !inst);
              setTimeout(_this._waitInstances, 20, _this, cbFunc)
              return
            }
            if(inst.jsonArray.length === 0){
              // console.log('wait: inst.jsonArray.length: ', inst.jsonArray.length);
              setTimeout(_this._waitInstances, 20, _this, cbFunc)
              return
            }
            if(_this.doWaitMaxDelta < (Date.now() - _this.doWaitTimeStart)){
              console.error('Превышено время ожидания готовности модулей из moduleInstancesList!', _this.doWaitMaxDelta/1000, 'сек');
              break
            }
            // console.log('ожидаем : ', (Date.now() - _this.doWaitTimeStart)/1000, 'сек');
          }
          _this.moduleInstancesReady = true
        }
        rcount()
        if(!_this.moduleInstancesReady) return
        // console.log('==================rcount: ', _this.rcountCnt);
        if(cbFunc) cbFunc()
      },
      // </about doWaitInstances
      render() {
        this.iEl.querySelector('.instance').innerHTML = this.iname

        if(!this.switchPosition){
          this.iEl.querySelector('.odd0 .switch-input').removeAttribute('checked') 
          this.iEl.querySelector('.odd1 .switch-input').setAttribute('checked', '')        
          // this.iEl.querySelector('.toggleBlock__text').innerHTML = 'получить четные значения'       
        }else{
          this.iEl.querySelector('.odd1 .switch-input').removeAttribute('checked')        
          this.iEl.querySelector('.odd0 .switch-input').setAttribute('checked', '')        
          // this.iEl.querySelector('.toggleBlock__text').innerHTML = 'получить нечетные значения'       
        }
        const templ1 = `
        <div class="rez__line">
          <i>(module1.inst1)</i>
          <i class="rez__lineValues">(vals)</i>
        </div>
        `
        const templ2 = '<b>(v)</b>'

        const $rez = this.iEl.querySelector('.rez')
        let hh = `<span>${this.switchPosition? 'четные' : 'нечетные'} результаты: </span>`
        $rez.innerHTML = hh
        this.jsonArrayList.forEach((el,ii) => {
          let h = templ1.replaceAll('(module1.inst1)', el.name)
          // console.log('el.name: ', el.dt);
          let h2 = ''
          el.dt.forEach((el, i) => {
            h2 += templ2.replace(`(v)`, el)
          })
          if(el.dt.length === 0){
            h2 += templ2.replace(`(v)`, 'нет данных')
          }
          h = h.replace(`(vals)`, h2)

          hh += h
        })
        $rez.innerHTML = hh
        return this
      },
      toggleSwitch(notSwitch){
        if(!notSwitch) this.switchPosition = this.switchPosition === 0 ? 1 : 0
        this.getData()
      },
      getData(){
        this.jsonArrayList = []
        this.moduleInstancesList.forEach(el => {
          // console.log('el.m.moduleName: ', el.m.moduleName);
          const inst = el.m.getInstance(el.i)
          if(!inst) {
            console.log('!inst: ', !inst);
            return
          }
          const dt = inst.getData(this.switchPosition)
          // console.log('moduleName.instance: ', `${el.m.moduleName}.${el.i}`, dt);
          this.jsonArrayList.push({name:`${el.m.moduleName}.${el.i}`, dt: dt})
        });
        // console.log('jsonArrayList: ', this.jsonArrayList);
        this.render()
      }
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
// console.log('++++ mintegrationVH: ', mintegrationVH);
