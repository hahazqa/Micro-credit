//卡产品选择 成功回调
function icardProductServiceSucc(msg) {
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    var textHtml = '';
    if (responseCode[0].results == '00') {
        $.each(responseCode, function (index, el) {
            if (index == 0) return true;
            var imgUrl = base64decode(el.cardProductListVO[0].ATTACHMENT);
            textHtml += ' <div class="product_box">' +
            '<img src="data:image/png;base64,' + imgUrl + '" proRemark1="' + el.cardProductListVO[0].REMARK1 + '" class="product_img"/>' +
            '<div class="product_content">' +
            '<div class="product_register" PRONAME="' + el.cardProductListVO[0].PRONAME + '" PRODUCTCD="' + el.cardProductListVO[0].PRODUCTCD + '">申&nbsp;&nbsp;&nbsp;请</div>' +
            '<p class="product_title">' + el.cardProductListVO[0].PRONAME + '</p>' +
            '<div class="product_Intro">' + el.cardProductListVO[0].DESC.replace(/\n/g, "<br/>") + '</div>' +
            '</div>' +
            '</div>';
        });
        $('#credit-product .conter-auto').html(textHtml);
        $('#credit-product .product_register').click(function (event) {
            //if (!(orgIdToUserId[creditJson.storage.orgId])) {
            //    showTags({
            //        'title': '提示',
            //        'content': '该客户经理号所属机构没有影像系统号,无法申请信用卡!',
            //        'ok': {
            //            fun: function() {
            //                $.mobile.changePage('credit-product.html', {
            //                    reverse: true
            //                });
            //            }
            //        }
            //    });
            //    return;
            //}
            if (creditJson.storage.SPRNUM == '') {
                showTags({
                    'title': '提示',
                    'content': '没有客户经理号,无法申请信用卡!',
                    'ok': {
                        fun: function () {
                            $.mobile.changePage('credit-product.html', {
                                reverse: true
                            });
                        }
                    }
                });
                return;
            }
            creditJson.storage.PRODUCTCD = $(this).attr("PRODUCTCD"); //卡产品代码
            creditJson.storage.YWXS = $(this).attr("PRONAME"); //卡产品代码
            //$.mobile.changePage('credit-agreement.html', { transition: "slide"}, false);
            $.mobile.changePage('credit-readingID.html');
        });

        $('#credit-product .product_img').on('taphold', function () {
            productTapHold($(this));
        })
        $("#credit-product").on('tap', function (ev) {
            var oTarget = ev.target;
            if ($(oTarget).closest('.product_img').length || $(oTarget).closest('.product_img_msg').length) {

            } else {
                $(".product_img_msg").remove();
            }
        })
        //先删除表里数据
        deleteTableData({
            "databaseName": "myDatabase", //数据库名
            "tableName": "creditcard_type" //表名
        }, function (msg) {
            //再插入数据库
            var dataNum = 1;
            dataInsertIcardProductService(responseCode, dataNum);
        }, function (err) {

        });
    } else if (responseCode[0].results == "08") {
        var sendJson = {
            "b": [{
                //"offlineOnline":creditJson.storage.offlineOnline,//脱机/联机
                "orgId.s": creditJson.storage.orgId,
                "moduleId.s": creditJson.storage.moduleId, //模块编号
                "tranId.s": creditJson.storage.tranId, //交易编号
                "operatorNo.s": creditJson.storage.operatorNo, //操作员
                "deviceNo.s": creditJson.storage.deviceNo, //设备编号
                "CARDCLASS.s": "", //卡等级
                "CARDBRAND.s": "", //卡品牌
                "CARDTYPE.s": "", //卡类型
                "ISDUALCURR.s": "", //是否双币卡
                "DESC.s": "" //描述
            }]
        };
        icardProductServiceFun(sendJson, function (msg) {
            icardProductServiceSucc(msg);
        }, function (err) {
            queryTableDataByConditions({
                "databaseName": "myDatabase", //数据库名
                "tableName": "creditcard_type" //表名
            }, function (msg) {
                if (msg == '') {
                    localStorage.spacetime = 1;
                }
            }, function (err) {
                funDataFail(err);
            });
            funFail(err);
        });
    } else {
        queryTableDataByConditions({
            "databaseName": "myDatabase", //数据库名
            "tableName": "creditcard_type" //表名
        }, function (msg) {
            if (msg == '') {
                localStorage.spacetime = 1;
            }
        }, function (err) {
            funDataFail(err);
        });
    }
}
//通用失败回调 yu
function funFail(err) {
    hideLoader();
    // alert(err+"失败！")
    //  {"b":[{"error":[{"case.s":"接口服务处理异常!","details.s":"","message.s":"接口服务处理异常!"}]}]}
    err = err.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(err);
    var responseCode = responseObj.b[0].error[0];
    if ($.trim(responseCode.message).toUpperCase() == 'A CONNECTION FAILURE OCCURRED') {
        Meap.isNetConnect(function(msg){
            if (msg == '01' || msg == '02') {
                responseCode.message = '未接收到后台响应!';
            } else if (msg == '03') {
                responseCode.message = '当前网络不可用,请检测网络是否畅通!';
            }
            showTags({
                'content': responseCode.message, //必输
                'ok': {}

            })
        },function(err) {
            responseCode.message = '当前网络不可用,请检测网络是否畅通!';
            showTags({
                'content': responseCode.message, //必输
                'ok': {}

            })
        })
    }
    if ($.trim(responseCode.message).toUpperCase() == 'THE REQUEST TIMED OUT') { //全部改成大写即可捕获
        responseCode.message = '系统超时,请重新操作!';
        showTags({
            'content': responseCode.message, //必输
            'ok': {}

        })
    } else if ($.trim(responseCode.message).toUpperCase() == 'ERR_REQUEST_ABORTED') { //全部改成大写即可捕获
        responseCode.message = '接口服务处理异常,请重试!';
        showTags({
                 'content': responseCode.message, //必输
                 'ok': {}
                 
                 })
    }else{
    	responseCode.message = $.trim(responseCode.message).toUpperCase();
    	showTags({
    		'content': responseCode.message,
    		'ok': {}
    	})
    }

    
}

