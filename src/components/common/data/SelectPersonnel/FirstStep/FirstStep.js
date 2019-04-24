import React from 'react';
import { message, Radio, Spin, Input } from 'antd';
import './FirstStep.less';
import DepartmentTree from './DepartmentTree';
import ListWithSelect from './ListWithSelect';
import PersonListWithSelect from './PersonListWithSelect';
import PersonListWithDel from './PersonListWithDel';
import InfiniteScroll from 'react-infinite-scroller';
import http from 'Util20/api';
const Search = Input.Search;

// const departmentResid = 592742244497; // 部门主表
// const departmentSubResid = 592742369617; // 部门子表（人员表）

// const mainSubConfig = [
//   {
//     title: '按班组添加',
//     listTitle: '班组列表',
//     titleFieldName: 'DESCP',
//     resid: 593017031990,
//     subResid: 592742369617
//   },
//   {
//     title: '按产线添加',
//     listTitle: '产线列表',
//     titleFieldName: 'C3_593254711841',
//     resid: 593255133996,
//     subResid: 592742369617
//   },
//   {
//     title: '成本中心1',
//     listTitle: '成本中心1列表',
//     titleFieldName: 'C3_596047861734',
//     resid: 596047828849,
//     subResid: 592742369617
//   },
//   {
//     title: '成本中心2',
//     listTitle: '成本中心2列表',
//     titleFieldName: 'C3_596047873684',
//     resid: 596047837491,
//     subResid: 592742369617
//   }
// ];

/**
 * 选择人员
 */
