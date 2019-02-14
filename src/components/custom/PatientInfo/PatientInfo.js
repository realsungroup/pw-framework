import React from 'react';
import { propTypes, defaultProps } from './propTypes';
import TableData from 'Common/data/TableData';
import './PatientInfo.less';
import { Button } from 'antd';
import {
  LzModal,
  LzUnitComponentContainer,
  LzMenuForms
} from '../loadableCustom';

const customBtnStyle = {
  margin: '0 4px'
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
      navListResidField: ''
    };
  }

  componentDidMount = () => {};

  componentWillUnmount = () => {};

  handleInputCaseClick = record => {
    this.setState({
      modalVisible: true,
      record: { ...record },
      navListResidField: 'C3_603466824586'
    });
  };

  handleQSClick = record => {
    this.setState({
      modalVisible: true,
      record: { ...record },
      navListResidField: 'C3_603466838675'
    });
  };

  handleHistoryClick = record => {
    // this.setState({
    //   modalVisible: true,
    //   record: { ...record },
    //   navListResidField: 'C3_603466838675'
    // });
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
    }
  ];

  handleModalClose = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    const { tableDataProps } = this.props;
    const { modalVisible, record, navListResidField } = this.state;
    console.log('fdsafdsa', record.C3_603466824586);
    return (
      <div className="patient-info">
        <TableData {...tableDataProps} customRowBtns={this.customRowBtns} />
        {modalVisible && (
          <LzModal defaultScaleStatus="max" onClose={this.handleModalClose}>
            <LzMenuForms
              mode="multiple"
              addModalFormProps={{
                displayMod: 'classify',
                modalWidth: 1000
              }}
              hasFieldsLabel
              navListResid={record[navListResidField]}
              resid={586639160406}
              userInfoFields={[
                { label: '姓名', innerFieldName: 'C3_586890765790' },
                { label: '住院号', innerFieldName: 'C3_586890758859' },
                { label: '性别', innerFieldName: 'C3_589053299408' },
                { label: '出生年月', innerFieldName: 'C3_586890847629' }
              ]}
              record={record}
              advSearchConfig={{
                containerName: 'drawer'
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
