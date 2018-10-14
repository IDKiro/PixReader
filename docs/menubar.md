# MenuBar.vue: 菜单栏

## 页面构成

菜单栏分为两级，当点击蒙版中央时仅弹出第一级菜单栏，此时需要点击菜单栏的选项才会继续弹出相应的设置项。二级菜单分别为书签/目录、进度、主题、字体，其中书签/目录实现较为复杂，用子组件的方式进行实现，并且为了配合书签/目录，增加了显示书签/目录后遮盖书签的蒙版，突出书签/目录内容。其他的二级菜单栏使用 `state` 中的状态变量来进行控制，并配合上滑的动画。其中字体的设置滑块和进度条的实现使用了 Element-UI，自行实现方法在笔记最后贴出。

## 二级菜单的切换

在第一个动画标签中包含了第一级菜单和菜单上的四个点击按钮。

```html
<transition name="slide-up">
  <div class="menu-wrapper" :class="{'hideBoxShadow': ifSettingShow || !ifTitleAndMenuShow}"
      v-show="ifTitleAndMenuShow">
    <div class="icon-wrapper" @click="showSetting(3)">
      <span class="icon-contents icon"></span>
    </div>
    <div class="icon-wrapper" @click="showSetting(2)">
      <span class="icon-Progress-read icon"></span>
    </div>
    <div class="icon-wrapper" @click="showSetting(1)">
      <span class="icon-brightness-contrast icon"></span>
    </div>
    <div class="icon-wrapper" @click="showSetting(0)">
      <span class="icon">A</span>
    </div>
  </div>
</transition>
```

点击不同的按钮调用同一个函数，但是传递的参数不同。特别的，点击目录时不仅要唤醒目录还要隐藏一级菜单，点击进度条时并且书籍进度加载完成时需要读取当前的阅读进度，该函数使用和添加书签时类似。

```javascript
showSetting (tag) {
  if (tag === 3) {
    this.ifSettingShow = false
    this.ifContentShow = true
  } else {
    this.ifSettingShow = true
  }
  if (tag === 2 && this.bookAvailable) {
    this.$emit('getCurrentLocation')
  }
  this.showTag = tag
}
```

因为除了目录以外的二级菜单项位置一样，所以可以作为同一个元素的子元素，并且使用 `v-if` 和 `v-else-if` 来决定渲染，判断的值便是 `showSetting` 中的 `showTag` 值。

## 字体切换

字体切换的实现较为简单，两端显示字体列表中最小和最大的字体所能显示的 A，中间则为离散显示的进度条。使用 `show-stops` 声明进度条显示离散点，绑定 `min`、`max` 和 `step` 属性来实现选择字体的选项和字体列表中的值对应。

```html
<div class="setting-font-size" v-if="showTag === 0">
  <div class="preview" :style="{fontSize: fontSizeList[0].fontSize + 'px'}">A</div>
  <el-slider class="select"
              :style="{fontSize: '.5rem', padding: '.4rem .15rem'}"
              :min="12"
              :max="24"
              :step="2"
              v-model="currentFontSize"
              :show-tooltip="false"
              @change="setFontSize(currentFontSize)"
              show-stops>
  </el-slider>
  <div class="preview" :style="{fontSize: fontSizeList[fontSizeList.length - 1].fontSize + 'px'}">A</div>
</div>
```

`v-model` 用于将进度条的值和实例中的变量进行绑定，使得进度条的值改变时可以让其他函数进行调用。

> 需要使用 `mouted` 将字体选择滑块的数据与 state 中的数据进行同步，否则每次进入阅读滑块都会回到初始设定位置。

`@change="setFontSize(currentFontSize)"` 则定义了进度条松开时并且进度条值发生变化调用的函数，这里需要使用 `$emit` 调用父组件的函数。

```javascript
setFontSize (fontSize) {
  this.$store.commit('setDefaultFontSize', fontSize)
  if (this.themes) {
    this.themes.fontSize(fontSize + 'px')
  }
  localStorage.setItem('defaultFontSize', fontSize)
}
```

## 主题切换

主题的切换和字体的切换类似，都要调用父组件的函数来进行 `theme` 的修改，但是主题需要对列表中的主题对象进行逐个渲染，然后排列在菜单中供选择。列表对象的渲染要用到 `v-for` 指令：`v-for="(item, index) in themeList" :key="index"`。

```html
<div class="setting-theme" v-else-if="showTag === 1">
  <div class="setting-theme-item" v-for="(item, index) in themeList" :key="index" @click="setTheme(index)">
    <div class="preview" :style="{background: item.style.body.background}" :class="{'no-border': item.style.body.background !=='#fff'}"></div>
    <div class="text" :class="{'selected': index === defaultTheme}">{{item.name}}</div>
  </div>
</div>
```

使用索引值作为 `setTheme()` 的输入参数，就可以实现主题的切换。

```javascript
setTheme (index) {
  this.themes.select(this.themeList[index].name)
  this.$store.commit('setDefaultTheme', index)
  localStorage.setItem('defaultTheme', index)
}
```

主题选择这边的关键在于渲染主题选项，每个主题选项都包含一个预览框和对应的主题名。其中预览框通过绑定 `style` 就可以实现 `div` 背景色的改变。特别的，白色背景为了和菜单栏进行区分，定义了 `:class="{'no-border': item.style.body.background !=='#fff'}"`，使得只有白色背景时才会渲染边框，当然这同样可以通过绑定 `style` 实现。

```css
&.no-border {
  border: none;
}
```

主题名在被选中和非选中时显示为两种颜色，这同样通过绑定 `class` 并设置条件实现：`:class="{'selected': index === defaultTheme}"`。

