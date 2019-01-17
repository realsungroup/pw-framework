import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import { propTypes, defaultProps } from './propTypes';

const getIndex = (rowIndex, colCount, colIndex) => {
  if (rowIndex === 0) {
    return colCount;
  } else {
    return rowIndex * colCount + 1 + colIndex;
  }
};

/**
 * 渲染多列的组件
 */
export default class LzRowCols extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  constructor(props) {
    super(props);
    this.state = {};
  }

  dealArr = (data, colCount) => {
    if (!Array.isArray(data)) {
      return [];
    }
    let arr = [],
      i = -1;
    data.forEach((item, index) => {
      if (index % colCount === 0) {
        i++;
        arr[i] = [];
      }
      arr[i].push(item);
    });
    return arr;
  };

  render() {
    const { renderData, colCount, keyName, children } = this.props;
    const renderArr = this.dealArr(renderData, colCount);
    const span = 24 / colCount;
    return (
      <Fragment>
        {renderArr.map((arr, rowIndex) => {
          return (
            <Row key={`row-${rowIndex}`}>
              {arr.map((data, colIndex) => {
                return (
                  <Col
                    span={span}
                    key={keyName ? data[keyName] : rowIndex + colIndex + ''}
                  >
                    {children(
                      data,
                      getIndex(rowIndex, colCount, colIndex),
                      rowIndex,
                      colIndex
                    )}
                  </Col>
                );
              })}
            </Row>
          );
        })}
      </Fragment>
    );
  }
}
