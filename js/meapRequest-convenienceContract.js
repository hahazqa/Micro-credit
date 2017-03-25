/**
 * Created by Administrator on 2016/5/3.
 */

//社保待遇的确认与费用征缴
function treatAssuranceFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.facilitative_contract.service.IFundamentalAssuranceService","treatAssurance","facilitative_contract",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

//获取特色产品的产品列表
function getSpecialtyProductListFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.facilitative_contract.service.ISpecialtyProductService","getSpecialtyProductList","facilitative_contract",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

//客户号查询贷款账号
function getLoansRecordListFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.facilitative_contract.service.IClientLoansNoService","getLoansRecordList","facilitative_contract",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

//特色产品信息提交
function signSpecialtyProductFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.facilitative_contract.service.ISpecialtyProductService","signSpecialtyProduct","facilitative_contract",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
