/**
 * Created by lei on 4/29/16.
 * 理财风评 借口函数
 */

//客户风险等级查询
function getRiskLevelFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.citigold.service.IRiskLevelService','getRiskLevel','citigold',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack)
}

//客户风险等级修改
function updateRiskLevelFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.citigold.service.IRiskLevelService','updateRiskLevel','citigold',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack)
}

//评估问卷查询
function getAssessQuestionFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.citigold.service.IAssessQuestionService','getAssessQuestion','citigold',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack)
}

//客户风险问卷结果查询
function getAssessResultFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.citigold.service.IAssessQuestionService','getAssessResult','citigold',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack)
}

//理财风评结果提交
function autoClientSignFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.citigold.service.IFinancialClientService','getClientInfo','citigold',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack)
}