//通用获取流水号成功后提交超时失败回调
/*
* err : 错误对象err  function(err){}中调用时直接传err 非必输
* callback : 点击继续后执行的回调函数 非必输
* arr ：数组 执行callback时的参数 如callback(1,2,3)，这里写为[1,2,3] 非必输
* */
function funFaillilvANDwh(err, callback, arr) {
    hideLoader();
    showTags({
        'title': '提示',
        'content': '业务处理超时!',
        'ok': {
            title: '继续处理',
            fun: function () {
                if (arr && (Object.prototype.toString.call(arr) === '[object Array]')) {
                    callback && callback.apply(this, arr);
                } else {
                    callback && callback();
                }
            }
        }
    });

}
//信用卡身份读取 联网核查 成功回调 yu
function icitizenCertificateIdenifySucc(sendJson, msg) {
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    creditJson.storage.checkPhoto = ''; //联网核查返回照片
    custermerInfo.checkPhoto = ''; //联网核查返回照片
    eleSignJson.lianPic = ''; //联网核查返回照片
    if (responseCode[0].results == "00") {
        hideLoader();
        lianwanghechaData.CheckResult = responseCode[0].results;
        if (responseCode[1].citizenCertificateIdentifyVO[0].CHECKRESULT == "00") { //联网核查成功
            $('.sh_loading_box_shadow').remove();
            $('.header .head-left,.header .head-right,.footter .previous:eq(0)').removeClass('btn-cannt-click');
            $(".loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
            $('.footter .previous:eq(1)').addClass('btn_next');
            $('.footter .previous:eq(0)').addClass('btn_next');
            $('.footter .previous:eq(0)').addClass('back-1');
            creditJson.storage.checkPhoto = base64decode(responseCode[1].citizenCertificateIdentifyVO[0].PHOTO); //联网核查返回照片
            custermerInfo.checkPhoto = base64decode(responseCode[1].citizenCertificateIdentifyVO[0].PHOTO); //联网核查返回照片
            eleSignJson.lianPic = base64decode(responseCode[1].citizenCertificateIdentifyVO[0].PHOTO); //联网核查返回照片
            if(lianwanghechaData.dianzixinyongkaDX == "9"){
            	$CL.svc.queryCoreClientInfo();
            }
        } else {
            $('.sh_loading_box_shadow').remove();
            $('.header .head-left,.header .head-right,.footter .previous:eq(0)').removeClass('btn-cannt-click');
            $(".loading_box").html('<div class="read_loading" style="margin-top:40px;">信息审核失败！</div>');
        }
    } else if (responseCode[0].results == "08") {
        hideLoader();
        creditReadCardSucc(sendJson);
//      $('.footter .previous:eq(0)').addClass('btn_next');
//      $('.footter .previous:eq(0)').addClass('back-1');
//      $('.header .head-left,.header .head-right,.footter .previous:eq(0)').removeClass('btn-cannt-click');
//      $('.sh_loading_box_shadow').remove();
//      $(".loading_box").html('<div class="read_loading" style="margin-top:40px;">用户Session无效，联网核查失败！</div>');
        //hideLoader();
        //showTags({
        //    'title': '提示',
        //    'content': responseCode[0].message,
        //    'ok': {
        //        fun:function(){
        //        }
        //    }
        //});
    } else if (responseCode[0].results == "09") {
        hideLoader();
        $('.footter .previous:eq(1)').removeClass('btn_next');
        $('.footter .previous:eq(0)').removeClass('btn_next');
        $('.footter .previous:eq(0)').removeClass('back-1');
        $(".lianwanghecha-yichang").show();
        $('.sh_loading_box_shadow').remove();
        $('.header .head-left,.header .head-right,.footter .previous:eq(0)').removeClass('btn-cannt-click');
        $(".loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查异常！</div>');

        function convertImgToBase64(url, callback, outputFormat) {
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

        convertImgToBase64('../../images/09chaoshiyichang.png', function (base64Img) {
            //              convertImgToBase64(base64Img, function(base64Img1){
            var tayh = base64Img.replace('data:image/png;base64,', '');
            creditJson.storage.checkPhoto = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
            custermerInfo.checkPhoto = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
            eleSignJson.lianPic = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
            //              });
        });

        //          transFormBase64('../images/09chaoshiyichang.png', function (msg) {
        //              alert(msg);
        //              creditJson.storage.checkPhoto = msg; //联网核查返回照片
        //          custermerInfo.checkPhoto = msg; //联网核查返回照片
        //          eleSignJson.lianPic = msg; //联网核查返回照片
        //          }, function (err) {
        //              alert(111);
        //              });
        lianwanghechaData.CheckResult = responseCode[0].results;
    } else if (responseCode[0].results == "02") {
        hideLoader();
        lianwanghechaData.CheckResult = responseCode[0].results;
        $('.sh_loading_box_shadow').remove();
        $('.header .head-left,.header .head-right,.footter .previous:eq(0)').removeClass('btn-cannt-click');
        $(".loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
        $('.footter .previous:eq(1)').addClass('btn_next');

        function convertImgToBase64(url, callback, outputFormat) {
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

        convertImgToBase64('../../images/02yichang.png', function (base64Img) {
            //              convertImgToBase64(base64Img, function(base64Img1){
            var tayh = base64Img.replace('data:image/png;base64,', '');
            creditJson.storage.checkPhoto = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
            custermerInfo.checkPhoto = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
            eleSignJson.lianPic = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
            //              });
        });
        showTags({
            'title': '提示',
            'content': '公民身份号码与姓名一致，但不存在照片，是否继续办理业务？',
            'ok': {
                'title': '放弃',
                'fun': function () {
                    hideLoader();
                    if (lianwanghechaData.dianzixinyongkaDX == "1") {
                        $.mobile.changePage('dianzi-readingID.html', {
                            transition: "slide"
                        });
                    } else if (lianwanghechaData.dianzixinyongkaDX == "3") { //贷款
                        $.mobile.changePage('loan-reading.html', {
                            transition: "slide"
                        });
                    } else if (lianwanghechaData.dianzixinyongkaDX == "5") { //小额贷款
                        $.mobile.changePage('smallLoan-readingID.html', {
                            transition: "slide"
                        });
                    } else if(lianwanghechaData.dianzixinyongkaDX == "4") { //积分
                        $.mobile.changePage('jifen-readingID.html', {
                            transition: "slide"
                        });
                    } else if(lianwanghechaData.dianzixinyongkaDX == "9") { //信用贷款
                        $.mobile.changePage('creditLoan-reading.html', {
                            transition: "slide"
                        });
                    } else {
                        $.mobile.changePage('credit-product.html', {
                            transition: "slide"
                        });
                    }
                }
            },
            'cancel': {
                'title': '继续',
                'fun': function () {
                    if (lianwanghechaData.dianzixinyongkaDX == "1") {
                        showLoader('客户信息查询中...');
                        var sendJson = {
                            "b": [{
                                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                                "workAddress.s": commonJson.workAddress, //工作地址
                                "moduleId.s": eleSignJson.moduleId, //模块编号 4
                                "tranId.s": eleSignJson.tranId1, //交易编号   2
                                "operatorNo.s": commonJson.adminCount, //操作员  admin
                                "deviceNo.s": commonJson.udId, //设备编号       ""
                                "orgId.s": commonJson.orgId,
                                "CLIENT_TYPE.s": "P", //客户类型 N组织 P个人
                                "CARD.s": "", //卡号
                                "ACCT_NO.s": "", //账号
                                "CLIENT_NO.s": "", //客户号
                                "DOC_TYPE.s": "0", //证件类型
                                "DOC_ID.s": custermerInfo.cerNO, //证件号
                                "CLIENT_SHORT.s": "", //简称
                                "BIRTH_DATE.s": "", //出生日
                                "CELL_PHONE.s": "", //手机
                                "PHONE.s": "", //住宅电话
                                "LEGAL_REP.s": "", //法人代表
                                "REVERSE_FLAG.s": "D" //证件号内部检查标志 默认D
                                //"CARD_CATEGORY.s":""//虚拟卡查核心标识 1
                            }]
                        };
                        //核心联查
                        icustomerInfoServiceFun(sendJson, function (msg) {
                            eleCustomerInfoServiceEleSignSucc(msg);
                        }, function (err) {
                            funFail(err);
                        });
                    } else if (lianwanghechaData.dianzixinyongkaDX == "3") {
                        loan.applicationObj.lianPic = custermerInfo.checkPhoto;
                        if(!loan.isLoanMaster) {
                            mgInfo(loan.gInfo);
                            if (loan.mInfo.isTrue && loan.gInfo.isTrue) {  //主 配 都存在的情况下  判断性别状况
                                if (loan.mInfo.sex == loan.gInfo.sex) {
                                    showTags({
                                        'title': '提示',
                                        'content': '主申请人与配偶信息相同!',
                                        'ok': {
                                            fun: function () {
                                                $.mobile.changePage('loan-reading.html', {
                                                    reverse: true
                                                });
                                            }
                                        }
                                    });
                                    return;
                                }
                            }
                            $.mobile.changePage('loan-peiPicture.html', {reverse: true});
                        }else{
                            showLoader('客户信息查询中...');
                            var sendJson = {
                                "b": [{
                                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                                    "workAddress.s": commonJson.workAddress,//工作地址
                                    "moduleId.s": loan.moduleId, //模块编号 4
                                    "tranId.s": '100', //交易编号   2
                                    "operatorNo.s": commonJson.adminCount, //操作员  admin
                                    "deviceNo.s": commonJson.udId, //设备编号       ""
                                    "orgId.s": commonJson.orgId,
                                    "CLIENT_TYPE.s": "P", //客户类型 N组织 P个人
                                    "CARD.s": "", //卡号
                                    "ACCT_NO.s": "", //账号
                                    "CLIENT_NO.s": "", //客户号
                                    "DOC_TYPE.s": "0", //证件类型
                                    "DOC_ID.s": custermerInfo.cerNO, //证件号
                                    "CLIENT_SHORT.s": "", //简称
                                    "BIRTH_DATE.s": "", //出生日
                                    "CELL_PHONE.s": "", //手机
                                    "PHONE.s": "", //住宅电话
                                    "LEGAL_REP.s": "", //法人代表
                                    "REVERSE_FLAG.s": "D" //证件号内部检查标志 默认D
                                }]
                            };
                            //核心联查
                            icustomerInfoServiceFun(sendJson, function (msg) {
                                customerInfoServiceLoanSucc(msg);
                            }, function (err) {
                                funFail(err);
                            });
                        }
                        //$.mobile.changePage('loan-cusPicture.html', {
                        //  transition: "slide"
                        //});
                    } else if(lianwanghechaData.dianzixinyongkaDX == "4"){
                        showLoader('客户信息查询中...');
                        var sendJson = {
                            "b": [{
                                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                                "workAddress.s": commonJson.workAddress,//工作地址
                                "moduleId.s": jifenJson.moduleId, //模块编号 4
                                "tranId.s": jifenJson.tranId, //交易编号   2
                                "operatorNo.s": commonJson.adminCount, //操作员  admin
                                "deviceNo.s": commonJson.udId, //设备编号       ""
                                "orgId.s": commonJson.orgId,
                                "CLIENT_TYPE.s": "P", //客户类型 N组织 P个人
                                "CARD.s": "", //卡号
                                "ACCT_NO.s": "", //账号
                                "CLIENT_NO.s": "", //客户号
                                "DOC_TYPE.s": "0", //证件类型
                                "DOC_ID.s": custermerInfo.cerNO, //证件号
                                "CLIENT_SHORT.s": "", //简称
                                "BIRTH_DATE.s": "", //出生日
                                "CELL_PHONE.s": "", //手机
                                "PHONE.s": "", //住宅电话
                                "LEGAL_REP.s": "", //法人代表
                                "REVERSE_FLAG.s": "D", //证件号内部检查标志 默认D
                                "CARD_CATEGORY.s": "2", //2检查是否有客户号和有效凭证存在
                                "getPhoneInd.s": jifenJson.getPhoneInd //是否获取手机号标识
                            }]
                        };
                        //核心联查
                        icustomerInfoServiceFun(sendJson, function (msg) {
                            jifenCustomerInfoSucc(sendJson, msg);
                        }, function (err) {
                            funFail(err);
                        });
                    } else if (lianwanghechaData.dianzixinyongkaDX == "5") { //小额贷款
                        sloanIcustomerInfoServiceFun();
                    } else if (lianwanghechaData.dianzixinyongkaDX == "9") { //信用贷款
                    	$CL.svc.queryCoreClientInfo();
                    } else {
                        if (creditJson.isPrev.LLHCisFromPrev) {
                            custermerInfo.name = creditJson.storage.MASCARDNAME;
                            custermerInfo.sex = creditJson.storage.SEX;
                            custermerInfo.nation = creditJson.storage.NATION;
                            custermerInfo.birthday = creditJson.storage.BIRTH;
                            custermerInfo.address = creditJson.storage.ADDRESS;
                            custermerInfo.cerNO = creditJson.storage.CERTNUM;
                            custermerInfo.issAuthority = creditJson.storage.ISSAUTHORITY;
                            custermerInfo.cerExpdDt = creditJson.storage.CERTVALIDDATE;
                            custermerInfo.image = creditJson.storage.image;
                            custermerInfo.checkPhoto = creditJson.storage.checkPhoto;

                        } else {
                            creditJson.storage.MASCARDNAME = custermerInfo.name;
                            creditJson.storage.SEX = custermerInfo.sex;
                            creditJson.storage.NATION = custermerInfo.nation;
                            creditJson.storage.BIRTH = custermerInfo.birthday;
                            creditJson.storage.ADDRESS = custermerInfo.address;
                            creditJson.storage.CERTNUM = custermerInfo.cerNO;
                            creditJson.storage.ISSAUTHORITY = custermerInfo.issAuthority;
                            creditJson.storage.CERTVALIDDATE = custermerInfo.cerExpdDt;
                            creditJson.storage.image = custermerInfo.image;
                            creditJson.storage.checkPhoto = custermerInfo.checkPhoto;
                        }

                        creditJson.storage.CLIENT_NO = ''; //客户号初始化
                        if (creditJson.storage.offlineOnline == 'offline' || creditJson.isPrev.LLHCisFromPrev) { //脱机模式
                            $.mobile.changePage('credit-agreement.html');
                            return;
                        }
                        icustomerInfoServiceCreditREADIDNEXTFun();
                    }
                }
            }
        })
    } else {
        hideLoader();
        $('.footter .previous:eq(0)').addClass('btn_next');
        $('.footter .previous:eq(0)').addClass('back-1');
        $('.sh_loading_box_shadow').remove();
        $('.header .head-left,.header .head-right,.footter .previous:eq(0)').removeClass('btn-cannt-click');
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
        $(".loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
    }
}
//获取验证码 成功回调
function imessageAuthentionServiceCreditSucc(msg) {
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00') {
        //$('#inp').removeAttr('disabled').val(responseCode[1].messageAuthentionVO[0].MSG_INFO);
        creditJson.hasYZM = true;
        creditJson.USER_NO = responseCode[1].messageAuthentionVO[0].USER_NO; //用户唯一标识
        creditJson.MSG_INFO = responseCode[1].messageAuthentionVO[0].MSG_INFO; //动态口令
        var num = 80; //设置验证码有效时间 80秒
        creditJson.codeTime = setInterval(function () {
            num--;
            $('.codetime').html('请在<span style="color:red;">' + num + '秒</span>内输入验证码');
            if (num == 0) {
            	creditJson.USER_NO = '';
                clearInterval(creditJson.codeTime);
                $('#getMsg').removeClass('cannt-click').text('重新获取');
                $('.codetime').html('请在<span style="color:red;">0秒</span>内输入验证码');
                creditJson.hasYZM = false;
                $('#inp').removeAttr('disabled').val('');
            }
        }, 1000);
    } else if (responseCode[0].results == '08') {
        //获取验证码
        var sendJson = {
            "b": [{
                //"offlineOnline.s":creditJson.storage.offlineOnline,//脱机/联机
                "orgId.s": creditJson.storage.orgId,
                "moduleId.s": creditJson.storage.moduleId, //模块编号
                "tranId.s": creditJson.storage.tranId, //交易编号
                "operatorNo.s": creditJson.storage.operatorNo, //操作员
                "deviceNo.s": creditJson.storage.deviceNo, //设备编号
                "SUSER_ID.s": creditJson.storage.orgId + creditJson.storage.operatorNo, //机构号+柜员号
                "Flags.s": "BBBB", //标记位
                "MOBILE_NO.s": creditJson.storage.MOBILENUM, //手机号码debitEnter.tel
                "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
                "faceRecogn.s": creditJson.storage.faceRecogn //人脸识别状态
            }]
        };
        showLoader('获取中...');
        imessageAuthentionServiceFun(sendJson, function (msg) {
            imessageAuthentionServiceCreditSucc(msg);
        }, function (err) {
            hideLoader();
            funFail(err);
            $('#getMsg').removeClass('cannt-click').text('重新获取');
            if (creditJson.codeTime) {
                clearInterval(creditJson.codeTime);
            }
            creditJson.hasYZM = false;
            $('.footter .previous').removeClass('btn_next');
            $('#inp').removeAttr('disabled').val('');
        });
    } else {
        if (creditJson.codeTime) {
            clearInterval(creditJson.codeTime);
        }
        $('#getMsg').removeClass('cannt-click').text('重新获取');
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
        hideLoader();
    }
}
//验证码是否有效 成功回调
function imessageAuthentionServiceYFunCreditsSucc(msg) {
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00') {
        creditJson.USER_NO = "";
        getPlatGlobalSeq(creditJson.storage, function () {
            showLoader('影像压缩中...');
            if (lianwanghechaData.CheckResult == "09") {

            } else {
                //存储个人信息--影像复用使用
                cacheCustermerInfo({
                    "databaseName": "myDatabase",
                    "tableName": "customer_info",
                    "data": [{
                        "ADMINCOUNT": creditJson.storage.operatorNo, //登陆账号
                        "SUBMITTIME": myTime.CurTime(), //提交时间
                        "BUSINESSTYPE": "信用卡", //业务类型
                        "NATION": creditJson.storage.NATION, //民族
                        "CERTNUM": creditJson.storage.CERTNUM, //身份证号码
                        "ADDRESS": creditJson.storage.ADDRESS, //身份证地址
                        "MASCARDNAME": creditJson.storage.MASCARDNAME, //姓名
                        "CERTVALIDDATE": creditJson.storage.CERTVALIDDATE, //有效日期
                        "BIRTH": creditJson.storage.BIRTH, //出生日期
                        "SEX": creditJson.storage.SEX, //性别
                        "ISSAUTHORITY": creditJson.storage.ISSAUTHORITY, //签发机关
                        "IMAGE": creditJson.storage.image, //身份证头像图片
                        "CUSTANDCUSTOWNERPIC": creditJson.storage.custAndCustOwnerPic, //与客户合影照片
                        "FRONTIDCARDPIC": creditJson.storage.frontIDCardPic, //身份证正面
                        "BACKIDCARDPIC": creditJson.storage.backIDCardPic, //身份证反面
                        "checkPhoto": creditJson.storage.checkPhoto //联网核查图片

                    }]
                });
            }
            //影像上传文件打包压缩插件
            topicUtil.subscribe("credit/creditImageCompressSucc", creditImageCompressSucc);
            var compressCount = 0;  //压缩成功次数,为2时完成压缩
            var phoneTime = myTime.CurTime();
            var signTime = phoneTime + 1;
            creditJson.storage.phoneTime = phoneTime;
            creditJson.storage.signTime = signTime;
            Meap.zipCompression(creditJson.storage.platGlobalSeq, creditJson.storage.picFileARR, function (msg) {
                //将要上传的影像插入到ios断点上传的数据库中
                //影像上传 业务参数
                var appBussPhone = {
                    'busiGloablaSeq': creditJson.storage.platGlobalSeq, //业务编号
                    'attchType': '0', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
                    'deviceNo': creditJson.storage.deviceNo, //设备编号
                    'moduleId': creditJson.storage.moduleId, //模块编号
                    'tranId': creditJson.storage.tranId, //交易编号
                    'orgId': creditJson.storage.orgId, //机构编号
                    'operatorNo': creditJson.storage.operatorNo, //操作员
                    'custName': creditJson.storage.MASCARDNAME, //客户名称
                    'custCredType': '0', //客户证件类型
                    'custCredNo': creditJson.storage.CERTNUM, //客户证件号
                    'offlineOnline': creditJson.storage.offlineOnline, //脱机/联机
                    'workAddress': creditJson.storage.ipadWorkAddress, //工作地址
                    //'FILE_ADD': creditJson.storage.picFileInfoARR[0].b, //每个图片的名称和类型
                    'OPER_TYPE': 'ADD',
                    'userId': '9107', //orgIdToUserId[creditJson.storage.orgId], //柜员号
                    'branchId': '00862' //creditJson.storage.orgId //机构号
                };
                appBussPhone = JSON.stringify(appBussPhone);
                var sendDataJson = {
                    "databaseName": "myDatabase",
                    "tableName": "up_download_info",
                    "data": [{
                        "fileToken": creditJson.storage.phoneTime, //文件唯一ID(可以为时间挫
                        "pos": "0", //文件的断点信息(初始为0)
                        "filePath": msg, //文件路径
                        "appPath": "c001", //自定义文件路径
                        "appBuss": appBussPhone, //业务参数
                        "downloadToken": "", //文件的下载ID(初始为空)
                        "leng": "1", //文件的长度(初始为1)
                        "isNotice": "yes", //是否调用后台(一直是yes)
                        "fileType": "0",
                        "REMARK1": "01" //上传状态01-默认
                    }]
                };
                insertTableData(sendDataJson, function (msg) {
                    topicUtil.publish("credit/creditImageCompressSucc", ++compressCount);
                }, function (err) {
                    hideLoader();
                    showTags({
                        'title': '提示',
                        'content': '数据库读写失败，请联系技术人员',
                        'ok': {}
                    });
                });
            }, function (err) {
                hideLoader();
                showTags({
                    'title': '提示',
                    'content': '图片压缩失败',
                    'ok': {}
                });
            });
            //将要上传的签名插入到ios断点上传的数据库中
            //签名上传 业务参数
            Meap.transFormImage(creditJson.storage.platGlobalSeq + 'sign', creditJson.signHref, 'picSty', function (msg) {
                var appBussSign = {
                    'busiGloablaSeq': creditJson.storage.platGlobalSeq, //业务编号
                    'attchType': '1', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
                    'deviceNo': creditJson.storage.deviceNo, //设备编号
                    'moduleId': creditJson.storage.moduleId, //模块编号
                    'tranId': creditJson.storage.tranId, //交易编号
                    'orgId': creditJson.storage.orgId, //机构编号
                    'operatorNo': creditJson.storage.operatorNo, //操作员
                    'custName': creditJson.storage.MASCARDNAME, //客户名称
                    'custCredType': '0', //客户证件类型
                    'custCredNo': creditJson.storage.CERTNUM, //客户证件号
                    'offlineOnline': creditJson.storage.offlineOnline, //脱机/联机
                    'workAddress': creditJson.storage.ipadWorkAddress //工作地址
                };
                appBussSign = JSON.stringify(appBussSign);
                var sendDataJson = {
                    "databaseName": "myDatabase",
                    "tableName": "up_download_info",
                    "data": [{
                        "fileToken": creditJson.storage.signTime, //文件唯一ID(可以为时间挫
                        "pos": "0", //文件的断点信息(初始为0)
                        "filePath": msg, //文件路径
                        "appPath": "c002", //自定义文件路径
                        "appBuss": appBussSign, //业务参数
                        "downloadToken": "", //文件的下载ID(初始为空)
                        "leng": "1", //文件的长度(初始为1)
                        "isNotice": "yes", //是否调用后台(一直是yes)
                        "fileType": "1",
                        "REMARK1": "01" //上传状态01-默认
                    }]
                };
                insertTableData(sendDataJson, function (msg) {
                    topicUtil.publish("credit/creditImageCompressSucc", ++compressCount);
                }, function (err) {
                    hideLoader();
                    showTags({
                        'title': '提示',
                        'content': '数据库读写失败，请联系技术人员',
                        'ok': {}
                    });
                });
            }, function (err) {
                hideLoader();
                showTags({
                    'title': '提示',
                    'content': '签名转换失败',
                    'ok': {}
                });
            });
        });
    } else if (responseCode[0].results == "08") {
        hideLoader();
        var sendJson = {
            "b": [{
                //"offlineOnline.s":creditJson.storage.offlineOnline,//脱机/联机
                "orgId.s": creditJson.storage.orgId,
                "moduleId.s": creditJson.storage.moduleId, //模块编号
                "tranId.s": creditJson.storage.tranId, //交易编号
                "operatorNo.s": creditJson.storage.operatorNo, //操作员
                "deviceNo.s": creditJson.storage.deviceNo, //设备编号
                "SUSER_ID.s": creditJson.storage.orgId + creditJson.storage.operatorNo, //机构号+柜员号
                "USER_NO.s": creditJson.USER_NO, //用户唯一标识
                "EPay_PassType.s": "ST", //认证类型 ST短信  NT令牌
                "MSG_INFO.s": creditJson.MSG_INFO, //动态口令
                "Flags.s": "BBBB", //标记位
                "MOBILE_NO.s": creditJson.storage.MOBILENUM, //手机号码debitEnter.tel
                "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
                "faceRecogn.s": creditJson.storage.faceRecogn //人脸识别状态
            }]
        };
        imessageAuthentionServiceYFun(sendJson, function (msg) {
            imessageAuthentionServiceYFunCreditsSucc(msg);
        }, function (err) {
            creditJson.USER_NO = "";
            funFail(err);
        });
    } else {
        creditJson.USER_NO = "";
        hideLoader();
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}

function creditImageCompressSucc(event, compressCount){
    if(!compressCount || compressCount != 2){
        return;
    }
    showLoader('信息提交中...');
    // 事件发布执行回调方法前，取订事件，避免重复发布
    topicUtil.unsubscribe("credit/creditImageCompressSucc");
    // 01深户 02广东非深户  03广西 04其他
    var isShenH = '04'; //户籍所在地
    if ((creditJson.storage.DOMICILESF + creditJson.storage.DOMICILECS).indexOf('广东') >= 0) {
        if ((creditJson.storage.DOMICILESF + creditJson.storage.DOMICILECS).indexOf('深圳') >= 0) {
            isShenH = '01';
        } else {
            isShenH = '02';
        }
    } else if ((creditJson.storage.DOMICILESF + creditJson.storage.DOMICILECS).indexOf('广西') >= 0) {
        isShenH = '03';
    } else {
        isShenH = '04';
    }
    if ($.trim(creditJson.storage.HOUSADD) == '') {
        creditJson.storage.HOUSADD = creditJson.storage.UNITADD; //如果住宅地址为空,则值为单位地址(通讯地址)
        creditJson.storage.HOUSZIPCODE = creditJson.storage.UNITZIPCODE; //如果住宅邮编为空,则值为单位邮编(通讯邮编)
    }
    if ($.trim(creditJson.storage.OTHERADD) == '') {
        creditJson.storage.OTHERADD = creditJson.storage.UNITADD; //如果其他地址为空,则值为单位地址(通讯地址)
    }
    if ($.trim(creditJson.storage.REPAYMETHOD) == '') { //判断当还款方式为空时，账号应为空
        creditJson.storage.AUTODEBITACCOUNT = creditJson.storage.REPAYMETHOD;
    }
    creditJson.storage.localeTimestamp = myTime.CurTime();
    var sendJson = {
        "b": [{
            "state.s": creditJson.storage.lAddData,  //新增  named by lei to 补充资料
            "offlineOnline.s": creditJson.storage.offlineOnline, //脱机/联机
            "orgId.s": creditJson.storage.orgId, //隶属机构
            "moduleId.s": creditJson.storage.moduleId, //模块编号
            "tranId.s": creditJson.storage.tranId, //交易编号
            "operatorNo.s": creditJson.storage.operatorNo, //操作员
            "TLRNAME.s": creditJson.storage.TLRNAME, //操作员姓名
            "SPRNUM.s": creditJson.storage.SPRNUM, //信用卡用户 推广人编号
            "TLRCELLPHONE.s": creditJson.storage.TLRCELLPHONE, //操作员手机号码
            "deviceNo.s": creditJson.storage.deviceNo, //设备编号
            "MASCARDNAME.s": creditJson.storage.MASCARDNAME, //身份证姓名
            "SEX.s": sexJson[creditJson.storage.SEX], //性别
            "CERTTYPE.s": '1', //证件类型
            "CERTNUM.s": creditJson.storage.CERTNUM, //证件号码
            "CERTVALIDDATE.s": creditJson.storage.CERTVALIDDATE.split('-')[1].replace(/\./g, ''), //有效期截止日
            "BIRTH.s": creditJson.storage.BIRTH.replace(/-/g, ''), //出生日期
            "BRAFULLNAME.s": creditJson.storage.BRAFULLNAMEX + ' ' + creditJson.storage.BRAFULLNAMEM, //拼音姓名
            "EDUCATION.s": creditJson.storage.EDUCATION, //教育程度
            "MOBILENUM.s": creditJson.storage.MOBILENUM, //手机号码
            "HOUSTYPE.s": creditJson.storage.HOUSTYPE, //住宅类型
            "OTHERADD.s": creditJson.storage.OTHERADD, //其他地址
            "HOUSZIPCODE.s": creditJson.storage.HOUSZIPCODE, //邮编
            "EMAILADD.s": creditJson.storage.EMAILADD, //E-mail
            "DOMICILE.s": isShenH, //户籍所在地
            "HOUSREGADD.s": creditJson.storage.ADDRESS, //户籍地址
            //2016.3.17新增字段
            "RECMOBILENUM.s": creditJson.storage.RECMOBILENUM, //推荐人手机号
            "RECEMPNUM.s": creditJson.storage.RECEMPNUM, //推荐人工号
            "MARSTATU.s": creditJson.storage.MASRTATU, //婚姻状况
            "OFFICE.s": creditJson.storage.OFFICE, //职位／岗位
            "UNITWORKEXP.s": creditJson.storage.UNITWORKEXP, //在现单位工作年限
            "INTOSOURCE.s": creditJson.storage.INTOSOURCE, //进件来源
            "CUSCARDAPPLY.s": creditJson.storage.CUSCARDAPPLY, //申请额度
            //2016.3.17新增字段
            "UNITNAME.s": creditJson.storage.UNITNAME, //单位全称
            "UNITPROPERTY.s": creditJson.storage.UNITPROPERTY, //单位性质
            "UNITPHONEAREANUM.s": creditJson.storage.UNITPHONENUMQH, //单位固话区号
            "UNITPHONENUM.s": creditJson.storage.UNITPHONENUMHM, //单位固话号码
            "INDCATEGORY.s": creditJson.storage.INDCATEGORY, //行业类别
            "ANNINCOME.s": creditJson.storage.ANNINCOME, //年收入
            "URGNAME.s": creditJson.storage.URGNAME, //紧急联系人姓名
            "URGMOBILENUM.s": removeSpace(creditJson.storage.URGMOBILENUM), //紧急联系人手机
            "CARDSENDADDTYPE.s": "O", //卡片递送地址 与通讯地址一致 O custermerInfo.cCardAddr
            "ISAUTOPURCHASE.s": "0", //是否自动购汇
            "AUTODEBITACCOUNT.s": creditJson.storage.AUTODEBITACCOUNT, //账号/卡号
            "REPAYMETHOD.s": creditJson.storage.REPAYMETHOD, //自动还款方式
            "CARDFEETYPE.s": creditJson.storage.CARDFEETYPE, //年费类型
            "APPCARDTYPE.s": creditJson.storage.PRODUCTCD, //卡产品代码
            "HOUSADD.s": creditJson.storage.HOUSADD, //家庭地址 核心地址接口 TYPE==h
            "HOUSPHONEAREANUM.s": creditJson.storage.HOUSPHONEAREANUM, //住宅电话区号 空
            "HOUSPHONENUM.s": creditJson.storage.HOUSPHONENUM, //住宅电话 空
            "UNITADD.s": creditJson.storage.UNITADD, //单位地址 TYPE==c
            "UNITZIPCODE.s": creditJson.storage.UNITZIPCODE, //单位邮编
            // "自动还款账号.s":"",//自动还款账号
            "IMMRELATION.s": creditJson.storage.IMMRELATION, //直系亲属关系 与持卡人关系 SEQ=1
            "IMMNAME.s": creditJson.storage.IMMNAME, //直系亲属姓名
            "IMMMOBILENUM.s": creditJson.storage.IMMMOBILENUM, //直系亲属手机
            "IMMPHONEAREANUM.s": creditJson.storage.IMMPHONEAREANUM, //直系亲属区号
            "IMMPHONENUM.s": creditJson.storage.IMMPHONENUM, //直系亲属电话
            "URGRELATION.s": creditJson.storage.URGRELATION, //紧急联系人关系 RELATIONSHIP
            "URGPHONEAREANUM.s": creditJson.storage.URGPHONEAREANUM, //紧急联系人区号
            "URGPHONENUM.s": creditJson.storage.URGPHONENUM, //紧急联系人电话
            "faceRecogn.s": creditJson.storage.faceRecogn, //人脸识别状态
            "localeTimestamp.s": "" + creditJson.storage.localeTimestamp, //
            "BussinessCode.s": '01', //身份证联网核查业务编号
            "CheckResult.s": lianwanghechaData.CheckResult, //身份证联网核查结果
            "ReviewUserId.s": '', //远程复核用户ID
            "platGlobalSeq.s": creditJson.storage.platGlobalSeq,
            //"IMAGEID.i":creditJson.IMAGEID//印象编号
            "workAddress.s": commonJson.workAddress,    //工作地址
            "workCountry.s": commonJson.workCountry,    //国籍
            "workProvince.s": commonJson.workState,     //省份
            "workCity.s": commonJson.workCity,          //城市
            "workArea.s": commonJson.workSubLocality,   //地区
            "longitude.s": commonJson.longitude,//客户经理轨迹定位
            "latitude.s": commonJson.latitude,//客户经理轨迹定位
            "BILLDATE.s": creditJson.storage.BILLDATE //账单日
        }]
    };
    //信息录入文字信息上传
    creditCardICardClaimsService(sendJson, function (msg) {
        creditCardICardClaimsServiceSucc(msg);
    }, function (err) {
        hideLoader();
        // err = err.replace(new RegExp("\\.[s]+\"", "g"), "\"");
        // var responseObj = JSON.parse(err);
        // var responseCode = responseObj.b[0].error[0];
        //creditJson.storage.localeTimestamp = myTime.CurTime();
        /**
        if ($.trim(responseCode.message).toUpperCase() == 'A CONNECTION FAILURE OCCURRED') {
            responseCode.message = '当前网络不可用,请检测网络!';
        }
        if ($.trim(responseCode.message).toUpperCase() == 'THE REQUEST TIMED OUT' || $.trim(responseCode.message).toUpperCase() == 'ERR_RESPONSE_TIMEOUT') {
            //TODO:Exception Operation BY Number 09
            //G20151118
            showTags({
                'title': '提示',
                'content': '系统请求超时',
                'ok': {
                    title: '继续处理',
                    fun: function () {
                        showLoader('加载中...');
                        errCredit();
                    }
                }
            });
            return;
        }
        */
        //funFail(err);
        //end G
        showTags({
            'title': '提示',
            'content': '业务处理超时!',
            'ok': {
                title: '继续处理',
                fun: function () {
                    setTimeout(function () {
                        errCredit();
                    },300);
                }
            }
        });
    });
}

function errCredit() {
    showLoader('信息提交中...');
    var isShenH = '04'; //户籍所在地
    if ((creditJson.storage.DOMICILESF + creditJson.storage.DOMICILECS).indexOf('广东') >= 0) {
        if ((creditJson.storage.DOMICILESF + creditJson.storage.DOMICILECS).indexOf('深圳') >= 0) {
            isShenH = '01';
        } else {
            isShenH = '02';
        }
    } else if ((creditJson.storage.DOMICILESF + creditJson.storage.DOMICILECS).indexOf('广西') >= 0) {
        isShenH = '03';
    } else {
        isShenH = '04';
    }
    if ($.trim(creditJson.storage.HOUSADD) == '') {
        creditJson.storage.HOUSADD = creditJson.storage.UNITADD; //如果住宅地址为空,则值为单位地址(通讯地址)
        creditJson.storage.HOUSZIPCODE = creditJson.storage.UNITZIPCODE; //如果住宅邮编为空,则值为单位邮编(通讯邮编)
    }
    if ($.trim(creditJson.storage.OTHERADD) == '') {
        creditJson.storage.OTHERADD = creditJson.storage.UNITADD; //如果其他地址为空,则值为单位地址(通讯地址)
    }
    if ($.trim(creditJson.storage.REPAYMETHOD) == '') { //判断当还款方式为空时，账号应为空
        creditJson.storage.AUTODEBITACCOUNT = creditJson.storage.REPAYMETHOD;
    }
    //creditJson.storage.localeTimestamp = myTime.CurTime();
    var sendJson = {
        "b": [{
            "state.s": creditJson.storage.lAddData,  //新增  named by lei to 补充资料
            "offlineOnline.s": creditJson.storage.offlineOnline, //脱机/联机
            "orgId.s": creditJson.storage.orgId, //隶属机构
            "moduleId.s": creditJson.storage.moduleId, //模块编号
            "tranId.s": creditJson.storage.tranId, //交易编号
            "operatorNo.s": creditJson.storage.operatorNo, //操作员
            "TLRNAME.s": creditJson.storage.TLRNAME, //操作员姓名
            "SPRNUM.s": creditJson.storage.SPRNUM, //信用卡用户 推广人编号
            "TLRCELLPHONE.s": creditJson.storage.TLRCELLPHONE, //操作员手机号码
            "deviceNo.s": creditJson.storage.deviceNo, //设备编号
            "MASCARDNAME.s": creditJson.storage.MASCARDNAME, //身份证姓名
            "SEX.s": sexJson[creditJson.storage.SEX], //性别
            "CERTTYPE.s": '1', //证件类型
            "CERTNUM.s": creditJson.storage.CERTNUM, //证件号码
            "CERTVALIDDATE.s": creditJson.storage.CERTVALIDDATE.split('-')[1].replace(/\./g, ''), //有效期截止日
            "BIRTH.s": creditJson.storage.BIRTH.replace(/-/g, ''), //出生日期
            "BRAFULLNAME.s": creditJson.storage.BRAFULLNAMEX + ' ' + creditJson.storage.BRAFULLNAMEM, //拼音姓名
            "EDUCATION.s": creditJson.storage.EDUCATION, //教育程度
            "MOBILENUM.s": creditJson.storage.MOBILENUM, //手机号码
            "HOUSTYPE.s": creditJson.storage.HOUSTYPE, //住宅类型
            "OTHERADD.s": creditJson.storage.OTHERADD, //其他地址
            "HOUSZIPCODE.s": creditJson.storage.HOUSZIPCODE, //邮编
            "EMAILADD.s": creditJson.storage.EMAILADD, //E-mail
            "DOMICILE.s": isShenH, //户籍所在地
            "HOUSREGADD.s": creditJson.storage.ADDRESS, //户籍地址
//          "RECEMPNUM.s": creditJson.storage.REFERENCE, //推荐人
            //2016.3.17新增字段
            "RECMOBILENUM.s": creditJson.storage.RECMOBILENUM, //推荐人手机号
            "RECEMPNUM.s": creditJson.storage.RECEMPNUM, //推荐人工号
            "MARSTATU.s": creditJson.storage.MASRTATU, //婚姻状况
            "OFFICE.s": creditJson.storage.OFFICE, //职位／岗位
            "UNITWORKEXP.s": creditJson.storage.UNITWORKEXP, //在现单位工作年限
            "INTOSOURCE.s": creditJson.storage.INTOSOURCE, //进件来源
            "CUSCARDAPPLY.s": creditJson.storage.CUSCARDAPPLY, //申请额度
            //2016.3.17新增字段
            "UNITNAME.s": creditJson.storage.UNITNAME, //单位全称
            "UNITPROPERTY.s": creditJson.storage.UNITPROPERTY, //单位性质
            "UNITPHONEAREANUM.s": creditJson.storage.UNITPHONENUMQH, //单位固话区号
            "UNITPHONENUM.s": creditJson.storage.UNITPHONENUMHM, //单位固话号码
            "INDCATEGORY.s": creditJson.storage.INDCATEGORY, //行业类别
            "ANNINCOME.s": creditJson.storage.ANNINCOME, //年收入
            "URGNAME.s": creditJson.storage.URGNAME, //紧急联系人姓名
            "URGMOBILENUM.s": removeSpace(creditJson.storage.URGMOBILENUM), //紧急联系人手机
            "CARDSENDADDTYPE.s": "O", //卡片递送地址 与通讯地址一致 O custermerInfo.cCardAddr
            "ISAUTOPURCHASE.s": "0", //是否自动购汇
            "AUTODEBITACCOUNT.s": creditJson.storage.AUTODEBITACCOUNT, //账号/卡号
            "REPAYMETHOD.s": creditJson.storage.REPAYMETHOD, //自动还款方式
            "CARDFEETYPE.s": creditJson.storage.CARDFEETYPE, //年费类型
            "APPCARDTYPE.s": creditJson.storage.PRODUCTCD, //卡产品代码
            "HOUSADD.s": creditJson.storage.HOUSADD, //家庭地址 核心地址接口 TYPE==h
            "HOUSPHONEAREANUM.s": creditJson.storage.HOUSPHONEAREANUM, //住宅电话区号 空
            "HOUSPHONENUM.s": creditJson.storage.HOUSPHONENUM, //住宅电话 空
            "UNITADD.s": creditJson.storage.UNITADD, //单位地址 TYPE==c
            "UNITZIPCODE.s": creditJson.storage.UNITZIPCODE, //单位邮编
            // "自动还款账号.s":"",//自动还款账号
            "IMMRELATION.s": creditJson.storage.IMMRELATION, //直系亲属关系 与持卡人关系 SEQ=1
            "IMMNAME.s": creditJson.storage.IMMNAME, //直系亲属姓名
            "IMMMOBILENUM.s": creditJson.storage.IMMMOBILENUM, //直系亲属手机
            "IMMPHONEAREANUM.s": creditJson.storage.IMMPHONEAREANUM, //直系亲属区号
            "IMMPHONENUM.s": creditJson.storage.IMMPHONENUM, //直系亲属电话
            "URGRELATION.s": creditJson.storage.URGRELATION, //紧急联系人关系 RELATIONSHIP
            "URGPHONEAREANUM.s": creditJson.storage.URGPHONEAREANUM, //紧急联系人区号
            "URGPHONENUM.s": creditJson.storage.URGPHONENUM, //紧急联系人电话
            "faceRecogn.s": creditJson.storage.faceRecogn, //人脸识别状态
            "localeTimestamp.s": "" + creditJson.storage.localeTimestamp, //
            "platGlobalSeq.s": creditJson.storage.platGlobalSeq,
            //"IMAGEID.i":creditJson.IMAGEID//印象编号
            "workAddress.s": commonJson.workAddress,    //工作地址
            "workCountry.s": commonJson.workCountry,    //国籍
            "workProvince.s": commonJson.workState,     //省份
            "workCity.s": commonJson.workCity,          //城市
            "workArea.s": commonJson.workSubLocality,   //地区
            "longitude.s": commonJson.longitude,//客户经理轨迹定位
            "latitude.s": commonJson.latitude,//客户经理轨迹定位
            "BILLDATE.s": creditJson.storage.BILLDATE //账单日
        }]
    };
    //信息录入文字信息上传
    creditCardICardClaimsService(sendJson, function (msg) {
        creditCardICardClaimsServiceSucc(msg);
    }, function (err) {
        hideLoader();
        showTags({
            'title': '提示',
            'content': '业务处理超时!',
            'ok': {
                title: '继续处理',
                fun: function () {
                    setTimeout(function () {
                        errCredit();
                    },300);
                }
            }
        });
    })
}
//信息录入个人信息上传 成功回调 yu
function creditCardICardClaimsServiceSucc(msg) {
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    var sql = "";
    if (responseCode[0].results == '00' || responseCode[0].results == '13') {
//      creditJson.storage.platGlobalSeq = responseCode[0].platGlobalSeq; //流水号
        //提交成功,修改数据库中对应压缩包的上传状态
        changeUploadStatus("02", creditJson.storage.phoneTime, creditJson.storage.signTime);
        if (responseCode[0].results == '13') {//业务处理成功后台报错弹窗
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {
                    fun: function () {
                        $.mobile.changePage('credit-complete.html');
                    }
                }
            });
        } else {
            $.mobile.changePage('credit-complete.html');
        }
    } else if (responseCode[0].results == '08') {
        errCredit();
    } else {
        if (responseCode[0].results == '09') {
            //TODO:Exception Operation BY Number 09
            //G20151118
            showTags({
                'title': '提示',
                'content': '业务处理超时!'+responseCode[0].message,
                'ok': {
                    title: '继续处理',
                    fun: function () {
                        setTimeout(function () {
                            errCredit();
                        },300);
                    }
                }
            });
        } else {
            //提交失败,修改数据库中对应压缩包的上传状态
            changeUploadStatus("03", creditJson.storage.phoneTime, creditJson.storage.signTime);
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {}
            });
        }
    }

}

//信用卡核心信息查询 成功回调
function creditICcCtInfoServiceSucc(msg) {
    //反显查询的数据：手机号码  教育程度   住宅类型   E-MAIL   单位全称    单位固话   单位性质    年收入  行业类别(就业状态+单位性质 判断)
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    
    if (responseCode[0].results == '00') {
//      if ($.trim(responseCode[1].iCcCtInfoService[0].CH_GIVEN_NAME) != creditJson.storage.MASCARDNAME) {
//          showTags({
//              'title': '提示',
//              'content': '身份证姓名与信用卡核心姓名不一致,无法办理',
//              'ok': {
//                  fun: function() {
//                      $.mobile.changePage('credit-product.html', {
//                          reverse: true
//                      });
//                  }
//              }
//          });
//          return;
//      }
        if (responseCode[0].resource == '0' || responseCode[0].resource == '1' || responseCode[0].resource == '2') {
            debitEnter.querySuss = true;
            $("#s_province").val("省份").selectmenu('refresh');
            $("#s_city").val("城市").selectmenu('refresh');
        }
        if (responseCode[0].resource == '2') {
            $('#c-ndustry').val($.trim(responseCode[1].clientDescVO[0].INDUSTRY)).selectmenu('refresh'); //行业类别
        }
        if (responseCode[0].resource == '1' && responseCode[1].clientDescVO[0].pinYin) {
            $('#c-en-xing').val($.trim(responseCode[1].clientDescVO[0].pinYin.split(' ')[0])); //拼音姓名
            $('#c-en-ming').val($.trim(responseCode[1].clientDescVO[0].pinYin.split(' ')[1])); //拼音姓名
        }
        $('#c-room-style').val($.trim(responseCode[1].clientDescVO[0].HOUSETYPE)).selectmenu('refresh'); //住宅类型
        //$('#c-mobile').val(telNum(responseCode[1].clientDescVO[0].MOBILEPHONE)); //手机号码
        $('#c-email').val($.trim(responseCode[1].clientDescVO[0].CUEMAL)); //MAIL
        $('#c-com-name').val($.trim(responseCode[1].clientDescVO[0].EMPLOYER_NAME)); //单位全称
        $('#c-com-property').val($.trim(responseCode[1].clientDescVO[0].COMPSTRUCTURE)).selectmenu('refresh'); //单位性质
        if (responseCode[1].clientDescVO[0].EMPLOYER_PHONE.indexOf('-') != -1) {
            $('#c-com-tel1').val($.trim(responseCode[1].clientDescVO[0].EMPLOYER_PHONE).split('-')[0]); //区号COMPANYPHONE
            $('#c-com-tel2').val($.trim(responseCode[1].clientDescVO[0].EMPLOYER_PHONE).split('-')[1]); //固话COMPANYPHONE
        } else {
            $('#c-com-tel2').val($.trim(responseCode[1].clientDescVO[0].EMPLOYER_PHONE));
        }
        if ($.trim(responseCode[1].clientDescVO[0].YEARSWORKING) == 0) {
            responseCode[1].clientDescVO[0].YEARSWORKING = '';
        }
        $('#ZXDWGZNX').val($.trim(responseCode[1].clientDescVO[0].YEARSWORKING)); //工作年限
        $('#c-income').val(fmoney($.trim(responseCode[1].clientDescVO[0].ANNUALEARNING), 2).split('.')[0]); //年收入fmoney($.trim(responseCode[1].clientDescVO[0].ANNUALEARNING), 2)  rmoney(fmoney($.trim(responseCode[1].clientDescVO[0].ANNUALEARNING), 2).split(',').join(''))
        $('#ZhiWeiGangWei').val($.trim(responseCode[1].clientDescVO[0].POST)).selectmenu('refresh'); ////职位／岗位POST.s
        $('#c-edu').val($.trim(responseCode[1].clientDescVO[0].EDUCATION)).selectmenu('refresh'); ////最高学历
        $('#c-contact-name').val($.trim(responseCode[1].clientDescVO[0].URGENT_CONTACTOR)); //紧急联系人姓名
        $('#c-contact-mobile').val(telNum(responseCode[1].clientDescVO[0].CONTACT_PHONE)); //紧急联系人手机
        //婚姻状况
        var hunyinzhuangkuang = $.trim(responseCode[1].clientDescVO[0].MARITAL_STATUS); //婚姻状况
        if (responseCode[0].resource == '2') {//核心1是        
        	//resource--信息来源：2，信用卡  1，icbs   0，meap平台   //这里是需要将resource字段缓存，用以在前后页面跳转、暂存时判断如“账单日”“详细地址”等相关字段的展示效果
            if (hunyinzhuangkuang == '1') {//1\未婚
                $("#none_yihun").hide().siblings("#none_weihun").show();
            } else if (hunyinzhuangkuang == '2') {//2已婚
                $("#none_weihun").hide().siblings("#none_yihun").show();
            } else {//3\4\5\6\7*其他
                $("#none_yihun").hide().siblings("#none_weihun").show();
            }
            $('#billDateDiv').remove();
        } else {//平台1是已婚，2是未婚
            if (hunyinzhuangkuang == '1') {
                $("#none_yihun").hide().siblings("#none_weihun").show();
//              $("#none_weihun").hide().siblings("#none_yihun").show();
            } else if (hunyinzhuangkuang == '2') {
                $("#none_weihun").hide().siblings("#none_yihun").show();
            } else {
                $("#none_yihun").hide().siblings("#none_weihun").show();
            }
        }
        creditJson.storage.EMAILADD = $.trim(responseCode[1].clientDescVO[0].CUEMAL); //email
        creditJson.storage.UNITZIPCODE = $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[0].contactInfo[0].POSTAL_CODE); //邮编
        creditJson.storage.UNITADD = $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[0].contactInfo[0].ADDRESS2); //通讯地址
        creditJson.storage.resource=$.trim(responseCode[0].resource);//消息来源  2 信用卡
        //手机号
        $.each(responseCode[1].clientDescVO[2].CONTACT_INFO, function (index, el) {
            if ($.trim(el.contactInfo[0].CONTACT_TYPE) == 'PHM') {
                creditJson.storage.MOBILENUM = el.contactInfo[0].CONTACT_ID //手机号码
                $('#c-mobile').val(telNum(el.contactInfo[0].CONTACT_ID)); //手机号码
            } else {
                creditJson.storage.MOBILENUM = '';
            }
        });
        //$('#c-email').val(creditJson.storage.EMAILADD); //email
        $('#c-zipcode').val($.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[0].contactInfo[0].POSTAL_CODE)); //邮编
        $('#c-addr-detail,#masterID_cardAddress').val($.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[0].contactInfo[0].ADDRESS2)); //通讯地址\户籍地址


        //联系人查询
        showLoader('信用卡核心联系人信息查询中...');
        creditICcCtAddrRelInfoServiceCtRelInfoFun(function (msg) {
            hideLoader();
            msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
            var responseObj = JSON.parse(msg);
            var responseCode = responseObj.b;
            if (responseCode[0].results == '00') {
                $.each(responseCode[1].ccCtRelVO[1].RELATION_ARRAY, function (index, el) {
                    if (el.ccCtRel[0].SEQ == '2') {
                        $('#c-contact-name').val($.trim(el.ccCtRel[0].NAME)); //紧急联系人姓名
                        $('#c-contact-mobile').val(telNum($.trim(el.ccCtRel[0].MOBILEPHONE))); //紧急联系人手机
                        creditJson.storage.URGRELATION = $.trim(el.ccCtRel[0].RELATIONSHIP); //紧急联系人关系
                        if ($.trim(el.ccCtRel[0].TELEPHONE) != '' && $.trim(el.ccCtRel[0].TELEPHONE).indexOf('-') > 0) {
                            // creditJson.storage.URGPHONEAREANUM = $.trim(el.ccCtRel[0].TELEPHONE).split('-')[0]; //紧急联系人区号
                            // creditJson.storage.URGPHONENUM = $.trim(el.ccCtRel[0].TELEPHONE).split('-')[1]; //紧急联系人电话
                            creditJson.storage.URGPHONEAREANUM = ''; //紧急联系人区号
                            creditJson.storage.URGPHONENUM = ''; //紧急联系人电话
                            return false;
                        }
                    } else if (el.ccCtRel[0].SEQ == '1') { //

                        creditJson.storage.IMMRELATION = $.trim(el.ccCtRel[0].RELATIONSHIP); //直系亲属关系 与持卡人关系
                        creditJson.storage.IMMNAME = el.ccCtRel[0].NAME; //直系亲属姓名
                        creditJson.storage.IMMMOBILENUM = el.ccCtRel[0].MOBILEPHONE; //直系亲属手机
                        if ($.trim(el.ccCtRel[0].TELEPHONE) != '' && $.trim(el.ccCtRel[0].TELEPHONE).indexOf('-') > 0) {
                            creditJson.storage.IMMPHONEAREANUM = $.trim(el.ccCtRel[0].TELEPHONE).split('-')[0]; //直系亲属区号
                            creditJson.storage.IMMPHONENUM = $.trim(el.ccCtRel[0].TELEPHONE).split('-')[1]; //直系亲属电话
                        }

                    }

                })
                //户籍地址

            } else {
                if (responseCode[0].results == '08') { // session失效
                    creditSessionInvalid = true;
                } //else {
//                  showTags({
//                      'title': '提示',
//                      'content': responseCode[0].message,
//                      'ok': {}
//                  });
//              }
            }
            showLoader('信用卡核心客户地址信息查询中...');
            creditICcCtAddrRelInfoServiceCtAddrInfoFun(function (msg) {
                hideLoader();
                msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
                var responseObj = JSON.parse(msg);
                var responseCode = responseObj.b;
                if (responseCode[0].results == '00') { //邮编    户籍地址  通讯地址*（取公司地址）
                    $.each(responseCode[1].ccCtAddrVO[1].ADDRLIST_ARRAY, function (index, el) {
                        if (el.ccCtAddr[0].TYPE == 'C') {
                            $('#c-addr-detail').val($.trim(el.ccCtAddr[0].DETAILADDR)); //通讯地址--单位地址
                            $('#c-zipcode').val(el.ccCtAddr[0].ZIP); //邮编
                            if ($.trim(el.ccCtAddr[0].STATE) != '' && !debitEnter.querySuss) {
                                $("#s_province-button span").html(el.ccCtAddr[0].STATE);
                                $("#s_province").val(el.ccCtAddr[0].STATE);
                                change(1, 0);
                            }
                            if ($.trim(el.ccCtAddr[0].CITY) != '' && !debitEnter.querySuss) {
                                $("#s_city-button span").html(el.ccCtAddr[0].CITY);
                                $("#s_city").val(el.ccCtAddr[0].CITY);
                                change(1, 1);
                            }
                            creditJson.storage.UNITADD = $.trim(el.ccCtAddr[0].STATE) + $.trim(el.ccCtAddr[0].CITY) + $.trim(el.ccCtAddr[0].DETAILADDR); //单位地址
                            creditJson.storage.UNITZIPCODE = el.ccCtAddr[0].ZIP; //单位邮编
                        } else if (el.ccCtAddr[0].TYPE == 'H') {
                            creditJson.storage.HOUSADD = $.trim(el.ccCtAddr[0].STATE) + $.trim(el.ccCtAddr[0].CITY) + $.trim(el.ccCtAddr[0].DETAILADDR); //家庭地址
                            creditJson.storage.HOUSZIPCODE = el.ccCtAddr[0].ZIP; //家庭地址邮编

                        } else if (el.ccCtAddr[0].TYPE == 'O') { //其他地址
                            creditJson.storage.OTHERADD = $.trim(el.ccCtAddr[0].STATE) + $.trim(el.ccCtAddr[0].CITY) + $.trim(el.ccCtAddr[0].DETAILADDR); //家庭地址
                        }
                    });

//                      showLoader('信用卡核心自动还款卡账号信息查询中...');
//                      creditICcCtAddrRelInfoServiceCtAcctInfoFun(function(msg) {
//                          hideLoader();
//                          msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
//                          var responseObj = JSON.parse(msg);
//                          var responseCode = responseObj.b;
//                          if (responseCode[0].results == '00') { //还款卡账号
//                              if (responseCode[1].iCcCtAccInfoService[0].TOTALNUM >= 1) { //有卡账号
//                                  if (responseCode[1].iCcCtAccInfoService[1].ACCOUNT[0].ValueObject[0].ISACTIVE == 'Y') { //自动还款
//                                      $('#c-card-repay').val('1').selectmenu('refresh');
//                                      $('.y-c-card-repay').show();
//                                      $('#c-card-repaystyle').val(responseCode[1].iCcCtAccInfoService[1].ACCOUNT[0].ValueObject[0].PAYTYPE).attr('disabled', 'disabled').selectmenu('refresh');
//                                      $('#c-card-card').html('<option>' + responseCode[1].iCcCtAccInfoService[1].ACCOUNT[0].ValueObject[0].ACCOUNT + '</option>').attr('disabled', 'disabled').selectmenu('refresh');
//                                      creditJson.storage.ISAUTOPURCHASEISDISABLED = 'istrueAll'; //自动还款功能和还款方式及卡号不可修改  都含有disabled属性
//
//                                  }
//                              }
//                          } else {
//                              if (responseCode[0].results == '08') { // session失效
//                                  creditSessionInvalid = true;
//                              }
//                              /* $('#c-card-repay').val('0').attr('disabled', 'disabled').selectmenu('refresh');
//                               $('.y-c-card-repay').hide();
//                               $('#c-card-card').html('');*/
//                          }
//                      }, function(err) {
//                          funFail(err);
//                      });
                } else {
                    if (responseCode[0].results == '08') { // session失效
                        creditSessionInvalid = true;
                    }// else {
//                          showTags({
//                              'title': '提示',
//                              'content': responseCode[0].message,
//                              'ok': {}
//                          });
//                      }
                }
                showLoader('信用卡核心自动还款卡账号信息查询中...');
                creditICcCtAddrRelInfoServiceCtAcctInfoFun(function (msg) {
                    hideLoader();
                    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
                    var responseObj = JSON.parse(msg);
                    var responseCode = responseObj.b;
                    if (responseCode[0].results == '00') { //还款卡账号
                        if (responseCode[1].reimbursementAcctVO[0].ISACTIVE == 'Y') { //自动还款
                            $('#c-card-repay').val('1').selectmenu('refresh');
                            $('.y-c-card-repay').show();
                            $('#c-card-repaystyle').val(responseCode[1].reimbursementAcctVO[0].PAYTYPE).attr('disabled', 'disabled').selectmenu('refresh');
                            $('#c-card-card').html('<option>' + responseCode[1].reimbursementAcctVO[0].ACCOUNT + '</option>').attr('disabled', 'disabled').selectmenu('refresh');
                            creditJson.storage.ISAUTOPURCHASEISDISABLED = 'istrueAll'; //自动还款功能和还款方式及卡号不可修改  都含有disabled属性

                        } else {//自动还款为空查询客户所有银行账号
                            showLoader('卡账号查询中...');
                            //查询卡账号
                            var sendJson = {
                                "b": [{
                                    /*"CLIENT_NO.s": "0701657997", //客户号
                                     "CLIENT_NAME.s": "张三", //客户名称*/
                                    "CLIENT_NO.s": creditJson.storage.CLIENT_NO, //客户号
                                    "CLIENT_NAME.s": creditJson.storage.MASCARDNAME, //客户名称
                                    "DOCUMENT_TYPE.s": "0", //证件类型
                                    "DOCUMENT_ID.s": creditJson.storage.CERTNUM, //证件号
                                    "deviceNo.s": creditJson.storage.deviceNo, //设备编号
                                    "moduleId.s": creditJson.storage.moduleId, //模块名
                                    "tranId.s": creditJson.storage.tranId, //交易名
                                    "orgId.s": creditJson.storage.orgId, //机构号
                                    "operatorNo.s": creditJson.storage.operatorNo, //操作员
                                    "offlineOnline.s": creditJson.storage.offlineOnline, //脱机/联机
                                    "workAddress.s": creditJson.storage.ipadWorkAddress //工作地址
                                }]
                            };
                            INetBankProductServiceFun(sendJson, function (msg) {
                                hideLoader();
                                msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
                                var responseObj = JSON.parse(msg);
                                var responseCode = responseObj.b;
                                if (responseCode[0].results == '00') {
                                    var textHtml = '';
                                    citigoldJson.AllBankAcc = [];
                                    $.each(responseCode, function (index, el) {
                                        if (index == '0') return true;
                                        textHtml += '<option>' + el.docLicenceVO[0].ISSUE_ACCT_NO + '</option>';
                                        citigoldJson.AllBankAcc.push(el.docLicenceVO[0].ISSUE_ACCT_NO); //签约的所有账号
                                    })
                                    $('#c-card-card').html(textHtml).selectmenu('refresh');
                                    $('#c-card-repay').removeAttr('disabled').selectmenu('refresh');
                                    creditJson.storage.ISAUTOPURCHASEISDISABLED = 'isfalse'; //自动还款功能是否含有disabled属性
                                    //alert($('#c-card-repay').attr('disabled'));

                                }
                            }, function (err) {

                            })
                        }
                    } else {
                        if (responseCode[0].results == '08') { // session失效
                            creditSessionInvalid = true;
                        } else {
                            showLoader('卡账号查询中...');
                            //查询卡账号
                            var sendJson = {
                                "b": [{
                                    /*"CLIENT_NO.s": "0701657997", //客户号
                                     "CLIENT_NAME.s": "张三", //客户名称*/
                                    "CLIENT_NO.s": creditJson.storage.CLIENT_NO, //客户号
                                    "CLIENT_NAME.s": creditJson.storage.MASCARDNAME, //客户名称
                                    "DOCUMENT_TYPE.s": "0", //证件类型
                                    "DOCUMENT_ID.s": creditJson.storage.CERTNUM, //证件号
                                    "deviceNo.s": creditJson.storage.deviceNo, //设备编号
                                    "moduleId.s": creditJson.storage.moduleId, //模块名
                                    "tranId.s": creditJson.storage.tranId, //交易名
                                    "orgId.s": creditJson.storage.orgId, //机构号
                                    "operatorNo.s": creditJson.storage.operatorNo, //操作员
                                    "offlineOnline.s": creditJson.storage.offlineOnline, //脱机/联机
                                    "workAddress.s": creditJson.storage.ipadWorkAddress //工作地址
                                }]
                            };
                            INetBankProductServiceFun(sendJson, function (msg) {
                                hideLoader();
                                msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
                                var responseObj = JSON.parse(msg);
                                var responseCode = responseObj.b;
                                if (responseCode[0].results == '00') {
                                    var textHtml = '';
                                    citigoldJson.AllBankAcc = [];
                                    $.each(responseCode, function (index, el) {
                                        if (index == '0') return true;
                                        textHtml += '<option>' + el.docLicenceVO[0].ISSUE_ACCT_NO + '</option>';
                                        citigoldJson.AllBankAcc.push(el.docLicenceVO[0].ISSUE_ACCT_NO); //签约的所有账号
                                    })
                                    $('#c-card-card').html(textHtml).selectmenu('refresh');
                                    $('#c-card-repay').removeAttr('disabled').selectmenu('refresh');
                                    creditJson.storage.ISAUTOPURCHASEISDISABLED = 'isfalse'; //自动还款功能是否含有disabled属性
                                    //alert($('#c-card-repay').attr('disabled'));

                                }
                            }, function (err) {

                            });
                        }
                        /* $('#c-card-repay').val('0').attr('disabled', 'disabled').selectmenu('refresh');
                         $('.y-c-card-repay').hide();
                         $('#c-card-card').html('');*/
                    }
                }, function (err) {
                    funFail(err);
                });
            }, function (err) {
                funFail(err);
            });
        }, function (err) {

        });
        // $('#c-edu').val(creditJson.khxxReturn.QUALIFICATION).selectmenu('refresh'); //最高学历
        // $('#c-room-style').val(creditJson.khxxReturn.HOUSETYPE).selectmenu('refresh'); //住宅类型
        // $('#c-mobile').val(creditJson.khxxReturn.MOBILEPHONE).attr('disabled', 'disabled'); //手机号码
        // $('#c-email').val(creditJson.khxxReturn.EMAIL); //MAIL
        // $('#c-com-name').val(creditJson.khxxReturn.COMPANYNAME); //单位全称
        // $('#c-com-property').val(creditJson.khxxReturn.COMPSTRUCTURE).selectmenu('refresh'); //单位性质
        // $('#c-com-tel1').val(creditJson.khxxReturn.COMPANYPHONE.split('-')[0]); //区号
        // $('#c-com-tel2').val(creditJson.khxxReturn.COMPANYPHONE.split('-')[1]); //固话
        // $('#c-income').val(creditJson.khxxReturn.ANNUALEARNING); //年收入


    } else {
//      if (responseCode[0].results == '03') { //信用卡核心找不到客户信息  查询icbs核心数据
//
//          /*$('#c-card-repay').val('0').attr('disabled', 'disabled').selectmenu('refresh');
//          $('.y-c-card-repay').hide();
//          $('#c-card-card').html('');*/
//          //$.mobile.changePage('credit-agreement.html');
//          // creditJson.CLIENT_NO='11';
//          if (creditJson.storage.CLIENT_NO) { //核心有客户号 查询客户信息
//              IEstablishCustomerInformationServiceCreditFun();
//          }
//      } else {
        if (responseCode[0].results == '08') { // session失效
            hideLoader();
            creditSessionInvalid = true;
        } else if (responseCode[0].results == '03') {
            hideLoader();
        } else {
            hideLoader();
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {}
            });
        }
