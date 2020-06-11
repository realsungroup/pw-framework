import React from "react";
import { propTypes, defaultProps } from "./propTypes";
import TableData from "Common/data/TableData";
import "./PatientInfo.less";
import { Button, message } from "antd";
import { LzModal, LzMenuForms } from "../loadableCustom";
import http, { makeCancelable } from "Util20/api";

const customBtnStyle = {
  margin: "0 4px",
};

/**
 * 患者信息
 */
class PatientInfo extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      record: {},
      navListResidField: "",
      cdLen: {},
      ucLen: {},
    };
  }

  componentDidMount = async () => {
    const { resid } = this.props.tableDataProps;
    this.p1 = makeCancelable(
      http().getTable({
        resid,
        cmswhere: `C3_617809531670 = 'UC'`,
        pageindex: 0,
        pagesize: 10,
      })
    );
    this.p2 = makeCancelable(
      http().getTable({
        resid,
        cmswhere: `C3_617809531670 = 'CD'`,
        pageindex: 0,
        pagesize: 10,
      })
    );
    const pArr = [this.p1.promise, this.p2.promise];

    let res;
    try {
      res = await Promise.all(pArr);
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    const ucLen = res[0].total;
    const cdLen = res[1].total;
    this.setState({ ucLen, cdLen });
  };

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
    this.p2 && this.p2.cancel();
  };

  handleInputCaseClick = (record) => {
    this.setState({
      modalVisible: true,
      record: { ...record },
      navListResidField: "C3_620929565473",
    });
  };

  handleQSClick = (record) => {
    this.setState({
      modalVisible: true,
      record: { ...record },
      navListResidField: "C3_620929861096",
    });
  };

  handleHistoryClick = (record) => {
    this.setState({
      modalVisible: true,
      record: { ...record },
      navListResidField: "C3_620929845890",
    });
  };

  customRowBtns = [
    (record, size) => {
      return (
        <Button
          key="输入病例"
          style={customBtnStyle}
          size={size}
          onClick={() => this.handleInputCaseClick(record)}
        >
          输入病例
        </Button>
      );
    },
    (record, size) => {
      return (
        <Button
          key="问卷调差"
          style={customBtnStyle}
          size={size}
          onClick={() => this.handleQSClick(record)}
        >
          问卷调查
        </Button>
      );
    },
    (record, size) => {
      return (
        <Button
          key="历史记录"
          style={customBtnStyle}
          size={size}
          onClick={() => this.handleHistoryClick(record)}
        >
          历史记录
        </Button>
      );
    },
  ];

  handleModalClose = () => {
    this.setState({ modalVisible: false });
  };

  renderActionBarExtra = () => {
    const { cdLen, ucLen } = this.state;
    return (
      <div>
        <span style={{ margin: "0 4px" }}>CD：{cdLen}</span>
        <span style={{ margin: "0 4px" }}>UC：{ucLen}</span>
      </div>
    );
  };

  render() {
    const { tableDataProps } = this.props;
    const {
      modalVisible,
      record,
      navListResidField,
      ucLen,
      cdLen,
    } = this.state;
    return (
      <div className="patient-info">
        {typeof ucLen === "number" && typeof cdLen === "number" && (
          <TableData
            {...tableDataProps}
            customRowBtns={this.customRowBtns}
            actionBarExtra={this.renderActionBarExtra}
          />
        )}

        {modalVisible && (
          <LzModal defaultScaleStatus="max" onClose={this.handleModalClose}>
            <LzMenuForms
              mode="multiple"
              addModalFormProps={{
                displayMod: "classify",
                modalWidth: 1000,
              }}
              hasFieldsLabel
              navListResid={record[navListResidField]}
              resid={624640053934}
              userInfoFields={[
                { label: "姓名", innerFieldName: "C3_617809531835" },
                { label: "住院号", innerFieldName: "C3_617809584020" },
                { label: "性别", innerFieldName: "C3_617809531996" },
                { label: "出生年月", innerFieldName: "C3_617809532320" },
              ]}
              record={record}
              advSearchConfig={{
                containerName: "drawer",
              }}
              displayMod="classify"
            />
          </LzModal>
        )}
      </div>
    );
  }
}

export default PatientInfo;
