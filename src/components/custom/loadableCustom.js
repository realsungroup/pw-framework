import React from 'react';
import Loadable from 'react-loadable';

const minLoading = <span>加载中...</span>;

export const TypeIn = Loadable({
  loader: () => import('./TypeIn'),
  loading() {
    return minLoading;
  }
});
export const TableDataWrap = Loadable({
  loader: () => import('./TableDataWrap'),
  loading() {
    return minLoading;
  }
});
export const TableDataVisitor = Loadable({
  loader: () => import('./TableDataVisitor'),
  loading() {
    return minLoading;
  }
});

export const TableDataInner = Loadable({
  loader: () => import('./TableDataInner'),
  loading() {
    return minLoading;
  }
});

export const LzStepY = Loadable({
  loader: () => import('./LzStepY'),
  loading() {
    return minLoading;
  }
});
export const LzStepAflY = Loadable({
  loader: () => import('./LzStepAflY'),
  loading() {
    return minLoading;
  }
});
export const LzSelectPersons = Loadable({
  loader: () => import('./LzSelectPersons'),
  loading() {
    return minLoading;
  }
});

export const LzRegister = Loadable({
  loader: () => import('./LzRegister'),
  loading() {
    return minLoading;
  }
});
export const LzRecord = Loadable({
  loader: () => import('./LzRecord'),
  loading() {
    return minLoading;
  }
});
export const LzApproval = Loadable({
  loader: () => import('./LzApproval'),
  loading() {
    return minLoading;
  }
});
export const LzAFFOS = Loadable({
  loader: () => import('./LzAFFOS'),
  loading() {
    return minLoading;
  }
});

export const ViProvider = Loadable({
  loader: () => import('./ViProvider'),
  loading() {
    return minLoading;
  }
});
export const LzProApp = Loadable({
  loader: () => import('./LzProApp'),
  loading() {
    return minLoading;
  }
});

//导出问卷系统的组件
export const MyQuery = Loadable({
  loader: () => import('./MyQuery'),
  loading() {
    return minLoading;
  }
});
export const QueryTable = Loadable({
  loader: () => import('./QueryTable'),
  loading() {
    return minLoading;
  }
});
export const Paging = Loadable({
  loader: () => import('./Paging'),
  loading() {
    return minLoading;
  }
});

export const QueryType = Loadable({
  loader: () => import('./QueryType'),
  loading() {
    return minLoading;
  }
});
export const QuerySet = Loadable({
  loader: () => import('./QuerySet'),
  loading() {
    return minLoading;
  }
});

// 提交问卷
export const SoleQuery = Loadable({
  loader: () => import('./SoleQuery'),
  loading() {
    return minLoading;
  }
});
export const SelectPersonFirst = Loadable({
  loader: () => import('./SelectPersonFirst'),
  loading() {
    return minLoading;
  }
});
export const OneStatistical = Loadable({
  loader: () => import('./OneStatistical'),
  loading() {
    return minLoading;
  }
});

export const ExamPage = Loadable({
  loader: () => import('./ExamPage'),
  loading() {
    return minLoading;
  }
});

export const EditButton = Loadable({
  loader: () => import('./EditTitle/EditButton'),
  loading() {
    return minLoading;
  }
});
export const Result = Loadable({
  loader: () => import('./Result'),
  loading() {
    return minLoading;
  }
});
export const Selected = Loadable({
  loader: () => import('./Selected'),
  loading() {
    return minLoading;
  }
});
export const SetScore = Loadable({
  loader: () => import('./SetScore'),
  loading() {
    return minLoading;
  }
});
export const MyExam = Loadable({
  loader: () => import('./MyExam'),
  loading() {
    return minLoading;
  }
});
export const ExamArrange = Loadable({
  loader: () => import('./ExamArrange'),
  loading() {
    return minLoading;
  }
});
export const ExamManage = Loadable({
  loader: () => import('./ExamManage'),
  loading() {
    return minLoading;
  }
});

//考试系统组件
export const EditTitle = Loadable({
  loader: () => import('./EditTitle'),
  loading() {
    return minLoading;
  }
});
export const ExamSet = Loadable({
  loader: () => import('./ExamSet'),
  loading() {
    return minLoading;
  }
});

