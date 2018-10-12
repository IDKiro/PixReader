# Guide.vue: 首页（书架）

应用当前的根目录由路由管理器定位到书架页面，故首页和书架现为同一页面。

### Feature

1. 电子书的上传并加入书架
2. 电子书上传后转到阅读
3. 显示电子书封面

### TODO

1. 云端同步用户的书架数据
2. 电子书按阅读顺序排序
3. 电子书文件夹分类
4. 电子书的移除

## 页面构成

书架仅由两部分构成：书籍和添加书籍按钮。

书籍部分用 `flex` 布局对每本书的 `div` 进行排列，为了在横向布局上均匀排列，使用计算属性来规定书籍的 `padding` 值：

```javascript
paddingLeftAndRight () {
  // 根据屏幕宽度调整 book-wrapper 的 padding
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 48 ? 48 : fontSize
  const bookLineNum = Math.floor((window.innerWidth * 36 / fontSize - 20) / 140)
  return ((window.innerWidth / fontSize - 20 / 36) / bookLineNum - 140 / 36) / 2 + 10 / 36
}
```

> 不用 `justify-content` 属性是因为这样会使得书籍在数量不足一行和最后一行未满的情况下也进行均匀排列，每本书之间的间距并不固定。

每个书籍的 `div` 都会拥有书籍标题和书籍封面两个子元素，但是封面元素只有在封面存在时才显示。

```html
<img :src="loadCover(index)" width="100%" height="100%" v-show="ifCoverExist[index]">
```

## 上传功能的实现

本项目上传功能的实现基于 Element UI 和七牛云的对象存储服务，七牛云对象存储的上传策略可以参考：

[https://developer.qiniu.com/kodo/manual/1206/put-policy](https://developer.qiniu.com/kodo/manual/1206/put-policy)

Element UI 的上传组件为 `el-upload`，api 参考官方中文文档：

- `multiple`: 是否允许选择多个文件上传
- `action`: 必选参数，上传的地址
- `data`: 上传时附带的额外参数，上传到七牛云需要指定 token
- `show-file-list`: 是否显示已上传文件列表
- `on-success``on-error``before-upload`: 文件上传成功\上传失败\上传前时调用的钩子函数

组件内包裹有一个 + 的图标，通过 CSS 来调整显示。

```html
<el-upload
  class="uploader"
  :multiple="false"
  :action="actionPath"
  :data="postData"
  :show-file-list="false"
  :on-success="handleUploadSuccess"
  :on-error="handleUploadError"
  :before-upload="beforeUpload">
  <i class="el-icon-plus uploader-icon"></i>
</el-upload>
```

上传前调用的钩子函数，先定义了上传文件的名称。

> 如果在返回前才定义，那么第一次上传会失败，request 显示 token 错误，证明返回前定义时上传调用的 `data` 还没有更新。

后面就可以对文件类型进行判断，并使用 `message` 组件来生成消息框。

最后只有文件类型满足要求时返回 `true`，此时才会进行上传。

```javascript
beforeUpload (file) {
  this.postData.key = file.name
  const isEpub = file.type === 'application/epub+zip'
  if (!isEpub) {
    this.$message({
      message: '现版本只支持 epub 格式！',
      center: true
    })
  } else {
    this.$message({
      message: '上传文件中...',
      center: true
    })
  }
  return isEpub
}
```

上传失败时用消息框进行提示。

```javascript
handleUploadError () {
  this.$message({
  message: '上传失败，请重试~',
  center: true,
  type: 'warning'
  })
}
```

上传成功时先清空上传文件的名称，防止数据更新不及时影响下次上传。

之前规定每次只允许上传一个文件也是因为上传成功后要打开选择的文件，打开文件前将对当前阅读书籍信息进行更新并使用 `localStorage` 进行存储。指定当前阅读书籍是为了防止在阅读页面刷新清空了 `state` 中暂存的数据，导致阅读状态重置。

```javascript
handleUploadSuccess (res, file) {
  // 清空凭证中上传文件的名称
  this.postData.key = ''
  this.$message({
    message: '上传成功！',
    center: true,
    type: 'success'
  })
  // 将电子书加入书籍列表
  localStorage.setItem('defaultBook', 'http://pgeycpcdk.bkt.clouddn.com/' + file.name)
  // 去除文件名后缀
  let pattern = /\.{1}[a-z]{1,}$/
  let bookName = file.name.slice(0, pattern.exec(file.name).index)
  if (localStorage.getItem('booklist')) {
    let bookListTemp = JSON.parse(localStorage.getItem('booklist'))
    bookListTemp.push(bookName)
    localStorage.setItem('booklist', JSON.stringify(bookListTemp))
  } else {
    let bookListTemp = [bookName]
    localStorage.setItem('booklist', JSON.stringify(bookListTemp))
  }
  // 打开上传成功的电子书
  this.$router.push('/ebook')
}
```
