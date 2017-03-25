//运营影像卡联网核查 成功回调 yu
function imagingItizenCertificateIdenifySucc(msg) {
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == "00") {
        hideLoader();
        if (responseCode[1].citizenCertificateIdentifyVO[0].CHECKRESULT == "00") { //联网核查成功
            lianwanghechaData.CheckResult = '00';
            $("#ImagingOperations-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
            creditJson.storage.checkPhoto = base64decode(responseCode[1].citizenCertificateIdentifyVO[0].PHOTO); //联网核查返回照片
            $('#xk-read-next').addClass('btn_next');
            if (creditJson.isPrev.QTZJcanJump) {
                $.mobile.changePage('ImagingOperations-customerP.html');
            }
        } else {
            lianwanghechaData.CheckResult = '01';
            $("#ImagingOperations-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
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
                creditJson.storage.checkPhoto = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
                //custermerInfo.checkPhoto = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
                //eleSignJson.lianPic = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
            });
            showTags({
                'title': '提示',
                'content': '联网核查返回CHECKRESULT值失败：' + responseCode[0].message,
                'ok': {
                    'title': '放弃',
                    'fun': function () {
                        $.mobile.changePage('ImagingOperations-readingID.html', {reverse: true});
                    }
                },
                'cancel': {
                    'title': '继续',
                    'fun': function () {
                        $.mobile.changePage('ImagingOperations-customerP.html');
                    }
                }
            });
        }
    } else if (responseCode[0].results == "08") {
        showLoader('联网核查中...');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "orgId.s": commonJson.orgId,//机构号
                "moduleId.s": ImagingOperaTions.moduleId,//模块编号
                "tranId.s": ImagingOperaTions.tranId,//交易编号
                "operatorNo.s": commonJson.adminCount,//操作员
                "deviceNo.s": commonJson.udId,//设备编号
                "DOCUMENT_TYPE.s": "0",//证件类型
                "DOCUMENT_ID.s": ImagingOperaTions.DOCUMENT_ID ? ImagingOperaTions.DOCUMENT_ID : ImagingOperaTions.AGENT_DOC_NO,//身份证号码
                "CLIENT_NAME.s": ImagingOperaTions.CLIENT_NAME ? ImagingOperaTions.CLIENT_NAME : ImagingOperaTions.AGENT_NAME,//被核对人姓名
                "BUSSINESSCODE.s": "01",//业务总类
                "BRANCH_ID.s": commonJson.orgId//机构号
            }]
        };
        //身份证联网核查
        icitizenCertificateIdenifyFun(sendJson, function (msg) {
            imagingItizenCertificateIdenifySucc(msg);
        }, function (err) {
            funFail(err);
        });
    } else if (responseCode[0].results == "09") {
        hideLoader();
        $('.footter .previous:eq(1)').removeClass('btn_next');
        $('.footter .previous:eq(0)').removeClass('btn_next');
        $('.footter .previous:eq(0)').removeClass('back-1');
        $(".lianwanghecha-yichang").show();
        $('.sh_loading_box_shadow').remove();
        $('.header .head-left,.header .head-right,.footter .previous:eq(0)').removeClass('btn-cannt-click');
        $(".loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查异常！</div>');
        lianwanghechaData.CheckResult = '09';
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
            creditJson.storage.checkPhoto = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
            //custermerInfo.checkPhoto = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
            //eleSignJson.lianPic = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
        });

    } else if (responseCode[0].results == "02") {
        hideLoader();
        lianwanghechaData.CheckResult = '02';
        $("#ImagingOperations-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
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
            creditJson.storage.checkPhoto = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
            //custermerInfo.checkPhoto = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
            //eleSignJson.lianPic = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
        });
        showTags({
            'title': '提示',
            'content': '公民身份号码与姓名一致，但不存在照片，是否继续办理业务？',
            'ok': {
                'title': '放弃',
                'fun': function () {
                    $.mobile.changePage('ImagingOperations-readingID.html', {reverse: true});
                }
            },
            'cancel': {
                'title': '继续',
                'fun': function () {
                    $.mobile.changePage('ImagingOperations-customerP.html');
                }
            }
        });
    } else {
        hideLoader();
        lianwanghechaData.CheckResult = '01';
        $("#ImagingOperations-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
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
            creditJson.storage.checkPhoto = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
            //custermerInfo.checkPhoto = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
            //eleSignJson.lianPic = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
        });
        showTags({
            'title': '提示',
            'content': '联网核查失败：' + responseCode[0].message + ',是否继续办理业务？',
            'ok': {
                'title': '放弃',
                'fun': function () {
                    $.mobile.changePage('ImagingOperations-readingID.html', {reverse: true});
                }
            },
            'cancel': {
                'title': '继续',
                'fun': function () {
                    $.mobile.changePage('ImagingOperations-customerP.html');
                }
            }
        });
    }
}