//      }
    }
    // 自动还款功能 方式 卡号是否可点击
    if (creditJson.storage.ISAUTOPURCHASEISDISABLED == 'istrue') { //只有还款功能不可点击
        $('#c-card-repay').attr('disabled', 'disabled').selectmenu('refresh');

    } else if (creditJson.storage.ISAUTOPURCHASEISDISABLED == 'istrueAll') { //都不能点击
        $('#c-card-repay').attr('disabled', 'disabled').selectmenu('refresh');
        $('#c-card-repaystyle,#c-card-card').attr('disabled', 'disabled')

    } else { //可点击
        $('#c-card-repay').removeAttr('disabled').selectmenu('refresh');
    }
}
/* 客户联系人信息查询 成功回调*/
function creditICcCtAddrRelInfoServiceCtRelInfoSucc(msg) {
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == "00") {
    } else {
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}
/* 客户地址信息查询 成功回调*/
function creditICcCtAddrRelInfoServiceCtAddrInfoSucc(msg) {
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == "00") {
    } else {
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}
/* 自动还款查询 成功回调*/
function creditICcCtAddrRelInfoServiceCtAcctInfoSucc(msg) {
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == "00") {
    } else {
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}
//核心信息查询 成功回调
//function IEstablishCustomerInformationServiceFCreditSucc(msg) {
//  hideLoader();
//  msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
//  var responseObj = JSON.parse(msg);
//  var responseCode = responseObj.b;
//  if (responseCode[0].results == '00') {
//
//      //反显：手机号 教育程度 通讯地址 邮编 email 户籍地址
//      //CUZGXW 10研究生 20大学本科 30大学专科和专科学校 40中等专业学校或中等技术学校 50技术学校 60高中 70初中 80小学 90文盲或半文盲 99未知
//      // 1初中及以下 2高中 3大专 4本科 5研究生及以上
//      var cuzgxw = $.trim(responseCode[1].clientDescVO[0].EDUCATION); //最高学历
//      if (cuzgxw == '' && cuzgxw == '99') {
//          creditJson.storage.EDUCATION = '4'; //需求文档默认值
//      } else if (cuzgxw == '90' || cuzgxw == '80' || cuzgxw == '70') {
//          creditJson.storage.EDUCATION = '1'; //初中及以下
//      } else if (cuzgxw == '60' || cuzgxw == '50' || cuzgxw == '40') {
//          creditJson.storage.EDUCATION = '2'; //高中
//      } else if (cuzgxw == '30') {
//          creditJson.storage.EDUCATION = '3'; //大专
//      } else if (cuzgxw == '20') {
//          creditJson.storage.EDUCATION = '4'; //本科
//      } else if (cuzgxw == '10') {
//          creditJson.storage.EDUCATION = '5'; //5研究生及以上
//      } else {
//          creditJson.storage.EDUCATION = '4'; //需求文档默认值
//      }
//      creditJson.storage.EMAILADD = $.trim(responseCode[1].clientDescVO[0].CUEMAL); //email
//      creditJson.storage.UNITZIPCODE = $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[0].contactInfo[0].POSTAL_CODE); //邮编
//      creditJson.storage.UNITADD = $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[0].contactInfo[0].ADDRESS2); //通讯地址
//      //手机号
//      $.each(responseCode[1].clientDescVO[2].CONTACT_INFO, function(index, el) {
//          if ($.trim(el.contactInfo[0].CONTACT_TYPE) == 'PHM') {
//              creditJson.storage.MOBILENUM = el.contactInfo[0].CONTACT_ID //手机号码
//          }
//      });
//      $('#c-edu').val(creditJson.storage.EDUCATION).selectmenu('refresh'); //教育程度 
//      $('#c-email').val(creditJson.storage.EMAILADD); //email
//      $('#c-mobile').val(telNum(creditJson.storage.MOBILENUM)); //手机号码
//      $('#c-zipcode').val(creditJson.storage.UNITZIPCODE); //邮编
//      $('#c-addr-detail,#masterID_cardAddress').val(creditJson.storage.UNITADD); //通讯地址\户籍地址
//      showLoader('卡账号查询中...');
//      //查询卡账号
//      var sendJson = {
//          "b": [{
//              /*"CLIENT_NO.s": "0701657997", //客户号
//              "CLIENT_NAME.s": "张三", //客户名称*/
//              "CLIENT_NO.s": creditJson.storage.CLIENT_NO, //客户号
//              "CLIENT_NAME.s": creditJson.storage.MASCARDNAME, //客户名称
//              "DOCUMENT_TYPE.s": "0", //证件类型
//              "DOCUMENT_ID.s": creditJson.storage.CERTNUM, //证件号
//              "deviceNo.s": creditJson.storage.deviceNo, //设备编号
//              "moduleId.s": creditJson.storage.moduleId, //模块名
//              "tranId.s": creditJson.storage.tranId, //交易名
//              "orgId.s": creditJson.storage.orgId, //机构号
//              "operatorNo.s": creditJson.storage.operatorNo, //操作员
//              "offlineOnline.s": creditJson.storage.offlineOnline, //脱机/联机
//              "workAddress.s": creditJson.storage.ipadWorkAddress //工作地址
//          }]
//      };
//      INetBankProductServiceFun(sendJson, function(msg) {
//          hideLoader();
//          msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
//          var responseObj = JSON.parse(msg);
//          var responseCode = responseObj.b;
//          if (responseCode[0].results == '00') {
//              var textHtml = '';
//              citigoldJson.AllBankAcc = [];
//              $.each(responseCode, function(index, el) {
//                  if (index == '0') return true;
//                  textHtml += '<option>' + el.docLicenceVO[0].ISSUE_ACCT_NO + '</option>';
//                  citigoldJson.AllBankAcc.push(el.docLicenceVO[0].ISSUE_ACCT_NO); //签约的所有账号
//              })
//              $('#c-card-card').html(textHtml).selectmenu('refresh');
//              $('#c-card-repay').removeAttr('disabled').selectmenu('refresh');
//              creditJson.storage.ISAUTOPURCHASEISDISABLED = 'isfalse'; //自动还款功能是否含有disabled属性
//              //alert($('#c-card-repay').attr('disabled'));
//
//          }
//      }, function(err) {
//
//      })
//  } else if (responseCode[0].results == '01') { //ICBS_记录不存在
//      /*$('#c-card-repay').val('0').attr('disabled', 'disabled').selectmenu('refresh');
//      $('.y-c-card-repay').hide();
//      $('#c-card-card').html('');*/
//  } else {
//      showTags({
//          'title': '提示',
//          'content': responseCode[0].message,
//          'ok': {}
//      });
//  }
//
//}

