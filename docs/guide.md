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

## 上传功能的实现

本项目上传功能的实现基于 Element UI 和七牛云的对象存储服务，七牛云对象存储的上传策略可以参考：

[https://developer.qiniu.com/kodo/manual/1206/put-policy](https://developer.qiniu.com/kodo/manual/1206/put-policy)

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

```javascript
handleUploadError () {
    this.$message({
    message: '上传失败，请重试~',
    center: true,
    type: 'warning'
    })
}
```

```javascript
handleUploadSuccess (res, file) {
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

```javascript
beforeUpload (file) {
    this.postData.key = file.name
    const isEpub = file.type === 'application/epub+zip'
    if (!isEpub) {
    this.$message({
        message: '现版本只支持 epub 格式！',
        center: true
    })
    }
    return isEpub
}
```