/*影像两两对比成功回调*/
function ImagingFacelRecognitionServiceCreditSucc(msg) {
    //alert(msg);
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '0') {
        if (responseCode[1].photoCompareVO[0].CHIP_RESULT == "0") { //芯片通过
            $("#ImagingOperations-personFace .face-result:eq(0)").text('通过');
        } else {
            $("#ImagingOperations-personFace .face-result:eq(0)").addClass('no-pass').text('未通过');
        }
        if (responseCode[1].photoCompareVO[0].CARD_RESULT == "0") { //联网核查通过
            $("#ImagingOperations-personFace .face-result:eq(1)").text('通过');
        } else {
            $("#ImagingOperations-personFace .face-result:eq(1)").addClass('no-pass').text('未通过');
        }
        if (responseCode[1].photoCompareVO[0].CHIP_RESULT == "0" && responseCode[1].photoCompareVO[0].CARD_RESULT == "0") {
            $("#ImagingOperations-personFace .center-header").text('人脸识别通过！');
        } else {
            $("#ImagingOperations-personFace .center-header").text('人脸识别未通过！');
        }

        $('#ImagingOperations-personFace .previous:last').addClass('btn_next');

    } else if (responseCode[0].results == '08') {
        showLoader("影像对比中...");
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                "workAddress.s": commonJson.workAddress, //工作地址
                "orgId.s": commonJson.orgId, //机构号
                "moduleId.s": ImagingOperaTions.moduleId, //模块编号
                "tranId.s": ImagingOperaTions.tranId, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "OPERATOR_NO.s": commonJson.adminCount, //业务经办人工号
                "TRANS_SCENE.s": "0002", //交易场景 电子卡0006
                "COMPARE_TYPE.s": "2", //    比对类型1-客户经理比对，2-客户比对
                "WS_TYPE.s": "2", // 终端类型1-PC，2-IOS，3-Android
                "WSNO.s": commonJson.udId, //    终端号
                "VERSION.s": "v1.1.4", //当前控件版本
                "TRANS_CHANNEL.s": "301", //   渠道301
                "ID_CARD.s": ImagingOperaTions.DOCUMENT_ID, // 身份证号码
                "IMG_BASE.s": creditJson.storage.custFacePicBase64, //      现场照片
                "CRYPT_TYPE.s": "0", //   图像是否经过加密0-未加密，1-加密方式一，2加密方式二
                "ID_IMG_BASE.s": creditJson.storage.checkPhoto, //联网核查照片
                "CARD_IMG_BASE.s": creditJson.storage.imageBase64, //  芯片照片
                "BUSI_TYPE.s": "01" //  开户01

            }]
        };
        ifacelRecognitionSeFun(sendJson, function (msg) {
            ImagingFacelRecognitionServiceCreditSucc(msg);
        }, function (err) {
            $("#ImagingOperations-personFace .center-header").text('人脸识别失败！');
            $("#ImagingOperations-personFace .face-result:eq(0)").addClass('no-pass').text('未通过');
            $("#ImagingOperations-personFace .face-result:eq(1)").addClass('no-pass').text('未通过');
            $('#ImagingOperations-personFace .previous:last').addClass('btn_next');
            funFail(err);
        })
    } else {
        $("#ImagingOperations-personFace .center-header").text('人脸识别失败！');
        $("#ImagingOperations-personFace .face-result:eq(0)").addClass('no-pass').text('未通过');
        $("#ImagingOperations-personFace .face-result:eq(1)").addClass('no-pass').text('未通过');
        $('#ImagingOperations-personFace .previous:last').addClass('btn_next');
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}


