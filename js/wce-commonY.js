/**
 * Created by Administrator on 2016/5/8.
 */
/** by Y 2016/05/08 **/

/************************/
/****定义通用回调方法****/
/*********************/
//预处理后台返回的JSON数据
function preJsonY(msg){
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    return responseCode;
}

//联网核查成功回调
//@param msg成功回调参数
//@param Obj需要改变的参数
//@param YCObj核查异常时需要的参数
//@param extendFun核心通过后是否需要其他操作
function commonIcitizenCertificateIdenifySuccY(msg,Obj,YCObj,bussObj,extendFun){
    var responseCode = preJsonY(msg);

    hideLoader();
    $('.footter .previous:eq(0)').addClass('btn_next');
    $('.footter .previous:eq(0)').addClass('back-1');
    $('.header .head-left,.header .head-right,.footter .previous:eq(0)').removeClass('btn-cannt-click');
    $('.sh_loading_box_shadow').remove();

    if (responseCode[0].results == "00") {

        //联网核查状态保存
        lianwanghechaData.CheckResult = responseCode[0].results;

        if (responseCode[1].citizenCertificateIdentifyVO[0].CHECKRESULT == "00") {
            //联网核查成功
            $(".loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
            $('.footter .previous:eq(1)').addClass('btn_next');
            custermerInfo.checkPhoto = base64decode(responseCode[1].citizenCertificateIdentifyVO[0].PHOTO); //联网核查返回照片

        } else {
            //信息审核失败
            $(".loading_box").html('<div class="read_loading" style="margin-top:40px;">信息审核失败！</div>');

        }
    } else if (responseCode[0].results == "08") {
        //联网核查超时
        $(".loading_box").html('<div class="read_loading" style="margin-top:40px;">用户Session无效，联网核查失败！</div>');

    } else if (responseCode[0].results == "09") {
        //联网核查状态保存
        lianwanghechaData.CheckResult = responseCode[0].results;

        //弹窗联网核查异常
        $(".lianwanghecha-yichang").show();
        $(".loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查异常！</div>');
        $('.footter .previous:eq(1)').addClass('btn_next');

        //联网核查异常绑定按钮事件
        (function(Obj,YCQbj,bussObj,extendFun){
            //点击重新查询
            $(".lianwanghecha-chongxin").on("click", function () {
                showLoader('信息查询中...');
                $(".lianwanghecha-yichang").hide();
                $('.footter .previous:eq(1)').removeClass('btn_next');
                $('.footter .previous:eq(0)').removeClass('btn_next');
                $('.footter .previous:eq(0)').removeClass('back-1');
                $('.header .head-left,.header .head-right').addClass('btn-cannt-click');
                $('.ui-page').append('<div class="sh_loading_box_shadow" style="position:absolute;right:0;top:0;left:0;bottom:0;z-index:24;background-color: rgba(0,0,0,.0);"></div>');
                $(".loading_box").html('<img class="img_loading" src="../../images/ic_load.gif" alt=""/><div class="read_loading">信息审核中…</div>');

                //身份证联网核查
                commonIcitizenCertificateIdenifyY(Obj,YCObj,bussObj,extendFun);
            });

            //点击继续办理业务
            $(".lianwanghecha-jixu").on("click", function () {//继续业务办理
                $(".lianwanghecha-yichang").hide();
                commonIcustomerInfoServiceCharacteristicProductY(YCObj,bussObj,extendFun)
            });

            //点击退出
            $(".lianwanghecha-tuichu").on("click", function () {//退出
                $.mobile.changePage(Obj.prevUrl , {reverse: true });
                $(".lianwanghecha-yichang").hide();
            });
        })(Obj,YCObj,bussObj,extendFun)

        //联网核查异常返回的图片链接base64转换可识别链接
        convertImgToBase64Y('../../images/09chaoshiyichang.png', function (base64Img) {
            custermerInfo.checkPhoto = base64Img.replace('data:image/png;base64,', '');
        });

    } else if (responseCode[0].results == "02") {
        //联网核查状态保存
        lianwanghechaData.CheckResult = responseCode[0].results;

        //公民身份号码一致但是没有照片
        $(".loading_box").html('<div class="read_loading" style="margin-top:40px;">公民身份号码与姓名一致，但不存在照片！</div>');

        //联网核查异常返回的图片链接base64转换可识别链接
        convertImgToBase64Y('../../images/02yichang.png', function (base64Img) {
            custermerInfo.checkPhoto = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
        });

        showTags({
            'title': '提示',
            'content': '公民身份号码与姓名一致，但不存在照片，是否继续办理业务？',
            'ok': {
                'title': '放弃',
                'fun': function () {
                    $.mobile.changePage(Obj.prevUrl, {reverse: true});
                }
            },
            'cancel': {
                'title': '继续',
                'fun': function () {
                    $('.footter .previous:eq(1)').addClass('btn_next');
                    commonIcustomerInfoServiceCharacteristicProductY(YCObj,bussObj,extendFun)
                }

            }
        });

    } else {
        //核查失败
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
        $(".loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
    }
}

//客户核心查询成功回调
function   commonIcustomerInfoServiceSuccY(msg,Obj,bussObj,extendFun){
    var responseCode = preJsonY(msg);
    hideLoader();
    if (responseCode[0].results == "00") {
        //身份证名字与核心名字不一致
        if ($.trim(responseCode[1].customerInfoVO[0].CH_CLIENT_NAME) != '' && $.trim(responseCode[1].customerInfoVO[0].CH_CLIENT_NAME) != custermerInfo.name) {
            showTags({
                'title': '提示',
                'content': '身份证姓名与核心姓名不一致,无法办理',
                'ok': {
                    fun: function () {
                        $.mobile.changePage( Obj.prevUrl , {
                            reverse: true
                        });
                    }
                }
            });
            return;
        }
        customerInfoY.MOBILEPHONE = responseCode[0].mobilePhoto; //获取客户手机号
        if(bussObj.tranId == '65' && (customerInfoY.MOBILEPHONE == undefined 
        	|| customerInfoY.MOBILEPHONE == null || $.trim(customerInfoY.MOBILEPHONE) == '')){
        	showTags({
                'title': '提示',
                'content': '客户信息无手机号码，无法办理该业务！',
                'ok': {
                    fun: function () {
                        $.mobile.changePage(Obj.prevUrl, {
                            reverse: true
                        });
                    }
                }
            });
            return;
        }
        //成功获取客户号 并且跳转到下一页
        bussObj.CLIENT_NO = responseCode[1].customerInfoVO[0].CLIENT_NO;
        if(typeof extendFun == 'function'){
            extendFun()
        } else {
            $.mobile.changePage(Obj.nextUrl);
        }
    } else if (responseCode[0].results == "08") {
        
    } else if (responseCode[0].results == "12") {
        //客户号大于1 不能办理此业务
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {
                fun: function () {
                    $.mobile.changePage( Obj.prevUrl , {
                        reverse: true
                    });
                }
            }
        });

    } else {
        //其他不通过情况
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {
                fun: function () {
                    $.mobile.changePage( Obj.prevUrl , {
                        reverse: true
                    });
                }
            }
        });
    }
}

