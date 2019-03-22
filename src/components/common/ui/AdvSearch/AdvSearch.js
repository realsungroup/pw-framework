import React from 'react';
import { Select, Icon } from 'antd';
import { defaultProps, propTypes } from './propTypes';
import './AdvSearch.less';

const Option = Select.Option;

const compareSymbols = [
  {
    name: '等于',
    symbol: '='
  },
  {
    name: '大于',
    symbol: '>'
  },
  {
    name: '大于等于',
    symbol: '>='
  },
  {
    name: '小于',
    symbol: '<'
  },
  {
    name: '小于等于',
    symbol: '<='
  },
  {
    name: '不等于',
    symbol: '!='
  }
];

/**
 * 高级搜索组件
 */
class AdvSearch extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  constructor(props) {
    super(props);

    this.state = {
      searchList: [
        {
          logicSymbol: '并且',
          compareSymbol: ''
        }
      ] // 搜索列表
    };
  }

  componentDidMount = () => {};

  componentWillUnmount = () => {};

  handleAddSearchItem = () => {
    this.setState({
      searchList: [
        ...this.state.searchList,
        {
          logicSymbol: '并且'
        }
      ]
    });
  };

  handleSwitchLoginSymbol = index => {
    const { searchList } = this.state;
    const newSearchList = [...searchList];
    const searchItem = searchList[index];
    newSearchList.splice(index, 1, {
      ...searchItem,
      logicSymbol: searchItem.logicSymbol === '并且' ? '或者' : '并且'
    });
    this.setState({ searchList: newSearchList });
  };

  render() {
    const { fields } = this.props;
    const { searchList } = this.state;
    return (
      <div className="adv-search">
        {searchList.map((searchItem, index) => (
          <div className="adv-search__search-item" key={index}>
            <span
              className="adv-search__search-item-logic"
              onClick={() => index && this.handleSwitchLoginSymbol(index)}
            >
              {!!index && searchItem.logicSymbol}
            </span>
            <Select className="adv-search__select-field">
              {fields.map(fieldItem => (
                <Option key={fieldItem} value={fieldItem}>
                  {fieldItem}
                </Option>
              ))}
            </Select>
            <Select className="adv-search__compare-symbol">
              {compareSymbols.map(compareSymbol => (
                <Option key={compareSymbol.symbol} value={compareSymbol.symbol}>
                  {compareSymbol.name}
                </Option>
              ))}
            </Select>
            <div className="adb-search__control" />
          </div>
        ))}

        <div className="adv-search__add-btn" onClick={this.handleAddSearchItem}>
          <Icon type="plus" />
        </div>
      </div>
    );
  }
}

export default AdvSearch;
