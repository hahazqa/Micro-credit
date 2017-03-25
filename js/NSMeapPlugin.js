function NSMeapPlugin()
{

}

var Meap  = new NSMeapPlugin();
NSMeapPlugin.prototype.alert = function(args)
{
alert(args);
};

/**
 *  @brief  网络检测
 *
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *
 *  @return 01  02  03   代表01:wifi  02:3G 03: noConnect
 */
NSMeapPlugin.prototype.isNetConnect = function(successCallback,failureCallback)
{
//    return  cordova.exec(function (msg){alert(msg)},failureCallback,'NSMeapPasswordLock','showPasswordLock',[]);
    
    var path = "/Users/yalin/Library/Application Support/iPhone Simulator/7.0.3-64/Applications/FC724AAD-4CFC-461A-9FAC-99267AF4CAB0/Cordova_TEST.app/office文档编辑解决方案.docx"
    
//    var path = "/var/mobile/Applications/C04FE3A0-E9B6-4740-A9F9-0485B0BC22A6/Cordova_TEST.app/office文档编辑解决方案.docx"
    
//    return  cordova.exec(function (msg){alert(msg)},failureCallback,'NSMeapEditOfficeFile','editOfficeFile',[path]);
    
//    return  cordova.exec(function (msg){alert(msg)},failureCallback,'NSMeapScanOfficeFile','scanOfficeFile',[path]);
    
//    return  cordova.exec(function (msg){alert(msg)},failureCallback,'acdkjfj','greagjerafjeiao',['10']);
    
    return  cordova.exec(successCallback,failureCallback,'NSMeapNetworkStatus','isNetConnect',[]);
};

/**
 *  @brief  二维码插件---扫描二维码
 *
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *
 *  @return 扫描的结果信息
 */
NSMeapPlugin.prototype.scanQRCodeWithController = function(successCallback, failureCallback)
{
    return  cordova.exec(successCallback,failureCallback,'NSMeapQRCode','scanQRCodeWithController',[]);
};


/**
 *  @brief  二维码插件---字符串生成二维码图片
 *
 *  @param  text    文本信息
 *  @param  size    生成的图片大小
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *
 *  @return 图片的保存路径
 */
NSMeapPlugin.prototype.qrImageForString = function(text,size, successCallback, failureCallback)
{
    return cordova.exec(successCallback,failureCallback,'NSMeapQRCode','qrImageForString',[text,size]);
}

/**
 *  @brief  打电话
 *
 *  @param  phoneNum    电话号码
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *
 *  @return 
 */
NSMeapPlugin.prototype.callTelPhone = function(phoneNum, successCallback, failureCallback)
{
    return cordova.exec(successCallback,failureCallback,'NSMeapTelPhone','callPhone',[phoneNum]);
}





/**
 *  @brief  媒体库
 *
 *  @param  action  方法名（camera 调用照像机  picture 调用图库  video 调用录像  audio录音 playaudio播放录音）
 *  @param  filename    文件名称
 *  @param  successCallback     回调方法
 *  @param  failureCallback     失败回调
 *
 *  @return 
 */
NSMeapPlugin.prototype.media = function(action,filename, successCallback, failureCallback)
{
    return cordova.exec(successCallback,failureCallback,'NSMeapMedia','media',[action,filename]);
}

///网络请求
/**
 *  @brief  http/https 网络请求
 *
 *  @param  interface  <调取meap接口名>
 *  @param  method  <调取meap服务名称>
 *  @param  group       <调取meap组名称>
 *  @param  version     <调取meap服务名称>
 *  @param  bodyJson    <报文body中的JSON内容>
 *  @param  isHttps     <是否是https 请求 > :01 http 02 单向https  03 双向https
 *  @param  encryptionType  <加密类型> 01 无加密 02 3des 03 rsa
 *  @param  isSalt  <是否加盐>
 *  @param  isCompres   <是否压缩>
 *  @param  successCallback     回调方法
 *  @param  failureCallback     失败方法
 *
 *  @return 
 */
//NSMeapPlugin.prototype.httpRequest = function(interfaceName,method,group,bodyJson,isHttps,encryptionType,isSalt, isCompres,version, successCallback, failureCallback)
//{
//    return cordova.exec(successCallBack, failureCallback, 'NSMeapWebRequest', 'httpRequest', [method, bodyJson, isHttps,encryptionType,isSalt, isCompres,version,interfaceName,group]);
//};