//获取账卡号成功回调
function commonGetDocLicenceListBanksuccY(msg,Obj,bussObj){
    var responseCode = preJsonY(msg);
    hideLoader();
    bussObj.accountArr = [];
    if (responseCode[0].results == "00") {
        $.each(responseCode, function (index, val) {
            if (index == 0) return;
            bussObj.accountArr.push(val);
        })
        $.mobile.changePage(Obj.nextUrl);
    } else if (responseCode[0].results == "08") {
        commonGetDocLicenceListBankFunY(Obj,bussObj);
    } else {
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {
                fun: function () {
                    $.mobile.changePage(Obj.prevUrl, {reverse: true});
                }
            }
        });
    }
}

//影像对比成功回调
//bussObj传入自己模块自己所定义的保存数据的对象
function CommonifacelRecognitionSeSucY(msg,Obj,bussObj){
    var responseBody = preJsonY(msg);
    hideLoader();
    if (responseBody[0].results == '0') {
        $('.personFace .previous:last').addClass('btn_next');
        bussObj.platGlobalSeq = responseBody[0].platGlobalSeq; //流水号
        bussObj.cardResult = responseBody[1].photoCompareVO[0].CARD_RESULT; //联网核查结果
        bussObj.chipResult = responseBody[1].photoCompareVO[0].CHIP_RESULT; //芯片结果
        if (responseBody[1].photoCompareVO[0].CHIP_RESULT == "0") { //芯片通过
            $(".personFace .face-result:eq(0)").text('通过');
        } else {
            $(".personFace .face-result:eq(0)").addClass('no-pass').text('未通过');
        }
        if (responseBody[1].photoCompareVO[0].CARD_RESULT == "0") { //联网核查通过
            $(".personFace .face-result:eq(1)").text('通过');
        } else {
            $(".personFace .face-result:eq(1)").addClass('no-pass').text('未通过');
        }
        if (responseBody[1].photoCompareVO[0].CHIP_RESULT == "0" && responseBody[1].photoCompareVO[0].CARD_RESULT == "0") {
            bussObj.isTelCheck = true; //远程复核成功
            bussObj.faceRecogn = '1'; //自动通过
            $(".personFace .center-header").text('人脸识别通过！');
        } else {
            bussObj.faceRecogn = '2'; //自动不通过
            $(".personFace .center-header").text('人脸识别未通过！');
            $('.personFace .previous:last').text('远程复核');
            $("#managerList").show();
        }


    } else if (responseBody[0].results == '08') {

    } else {
        bussObj.faceRecogn = '2'; //自动不通过
        $(".personFace .face-result").addClass('no-pass').text('未通过');
        $(".personFace .center-header").text('人脸识别未通过！');
        $('.personFace .previous:last').addClass('btn_next').text('远程复核');
        $("#managerList").show();
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }
}

