import React from 'react';
import Panel from '.././../../components/Panel';
import WorkbenchBody from './WorkbenchBody';

export default class Workbench extends React.PureComponent {
  render() {
    return (
      <Panel>
        <WorkbenchBody />
      </Panel>
    );
  }
}
