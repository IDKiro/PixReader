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