/************************/
/****定义通用处理方法****/
/*********************/

//通用图像路径转码 base64
function convertImgToBase64Y(url, callback, outputFormat) {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        // Clean up
        canvas = null;
    };
    img.src = url;
}

//通用信息初始化
function commonInitY(){
    socialSecurity.storage = {}; //社保待遇缓存初始化
    statusY.isSpecial = false;  //判断是否为特殊产品（特色产品）
    statusY.isReadCardSucc = false; //读取身份证是否成功
    statusY.savePic = false;//初始化影像采集页面自动复用
    statusY.isPersonFaceSucc = false; //人脸比对成功
    statusY.hasQM = false; //是否签名
    statusY.hasYZM = false; //是否有输入验证码
    statusY.hasYDXY = false; //是否同意协议
    commonJson.isCustermerInfoMultiplex = false; //初始化影像复用
    custermerInfo.checkPhoto = ''; //联网核查返回照片
    characteristicProduct.picFileARR  = [];
    socialSecurity.picFileARR = [];
    socialSecurity.isCompress = false;
    characteristicProduct.isCompress = false;
    customerInfoY.MOBILEPHONE = '';	//清空客户手机号
}

//读取身份证
//@param 读卡成功 对象值statusY.isReadCardSucc = true;
//@param 读卡失败 对象值statusY.isReadCardSucc = false;
function commonReadIDCardY(sucFun,failFun){
    showLoader('身份证读取中...');
    //读取身份证插件
    Meap.readCard('', function (msg) {
        //读卡成功
        statusY.isReadCardSucc = true;
        custermerInfo = {}; //初始化个人信息
        msg = JSON.parse(msg);
        custermerInfo = {
            "nation"      : $.trim(msg.nation),       //民族
            "cerNO"       : $.trim(msg.cardNO),       //身份证号
            "address"     : $.trim(msg.address),      //地址
            "name"        : $.trim(msg.name),         //姓名
            "cerExpdDt"   : $.trim(msg.cerExpdDt),    //到期日期
            "birthday"    : $.trim(msg.birthday),     //出生日期
            "sex"         : $.trim(msg.sex),          //性别
            "issAuthority": $.trim(msg.issAuthority), //签发机关
            "image"       : $.trim(msg.image)         //身份证头像图片
        }
        //读卡成功，判断身份证是否过期
        if (idCardIsExpired(custermerInfo.cerExpdDt)) {
            hideLoader();
            showTags({
                'title': '提示',
                'content': '您的身份证已过期!',
                'ok': {}
            });
            return;
        }
        sucFun && sucFun(msg);
    },function(err){
        //读卡失败
        hideLoader();
        statusY.isReadCardSucc = false;
        failFun && failFun(err);
    })
}