export const FJList = Loadable({
  loader: () => import('./FJList'),
  loading() {
    return minLoading;
  }
});

// 管理员确认
export const AdminConfirm = Loadable({
  loader: () => import('./AdminConfirm'),
  loading() {
    return minLoading;
  }
});
export const CreatePlan = Loadable({
  loader: () => import('./CreatePlan'),
  loading() {
    return minLoading;
  }
});

export const ExpireViolationsList = Loadable({
  loader: () => import('./ExpireViolationsList'),
  loading() {
    return minLoading;
  }
});

export const QuestionnaireRecords = Loadable({
  loader: () => import('./QuestionnaireRecords'),
  loading() {
    return minLoading;
  }
});

export const QuestionnaireStatisticAnalysisTabs = Loadable({
  loader: () => import('./QuestionnaireStatisticAnalysisTabs'),
  loading() {
    return minLoading;
  }
});

export const FiscalYearPlan = Loadable({
  loader: () => import('./FiscalYearPlan'),
  loading() {
    return minLoading;
  }
});

export const CreateTotalPlan = Loadable({
  loader: () => import('./CreateTotalPlan'),
  loading() {
    return minLoading;
  }
});

export const TrainingMaterial = Loadable({
  loader: () => import('./TrainingMaterial'),
  loading() {
    return minLoading;
  }
});

export const TrainingMaterialU = Loadable({
  loader: () => import('./TrainingMaterialU'),
  loading() {
    return minLoading;
  }
});

export const TableDataVisitorG = Loadable({
  loader: () => import('./TableDataVisitorG'),
  loading() {
    return minLoading;
  }
});

export const TableDataScheduling = Loadable({
  loader: () => import('./TableDataScheduling'),
  loading() {
    return minLoading;
  }
});

// 课程资源
export const CourseResources = Loadable({
  loader: () => import('./CourseResources'),
  loading() {
    return minLoading;
  }
});

// IDL招聘
export const IdLindex = Loadable({
  loader: () => import('./IdLindex'),
  loading() {
    return minLoading;
  }
});

// 个人成绩管理
export const PersonGradeManagement = Loadable({
  loader: () => import('./PersonGradeManagement'),
  loading() {
    return minLoading;
  }
});

// 考试图表分析
export const ExamAnalyze = Loadable({
  loader: () => import('./ExamAnalyze'),
  loading() {
    return minLoading;
  }
});

export const JobSeeker = Loadable({
  loader: () => import('./JobSeeker'),
  loading() {
    return minLoading;
  }
});

// ApplayInformnation
export const ApplayInformnation = Loadable({
  loader: () => import('./ApplayInformnation'),
  loading() {
    return minLoading;
  }
});

//
export const SelectPersonFirstP = Loadable({
  loader: () => import('./SelectPersonFirstP'),
  loading() {
    return minLoading;
  }
});
export const ExternalTraining = Loadable({
  loader: () => import('./ExternalTraining'),
  loading() {
    return minLoading;
  }
});
//导出Tabs组件
export const TabsTableData = Loadable({
  loader: () => import('./TabsTableData'),
  loading() {
    return minLoading;
  }
});

export const IdL2 = Loadable({
  loader: () => import('./IdL2'),
  loading() {
    return minLoading;
  }
});
export const PersonInfo = Loadable({
  loader: () => import('./PersonInfo'),
  loading() {
    return minLoading;
  }
});

export const EmployeeCourses = Loadable({
  loader: () => import('./EmployeeCourses'),
  loading() {
    return minLoading;
  }
});

export const InternalTraining = Loadable({
  loader: () => import('./InternalTraining'),
  loading() {
    return minLoading;
  }
});

export const ViewPlan = Loadable({
  loader: () => import('./ViewPlan'),
  loading() {
    return minLoading;
  }
});
export const SubordinateCourses = Loadable({
  loader: () => import('./SubordinateCourses'),
  loading() {
    return minLoading;
  }
});

export const ExaminationQRCode = Loadable({
  loader: () => import('./ExaminationQRCode'),
  loading() {
    return minLoading;
  }
});

