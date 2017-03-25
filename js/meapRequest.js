/*meap http请求*/
//var pathName=window.document.location.pathname;
//var projectName=pathName.substring(0,pathName.indexOf('www')+4);
//alert(projectName);
//document.write('<script type="text/javascript" src="'+ projectName +'js/page-cache.js"></script>');
//公用参数
var version="";
var isHttps ="02";
var encryptionType="01";
var isSalt="false";
var isCompres="false";

/* 登录 */
function login(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.ISysUserService","login","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*获取客户经理统计数据*/
function ISysUserServiceStatisticsFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.ISysUserService","getUserStatisticsData","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/* 修改密码 */
function changePwd(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.ISysUserService","changePwd","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}


/* 退出登录 */
function loginOut(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.ISysUserService","loginOut","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/* 登录成功后用户获取权限菜单信息 */
function ipermissionServiceFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.IPermissionService","getPermission","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/* 人脸识别登录 */
function ifacelRecognitionSeFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.IFaceRecognitionService","getPhotoCompare","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/* 工作提醒 */
function IJobAlertsServiceFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IJobAlertsService","getJobAlertList","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*新增工作提醒*/
function addJobAlertListFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IJobAlertsService","addJobAlerts","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*删除工作提醒*/
function deleteJobAlertListFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IJobAlertsService","deleteJobAlerts","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/* 展品展业 */
function iproductServiceFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IProductService","getProductInfo","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/* 产品展业图片信息 */
function IProductServiceImgFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IProductService","getProductPicture","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/* 我们的银行登陆前 */
function IOurBankServiceListFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IOurBankService","getOurBankList","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/* 我们的银行 */
function IOurBankServiceFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IOurBankService","getOurBank","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/* 我们的银行大图 */
function getMarkPictureFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IOurBankService","getMarkPicture","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/* 获取我们的银行和产品展业中需要更新 的类型 */
function getNeedUpdateTypeFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.workbench.service.IOurBankService","getNeedUpdateType","workbench",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*虚拟卡列表*/
function idebitCardProductServiceFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.debit_card.service.IDebitCardProductService","getDebitProductList","debit_card",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*终止活动客户号*/
/*function icardClientServiceFun(bodyJson,successCallBack,failureCallBack) {
	Meap.httpRequest("com.nqsky.service.debit_card.service.ICardClientService","stopActivity","debit_card",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,successCallBack,failureCallBack);
}*/
/*个人活期卡开户*/
/*function ipersonalCurrentCardServiceFun(bodyJson,successCallBack,failureCallBack) {
	Meap.httpRequest("com.nqsky.service.debit_card.service.IPersonalCurrentCardService","createPersonalCurrentCard","debit_card",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,successCallBack,failureCallBack);
}*/
/*创建虚拟卡*/
function ipersonalCurrentCardServiceFun(bodyJson,successCallBack,failureCallBack) {
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.debit_card.service.IVirtualCardProductService","createVirtualCardProduct","debit_card",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*建立客户信息*/
/*function iestablishCustomerInformationServiceFun(bodyJson,successCallBack,failureCallBack) {
	Meap.httpRequest("com.nqsky.service.debit_card.service.IEstablishCustomerInformationService","getCustomerInformation","debit_card",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,successCallBack,failureCallBack);
}*/
/*获取短信验证码*/
function imessageAuthentionServiceFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.IMessageAuthentionService","getMessageAuthention","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*验证短信验证码*/
function imessageAuthentionServiceYFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.IMessageAuthentionCodeService","getMessageAuthentionCode","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*虚拟卡签发地区查询*/
function ifrp005ServicePFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.IFrp005Service","getIssPlaceList","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*虚拟卡职业查询*/
function ifrp005ServiceCFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.IFrp005Service","getOccupationList","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*虚拟卡客户信息组合查询及有效凭证数量校验 查核心*/
function icustomerInfoServiceFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.ICustomerInfoService","getCustomerInfo","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*黑名单信息校验*/
function iblackInfoValidServiceFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.debit_card.service.IBlackInfoValidService","validBlackList","debit_card",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*查询客户信通数字卡*/
function getXinKaServiceFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.debit_card.service.IBlackInfoValidService","getCustomerXinKa","debit_card",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}


/*虚拟卡建立客户信息*/
function iestablishCustomerInformationServiceFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	//alert(bodyJson+"0");
	Meap.httpRequest("com.nqsky.service.debit_card.service.IEstablishCustomerInformationService","getCustomerInformation","debit_card",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);

}
/*建立客户信息 建完后不立刻开卡*/
function addEstablishCustomerInfo(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.ICustomerInfoService","establishCustomerInfo","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);

}
/*虚拟卡获取卡号*/
function idebitCardInfoServiceFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	//alert(bodyJson);
	Meap.httpRequest("com.nqsky.service.debit_card.service.IDebitCardInfoService",
		"getOneWaitingDebitCardNo","debit_card",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*维护客户信息*/
function iestablishCustomerInformationServiceWFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	//alert(bodyJson+"1");
	Meap.httpRequest("com.nqsky.service.debit_card.service.IEstablishCustomerInformationService",
		"updateCustomerInformation","debit_card",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*客户维护信息查询－－公共的就接口*/
function IEstablishCustomerInformationServiceFFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.debit_card.service.IEstablishCustomerInformationService",
		"findCustomerInformation","debit_card",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
} 
/*客户维护信息查询－－信通数字卡学习平台*/
function IEstablishCustomerInformationServicetWOFFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest('com.nqsky.service.portal.service.IMeapCustomerInfoService','queryCustomerInfo','portal',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
} 
/*电话银行设置密码*/
function IAskTelPhPwdServiceFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.IAskTelPhPwdService",
		"askPwd","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*电话银行获取密码*/
function IAskTelPhPwdServiceGFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.IAskTelPhPwdService",
		"getPwd","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}  
/*影像两两对比*/
/*function IFaceRecognitionServiceTFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	alert(bodyJson)
	Meap.httpRequest("com.nqsky.service.portal.service.IFaceRecognitionService",
		"getPhotoCompare","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,successCallBack,failureCallBack);
} */
/*远程复核*/
function iissuesServiceFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	//alert(bodyJson);//pushForUser
	Meap.httpRequest("com.nqsky.service.portal.service.IPhotoService",
		"askTsReview","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
} 
/*取消远程复核*/
function iphotoServiceStopFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	//alert(bodyJson);//pushForUser
	Meap.httpRequest("com.nqsky.service.portal.service.IPhotoService",
		"dropTsReviewId","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
} 
/*获取远程复核客户经理列表*/
function ISysUserServiceManListFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.ISysUserService","findTsReviewers","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/* CRM登陆 */
function crmLogin(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.mobile_crm.service.ICrmRequestService","crmLogin","mobile_crm",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/* CRM请求 */
function crmRequest(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.mobile_crm.service.ICrmRequestService","crmRequest","mobile_crm",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/* 保存身份证联网核查异常信息*/
function addCheckCitizenExceptionFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.ICheckCitizenExceptionService","addCheckCitizenException","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/* ding2016.3.19查询影像文件未上传个数*/
function queryNotUploadFileCountFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.IQueryNotUploadFileService","queryNotUploadFileCount","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/* 特惠商户信息汇总查询*/
function getExmerchantgatherQueryFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.exmerchant.service.IExmerchantQueryService","getExmerchantgatherQuery","exmerchant",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/* 特惠商户详细信息查询*/
function getExmerchantdetailQueryFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.exmerchant.service.IExmerchantdetailQueryService","getExmerchantdetailQuery","exmerchant",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/* 特惠商户信息更新*/
function updateExmerchantFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.exmerchant.service.IExmerchantUpdateService","updateExmerchant","exmerchant",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/** 获取行政区划代码 */
function getAreaCodeFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.portal.service.ISdicService","getAreaCode","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