//身份证联网核查
//@param Obj 核查异常重新核查传入的变量参数
//@param YCObj 核查异常继续办理业务传入的变量参数(即下一步联网核查方法需要的参数)
//@param bussObj 核查异常继续办理业务传入的变量参数 用于保存客户号CLIENT_NO(即下一步联网核查方法需要的参数)
//@param extendFun 为扩展方法 如果有有效客户信息 查询有无有效账卡号
function commonIcitizenCertificateIdenifyY(Obj,YCObj,bussObj,extendFun){
    //判断身份证是否读取成功 如果成功则联网核查 如果失败则不需要
    if (statusY.isReadCardSucc) {
        $('.pic_suc').html('身份证读取成功!');
        $('.footter .previous:eq(0)').removeClass('btn_next');
        $('.footter .previous:eq(0)').removeClass('back-1');
        $(".loading_box").html('<img class="img_loading" src="../../images/ic_load.gif" alt=""/><div class="read_loading">信息审核中…</div>');
        $('.sh_loading_box_shadow').remove();
        $('.header .head-left,.header .head-right,.footter .previous:eq(0)').addClass('btn-cannt-click');
        $('.ui-page').append('<div class="sh_loading_box_shadow" style="position:absolute;right:0;top:0;left:0;bottom:0;z-index:24;background-color: rgba(0,0,0,.0);"></div>');
        $('.ui-page').append('<div class="loading_box_shadow">');
        $(".ziduan-value:eq(0)").text(custermerInfo.name);
        $(".ziduan-value:eq(1)").text(custermerInfo.sex);
        $(".ziduan-value:eq(2)").text(custermerInfo.nation);
        $(".ziduan-value:eq(3)").text(custermerInfo.birthday.split("-")[0]);
        $(".ziduan-value:eq(4)").text(custermerInfo.birthday.split("-")[1]);
        $(".ziduan-value:eq(5)").text(custermerInfo.birthday.split("-")[2]);
        $(".ziduan-value:eq(6)").text(custermerInfo.address);
        $(".ziduan-value:eq(7)").text(custermerInfo.cerNO);
        $(".ziduan-value:eq(8)").text(custermerInfo.issAuthority);
        $(".ziduan-value:eq(9)").text(custermerInfo.cerExpdDt);
        $('.sfz-img').attr('src', custermerInfo.image);

        //身份证联网核查
        icitizenCertificateIdenifyFun({
            "b": [{
                "orgId.s"        : commonJson.orgId,      //机构号
                "moduleId.s"     : bussObj.moduleId,      //模块编号
                "tranId.s"       : bussObj.tranId,        //交易编号
                "operatorNo.s"   : commonJson.adminCount, //操作员
                "deviceNo.s"     : commonJson.udId,       //设备编号
                "DOCUMENT_TYPE.s": "0",                   //证件类型
                "DOCUMENT_ID.s"  : custermerInfo.cerNO,   //身份证号码
                "CLIENT_NAME.s"  : custermerInfo.name,    //被核对人姓名
                "BUSSINESSCODE.s": "01",                  //业务总类
                "BRANCH_ID.s"    : commonJson.orgId       //机构号
            }]
        }, function (msg) {
            commonIcitizenCertificateIdenifySuccY(msg,Obj,YCObj,bussObj,extendFun);
        }, function (err) {
            $('.footter .previous:eq(0)').addClass('btn_next');
            $('.footter .previous:eq(0)').addClass('back-1');
            $('.sh_loading_box_shadow').remove();
            $('.header .head-left,.header .head-right,.footter .previous:eq(0)').removeClass('btn-cannt-click');
            $(".loading_box").html('<div class="read_loading" style="margin-top:40px;">联网核查失败！</div>');
            funFail(err);
        })

    } else {
        $('.pic_suc').html('身份证读取失败！');
        $(".loading_box").html('');
        $(".ziduan-value:eq(0)").text('');
        $(".ziduan-value:eq(1)").text('');
        $(".ziduan-value:eq(2)").text('');
        $(".ziduan-value:eq(3)").text('');
        $(".ziduan-value:eq(4)").text('');
        $(".ziduan-value:eq(5)").text('');
        $(".ziduan-value:eq(6)").text('');
        $(".ziduan-value:eq(7)").text('');
        $(".ziduan-value:eq(8)").text('');
        $(".ziduan-value:eq(9)").text('');
        $('.sfz-img').attr('src', '../../images/head-photo.png');
    };
}