export default class FirstStep extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      curNavName: '按部门添加', // 当前选中的单选

      departmentData: [], // 部门列表
      listData: [], // 列表

      personList: [], // 用户列表
      selectedList: [], // 选中的人员列表

      isCheckedPart: false, // 人员是否只选了部分
      isCheckedAll: false, // 是否全选了

      pageIndex: 0, // 当前页数
      totalPage: 0, // 总页数
      pageSize: 10, // 每页数量
      total: 0, // 总共人数
      searchValue: '', // 搜索值

      hasMore: false, // 是否有更多人员

      subType: 'tree', // 点击获取人员信息的节点类型：'tree' 点击树节点 | 'cesItem' 点击班组列表项 | 'plItem' 点击产线列表项
      selectedItem: {}, // 选中的列表项
      selectedKeys: [], // 选中的节点的 key

      loading: false,
      typeLoading: false,

      selectedItemConfig: {} // 已选择的 radio 的配置
    };
  }

  componentDidMount() {
    this.setState({ typeLoading: true });
    this.getDepartmentData();
  }

  onChange = e => {
    const value = e.target.value;
    this.setState({ typeLoading: true, hasMore: false });
    let subType = '',
      itemConfig = {};

    const { searchConfig } = this.props;

    // 树组件数据
    if (value === '按部门添加') {
      this.getDepartmentData();
      subType = 'tree';

      // 搜索
    } else if (value === searchConfig.title) {
      this.setState({ typeLoading: false });
    } else {
      // 主表数据
      const itemConfig = this.props.listConfig.find(
        itemConfig => value === itemConfig.title
      );
      this.getMainTableData(itemConfig);
    }
    this.setState({
      curNavName: value,
      departmentData: [],
      listData: [],
      personList: [],
      subType,
      selectedItemConfig: itemConfig
    });
  };

  getDepartmentData = async () => {
    let res;
    try {
      res = await http().getTable({ resid: this.props.treeConfig.resid });
    } catch (err) {
      message.error(err.message);
    }
    let nodesData = res.data;
    const length = nodesData.length;
    const titleFieldName = 'DEP_NAME',
      curNodeFieldName = 'DEP_ID',
      parentNodeFieldName = 'DEP_PID';
    for (let i = 0; i < length; i++) {
      nodesData[i].title = nodesData[i][titleFieldName];
      for (let j = 0; j < length; j++) {
        if (
          nodesData[j][parentNodeFieldName] === nodesData[i][curNodeFieldName]
        ) {
          if (!nodesData[i].childNodes) {
            nodesData[i].childNodes = [];
          }
          nodesData[i].childNodes.push(nodesData[j]);
        }
      }
    }
    const departmentData = nodesData.filter(node => {
      return nodesData.every(item => {
        if (node[curNodeFieldName] !== item[curNodeFieldName]) {
          return node[parentNodeFieldName] !== item[curNodeFieldName];
        } else {
          return true;
        }
      });
    });
    this.setState({ departmentData, typeLoading: false });
  };

  getMainTableData = async itemConfig => {
    let res;
    try {
      res = await http().getTable({ resid: itemConfig.resid });
    } catch (err) {
      this.setState({ typeLoading: false });
      return message.error(err.message);
    }
    const titleFieldName = itemConfig.titleFieldName;
    res.data.forEach(item => (item.title = item[titleFieldName]));
    this.setState({
      listData: res.data,
      typeLoading: false,
      selectedItemConfig: itemConfig
    });
  };

  getPersonList = async (
    resid,
    subResid,
    hostRecid,
    option,
    hasPaging = true
  ) => {
    this.loading = true;
    this.setState({ loading: true });
    let res;
    try {
      res = await http().getSubTable({
        resid,
        subresid: subResid,
        hostrecid: hostRecid,
        ...option
      });
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }
    this.dealPersonList(res.data, res.total, hasPaging);
  };

  dealPersonList = (resData, total, hasPaging) => {
    // const avatarFieldName = '',
    //   badgeNumFieldName = 'C3_227192472953',
    //   nameFieldName = 'C3_227192484125',
    //   departmentFieldName = 'C3_227212499515';

    const [
      avatarFieldName,
      badgeNum,
      name,
      department
    ] = this.props.personFields;

    const { selectedList } = this.state;

    resData.forEach(item => {
      item.avatar = item[avatarFieldName];
      item.badgeNum = badgeNum && item[badgeNum];
      item.name = name && item[name];
      item.department = department && item[department];
      item.checked = selectedList.some(
        person => item.badgeNum === person.badgeNum
      );
    });

    const isCheckedPart = this.isCheckedPart(resData);
    const isCheckedAll = this.isCheckedAll(resData);
    const totalPage = Math.ceil(total / this.state.pageSize);
    const hasMore = hasPaging ? this.state.pageIndex + 1 <= totalPage : false;

    const personList = [...this.state.personList, ...resData];

    const pageIndex = hasPaging
      ? this.state.pageIndex + 1
      : this.state.totalPage;

    this.setState(
      {
        personList,
        isCheckedPart,
        isCheckedAll,
        pageIndex,
        totalPage,
        total,
        hasMore,
        loading: false
      },
      () => {
        this.loading = false;
      }
    );
  };

  // 点击树节点
  handleTreeNodeSelect = async (selectedKeys, e) => {
    this.setState({
      personList: [],
      pageIndex: 0,
      selectedKeys,
      searchValue: ''
    });
    if (!selectedKeys.length) {
      return;
    }
    const hostrecid = selectedKeys[0];
    const option = {
      current: 0,
      pageSize: this.state.pageSize
    };
    this.getPersonList(
      this.props.treeConfig.resid,
      this.props.subResid,
      hostrecid,
      option
    );
  };

  // 选择列表项
  handleItemSelect = async (item, index) => {
    const { selectedItemConfig } = this.state;
    const { subResid } = this.props;
    this.setState({
      personList: [],
      pageIndex: 0,
      selectedItem: item,
      searchValue: ''
    });
    const option = {
      current: 0,
      pageSize: this.state.pageSize
    };
    this.getPersonList(selectedItemConfig.resid, subResid, item.REC_ID, option);
    const { listData } = this.state;
    listData.forEach(item => (item.isSelect = false));
    listData[index].isSelect = true;
    this.setState({ listData });
  };

  /**
   * @param {string} value 搜索值
   * @param {boolean} isFirstSearch 是否是第一次搜索；默认值为 true
   * @param {boolean} hasPaging 是否分页获取；默认值为 true
   */
  handlePersonSearch = async (
    value,
    isFirstSearch = true,
    hasPaging = true
  ) => {
    if (!value) {
      return message.error('请输入关键字');
    }
    this.loading = true;
    this.setState({ loading: true });
    const { pageIndex, pageSize } = this.state;
    let option = hasPaging
      ? {
          key: value,
          current: pageIndex,
          pageSize: pageSize
        }
      : {};
    // 第一次搜索该值（非 loadMore 中搜索）
    if (isFirstSearch) {
      option.current = 0;
      this.personSearchValue = value;
      this.setState({
        personList: [],
        pageIndex: 0
      });
    }
    let res;
    try {
      res = await http().getTable({ resid: this.props.subResid, ...option });
    } catch (err) {
      return message.error(err.message);
    }
    this.dealPersonList(res.data, res.total, hasPaging);
  };

  isCheckedPart = personList => {
    return !this.isCheckedNo(personList) && !this.isCheckedAll(personList);
  };

  isCheckedNo = personList => {
    return !personList.some(person => person.checked);
  };

  isCheckedAll = personList => {
    return personList.every(person => person.checked);
  };

  handleSingleChange = (e, item, index) => {
    const checked = e.target.checked;
    const { personList, selectedList } = this.state;
    personList[index].checked = checked;
    const isCheckedPart = this.isCheckedPart(personList);
    const isCheckedAll = this.isCheckedAll(personList);

    if (checked) {
      !selectedList.some(person => item['badgeNum'] === person['badgeNum']) &&
        selectedList.unshift(item);
    } else {
      const index = selectedList.findIndex(
        person => person['badgeNum'] === item['badgeNum']
      );
      selectedList.splice(index, 1);
    }

    this.setState({ personList, isCheckedPart, isCheckedAll, selectedList });
    this.props.onSelect(selectedList);
  };

  handleAllChange = async e => {
    // 当未获取到所有人员数据时
    const { totalPage, pageIndex } = this.state;
    if (totalPage > pageIndex) {
      this.setState({ loading: true });
      // 先获取全部人员
      // 人员在主表中（搜索）
      if (
        this.state.curNavName ===
        (this.props.searchConfig && this.props.searchConfig.title)
      ) {
        await this.handlePersonSearch(this.personSearchValue, false, false);

        // 人员在子表中（按部门添加、按班组添加、按产线添加、成本中心1、成本中心2）
      } else {
        const { resid, subResid, hostRecid, option } = this.getReqParams(
          this.state.searchValue,
          false
        );
        await this.getPersonList(resid, subResid, hostRecid, option, false);
      }
    }

    // 再选中获取的全部人员
    const checked = e.target.checked;
    const { personList, selectedList } = this.state;
    personList.forEach(person => {
      person.checked = checked;
      if (checked) {
        !selectedList.some(item => item['badgeNum'] === person['badgeNum']) &&
          selectedList.unshift(person);
      } else {
        const index = selectedList.findIndex(
          item => item['badgeNum'] === person['badgeNum']
        );
        selectedList.splice(index, 1);
      }
    });

    this.setState({
      personList,
      isCheckedPart: false,
      isCheckedAll: checked,
      selectedList,
      loading: false
    });
    this.props.onSelect(selectedList);
  };

  handleDelete = (item, sIndex) => {
    const { selectedList, personList } = this.state;
    const pIndex = personList.findIndex(
      person => item['badgeNum'] === person['badgeNum']
    );
    if (personList[pIndex]) {
      personList[pIndex].checked = false;
    }

    const isCheckedPart = this.isCheckedPart(personList);
    const isCheckedAll = this.isCheckedAll(personList);

    selectedList.splice(sIndex, 1);
    this.setState({ personList, selectedList, isCheckedPart, isCheckedAll });
    this.props.onSelect(selectedList);
  };

  /**
   * 获取请求人员数据时传给后端的参数
   * @param {string} searchValue 搜索值；默认值为 ''
   * @param {boolean} hasPaging 是否分页获取数据；默认值为 true
   */
  getReqParams = (searchValue = '', hasPaging = true) => {
    const { subType, pageIndex, pageSize } = this.state;
    let resid, subResid, hostRecid;
    let option = hasPaging
      ? {
          current: pageIndex,
          pageSize,
          key: searchValue
        }
      : {};
    if (subType === 'tree') {
      resid = this.props.treeConfig.resid;
      subResid = this.props.subResid;
      hostRecid = this.state.selectedKeys[0];
    } else {
      const { selectedItemConfig } = this.state;
      resid = selectedItemConfig.resid;
      subResid = selectedItemConfig.subResid;
      hostRecid = this.state.selectedItem.REC_ID;
    }
    return { resid, subResid, hostRecid, option };
  };

  loadMore = page => {
    if (this.loading || this.state.pageIndex >= this.state.totalPage) {
      return;
    }
    // 人员在主表中（全员搜索）
    if (
      this.state.curNavName ===
      (this.props.searchConfig && this.props.searchConfig.title)
    ) {
      this.handlePersonSearch(this.personSearchValue, false);
      // 人员在子表中（按部门添加、按班组添加、按产线添加、成本中心1、成本中心2）
    } else {
      const { resid, subResid, hostRecid, option } = this.getReqParams(
        this.state.searchValue
      );
      this.getPersonList(resid, subResid, hostRecid, option);
    }
  };

  handleSearch = value => {
    this.setState({ personList: [], searchValue: value, pageIndex: 0 });
    let { resid, subResid, hostRecid, option } = this.getReqParams(value);
    option = { ...option, key: value, current: 0 };
    this.getPersonList(resid, subResid, hostRecid, option);
  };

  handleSearchChange = e => {
    this.setState({ searchValue: e.target.value });
  };

  renderList = () => {
    const {
      curNavName,
      departmentData,
      listData,
      selectedItemConfig
    } = this.state;

    switch (curNavName) {
      case '按部门添加': {
        return (
          <DepartmentTree
            nodesData={departmentData}
            onSelect={this.handleTreeNodeSelect}
          />
        );
      }
      case this.props.searchConfig && this.props.searchConfig.title: {
        return (
          <Search
            placeholder="请输入内容"
            style={{ marginTop: 25 }}
            onSearch={value => this.handlePersonSearch(value, true)}
          />
        );
      }
      default: {
        return (
          <ListWithSelect
            data={listData}
            // headerTitle={selectedItemConfig.listTitle}
            onSelect={this.handleItemSelect}
          />
        );
      }
    }
  };

  render() {
    const {
      curNavName,
      personList,
      isCheckedPart,
      isCheckedAll,
      selectedList,
      hasMore,
      loading,
      typeLoading,
      searchValue
    } = this.state;
    const { listConfig, searchConfig, treeConfig } = this.props;
    return (
      <div className="first-step">
        <div className="first-step__nav">
          <Radio.Group onChange={this.onChange} value={curNavName}>
            {/* 树 */}
            <Radio.Button value={treeConfig.title}>
              {treeConfig.title}
            </Radio.Button>
            {/* 列表 */}
            {listConfig.map(itemConfig => (
              <Radio.Button key={itemConfig.title} value={itemConfig.title}>
                {itemConfig.title}
              </Radio.Button>
            ))}
            {/* 搜索 */}
            <Radio.Button value={searchConfig.title}>
              {searchConfig.title}
            </Radio.Button>
          </Radio.Group>
        </div>
        <div className="first-step__content">
          {/* 第一栏：部门、班组、产线、搜索 */}
          <div>
            <Spin spinning={typeLoading}>{this.renderList()}</Spin>
          </div>
          {/* 第二栏：人员列表 */}
          <div>
            {!!curNavName &&
              curNavName === (searchConfig && searchConfig.title) && (
                <InfiniteScroll
                  initialLoad={false}
                  pageStart={0}
                  loadMore={this.loadMore}
                  hasMore={hasMore}
                  useWindow={false}
                  key={curNavName}
                >
                  <PersonListWithSelect
                    data={personList}
                    singleChange={this.handleSingleChange}
                    allChange={this.handleAllChange}
                    indeterminate={isCheckedPart}
                    isCheckedAll={isCheckedAll}
                    loading={loading}
                    onSearch={this.handleSearch}
                    onSearchChange={this.handleSearchChange}
                    hasSearch={false}
                  />
                </InfiniteScroll>
              )}
            {!!curNavName &&
              curNavName !== (searchConfig && searchConfig.title) && (
                <InfiniteScroll
                  initialLoad={false}
                  pageStart={0}
                  loadMore={this.loadMore}
                  hasMore={hasMore}
                  useWindow={false}
                  key={curNavName}
                >
                  <PersonListWithSelect
                    data={personList}
                    searchValue={searchValue}
                    singleChange={this.handleSingleChange}
                    allChange={this.handleAllChange}
                    indeterminate={isCheckedPart}
                    isCheckedAll={isCheckedAll}
                    loading={loading}
                    onSearch={this.handleSearch}
                    onSearchChange={this.handleSearchChange}
                  />
                </InfiniteScroll>
              )}
          </div>
          {/* 被选的人员列表 */}
          <div>
            {!!curNavName && (
              <PersonListWithDel
                data={selectedList}
                onDelete={this.handleDelete}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
