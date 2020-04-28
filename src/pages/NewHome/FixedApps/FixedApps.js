import React from 'react';
import { Icon, Modal, Tree, Button, Spin, message, Popconfirm } from 'antd';
import './FixedApps.less';
import { removeFns, addWorkbenchApps } from '../../../util/api';

const { TreeNode } = Tree;
const clone = o => {
  return JSON.parse(JSON.stringify(o));
};
const stopPropagation = e => {
  e.stopPropagation();
};
class FixedApps extends React.PureComponent {
  state = {
    modalVisible: false,
    spinning: false,
    selectedKeys: [],
    expandedKeys: [], // 展开的节点的 key
    autoExpandParent: true,
    checkedKeys: [] // 已选中的节点的 key
  };
  selectedFnList = []; // 已添加的功能列表
  addFnList = []; // 将要添加的功能列表
  removeFnList = []; // 将要移除的功能列表
  onCheck = async (checkedKeys, e) => {
    const isParentNode = e.node.props.dataRef.isParentNode;
    // 添加或删除多个
    if (isParentNode) {
      if (e.checked) {
        // 添加多个
        e.node.props.children.forEach(item => {
          const name = item.props.dataRef.RES_NAME;
          !this.selectedFnList.some(fn => fn.name === name) &&
            this.addFnList.push(item.props.dataRef);
          this.removeFnList.some((fn, index, arr) => {
            if (fn.RES_NAME === name) {
              arr.splice(index, 1);
            }
          });
        });
      } else {
        // 删除多个
        e.node.props.children.forEach(item => {
          const name = item.props.dataRef.RES_NAME;
          this.selectedFnList.some(fn => fn.name === name) &&
            !this.removeFnList.some(fn => fn.RES_NAME === name) &&
            this.removeFnList.push(item.props.dataRef);
          this.addFnList.some((fn, index, arr) => {
            if (fn.RES_NAME === name) {
              arr.splice(index, 1);
            }
          });
        });
      }
    } else {
      const name = e.node.props.dataRef.RES_NAME;

      if (e.checked) {
        if (this.selectedFnList.some(fn => fn.name === name)) {
          this.removeFnList.some((fn, index, arr) => {
            if (fn.RES_NAME === name) {
              arr.splice(index, 1);
            }
          });
        } else {
          !this.addFnList.some(fn => fn.RES_NAME === name) &&
            this.addFnList.push(e.node.props.dataRef);
        }
      } else {
        if (this.selectedFnList.some(fn => fn.name === name)) {
          if (!this.removeFnList.some(fn => fn.RES_NAME === name)) {
            this.removeFnList.push(e.node.props.dataRef);
          }
        } else {
          this.addFnList.some((fn, index, arr) => {
            if (fn.RES_NAME === name) {
              arr.splice(index, 1);
            }
          });
        }
      }
    }

    this.setState({ checkedKeys });
  };

  componentDidUpdate(preProps) {
    if (preProps.apps !== this.props.apps) {
      this.selectedFnList = clone(this.props.apps);
    }
  }