//{"b":[{"abc":"bcd","username":"bbb"}]}]}

/**
 *  @brief  发短信
 *
 *  @param  phoneNumber     电话号码
 *  @param  context     短信内容
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *
 *  @return 
 */
NSMeapPlugin.prototype.sendMessage = function(phoneNumber,context,successCallback, failureCallback) {
 
 
     var args = {};
     
     if(phoneNumber)
     args.toRecipients = phoneNumber;
     
     if(context)
     args.body = context;
     return cordova.exec(successCallback,failureCallback,'NSMeapMessage','sendMessage',[args]);
 };

/**
 *  @brief  SSO设置参数接口
 *
 *  @param  arguments   参数数组
 *  0: id
 *  1: parma 参数名
 *  2: dataType 参数类型 传（2）
 *  3: value 参数值
 *  4: isOffLineParam 是否为离线登录参数 0 或 1
 */
NSMeapPlugin.prototype.SSOSetParma = function(parma,dataType,value,isOffLine, successCallback, failureCallback)
{
    cordova.exec(successCallback,failureCallback,'NSMeapSSO','setParma',[parma,dataType,value,isOffLine]);
    
}

/**
 *  @brief  SSO获取参数接口
 *
 *  @param  parmaName   参数名
 */
NSMeapPlugin.prototype.SSOGetParma = function(parmaName, successCallback, failureCallback)
{
    cordova.exec(successCallback,failureCallback,'NSMeapSSO','getParma',[parmaName]);
    
}

/**
 *  @brief  开始在线登录
 *
 *  @param  parmaName   参数名
 */
NSMeapPlugin.prototype.startOnLineLogin = function(successCallback, failureCallback)
{
    cordova.exec(successCallback,failureCallback,'NSMeapSSO','startOnLineLogin',[]);
    
}

/**
*   @brief  注销登录
*/
NSMeapPlugin.prototype.logout = function(successCallback, failureCallback)
{
    cordova.exec(successCallback,failureCallback,'NSMeapSSO','logout',[]);
}

/**
 *  @brief  检测登录状态
 */
NSMeapPlugin.prototype.checkSSOLogin = function(successCallback, failureCallback)
{
    cordova.exec(successCallback,failureCallback,'NSMeapSSO','checkSSOLogin',[]);
}

/**
 *  @brief  Hybrid小版本更新
 *
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *
 *  @return
 */
NSMeapPlugin.prototype.autoCheckUpdateForJS = function(successCallback,failureCallback)
{
  
    return cordova.exec(successCallback,failureCallback,'NSMeapCheckWebUpdate','checkUpdateRes',[]);
}
/**
 *  @brief  APP版本更新
 *
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *
 *  @return 
 */
NSMeapPlugin.prototype.autoCheckUpdate = function(successCallback,failureCallback)
{
    return cordova.exec(successCallback,failureCallback,'NSMeapCheckAppUpdate','checkUpdateApp',[]);
}
/**
 *  @brief  获取验证码
 *
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *
 *  @return 
 */
NSMeapPlugin.prototype.getCaptcha = function(successCallback,failureCallback)
{
   
    return cordova.exec(successCallback,failureCallback,'NSMeapGetCaptcha','getCaptcha',[]);
}

/**
 *  @brief  日期选择器
 *
 *  @param  pointX  日期选择器的X坐标  (btn.offsetLeft+btn.offsetWidth/2)
 *  @param  pointY  日期选择器的Y坐标  (btn.offsetTop+btn.offsetHeight/2)
 *  @param  dateModel   日期选择器的类型（date、date_time、time、hour_Minute）
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *
 *  @return
 */
NSMeapPlugin.prototype.getDate = function(pointX,pointY,dateModel,successCallback, failureCallback)
{
    
    return cordova.exec(successCallback,failureCallback,'NSMeapDatePicker','date',[pointX,pointY,dateModel]);
}
//*********文件操作********************************//
/// 文件操作   上传
NSMeapPlugin.prototype.uploadFile = function(path,fileName, successCallback, failureCallback)
{
    return cordova.exec(successCallback, failureCallback, 'NSMeapFileManager','uploadFile', [path,fileName]);
};

