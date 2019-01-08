import React from 'react';
import { argumentContainer } from '../util';
import { withHttpGetFormData } from '../withHttp';
import { message, Drawer } from 'antd';
import PwForm from '../../ui-components/PwForm';
import withFormDataProp from '../withFormDataProp';
import { dealFormData } from '../../../util/controls';
import { getCmsWhere } from '../../../util/util';

const Fragment = React.Fragment;

// 导入数据的高阶组件
const withImportData = WrappedComponent => {
  class withImportData extends React.Component {
    constructor(props) {
      super(props);

      this.state = {};
    }

    render() {
      return (
        <Fragment>
          <WrappedComponent
            showAdvSearch={this.handleShowAdvSearch}
            setProps={this.handleSetAdvProps}
            {...this.props}
          />
          <Drawer
            title="高级搜索"
            placement="right"
            onClose={this.handleClose}
            visible={drawerVisible}
            width={500}
            {...drawerProps}
          >
            <PwForm
              saveText="搜索"
              hasEdit={false}
              hasCancel={false}
              onSave={this.handleGetCmsWhere}
              data={data}
              {...formProps}
            />
          </Drawer>
        </Fragment>
      );
    }
  }

  return argumentContainer(withImportData, WrappedComponent, 'withImportData');
};

export default withImportData;