  renderTreeNodes = fnTreeData => {
    return fnTreeData.map(item => {
      if (item.AppLinks) {
        return (
          <TreeNode
            selectable={false}
            title={item.title}
            key={item.key}
            dataRef={item}
          >
            {this.renderTreeNodes(item.AppLinks)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.title} key={item.key} dataRef={item} />;
    });
  };

  handleCloseModal = () => {
    this.setState({ modalVisible: false });
    this.addFnList = [];
    this.removeFnList = [];
  };
  handleOpenModal = () => {
    this.setState({ modalVisible: true });
  };
  chooseFn = async () => {
    this.setState({ spinning: true });
    let addFnsParams = { resid: 582414136652, data: [] },
      removeFnsParams = { resid: 582414136652, data: [] },
      primiseArr = [];
    if (this.addFnList.length) {
      this.addFnList.forEach(fn => {
        addFnsParams.data.push({
          ResID: fn.RES_ID
        });
      });
      primiseArr.push(addWorkbenchApps(addFnsParams));
    }

    if (this.removeFnList.length) {
      this.removeFnList.forEach(fn => {
        removeFnsParams.data.push({
          REC_ID: fn.recid
        });
      });
      primiseArr.push(removeFns(removeFnsParams));
    }

    let res;
    try {
      res = await Promise.all(primiseArr);
    } catch (err) {
      return message.error(err.message);
    }
    this.handleCloseModal();
    this.setState({ spinning: false });
    if (res.length) {
      message.success('选择成功');
      this.props.onRefresh && this.props.onRefresh(false);
    }
  };

  handleCancelFixed = app => async e => {
    e.stopPropagation();
    let removeFnsParams = {
      resid: 582414136652,
      data: [{ REC_ID: app.REC_ID }]
    };
    let res;
    try {
      res = await removeFns(removeFnsParams);
    } catch (error) {
      return message.error(error.message);
    }
    message.success('已取消固定');
    this.props.onRefresh && this.props.onRefresh(false);
  };

  render() {
    const { apps, fnTreeData } = this.props;
    const { modalVisible, spinning } = this.state;
    const checkedKeys = this.state.checkedKeys.length
      ? this.state.checkedKeys
      : apps.map(app => {
          return app.BusinessNodeID + '_' + app.ResID;
        });
    return (
      <div className="fixed-functions">
        <div className="new-home-title">
          <span>固定</span>
          <span
            className="fixed-functions__setting-btn"
            onClick={this.handleOpenModal}
          >
            设置
            <Icon type="right" />
          </span>
        </div>
        <div className="fixed-functions-list">
          {apps.map(app => {
            return (
              <div
                className="new-home__fixed-function"
                onClick={() => {
                  this.props.onClick([{ app, typeName: app.BusinessNode }]);
                }}
                onMouseEnter={e => {
                  const ele = e.target.querySelector('i.anticon-close');
                  if (ele) {
                    const className = ele.className;
                    if (!className.includes('show-cancel')) {
                      e.target.querySelector('i.anticon-close').className =
                        className + ' show-cancel';
                    }
                  }
                }}
                onMouseLeave={e => {
                  const ele = e.target.querySelector('i.anticon-close');
                  if (ele) {
                    const className = ele.className;
                    if (className.includes('show-cancel')) {
                      e.target.querySelector(
                        'i.anticon-close'
                      ).className = className.replace(' show-cancel', '');
                    }
                  }
                }}
              >
                <div style={{ flex: 1 }}>
                  {app.appIconUrl ? (
                    <Icon
                      type="mail"
                      style={{
                        color: '#1890FF',
                        fontSize: 20,
                        marginRight: 8
                      }}
                    />
                  ) : (
                    <i
                      className={`iconfont icon-${app.DeskiconCls ||
                        'wdkq_icon'}`}
                      style={{ fontSize: 48 }}
                    />
                  )}
                  {app.title}
                </div>
                <Popconfirm
                  onConfirm={this.handleCancelFixed(app)}
                  onCancel={stopPropagation}
                  title="确认取消固定？"
                >
                  <Icon
                    type="close"
                    onClick={stopPropagation}
                    className="cancel-btn"
                  />
                </Popconfirm>
              </div>
            );
          })}
        </div>
        <Modal
          visible={modalVisible}
          onCancel={this.handleCloseModal}
          destroyOnClose={true}
          title={
            <div className="header">
              <span className="title">可选功能 </span>
            </div>
          }
          footer={
            <Button type="primary" block onClick={this.chooseFn}>
              确定
            </Button>
          }
        >
          <Spin spinning={spinning}>
            <Tree
              checkable
              defaultExpandAll={true}
              onExpand={this.onExpand}
              expandedKeys={this.props.expandedKeys}
              autoExpandParent={this.state.autoExpandParent}
              onCheck={this.onCheck}
              checkedKeys={checkedKeys}
              onSelect={this.onSelect}
              selectedKeys={this.state.selectedKeys}
            >
              {this.renderTreeNodes(fnTreeData)}
            </Tree>
          </Spin>
        </Modal>
      </div>
    );
  }
}

export default FixedApps;