/// 文件操作   下载
NSMeapPlugin.prototype.downloadFile = function(url, successCallback, failureCallback)
{
    return cordova.exec(successCallback, failureCallback, 'NSMeapFileManager','downloadFile', [url]);
};

/// 文件操作  文件移除
NSMeapPlugin.prototype.removeFile = function(filePath, successCallback, failureCallback)
{
    return cordova.exec(successCallback, failureCallback, 'NSMeapFileManager','removeFile', [filePath]);
};
/// 文件操作  文件移动
NSMeapPlugin.prototype.moveFile = function(filePath,newPath,newName, successCallback, failureCallback)
{   
    return cordova.exec(successCallback, failureCallback, 'NSMeapFileManager','moveFile', [filePath,newPath,newName]);
};


//********************本地数据加密插件********************//
/**
 *  @brief  获取加密的密码
 *
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *
 *  @return 
 */
NSMeapPlugin.prototype.getPassword = function(successCallback, failureCallback)
{
   return cordova.exec(successCallback,failureCallback,'NSMeapDataSecurity','getPassword',[]);
}

/**
 *  @brief  设置加密的密码
 *
 *  @param  password    加密的密码
 *  @param  overTime    密码过期时间
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *
 *  @return 
 */
NSMeapPlugin.prototype.setPassword = function(password,overTime,successCallback, failureCallback)
{
    return cordova.exec(successCallback,failureCallback,'NSMeapDataSecurity','setPassword',[password,overTime]);
}

/**
 *  @brief  本地数据加密插件---保存加密字符串
 *
 *  @param  string  需要加密的字符串
 *  @param  stringID    需要加密的字符串的ID
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *
 *  @return 
 */
NSMeapPlugin.prototype.saveString = function(string, successCallback, failureCallback)
{
   return cordova.exec(successCallback,failureCallback,'NSMeapDataSecurity','saveString',[string]);
}

/**
 *  @brief  本地数据加密插件---获取加密的字符串
 *
 *  @param  stringID    字符串的ID
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *
 *  @return 
 */
NSMeapPlugin.prototype.getString = function(stringID, successCallback, failureCallback)
{
   return cordova.exec(successCallback,failureCallback,'NSMeapDataSecurity','getString',[stringID]);
}

/**
 *  @brief  加密文件
 *
 *  @param  filePath    文件的路径
 *  @param  fileID  文件的ID
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *
 *  @return
 */
NSMeapPlugin.prototype.saveFile = function(filePath, successCallback, failureCallback)
{
   return cordova.exec(successCallback,failureCallback,'NSMeapDataSecurity','saveFile',[filePath]);
}

/**
 *  @brief  获取加密的文件
 *
 *  @param  fileID  文件的ID
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *
 *  @return 文件的路径
 */
NSMeapPlugin.prototype.getFile = function(fileID, successCallback, failureCallback)
{
   return cordova.exec(successCallback,failureCallback,'NSMeapDataSecurity','getFile',[fileID]);
}

/**
 *  @brief  删除加密的字符串
 *
 *  @param  stringID    字符串的ID
 *
 *  @return 
 */
NSMeapPlugin.prototype.clearData = function(dataId)
{
    return cordova.exec(null,null,'NSMeapDataSecurity','clearString',[dataId]);
}

/**
 *  @brief  删除加密的文件
 *
 *  @return 
 */
NSMeapPlugin.prototype.clearAll = function()
{
    Cordova.exec(null,null,'NSMeapDataSecurity','clearAll',[]);
}

/**
 *  @brief  加密所有文件
 *
 *  @return
 */
NSMeapPlugin.prototype.encryAllData = function()
{
    Cordova.exec(null,null,'NSMeapDataSecurity','getString',[]);
}

/**
 *  @brief  解密所有文件
 *
 *  @return
 */
NSMeapPlugin.prototype.decryAllData = function()
{
    Cordova.exec(null,null,'NSMeapDataSecurity','decryAllData',[]);
}














/**
 *  @brief  调用密码锁
 
 ** @param  passwordLockType    状态类别  01 为设置状态 02 为校验状态
 ** @param  password            以设置密码   可以为空
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *  @return success：返回输入的密码
            点击忘记密码：返回resign字符串

 */
NSMeapPlugin.prototype.showPasswordLock = function(passwordLockType,password, successCallback, failureCallback)
{
    
    Cordova.exec(successCallback, failureCallback,'NSMeapPasswordLock','showPasswordLock',[passwordLockType,password]);
    
}




