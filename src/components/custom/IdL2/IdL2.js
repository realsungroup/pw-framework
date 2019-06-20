import React from 'react';
import './IdL2.less';
import TableData from '../../common/data/TableData';
import {Button} from 'antd';
import { Link } from 'react-router-dom';
class IdL2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <TableData
          resid={613152690063}
          hasAdd={false}
          hasModify={false}
          hasDelete={false}
          hasRowView={false}
          hasRowDelete={false}
          hasRowModify={false}
          customRowBtns={[
            (record, btnSize) => {
              return <Link to={{
                pathname: '/fnmodule',
                search: `?resid=个人表格&recid=608296075283&type=前端功能入口&title=问卷首页`
              }}
              target="_self">
                 <Button>查看详细信息</Button>
              </Link>;
            }
          ]}
        />
      </div>
    );
  }
}

export default IdL2;