//确认页面 提交按钮是否可以点击
function citigoldIsCanclickNexttwo(isVideo) {
    citigoldJson.isCanClickNEXT = {
        isVideo: isVideo == true ? true : false,
        isSign: false
    };
    //视频是否ok
    $('.photo,.kh-buy-cxps').on('click', function () {
        var _this = $(this);
        Meap.media('video', myTime.CurTime() + '', function (msg) {
            citigoldJson.isCanClickNEXT.isVideo = true;
            if (citigoldJson.isCanClickNEXT.isVideo && citigoldJson.isCanClickNEXT.isSign) {
                $('.previous').addClass('btn_next');
            } else {
                $('.previous').removeClass('btn_next');
            }
            citigoldJson.videoFileARR = [];
            citigoldJson.videoFileARR.push(msg);
            if (_this.hasClass('kh-buy-cxps')) { //重新拍摄
                deletePhoto([$('#video-content').attr('src')], function (delsuc) {
                    $('#video-content').attr('src', msg);
                }, function () {
                });
                return;
            }
            $('.video-box').append('<video id="video-content" src="' + msg + '" width="100%" height="189px" autoplay="autoplay" controls="controls"></video>');
            $('.video-box .photo').hide();
            $('.kh-buy-cxps').show();
        }, function (err) {

        })
    })
}
//点击提交
function submitElectronicSignInfofeigerenkaihu() {
    showLoader("提交中...");
    var sendJson = {
        "b": [{
            "deviceNo.s": commonJson.udId, //设备编号
            "moduleId.s": ImagingOperaTions.moduleId, //模块编号
            "tranId.s": ImagingOperaTions.tranId, //交易编号
            "orgId.s": commonJson.orgId, //机构号
            "operatorNo.s": commonJson.adminCount, //操作员
            "offlineOnline.s": "online", //脱机/联机
            "workAddress.s": commonJson.workAddress, //工作地址
            "BUSSINESS_TYPE.s": ImagingOperaTions.BUSSINESS_TYPE, //业务类型
            "CLIENT_TYPE.s": ImagingOperaTions.CLIENT_TYPE, //客户类型
            "DOCUMENT_TYPE.s": ImagingOperaTions.DOCUMENT_TYPE, //证件类型／法人
            "DOCUMENT_ID.s": ImagingOperaTions.DOCUMENT_ID, //证件号码／法人
            "CLIENT_NAME.s": ImagingOperaTions.CLIENT_NAME, //姓名／法人
            "ACCT_NO.s": ImagingOperaTions.ACCT_NO, //帐卡号
            "currency.s": ImagingOperaTions.currency, //币种
            "tranMoney.s": ImagingOperaTions.tranMoney.replace(/[^0-9\.]/ig, ""), //金额
            "AGENT_DOC_TYPE.s": ImagingOperaTions.AGENT_DOC_TYPE, //经办人证件类型
            "AGENT_DOC_NO.s": ImagingOperaTions.AGENT_DOC_NO, //经办人证件号码
            "AGENT_NAME.s": ImagingOperaTions.AGENT_NAME, //经办人姓名
            "CREDIT_CODE.s": ImagingOperaTions.CREDIT_CODE, //统一社会信用代码
            "ORG_CODE.s": ImagingOperaTions.ORG_CODE, //组织机构代码
            "LICENSE.s": ImagingOperaTions.LICENSE, //营业执照或其他批文号
            "COMPNY_NAME.s": ImagingOperaTions.COMPNY_NAME, //公司名称
            "REMARK.s": ImagingOperaTions.REMARK, //备注
            "CheckResult.s": lianwanghechaData.CheckResult, //身份证联网核查结果
            'FUND_NO.s': ImagingOperaTions.PRODUCT_NO,//产品编号
            'FUND_NAME.s': ImagingOperaTions.PRODUCT_NAME,//产品名称
            'platGlobalSeq.s': ImagingOperaTions.platGlobalSeq,//流水号
            'faceRecogn.s': creditJson.storage.faceRecogn,//人脸识别状态
            'FILE_COUNT.s': '1',//业务上传的文件数量  暂时为1  有需要就修改
            'busiCategory.s': ImagingOperaTions.BUSSINESS_TYPE,
            "BussinessCode.s": "01", //联网核查--业务总类
            "OFF_IMAGE_NO.s": '',//脱机编号
            "longitude.s": commonJson.longitude,//
            "latitude.s": commonJson.latitude//
        }]
    };
    saveOperateVideoFun(sendJson, function (msg) {
        hideLoader();
        msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
        var responseObj = JSON.parse(msg);
        var responseCode = responseObj.b;
        if (responseCode[0].results == '00') {
            ImagingOperaTions.imageNo = responseCode[0].imageNo;
            var appBussPhone = {
                'busiGloablaSeq': ImagingOperaTions.platGlobalSeq, //业务编号
                'attchType': '0', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
                'deviceNo': commonJson.udId, //设备编号
                'moduleId': ImagingOperaTions.moduleId, //模块编号
                'tranId': ImagingOperaTions.tranId, //交易编号
                'orgId': commonJson.orgId, //机构编号
                'operatorNo': commonJson.adminCount, //操作员
                'custName': ImagingOperaTions.CLIENT_NAME, //客户名称
                'custCredType': ImagingOperaTions.DOCUMENT_TYPE, //客户证件类型
                'custCredNo': ImagingOperaTions.DOCUMENT_ID, //客户证件号
                'offlineOnline': commonJson.offlineOnline, //脱机/联机
                'workAddress': commonJson.workAddress, //工作地址
                'IMG_NO': ImagingOperaTions.imageNo,//影音编号
                //'FILE_ADD': creditJson.storage.picFileInfoARR[0].b, //每个图片的名称和类型
                'OPER_TYPE': 'ADD',
                'userId': '9107', //orgIdToUserId[creditJson.storage.orgId], //柜员号
                'branchId': '00862', //creditJson.storage.orgId //机构号
                'TRADE_TYPE': '00011'//业务类型
            };
            appBussPhone = JSON.stringify(appBussPhone);
            var sql = "UPDATE up_download_info SET appBuss = '" + appBussPhone + "' WHERE fileToken = '" + ImagingOperaTions.phoneTime + "'";
            executeSqlString(sql, 'exe', function () {
                changeUploadStatus('02', ImagingOperaTions.phoneTime);
                $.mobile.changePage('ImagingOperations-carryOut.html');
            }, function (err) {
                funDataFail(err);
            });
        } else if (responseCode[0].results == '08') {
            hideLoader();
            submitElectronicSignInfofeigerenkaihu();
        } else if (responseCode[0].results == '01') {
            changeUploadStatus('03', ImagingOperaTions.phoneTime);
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {}
            });
        } else {
            hideLoader();
            showTags({
                'title': '提示',
                'content': '业务处理超时！',
                'ok': {
                    'title': '继续处理',
                    'fun': function () {
                        submitElectronicSignInfofeigerenkaihu();
                    }
                }
            });
        }

    }, function (err) {
        funFaillilvANDwh(err, submitElectronicSignInfofeigerenkaihu);
    });
}
//上传影像文件
function imagingZipCompression() {
    showLoader("上传打包文件中...");
    //上传文件打包压缩插件
    ImagingOperaTions.phoneTime = myTime.CurTime();
    Meap.zipCompression(ImagingOperaTions.platGlobalSeq, creditJson.storage.picFileAllARR, function (msg) {
        //将要上传的文件插入到ios断点上传的数据库中
        //上传 业务参数
        var appBussPhone = {
            'busiGloablaSeq': ImagingOperaTions.platGlobalSeq, //业务编号
            'attchType': '0', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
            'deviceNo': commonJson.udId, //设备编号
            'moduleId': ImagingOperaTions.moduleId, //模块编号
            'tranId': ImagingOperaTions.tranId, //交易编号
            'orgId': commonJson.orgId, //机构编号
            'operatorNo': commonJson.adminCount, //操作员
            'custName': ImagingOperaTions.CLIENT_NAME, //客户名称
            'custCredType': ImagingOperaTions.DOCUMENT_TYPE, //客户证件类型
            'custCredNo': ImagingOperaTions.DOCUMENT_ID, //客户证件号
            'offlineOnline': commonJson.offlineOnline, //脱机/联机
            'workAddress': commonJson.workAddress, //工作地址
            'IMG_NO': ImagingOperaTions.imageNo,//影音编号
            //'FILE_ADD': creditJson.storage.picFileInfoARR[0].b, //每个图片的名称和类型
            'OPER_TYPE': 'ADD',
            'userId': '9107', //orgIdToUserId[creditJson.storage.orgId], //柜员号
            'branchId': '00862', //creditJson.storage.orgId //机构号
            'TRADE_TYPE': '00011'//业务类型
        };
        appBussPhone = JSON.stringify(appBussPhone);
        var sendDataJson = {
            "databaseName": "myDatabase",
            "tableName": "up_download_info",
            "data": [{
                "fileToken": ImagingOperaTions.phoneTime, //文件唯一ID(可以为时间挫
                "pos": "0", //文件的断点信息(初始为0)
                "filePath": msg, //文件路径
                "appPath": ImagingOperaTions.BUSSINESS_TYPE, //自定义文件路径
                "appBuss": appBussPhone, //业务参数
                "downloadToken": "", //文件的下载ID(初始为空)
                "leng": "1", //文件的长度(初始为1)
                "isNotice": "yes", //是否调用后台(一直是yes)
                "fileType": "0",
                'REMARK1': '01'
            }]
        };
        insertTableData(sendDataJson, function (msg) {
            hideLoader();
            showLoader("删除本地文件中...");
            deletePhoto(creditJson.storage.picFileAllARR, function (msg) {
                hideLoader();
                submitElectronicSignInfofeigerenkaihu();
            }, function (err) {
                hideLoader();
                funFail(err);
            });
        }, function (err) {
            hideLoader();
            showTags({
                'title': '提示',
                'content': '数据库读写失败，请联系技术人员',
                'ok': {}
            });
        })
    },function(){
        hideLoader();
        showTags({
            'title': '提示',
            'content': '影像压缩失败',
            'ok': {}
        });
    });
}
/*客户信息组合查询及有效凭证数量校验 查核心 成功回调*/
function icustomerInfoServiceYunyingSucc(msg) {
    //alert(msg);
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == "00") {
        ImagingOperaTions.CLIENT_NO = responseCode[1].customerInfoVO[0].CLIENT_NO; //获取客户号
        debitEnter.isCoreHas = ImagingOperaTions.CLIENT_NO != "" ? true : false; //判断客户号是否为空
        if (debitEnter.isCoreHas) { //如果核心有客户号 进行客户信息查询
            //核心有客户信息
            showLoader("核心客户信息查询中...");
            var sendJson = {
                "b": [{
                    "IDTYPE.s": "0", //证件类型
                    "IDNO.s": custermerInfo.cerNO,//证件号
                    "CLIENT_TYPE.s": 'N', //客户类型
                    "CLIENT_NO.s": ImagingOperaTions.CLIENT_NO, //客户号==ImagingOperaTions.CLIENT_NO   0700358223
                    "AGENT_FLAG.s": '', //法人代表
                    "deviceNo.s": commonJson.udId, //设备编号
                    "orgId.s": commonJson.orgId, //机构号
                    "moduleId.s": ImagingOperaTions.moduleIdD, //模块编号
                    "tranId.s": ImagingOperaTions.tranId, //交易编号
                    "operatorNo.s": commonJson.adminCount //操作员
                }]
            };
            IEstablishCustomerInformationServicetWOFFun(sendJson, function (msg) {
                IEstablishCustomerInformationServiceFYunyingSucc(msg);
            }, function (err) {
                funFail(err);
            });

        } else {
            hideLoader();
            showTags({
                'title': '提示',
                'content': '该证件在核心不存在客户信息，请手工输入！',
                'ok': {
                    fun: function () {

                    }
                }
            });
        }

    } else if (responseCode[0].results == "08") {
        //hideLoader();
        //GChange08
        showLoader("客户信息查询中...");
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "orgId.s": commonJson.orgId,//机构号
                "moduleId.s": ImagingOperaTions.moduleIdD,//模块编号
                "tranId.s": ImagingOperaTions.tranId,//交易编号
                "operatorNo.s": commonJson.adminCount,//操作员
                "deviceNo.s": commonJson.udId,//设备编号
                "CLIENT_TYPE.s": "N",//客户类型 N组织 P个人
                'CHECK_BLACK.s': false,//黑名单校验
                "CARD.s": "",//卡号
                "ACCT_NO.s": "",//账号
                "CLIEMT_NO.s": "",//客户号
                "DOC_TYPE.s": "F",//证件类型
                "DOC_ID.s": ImagingOperaTions.ORG_CODE,//证件号
                "CLIENT_SHORT.s": "",//简称
                "BIRTH_DATE.s": "",//出生日
                "CELL_PHONE.s": "",//手机
                "PHONE.s": "",//住宅电话
                "LEGAL_REP.s": "",//法人代表
                "REVERSE_FLAG.s": "D"//证件号内部检查标志 默认D
            }]
        };
        icustomerInfoServiceFun(sendJson, function (msg) {
            icustomerInfoServiceYunyingSucc(msg);
        }, function (err) {
            funFail(err);
        });
    } else if (responseCode[0].results == '12') {
        showTags({
            'title': '提示',
            'content': '[MA0012]该证件存在多个客户号，请手工输入其他信息！',
            'ok': {}
        });
    } else {
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {
                fun: function () {

                }
            }
        });
    }
}
//维护客户信息查询成功==学习平台
function IEstablishCustomerInformationServiceFYunyingSucc(msg) {
    //alert(msg);
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00') {
        if (responseCode[1].clientDescVO[0].CH_GIVEN_NAME) {
            $('#x_dwmc').val($.trim(responseCode[1].clientDescVO[0].CH_GIVEN_NAME)).attr('disabled', 'disabled');//单位名称
        } else {
            $('#x_dwmc').val($.trim(responseCode[1].clientDescVO[0].CH_GIVEN_NAME));//单位名称
        }
//		alert($.trim(responseCode[1].clientDescVO[0].EMPLOYER_NAME) + '111');
//		alert($.trim(responseCode[1].clientDescVO[1].DOCUMENT_INFO[1].documentInfo[0].DOCUMENT_TYPE));
        if (responseCode[1].clientDescVO[1].DOCUMENT_INFO[1].documentInfo[0] != undefined) {
            var DOCUMENT_TYPE_Z = $.trim(responseCode[1].clientDescVO[1].DOCUMENT_INFO[1].documentInfo[0].DOCUMENT_ID);//营业执照
            $("#x_yyzzhqtpwh").val(DOCUMENT_TYPE_Z);//营业执照
        }
        var res =responseCode[1].clientDescVO[0] ;
        if(!res.REP_DOC_ID){
            showTags({
                'title': '提示',
                'content': '法人信息为空！是否继续办理？',
                'ok': {
                    'title': '放弃拍摄',
                    'fun': function () {
                        $.mobile.changePage('../main.html', {reverse: true});
                    }
                },
                'cancel': {
                    title: '继续办理',
                    fun: function () {

                    }
                }
            });
        } else if (res.REP_DOC_TYPE != ImagingOperaTions.DOCUMENT_TYPE || res.REP_DOC_ID != ImagingOperaTions.DOCUMENT_ID || res.LEGAL_REP != ImagingOperaTions.CLIENT_NAME) {
            showTags({
                'title': '提示',
                'content': '法人信息与核心信息不一致！是否继续办理？',
                'ok': {
                    'title': '放弃拍摄',
                    'fun': function () {
                        $.mobile.changePage('../main.html', {reverse: true});
                    }
                },
                'cancel': {
                    title: '继续办理',
                    fun: function () {

                    }
                }
            });
        }
    } else if (responseCode[0].results == '03') {
        hideLoader();
    } else if (responseCode[0].results == '08') {
        showLoader("客户信息查询中...");
        var sendJson = {
            "b": [{
                "IDTYPE.s": "0", //证件类型
                "IDNO.s": custermerInfo.cerNO,//证件号
                "CLIENT_TYPE.s": 'N', //客户类型
                "CLIENT_NO.s": ImagingOperaTions.CLIENT_NO, //客户号==ImagingOperaTions.CLIENT_NO   0700358223
                "AGENT_FLAG.s": '', //法人代表
                "deviceNo.s": commonJson.udId, //设备编号
                "orgId.s": commonJson.orgId, //机构号
                "moduleId.s": ImagingOperaTions.moduleIdD, //模块编号
                "tranId.s": ImagingOperaTions.tranId, //交易编号
                "operatorNo.s": commonJson.adminCount//操作员
            }]
        };
        IEstablishCustomerInformationServicetWOFFun(sendJson, function (msg) {
            IEstablishCustomerInformationServiceFYunyingSucc(msg);
        }, function (err) {
            funFail(err);
        });
    } else {
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}
//非个人账号查询
function imagingQueryCompanyAcctNoFun() {
    showLoader('卡账号查询中...');
    var sendJson = {
        "b": [{
            "deviceNo.s": commonJson.udId, //设备编号
            "moduleId.s": ImagingOperaTions.moduleId, //模块名
            "tranId.s": ImagingOperaTions.tranId, //交易名
            "orgId.s": commonJson.orgId, //机构号
            "operatorNo.s": commonJson.adminCount, //操作员
            "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
            "workAddress.s": commonJson.workAddress, //工作地址
            "CLIENT_NO.s": ImagingOperaTions.CLIENT_NO, //客户号
            "ACCT_TYPE.s": '20', //账户类型//20-活期、30-定期
            "OPTION.s": '' //关联标志
        }]
    };
    queryCompanyAcctNoFun(sendJson, function (msg) {
        hideLoader();
        msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
        var responseObj = JSON.parse(msg);
        var responseCode = responseObj.b;
        var textHtml = '';
        if (responseCode[0].results == '00') {
            var queryCompanyAcctNoVO = responseCode[1].queryCompanyAcctNoVO;
            if (queryCompanyAcctNoVO) {
                var ACCT_ARRAY = queryCompanyAcctNoVO[1].ACCT_ARRAY;
                $('.backContainer').show();
                $.each(ACCT_ARRAY, function (index, el) {
//                  if (index == '0') return true;
                    textHtml += '<li><p>账卡号：<span class = "xuanze_li">' + el.acctArrayVO[0].BASE_ACCT_NO + '</span></p><p>开户日期：<span>' + el.acctArrayVO[0].OPEN_DATE + '</span></p></li>';
//                  textHtml += '<li><p>帐卡号：<span class = "xuanze_li">' + el.acctArrayVO[0].BASE_ACCT_NO + '</span></p><p>开户行：<span>' + el.acctArrayVO[0].PRODUCT_TYPE + '</span>开户日期：<span>' + el.acctArrayVO[0].OPEN_DATE + '</span></p></li>';
                });

                $('.backContainer ul').html(textHtml);
            }
        } else if (responseCode[0].results == '08') {
            imagingQueryCompanyAcctNoFun();
        } else {
            showTags({
                'title': '提示',
                'content': '客户号下无有效账卡号！',
                'cancel': {
                    'title': '确认',
                    'fun': function () {

                    }
                }
            });
        }
    }, function (err) {
        funFail(err);
    });
}
//非个人账号查询明细查询
function imagingQueryCompanyAcctNoDetailFun() {
    showLoader('卡账号详情查询中...');
    var sendJson = {
        "b": [{
            "deviceNo.s": commonJson.udId, //设备编号
            "moduleId.s": ImagingOperaTions.moduleId, //模块名
            "tranId.s": ImagingOperaTions.tranId, //交易名
            "orgId.s": commonJson.orgId, //机构号
            "operatorNo.s": commonJson.adminCount, //操作员
            "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
            "workAddress.s": commonJson.workAddress, //工作地址
            "BASE_ACCT_NO.s": ImagingOperaTions.ACCT_NO, //账号
            "ACCT_TYPE.s": '20', //账户类型//20-活期、30-定期
        }]
    };
    queryCompanyAcctNoDetailFun(sendJson, function (msg) {
        hideLoader();
        msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
        var responseObj = JSON.parse(msg);
        var responseCode = responseObj.b;
        if (responseCode[0].results == '00') {
            var res = responseCode[1].companyAcctNoDetailVO[1].ACCT_ARRAY[0].companyAcctNoDetailListVO[0];
            $('.cardBackContainer').show();
            $('.cardBackContainer .cardContainter ul li:eq(0) span').text(acctSort[res.ACCT_SORT]);
            $('.cardBackContainer .cardContainter ul li:eq(1) span').text(lastAcctStatus[res.LAST_ACCT_STATUS]);
            $('.cardBackContainer .cardContainter ul li:eq(2) span').text(res.OPEN_BRANCH_NAME);
        } else if (responseCode[0].results == '08') {
            imagingQueryCompanyAcctNoDetailFun();
        } else {
            showTags({
                'title': '提示',
                'content': '账卡号下无详情信息！',
                'cancel': {
                    'title': '确认',
                    'fun': function () {

                    }
                }
            });
        }
    }, function (err) {
        funFail(err);
    })
}
//个人信息查询
function imagingIcustomerInfoServiceFun() {
    showLoader('客户信息查询中...');
    var sendJson = {
        "b": [{
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "orgId.s": commonJson.orgId,//机构号
            "moduleId.s": ImagingOperaTions.moduleIdD,//模块编号
            "tranId.s": ImagingOperaTions.tranId,//交易编号
            "operatorNo.s": commonJson.adminCount,//操作员
            "deviceNo.s": commonJson.udId,//设备编号
            "CLIENT_TYPE.s": ImagingOperaTions.CLIENT_TYPE, //客户类型
            "DOC_TYPE.s": ImagingOperaTions.DOCUMENT_TYPE, //证件类型／法人
            "DOC_ID.s": ImagingOperaTions.DOCUMENT_ID, //证件号码／法人
            "CHECK_BLACK.s": false
        }]
    };
    icustomerInfoServiceFun(sendJson, function (msg) {
        hideLoader();
        msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
        var responseObj = JSON.parse(msg);
        var responseCode = responseObj.b;
        if (responseCode[0].results == '00') {
            ImagingOperaTions.CLIENT_NO = responseCode[1].customerInfoVO[0].CLIENT_NO;
            if (ImagingOperaTions.CLIENT_NO) {
                imagingINetBankProductServiceFun();
            } else {
                showTags({
                    'title': '提示',
                    'content': '该证件在核心不存在客户信息，请手工输入！',
                    'cancel': {
                        'title': '确认',
                        'fun': function () {

                        }
                    }
                });
            }

        } else if (responseCode[0].results == '08') {
            imagingIcustomerInfoServiceFun();
        } else if (responseCode[0].results == '12') {
            showTags({
                'title': '提示',
                'content': '该证件存在多个客户号，请手工输入！',
                'cancel': {
                    'title': '确认',
                    'fun': function () {

                    }
                }
            });
        } else {
            showTags({
                'title': '提示',
                'content': '证件号码错误或无法获得账卡号！',
                'cancel': {
                    'title': '确认',
                    'fun': function () {

                    }
                }
            });
        }
    }, function (err) {
        hideLoader();
        funFail(err);
    })
}

