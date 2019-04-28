import React from 'react';
import { message, Radio, Spin, Input, Upload, Icon } from 'antd';
import './FirstStep.less';
import DepartmentTree from './DepartmentTree';
import ListWithSelect from './ListWithSelect';
import PersonListWithSelect from './PersonListWithSelect';
import PersonListWithDel from './PersonListWithDel';
import InfiniteScroll from 'react-infinite-scroller';
import http from 'Util20/api';
import PropTypes from 'prop-types';
const Search = Input.Search;
const Dragger = Upload.Dragger;

function dealData(radioConfig, data) {
  const { type, nameField, pidField, idField } = radioConfig;
  data.forEach(item => {
    item.name = item[nameField];
  });
  if (type === 'tree') {
    let nodesData = data;
    const length = nodesData.length;
    const titleFieldName = nameField,
      curNodeFieldName = idField,
      parentNodeFieldName = pidField;
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
    return nodesData.filter(node => {
      return nodesData.every(item => {
        if (node[curNodeFieldName] !== item[curNodeFieldName]) {
          return node[parentNodeFieldName] !== item[curNodeFieldName];
        } else {
          return true;
        }
      });
    });
  }
  return data;
}

/**
 * 选择人员
 */
export default class FirstStep extends React.Component {
  static propTypes = {
    /**
     * 顶部单选按钮组配置
     * 默认：[]
     */
    radioGroupConfig: PropTypes.array
  };

  static defaultProps = {
    radioGroupConfig: []
  };

  constructor(props) {
    super(props);
    const { radioGroupConfig } = props;

    let firstRadioConfig = null;
    if (radioGroupConfig.length) {
      firstRadioConfig = { ...radioGroupConfig[0] };
    }

    this.state = {
      curNavName: '按部门添加', // 当前选中的单选

      departmentData: [], // 部门列表
      listData: [], // 列表

      personList: [], // 用户列表（第二列）
      selectedList: [], // 选中的人员列表（第三列）

      isCheckedPart: false, // 人员是否只选了部分
      isCheckedAll: false, // 是否全选了

      pageIndex: 0, // 当前页数
      totalPage: 0, // 总页数
      pageSize: 10, // 每页数量
      total: 0, // 总共人数
      searchValue: '', // 搜索值

      hasMore: false, // 是否有更多人员

      subType: 'tree', // 点击获取人员信息的节点类型：'tree' 点击树节点
      selectedItem: {}, // 选中的列表项
      selectedKeys: [], // 选中的节点的 key

      firstColLoading: false, // 第一列 loading

      secondColLoading: false, // 第二列 loading

      selectedItemConfig: {}, // 已选择的 radio 的配置

      // 新加的
      firstRadioConfig, // 第一个单选按钮配置
      selectedRadio: firstRadioConfig // 已选择的 radio
    };
  }

  componentDidMount() {
    this.setState({ firstColLoading: true });
    this.getData();
  }

  getData = async () => {
    this.getFirstColData(this.state.selectedRadio);
  };

  // 获取第一列的数据
  getFirstColData = async radioConfig => {
    if (radioConfig) {
      let res;
      try {
        res = await http().getTable({ resid: radioConfig.resid });
      } catch (err) {
        this.setState({ firstColLoading: false });
        console.error(err);
        return message.error(err.message);
      }
      const firstColData = dealData(radioConfig, res.data);

      console.log({ firstColData });

      radioConfig.firstColData = firstColData;
      this.setState({
        selectedRadio: { ...radioConfig },
        firstColLoading: false
      });
    } else {
      this.setState({ firstColLoading: false, selectedRadio: radioConfig });
    }
  };

  // 获取第二列的数据
  getSecondColData = item => {};

