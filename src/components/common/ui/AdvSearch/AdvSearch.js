import React from 'react';
import { Select, Icon, Input, Button } from 'antd';
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

const logicSymbolMap = {
  and: '并且',
  or: '或者'
};

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
          logicSymbol: '',
          compareSymbol: '',
          field: '',
          control: 'Input',
          value: ''
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
          logicSymbol: 'and',
          compareSymbol: '',
          field: '',
          control: 'Input',
          value: ''
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
      logicSymbol: searchItem.logicSymbol === 'and' ? 'or' : 'and'
    });
    this.setState({ searchList: newSearchList });
  };

  handleSelectFieldChange = (value, index) => {
    const { searchList } = this.state;
    const { fields } = this.props;
    const fieldIndex = fields.findIndex(fieldItem => {
      if (fieldItem.value === value) {
        return true;
      }
    });
    const selectedField = fields[fieldIndex];

    const control = selectedField.control;
    const field = selectedField.value;

    const newSearchItem = { ...searchList[index], field, control };
    const newSearchList = [...searchList];
    newSearchList.splice(index, 1, newSearchItem);
    this.setState({ searchList: newSearchList });
  };

  handleCompareSymbolChange = (value, index) => {
    const { searchList } = this.state;
    const newSearchItem = { ...searchList[index], compareSymbol: value };
    const newSearchList = [...searchList];
    newSearchList.splice(index, 1, newSearchItem);
    this.setState({ searchList: newSearchList });
  };

  handleValueControlChange = (value, searchItem) => {
    const { searchList } = this.state;
    const searchItemIndex = searchList.findIndex(item => item === searchItem);
    const newSearchItem = { ...searchItem, value };
    const newSearchList = [...searchList];
    newSearchList.splice(searchItemIndex, 1, newSearchItem);
    this.setState({ searchList: newSearchList });
  };

  handleConfirm = () => {
    const { searchList } = this.state;
    const searchArr = searchList.filter(
      searchItem => searchItem.field && searchItem.compareSymbol
    );
    if (!searchArr.length) {
      return this.props.onConfirm && this.props.onConfirm('');
    }

    const whereArr = [];
    searchArr.forEach(searchItem => {
      const logicSymbol = searchItem.logicSymbol
        ? searchItem.logicSymbol + ' '
        : '';
      const where = `${logicSymbol}(${searchItem.field} ${
        searchItem.compareSymbol
      } '${searchItem.value}')`;
      whereArr.push(where);
    });
    const where = whereArr.reduce((where, curWhere, index) => {
      if (index === 0) {
        return `${curWhere}`;
      }
      return `${where} ${curWhere}`;
    }, '');
    console.log({ where });
    this.props.onConfirm && this.props.onConfirm(where);
  };

  handleRemoveSearchItem = index => {
    const { searchList } = this.state;
    const newSearchList = [...searchList];

    if (index === 0) {
      newSearchList.splice(index, 1, {
        logicSymbol: '',
        compareSymbol: '',
        field: '',
        control: 'Input',
        value: ''
      });
    } else {
      newSearchList.splice(index, 1);
    }

    this.setState({ searchList: newSearchList });
  };

  renderValueControl = searchItem => {
    const { control, value } = searchItem;
    switch (control) {
      case 'Input': {
        return (
          <Input
            className="adv-search__value-control"
            size="small"
            value={value}
            placeholder="值"
            onChange={e =>
              this.handleValueControlChange(e.target.value, searchItem)
            }
          />
        );
      }
    }
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
              {!!index && logicSymbolMap[searchItem.logicSymbol]}
            </span>
            <Select
              className="adv-search__select-field"
              size="small"
              placeholder="字段"
              value={searchItem.field}
              onChange={value => this.handleSelectFieldChange(value, index)}
            >
              {fields.map(fieldItem => (
                <Option key={fieldItem.value} value={fieldItem.value}>
                  {fieldItem.label}
                </Option>
              ))}
            </Select>
            <Select
              className="adv-search__compare-symbol"
              size="small"
              placeholder="比较符"
              value={searchItem.compareSymbol}
              onChange={value => this.handleCompareSymbolChange(value, index)}
            >
              {compareSymbols.map(compareSymbol => (
                <Option key={compareSymbol.symbol} value={compareSymbol.symbol}>
                  {compareSymbol.name}
                </Option>
              ))}
            </Select>
            {this.renderValueControl(searchItem)}
            <Icon
              type="close"
              className="adv-search__remove-search-item"
              onClick={() => this.handleRemoveSearchItem(index)}
            />
          </div>
        ))}

        <div className="adv-search__add-btn" onClick={this.handleAddSearchItem}>
          <Icon type="plus" />
        </div>
        <div className="adv-search__confirm-btn">
          <Button type="primary" block onClick={this.handleConfirm}>
            {this.props.confirmText}
          </Button>
        </div>
      </div>
    );
  }
}

export default AdvSearch;
