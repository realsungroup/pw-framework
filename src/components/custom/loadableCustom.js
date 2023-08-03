import React from 'react';
import Loadable from 'react-loadable';
import { Spin } from 'antd';

const minLoading = (
  <Spin spinning={true}>
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#fff',
        color: '#fff'
      }}
    ></div>
  </Spin>
);

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
export const FinisarMenjin = Loadable({
  loader: () => import('./FinisarMenjin'),
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

export const StatisticalReportForms = Loadable({
  loader: () => import('./StatisticalReportForms'),
  loading() {
    return minLoading;
  }
});

export const IDPTrack = Loadable({
  loader: () => import('./IDPTrack'),
  loading() {
    return minLoading;
  }
});

export const VisitorApplyVIP = Loadable({
  loader: () => import('./VisitorApplyVIP'),
  loading() {
    return minLoading;
  }
});

export const VisitorApplyVIPReceptionist = Loadable({
  loader: () => import('./VisitorApplyVIPReceptionist'),
  loading() {
    return minLoading;
  }
});

export const DataProcess = Loadable({
  loader: () => import('./DataProcess'),
  loading() {
    return minLoading;
  }
});
export const InterviewInvitation = Loadable({
  loader: () => import('./InterviewInvitation'),
  loading() {
    return minLoading;
  }
});
export const RankGrade = Loadable({
  loader: () => import('./RankGrade'),
  loading() {
    return minLoading;
  }
});

export const DepartmentManager = Loadable({
  loader: () => import('./DepartmentManager'),
  loading() {
    return minLoading;
  }
});
export const OfferApproval = Loadable({
  loader: () => import('./OfferApproval'),
  loading() {
    return minLoading;
  }
});
export const HeadCount = Loadable({
  loader: () => import('./HeadCount'),
  loading() {
    return minLoading;
  }
});
export const AttendanceRecord = Loadable({
  loader: () => import('./AttendanceRecord'),
  loading() {
    return minLoading;
  }
});

export const PersonInfoManager = Loadable({
  loader: () => import('./PersonInfoManager'),
  loading() {
    return minLoading;
  }
});
export const PersonInfoPrivate = Loadable({
  loader: () => import('./PersonInfoPrivate'),
  loading() {
    return minLoading;
  }
});
export const IDLTransfer = Loadable({
  loader: () => import('./IDLTransfer'),
  loading() {
    return minLoading;
  }
});
export const IDLTransferHr = Loadable({
  loader: () => import('./IDLTransferHr'),
  loading() {
    return minLoading;
  }
});
export const RBAVideoData = Loadable({
  loader: () => import('./RBAVideoData'),
  loading() {
    return minLoading;
  }
});
export const Compact = Loadable({
  loader: () => import('./Compact'),
  loading() {
    return minLoading;
  }
});
export const ContractApproval = Loadable({
  loader: () => import('./ContractApproval'),
  loading() {
    return minLoading;
  }
});
export const PersonnelInformation = Loadable({
  loader: () => import('./PersonnelInformation'),
  loading() {
    return minLoading;
  }
});
export const HeadquartersManage = Loadable({
  loader: () => import('./HeadquartersManage'),
  loading() {
    return minLoading;
  }
});
export const WzApprove = Loadable({
  loader: () => import('./WzApprove'),
  loading() {
    return minLoading;
  }
});
export const WzAdminApprove = Loadable({
  loader: () => import('./WzAdminApprove'),
  loading() {
    return minLoading;
  }
});
export const WzEquipmentApprove = Loadable({
  loader: () => import('./WzEquipmentApprove'),
  loading() {
    return minLoading;
  }
});
export const WzImportApprove = Loadable({
  loader: () => import('./WzImportApprove'),
  loading() {
    return minLoading;
  }
});
export const OnlineTrainingManager = Loadable({
  loader: () => import('./OnlineTrainingManager'),
  loading() {
    return minLoading;
  }
});
export const MyAssessmentTable = Loadable({
  loader: () => import('./MyAssessmentTable'),
  loading() {
    return minLoading;
  }
});
export const DirectlyUnderTarget = Loadable({
  loader: () => import('./DirectlyUnderTarget'),
  loading() {
    return minLoading;
  }
});
export const EvaluateManage = Loadable({
  loader: () => import('./EvaluateManage'),
  loading() {
    return minLoading;
  }
});
export const Cloth = Loadable({
  loader: () => import('./Cloth'),
  loading() {
    return minLoading;
  }
});
export const WeeklySettlement = Loadable({
  loader: () => import('./WeeklySettlement'),
  loading() {
    return minLoading;
  }
});
export const SubordinateAchievements = Loadable({
  loader: () => import('./SubordinateAchievements'),
  loading() {
    return minLoading;
  }
});
export const AchievementResult = Loadable({
  loader: () => import('./AchievementResult'),
  loading() {
    return minLoading;
  }
});
export const AchievementsGradeAppraising = Loadable({
  loader: () => import('./AchievementsGradeAppraising'),
  loading() {
    return minLoading;
  }
});
export const WageCardInformation = Loadable({
  loader: () => import('./WageCardInformation'),
  loading() {
    return minLoading;
  }
});
export const PersonnelImport = Loadable({
  loader: () => import('./PersonnelImport'),
  loading() {
    return minLoading;
  }
});
export const S1S2RecruitApply = Loadable({
  loader: () => import('./S1S2RecruitApply'),
  loading() {
    return minLoading;
  }
});
export const StaffCommunicationRecord = Loadable({
  loader: () => import('./StaffCommunicationRecord'),
  loading() {
    return minLoading;
  }
});
export const StaffComplain = Loadable({
  loader: () => import('./StaffCommunicationRecord/StaffComplain'),
  loading() {
    return minLoading;
  }
});
export const ChartCommunication = Loadable({
  loader: () => import('./ChartCommunication'),
  loading() {
    return minLoading;
  }
});
export const ReplyComplain = Loadable({
  loader: () => import('./ReplyComplain'),
  loading() {
    return minLoading;
  }
});

export const MyApplication = Loadable({
  loader: () => import('./MyApplication'),
  loading() {
    return minLoading;
  }
});

export const SignPrint = Loadable({
  loader: () => import('./SignPrint'),
  loading() {
    return minLoading;
  }
});
export const PersonnelChangeHistory = Loadable({
  loader: () => import('./PersonnelChangeHistory'),
  loading() {
    return minLoading;
  }
});

export const ADPExport = Loadable({
  loader: () => import('./ADPExport'),
  loading() {
    return minLoading;
  }
});

export const HRManagerProbation = Loadable({
  loader: () => import('./Probation/HRManagerProbation'),
  loading() {
    return minLoading;
  }
});

export const ChiefInspectorProbation = Loadable({
  loader: () => import('./Probation/ChiefInspectorProbation'),
  loading() {
    return minLoading;
  }
});

export const AnnualLeaveQuery = Loadable({
  loader: () => import('./AnnualLeaveQuery'),
  loading() {
    return minLoading;
  }
});
export const AnnualLeaveManage = Loadable({
  loader: () => import('./AnnualLeaveManage'),
  loading() {
    return minLoading;
  }
});

export const OnDutyTrainingApp = Loadable({
  loader: () => import('./OnDutyTrainingApp'),
  loading() {
    return minLoading;
  }
});

export const IIVIInfo = Loadable({
  loader: () => import('./IIVIInfo'),
  loading() {
    return minLoading;
  }
});

export const BUCODEInfo = Loadable({
  loader: () => import('./BUCODEInfo'),
  loading() {
    return minLoading;
  }
});
export const RecruitmentNeeds = Loadable({
  loader: () => import('./RecruitmentNeeds'),
  loading() {
    return minLoading;
  }
});
export const ExportPersonnelChanges = Loadable({
  loader: () => import('./ExportPersonnelChanges'),
  loading() {
    return minLoading;
  }
});

export const NoFeedbackFromInternalTraining = Loadable({
  loader: () => import('./NoFeedbackFromInternalTraining'),
  loading() {
    return minLoading;
  }
});

export const HolidayBalanceQuery = Loadable({
  loader: () => import('./HolidayBalanceQuery'),
  loading() {
    return minLoading;
  }
});

export const HRLeaveApp = Loadable({
  loader: () => import('./HRLeaveApp'),
  loading() {
    return minLoading;
  }
});

export const MonthlySettlementLock = Loadable({
  loader: () => import('./MonthlySettlementLock'),
  loading() {
    return minLoading;
  }
});

export const OfficeSupply = Loadable({
  loader: () => import('./OfficeSupply'),
  loading() {
    return minLoading;
  }
});
export const ShVisit = Loadable({
  loader: () => import('./ShVisit'),
  loading() {
    return minLoading;
  }
});
export const AccessControl = Loadable({
  loader: () => import('./AccessControl'),
  loading() {
    return minLoading;
  }
});
export const ConstructionList = Loadable({
  loader: () => import('./ConstructionList'),
  loading() {
    return minLoading;
  }
});

export const NewSignPrint = Loadable({
  loader: () => import('./NewSignPrint'),
  loading() {
    return minLoading;
  }
});
export const ShVisitApprove = Loadable({
  loader: () => import('./ShVisitApprove'),
  loading() {
    return minLoading;
  }
});
export const ShVisitManager = Loadable({
  loader: () => import('./ShVisitManager'),
  loading() {
    return minLoading;
  }
});
export const DoorManagement = Loadable({
  loader: () => import('./DoorManagement'),
  loading() {
    return minLoading;
  }
});
export const PunishmentHistory = Loadable({
  loader: () => import('./PunishmentHistory'),
  loading() {
    return minLoading;
  }
});
export const ShVisitorAuth = Loadable({
  loader: () => import('./ShVisitorAuth'),
  loading() {
    return minLoading;
  }
});
export const DoorConfirmation = Loadable({
  loader: () => import('./DoorConfirmation'),
  loading() {
    return minLoading;
  }
});
export const VisitorMeal = Loadable({
  loader: () => import('./VisitorMeal'),
  loading() {
    return minLoading;
  }
});
export const OutdateMaterial = Loadable({
  loader: () => import('./OutdateMaterial'),
  loading() {
    return minLoading;
  }
});
export const VisitorPunch = Loadable({
  loader: () => import('./VisitorPunch'),
  loading() {
    return minLoading;
  }
});
export const AttendanceRepo2 = Loadable({
  loader: () => import('./AttendanceRepo2'),
  loading() {
    return minLoading;
  }
});