  handleRadioGroupChange = e => {
    this.setState({ firstColLoading: true, hasMore: false, personList: [] });
    const { radioGroupConfig } = this.props;
    const value = e.target.value;
    const selectedRadio = radioGroupConfig.find(
      radioConfig => radioConfig.title === value
    );
    const { type } = selectedRadio;

    if (type === 'tree' || type === 'list') {
      this.getFirstColData(selectedRadio);
    } else if (type === 'search' || type === 'file') {
      this.setState({ selectedRadio, firstColLoading: false });
    }
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
    const { personFields, personPrimaryKeyField } = this.props;
    const [avatarFieldName, field_1, field_2, field_3] = personFields;

    const { selectedList } = this.state;

    resData.forEach(item => {
      item.avatar = item[avatarFieldName];
      item[field_1] = field_1 && item[field_1];
      item.field_2 = field_2 && item[field_2];
      item.field_3 = field_3 && item[field_3];
      item.checked = selectedList.some(
        person => item[personPrimaryKeyField] === person[personPrimaryKeyField]
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
        secondColLoading: false
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
      searchValue: '',
      secondColLoading: true
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
      this.state.selectedRadio.resid,
      this.props.subResid,
      hostrecid,
      option
    );
  };

  // 选择列表项
  handleItemSelect = async (item, index) => {
    const { selectedRadio } = this.state;
    const { subResid } = this.props;
    this.setState({
      personList: [],
      pageIndex: 0,
      selectedItem: item,
      searchValue: '',
      secondColLoading: true
    });
    const option = {
      current: 0,
      pageSize: this.state.pageSize
    };
    this.getPersonList(selectedRadio.resid, subResid, item.REC_ID, option);
    const listData = selectedRadio.firstColData;
    listData.forEach(item => (item.isSelect = false));
    listData[index].isSelect = true;
    this.setState({ selectedRadio });
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
    const { personPrimaryKeyField } = this.props;

    if (checked) {
      !selectedList.some(
        person => item[personPrimaryKeyField] === person[personPrimaryKeyField]
      ) && selectedList.unshift(item);
    } else {
      const index = selectedList.findIndex(
        person => person[personPrimaryKeyField] === item[personPrimaryKeyField]
      );
      selectedList.splice(index, 1);
    }

    this.setState({ personList, isCheckedPart, isCheckedAll, selectedList });
    this.props.onSelect(selectedList);
  };

  handleAllChange = async e => {
    // 当未获取到所有人员数据时
    const { totalPage, pageIndex, selectedRadio } = this.state;
    if (totalPage > pageIndex) {
      this.setState({ secondColLoading: true });
      // 先获取全部人员
      // 人员在主表中（搜索）
      if (selectedRadio.type === 'search') {
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
    const { personPrimaryKeyField } = this.props;
    personList.forEach(person => {
      person.checked = checked;
      if (checked) {
        !selectedList.some(
          item => item[personPrimaryKeyField] === person[personPrimaryKeyField]
        ) && selectedList.unshift(person);
      } else {
        const index = selectedList.findIndex(
          item => item[personPrimaryKeyField] === person[personPrimaryKeyField]
        );
        selectedList.splice(index, 1);
      }
    });

    this.setState({
      personList,
      isCheckedPart: false,
      isCheckedAll: checked,
      selectedList,
      secondColLoading: false
    });
    this.props.onSelect(selectedList);
  };

  handleDelete = (item, sIndex) => {
    const { selectedList, personList } = this.state;
    const { personPrimaryKeyField } = this.props;
    const pIndex = personList.findIndex(
      person => item[personPrimaryKeyField] === person[personPrimaryKeyField]
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
    const { selectedRadio, pageIndex, pageSize } = this.state;
    let resid, subResid, hostRecid;
    let option = hasPaging
      ? {
          current: pageIndex,
          pageSize,
          key: searchValue
        }
      : {};
    if (selectedRadio.type === 'tree') {
      resid = selectedRadio.resid;
      subResid = this.props.subResid;
      hostRecid = this.state.selectedKeys[0];
    } else {
      resid = selectedRadio.resid;
      subResid = this.props.subResid;
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

  renderFirstCol = () => {
    const { selectedRadio } = this.state;
    if (!selectedRadio) {
      return null;
    }

    switch (selectedRadio.type) {
      // 渲染树
      case 'tree': {
        return (
          <DepartmentTree
            nodesData={selectedRadio.firstColData}
            onSelect={this.handleTreeNodeSelect}
          />
        );
      }
      // 渲染列表
      case 'list': {
        return (
          <ListWithSelect
            data={selectedRadio.firstColData}
            onSelect={this.handleItemSelect}
          />
        );
      }
      // 渲染搜索
      case 'search': {
        return (
          <Search
            placeholder="请输入内容"
            style={{ marginTop: 25 }}
            onSearch={value => this.handlePersonSearch(value, true)}
          />
        );
      }
      // 渲染选择文件
      case 'file': {
        const props = {
          name: 'file',
          customRequest: info => {},
          onChange(info) {
            const file = info.file.originFileObj;
          }
        };
        return (
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域</p>
          </Dragger>
        );
      }
    }
  };

  renderRadioItem = radioItem => {
    switch (radioItem.type) {
      // 树
      case 'tree': {
        return;
      }
    }
  };

  getSceondColHasSearch = () => {
    const { selectedRadio } = this.state;
    if (selectedRadio.type === 'search' || selectedRadio.type === 'file') {
      return false;
    }
    return true;
  };

  getShowField = () => {
    const { personFields } = this.props;
    return {
      field_1: personFields[1],
      field_2: personFields[2],
      field_3: personFields[3]
    };
  };

  render() {
    const {
      curNavName,
      personList,
      isCheckedPart,
      isCheckedAll,
      selectedList,
      hasMore,
      secondColLoading,
      firstColLoading,
      selectedRadio
    } = this.state;
    const { radioGroupConfig } = this.props;
    return (
      <div className="first-step">
        <div className="first-step__nav">
          <Radio.Group
            onChange={this.handleRadioGroupChange}
            value={selectedRadio.title}
          >
            {radioGroupConfig.map(radioConfig => {
              return (
                <Radio.Button key={radioConfig.title} value={radioConfig.title}>
                  {radioConfig.title}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </div>
        <div className="first-step__content">
          {/* 第一列：树、列表、搜索、文件 */}
          <div>
            <Spin spinning={firstColLoading}>{this.renderFirstCol()}</Spin>
          </div>
          {/* 第二列：人员列表 */}
          <div>
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
                onAllChange={this.handleAllChange}
                indeterminate={isCheckedPart}
                isCheckedAll={isCheckedAll}
                loading={secondColLoading}
                onSearch={this.handleSearch}
                onSearchChange={this.handleSearchChange}
                hasSearch={this.getSceondColHasSearch()}
                {...this.getShowField()}
              />
            </InfiniteScroll>
          </div>
          {/* 第三列：被选的人员列表 */}
          <div>
            <PersonListWithDel
              data={selectedList}
              onDelete={this.handleDelete}
              {...this.getShowField()}
            />
          </div>
        </div>
      </div>
    );
  }
}