/**
 *  @brief 程序跳转插件
 
 ** @param  id                  应用id
 ** @param  args                带入参数   可以为空
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *  @return success：0
            error：1

 */
NSMeapPlugin.prototype.jumpApp = function(id,args, successCallback, failureCallback)
{
    Cordova.exec(successCallback, failureCallback,'NSMeapJumpAPP','jumpApp',[id,args]);
    
}


/**
 *  @brief 屏幕监听触摸插件
 
 ** @param  time                到期时间(以秒为单位)
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *  @return success：0

 */
NSMeapPlugin.prototype.startListener = function(time, successCallback, failureCallback)
{
    Cordova.exec(successCallback, failureCallback,'NSMeapScreemTimer','startListener',[time]);
    
}


/**
 *  @brief 程序安装插件
 
 ** @param  appPath             应用地址 注：IOS应用中，应用地址是plist文件的地址
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *  @return success：0
            error：1

 */
NSMeapPlugin.prototype.installApp = function(appPath, successCallback, failureCallback)
{
    Cordova.exec(successCallback, failureCallback,'NSMeapInstallAPP','installApp',[appPath]);   
}

/**
 *  @brief 程序安装插件
 
 ** @param  filePath            文件路径
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *  @return success：0
            error：1

 */
NSMeapPlugin.prototype.scanOfficeFile = function(filePath, successCallback, failureCallback)
{
    Cordova.exec(successCallback, failureCallback,'NSMeapScanOfficeFile','scanOfficeFile',[filePath]);
    
}

/**
 *  @brief 用第三方应用打开插件
 
 ** @param  filePath            文件路径
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *  @return success：0
            error：1

 */
NSMeapPlugin.prototype.editOfficeFile = function(filePath, successCallback, failureCallback)
{
    Cordova.exec(successCallback, failureCallback,'NSMeapEditOfficeFile','editOfficeFile',[filePath]);
    
}


/**
 *  @brief  关闭当前程序

 */
NSMeapPlugin.prototype.killApp = function()
{
    Cordova.exec(null,null,'NSMeapKillAPP','killApp',[]);
    
}

/**
 *  @brief 检测APP是否存在插件
 
 ** @param  id          应用id
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *  @return success：0
            error：1

 */
NSMeapPlugin.prototype.checkAppExist = function(id, successCallback, failureCallback)
{
    Cordova.exec(successCallback, failureCallback,'NSMeapCheckAPPExist','checkAppExist',[id]);
    
}


/**
 *  @brief  获取屏幕分辨率插件
 
 ** 
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *  @return success：{“w”:“2048”，“h”：“768”}
            error：1
 */
NSMeapPlugin.prototype.getScreenResolution = function( successCallback, failureCallback)
{
    Cordova.exec(successCallback, failureCallback,'NSMeapScreenResolution','getScreenResolution',[]);
    
}
/**
 *  @brief 推送插件

 */
function receivePushListener(msg){
alert('receivePushListener'+msg)

}
/**
 *  @brief 附件传回路径  ios特有

 */
function receiveFilePath(msg){
alert('receiveFilePath'+msg)
}

/**
 *  @brief 程序跳回调用方法

 */
function openWithApp(msg){
alert('openWithApp'+msg)

}
/**
 *  @brief  程序进入前台插件

 */
function appEnterForeground(msg){
}
function loginChange(msg){
    var str = '你的账号在另一台设备登录...';
    common_fn.initConfirmDialog(str,function(){
        bLogin = false;
        $.mobile.changePage('../../index.html',{transition:'slide'});
    },false);
};
/**
 *  @brief  程序进入后台插件
 */
function appEnterBackground(msg){
}

function sycnBeanEvent(msg){
    alert('sycnBeanEvent'+msg);
}

function sycnBytesEvent(msg){
    alert('sycnBytesEvent'+msg);
}

function sycnMapEvent(msg){
    alert('sycnMapEvent'+msg);
}

function sycnTextEvent(msg){
    alert('sycnTextEvent'+msg);
}
NSMeapPlugin.prototype.downloadFileUseBase64=function (bodyJson,successCallback, failureCallback){

Cordova.exec(successCallback, failureCallback,'NSMeapDownLoadFile','downloadFileUseBase64',[bodyJson]);
}

