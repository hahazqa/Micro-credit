/*业务办理情况查询*/
function ibussinessDetailServiceFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
	//alert(bodyJson);
	Meap.httpRequest("com.nqsky.service.workbench.service.IBussinessDetailService","findBussinessDetail","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*我的工作证*/
function imyWorkPermitServiceFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
	//alert(bodyJson);
	Meap.httpRequest("com.nqsky.service.workbench.service.IMyWorkPermitService","getMyWorkPermit","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*我的业绩*/
function IBussinessMetricsServiceFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
	//alert(bodyJson);
	Meap.httpRequest("com.nqsky.service.workbench.service.IBussinessMetricsService","findBussinessMetrics","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*通知公告列表*/
function inoticeServiceFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
	//alert(bodyJson);
	Meap.httpRequest("com.nqsky.service.workbench.service.INoticeService","getNoticeList","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*通知公告详情*/
function inoticeServiceDetailFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
	//alert(bodyJson);
	Meap.httpRequest("com.nqsky.service.workbench.service.INoticeService","getNoticeDetail","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*脱机提交*/
function IHandleOfflineBussServiceFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
	//alert(bodyJson);
	Meap.httpRequest("com.nqsky.service.credit_card.service.IHandleOfflineBussService","handleOfflineBuss","credit_card",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*通知公告下载附件*/
function getFileDataFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.IFileDownloadService","getFileData","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
//平台脱机列表查询
function ptQueryOfflineBussFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.credit_card.service.IHandleOfflineBussService","queryOfflineBuss","credit_card",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
//平台脱机详情
function ptQueryOfflineBussDetail(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.credit_card.service.IHandleOfflineBussService","getOfflineBussByPlseq","credit_card",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
//平台脱机业务状态修改
function dealOfflineBussFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.credit_card.service.IHandleOfflineBussService","dealOfflineBuss","credit_card",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

//查询贷款利率列表
function ILoanRateServiceFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	//var sessionLost = new SessionLost(successCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.ILoanRateService","getLoanRateList","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,successCallBack,failureCallBack);
}
//查询存款利率列表
function IMcRateServiceFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	//var sessionLost = new SessionLost(successCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IMcRateService","getMcRateList","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,successCallBack,failureCallBack);
}
//外汇牌价列表
function IExchangeQuotationServiceFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	//var sessionLost = new SessionLost(successCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IExchangeQuotationService","getExchangeQuotation","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,successCallBack,failureCallBack);
}

//人脸登录注册
function IFaceRecognitionServiceRegFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.IFaceRecognitionService","faceRegister","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

//业务办理明细
function findCreditCardDetailFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IBussinessDetailService","findCreditCardDetail","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
//运营视频业务办理明细
function getOperateVideo(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.oper_video.service.IOperateVideoService","getOperateVideo","oper_video",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}


/**
 * 
 * 工作日志
 * 
 * */
//工作日志详情
function getJobLogInfoFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IJobLogService","getJobLogInfo","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

//工作分类占比统计
function getClassifyStatisticsFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IJobLogService","getClassifyStatistics","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

//工作总完成度统计
function getItemIsCompleteStatisticsFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IJobLogService","getItemIsCompleteStatistics","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

//根据用户角色等级获取机构列表
function getOrgListFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.IOrgService","getOrgList","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

//根据角色等级获取对应的用户列表
function getListSysUserFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.ISysUserService","getListSysUser","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

//添加工作日志
function addJobLogFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IJobLogService","addJobLog","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

//修改工作日志
function updateJobLogFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IJobLogService","updateJobLog","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

//删除工作日志
function deleteJobLogFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IJobLogService","deleteJobLog","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

//查询日志分类概述
function getListJobLogInfoFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IJobLogService","getListJobLogInfo","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

//查询工作分类列表
function getClassifyByUserRoleFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IJobLogService","getClassifyByUserRole","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}


//工作分类下的工作项目
function getJobLogItemsFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IJobLogService","getItems","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/* 20160526--麦田*/
/* 工作轨迹信息获取*/
function getJobTrajectoryQueryFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IBussinessDetailService","workLocus","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}