/**
 * 导出功能模块所需要的所有组件
 */

// common
// export { TableData, OrgChartData } from '../components/common/loadableCommon';

// lib
export { LzTable, LzMenuContainer } from '../loadableComponents';
export { TableData } from '../components/common/loadableCommon';
export { TableDataWrap,TableDataInner } from '../components/custom/loadableCustom';

// custom
export { LzRegister } from '../components/custom/loadableCustom';
export { LzRecord } from '../components/custom/loadableCustom';
export { LzApproval } from '../components/custom/loadableCustom';
export { LzAFFOS } from '../components/custom/loadableCustom';
export { ViProvider } from '../components/custom/loadableCustom';
export { LzProApp } from '../components/custom/loadableCustom';

// 组件

export {
  LzDataHandling,
  LzDataAnalyse,
  LzMyCA,
  LzClassifySet,
  LzAFFO,
  LzWorkOvertime,
  LzTabsDataDashboard
} from '../product-components/att/loadableComponents';

export { LzTeamSet } from '../product-components/att/loadableComponents';
export {
  LzStepY,
  LzStepAflY,
  LzSelectPersons,
  Card
} from '../components/custom/loadableCustom';


// 问卷系统组件
export {
  MyQuery,
  QueryTable,
  Paging,
  QueryType,
  QuerySet
} from '../components/custom/loadableCustom';