export const EnquirySystem = Loadable({
  loader: () => import('./EnquirySystem'),
  loading() {
    return minLoading;
  }
});
export const HRProbation = Loadable({
  loader: () => import('./Probation/HRProbation'),
  loading() {
    return minLoading;
  }
});
export const EmployeeProbation = Loadable({
  loader: () => import('./Probation/ProbationForms'),
  loading() {
    return minLoading;
  }
});
export const TutorshipProbation = Loadable({
  loader: () => import('./Probation/TutorshipProbation'),
  loading() {
    return minLoading;
  }
});
export const ManagerProbation = Loadable({
  loader: () => import('./Probation/ManagerProbation'),
  loading() {
    return minLoading;
  }
});
export const DirectorProbation = Loadable({
  loader: () => import('./Probation/DirectorProbation'),
  loading() {
    return minLoading;
  }
});

export const ComprehensiveQuery = Loadable({
  loader: () => import('./ComprehensiveQuery'),
  loading() {
    return minLoading;
  }
});
export const AttendanceManage = Loadable({
  loader: () => import('./AttendanceManage'),
  loading() {
    return minLoading;
  }
});

export const MyTeam = Loadable({
  loader: () => import('./MyTeam'),
  loading() {
    return minLoading;
  }
});
export const IDPMangement = Loadable({
  loader: () => import('./MyTeam/IDPMangement'),
  loading() {
    return minLoading;
  }
});
export const DLEmploy = Loadable({
  loader: () => import('./DLEmploy'),
  loading() {
    return minLoading;
  }
});
export const IdpCard = Loadable({
  loader: () => import('./MyTeam/IdpCard'),
  loading() {
    return minLoading;
  }
});
export const OfferLetter = Loadable({
  loader: () => import('./OfferLetter'),
  loading() {
    return minLoading;
  }
});
export const IDLExamination = Loadable({
  loader: () => import('./IDLExamination'),
  loading() {
    return minLoading;
  }
});
export const TableDataDiscipline = Loadable({
  loader: () => import('./TableDataDiscipline'),
  loading() {
    return minLoading;
  }
});
export const ReferenceCheck = Loadable({
  loader: () => import('./ReferenceCheck'),
  loading() {
    return minLoading;
  }
});
export const PhysicalExamination = Loadable({
  loader: () => import('./PhysicalExamination'),
  loading() {
    return minLoading;
  }
});
export const ApplyApprove = Loadable({
  loader: () => import('./ApplyApprove'),
  loading() {
    return minLoading;
  }
});
export const CyberMoney = Loadable({
  loader: () => import('./CyberMoney'),
  loading() {
    return minLoading;
  }
});
export const ProjectBonus = Loadable({
  loader: () => import('./ProjectBonus'),
  loading() {
    return minLoading;
  }
});
//培训系统-课程维护
export const CourseMaintain = Loadable({
  loader: () => import('./CourseMaintain'),
  loading() {
    return minLoading;
  }
});

export const TrainingOrganization = Loadable({
  loader: () => import('./TrainingOrganization'),
  loading() {
    return minLoading;
  }
});

export const TranningDetail = Loadable({
  loader: () => import('./TranningDetail'),
  loading() {
    return minLoading;
  }
});
export const TranningDetailApproval = Loadable({
  loader: () => import('./TranningDetailApproval'),
  loading() {
    return minLoading;
  }
});
export const SearchForEmployee = Loadable({
  loader: () => import('./SearchForEmployee'),
  loading() {
    return minLoading;
  }
});

export const PostAndPersonnel = Loadable({
  loader: () => import('./PostAndPersonnel'),
  loading() {
    return minLoading;
  }
});

export const RelievePerson = Loadable({
  loader: () => import('./RelievePerson'),
  loading() {
    return minLoading;
  }
});

export const StatisticAnalysisJC = Loadable({
  loader: () => import('./StatisticAnalysisJC'),
  loading() {
    return minLoading;
  }
});
export const DLPrint = Loadable({
  loader: () => import('./DLPrint'),
  loading() {
    return minLoading;
  }
});