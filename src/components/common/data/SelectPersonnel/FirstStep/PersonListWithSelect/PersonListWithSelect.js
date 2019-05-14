import React, { Fragment } from 'react';
import { Input, Checkbox } from 'antd';
import './PersonListWithSelect.less';
import PropTypes from 'prop-types';
import PersonList from '../PersonList';
import classNames from 'classnames';
import WrapedCheckbox from '../../../../ui/WrapedCheckbox';

const Search = Input.Search;
/**
 * 带有复选框的人员列表组件
 */
export default class PersonListWithSelect extends React.Component {
  static propTypes = {
    /**
     * 是否有搜索栏
     * 默认：true
     */
    hasSearch: PropTypes.bool
  };

  static defaultProps = {
    hasSearch: true
  };

  renderContent = (item, index, field_3) => {
    return (
      <Fragment>
        <span style={{ marginRight: 10 }}>{item[field_3]}</span>
        <Checkbox
          checked={item.checked}
          onChange={e => this.props.singleChange(e, item, index)}
        />
      </Fragment>
    );
  };

  render() {
    const {
      singleChange,
      onAllChange,
      onSearch,
      indeterminate,
      isCheckedAll,
      onConfirm,
      data,
      searchValue,
      onSearchChange,
      hasSearch,
      secondFilterInputPlaceholder,
      ...restProps
    } = this.props;
    return (
      <div className="person-list-withselect">
        <PersonList
          header={
            <div className="person-list-withselect__header">
              {hasSearch && (
                <Search
                  value={searchValue}
                  onChange={onSearchChange}
                  placeholder={secondFilterInputPlaceholder}
                  onSearch={onSearch}
                  className="person-list-withselect__search"
                />
              )}
              {!!data.length && (
                <WrapedCheckbox
                  checked={isCheckedAll}
                  onChange={onAllChange}
                  className={classNames('person-list-withselect__checked-all', {
                    'person-list-withselect__checked-all--without-search': !hasSearch
                  })}
                  indeterminate={indeterminate}
                  labelPlacement="left"
                >
                  全选
                </WrapedCheckbox>
              )}
            </div>
          }
          content={this.renderContent}
          data={data}
          {...restProps}
        />
      </div>
    );
  }
}