NSMeapPlugin.prototype.uploadFileUseBase64= function (bodyJson,successCallback, failureCallback){

Cordova.exec(successCallback, failureCallback,'NSMeapUpLoadFile','uploadFileUseBase64',[bodyJson]);
}
/*文件下载*/
NSMeapPlugin.prototype.NSMeapBase64Download=function(bodyJson,sC,fC){
    Cordova.exec(sC,fC,'NSMeapBase64Download','downloadFileUseBase64',[bodyJson]);
}


//=======================华丽的分割线====================


//拍照插件
NSMeapPlugin.prototype.NSMeapCamera= function (bodyJson,successCallback, failureCallback){
    Cordova.exec(successCallback, failureCallback,'NSMeapCamera','camera',[bodyJson]);
}


//上传多个图片
/*  
    otherStr  '模块名_交易号_登陆账号_设备唯一标识'
    dict    '{
            "custFacePic": "", //客户面部照片
            "custAndCustOwnerPic": "", //与客户合影照片
            "custAuthPic": "" , //抄录内容照片
            "frontIDCardPic": "", //身份证正面
            "backIDCardPic":  "", //身份证反面
            "restPics1":"",//其他资料1
            "restPics2":"",//其他资料2
        };
   */ 
NSMeapPlugin.prototype.NSMeapImageUpload= function (otherStr,dict, successCallback, failureCallback){
    Cordova.exec(successCallback, failureCallback,'NSMeapImageUpload','imageUpload',['com.nqsky.service.portal.service.IPhotoService','sendPhoto2DMS','portal',version,'YES',otherStr,dict]);
}

//删除图片
function deletePhoto(bodyJson,successCallback,failureCallback) {

    Cordova.exec(successCallback,failureCallback,'DeletePhotoPlugin','deletePhoto',[bodyJson])
}

NSMeapPlugin.prototype.httpRequest = function(interfaceName,method,group,bodyJson,isHttps,encryptionType,isSalt, isCompres,version, successCallback, failureCallback)
{
    return cordova.exec(successCallback, failureCallback, 'NSMeapWebRequest', 'httpRequest', [method, bodyJson, isHttps,encryptionType,isSalt, isCompres,version,interfaceName,group]);
};

//上传签名插件
/**
 *  @brief 上传签名插件

 *  fileName 文件名：身份证号码_英文名称.png
    parma 后台key名：signature
    otherStr  模块名_交易号_登陆账号_设备唯一标识
    base64Str  签名图片64位值
 */
function signUpLoad(interfaceName,method,group,version,isHttps,fileName,parma,otherStr,base64Str, successCallback, failureCallback) {
    Cordova.exec(successCallback,failureCallback,'SignUploadPlugin','signUpLoad',[interfaceName,method,group,version,isHttps,fileName,parma,otherStr,base64Str])
}

//获取设备UDID
function getUdid(bodyJson,successCallback,failureCallback) {
    
    Cordova.exec(successCallback,failureCallback,'getUDIDNumPlugin','getUdid',[bodyJson])
}

/**
 *  调用二代身份证读卡器插件
 */

NSMeapPlugin.prototype.readCard=function(bodyJson,successCallback,failureCallback) {
    
    Cordova.exec(successCallback,failureCallback,'ReadCardInfoPlugin','readCard',[bodyJson])
}

/**
 *  调用读取指纹插件
 */
NSMeapPlugin.prototype.readFingerprint=function(bodyJson,successCallback,failureCallback){
    Cordova.exec(successCallback,failureCallback,'ReadCardInfoPlugin','readFingerprint',[bodyJson])
    
}

/**
 *  获取地理位置详细信息插件
 */
NSMeapPlugin.prototype.getCurrentLocationAddress=function(bodyJson,successCallback,failureCallback){
    Cordova.exec(successCallback,failureCallback,'NSMeapMapPlugin','getCurrentLocationAddressInfo',[bodyJson])
}


/**
 *  获取经纬度插件
 *  successCallback: 字符串  经度,纬度 eg:114.12393197,22.54938928
 *
 */
function getCurrentLocationCoordinate(bodyJson,successCallback,failureCallback) {
    
    Cordova.exec(successCallback,failureCallback,'NSMeapMapPlugin','getCurrentLocationCoordinate',[bodyJson])
}



