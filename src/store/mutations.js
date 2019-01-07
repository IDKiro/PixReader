const mutations = {
  setShowBook (state, val) {
    state.ifShowBook = val
  },
  setBookAvailable (state, val) {
    state.bookAvailable = val
  },
  setTitleAndMenuShow (state, val) {
    state.ifTitleAndMenuShow = val
  },
  toggleTitleAndMenu (state) {
    state.ifTitleAndMenuShow = !state.ifTitleAndMenuShow
  },
  setBookMarked (state, val) {
    state.ifBookMarked = val
  },
  openNavigation (state, val) {
    state.navigation = val
  },
  setBookCurrentLocation (state, val) {
    state.bookCurrentLocation = val
  },
  setBookmarks (state, val) {
    state.bookmarks = val
  },
  pushBookmark (state, val) {
    state.bookmarks.push(val)
  },
  spliceBookmark (state, val) {
    state.bookmarks.splice(val, 1)
  },
  setDefaultFontSize (state, val) {
    state.defaultFontSize = val
  },
  setDefaultTheme (state, val) {
    state.defaultTheme = val
  },
  setBookList (state, val) {
    state.bookList = val
  },
  setLocalUrl (state, val) {
    state.localUrl = val
  }
}

export default mutations
