import React from 'react';
import { List } from 'antd';
import classNames from 'classnames';
import './ListWithSelect.less';

/**
 * 带有选择按钮的列表
 */
export default class ListWithSelect extends React.Component {
  render() {
    const { data, onSelect } = this.props;
    return (
      <List
        className="list-with-select"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item
            className={classNames({
              selected: item.isSelect
            })}
            onClick={() => onSelect(item, index)}
          >
            <List.Item.Meta style={{ marginLeft: 10 }} title={item.name} />
          </List.Item>
        )}
      />
    );
  }
}