/*影像两两对比成功回调*/
function IFacelRecognitionServiceCreditSucc(msg) {
    //alert(msg);
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '0') {
        if (responseCode[1].photoCompareVO[0].CHIP_RESULT == "0") { //芯片通过
            $("#credit-personFace .face-result:eq(0)").text('通过');
        } else {
            $("#credit-personFace .face-result:eq(0)").addClass('no-pass').text('未通过');
        }
        if (responseCode[1].photoCompareVO[0].CARD_RESULT == "0") { //联网核查通过
            $("#credit-personFace .face-result:eq(1)").text('通过');
        } else {
            $("#credit-personFace .face-result:eq(1)").addClass('no-pass').text('未通过');
        }
        if (responseCode[1].photoCompareVO[0].CHIP_RESULT == "0" && responseCode[1].photoCompareVO[0].CARD_RESULT == "0") {
            $("#credit-personFace .center-header").text('人脸识别通过！');
        } else {
            $("#credit-personFace .center-header").text('人脸识别未通过！');
        }

        $('#credit-personFace .previous:last').addClass('btn_next');

    } else if (responseCode[0].results == '08') {
        hideLoader();
    } else {
        $("#credit-personFace .center-header").text('人脸识别失败！');
        $("#credit-personFace .face-result:eq(0)").addClass('no-pass').text('未通过');
        $("#credit-personFace .face-result:eq(1)").addClass('no-pass').text('未通过');
        $('#credit-personFace .previous:last').addClass('btn_next');
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}