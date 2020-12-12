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

// 时间格式化函数
export function formatDate(date, fmt) {
  //1.获取年份
  //y+,表示一个或者多个,用户传的y的个数不同
  //y*,表示0个或者多个
  //y?,表示0个或者1个
  //test 方法检查字符串是否与给出的正则表达式模式相匹配，如果是则返回 true，否则就返回 false。
  if (/(y+)/.test(fmt)) {
    //RegExp.$1就是取到的y+匹配到的baidu
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  //2.获取
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
};
