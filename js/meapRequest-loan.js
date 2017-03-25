/**
 * Created by lei on 1/8/16.
 *
 */


/*人行征信搜索*/
function findCreditReportInquiryFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IPbcCreditReferenceService","findCreditReportInquiry","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*人行征信删除*/
function delCreditReportInquiryFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IPbcCreditReferenceService","delCreditReportInquiry","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*人行征信新查询*/
function createCreditReportInquiryFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IPbcCreditReferenceService","createCreditReportInquiry","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*银行对账单查询*/
function findStatementFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IBankStatementService","findStatement","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*银行对账单删除*/
function delStatementFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IBankStatementService","delStatement","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*银行对账单新查询*/
function createStatementFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IBankStatementService","createStatement","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*卡账号查询*/
function getDocLicenceListBankFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.debit_card.service.IBlackInfoValidService","getDocLicenceList","debit_card",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*贷款产品查询*/
function getLoanProductListFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.ILoanProductService","getLoanProductList","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*信用贷款产品查询*/
function getCreditLoanProductListFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.ILoanProductService","getCreditLoanProductList","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*贷款人信息查询*/
function findLenderInfoFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IBorrowerInfoService","findLenderInfo","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*贷款人信息查询 LOS AND ICBS*/
function queryLoanCustomerInfoFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.portal.service.IMeapCustomerInfoService","queryCustomerInfo","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*楼盘信息查询*/
function findBuildingInfoFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IBorrowerInfoService","findBuildingInfo","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*添加楼盘信息*/
function insertBuildingInfoFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IBorrowerInfoService","insertBuildingInfo","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*删除楼盘信息*/
function deleteBuildingInfoFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IBorrowerInfoService","deleteBuildingInfo","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*同步楼盘信息查询*/
function seekBuildingInfoFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IBorrowerInfoService","seekBuildingInfo","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*贷款进度查询*/
function ProcessQueryFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IProcessQueryService","processQuery","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*更新贷款人信息*/
function updateLenderInfoFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IBorrowerInfoService","updateLenderInfo","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*申请贷款 ===========修改前*/
//function applyLendingLoanFun(bodyJson,successCallBack,failureCallBack){
//    bodyJson = JSON.stringify(bodyJson);
//    var sessionLost = new SessionLost(successCallBack,failureCallBack);
//    Meap.httpRequest("com.nqsky.service.loans.service.IMoneyLendingService","applyLending","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
//}
/*申请贷款 ===========修改后*/
function applyLendingLoanFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IMoneyLendingService","applyLending","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*贷款申请表*/
function lendingInfoFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IMoneyLendingService","lendingInfo","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*面谈笔录*/
function investigativeRecordFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IMoneyLendingService","investigativeRecord","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*征信授权书*/
function accreditFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IPbcCreditReferenceService","accredit","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/**
 * 文件资料清单查询
 */
function getMaterialListFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.portal.service.IMaterialListService","getMaterialList","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*获取平台流水号 ----公共借口*/
function getPlatGlobalSeqFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.portal.service.IGlobalSeqService","getPlatGlobalSeq","portal",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}


/**
 * 贷款面签借口
 */

//查询合同号
function findOrdersFaceSignFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IContractService","findOrders","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
//查询合同对应的角色信息
function findRolesFaceSignFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IContractService","findRoles","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
//面签
function signAContractFaceSignFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.IContractService","signAContract","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

//小微贷款产品查询*/
function findTinyLoanList(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.ILoanProductService","findTinyLoanList","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
//小贷系统查询
function findLenderInfoSmallLoanFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.ITinyLoanService","findLender","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
//小贷系统更新
function updateLenderInfoSmallLoanFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.ITinyLoanService","modLenderInfo","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*建立小贷客户信息 建完后不立刻开卡*/
function addCreateLenderInfo(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.ITinyLoanService","createLenderInfo","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);

}
/*小贷提交*/
function tinyLoanApplingFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.ITinyLoanService","tinyLoanAppling","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);

}
/*小贷查询*/
function findApplicationFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.ITinyLoanService","findApplication","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);

}

/*小微贷获取评分卡*/
function queryScoreItemFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.ITinyLoanScoreCardService","queryScoreItem","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*小微贷提交评分卡*/
function createAndCalculateScoreCardFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.ITinyLoanScoreCardService","createAndCalculateScoreCard","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*小贷客户信息管理*/
function tinyLoanCusManage(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.ITinyLoanService","createCustomerInfo","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);

}

/*小贷客户信息管理判断客户是否补签*/
function smllLoanCheckCustomerFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.ITinyLoanService","checkCustomer","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);

}

/*信用贷款补充资料获取可补件清单*/
function CreditloanAddDataQueryMenuIdFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.loans.service.ICreditLoanProgressService","querymenuId","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*查询评分卡信息*/
function queryCreditLoanScoreCardInfo(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.loans.service.ITinyLoanScoreCardService","queryScoreItem","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*提交评分卡测算*/
function testCreditLoanScoreCard(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.loans.service.ITinyLoanScoreCardService","createAndCalculateScoreCard","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*生产评分卡PDF*/
function createScoreCardPdfFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.loans.service.IScoreCardPdfService","createScoreCardPdf","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*生产申请表PDF*/
function createApplyInfoPdfFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.loans.service.ICreditLoanService","createApplyInfoPdf","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*查询核心客户等级*/
function queryCoreClientLevelInfoFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.loans.service.ILoanProductService","findProductIsApplyToCustomer","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*信用贷款提交*/
function creditLoanSubmitFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.loans.service.ICreditLoanService","applyCreditLoan","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/** 获取可短信通知征信查询人员 */
function getNoticeCreditUserFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest("com.nqsky.service.loans.service.IPbcCreditReferenceService","getNoticeCreditUser","loans",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}