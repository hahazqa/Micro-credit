//接口 方法 组
var ICardProductServiceInterface='com.nqsky.service.credit_card.service.ICardProductService';
var getProductListMethod='getProductList';
var credit_cardGroup='credit_card';

/*信用卡产品列表*/
function icardProductServiceFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest(ICardProductServiceInterface,getProductListMethod,credit_cardGroup,bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*信用卡联网核查*/
function icitizenCertificateIdenifyFun(bodyJson,successCallBack,failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest('com.nqsky.service.portal.service.ICitizenCertificateIdentifyService','checkCitizenCertificateID','portal',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*该接口用于查询卡列表，通过请求条件返回查询的卡列表*/
function icreditCardServiceFun(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest('com.nqsky.service.credit_card.service.ICreditCardService','getCardList','credit_card',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*信息提交 个人信息*/
function creditCardICardClaimsService(bodyJson,successCallBack,failureCallBack){
	bodyJson = JSON.stringify(bodyJson);
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
	Meap.httpRequest('com.nqsky.service.credit_card.service.ICardClaimsService','addCardClaimsInfo','credit_card',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
/*信息提交 签名 */
function creditCardIsignatureService(fileName,parma,otherStr,base64Str,successCallBack,failureCallBack){
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
    signUpLoad('com.nqsky.service.portal.service.ISignatureService','addAttachInfo','portal',version,'YES',fileName,parma,otherStr,base64Str, sessionLost.successCallBack, sessionLost.failureCallBack) 
}
//影像上传
function creditImageUpload(otherStr,dict, successCallBack,failureCallBack){
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.NSMeapImageUpload(otherStr,dict,sessionLost.successCallBack ,sessionLost.failureCallBack)
}
//信用卡核心-客户信息查询-手机号码  教育程度   住宅类型   E-MAIL   单位全称    单位固话   单位性质    年收入  行业类别(就业状态+单位性质 判断) 
//function creditICcCtInfoServiceFun(bodyJson,successCallBack,failureCallBack) {
//	var sessionLost = new SessionLost(successCallBack,failureCallBack);
//  bodyJson = JSON.stringify(bodyJson);
//	Meap.httpRequest('com.nqsky.service.credit_card.service.ICcCtInfoService','getCtInfo','credit_card',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
//}

////2016-3-11修改／／信用卡核心-客户信息查询-手机号码  教育程度   住宅类型   E-MAIL   单位全称    单位固话   单位性质    年收入  行业类别(就业状态+单位性质 判断) 
function queryCustomerInfoFun(bodyJson,successCallBack,failureCallBack) {
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
    bodyJson = JSON.stringify(bodyJson);
	Meap.httpRequest('com.nqsky.service.portal.service.IMeapCustomerInfoService','queryCustomerInfo','portal',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
//信用卡核心-客户联系人信息查询--紧急联系人姓名        紧急联系人手机
function creditICcCtAddrRelInfoServiceCtRelInfoFun(successCallBack,failureCallBack) {
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
    var bodyJson = {
        "b": [{
            "IDTYPE.s": "0", //证件类型
            "IDNO.s": creditJson.storage.CERTNUM, //证件号
            "deviceNo.s": creditJson.storage.deviceNo, //设备编号
            "orgId.s": creditJson.storage.orgId,
            "moduleId.s": creditJson.storage.moduleID, //模块编号
            "tranId.s": creditJson.storage.tranId, //交易编号
            "operatorNo.s": creditJson.storage.operatorNo //操作员
        }]
    };
    bodyJson = JSON.stringify(bodyJson);
	Meap.httpRequest('com.nqsky.service.credit_card.service.ICcCtAddrRelInfoService','getCtRelInfo','credit_card',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}
//信用卡核心-客户地址信息查询-：户籍所在地(详细信息这一字段)      邮编    户籍地址  通讯地址*（取公司地址）
function creditICcCtAddrRelInfoServiceCtAddrInfoFun(successCallBack,failureCallBack) {
    var bodyJson = {
        "b": [{
            "IDTYPE.s": "0", //证件类型
            "IDNO.s": creditJson.storage.CERTNUM, //证件号
            "deviceNo.s": creditJson.storage.deviceNo, //设备编号
            "orgId.s": creditJson.storage.orgId,
            "moduleId.s": creditJson.storage.moduleID, //模块编号
            "tranId.s": creditJson.storage.tranId, //交易编号
            "operatorNo.s": creditJson.storage.operatorNo //操作员
        }]
    };
    bodyJson = JSON.stringify(bodyJson);
	Meap.httpRequest('com.nqsky.service.credit_card.service.ICcCtAddrRelInfoService','getCtAddrInfo','credit_card',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,successCallBack,failureCallBack);
}
//信用卡核心-自动还款查询
function creditICcCtAddrRelInfoServiceCtAcctInfoFun(successCallBack,failureCallBack) {
	var sessionLost = new SessionLost(successCallBack,failureCallBack);
    var bodyJson = {
        "b": [{
            "IDTYPE.s": "0", //证件类型
            "IDNO.s": creditJson.storage.CERTNUM, //证件号
            "deviceNo.s": creditJson.storage.deviceNo, //设备编号
            "orgId.s": creditJson.storage.orgId,
            "moduleId.s": creditJson.storage.moduleID, //模块编号
            "tranId.s": creditJson.storage.tranId, //交易编号
            "operatorNo.s": creditJson.storage.operatorNo //操作员
        }]
    };
    bodyJson = JSON.stringify(bodyJson);
	Meap.httpRequest('com.nqsky.service.credit_card.service.ICcCtAddrRelInfoService','getCtAcctInfo','credit_card',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*信用卡进度查询*/
function getCardApplicationFun(bodyJson, successCallBack, failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.credit_card.service.ICardApplicationService', 'getCardApplication', 'credit_card', bodyJson, isHttps, encryptionType, isSalt, isCompres, version,sessionLost.successCallBack, sessionLost.failureCallBack);
}

/*信用卡待补件查询*/
function findAdditionalsFun(bodyJson, successCallBack, failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.credit_card.service.ICreditCardService', 'findAdditionals', 'credit_card', bodyJson, isHttps, encryptionType, isSalt, isCompres, version,sessionLost.successCallBack, sessionLost.failureCallBack);
}

/*信用卡异常处理*/
function ICardClaimsServiveFun(bodyJson, successCallBack, failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.credit_card.service.ICardClaimsService', 'showState', 'credit_card', bodyJson, isHttps, encryptionType, isSalt, isCompres, version,sessionLost.successCallBack, sessionLost.failureCallBack);
}

/*修改信用卡申请状态*/
function updateScheduleStatusFun(bodyJson, successCallBack, failureCallBack) {
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.credit_card.service.ICreditCardService', 'updateScheduleStatus', 'credit_card', bodyJson, isHttps, encryptionType, isSalt, isCompres, version,sessionLost.successCallBack, sessionLost.failureCallBack);
}