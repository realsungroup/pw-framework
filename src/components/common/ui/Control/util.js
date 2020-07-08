export const getRadioGroupOptions = (dataItem) => {
  const labels = dataItem.controlData.DisplayOptions;
  const values = dataItem.controlData.ValueOptions;
  if (!labels.length || !values.length) {
    return [];
  }

  return labels.map((label, index) => {
    return {
      label,
      value: values[index]
    }
  })
}