//数据库插件
/**
 *  @brief 插入表单数据
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 *  bodyJson
 *  databaseName 数据库名
 *  tableName    表名
 *  data         数组(元素为键值对)key值与数据库的key值相同
 */
function insertTableData(bodyJson,successCallback,failureCallback) {

    Cordova.exec(successCallback,failureCallback,'TableDataPlugin','insertTableData',[bodyJson]);
}
/**
 * @brief 检查bodyJson数组的文件是否存在，或存在的情况下大小是否为0K
 * 
 * 
 * @return 文件存在且大小不为0K，则return 1  ，否则return 0
 * 
 */

function checkZipCompression(bodyJson,successCallback,failureCallback){
	Cordova.exec(successCallback,failureCallback,'NSMeapZipPlugin','checkZipCompression',[bodyJson]);
}

/**
 *  @brief 更新数据
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功  失败
 *  bodyJson
 *  databaseName 数据库名
 *  tableName    表名
 *  conditions   条件(键值对,key值相同)
 *  data         数组(元素为键值对)key值与数据库的key值相同
 */

function modifyTableData(bodyJson,successCallback,failureCallback) {
    
    Cordova.exec(successCallback,failureCallback,'TableDataPlugin','modifyTableData',[bodyJson])
}

/** ==================== 条件查询表单数据 ==================== */
/**
 *  @brief 条件查询表单数据
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return  成功返回1  失败返回0
 *  bodyJson
    databaseName  数据库名
    tableName     表名
    conditions    条件(键值对,key值相同)
    sqlOrderColm  排序条件
    sqlOrderType  排序类型
 
    var json = {
    "databaseName":"UserDatabase",
    "tableName": "current_user_info",
    "conditions": {"AGENT_CODE": storage.getItem("agentCode")}
    };
 
 */
function queryTableDataByConditions(bodyJson,successCallback,failureCallback) {
    Cordova.exec(successCallback,failureCallback,'TableDataPlugin','queryTableDataByConditions',[bodyJson])
}



/** ==================== 删除表单数据 ==================== */
/**
 *  @brief 删除表单数据
 *
 *  @param  success_callback    成功回调
 *  @param  failed_callback"    失败回调
 *
 *  @return 成功返回1  失败返回0
 *  bodyJson
    databaseName 数据库名
    tableName    表名
    conditions   数组(元素为键值对)key值与数据库的key值相同
 
    *var json ={
    "databaseName":"UserDatabase",
    "tableName": "current_user_info",
    "conditions":[{"agentCode": storage.getItem("agentCode")}]

 */
function deleteTableData(bodyJson,successCallback,failureCallback) {
    Cordova.exec(successCallback,failureCallback,'TableDataPlugin','deleteTableData',[bodyJson]);
}

/**
 *  执行sql语句
 *
 */
function executeSqlString(sqlString,object,successCallback,failureCallback) {
    Cordova.exec(successCallback,failureCallback,'TableDataPlugin','executeSqlString',[sqlString,object]);
}


/**
 *  base64转图片
 */
NSMeapPlugin.prototype.transFormImage=function(picName,picStr,picSty,successCallback,failureCallback) {
    Cordova.exec(successCallback,failureCallback,'TransformImageAndBase64Plugin','transFormImage',[picName,picStr,picSty]);

}


/**
 *  压缩插件
 */
NSMeapPlugin.prototype.zipCompression=function(businessType,zipFilePath, successCallback, failureCallback) {
    //alert('111111111');
    Cordova.exec(successCallback,failureCallback,'NSMeapZipPlugin','zipCompression',[businessType,zipFilePath])
}

/**
 *  贷款模块压缩插件
 *
 */
function MT_zipCompression(businessType,zipName,zipFilePath,successCallback,failureCallback) {
    Cordova.exec(successCallback,failureCallback,'MT_ZipPlugin','MT_zipCompression',[businessType,zipName,zipFilePath])
}

/**
 *  人脸识别
 *
 */
function faceDistinguish(bodyJson,successCallback,failureCallback){
    
    Cordova.exec(successCallback,failureCallback,'TCFacePlugin','faceDistinguish',[bodyJson])
    
}

/**
 *  @brief  二维码插件---字符串生成二维码图片
 *
 *  @param  text    文本信息
 *  @param  successCallback     成功回调
 *  @param  failureCallback     失败回调
 *
 *  @return 图片的保存路径
 */
