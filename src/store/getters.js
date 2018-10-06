const getters = {
  // 去除一些错误操作导致的重复书签
  bookList: state => {
    return Array.from(new Set(state.bookList))
  }
}

export default getters
