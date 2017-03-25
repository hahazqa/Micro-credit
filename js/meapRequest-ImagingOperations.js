/**
 * Created by ASUS on 2016/4/8.
 */
/*运营影像信息保存*/
function saveOperateVideoFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest('com.nqsky.service.oper_video.service.IOperateVideoService','saveOperateVideo','oper_video',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*对公账号查询*/
function queryCompanyAcctNoFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest('com.nqsky.service.portal.service.IQueryCompanyAcctNoService','queryCompanyAcctNo','portal',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}/*对公账号查询明细信息*/
function queryCompanyAcctNoDetailFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest('com.nqsky.service.portal.service.ICompanyAcctNoDetailService','queryCompanyAcctNoDetail','portal',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}