function transformStringToImage(text, successCallback, failureCallback)
{
    Cordova.exec(successCallback,failureCallback,'NSMeapQRCode','transformStringToImage',[text]);
}


/**
 *  图片转base64路径
 *
 */
function transFormBase64(bodyJson,successCallback,failureCallback){
    Cordova.exec(successCallback,failureCallback,'TransformImageAndBase64Plugin','transFormBase64',[bodyJson])
}


/**
 *  base转文件路径
 */
function transFormBase64Tofile(fileName,fileStr,successCallback,failureCallback){
    Cordova.exec(successCallback,failureCallback,'TransformImageAndBase64Plugin','transFormBase64Tofile',[fileName,fileStr])
}

/**
 *  根据沙盒路径浏览文件
 */
function scanTheFiles(bodyJson,successCallback,failureCallback){
    Cordova.exec(successCallback,failureCallback,'ScanFilePlugin','scanTheFiles',[bodyJson])
}

/**
 *  调用计算器插件
 */
function useCalculator(bodyJson,successCallback,failureCallback){
    Cordova.exec(successCallback,failureCallback,'CalculatorPlugin','useCalculator',[bodyJson])
}

/**
 *  异常处理文件打包压缩插件
 */
function expectionZipCompression(businessType,zipFilePath, successCallback, failureCallback) {
    //alert('111111111');
    Cordova.exec(successCallback,failureCallback,'ExpectionZipPlugin','expectionZipCompression',[businessType,zipFilePath])
}

/**
 *  OCR识别--银行卡
 */
function ocrBankCard(bodyJson,successCallback,failureCallback){
	Cordova.exec(successCallback,failureCallback,'OCRPlugin','ocrBankCard',[bodyJson])
}

/**
 *  OCR识别--身份证，需要点击拍摄
 */
function ocrIdCard(bodyJson,successCallback,failureCallback){
    Cordova.exec(successCallback,failureCallback,'OCRPlugin','ocrIdCard',[bodyJson])
}

/**
 *  OCR识别--身份证  直接扫描自动识别
 */
function ocrIdCard2(bodyJson,successCallback,failureCallback){
    Cordova.exec(successCallback,failureCallback,'IdentityCardPlugin','ocrIdCard',[{"placeholder":"拍摄身份证正面，尝试边缘对齐"}])
}

/**
 *  CRM地址插件
 */
function CRMAddress(bodyJson,successCallback,failureCallback){
    Cordova.exec(successCallback,failureCallback,'CRMAddressPlugin','getCRMAddress',[bodyJson])
}

/**
 *  断点下载组件
 *
 *  @param bodyJson        [下载地址,文件名,文件ID,操作指令]
 *  @param 操作指令 1.查询文件是否存在; 2.文件下载进度; 3.开始下载 4.暂停下载
 *  @param successCallback 成功回调
 *  @param failureCallback 失败回调
 *
 */
function downLoadFile(downloadUrl,fileName,fileId,operationNo,successCallback,failureCallback){
    Cordova.exec(successCallback,failureCallback,'DownloadFilePlugin','downLoadFile',[downloadUrl,fileName,fileId,operationNo])
}

/**
 *  断点文件删除组件
 *
 */
function checkFileIfDel(fileNameArr,successCallback,failureCallback){
    Cordova.exec(successCallback,failureCallback,'DownloadFilePlugin','checkFileIfDel',[fileNameArr])
}
/**
 *  获取版本号插件
 */
function getCurrentVersion(bodyJson,successCallback,failureCallback){
    Cordova.exec(successCallback,failureCallback,'VersionPlugin','getCurrentVersion',[bodyJson])
}

/**
 *  更新文件路径插件
 */
function updateFilepath(bodyJson,successCallback,failureCallback){
    Cordova.exec(successCallback,failureCallback,'FilepathPlugin','updateFilepath',[bodyJson])
}


/**
 *  录音插件
 *  fileName:文件名
 *  operation:start -> 开始录音
 *  stop -> 停止录音
 *  successCallback:返回文件路径
 */
function recordPlugin(fileName,operation,successCallback,failureCallback){
    Cordova.exec(successCallback,failureCallback,'RecordPlugin','recordPlugin',[fileName,operation])
}