```css
&.selected {
  color: #555555;
}
```

## 进度条实现

进度条显示的实现比字体更为简单，进度条下的进度文字显示则使用了双向绑定，在电子书加载前后显示不同的字符串。

> 双向绑定中的值可以使用表达式进行，可以看做计算属性的行内表达，如果该值多次复用则最好使用计算属性。

```html
<div class="setting-progress" v-else-if="showTag === 2">
  <el-slider v-model="progress"
              :style="{fontSize: '.5rem', padding: '.1rem 1rem'}"
              :show-tooltip="false"
              @change="onProgressChange"></el-slider>
  <div class="text-wrapper">
    <span>{{bookAvailable ? progress + '%' : '加载中...'}}</span>
  </div>
</div>
```

`progress` 的值在这里需要实时更新，要响应翻页时的进度变化，这里使用了监听组件 `watch` 和计算属性共同实现。计算属性自动更新进度的值，`watch` 则对计算属性的值进行监听，改变时进行取整处理并更新 `progress` 的值。

watch:

```javascript
bookCurrentLocation () {
  this.progress = Math.round(this.bookCurrentLocation)
}
```

computed:

```javascript
bookCurrentLocation () {
  return this.$store.state.bookCurrentLocation
}
```

`onProgressChange` 则调用的是父组件的方法，在拖动进度条后调用实现阅读进度的跳转。

```javascript
onProgressChange (progress) {
  const percentage = progress / 100
  const location = percentage > 0 ? this.location.cfiFromPercentage(percentage) : 0
  this.rendition.display(location)
  this.pageChanged()
}
```

## 切换动画

蒙版的动画较为简单，在切出目录的时候加入蒙版，使用的动画类型是透明度的变化，类似于淡出。

```css
&.fade-enter, &.fade-leave-to {
  opacity: 0;
}
&.fade-enter-to, &.fade-leave {
  opacity: 1;
}
&.fade-enter-active, &.fade-leave-active {
  transition: all .3s;
}
```

菜单栏的切换动画和标题栏类似，只是方向有所区别。但是因为存在两级菜单，为了使得两级菜单在一同滑出时的速度一致，将二级菜单的动画的移动长度改为 `px2rem(108)`，相当于二级菜单和一级菜单的高度相加。

```css
&.slide-up-enter, &.slide-up-leave-to {
  transform: translate3d(0, 100%, 0);
}
&.slide-up-enter-to, &.slide-up-leave {
  transform: translate3d(0, 0, 0);
}
&.slide-up-enter-active, &.slide-up-leave-active {
  transition: all .3s linear;
}
```

## 不使用 element-ui 实现进度条和字体切换滑块的方法

初期未使用 element-ui 时使用的方法，列出作为参考

### 进度条

```HTML
<div class="progress-wrapper">
  <input type="range" class="progress" max="100" min="0" step="1"
          @change="onProgressChange($event.target.value)"
          @input="onProgressInput($event.target.value)"
          :value="progress"
          :disabled="!$store.state.bookAvailable"
          ref="progress">
</div>
```

```javascript
onProgressChange (progress) {
  this.$emit('onProgressChange', progress)
},
onProgressInput (progress) {
  this.progress = progress
  this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
},
```

```javascript
// 进度条背景百分比改变
this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
```

```CSS
.progress-wrapper {
  width: 100%;
  height: px2rem(40);
  padding: 0 px2rem(30);
  box-sizing: border-box;
  @include center;
  .progress {
    width: 100%;
    height: px2rem(2);
    -webkit-appearance: none;
    background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
    background-size: 0 100%;
    &:focus {
      outline: none;
    }
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      height:px2rem(20);
      width: px2rem(20);
      border-radius: 50%;
      background: #fff;
      border: px2rem(1) solid #ccc;
      box-shadow: 0 px2rem(3) px2rem(3) rgba(0, 0, 0, .15);
    }
  }
}
```

### 字体切换滑块
                    
```HTML
<div class="select" :style="{'margin-left': -lineHalfLength + 'px', 'margin-right': -lineHalfLength + 'px'}">
  <div class="select-wrapper" v-for="(item, index) in $store.state.fontSizeList" :key="index" @click="setFontSize(item.fontSize)">
    <div class="line"></div>
    <div class="point-wrapper">
      <div class="point" v-show="defaultFontSize===item.fontSize">
        <div class="small-point"></div>
      </div>
    </div>
    <div class="line"></div>
  </div>
</div>
```

```javascript
lineHalfLength: (document.body.clientWidth - 160 / 3) / 14,
```

```CSS
.select-wrapper {
  &:first-child {
    .line {
      &:first-child {
        border: none;
      }
    }
  }
  &:last-child {
    .line {
      &:last-child {
        border: none;
      }
    }
  }
  display: flex;
  flex: 1;
  align-items: center;
  .line {
    flex: 1;
    height: 0;
    border-top: #ccc solid px2rem(1);
  }
  .point-wrapper {
    position: relative;
    flex: 0 0 0;
    width: 0;
    height: px2rem(7);
    border-left: #ccc solid px2rem(1);
    @include center;
    .point {
      position: absolute;
      width: px2rem(20);
      height: px2rem(20);
      border-radius: 50%;
      background: #fff;
      border: px2rem(1) solid #ccc;
      box-shadow: 0 px2rem(3) px2rem(3) rgba(0, 0, 0, .15);
      @include center;
      .small-point {
        position: absolute;
        width: px2rem(5);
        height: px2rem(5);
        border-radius: 50%;
        background: #555555;
      }
    }
  }
}
```
