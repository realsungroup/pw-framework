# 如何得到 FormData 组件的 data 属性值？

1. 通过调用 `http().getFormData(params)` 来获取得到`窗体数据`
2. 将得到的`窗体数据`传给 `util20/controls.js` 中的 `dealControlArr()` 函数处理，得到 `处理后的窗体数据`
3. 最后，将得到的 `处理后的窗体数据` 传给 `util20/formData2ControlsData.js` 中的 `getDataProp()` 函数处理，得到 `data`。此 `data` 便是 `FormData` 组件所接收的 `data` 属性值。
