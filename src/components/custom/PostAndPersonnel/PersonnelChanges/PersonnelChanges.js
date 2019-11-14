import React from 'react';
import { Card } from 'antd';
import img1 from './images/岗位与人事调动.png';
import img2 from './images/离职情况.png';
import img3 from './images/入职情况.png';
import img4 from './images/员工调动.png';
import img5 from './images/申请调岗.png';
import img6 from './images/申请招聘.png';
import Container from './Container';
import './PersonnelChanges.less';

const { Meta } = Card;

class PersonnelChanges extends React.Component {
  state = {
    target: ''
    // target: 'post'
  };
  setTab = tabKey => () => this.setState({ target: tabKey });

  renderCards = () => (
    <div className="personnel-changes-cards">
      <Card
        hoverable
        cover={<img alt="example" src={img1} />}
        onClick={this.setTab('post')}
      >
        <Meta title="岗位变动" description="查看岗位变动情况" />
      </Card>
      <Card
        hoverable
        cover={<img alt="example" src={img2} />}
        onClick={this.setTab('dimission')}
      >
        <Meta title="离职情况" description="查看员工离职情况" />
      </Card>
      <Card
        hoverable
        cover={<img alt="example" src={img3} />}
        onClick={this.setTab('induction')}
      >
        <Meta title="入职情况" description="查看员工入职情况" />
      </Card>
      <Card
        hoverable
        cover={<img alt="example" src={img4} />}
        onClick={this.setTab('mobilize')}
      >
        <Meta title="员工调动" description="查看员工的职位调动情况" />
      </Card>
      <Card
        hoverable
        cover={<img alt="example" src={img5} />}
        onClick={this.setTab('reassignment')}
      >
        <Meta title="申请调岗" description="我要申请去另一个岗位工作" />
      </Card>
      <Card
        hoverable
        cover={<img alt="example" src={img6} />}
        onClick={this.setTab('recruitment')}
      >
        <Meta title="申请招聘" description="我要申请招聘新员工" />
      </Card>
    </div>
  );

  render() {
    const { target } = this.state;
    return target ? <Container tabKey={target} /> : this.renderCards();
  }
}

export default PersonnelChanges;
