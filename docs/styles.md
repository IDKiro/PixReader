# 项目全局样式

## 设置全局样式
本项目将样式文件夹 `styles` 全部放在`\src\asset\` 中：

![](/imgs/readme/4.png)

### 图标样式

其中 `icon.css` 对应之前下载的图标组件的 `style.css`， `fonts` 则对应之前下载的图标组件的 `fonts`。

### 全局样式

`reset.scss` 文件用于减少浏览器的不同导致的样式差别，直接在复制一份到该目录下即可：

[https://meyerweb.com/eric/tools/css/reset/](https://meyerweb.com/eric/tools/css/reset/)

这里为了字体的美观在 `reset.scss` 文件中添加了以下一段代码：

```css
html, body {
  width: 100%;
  height: 100%;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","å¾®è½¯é›…é»‘",Arial,sans-serif;
}
```

使用的 `font-family` 为 element-ui 推荐的字体列表：

[http://element-cn.eleme.io/#/zh-CN/component/typography](http://element-cn.eleme.io/#/zh-CN/component/typography)

`global.scss` 则为全局可用的样式表：

```CSS
/* 导入 `reset.scss` */
@import "reset";

/* 定义 `px2rem` 函数 */
$fontSize : 36;
@function px2rem($px) {
  @return ($px / $fontSize) + rem;
}

/* 定义居中样式缩写 */
@mixin center() {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 设置图标默认样式 */
.icon {
  color: #555555;
  font-size: px2rem(20);
}
```

其中 `px2rem` 函数用于将 px 单位的大小转换为 rem 单位（1rem = 1倍根节点字体大小）的大小，查看本项目的 `App.vue` 可以看到增加了以下一段代码：

```javascript
// 动态调整根节点字体
document.addEventListener('DOMContentLoaded', () => {
  const html = document.querySelector('html')
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 48 ? 48 : fontSize
  html.style.fontSize = fontSize + 'px'
})
```

这段代码是为了根据屏幕的宽度动态调整根节点字体的大小，让不同屏幕宽度的设备都有较好的字体显示效果。但是其他元素如果直接用 px 为单位进行样式的设置，那么就会使得字体和元素的大小不成比例，所以在全局样式中提供了 `px2rem` 函数，使得样式和字体有较好的一致性。

### element-ui 主题

element-ui 默认主题的颜色为蓝色，为了和项目颜色一致，需要改变 element-ui 主题的颜色，官方提供了在线工具：

[https://elementui.github.io/theme-chalk-preview/#/zh-CN](https://elementui.github.io/theme-chalk-preview/#/zh-CN)

将下载的压缩包解压后得到的文件放在 `theme` 文件夹即可。