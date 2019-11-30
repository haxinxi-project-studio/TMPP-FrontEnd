/*
* Api 接口文件
* date 2019-06-12
* author itning
* http://itning.top
*/
'use strict';
//API地址
export const BASE_URL = "http://localhost:8080";
//登录接口
export const CAS_LOGIN_URL = BASE_URL + "/login";
//注销接口
export const CAS_LOGOUT_URL = BASE_URL + "/logout";

//以下所有Api必须带请求头Authorization

export default {
    ///获取所有计划
    getExecutePlans:BASE_URL +'/execute_AllPlan',
        //获取未完成执行计划
    getUndonePlan: BASE_URL + '/undone_execute_plan',
    //下载执行计划
    getDownPlan: BASE_URL + '/down_execute_plan',
    //获取所有授课部门
    getTeachingDepartments: BASE_URL + '/teaching_departments',
    //获取教育层次
    getEducationalLevels: BASE_URL + '/educational_levels',
    //下载执行计划模板
    getDownloadPlanTemplate: BASE_URL + '/download_execute_plan_template',
    //提交执行计划
    postPlan: BASE_URL + '/execute_plan',
    //上传执行计划文件
    postPlanFile: BASE_URL + '/execute_plan_file',
    //全部审核通过
    postExaminationPassed: BASE_URL + '/examination_passed',
    //我的审核
    getMyReview: BASE_URL + '/my_review',
    //是否购买样书
    postBuySampleBook: BASE_URL + '/buy_sample_book',
    //驳回
    postTurnDown: BASE_URL + '/turn_down',
    //获取所有计划列表
    getPlans: BASE_URL + '/execute_plans',
    //删除执行计划
    deletePlans: BASE_URL + '/execute_plan',
    //获取所有学院
    getColleges: BASE_URL + '/colleges',
    //获取执行计划年
    getYear: BASE_URL + '/year',
    //获取计划学期
    getTerm: BASE_URL + '/term',
    //征订教材汇总表格
    getDownBookMaterials: BASE_URL + '/down_book_materials',
    //获取已完成执行计划
    getDonePlan: BASE_URL + '/done_execute_plan',
    //考试/考察/总体订书率表
    getSummaryTable: BASE_URL + '/summary_table',
    //出版社统计数量表
    getPublishingHouseStatistics: BASE_URL + '/publishing_house_statistics',
    //征订教材样书统计表
    getSubscriptionBook: BASE_URL + '/subscription_book',
    //教师领取教材汇总表
    getTeacherReceivingTextbook: BASE_URL + '/teacher_receiving_textbook',
    //学生班级领取教材反馈表
    getStudentTextbook: BASE_URL + '/student_textbook',
    //导出采购教材汇总表
    getProcurementTable: BASE_URL + '/procurement_table',
    //导出征订教材计划表
    getSubscriptionPlan: BASE_URL + '/subscription_plan',
    //查询所有折扣
    getDiscounts: BASE_URL + '/discounts',
    //添加折扣
    postDiscount: BASE_URL + '/discount',
    //删除折扣
    deleteDiscount: BASE_URL + '/discount',
    //修改折扣
    patchDiscount: BASE_URL + '/discount',
    //办公室主任征订教材计划统计表
    getTextbookPlanStatistics: BASE_URL + '/textbook_execute_plan_statistics',
    //办公室主任我的审核
    getDirectorReview: BASE_URL + '/director_review',
    //办公室主任驳回
    postOfficeTurnDown: BASE_URL + '/office_turn_down',
    //办公室主任全部审核通过
    postAllPassed: BASE_URL + '/all_passed',
    //获取课程名称
    getCourseTitles: BASE_URL + '/courseTitles',
    //提交购书信息
    postBookPurchaseInformation: BASE_URL + '/book_purchase_information',
    //我的购书
    getPurchaseBook: BASE_URL + '/purchase_book',
    //修改购书
    patchPurchase: BASE_URL + '/purchase',
}
