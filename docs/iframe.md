## 使用 `Link` 组件进入下一个页面没有反应？

当通过 `react-router-dom` 的 `Link` 组件进入下一个页面时，需要加上 `target="_self"` 属性，如下：

```jsx
<Link
  to={{
    pathname: '/fnmodule',
    search: '?resid=666&recid=777&title=下一个页面的标题&type=下一个页面的类型'
  }}
  target="_self"
/>
```

## 在功能组件（在 iframe 中）已经进入到了下一个页面时，如何修改窗口的 title？

在下一个页面的组件中，设置 title，如下：

```jsx
componentDidMount = () => {
  window.parent.pwCallback && window.parent.pwCallback.modifyTitle('设置问卷');
};
```

## 功能组件（在 iframe 中）如何实现返回上一页？且修改窗口左上角的 title？

```javascript
componentDidMount = () => {
  // 监听父窗口发送的 message 事件
  window.addEventListener(
    'message',
    e => {
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
};
```
