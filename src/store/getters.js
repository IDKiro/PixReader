const getters = {
  bookAvailable: state => {
    return state.bookAvailable
  },
  ifTitleAndMenuShow: state => {
    return state.ifTitleAndMenuShow
  },
  ifBookMarked: state => {
    return state.ifBookMarked
  },
  navigation: state => {
    return state.navigation
  },
  bookCurrentLocation: state => {
    return state.bookCurrentLocation
  },
  bookmarks: state => {
    return state.bookmarks
  },
  defaultFontSize: state => {
    return state.defaultFontSize
  },
  defaultTheme: state => {
    return state.defaultTheme
  },
  bookList: state => {
    return state.bookList
  }
}

export default getters
