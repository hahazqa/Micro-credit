/**
 * Created by Administrator on 2015/8/31.
 * named by Lei.
 * meapRequest-dianzi.js锟斤拷锟斤拷签约模锟斤拷Meap锟斤拷锟斤拷.
 */

/*Meap锟斤拷锟斤拷锟斤拷锟矫诧拷锟斤拷锟絤eapRequest.js锟侥硷拷锟铰的癸拷锟矫诧拷锟斤拷*/

/*锟斤拷锟斤拷瞬椋拷锟絤eapRequest-credit.js锟侥硷拷锟铰碉拷icitizenCertificateIdenifyFun锟斤拷锟斤拷锟斤拷*/

/*锟斤拷锟斤拷签约 锟斤拷锟斤拷锟�(锟斤拷meapRequest.js锟侥硷拷锟铰碉拷icustomerInfoServiceFun锟斤拷锟斤拷)*/

/*锟斤拷锟斤拷锟斤拷锟斤拷签约锟斤拷息锟斤拷询*/
function eleGetSignedInfoFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.electronic_channel.service.INetBankProductService','getSignedInfo','electronic_channel',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*锟斤拷锟斤拷锟斤拷签约锟剿伙拷锟斤拷询*/
function eleGetSignedAccountFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.electronic_channel.service.INetBankAccountService','getSignedAccount','electronic_channel',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*锟斤拷锟斤拷锟斤拷锟斤拷锟剿伙拷锟揭匡拷/锟斤拷锟�*/
function eleUpdateAccountAnchoredFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.electronic_channel.service.INetBankAccountService','updateAccountAnchored','electronic_channel',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*锟斤拷锟斤拷锟矫伙拷锟斤拷/锟斤拷锟斤拷*/
function eleUpdateNetBankStateFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.electronic_channel.service.INetBankProductService','updateNetBankState','electronic_channel',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*锟斤拷锟脚革拷锟斤拷签约锟斤拷询*/
function eleGetQueryMassageInquiryFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.electronic_channel.service.IQueryMassagePersonalService','getQueryMassageInquiry','electronic_channel',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*锟斤拷锟剿讹拷锟斤拷签约*/
function eleAddPersonalMassageInquiryFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.electronic_channel.service.IQueryMassagePersonalService','addPersonalMassageInquiry','electronic_channel',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷签约*/
function eleGetSilverNewsSigningFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.electronic_channel.service.IPersonalSilverNewSigningService','getSilverNewSigning','electronic_channel',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack);
}

/*锟斤拷息锟结交 签锟斤拷锟絤eapRequest-credit.js锟侥硷拷锟铰碉拷creditCardIsignatureService锟斤拷锟斤拷锟斤拷*/


/*锟斤拷锟矫接匡拷   影锟斤拷员锟�*/
function eleGetPhotoCompareFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.portal.service.IFaceRecognitionService','getPhotoCompare','portal',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack)
}

/*请求远程复核查询*/
function getTsRevieweleSignFun(bodyJson,successCallBack,failureCallBack){
    bodyJson = JSON.stringify(bodyJson);
    var sessionLost = new SessionLost(successCallBack,failureCallBack);
    Meap.httpRequest('com.nqsky.service.portal.service.IPhotoService','getTsReview','portal',bodyJson,isHttps,encryptionType,isSalt,isCompres,version,sessionLost.successCallBack,sessionLost.failureCallBack)
}