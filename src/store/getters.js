const getters = {
  bookList: state => {
    return Array.from(new Set(state.bookList))
  }
}

export default getters
