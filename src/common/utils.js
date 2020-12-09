//防抖函数,对func这个函数进行防抖操作
export function debounce(func, delay) {
  let timer = null
  return function (...args) {
    if(timer) clearTimeout(timer)
    //setTimeout有一个事件循环的概念，加入到下一次执行循环的尾部执行
    timer = setTimeout( () => {
      func.apply(this, args)
    }, delay)
  }
}