//联网核查通过后查询客户核心
//@param Obj 查询客户核心方法需要的参数
//@param bussObj 查询客户核心方法需要的参数 用于保存客户号CLIENT_NO
//@param extendFun 扩展方法查询有无有效账卡号 传入的第二个参数添加属性accountArr 保存所有符合的账号
function commonIcustomerInfoServiceCharacteristicProductY(Obj,bussObj,extendFun){
    showLoader('查询核心客户信息...')
    var sendJson = {
        "b": [{
            "orgId.s"        : commonJson.orgId,          //机构号
            "moduleId.s"     : bussObj.moduleId,          //模块编号
            "tranId.s"       : bussObj.tranId,            //交易编号
            "operatorNo.s"   : commonJson.adminCount,     //操作员
            "deviceNo.s"     : commonJson.udId,           //设备编号
            "CLIENT_TYPE.s"  : "P",                       //客户类型 N组织 P个人
            "CARD.s"         : "",                        //卡号
            "ACCT_NO.s"      : "",                        //账号
            "CLIEMT_NO.s"    : "",                        //客户号
            "DOC_TYPE.s"     : "0",                       //证件类型
            "DOC_ID.s"       : custermerInfo.cerNO,       //证件号
            "CLIENT_SHORT.s" : "",                        //简称
            "BIRTH_DATE.s"   : "",                        //出生日
            "CELL_PHONE.s"   : "",                        //手机
            "PHONE.s"        : "",                        //住宅电话
            "LEGAL_REP.s"    : "",                        //法人代表
            "REVERSE_FLAG.s" : "D",                       //证件号内部检查标志 默认D
            "CARD_CATEGORY.s": Obj.sendJson.CARD_CATEGORY,//核心标识
            "getPhoneInd.s": Obj.sendJson.getPhoneInd //是否获取手机号标识
        }]
    }
    icustomerInfoServiceFun(sendJson,function(msg){
        commonIcustomerInfoServiceSuccY(msg,Obj,bussObj,extendFun);
    },function(err){
        funFail(err);
    })
}

//查核心成功后
//通过核心客户号查询是否存在帐卡号
function commonGetDocLicenceListBankFunY(Obj,bussObj){
    showLoader('查询有效账卡号...')
    if(statusY.isSpecial){
        //核心信息查询成功 针对特色产品供楼宝
        getLoansRecordListFun({
            "b": [{
                "deviceNo.s"     : commonJson.udId,          //设备编号
                "moduleId.s"     : bussObj.moduleId,         //模块编号
                "tranId.s"       : bussObj.tranId,           //交易编号
                "orgId.s"        : commonJson.orgId,         //机构号
                "operatorNo.s"   : commonJson.adminCount,    //操作员
                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                "workAddress.s"  : commonJson.workAddress,   //工作地址
                'CLIENT_NO.s'    : bussObj.CLIENT_NO,        //工作号
            }]
        },function (msg) {
            commonGetLoansRecordListsuccY(msg,Obj,bussObj)
        }, function (err) {
            funFail(err)
        })
    }else{
        //核心信息查询成功 客户有无有效卡号查询
        getDocLicenceListBankFun({
            "b": [{
                "deviceNo.s"     : commonJson.udId,          //设备编号
                "moduleId.s"     : bussObj.moduleId,         //模块编号
                "tranId.s"       : bussObj.tranId,           //交易编号
                "orgId.s"        : commonJson.orgId,         //机构号
                "operatorNo.s"   : commonJson.adminCount,    //操作员
                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                "workAddress.s"  : commonJson.workAddress,   //工作地址
                'CLIENT_NO.s'    : bussObj.CLIENT_NO,        //工作号
                //'CLIENT_NO.s':'0701621012',
                "isSBICCard.s"   : Obj.sendJson.isSBICCard    //查询社保卡
            }]
        }, function (msg) {
            commonGetDocLicenceListBanksuccY(msg,Obj,bussObj)
        }, function (err) {
            funFail(err)
        });
    }
}

