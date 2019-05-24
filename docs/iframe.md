## 在功能组件（在 iframe 中）进入下一页时，如何修改窗口的 title？

在功能组件中：

```javascript
componentDidMount = () => {
  window.parent.pwCallback.modifyTitle('设置问卷');
};
```

## 功能组件（在 iframe 中）如何实现返回上一页？且修改窗口左上角的 title？

```javascript
componentDidMount = () => {
  // 监听父窗口发送的 message 事件
  window.addEventListener(
    'message',
    (e) => {
      if (!e || !e.source || !e.source.pwCallback) {
        return;
      }
      // 当事件类型为 "goBack"（即返回上一页时）
      // 1. 调用 history.goBack() 方法放回上一页
      // 2. 调用父级 window 对象下的 pwCallback.modifyTitle 方法，来修改窗口左上角的标题，其内容为上一页页面的标题
      if (e.data.type === 'goBack') {
        this.props.history.goBack();
        e.source.pwCallback.modifyTitle &&
          e.source.pwCallback.modifyTitle('上一页页面的标题');
      }
    },
    false
  );
```
