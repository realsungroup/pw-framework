import React from 'react';
import ComprehensiveQuery from './ComprehensiveQuery';
import './ComprehensiveQuery.less';
import { Card } from 'antd';
import img1 from './images/岗位与人事调动.png';
import img2 from './images/考勤查询.png';
import img3 from './images/离职情况.png';
import img4 from './images/培训查询.png';
import img5 from './images/评级评优查询.png';
import img6 from './images/人事信息.png';
import img7 from './images/入职情况.png';
const { Meta } = Card;

class ComprehensiveQueryIndex extends React.Component {
  state = {
    target: ''
  };
  setTab = tabKey => () => this.setState({ target: tabKey });

  goBack = () => this.setState({ target: '' });
  renderCards = () => {
    return (
      <div className="comprehensive-query-index_cards">
        <Card
          hoverable
          cover={<img alt="example" src={img6} />}
          onClick={this.setTab('personnel')}
        >
          <Meta title="人事信息" description="查询员工的详细信息" />
        </Card>
        <Card
          hoverable
          cover={<img alt="example" src={img2} />}
          onClick={this.setTab('attendance')}
        >
          <Meta title="考勤查询" description="查询员工的考勤情况" />
        </Card>
        <Card
          hoverable
          cover={<img alt="example" src={img5} />}
          onClick={this.setTab('rating')}
        >
          <Meta title="评级评优查询" description="查看员工的评级评优情况" />
        </Card>
        {process.env.NODE_ENV === 'development' && (
          <>
            <Card
              hoverable
              cover={<img alt="example" src={img4} />}
              onClick={this.setTab('training')}
            >
              <Meta title="培训查询" description="查询员工的培训情况" />
            </Card>
            <Card
              hoverable
              cover={<img alt="example" src={img1} />}
              onClick={this.setTab('jobAndEmployee')}
            >
              <Meta
                title="岗位与人员调动"
                description="查询岗位和人员变动情况"
              />
            </Card>
            <Card
              hoverable
              cover={<img alt="example" src={img3} />}
              onClick={this.setTab('dimission')}
            >
              <Meta title="离职情况" description="查询员工的离职情况" />
            </Card>
            <Card
              hoverable
              cover={<img alt="example" src={img7} />}
              onClick={this.setTab('induction')}
            >
              <Meta title="入职情况" description="查询员工的入职情况" />
            </Card>
          </>
        )}
      </div>
    );
  };
  render() {
    const { target } = this.state;
    return (
      <div className="comprehensive-query-index">
        {target ? (
          <ComprehensiveQuery tabKey={target} goBack={this.goBack} />
        ) : (
          this.renderCards()
        )}
      </div>
    );
  }
}

export default ComprehensiveQueryIndex;
