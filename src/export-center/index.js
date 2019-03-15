/**
 * 导出功能模块所需要的所有组件
 */

// common
export { TableData, OrgChartData } from '../components/common/loadableCommon';

// custom
export { LzRegister } from '../components/custom/loadableCustom';
export { LzRecord } from '../components/custom/loadableCustom';
export { LzApproval } from '../components/custom/loadableCustom';

// lib
export { LzTable } from '../loadableComponents';

// 定制组件

export {
  LzDataHandling,
  LzDataAnalyse,
  LzMyCA,
  LzClassifySet,
  LzAFFO,
  LzWorkOvertime,
  LzTabsDataDashboard,
  LzTeamSet
} from '../product-components/att/loadableComponents';
