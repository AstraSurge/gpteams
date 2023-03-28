export function generateRegExp(str: string) {
  let regex: RegExp
  try {
    regex = new RegExp(str) // 尝试将字符串转换为正则表达式
  }
  catch (e) {
    regex = new RegExp(`.*${str}.*`) // 生成一个包含该字符串的正则表达式
  }
  return regex
}
