/*获取客户订单列表*/
function getClientOrderListFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.integral.service.IOrderService","getClientOrderList","integral",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*订单确认收货/取消/退货操作*/
function orderOperateFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.integral.service.IOrderService","orderOperate","integral",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*获取积分明细*/
function getIntegralDetailFun(bodyJson,successCallBack,failureCallBack) {
	bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.integral.service.IIntegralService","getIntegralDetail","integral",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*获取礼品信息列表*/
function getGiftListFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.integral.service.IGiftService","getGiftList","integral",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*获取礼品拓展信息列表*/
function getGiftExpListFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.integral.service.IGiftService","getGiftExpList","integral",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*礼品兑换*/
function exchangeGiftFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.integral.service.IGiftService","exchangeGift","integral",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*获取需要更新的礼品*/
function getNeedUpdateGiftFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.integral.service.IGiftService","getNeedUpdateGift","integral",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*获取需要更新的礼品*/
function getPopularityGiftFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest("com.nqsky.service.integral.service.IGiftService","getPopularityGiftList","integral",bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