//个人账号查询
function imagingINetBankProductServiceFun() {
    showLoader('卡账号查询中...');
    //查询卡账号
    var sendJson = {
        "b": [{
            "CLIENT_NO.s": ImagingOperaTions.CLIENT_NO, //客户号
            "deviceNo.s": commonJson.udId, //设备编号
            "moduleId.s": ImagingOperaTions.moduleId, //模块名
            "tranId.s": ImagingOperaTions.tranId, //交易名
            "orgId.s": commonJson.orgId, //机构号
            "operatorNo.s": commonJson.adminCount, //操作员
            "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
            "workAddress.s": commonJson.workAddress //工作地址
        }]
    };
    INetBankProductServiceFun(sendJson, function (msg) {
        hideLoader();
        msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
        var responseObj = JSON.parse(msg);
        var responseCode = responseObj.b;
        if (responseCode[0].results == '00') {
            var textHtml = '';
            $('.backContainer').show();
            $.each(responseCode, function (index, el) {
                if (index == '0') return true;
                textHtml += '<li><p>账卡号：<span>' + el.docLicenceVO[0].ISSUE_ACCT_NO + '</span></p></li>';
            })
            $('.backContainer ul').html(textHtml);
        } else if (responseCode[0].results == '03') {
            showTags({
                'title': '提示',
                'content': '客户号下无有效账卡号！',
                'cancel': {
                    'title': '确认',
                    'fun': function () {

                    }
                }
            });
        } else if (responseCode[0].results == '08') {
            imagingINetBankProductServiceFun();
        }
    }, function (err) {
        hideLoader();
        funFail(err);
    })
}