//缓存影像
//将采集影像照片链接存在ussObj.picFileARR中,下次进入本页面无需重新拍摄
//并且将路径名称类型都打包在bussObj.picFileInfoARR对象中
function commonCacheYXCJY(bussObj,Obj) {
    statusY.savePic = true;
    var name = null;
    //要打包的影像路径
    bussObj.picFileARR = [];
    //每个图片的名称和类型
    bussObj.picFileInfoARR = [{
        "b": []
    }];
    //其他图片对象的证明类型
    bussObj.picFileMsgType = [];
    var len = Number(Obj.len);
    for(var i = 0; i < len; i++){
        name = Obj[i];
        if ($('.img_box:eq('+ i +') .camera-pic').length > 0) {
            bussObj[name] = $('.img_box:eq('+ i +') .camera-pic:eq(0)').attr('src');
            bussObj.picFileARR.push(bussObj[name]);
        } else {
            bussObj[name] = '';
        }
    }
    $.each(bussObj.picFileARR, function (index, el) {
        if (!el) return true;
        var elIndex = el.lastIndexOf('\/') + 1;
        bussObj.picFileInfoARR[0].b.push({
            FILE_NAME: el.substring(elIndex),
            FILE_TYPE: 'F0000'
        });
    })
}

//影像对比
//复合状态      放在bussObj.isTelCheck属性中 true or false
//复合状态      放在bussObj.faceRecogn属性中 '1' 自动通过 ; '2' 自动不通过 ; '3' 远程符合通过 ; '4' 远程符合不通过 ; '5' 手工通过 ; '6' 手工不通过
//客户流水号    放在bussObj.platGlobalSeq属性 
//联网核查结果  放在bussObj.cardResult属性
//芯片结果     放在bussObj.chipResult属性
function commonifacelRecognitionSeFunY(Obj,bussObj){
    //登录人脸识别系统 自动识别
    ifacelRecognitionSeFun({
        'b' : [{
            "offlineOnline.s": commonJson.offlineOnline,           //  脱机/联机
            "workAddress.s"  : commonJson.workAddress,             //  工作地址
            "orgId.s"        : commonJson.orgId,                   //  机构号
            "moduleId.s"     : bussObj.moduleId,                   //  模块编号
            "tranId.s"       : bussObj.tranId,                     //  交易编号
            "operatorNo.s"   : commonJson.adminCount,              //  操作员
            "deviceNo.s"     : commonJson.udId,                    //  设备编号
            "OPERATOR_NO.s"  : commonJson.adminCount,              //  业务经办人工号
            "TRANS_SCENE.s"  : "0006",                             //  交易场景  //TODO 这个地方
            "COMPARE_TYPE.s" : "2",                                //  比对类型1-客户经理比对，2-客户比对
            "WS_TYPE.s"      : "2",                                //  终端类型1-PC，2-IOS，3-Android
            "WSNO.s"         : commonJson.udId,                    //  终端号
            "VERSION.s"      : "v1.1.4",                           //  当前控件版本
            "TRANS_CHANNEL.s": "301",                              //  渠道301
            "ID_CARD.s"      : custermerInfo.cerNO,                //  身份证号码
            "IMG_BASE.s"     : bussObj.faceBase64,                 //  现场照片
            "CRYPT_TYPE.s"   : "0",                                //  图像是否经过加密0-未加密，1-加密方式一，2加密方式二
            "ID_IMG_BASE.s"  : custermerInfo.checkPhoto,           //  联网核查照片
            "CARD_IMG_BASE.s": bussObj.imageBase64,                //  芯片照片
            "BUSI_TYPE.s"    : ""                                  //  电子卡“01”
            }]
    }, function (msg) {
        CommonifacelRecognitionSeSucY(msg,Obj,bussObj);
    }, function (err) {
        bussObj.faceRecogn = '2'; //自动不通过
        $(".personFace .face-result").addClass('no-pass').text('未通过');
        $(".personFace .center-header").text('人脸识别未通过！');
        $('.personFace .previous:last').addClass('btn_next').text('远程复核');
        $("#managerList").show();
        funFail(err);
    })

    //自动人脸识别不通过 点击查询在线客户经理
    $('#managerList a').on('click', function () {
        showLoader("获取远程复核客户经理...");
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s"  : commonJson.workAddress,  //工作地址
                "operatorNo.s"   : commonJson.adminCount,   //操作员
                "deviceNo.s"     : commonJson.udId          //设备编号
            }]
        };
        ISysUserServiceManListFun(sendJson, function (msg) {
            ISysUserServiceManListComSucc(msg);
        }, function (err) {
            funFail(err);
        })
    })


    //点击继续
    $('.personFace .previous:last').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        if ($(this).text() == '继续') {
            if(statusY.isSpecial){
                $.mobile.changePage(Obj.nextUrl+'-s.html');
            } else {
                $.mobile.changePage(Obj.nextUrl+'.html');
            }
        } else {
            if ($('#managerList select').val() == '') {
                showMsg('请选择一个客户经理');
                return;
            }
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,            //脱机/联机
                    "workAddress.s"  : commonJson.workAddress,              //工作地址
                    "orgId.s"        : commonJson.orgId,                    //机构号
                    "moduleId.s"     : bussObj.moduleId,                    //模块编号
                    "tranId.s"       : bussObj.tranId,                      //交易编号
                    "operatorNo.s"   : commonJson.adminCount,               //操作员
                    "deviceNo.s"     : commonJson.udId,                     //设备编号
                    "platGlobalSeq.s": bussObj.platGlobalSeq,               //流水号
                    "topic.s"        : "N/A",                               //主题N/A
                    "code.s"         : "101",                               //指令101
                    "paramUrl.s"     : "abc",                               //参数地址
                    "days.s"         : "0",                                 //有效天数
                    "appKey.s"       : "com.nqsky.bank.service",            //appKey  com.nqsky.bank.service
                    "context.s"      : "您有一条远程复核业务需要办理",          //推送内容
                    "userIds.s"       : $('#managerList select').val(),      //用户ID  $('#xinka-managerList select').val()
                    "busiType.s"     : "01",                                //电子卡01
                    "cardResult.s"   : bussObj.cardResult,                  //联网核查对比
                    "chipResult.s"   : bussObj.chipResult                   //芯片对比
                }]
            };
            showLoader("正在等待" + $('#managerList option:selected').attr('realName') + "[手机:" + $('#managerList     option:selected').attr('cellPhone') + "]复核...");
            bussObj.telCheck = true;
            iissuesServiceFun(sendJson, function (msg) {
                if(statusY.isSpecial){
                    iissuesServiceComSucc(msg,bussObj,Obj.nextUrl+'-s.html');
                } else {
                    iissuesServiceComSucc(msg,bussObj,Obj.nextUrl+'.html');
                }
            }, function (err) {
                funFail(err);
            })
        }

    });

    //点击F放弃
    $('.personFace .previous:first').on('click', function () {
        $.mobile.changePage( Obj.prevUrl+'.html' , {reverse: true});
    });

}

//客户签名方法
//客户签名的地址转换base64保存在了bussObj的属性signUrl中
function commonCustomerSignatureFunY(bussObj){
    //初始化签名栏
    signature.init({
        div: $('#qianM'), //签名容器
        finishBtn: $("#qianOK"), //完成签名按钮
        clearBtn: $("#clear-botton"), //清除签名按钮
        lineColor: '#000000', //线条颜色
        lineWidth: 3, //线条粗细
        finish: function (data) { //签名完成回调函数
            if ($('#ic_disagree').is(':hidden')) {
                $('.qianM_shadow').hide();
                $('#ic_agree').hide();
                $('#ic_disagree').show();
                $("#com-sign-over").remove();
                $('.footter .previous:eq(0)').removeClass('btn_next');
                statusY.hasQM = false;
            } else {
                $('.qianM_shadow').show();
                $('#ic_disagree').hide();
                $('#ic_agree').show();
                $('.box_con_r .qian-box').css('position', 'relative').append('<div id="com-sign-over" style="position:absolute; top:0; right:0;left:0;bottom:0"></div>');
                $('.footter .previous:eq(0)').addClass('btn_next');
                statusY.hasQM = true;
                bussObj.data = data.replace('data:image/png;base64,', '')
            }
        }
    });
}

