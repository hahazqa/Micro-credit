//卡产品选择 插入数据库
function dataInsertIcardProductService(sendDataJsonItem, dataNum) {
    sendDataJsonItem[dataNum].cardProductListVO[0].PROTOCOL=sendDataJsonItem[dataNum].cardProductListVO[0].PROTOCOL.replace(/\'/g, ";;;a;&nbsp;a;;;");
    var sendDataJson = {
        "databaseName": "myDatabase",
        "tableName": "creditcard_type",
        "data": [{
            "PRONAME": sendDataJsonItem[dataNum].cardProductListVO[0].PRONAME,
            "CARDBRAND": sendDataJsonItem[dataNum].cardProductListVO[0].CARDBRAND,
            "ISDUALCURR": sendDataJsonItem[dataNum].cardProductListVO[0].ISDUALCURR,
            "PRODUCTCD": sendDataJsonItem[dataNum].cardProductListVO[0].PRODUCTCD,
            "DESC": sendDataJsonItem[dataNum].cardProductListVO[0].DESC,
            "CARDTYPE": sendDataJsonItem[dataNum].cardProductListVO[0].CARDTYPE,
            "CARDCLASS": sendDataJsonItem[dataNum].cardProductListVO[0].CARDCLASS,
            "ATTACHMENT": sendDataJsonItem[dataNum].cardProductListVO[0].ATTACHMENT,
            "PROTOCOL": sendDataJsonItem[dataNum].cardProductListVO[0].PROTOCOL,
            "TOTALNUM": sendDataJsonItem[dataNum].cardProductListVO[0].TOTALNUM,
            "REMARK1": sendDataJsonItem[dataNum].cardProductListVO[0].REMARK1,
            "REMARK2": sendDataJsonItem[dataNum].cardProductListVO[0].REMARK2,
            "REMARK3": sendDataJsonItem[dataNum].cardProductListVO[0].REMARK3,
            "REMARK4": sendDataJsonItem[dataNum].cardProductListVO[0].REMARK4,
            "REMARK5": sendDataJsonItem[dataNum].cardProductListVO[0].REMARK5
        }]
    };
    insertTableData(sendDataJson, function(msg) {
        dataNum++;
        if (dataNum == sendDataJsonItem.length) return;
        dataInsertIcardProductService(sendDataJsonItem, dataNum);
    }, function(err) {
        alert('失败' + msg);

    });
}
//卡产品 数据库查询成功
function icardProductServiceDataSucc(msg) {
    if (msg == '') {
    	if(creditJson.storage.offlineOnline != 'offline'){//联机
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
    		    icardProductServiceFun(sendJson, function(msg) {
    		        icardProductServiceSucc(msg);
    		    }, function(err) {
    		        queryTableDataByConditions({
    		            "databaseName": "myDatabase", //数据库名
    		            "tableName": "creditcard_type" //表名
    		        }, function(msg) {
    		            if (msg == '') {
    		                localStorage.spacetime = 1;
    		            }
    		        }, function(err) {
    		            funDataFail(err);
    		        });
    		        funFail(err);
    		    });
    	}else{
    		hideLoader();
            $('#credit-product .conter-auto').html('<p style="line-height:40px;margin:30px auto;text-align:center;">暂无离线缓存数据</p>');
            return;
    	}
    } else { //数据库查询返回有值
        //msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
        //var responseCode = responseObj.b;
        var textHtml = '';
        $.each(msg, function(index, el) {
            var imgUrl = base64decode(el.ATTACHMENT);
            textHtml += ' <div class="product_box">' +
                    '<img src="data:image/png;base64,' + imgUrl + '" proRemark1="' + el.REMARK1 + '" class="product_img"/>' +
                '<div class="product_content">' +
                '<div class="product_register" PRONAME="'+ el.PRONAME+'" PRODUCTCD="' + el.PRODUCTCD + '">申&nbsp;&nbsp;&nbsp;请</div>' +
                '<p class="product_title">' + el.PRONAME + '</p>' +
                '<div class="product_Intro">' + el.DESC.replace(/\n/g,"<br/>") + '</div>' +
                '</div>' +
                '</div>';
        });
        hideLoader();
        $('#credit-product .conter-auto').html(textHtml);
        $('#credit-product .product_register').click(function(event) {
            //if(!(orgIdToUserId[creditJson.storage.orgId])&&creditJson.storage.offlineOnline=='online'){
            //    showTags({
            //        'title': '提示',
            //        'content': '该客户经理号所有机构没有影像系统号,无法申请信用卡!',
            //        'ok': {}
            //    });
            //    return;
            //}
            if(creditJson.storage.SPRNUM==''&&creditJson.storage.offlineOnline=='online'){
                showTags({
                    'title': '提示',
                    'content': '没有客户经理号,无法申请信用卡!',
                    'ok': {
                        fun: function() {
                            $.mobile.changePage('credit-product.html', {
                                reverse: true
                            });
                        }
                    }
                });
                return;
            }
            creditJson.storage.PRODUCTCD = $(this).attr("PRODUCTCD");
            creditJson.storage.YWXS = $(this).attr("PRONAME");
            //$.mobile.changePage('credit-agreement.html', { transition: "slide"}, false);
            $.mobile.changePage('credit-readingID.html');
        });
        $('#credit-product .product_img').on('taphold', function() {
            productTapHold($(this));
        });
        $("#credit-product").on('tap', function(ev) {
            var oTarget = ev.target;
            if ($(oTarget).closest('.product_img').length || $(oTarget).closest('.product_img_msg').length) {

            } else {
                $(".product_img_msg").remove();
            }
        });
        //插入数据库
        // var dataNum=0;
        // dataInsertIcardProductService(responseCode,dataNum);
    }
}

function icardProductServiceFail(err) {
    alert('查询失败' + err);
}

function funDataFail(err) {
    alert(err + "失败！")
}
//联机状态提交成功缓存个人信息--影像复用使用
function cacheCustermerInfo(sendDataJson) { /*11111*/
    //与客户合影照片转base64
    transFormBase64(sendDataJson.data[0].CUSTANDCUSTOWNERPIC, function(msg1) {
        sendDataJson.data[0].CUSTANDCUSTOWNERPIC = msg1;
        //身份证正面转base64
        transFormBase64(sendDataJson.data[0].FRONTIDCARDPIC, function(msg2) {
            sendDataJson.data[0].FRONTIDCARDPIC = msg2;
            //身份证反面转base64
            transFormBase64(sendDataJson.data[0].BACKIDCARDPIC, function(msg3) {
                sendDataJson.data[0].BACKIDCARDPIC = msg3;
                insertTableData(sendDataJson, function(msg) {}, function(err) {
                    showMsg('存储个人信息失败' + msg);
                });
            }, function(err) {
                showMsg('与客户合影照片转base64失败');
            })
        }, function(err) {
            showMsg('身份证正面转base64失败');

        })
    }, function(err) {
        showMsg('身份证反面转base64失败');
    })

}
//脱机状态 提交缓存脱机个人信息
function cacheNoNetCustermerInfo(YWType) {
    var businessType = YWType; //业务类型
    var submitTime = myTime.CurTime(); //获取当前时间
    // 01深户 02广东非深户  03广西 04其他
    // var isShenH = '04'; //户籍所在地
    // if ((creditJson.storage.DOMICILESF+creditJson.storage.DOMICILECS).indexOf('广东省') >= 0) {
    //     if ((creditJson.storage.DOMICILESF+creditJson.storage.DOMICILECS).indexOf('深圳市') >= 0) {
    //         isShenH = '01';
    //     } else {
    //         isShenH = '02';
    //     }
    // } else if ((creditJson.storage.DOMICILESF+creditJson.storage.DOMICILECS).indexOf('广西省') >= 0) {
    //     isShenH = '03';
    // } else {
    //     isShenH = '04';
    // }
    var sendDataJson = {
        "databaseName": "myDatabase",
        "tableName": "nonetcustomer_info",
        "data": [{
            "BUSINESSTYPE":YWType,//业务类型
            "BUSSINESSSTATUS":"脱机已受理",//业务状态
            "SUBMITTIME":myTime.CurTime(),//提交时间
            "offlineOnline": creditJson.storage.offlineOnline, //脱机/联机
            "orgId": creditJson.storage.orgId, //隶属机构
             "moduleId": workbenchJson.moduleID,//creditJson.storage.moduleId, //模块编号
            "tranId": workbenchJson.tranId2,//creditJson.storage.tranId, //交易编号
            "operatorNo": creditJson.storage.operatorNo, //操作员
            "TLRNAME": creditJson.storage.TLRNAME, //操作员姓名
            "SPRNUM": creditJson.storage.SPRNUM, //信用卡用户 推广人编号
            "TLRCELLPHONE": creditJson.storage.TLRCELLPHONE, //操作员手机号码
            "deviceNo": creditJson.storage.deviceNo, //设备编号
            "MASCARDNAME": creditJson.storage.MASCARDNAME, //身份证姓名
            "SEX": sexJson[creditJson.storage.SEX], //性别
            "CERTTYPE": '1', //证件类型
            "CERTNUM": creditJson.storage.CERTNUM, //证件号码
            "CERTVALIDDATE": creditJson.storage.CERTVALIDDATE.split('-')[1].replace(/\./g, ''), //有效期截止日
            "BIRTH": creditJson.storage.BIRTH.replace(/-/g, ''), //出生日期
            "BRAFULLNAME": creditJson.storage.BRAFULLNAMEX+' '+creditJson.storage.BRAFULLNAMEM,//拼音姓名
            "EDUCATION": creditJson.storage.EDUCATION, //教育程度
            "MOBILENUM": creditJson.storage.MOBILENUM, //手机号码
            "HOUSTYPE": creditJson.storage.HOUSTYPE, //住宅类型
            "OTHERADD": creditJson.storage.OTHERADD, //其他地址
            "HOUSZIPCODE": creditJson.storage.HOUSZIPCODE, //邮编
            "EMAILADD": creditJson.storage.EMAILADD, //E-mail
            "DOMICILE": creditJson.storage.DOMICILESF+creditJson.storage.DOMICILECS, //户籍所在地
            "HOUSREGADD": creditJson.storage.ADDRESS, //户籍地址
//          "RECEMPNUM": creditJson.storage.REFERENCE, //推荐人
            //2016.3.17新增字段
			"RECMOBILENUM": creditJson.storage.RECMOBILENUM, //推荐人手机号
			"RECEMPNUM": creditJson.storage.RECEMPNUM, //推荐人工号
			"MASRTATU": creditJson.storage.MASRTATU, //婚姻状况
			"OFFICE": creditJson.storage.OFFICE, //职位／岗位
			"UNITWORKEXP": creditJson.storage.UNITWORKEXP, //在现单位工作年限
			"INTOSOURCE": creditJson.storage.INTOSOURCE, //进件来源
			"CUSCARDAPPLY": creditJson.storage.CUSCARDAPPLY, //申请额度
			//2016.3.17新增字段
            "UNITNAME": creditJson.storage.UNITNAME, //单位全称
            "UNITPROPERTY": creditJson.storage.UNITPROPERTY, //单位性质
            "UNITPHONEAREANUM": creditJson.storage.UNITPHONENUMQH, //单位固话区号
            "UNITPHONENUM": creditJson.storage.UNITPHONENUMHM, //单位固话号码
            "INDCATEGORY": creditJson.storage.INDCATEGORY, //行业类别
            "ANNINCOME": creditJson.storage.ANNINCOME, //年收入
            "URGNAME": creditJson.storage.URGNAME, //紧急联系人姓名
            "URGMOBILENUM": removeSpace(creditJson.storage.URGMOBILENUM), //紧急联系人手机
            "CARDSENDADDTYPE": "O", //卡片递送地址 与通讯地址一致 O custermerInfo.cCardAddr
            "ISAUTOPURCHASE": creditJson.storage.ISAUTOPURCHASE, //是否开通自动还款itigold
            "AUTODEBITACCOUNT": creditJson.storage.AUTODEBITACCOUNT, //账号/卡号
            "REPAYMETHOD": creditJson.storage.REPAYMETHOD, //自动还款方式
            "CARDFEETYPE": creditJson.storage.CARDFEETYPE, //年费类型
            "APPCARDTYPE": creditJson.storage.PRODUCTCD, //卡产品代码
            "HOUSADD": creditJson.storage.HOUSADD, //家庭地址 核心地址接口 TYPE==h
            "HOUSPHONEAREANUM": creditJson.storage.HOUSPHONEAREANUM, //住宅电话区号 空
            "HOUSPHONENUM": creditJson.storage.HOUSPHONENUM, //住宅电话 空
            "UNITADD": creditJson.storage.UNITADD, //单位地址 TYPE==c
            "UNITZIPCODE": creditJson.storage.UNITZIPCODE, //单位邮编
            // "自动还款账号":"",//自动还款账号
            "IMMRELATION": creditJson.storage.IMMRELATION, //直系亲属关系 与持卡人关系 SEQ=1
            "IMMNAME": creditJson.storage.IMMNAME, //直系亲属姓名
            "IMMMOBILENUM": creditJson.storage.IMMMOBILENUM, //直系亲属手机
            "IMMPHONEAREANUM": creditJson.storage.IMMPHONEAREANUM, //直系亲属区号
            "IMMPHONENUM": creditJson.storage.IMMPHONENUM, //直系亲属电话
            "URGRELATION": creditJson.storage.URGRELATION, //紧急联系人关系 RELATIONSHIP
            "URGPHONEAREANUM": creditJson.storage.URGPHONEAREANUM, //紧急联系人区号
            "URGPHONENUM": creditJson.storage.URGPHONENUM, //紧急联系人电话
            "REMARK2": creditJson.storage.BILLDATE, //账单日
            "BUSSINESSCODE": "01", //联网核查--业务总类
           // "BRANCH_ID": creditJson.storage.orgId, //联网核查--机构号
            //"OPERATOR_NO": creditJson.storage.operatorNo, //人脸对比--业务经办人工号
            "TRANS_SCENE": "0002", //交易场景 电子卡0006
            "COMPARE_TYPE": "2", //    比对类型1-客户经理比对，2-客户比对
            "WS_TYPE": "2", // 终端类型1-PC，2-IOS，3-Android
           // "WSNO": creditJson.storage.deviceNo, //    终端号
            "VERSION": "v1.1.4", //当前控件版本
            "TRANS_CHANNEL": "301", //   渠道301
           // "ID_CARD": creditJson.storage.CERTNUM, // 身份证号码
           // "IMG_BASE": creditJson.storage.custFacePicBase64, //      现场照片
            "CRYPT_TYPE": "0", //   图像是否经过加密0-未加密，1-加密方式一，2加密方式二
           // "ID_IMG_BASE": creditJson.storage.checkPhoto, //联网核查照片
           // "CARD_IMG_BASE": creditJson.storage.imageBase64, //  芯片照片
            "BUSI_TYPE": "02", //  信用卡02
            "CLIENT_TYPE": "P", //客户类型 N组织 P个人
            "CARD": "", //卡号
            "ACCT_NO": "", //账号
            "CLIEMT_NO": "", //客户号
            "DOC_TYPE": "0", //证件类型
            //"DOC_ID": creditJson.storage.CERTNUM, //证件号
            "CLIENT_SHORT": "", //简称
            "BIRTH_DATE": "", //出生日
            "CELL_PHONE": "", //手机
            "PHONE": "", //住宅电话
            "LEGAL_REP": "", //法人代表
            "REVERSE_FLAG": "D", //证件号内部检查标志 默认D
            "CARD_CATEGORY": "" ,//信用卡查核心标识
            "picFileARR": creditJson.storage.picFileARR.join("&&"), //要打包的影像路径
            "picFileInfoARR": JSON.stringify(creditJson.storage.picFileInfoARR), //每个图片的名称和类型
            "image":creditJson.storage.image, //身份证图片路径,
            "signHref":creditJson.signHref, //签名文件路径
            "ipadWorkAddress":creditJson.storage.ipadWorkAddress, //pad工作地址
            "lAddData":creditJson.storage.lAddData  //named by lei 20160319
        }]
    };
    //alert(JSON.stringigy(sendDataJson));
    insertTableData(sendDataJson, function(msg) {}, function(err) {
        showMsg('存储脱机个人信息失败' + msg);
    });
}

//联机和脱机状态 暂存个人信息--影像采集界面
function creditZanCunCustermerInfoYX(YWType) {
    creditJson.storage.TEMPFROM = 'credit-customerP.html'; //暂存来源页面
    var sendDataJson = {
        "databaseName": "myDatabase",
        "tableName": "temporary_info",
        "data": [{
            "PRODUCTCD": creditJson.storage.PRODUCTCD, //卡产品代码
            "SUBMITTIME": myTime.CurTime(), //提交时间
            "offlineOnline": creditJson.storage.offlineOnline, //脱机/联机
            "operatorNo": creditJson.storage.operatorNo, //登陆账号
            "BUSINESSTYPE": "申请信用卡", //业务类型
            "orgId": creditJson.storage.orgId, //隶属机构
            "moduleId": creditJson.moduleId, //workbenchJson.moduleID, 模块编号
            "deviceNo": creditJson.storage.deviceNo, //设备编号
            "tranId": creditJson.tranId, //workbenchJson.tranId1, 交易编号
            "TLRNAME": creditJson.storage.TLRNAME, //操作员姓名
            "SPRNUM": creditJson.storage.SPRNUM, //信用卡用户 推广人编号
            "TLRCELLPHONE": creditJson.storage.TLRCELLPHONE, //操作员手机号码
            "YWXS": creditJson.storage.YWXS, //业务线索--卡产品代码PRODUCTCD
            "MASCARDNAME": creditJson.storage.MASCARDNAME, //身份证姓名
            "SEX": creditJson.storage.SEX, //性别
            "NATION": creditJson.storage.NATION, //民族
            "CERTNUM": creditJson.storage.CERTNUM, //证件号码
            "CERTVALIDDATE": creditJson.storage.CERTVALIDDATE, //有效期截止日
            "BIRTH": creditJson.storage.BIRTH, //出生日期
            "ADDRESS": creditJson.storage.ADDRESS, //户籍地址
            "ISSAUTHORITY": creditJson.storage.ISSAUTHORITY, //签发机关
            "image": creditJson.storage.image, //身份证头像图片
            "custFacePic": creditJson.storage.custFacePic, //客户面部照片
            "custAndCustOwnerPic": creditJson.storage.custAndCustOwnerPic, //与客户合影照片
            "custAuthPic": creditJson.storage.custAuthPic, //抄录内容照片
            "frontIDCardPic": creditJson.storage.frontIDCardPic, //身份证正面
            "backIDCardPic": creditJson.storage.backIDCardPic, //身份证反面
            "picFileARR": creditJson.storage.picFileARR.join("&&"), //要打包的影像路径
            "picFileInfoARR": JSON.stringify(creditJson.storage.picFileInfoARR), //每个图片的名称和类型
            "picFileMsgType": creditJson.storage.picFileMsgType.join("&&"), //其他图片对象的证明类型
            "checkPhoto": creditJson.storage.checkPhoto, //联网核查图片
            "BRAFULLNAMEX": "", //拼音姓
            "BRAFULLNAMEM": "", //拼音名
            "EDUCATION": "", //教育程度
            "HOUSTYPE": "", //住宅类型
            "MOBILENUM": "", //手机号码
            "HOUSZIPCODE": "", //邮编
            "UNITADDSF": "", //通讯地址省份
            "UNITADDCS": "", //通讯地址城市
            "UNITADDXX": "", //通讯地址详细
            "EMAILADD": "", //E-mail
            "DOMICILESF": "", //户籍所在地省份
            "DOMICILECS": "", //户籍所在地城市
//          "REFERENCE": "", //推荐人
			//2016.3.17新增字段
			"RECMOBILENUM": "", //推荐人手机号
			"RECEMPNUM": "", //推荐人工号
			"MASRTATU": "", //婚姻状况
			"OFFICE": "", //职位／岗位
			"UNITWORKEXP": "", //在现单位工作年限
			"INTOSOURCE": "", //进件来源
			"CUSCARDAPPLY": "", //申请额度
			//2016.3.17新增字段
            "UNITNAME": "", //单位全称
            "UNITPROPERTY": "", //单位性质
            "UNITPHONENUMQH": "", //电话号码-区号
            "UNITPHONENUMHM": "", //电话号码-号码
            "INDCATEGORY": "", //行业类别
            "ANNINCOME": "", //年收入
            "URGNAME": "", //紧急联系人姓名
            "URGMOBILENUM": "", //紧急联系人手机
            "CARDSENDADDTYPE": "", //卡片递送地址
            "CARDFEETYPE": "", //年费类型
            "ISAUTOPURCHASE": "", //是否开通自动还款
            "AUTODEBITACCOUNT": "", //账号/卡号
            "AUTODEBITACCOUNTHTML": "", //账号/卡号HTML
            "REPAYMETHOD": "", //自动还款方式
            "TEMPFROM": creditJson.storage.TEMPFROM, //暂存来源页面
            "CLIENT_NO":creditJson.storage.CLIENT_NO,//客户号
            "faceRecogn":"",//人脸识别状态
            "dwORhj":"",
            "lAddData":"",  //named by lei 201603193
            "REMARK":commonJson.longitude,//工作轨迹的经度
            "REMARK2":commonJson.latitude,//工作轨迹的纬度
            "REMARK4":"" //账单日
        }]
    };
    insertTableData(sendDataJson, function(msg) {}, function(err) {
        showMsg('存储脱机个人信息失败' + msg);
    });
}
//联机和脱机状态 暂存个人信息--信息录入界面
function creditZanCunCustermerInfo(YWType) {
    var sendDataJson = {
        "databaseName": "myDatabase",
        "tableName": "temporary_info",
        "data": [{
            "PRODUCTCD": creditJson.storage.PRODUCTCD, //卡产品代码
            "SUBMITTIME": myTime.CurTime(), //提交时间
            "offlineOnline": creditJson.storage.offlineOnline, //脱机/联机
            "operatorNo": creditJson.storage.operatorNo, //登陆账号
            "BUSINESSTYPE": "申请信用卡", //业务类型
            "orgId": creditJson.storage.orgId, //隶属机构
            "moduleId": creditJson.moduleId, //模块编号
            "deviceNo": creditJson.storage.deviceNo, //设备编号
            "tranId": creditJson.tranId, //交易编号
            "TLRNAME": creditJson.storage.TLRNAME, //操作员姓名
            "SPRNUM": creditJson.storage.SPRNUM, //信用卡用户 推广人编号
            "TLRCELLPHONE": creditJson.storage.TLRCELLPHONE, //操作员手机号码
            "YWXS": creditJson.storage.YWXS, //业务线索--卡产品代码PRODUCTCD
            "MASCARDNAME": creditJson.storage.MASCARDNAME, //身份证姓名
            "SEX": creditJson.storage.SEX, //性别
            "NATION": creditJson.storage.NATION, //民族
            "CERTNUM": creditJson.storage.CERTNUM, //证件号码
            "CERTVALIDDATE": creditJson.storage.CERTVALIDDATE, //有效期截止日
            "BIRTH": creditJson.storage.BIRTH, //出生日期
            "ADDRESS": creditJson.storage.ADDRESS, //户籍地址(身份证上地址)
            "ISSAUTHORITY": creditJson.storage.ISSAUTHORITY, //签发机关
            "image": creditJson.storage.image, //身份证头像图片
            "custFacePic": creditJson.storage.custFacePic, //客户面部照片
            "custAndCustOwnerPic": creditJson.storage.custAndCustOwnerPic, //与客户合影照片
            "custAuthPic": creditJson.storage.custAuthPic, //抄录内容照片
            "frontIDCardPic": creditJson.storage.frontIDCardPic, //身份证正面
            "backIDCardPic": creditJson.storage.backIDCardPic, //身份证反面
            "picFileARR": creditJson.storage.picFileARR.join("&&"), //要打包的影像路径
            "picFileInfoARR": JSON.stringify(creditJson.storage.picFileInfoARR), //每个图片的名称和类型
            "picFileMsgType": creditJson.storage.picFileMsgType.join("&&"), //其他图片对象的证明类型
            "checkPhoto": creditJson.storage.checkPhoto, //联网核查图片
            "BRAFULLNAMEX": $.trim($('#c-en-xing').val()), //拼音姓
            "BRAFULLNAMEM": $.trim($('#c-en-ming').val()), //拼音名
            "EDUCATION": $.trim($('#c-edu').val()), //教育程度
            "HOUSTYPE": $('#c-room-style').val(), //住宅类型
            "MOBILENUM": removeSpace($.trim($('#c-mobile').val())), //手机号码
            "HOUSZIPCODE": $.trim($('#c-zipcode').val()), //邮编
            "UNITADDSF": $('#s_province').val(), //通讯地址省份
            "UNITADDCS": $('#s_city').val(), //通讯地址城市
            "UNITADDXX": $.trim($('#c-addr-detail').val()), //通讯地址详细
            "EMAILADD": $.trim($('#c-email').val()), //E-mail
            "DOMICILESF": $('#day_a').val(), //户籍所在地省份
            "DOMICILECS": $('#day_b').val(), //户籍所在地城市
//          "REFERENCE": $.trim($('#c-reference').val()), //推荐人
			//2016.3.17新增字段
			"RECMOBILENUM": creditJson.storage.RECMOBILENUM, //推荐人手机号
			"RECEMPNUM": creditJson.storage.RECEMPNUM, //推荐人工号
			"MASRTATU": creditJson.storage.MASRTATU, //婚姻状况
			"OFFICE": creditJson.storage.OFFICE, //职位／岗位
			"UNITWORKEXP": creditJson.storage.UNITWORKEXP, //在现单位工作年限
			"INTOSOURCE": creditJson.storage.INTOSOURCE, //进件来源
			"CUSCARDAPPLY": creditJson.storage.CUSCARDAPPLY, //申请额度
			//2016.3.17新增字段
            "UNITNAME": $.trim($('#c-com-name').val()), //单位全称
            "UNITPROPERTY": $('#c-com-property').val(), //单位性质
            "UNITPHONENUMQH": $.trim($('#c-com-tel1').val()), //电话号码-区号
            "UNITPHONENUMHM": $.trim($('#c-com-tel2').val()), //电话号码-号码
            "INDCATEGORY": $('#c-ndustry').val(), //行业类别
            "ANNINCOME": $('#c-income').val(), //年收入
            "URGNAME": $.trim($('#c-contact-name').val()), //紧急联系人姓名
            "URGMOBILENUM": removeSpace($.trim($('#c-contact-mobile').val())), //紧急联系人手机
            "CARDSENDADDTYPE": $.trim($('#c-card-addr').val()), //卡片递送地址
            "CARDFEETYPE": $('#c-card-annualfee').val(), //年费类型
            "ISAUTOPURCHASEISDISABLED":creditJson.storage.ISAUTOPURCHASEISDISABLED,//自动还款功能是否含有disabled属性
            "ISAUTOPURCHASE": $('#c-card-repay').val(), //是否开通自动还款是否可修改
            "AUTODEBITACCOUNT": $.trim($('#c-card-card').val()), //账号/卡号
            "AUTODEBITACCOUNTHTML": $('#c-card-card').html(), //账号/卡号HTML
            "REPAYMETHOD": $('#c-card-repaystyle').val(), //自动还款方式
            "TEMPFROM":"credit-card.html", //暂存来源页面
            "HOUSADD": creditJson.storage.HOUSADD, //家庭地址 核心地址接口 TYPE==h
            "HOUSPHONEAREANUM": creditJson.storage.HOUSPHONEAREANUM, //住宅电话区号 空
            "HOUSPHONENUM": creditJson.storage.HOUSPHONENUM, //住宅电话 空
            "UNITADD": creditJson.storage.UNITADD, //单位地址 TYPE==c
            "UNITZIPCODE": creditJson.storage.UNITZIPCODE, //单位邮编
            "IMMRELATION": creditJson.storage.IMMRELATION, //直系亲属关系 与持卡人关系 SEQ=1
            "IMMNAME": creditJson.storage.IMMNAME, //直系亲属姓名
            "IMMMOBILENUM": creditJson.storage.IMMMOBILENUM, //直系亲属手机
            "IMMPHONEAREANUM": creditJson.storage.IMMPHONEAREANUM, //直系亲属区号
            "IMMPHONENUM": creditJson.storage.IMMPHONENUM, //直系亲属电话
            "URGRELATION": creditJson.storage.URGRELATION, //紧急联系人关系RELATIONSHIP
            "URGPHONEAREANUM": creditJson.storage.URGPHONEAREANUM, //紧急联系人区号
            "URGPHONENUM": creditJson.storage.URGPHONENUM, //紧急联系人电话
            "CLIENT_NO":creditJson.storage.CLIENT_NO,//客户号
            "faceRecogn":creditJson.storage.faceRecogn,//人脸识别状态
            "dwORhj":creditJson.storage.dwORhj,
            "lAddData":creditJson.storage.lAddData,  //named by lei 20160319
            "REMARK":commonJson.longitude,//工作轨迹的经度
            "REMARK2":commonJson.latitude,//工作轨迹的纬度
            "REMARK3":debitEnter.querySuss,//工作轨迹的纬度
            "REMARK4":($('#billDate').val()==undefined?'':$('#billDate').val()), //账单日
            "REMARK5":creditJson.storage.resource//信息来源
        }]
    };
    insertTableData(sendDataJson, function(msg) {}, function(err) {
        showMsg('存储脱机个人信息失败' + msg);
    });
}
//查询影像复用全部个人信息 
function queryAllcacheCustermerInfo() {
    queryTableDataByConditions({
        "databaseName": "myDatabase", //数据库名
        "tableName": "customer_info" //表名
    }, function(msg) {
        queryAllcacheCustermerInfoSucc(msg);
    }, function(err) {
        funDataFail(err);
    });
}
//查询全部个人信息 成功回调
function queryAllcacheCustermerInfoSucc(msg) {
    var textHtml = '';
    if (msg.length) {
        var nowTime = myTime.CurTime(); //当前时间戳
        var delArr = []; //记录要删除的图片
        $.each(msg.reverse(), function(index, el) {
            if (myTime.dateLessHour(el.SUBMITTIME, nowTime) && commonJson.adminCount == el.ADMINCOUNT && index < 5) { //是否小与一小时 true小于
                textHtml += '<li class="box-rows" cerNo="' + el.CERTNUM + '" submitTime="' + el.SUBMITTIME + '">' +
                    '<div>身份证</div>' +
                    '<div>' + el.CERTNUM + '</div>' +
                    '<div>' + el.MASCARDNAME + '</div>' +
                    '<div>' + el.BUSINESSTYPE + '</div>' +
                    '<div>' + myTime.UnixToDate(el.SUBMITTIME) + '</div>' +
                    '</li>';
            } else { //不小于1小时 则删除数据库中的数据
                if (commonJson.adminCount == el.ADMINCOUNT) { //只删除当前操作员名下的数据
                    delArr.push(el.CUSTANDCUSTOWNERPIC, el.FRONTIDCARDPIC, el.BACKIDCARDPIC);
                    //删除表里内容 根据条件删除
                    deleteTableData({
                        "databaseName": "myDatabase",
                        "tableName": "customer_info",
                        "conditions": [{
                            "SUBMITTIME": el.SUBMITTIME //提交时间
                        }]
                    }, function(msg) {
                        //alert('删除数据库成功'+msg);
                    }, function(err) {
                        //alert('删除数据库失败'+err);
                    })
                }
            }
        });
        if (delArr.length > 0) {
            deletePhoto(delArr, function(msg) {
                // msg=='删除成功'
                //alert('删除本地图片成功'+msg);
            }, function(err) {
                // err=='删除失败'
                //alert('删除本地图片失败'+err)

            })
        }
        //为每一条数据添加class=‘click'
        $(".box-content").on('tap', function(ev) {
            var oTarget = ev.target;
            _this = $(oTarget).closest('.box-rows');
            $(_this).addClass('click').siblings().removeClass('click');
            $('.footter .previous:eq(1)').addClass('btn_next');
            commonJson.submitTime = $(_this).attr("submitTime"); //存储复用的数据的提交时间 作为删除使用
            //从数据库里查询 当前复用的个人信息
            queryTableDataByConditions({
                "databaseName": "myDatabase", //数据库名
                "tableName": "customer_info", //表名
                "conditions": {
                    "SUBMITTIME": "between " + commonJson.submitTime + " and " + commonJson.submitTime
                }
            }, function(msg) {
                custermerInfo.nation = msg[0].NATION; //民族
                custermerInfo.cerNO = msg[0].CERTNUM; //身份证号码
                custermerInfo.address = msg[0].ADDRESS; //地址
                custermerInfo.name = msg[0].MASCARDNAME; //姓名
                custermerInfo.cerExpdDt = msg[0].CERTVALIDDATE; //有效日期
                custermerInfo.birthday = msg[0].BIRTH; //出生日期
                custermerInfo.sex = msg[0].SEX; //性别
                custermerInfo.issAuthority = msg[0].ISSAUTHORITY; //签发机关
                //custermerInfo.image = msg[0].IMAGE; //身份证头像图片
                custermerInfo.custAndCustOwnerPic = msg[0].CUSTANDCUSTOWNERPIC; //与客户合影照片
                custermerInfo.frontIDCardPic = msg[0].FRONTIDCARDPIC; //身份证正面
                custermerInfo.backIDCardPic = msg[0].BACKIDCARDPIC; //身份证反面
                custermerInfo.checkPhoto = msg[0].checkPhoto; //联网核查照片
                updateFilepath('',function(msg1){
                    //alert(msg1);
                    var array = msg[0].IMAGE.split("/");
                    custermerInfo.image = msg1+array[array.length-1];})

            }, function(err) {
                showMsg('查询个人信息失败');

            })
        });
    } else {
        textHtml = '<li style="line-height:40px;margin-top:30px;text-align:center;">暂无可复用信息</li>';
    }
    if (textHtml == '') {
        textHtml = '<li style="line-height:40px;margin-top:30px;text-align:center;">暂无可复用信息</li>';
    }
    $('.box-content').html(textHtml);
    hideLoader();

}
