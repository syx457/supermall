import Toast from './Toast'

const obj ={}

obj.install = function (Vue) {
  //1.创建组件构造器
  const toastContrustor = Vue.extend(Toast)

  //2.new的方式，根据组件构造器，创建一个对象
  const toast = new toastContrustor

  //3.将组件对象，手动的挂载到某一个元素上
  toast.$mount(document.createElement('div'))

  //4.给toast.$el对应的就是div
  document.body.appendChild(toast.$el)

  //5.在vue原型上添加toast，其他就可以访问到了
  Vue.prototype.$toast = toast;
}

export default obj
