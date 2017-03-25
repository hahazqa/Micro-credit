//基金理财产品信息查询
function IFinancialProductsServiceFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest('com.nqsky.service.citigold.service.IFinancialProductsService','queryFinacialProducts','citigold',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
//客户签约信息查询
function ICustomerInformationInquiryServiceFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest('com.nqsky.service.citigold.service.ICustomerInformationInquiryService','getCustomerInformation','citigold',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

//客户签约
function IClientSignServiceFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    //alert('客户签约'+bodyJson);
	Meap.httpRequest('com.nqsky.service.citigold.service.IClientSignService','clientSign','citigold',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
//客户所有银行账号
function INetBankProductServiceFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.debit_card.service.IBlackInfoValidService','getDocLicenceList','debit_card',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
//客户银行账号签约状态
function IClientSignBankAccountServiceFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest('com.nqsky.service.citigold.service.IClientSignBankAccountService','getClientSignBankAccount','citigold',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
//基金修改风险等级
function IChangeRiskLevelServiceFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    //alert('基金修改风险等级'+bodyJson)
	Meap.httpRequest('com.nqsky.service.citigold.service.IChangeRiskLevelService','UpdateRiskLevel','citigold',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}


//基金购买
function IFinancialProductsServiceBuyFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    //alert('基金购买参数'+bodyJson)
	Meap.httpRequest('com.nqsky.service.citigold.service.IFinancialProductsService','buyFinancialProducts','citigold',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
//基金定投
function IRegularQuotaOpenServiceDtFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    //alert('基金定投参数'+bodyJson)
	Meap.httpRequest('com.nqsky.service.citigold.service.IRegularQuotaOpenService','openReqularInvestment','citigold',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
//查询待签约账号开卡机构查询
function ichannelQueryServiceFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    //alert(bodyJson);
    Meap.httpRequest('com.nqsky.service.portal.service.IChannelQueryService','channelQuery','portal',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
//查询客户委托查询
function icustomerCurrentEntrustServiceFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    //alert(bodyJson);
    Meap.httpRequest('com.nqsky.service.citigold.service.ICustomerCurrentEntrustService','getCustomerEntrustRecord','citigold',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*基金产品说明书基本信息*/
function getProductInstructionFun(bodyJson,successCallBack,failureCallBack){
    bodyJson=JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.citigold.service.IProductInstructionService','getProductInstruction','citigold',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*基金产品说明书基本走势*/
function getFundProdNavTrendFun(bodyJson,successCallBack,failureCallBack){
    bodyJson=JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.citigold.service.IProductInstructionService','getFundProdNavTrend','citigold',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*基金历史净值查询*/
function getProductNavHistoryFun(bodyJson,successCallBack,failureCallBack){
    bodyJson=JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.citigold.service.IProductInstructionService','getProductNavHistory','citigold',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*查询TA代码及基金公司名称*/
function getTaInformationFun(bodyJson,successCallBack,failureCallBack){
    bodyJson=JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.citigold.service.ITaInformationInquiryService','getTaInformation','citigold',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
//基金信息比较
function compareFinancialProductFun(bodyJson,successCallBack,failureCallBack){
    bodyJson=JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.citigold.service.IFinancialProductsService','compareFinancialProduct','citigold',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}





