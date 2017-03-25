/**
 * Created by Administrator on 2015/8/31.
 * named by Lei.
 * wce-dianzi.js 电子签约模块 成功回调函数
 */

/*电子签约联网核查 成功回调*/
function eleItizenCertificateIdenifySucc(msg) {
    // alert(msg);
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    //alert(responseCode)
    /*var textHtml='<p>被核对人姓名：'+responseCode.NAME+'</p>'
     +'<p>身份证号码：'+responseCode.ID+'</p>'
     +'<p>签发机关：'+responseCode.ISSUEOFFICE+'</p>'
     +'<p>发送时间：'+responseCode.ENTRUSTDATE+'</p>'
     +'<p>核对结果：'+responseCode.CHECKRESULT+'</p>'
     +'<img src="data:image/png;base64,'+base64decode(responseCode.PHOTO)+'" alt="" />';*/
    if (responseCode[0].results == "00") {
        hideLoader();
        if (responseCode[1].citizenCertificateIdentifyVO[0].CHECKRESULT == "00") { //联网核查成功
            //$("#xinka-readID .img_box").append(textHtml);
            $('.sh_loading_box_shadow').remove();
            $('.header .head-left,.header .head-right,.footter .previous:eq(0)').removeClass('btn-cannt-click');
            $("#dianzi-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>')
            //$("#dianzi-readID .loading_box").html('');
            //$("#dianzi-readID .pic_suc").text('身份证读取成功!');
            //    alert(responseCode[1].citizenCertificateIdentifyVO[0].PHOTO);
            eleSignJson.lianPic = base64decode(responseCode[1].citizenCertificateIdentifyVO[0].PHOTO);
            $('#dz-read-next').addClass('btn_next');
        } else {
            hideLoader();
            $('.sh_loading_box_shadow').remove();
            $('.header .head-left,.header .head-right,.footter .previous:eq(0)').removeClass('btn-cannt-click');
            $("#dianzi-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
        }
    } else {
        hideLoader();
        $('.sh_loading_box_shadow').remove();
        $('.header .head-left,.header .head-right,.footter .previous:eq(0)').removeClass('btn-cannt-click');
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
        $("#dianzi-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">无法进行联网核查！</div>');
    }
}

/*电子签约 核心查询 成功回调*/
function eleCustomerInfoServiceEleSignSucc(msg) {
    //alert(msg);
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == "00") {
        if ($.trim(responseCode[1].customerInfoVO[0].CH_CLIENT_NAME) != '' && $.trim(responseCode[1].customerInfoVO[0].CH_CLIENT_NAME) != custermerInfo.name) {
            showTags({
                'title': '提示',
                'content': '身份证姓名与核心姓名不一致,无法办理',
                'ok': {
                    fun: function () {
                        $.mobile.changePage('dianzi-readingID.html', {
                            reverse: true
                        });
                    }
                }
            });
            return;
        }
        eleSignJson.CLIENT_NO = responseCode[1].customerInfoVO[0].CLIENT_NO; //获取客户号
        eleSignJson.isCoreHas = eleSignJson.CLIENT_NO != "" ? true : false; //判断客户号是否为空
        $.mobile.changePage('./dianzi-kaiTong.html');
    } else if (responseCode[0].results == "08") {
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
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
                "REVERSE_FLAG.s": "D", //证件号内部检查标志 默认D
                "CARD_CATEGORY.s": "2"	//2检查是否有客户号和有效凭证存在
            }]
        };
        //核心联查
        icustomerInfoServiceFun(sendJson, function (msg) {
            eleCustomerInfoServiceEleSignSucc(msg);
        }, function (err) {
            funFail(err);
        });
    } else {
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {
                fun: function () {
                    $.mobile.changePage('dianzi-readingID.html', {reverse: true});
                }
            }
        });
    }
    //21  存折过多 不能开卡
    //01  异常 查询核心异常
    //12  客户号大于1 不能开卡
    //00  ok
}

/*电子签约信息查询 成功回调*/
function eleGetSignedInfoSucc(msg) {
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00') {   //接口服务成功
        eleSignJson.yinZhang = '';
        if (responseCode[1].queryPersonalBankVO[0].PHONE_NO == '' || responseCode[1].queryPersonalBankVO[0].PHONE_NO == 'undefined') {
            showTags({                //接口服务失败
                'title': '提示',
                'content': '客户信息不存在手机号码！',
                'ok': {
                    fun: function () {
                        $.mobile.changePage('dianzi-readingID.html', {reverse: true});
                    }
                }
            });
        }
        if (responseCode[1].queryPersonalBankVO[0].NETBANK_STATE == 'L' || responseCode[1].queryPersonalBankVO[0].NETBANK_STATE == 'U') {
            showTags({                  //接口服务失败
                'title': '提示',
                'content': '网银状态非正常，不可操作网银相关交易！',
                'ok': {
                    fun: function () {
                    }
                }
            });
        }
        eleSignJson.EPAY_LIMIT = responseCode[1].queryPersonalBankVO[0].EPAY_LIMIT;           //快捷支付限额
        eleSignJson.CLIENT_NO = responseCode[1].queryPersonalBankVO[0].CLIENT_NO;           //客户号
        eleSignJson.CLIENT_NAME = responseCode[1].queryPersonalBankVO[0].CLIENT_NAME;       //客户名称
        eleSignJson.SEX = responseCode[1].queryPersonalBankVO[0].SEX;                       //性别
        eleSignJson.CR_RATING = responseCode[1].queryPersonalBankVO[0].CR_RATING;             //客户登记
        eleSignJson.BIRTH_DATE = responseCode[1].queryPersonalBankVO[0].BIRTH_DATE;           //出生日期
        eleSignJson.MARITAL_STATUS = responseCode[1].queryPersonalBankVO[0].MARITAL_STATUS;   //婚姻状况
        eleSignJson.EDUCATION = responseCode[1].queryPersonalBankVO[0].EDUCATION;             //最高学历
        eleSignJson.CUKWGX = responseCode[1].queryPersonalBankVO[0].CUKWGX;                   //行员标志(客户与我行关系)
        eleSignJson.CUYGID = responseCode[1].queryPersonalBankVO[0].CUYGID;                   //行员工号
        eleSignJson.ORGAN_CODE = responseCode[1].queryPersonalBankVO[0].ORGAN_CODE;           //归属机构
        eleSignJson.ORG_NAME = responseCode[1].queryPersonalBankVO[0].ORG_NAME;               //归属机构名
        eleSignJson.ACCT_EXEC = responseCode[1].queryPersonalBankVO[0].ACCT_EXEC;             //归属客户经理
        eleSignJson.EMPLOYER_NAME = responseCode[1].queryPersonalBankVO[0].EMPLOYER_NAME;     //单位名称
        eleSignJson.NETBANK_NAME = responseCode[1].queryPersonalBankVO[0].NETBANK_NAME;       //网银用户名
        eleSignJson.PHONE_NO = responseCode[1].queryPersonalBankVO[0].PHONE_NO;              //手机号
        eleSignJson.CLIENT_EMAIL = responseCode[1].queryPersonalBankVO[0].CLIENT_EMAIL;       //EMAIL地址
        eleSignJson.SEC_NO = responseCode[1].queryPersonalBankVO[0].PHONE_NO;                 //手机号
        eleSignJson.PWD_STATUS = responseCode[1].queryPersonalBankVO[0].PWD_STATUS;           //网银查询密码状态
        eleSignJson.EBANKPWD_STATUS = responseCode[1].queryPersonalBankVO[0].EBANKPWD_STATUS; //网银交易密码状态
        eleSignJson.NETBANK_STATE = responseCode[1].queryPersonalBankVO[0].NETBANK_STATE;     //网银状态
        eleSignJson.NETBANK_STATE_N = responseCode[1].queryPersonalBankVO[0].NETBANK_STATE;     //网银状态
        eleSignJson.WAP_FLAG = responseCode[1].queryPersonalBankVO[0].WAP_FLAG;               //手机银行状态
        eleSignJson.WAP_FLAGT = responseCode[1].queryPersonalBankVO[0].WAP_FLAG;               //手机银行状态
        eleSignJson.OLD_WAP_FLAG = responseCode[1].queryPersonalBankVO[0].OLD_WAP_FLAG;        //手机银行上一次的状态
        eleSignJson.EPAY_FLAG = responseCode[1].queryPersonalBankVO[0].EPAY_FLAG;
        if (eleSignJson.userSign) {
            $('#dianzi-kaiTong .userName').html(eleSignJson.NETBANK_NAME);
        }
        /*初始化页面情况（开通or关闭）判断网上银行开通情况*/
        var index_s;   //获取限额数组的索引
        var sec_array = responseCode[1].queryPersonalBankVO[1].SEC_ARRAY;
        for (var i = 0; i < sec_array.length; i++) {
            if (sec_array[i].secInfoVO[0].SEC_TYPE == 'S') {
                index_s = i;
                break;
            } else {
                continue;
            }
        }
        eleSignJson.SEC_TRANSFER_DFLIMIT = fmoneyEle(responseCode[1].queryPersonalBankVO[1].SEC_ARRAY[index_s].secInfoVO[0].SEC_TRANSFER_DFLIMIT, 2);       //安全工具对外转账默认银行级限额
        eleSignJson.SEC_EPAY_DFLIMIT = fmoneyEle(responseCode[1].queryPersonalBankVO[1].SEC_ARRAY[index_s].secInfoVO[0].SEC_EPAY_DFLIMIT, 2);               //安全工具网上支付默认银行级限额
        eleSignJson.SEC_WAPTRANSFER_DFLIMIT = fmoneyEle(responseCode[1].queryPersonalBankVO[1].SEC_ARRAY[index_s].secInfoVO[0].SEC_WAPTRANSFER_DFLIMIT, 2); //安全工具手机对外转账默认银行级限额
        eleSignJson.SEC_STATE = fmoneyEle(responseCode[1].queryPersonalBankVO[1].SEC_ARRAY[index_s].secInfoVO[0].SEC_STATE, 2);                             //安全工具状态
        eleSignJson.SEC_EPAY_LIMIT = fmoneyEle(responseCode[1].queryPersonalBankVO[1].SEC_ARRAY[index_s].secInfoVO[0].SEC_EPAY_LIMIT, 2);
        eleSignJson.SEC_EPAY_LIMITT = fmoneyEle(responseCode[1].queryPersonalBankVO[1].SEC_ARRAY[index_s].secInfoVO[0].SEC_EPAY_LIMIT, 2);
        eleSignJson.SEC_TRANSFER_LIMIT = fmoneyEle(responseCode[1].queryPersonalBankVO[1].SEC_ARRAY[index_s].secInfoVO[0].SEC_TRANSFER_LIMIT, 2);
        eleSignJson.SEC_WAPTRANSFER_LIMIT = fmoneyEle(responseCode[1].queryPersonalBankVO[1].SEC_ARRAY[index_s].secInfoVO[0].SEC_WAPTRANSFER_LIMIT, 2);
        eleSignJson.SEC_TRANSFER_LIMITT = fmoneyEle(responseCode[1].queryPersonalBankVO[1].SEC_ARRAY[index_s].secInfoVO[0].SEC_TRANSFER_LIMIT, 2);
        eleSignJson.SEC_WAPTRANSFER_LIMITT = fmoneyEle(responseCode[1].queryPersonalBankVO[1].SEC_ARRAY[index_s].secInfoVO[0].SEC_WAPTRANSFER_LIMIT, 2);
        if (responseCode[1].queryPersonalBankVO[0].NETBANK_STATE == 'N') { /*N--正常  C--销户  L--锁定  U--待激活  W--未开通*/
            $('#netBank .kai').text('已开通');
            $('#switch-one').val('on').slider("refresh");
            if ($('.netBank .netBank-content').hasClass('no-kai')) {
                $('.netBank .netBank-content').removeClass('no-kai');
                $('.netBank .netBank-content input').removeClass('no-kai');
            }
            $('.netBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_TRANSFER_LIMIT).removeAttr('disabled');    //实际限额
            $('.netBank .netBank-content .wangyin:eq(1) .xe').val(eleSignJson.SEC_EPAY_LIMIT).removeAttr('disabled');
        } else if (responseCode[1].queryPersonalBankVO[0].NETBANK_STATE == 'L' || responseCode[1].queryPersonalBankVO[0].NETBANK_STATE == 'U') {
            $('#netBank .kai').text('已开通');
            $('#switch-one').val('on').attr('disabled', 'disabled').slider("refresh");
            if (!$('.netBank .netBank-content').hasClass('no-kai')) {
                $('.netBank .netBank-content').addClass('no-kai');
                $('.netBank .netBank-content input').addClass('no-kai').attr('disabled', 'disabled');
            }
            $('.netBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_TRANSFER_LIMIT).addClass('disabled');    //实际限额
            $('.netBank .netBank-content .wangyin:eq(1) .xe').val(eleSignJson.SEC_EPAY_LIMIT).addClass('disabled');
        }
        else {
            $('#netBank .kai').text('已关闭').addClass('off');
            $("#switch-one").val('off').slider("refresh");
            if (!$('.netBank .netBank-content').hasClass('no-kai')) {
                $('.netBank .netBank-content').addClass('no-kai');
                $('.netBank .netBank-content input').addClass('no-kai').attr('disabled', 'disabled');
            }
            $('.netBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_TRANSFER_DFLIMIT);    //最大限额
            $('.netBank .netBank-content .wangyin:eq(1) .xe').val(eleSignJson.SEC_EPAY_DFLIMIT);    //最大限额
        }
        //判断手机银行开通情况
        if (responseCode[1].queryPersonalBankVO[0].NETBANK_STATE == 'L' || responseCode[1].queryPersonalBankVO[0].NETBANK_STATE == 'U') {
            if (responseCode[1].queryPersonalBankVO[0].WAP_FLAG == 'N') { /*N--正常    W--未开通*/
                $('#mobBank .kai').text('已开通');
                $('#switch-two').val('on').attr('disabled', 'disabled').slider("refresh");
                if (!$('.mobBank .netBank-content').hasClass('no-kai')) {
                    $('.mobBank .netBank-content').addClass('no-kai');
                    $('.mobBank .netBank-content .xe').addClass('no-kai').attr('disabled', 'disabled');
                }
                $('.mobBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_WAPTRANSFER_LIMIT).attr('disabled');     //实际限额
            } else {
                $('#switch-two').val('off').attr('disabled', 'disabled').slider("refresh");
                if (!$('.mobBank .netBank-content').hasClass('no-kai')) {
                    $('.mobBank .netBank-content').addClass('no-kai');
                    $('.mobBank .netBank-content .xe').addClass('no-kai').attr('disabled', 'disabled');
                }
                $('#mobBank .kai').text('已关闭').addClass('off');
                $('.mobBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_WAPTRANSFER_DFLIMIT).addClass('no-kai').attr('disabled', 'disabled');    //最大限额
            }
        } else {
            if (responseCode[1].queryPersonalBankVO[0].WAP_FLAG == 'N') { /*N--正常    W--未开通*/
                $('#mobBank .kai').text('已开通');
                $('#switch-two').val('on').slider("refresh");
                if ($('.mobBank .netBank-content').hasClass('no-kai')) {
                    $('.mobBank .netBank-content').removeClass('no-kai');
                    $('.mobBank .netBank-content .xe').removeClass('no-kai');
                }
                $('.mobBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_WAPTRANSFER_LIMIT).removeAttr('disabled');     //实际限额
            } else {
                $('#switch-two').val('off').slider("refresh");
                if (!$('.mobBank .netBank-content').hasClass('no-kai')) {
                    $('.mobBank .netBank-content').addClass('no-kai');
                    $('.mobBank .netBank-content .xe').addClass('no-kai').attr('disabled', 'disabled');
                }
                $('#mobBank .kai').text('已关闭').addClass('off');
                $('.mobBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_WAPTRANSFER_DFLIMIT).addClass('no-kai').attr('disabled', 'disabled');    //最大限额
            }
        }
        //判断挂靠账户情况
        var signAccountInfoVOs = responseCode[3].signAccountInfoVOs;      //已挂靠账户
        //alert(signAccountInfoVOs.length);
        eleSignJson.signAccountInfoVOs = signAccountInfoVOs;
        var docLicenceVOs = responseCode[2].docLicenceVOs; //全部的账户
        eleSignJson.docLicenceVOs = responseCode[2].docLicenceVOs; //全部的账户
        var docLicenceNO = [];  //未挂靠账户
        if (signAccountInfoVOs.length == 0) {
            for (var j = 0; j < docLicenceVOs.length; j++) {
                docLicenceNO.push(docLicenceVOs[j]);
            }
        } else {
            for (var p = 0; p < docLicenceVOs.length; p++) {
                for (var q = 0; q < signAccountInfoVOs.length; q++) {
                    if (q == signAccountInfoVOs.length - 1) {
                        if (docLicenceVOs[p].docLicenceVO[0].ISSUE_ACCT_NO != signAccountInfoVOs[q].signAccountInfoVO[0].ACCT_NO) {
                            docLicenceNO.push(docLicenceVOs[p]);
                            break;
                        }
                        else {
                            continue;
                        }
                    } else {
                        if (docLicenceVOs[p].docLicenceVO[0].ISSUE_ACCT_NO == signAccountInfoVOs[q].signAccountInfoVO[0].ACCT_NO) {
                            break;
                        } else {
                            continue;
                        }
                    }
                }
            }
        }
        eleSignJson.docLicenceNO = docLicenceNO;
        var textHtml = '';
        var txtHtml = '';
        var guaPopHtml = '';
        var noGuaPopHtml = '';
        if (signAccountInfoVOs.length > 0) {   //说明已挂靠账户不为空
            if (signAccountInfoVOs.length == 1) {
                if (!$('.yesgua-btn').hasClass('disgua-btn')) {
                    $('.yesgua-btn').addClass('disgua-btn');
                }
            }
            $.each(signAccountInfoVOs, function (index, ele) {
                if (ele.signAccountInfoVO[0].VOUCHER_TYPE == '' || ele.signAccountInfoVO[0].VOUCHER_TYPE == undefined) {
                    ele.signAccountInfoVO[0].VOUCHER_TYPE = '008';
                }
                textHtml += ' <div class="kai-list" voucher="' + ele.signAccountInfoVO[0].VOUCHER_TYPE + '">' + ele.signAccountInfoVO[0].ACCT_NO + '</div>';
                //guaPopHtml += '<div class="gua-rows"><span voucher="' + ele.signAccountInfoVO[0].VOUCHER_TYPE + '">' + ele.signAccountInfoVO[0].ACCT_NO + '</span><img src="../../images/ic-gou.png" /></div>';
            });
            $.each(docLicenceNO, function (index, ele) {
                if (ele.docLicenceVO[0].DOC_TYPE == '' || ele.docLicenceVO[0].DOC_TYPE == undefined) {
                    ele.docLicenceVO[0].DOC_TYPE = '008';
                }
                textHtml += ' <div class="kai-list no-list" voucher="' + ele.docLicenceVO[0].DOC_TYPE + '">' + ele.docLicenceVO[0].ISSUE_ACCT_NO + '</div>';
                //guaPopHtml += '<div class="gua-rows no-list"><span voucher="' + ele.docLicenceVO[0].DOC_TYPE + '">' + ele.docLicenceVO[0].ISSUE_ACCT_NO + '</span><img src="../../images/ic-gou.png" /></div>';
            });
            $('.guaKao .guaK .gua-box').html(textHtml);
        } else {
            if (!$('.yesgua-btn').hasClass('disgua-btn')) {
                $('.yesgua-btn').addClass('disgua-btn');
            }
            $.each(docLicenceNO, function (index, ele) {
                if (ele.docLicenceVO[0].DOC_TYPE == '' || ele.docLicenceVO[0].DOC_TYPE == undefined) {
                    ele.docLicenceVO[0].DOC_TYPE = '008';
                }
                textHtml += ' <div class="kai-list no-list" voucher="' + ele.docLicenceVO[0].DOC_TYPE + '">' + ele.docLicenceVO[0].ISSUE_ACCT_NO + '</div>';
                //guaPopHtml += '<div class="gua-rows no-list"><span voucher="' + ele.docLicenceVO[0].DOC_TYPE + '">' + ele.docLicenceVO[0].ISSUE_ACCT_NO + '</span><img src="../../images/ic-gou.png" /></div>';
            });
            $('.guaKao .guaK .gua-box').html(textHtml);
            //$('#removeGua .pop-gua').html(guaPopHtml);
            //showTags({                //接口服务失败
            //    'title': '提示',
            //    'content': '请添加挂靠账号',
            //    'ok': {
            //        fun: function () {
            //        }
            //    }
            //});
        }
        if (docLicenceNO.length > 0) {      //未挂靠账户不为空
            $.each(docLicenceNO, function (index, ele) {
                if (ele.docLicenceVO[0].DOC_TYPE == '' || ele.docLicenceVO[0].DOC_TYPE == undefined) {
                    ele.docLicenceVO[0].DOC_TYPE = '008';
                }
                txtHtml += ' <div class="kai-list " voucher="' + ele.docLicenceVO[0].DOC_TYPE + '">' + ele.docLicenceVO[0].ISSUE_ACCT_NO + '</div>';
                //noGuaPopHtml += '<div class="gua-rows"><span voucher="' + ele.docLicenceVO[0].DOC_TYPE + '">' + ele.docLicenceVO[0].ISSUE_ACCT_NO + '</span><img src="../../images/ic-gou.png" /></div>';
            });
            $.each(signAccountInfoVOs, function (index, ele) {
                if (ele.signAccountInfoVO[0].VOUCHER_TYPE == '' || ele.signAccountInfoVO[0].VOUCHER_TYPE == undefined) {
                    ele.signAccountInfoVO[0].VOUCHER_TYPE = '008';
                }
                txtHtml += ' <div class="kai-list no-list" voucher="' + ele.signAccountInfoVO[0].VOUCHER_TYPE + '">' + ele.signAccountInfoVO[0].ACCT_NO + '</div>';
                //noGuaPopHtml += '<div class="gua-rows no-list"><span voucher="' + ele.signAccountInfoVO[0].VOUCHER_TYPE + '">' + ele.signAccountInfoVO[0].ACCT_NO + '</span><img src="../../images/ic-gou.png" /></div>';
            });
            $('.guaKao .no-guaK .no-gua-box').html(txtHtml);
            //$('#addGua .pop-gua').html(noGuaPopHtml);
        } else {
            if (!$('.nogua-btn').hasClass('disgua-btn')) {
                $('.nogua-btn').addClass('disgua-btn');
            }
            $.each(signAccountInfoVOs, function (index, ele) {
                if (ele.signAccountInfoVO[0].VOUCHER_TYPE == '' || ele.signAccountInfoVO[0].VOUCHER_TYPE == undefined) {
                    ele.signAccountInfoVO[0].VOUCHER_TYPE = '008';
                }
                txtHtml += ' <div class="kai-list no-list" voucher="' + ele.signAccountInfoVO[0].VOUCHER_TYPE + '">' + ele.signAccountInfoVO[0].ACCT_NO + '</div>';
                //noGuaPopHtml += '<div class="gua-rows no-list"><span voucher="' + ele.signAccountInfoVO[0].VOUCHER_TYPE + '">' + ele.signAccountInfoVO[0].ACCT_NO + '</span><img src="../../images/ic-gou.png" /></div>';
            });
            $('.guaKao .no-guaK .no-gua-box').html(txtHtml);
        }
        if (eleSignJson.NETBANK_STATE_N == 'L' || eleSignJson.NETBANK_STATE_N == 'U') {
            if (!$('.nogua-btn').hasClass('disgua-btn')) {
                $('.nogua-btn').addClass('disgua-btn');
            }
            if (!$('.yesgua-btn').hasClass('disgua-btn')) {
                $('.yesgua-btn').addClass('disgua-btn');
            }
        }
        //$('.pop-gua .gua-rows').bind('click', this, function () {
        //    alert(12);
        //    var ele = $('#removeGua .pop-gua').find('.gua-rows');
        //    for (var i = 0; i < ele.length; i++) {
        //        $('#removeGua .pop-gua .gua-rows').eq(i).find('img').css('display', 'none');
        //        if ($(this).hasClass('lin')) {
        //            $(this).removeClass('lin');
        //        }
        //        if ($(this).find('span').hasClass('spanLin')) {
        //            $(this).find('span').removeClass('spanLin');
        //        }
        //    }
        //    if ($('#addGua .pop-gua .gua-rows').hasClass('lin')) {
        //        if (!$(this).hasClass('li')) {
        //            showTags({
        //                'title': '提示',
        //                'content': '不可以操作多个账号',
        //                'ok': {
        //                    fun: function () {
        //                        $('#removeGua').popup('close');
        //                    }
        //                }
        //            });
        //        } else {
        //            var display = $(this).find('img').css('display');
        //            if (display == 'none' || display == undefined) {
        //                $(this).find('img').css('display', 'inline-block');
        //
        //                $('#removeGua .gua-btn').removeClass('disgua-btn');
        //            }
        //        }
        //    } else {
        //        var display = $(this).find('img').css('display');
        //        if (display == 'none' || display == undefined) {
        //            $(this).addClass('lin');
        //            $(this).find('span').addClass('spanLin');
        //            $(this).find('img').css('display', 'inline-block');
        //            $('#removeGua .gua-btn').removeClass('disgua-btn');
        //        }
        //    }
        //
        //
        //});
        //整合提交数据
        eleSignJson.PAITYPE = '';
        if (eleSignJson.PWD_STATUS == '5' && eleSignJson.EBANKPWD_STATUS == '5') {
            eleSignJson.PAITYPE = 'BC';
            $('.bank-mm .mm-value').eq(0).text('未设置').addClass('mm-gray');
            $('.bank-mm .mm-value').eq(1).text('未设置').addClass('mm-gray');
        } else if (eleSignJson.PWD_STATUS == '5' && eleSignJson.EBANKPWD_STATUS != '5') {
            eleSignJson.PAITYPE = 'B';
            $('.bank-mm .mm-value').eq(0).text('未设置').addClass('mm-gray');
            $('.bank-mm .mm-value').eq(1).text('已设置').addClass('mm-blue');
        } else if (eleSignJson.PWD_STATUS != '5' && eleSignJson.EBANKPWD_STATUS == '5') {
            eleSignJson.PAITYPE = 'C';
            $('.bank-mm .mm-value').eq(0).text('已设置').addClass('mm-blue');
            $('.bank-mm .mm-value').eq(1).text('未设置').addClass('mm-gray');
        } else {
            eleSignJson.PAITYPE = '';
            $('.bank-mm .mm-value').eq(0).text('已设置').addClass('mm-blue');
            $('.bank-mm .mm-value').eq(1).text('已设置').addClass('mm-blue');
        }

        //$('#addGua .pop-gua .gua-rows').bind('click', this, function () {
        //    var ele = $('#addGua .pop-gua').find('.gua-rows');
        //    for (var i = 0; i < ele.length; i++) {
        //        $('#addGua .pop-gua .gua-rows').find('img').css('display', 'none');
        //        if ($(this).hasClass('lin')) {
        //            $(this).removeClass('lin');
        //        }
        //        if ($(this).find('span').hasClass('spanLin')) {
        //            $(this).find('span').removeClass('spanLin');
        //        }
        //    }
        //    if ($('#removeGua .pop-gua .gua-rows').hasClass('lin')) {
        //        if (!$(this).hasClass('li')) {
        //            showTags({
        //                'title': '提示',
        //                'content': '不可以操作多个账号',
        //                'ok': {
        //                    fun: function () {
        //                        $('#addGua').popup('close');
        //                    }
        //                }
        //            });
        //        } else {
        //            var display = $(this).find('img').css('display');
        //            if (display == 'none' || display == undefined) {
        //                $(this).find('img').css('display', 'inline-block');
        //                $('#addGua .gua-btn').removeClass('disgua-btn');
        //                $('#removeGua .gua-btn').removeClass('disgua-btn');
        //            }
        //        }
        //    } else {
        //        var display = $(this).find('img').css('display');
        //        if (display == 'none' || display == undefined) {
        //            $(this).addClass('lin');
        //            $(this).find('span').addClass('spanLin');
        //            $(this).find('img').css('display', 'inline-block');
        //            $('#addGua .gua-btn').removeClass('disgua-btn');
        //        }
        //    }
        //});
        //初始银信通
        eleSignJson.queryMassagePersonalInquiryVO = responseCode[4].queryMassagePersonalInquiryVO;
        for (var ln = eleSignJson.queryMassagePersonalInquiryVO[0].NOTE_OPEN.length; ln < 9; ln++) {
            eleSignJson.queryMassagePersonalInquiryVO[0].NOTE_OPEN += '0';
        }
        var noteOpenArr = eleSignJson.queryMassagePersonalInquiryVO[0].NOTE_OPEN.split("");
        eleSignJson.openStatus = eleSignJson.queryMassagePersonalInquiryVO[0].OPEN_STATUS;
        eleSignJson.OLD_OPEN_STATUS = eleSignJson.queryMassagePersonalInquiryVO[0].OLD_OPEN_STATUS;
        eleSignJson.NOTE_OPEN = eleSignJson.queryMassagePersonalInquiryVO[0].NOTE_OPEN;
        eleSignJson.NOTE_OPENT = eleSignJson.queryMassagePersonalInquiryVO[0].NOTE_OPEN;
        if (noteOpenArr[0] == '1') {   //资金转出通知
            $('#switch-three').parents('.bank-box-con').find('.kai').text('已开通');
            $('#switch-three').parents('.bank-box-con').find('.yimport-content').removeClass('no-kai');
            $('#yexport-wxxe').val(fmoneyEle(eleSignJson.queryMassagePersonalInquiryVO[0].START_OUT_AMT, 2)).removeAttr('disabled').removeClass('no-kai');
            eleSignJson.FROM_INCEPT_AMT = fmoneyEle(eleSignJson.queryMassagePersonalInquiryVO[0].START_OUT_AMT, 2);
            eleSignJson.FROM_INCEPT_AMTT = fmoneyEle(eleSignJson.queryMassagePersonalInquiryVO[0].START_OUT_AMT, 2);
            $('#switch-three').val('on').slider("refresh");
        } else {
            $('#switch-three').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
            $('#yexport-wxxe').val('300.00').attr('disabled', 'disabled').addClass('no-kai');
            $('#switch-three').parents('.bank-box-con').find('.yimport-content').addClass('no-kai');
            $('#switch-three').val('off').slider("refresh");

        }
        if (noteOpenArr[1] == '1') {   //资金转入通知
            $('#switch-four').parents('.bank-box-con').find('.kai').text('已开通');
            $('#switch-four').parents('.bank-box-con').find('.yimport-content').removeClass('no-kai');
            $('#yimport-wxxe').val(fmoneyEle(eleSignJson.queryMassagePersonalInquiryVO[0].START_IN_AMT, 2)).removeAttr('disabled').removeClass('no-kai');
            eleSignJson.TO_INCEPT_AMT = fmoneyEle(eleSignJson.queryMassagePersonalInquiryVO[0].START_IN_AMT, 2);
            eleSignJson.TO_INCEPT_AMTT = fmoneyEle(eleSignJson.queryMassagePersonalInquiryVO[0].START_IN_AMT, 2);
            $('#switch-four').val('on').slider("refresh");
        } else {
            $('#switch-four').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
            $('#switch-four').parents('.bank-box-con').find('.yimport-content').addClass('no-kai');
            $('#yimport-wxxe').val('300.00').attr('disabled', 'disabled').addClass('no-kai');
            $('#switch-four').val('off').slider("refresh");
        }
        if (noteOpenArr[3] == '1') {   //资金到期通知
            $('#switch-five').parents('.bank-box-con').find('.kai').text('已开通');
            $('#switch-five').val('on').slider("refresh");
        } else {
            $('#switch-five').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
            $('#switch-five').val('off').slider("refresh");
        }
        if (noteOpenArr[5] == '1') {   //金融信息通知
            $('#switch-six').parents('.bank-box-con').find('.kai').text('已开通');
            $('#switch-six').val('on').slider("refresh");
        } else {
            $('#switch-six').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
            $('#switch-six').val('off').slider("refresh");
        }
        //判断银信通开通情况
        var allHtml = '';
        $.each(docLicenceVOs, function (index, ele) {
            if (ele.docLicenceVO[0].DOC_TYPE == '' || ele.docLicenceVO[0].DOC_TYPE == undefined) {
                ele.docLicenceVO[0].DOC_TYPE = '008';
            }
            allHtml += '<option  value="' + ele.docLicenceVO[0].DOC_TYPE + '">' + ele.docLicenceVO[0].ISSUE_ACCT_NO + '</option>'
        });
        $('#ples-kzh').html(allHtml).selectmenu("refresh", true);

        eleSignJson.yinZhang = $('#ples-kzh option:selected').text();
        if (eleSignJson.openStatus == '0') {  //开通
            $('#ples-kzh-button').find('span').css('color', 'orange');
        } else if (eleSignJson.openStatus == '1') {  //欠费
            $('#ples-kzh-button').find('span').css('color', 'red');
        }
        //下一步点亮
        $('#xk-agree-next').addClass('btn_next');
    } else {
        hideLoader();
        showTags({                //接口服务失败
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {
                fun: function () {
                    $.mobile.changePage('dianzi-readingID.html', {reverse: true});
                }
            }
        });
    }
}

/*短信个人签约查询 成功回调*/
function eleGetQueryMassageInquirySucc(msg) {
    hideLoader();
    //alert(msg);
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00') {
        eleSignJson.yinZhang = $('#ples-kzh option:selected').text();
        eleSignJson.queryMassagePersonalInquiryVO = responseCode[1].queryMassagePersonalInquiryVO;
        eleSignJson.openStatus = eleSignJson.queryMassagePersonalInquiryVO[0].OPEN_STATUS;
        eleSignJson.OLD_OPEN_STATUS = eleSignJson.queryMassagePersonalInquiryVO[0].OLD_OPEN_STATUS;
        for (var ln = eleSignJson.queryMassagePersonalInquiryVO[0].NOTE_OPEN.length; ln < 9; ln++) {
            eleSignJson.queryMassagePersonalInquiryVO[0].NOTE_OPEN += '0';
        }
        eleSignJson.NOTE_OPEN = eleSignJson.queryMassagePersonalInquiryVO[0].NOTE_OPEN;
        eleSignJson.NOTE_OPENT = eleSignJson.queryMassagePersonalInquiryVO[0].NOTE_OPEN;
        var noteArr = eleSignJson.NOTE_OPEN.split("");
        if (eleSignJson.openStatus == '0') {  //开通
            $('#ples-kzh-button').find('span').css('color', 'orange');
        } else if (eleSignJson.openStatus == '1') {  //欠费
            $('#ples-kzh-button').find('span').css('color', 'red');
        }
        if (noteArr[0] == '1') {   //资金转出通知
            if ($('#switch-three').parents('.bank-box-con').find('.kai').hasClass('off')) {
                $('#switch-three').parents('.bank-box-con').find('.kai').removeClass('off');
            }
            $('#switch-three').parents('.bank-box-con').find('.kai').text('已开通');
            $('#yexport-wxxe').val(eleSignJson.queryMassagePersonalInquiryVO[0].START_OUT_AMT).removeAttr('disabled').removeClass('no-kai');
            eleSignJson.FROM_INCEPT_AMT = eleSignJson.queryMassagePersonalInquiryVO[0].START_OUT_AMT;
            eleSignJson.FROM_INCEPT_AMTT = eleSignJson.queryMassagePersonalInquiryVO[0].START_OUT_AMT;
            $('#switch-three').parents('.bank-box-con').find('.yimport-content').removeClass('no-kai');
            $('#switch-three').val('on').slider("refresh");
        } else {
            $('#switch-three').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
            $('#yexport-wxxe').val('300.00').attr('disabled', 'disabled').addClass('no-kai');
            $('#switch-three').parents('.bank-box-con').find('.yimport-content').addClass('no-kai');
            $('#switch-three').val('off').slider("refresh");
        }
        if (noteArr[1] == '1') {   //资金转入通知
            if ($('#switch-four').parents('.bank-box-con').find('.kai').hasClass('off')) {
                $('#switch-four').parents('.bank-box-con').find('.kai').removeClass('off');
            }
            $('#switch-four').parents('.bank-box-con').find('.kai').text('已开通');
            $('#switch-four').parents('.bank-box-con').find('.yimport-content').removeClass('no-kai');
            $('#yimport-wxxe').val(eleSignJson.queryMassagePersonalInquiryVO[0].START_IN_AMT).removeAttr('disabled').removeClass('no-kai');
            eleSignJson.TO_INCEPT_AMT = eleSignJson.queryMassagePersonalInquiryVO[0].START_IN_AMT;
            eleSignJson.TO_INCEPT_AMTT = eleSignJson.queryMassagePersonalInquiryVO[0].START_IN_AMT;
            $('#switch-four').val('on').slider("refresh");
        } else {
            $('#switch-four').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
            $('#switch-four').parents('.bank-box-con').find('.yimport-content').addClass('no-kai');
            $('#yimport-wxxe').val('300.00').attr('disabled', 'disabled').addClass('no-kai');
            $('#switch-four').val('off').slider("refresh");

        }
        if (noteArr[3] == '1') {   //资金到期通知
            if ($('#switch-five').parents('.bank-box-con').find('.kai').hasClass('off')) {
                $('#switch-five').parents('.bank-box-con').find('.kai').removeClass('off');
            }
            $('#switch-five').parents('.bank-box-con').find('.kai').text('已开通');
            $('#switch-five').val('on').slider("refresh");
        } else {
            $('#switch-five').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
            $('#switch-five').val('off').slider("refresh");
        }
        if (noteArr[5] == '1') {   //金融信息通知
            if ($('#switch-six').parents('.bank-box-con').find('.kai').hasClass('off')) {
                $('#switch-six').parents('.bank-box-con').find('.kai').removeClass('off');
            }
            $('#switch-six').parents('.bank-box-con').find('.kai').text('已开通');
            $('#switch-six').val('on').slider("refresh");
        } else {
            $('#switch-six').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
            $('#switch-six').val('off').slider("refresh");
        }
    } else {
        $('#ples-kzh').val(eleSignJson.yinZhang).selectmenu('refresh');
        $('#ples-kzh-button span').text(eleSignJson.yinZhang);
        var noteArr = eleSignJson.NOTE_OPEN.split("");
        if (eleSignJson.openStatus == '0') {  //开通
            $('#ples-kzh-button').find('span').css('color', 'orange');
        } else if (eleSignJson.openStatus == '1') {  //欠费
            $('#ples-kzh-button').find('span').css('color', 'red');
        }
        if (noteArr[0] == '1') {   //资金转出通知
            if ($('#switch-three').parents('.bank-box-con').find('.kai').hasClass('off')) {
                $('#switch-three').parents('.bank-box-con').find('.kai').removeClass('off');
            }
            $('#switch-three').parents('.bank-box-con').find('.kai').text('已开通');
            $('#yexport-wxxe').val(fmoneyEle(eleSignJson.queryMassagePersonalInquiryVO[0].START_OUT_AMT, 2)).removeAttr('disabled').removeClass('no-kai');
            eleSignJson.FROM_INCEPT_AMT = fmoneyEle(eleSignJson.queryMassagePersonalInquiryVO[0].START_OUT_AMT, 2);
            eleSignJson.FROM_INCEPT_AMTT = fmoneyEle(eleSignJson.queryMassagePersonalInquiryVO[0].START_OUT_AMT, 2);
            $('#switch-three').parents('.bank-box-con').find('.yimport-content').removeClass('no-kai');
            $('#switch-three').val('on').slider("refresh");
        } else {
            $('#switch-three').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
            $('#yexport-wxxe').val('300.00').attr('disabled', 'disabled');
            $('#switch-three').parents('.bank-box-con').find('.yimport-content').addClass('no-kai');
            $('#switch-three').val('off').slider("refresh");
        }
        if (noteArr[1] == '1') {   //资金转入通知
            if ($('#switch-four').parents('.bank-box-con').find('.kai').hasClass('off')) {
                $('#switch-four').parents('.bank-box-con').find('.kai').removeClass('off');
            }
            $('#switch-four').parents('.bank-box-con').find('.kai').text('已开通');
            $('#switch-four').parents('.bank-box-con').find('.yimport-content').removeClass('no-kai');
            $('#yimport-wxxe').val(fmoneyEle(eleSignJson.queryMassagePersonalInquiryVO[0].START_IN_AMT, 2)).removeAttr('disabled').removeClass('no-kai');
            eleSignJson.TO_INCEPT_AMT = fmoneyEle(eleSignJson.queryMassagePersonalInquiryVO[0].START_IN_AMT, 2);
            eleSignJson.TO_INCEPT_AMTT = fmoneyEle(eleSignJson.queryMassagePersonalInquiryVO[0].START_IN_AMT, 2);
            $('#switch-four').val('on').slider("refresh");
        } else {
            $('#switch-four').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
            $('#switch-four').parents('.bank-box-con').find('.yimport-content').addClass('no-kai');
            $('#yimport-wxxe').val('300.00').attr('disabled', 'disabled');
            $('#switch-four').val('off').slider("refresh");

        }
        if (noteArr[3] == '1') {   //资金到期通知
            if ($('#switch-five').parents('.bank-box-con').find('.kai').hasClass('off')) {
                $('#switch-five').parents('.bank-box-con').find('.kai').removeClass('off');
            }
            $('#switch-five').parents('.bank-box-con').find('.kai').text('已开通');
            $('#switch-five').val('on').slider("refresh");
        } else {
            $('#switch-five').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
            $('#switch-five').val('off').slider("refresh");
        }
        if (noteArr[5] == '1') {   //金融信息通知
            if ($('#switch-six').parents('.bank-box-con').find('.kai').hasClass('off')) {
                $('#switch-six').parents('.bank-box-con').find('.kai').removeClass('off');
            }
            $('#switch-six').parents('.bank-box-con').find('.kai').text('已开通');
            $('#switch-six').val('on').slider("refresh");
        } else {
            $('#switch-six').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
            $('#switch-six').val('off').slider("refresh");
        }
        showTags({                //接口服务失败
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {
                fun: function () {
                }
            }
        });
    }
}


/*个人网银新签约 成功回调*/
function eleGetSilverNewsSigningSucc(msg) {
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    eleSignJson.qrCodeMsg = '';          //初始化二维码错误信息
    if (responseCode[0].results == '00' || responseCode[0].results == '13') {
        eleSignJson.qrCode = responseCode[0].pdfUrl;
//      eleSignJson.platGlobalSeq = responseCode[0].platGlobalSeq;//流水号
        if (lianwanghechaData.CheckResult == "09") {

        } else {
            //存储个人信息
            cacheCustermerInfo({
                "databaseName": "myDatabase",
                "tableName": "customer_info",
                "data": [{
                    "ADMINCOUNT": commonJson.adminCount,//登陆账号
                    "SUBMITTIME": myTime.CurTime(),//提交时间
                    "BUSINESSTYPE": "电子签约",//业务类型
                    "NATION": custermerInfo.nation,//民族
                    "CERTNUM": custermerInfo.cerNO,//身份证号码
                    "ADDRESS": custermerInfo.address,//地址
                    "MASCARDNAME": custermerInfo.name,//姓名
                    "CERTVALIDDATE": custermerInfo.cerExpdDt,//有效日期
                    "BIRTH": custermerInfo.birthday,//出生日期
                    "SEX": custermerInfo.sex,//性别
                    "ISSAUTHORITY": custermerInfo.issAuthority,//签发机关
                    "IMAGE": custermerInfo.image,//身份证头像图片
                    "CUSTANDCUSTOWNERPIC": custermerInfo.custAndCustOwnerPic,//与客户合影照片
                    "FRONTIDCARDPIC": custermerInfo.frontIDCardPic,//身份证正面
                    "BACKIDCARDPIC": custermerInfo.backIDCardPic,//身份证反面
                    "checkPhoto": custermerInfo.checkPhoto //联网核查图片
                }]
            });
        }
        changeUploadStatus("02", eleSignJson.phoneTime, eleSignJson.signTime);
        if (responseCode[0].results == '13') {//业务处理成功后台报错弹窗
            hideLoader();
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {
                    fun: function () {
                        $.mobile.changePage('dianzi-complete.html', {transition: "slide"});
                    }
                }
            });
        } else {
            hideLoader();
            $.mobile.changePage('dianzi-complete.html', {transition: "slide"});
        }
    } else if (responseCode[0].results == '08') {
        hideLoader();
        submitElectronicSignInfo();
    } else if (responseCode[0].results == '11') {                     //部分成功部分失败
//      eleSignJson.platGlobalSeq = responseCode[0].platGlobalSeq;//流水号
        if (eleSignJson.platGlobalSeq != '') {//流水号不为空，存储个人信息 上传影像
            if (lianwanghechaData.CheckResult == "09") {

            } else {
                //存储个人信息
                cacheCustermerInfo({
                    "databaseName": "myDatabase",
                    "tableName": "customer_info",
                    "data": [{
                        "ADMINCOUNT": commonJson.adminCount,//登陆账号
                        "SUBMITTIME": myTime.CurTime(),//提交时间
                        "BUSINESSTYPE": "电子签约",//业务类型
                        "NATION": custermerInfo.nation,//民族
                        "CERTNUM": custermerInfo.cerNO,//身份证号码
                        "ADDRESS": custermerInfo.address,//地址
                        "MASCARDNAME": custermerInfo.name,//姓名
                        "CERTVALIDDATE": custermerInfo.cerExpdDt,//有效日期
                        "BIRTH": custermerInfo.birthday,//出生日期
                        "SEX": custermerInfo.sex,//性别
                        "ISSAUTHORITY": custermerInfo.issAuthority,//签发机关
                        "IMAGE": custermerInfo.image,//身份证头像图片
                        "CUSTANDCUSTOWNERPIC": custermerInfo.custAndCustOwnerPic,//与客户合影照片
                        "FRONTIDCARDPIC": custermerInfo.frontIDCardPic,//身份证正面
                        "BACKIDCARDPIC": custermerInfo.backIDCardPic,//身份证反面
                        "checkPhoto": custermerInfo.checkPhoto //联网核查图片
                    }]
                });
            }
            //上传影像
            changeUploadStatus("02", eleSignJson.phoneTime, eleSignJson.signTime);
        }
        eleSignJson.qrCode = responseCode[0].pdfUrl;
        if (eleSignJson.qrCode == '' || eleSignJson.qrCode == undefined) {    //判断电子回单
            hideLoader();
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {
                    fun: function () {
                        $('#dianzi-customerConfirm #dz-customerCon-sub').removeClass('btn_next');
                    }
                }
            });
        } else {
            eleSignJson.qrCodeMsg = responseCode[0].message;
            $.mobile.changePage('dianzi-complete.html', {transition: "slide"});
        }
    } else if (responseCode[0].results == "09") {
        hideLoader();
        showTags({
            'title': '提示',
            'content': '业务处理超时!' + responseCode[0].message,
            'ok': {
                'title': '继续处理',
                fun: function () {
                    setTimeout(function(){
                        eleGetSilverNewsSigningFail();
                    },300);
                }
            }
        });
    } else {
        hideLoader();
        changeUploadStatus("03", eleSignJson.phoneTime, eleSignJson.signTime);
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {
                fun: function () {
                    $('#dianzi-customerConfirm #dz-customerCon-sub').removeClass('btn_next');
                }
            }
        });
    }
}

/*电子签约 获取短信验证码 成功回调*/
function imessageAuthentionServiceEleSignSucc(msg) {
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00') {
        //$('#dianzi-customerConfirm #inp').val(responseCode[1].messageAuthentionVO[0].MSG_INFO);
        eleSignJson.MSG_INFO = responseCode[1].messageAuthentionVO[0].MSG_INFO; //获取短信验证码
        eleSignJson.USER_NO = responseCode[1].messageAuthentionVO[0].USER_NO; //获取用户唯一标识
        //$('#dianzi-customerConfirm #inp').val(eleSignJson.MSG_INFO);
        var _ind = 80;
        eleSignJson.codeTime = setInterval(function () {
            _ind--;
            $("#dianzi-auth-time").text(_ind);
            if (_ind == 0) {
                clearInterval(eleSignJson.codeTime);
                $("#getMsg").text('重新获取');
                $('#getMsg').addClass('disMsg').removeClass('disgua-btn');
                eleSignJson.getYZM = true;
                eleSignJson.USER_NO = "";
            }
        }, 1000);
    } else if (responseCode[0].results == '08') {
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": eleSignJson.moduleId, //模块编号
                "tranId.s": eleSignJson.tranId1, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "orgId.s": commonJson.orgId,
                "SUSER_ID.s": commonJson.orgId + commonJson.adminCount, //机构号+柜员号
                "Flags.s": "BBBB", //标记位
                "MOBILE_NO.s": eleSignJson.PHONE_NO, //手机号码'018232053662',//
                "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
                "faceRecogn.s": eleSignJson.faceRecogn //人脸识别
            }]
        };
        showLoader('获取中...');
        imessageAuthentionServiceFun(sendJson, function (msg) {
            imessageAuthentionServiceEleSignSucc(msg);
        }, function (err) {
            hideLoader();
            eleSignJson.getYZM = true;
            $('#getMsg').addClass('disMsg').removeClass('disgua-btn');
            funFail(err);
        });
    } else {
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {
                fun: function () {
                    eleSignJson.getYZM = true;
                    $('#getMsg').addClass('disMsg').removeClass('disgua-btn');
                }
            }
        });
    }
}
/*电子签约 验证短信验证码 成功回调*/
function eleImessageAuthentionServiceYSucc(msg) {
    //alert(msg);
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00') {
        eleSignJson.USER_NO = "";
        if (eleSignJson.platGlobalSeq != undefined && eleSignJson.platGlobalSeq != null && eleSignJson.platGlobalSeq != '') {
            hideLoader();
            eleImsgAuthUpload(function(){
                submitElectronicSignInfo();
            });
        } else {
            getPlatGlobalSeq(eleSignJson, function () {
                eleImsgAuthUpload(function(){
                    submitElectronicSignInfo();
                });
            });
        }
    } else if (responseCode[0].results == '08') {
        hideLoader();
        showLoader("短信验证码验证中...");
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": eleSignJson.moduleId, //模块编号
                "tranId.s": eleSignJson.tranId1, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "orgId.s": commonJson.orgId,
                "SUSER_ID.s": commonJson.orgId + commonJson.adminCount, //机构号+柜员号
                "USER_NO.s": eleSignJson.USER_NO, //用户唯一标识
                "EPay_PassType.s": "ST", //认证类型 ST短信  NT令牌
                "MSG_INFO.s": $('#dianzi-customerConfirm #inp').val(), //动态口令debitEnter.MSG_INFO
                "Flags.s": "BBBB", //标记位
                "MOBILE_NO.s": eleSignJson.PHONE_NO, //手机号码 '018232053662',//
                "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
                "faceRecogn.s": eleSignJson.faceRecogn //人脸识别

            }]
        };
        imessageAuthentionServiceYFun(sendJson, function (msg) {
            eleImessageAuthentionServiceYSucc(msg);
        }, function (err) {
            eleSignJson.USER_NO = "";
            funFail(err);
        });
    } else {
        hideLoader();
        eleSignJson.USER_NO = "";
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {
                fun: function () {
                    $('#dianzi-customerConfirm #inp').val('');
                }
            }
        });
    }
}
//提交电子渠道开通信息
function submitElectronicSignInfo() {
    if (zhangArr[2] == undefined) {
        zhangArr[2] = '';
    }
    if (zhangArr[3] == undefined) {
        zhangArr[3] = '';
    }
    if (zhangArr[4] == undefined) {
        zhangArr[4] = '';
    }
    if (Number(eleSignJson.SEC_EPAY_LIMIT.replace(/,/g, '')) > 0) {
        eleSignJson.EPAY_FLAG = '1';
    } else {
        eleSignJson.EPAY_FLAG = '0';
    }
    //alert(eleSignJson.B);
    //alert(eleSignJson.data);
    showLoader("信息提交中...");
    var kaiJson = {
        "b": [{
            "faceRecogn.s": eleSignJson.faceRecogn, //人脸识别
            'offlineOnline.s': commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "moduleId.s": eleSignJson.moduleId,//模块编号
            "tranId.s": eleSignJson.tranId1,//交易编号
            "operatorNo.s": commonJson.adminCount,//操作员
            "deviceNo.s": commonJson.udId,//设备编号
            "fileData.s": eleSignJson.data,
            "orgId.s": commonJson.orgId,
            "VOUCHER_TYPE.s": eleSignJson.mo_VOUCHER_TYPE,
            "ACCT_NO.s": eleSignJson.mo_ACCT_NO,
            "CLIENT_NO.s": eleSignJson.CLIENT_NO,
            "CLIENT_NAME.s": eleSignJson.CLIENT_NAME,
            "SEX.s": eleSignJson.SEX,
            "CR_RATING.s": eleSignJson.CR_RATING,
            "BIRTH_DATE.s": eleSignJson.BIRTH_DATE,
            "MARITAL_STATUS.s": eleSignJson.MARITAL_STATUS,
            "EDUCATION.s": eleSignJson.EDUCATION,
            "CUKWGX.s": eleSignJson.CUKWGX,
            "CUYGID.s": eleSignJson.CUYGID,
            "ORGAN_CODE.s": eleSignJson.ORGAN_CODE,
            "ORG_NAME.s": eleSignJson.ORG_NAME,
            "ACCT_EXEC.s": eleSignJson.ACCT_EXEC,
            "EMPLOYER_NAME.s": eleSignJson.EMPLOYER_NAME,
            "DOCUMENT_TYPE.s": '0',
            "DOCUMENT_ID.s": custermerInfo.cerNO,       //身份证号码
            "NETBANK_NAME.s": eleSignJson.NETBANK_NAME,
            "NETBANK_STATE.s": eleSignJson.NETBANK_STATE,
            //"QUERY_PSWMAIL_NO":,
            //"TRAN_PSWMAIL_NO":,
            "SEARCH_PASSWORD.s": netBankOpenInd == true ? eleSignJson.B : '',
            "EBANK_PASSWORD.s": netBankOpenInd == true ? eleSignJson.C : '',
            "PHONE_NO.s": eleSignJson.PHONE_NO,
            "CLIENT_EMAIL.s": eleSignJson.CLIENT_EMAIL,
            "EPAY_FLAG.s": eleSignJson.EPAY_FLAG,
            "EPAY_LIMIT.s": eleSignJson.EPAY_LIMIT,
            "SIGN_FLAG.s": '1',
            "WAP_FLAG.s": eleSignJson.WAP_FLAG,
            "OLD_WAP_FLAG.s": eleSignJson.OLD_WAP_FLAG,
            "SEC_STATE.s": 'N',
            "SEC_OPRT.s": eleSignJson.SEC_OPRT,
            "SEC_TYPE.s": 'S',
            "SEC_NO.s": eleSignJson.PHONE_NO,
            "SEC_EPAY_LIMIT.s": eleSignJson.SEC_EPAY_LIMIT.replace(/,/g, ''),
            "SEC_TRANSFER_LIMIT.s": eleSignJson.SEC_TRANSFER_LIMIT.replace(/,/g, ''),
            "SEC_WAPTRANSFER_LIMIT.s": eleSignJson.SEC_WAPTRANSFER_LIMIT.replace(/,/g, ''),
            "BussinessCode.s": '01', //身份证联网核查业务编号
            "CheckResult.s": lianwanghechaData.CheckResult, //身份证联网核查结果
            "ReviewUserId.s": lianwanghechaData.ReviewUserId, //远程复核用户ID
            "platGlobalSeq.s": eleSignJson.platGlobalSeq,
            "longitude.s": commonJson.longitude,//客户经理轨迹定位
            "latitude.s": commonJson.latitude//客户经理轨迹定位
        },

            {
                "gua": [{
                    "VOUCHER_TYPE.s": zhangArr[3],
                    "ACCT_NO.s": zhangArr[2],
                    "OPERATE_TYPE.s": zhangArr[4]
                }]
            },
            {
                "msg": [{
                    "OPTION.s": '1',
                    "ACCT_NO.s": eleSignJson.yin_ACCT_NO,//'111111111122',//
                    "PB_TYPE.s": eleSignJson.yin_PB_TYPE,
                    "PAY_CONDITION.s": '0',
                    "OPEN_FLAG.s": eleSignJson.NOTE_OPEN,
                    "OLD_OPEN_STATUS.s": eleSignJson.OLD_OPEN_STATUS,  //biaoshi
                    "FROM_INCEPT_AMT.s": eleSignJson.FROM_INCEPT_AMT.replace(/,/g, ''),
                    "TO_INCEPT_AMT.s": eleSignJson.TO_INCEPT_AMT.replace(/,/g, '')
                }]

            }

        ]
    };
    eleGetSilverNewsSigningFun(kaiJson, function (msg) {
        $('#dianzi-customerConfirm #dz-customerCon-sub').removeClass('btn_next');
        eleGetSilverNewsSigningSucc(msg);
    }, function (err) {
        hideLoader();
        $('#dianzi-customerConfirm #dz-customerCon-sub').removeClass('btn_next');
        //funFail(err);
        err = err.replace(new RegExp("\\.[s]+\"", "g"), "\"");
        var responseObj = JSON.parse(err);
        var responseCode = responseObj.b[0].error[0];
        var errMsg = $.trim(responseCode.message).toUpperCase();
        if (errMsg == 'THE REQUEST TIMED OUT' || errMsg == 'A CONNECTION FAILURE OCCURRED') {//全部改成大写即可捕获
            responseCode.message = '业务处理超时!';
            showTags({
                'title': '提示',
                'content': responseCode.message,
                'ok': {
                    'title': '继续处理',
                    fun: function () {
                        setTimeout(function(){
                            eleGetSilverNewsSigningFail();
                        },300);
                    }
                }
            });
        } else {
            changeUploadStatus("03", eleSignJson.phoneTime, eleSignJson.signTime);
            showTags({
                'content': responseCode.message, //必输
                'ok': {}

            })
        }
    });
}

//影像签名压缩入库
//callback - 插入数据库完成后触发的回调方法
function eleImsgAuthUpload(callback){
    showLoader("影像压缩中...");
    // 事件发布执行回调方法前，取订事件，避免重复发布
    var ussbCallback = function(){
        topicUtil.unsubscribe("eleAuth/eleImsgAuthUpload");
        hideLoader();
        callback();
    };
    topicUtil.subscribe("eleAuth/eleImsgAuthUpload", ussbCallback);
    var compressCount = 0;  //压缩成功次数,为2时完成压缩
    var phoneTime = myTime.CurTime();
    var signTime = phoneTime + 1;
    eleSignJson.phoneTime = phoneTime;
    eleSignJson.signTime = signTime;
    //影像上传文件打包压缩插件
    Meap.zipCompression(eleSignJson.platGlobalSeq + 'image', eleSignJson.picFileARR, function (msg) {
        //将要上传的影像插入到ios断点上传的数据库中
        //影像上传 业务参数
        var appBus = {
            'busiGloablaSeq': eleSignJson.platGlobalSeq,//业务编号
            'attchType': '2',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
            'deviceNo': eleSignJson.udId,//设备编号
            'moduleId': eleSignJson.moduleId,//模块编号
            'tranId': eleSignJson.tranId,//交易编号
            'orgId': commonJson.orgId,//机构编号
            'operatorNo': commonJson.adminCount,//操作员
            'custName': custermerInfo.name,//客户名称
            'custCredType': '0',//客户证件类型
            'custCredNo': custermerInfo.cerNO,//客户证件号
            'offlineOnline': commonJson.offlineOnline,//脱机/联机
            'workAddress': commonJson.workAddress//工作地址
        };
        appBus = JSON.stringify(appBus);
        var sendDataJson = {
            "databaseName": "myDatabase",
            "tableName": "up_download_info",
            "data": [{
                "fileToken": phoneTime,//文件唯一ID(可以为时间挫
                "pos": "0",//文件的断点信息(初始为0)
                "filePath": msg,//文件路径
                "appPath": "e002",//自定义文件路径
                "appBuss": appBus,//业务参数
                "downloadToken": "",//文件的下载ID(初始为空)
                "leng": "1",//文件的长度(初始为1)
                "isNotice": "yes", //是否调用后台(一直是yes)
                "fileType": "0",
                "REMARK1": "01" //上传状态01-默认
            }]
        };
        insertTableData(sendDataJson, function (msg) {
            if(++compressCount == 2){
                topicUtil.publish("eleAuth/eleImsgAuthUpload");
            }
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
            'content': '影像压缩失败',
            'ok': {}
        });
    });
    //签名base64转路径
    Meap.transFormImage(eleSignJson.platGlobalSeq + 'sign', eleSignJson.data, 'picSty', function (msg) {
        //将要上传的签名插入到ios断点上传的数据库中
        //签名上传 业务参数
        var appBus = {
            'busiGloablaSeq': eleSignJson.platGlobalSeq,//业务编号
            'attchType': '1',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
            'deviceNo': eleSignJson.udId,//设备编号
            'moduleId': eleSignJson.moduleId,//模块编号
            'tranId': eleSignJson.tranId,//交易编号
            'orgId': eleSignJson.orgId,//机构编号
            'operatorNo': commonJson.adminCount,//操作员
            'custName': custermerInfo.name,//客户名称
            'custCredType': '0',//客户证件类型
            'custCredNo': custermerInfo.cerNO,//客户证件号
            'offlineOnline': commonJson.offlineOnline,//脱机/联机
            'workAddress': commonJson.workAddress//工作地址
        };
        appBus = JSON.stringify(appBus);
        var sendDataJson = {
            'databaseName': 'myDatabase',
            'tableName': 'up_download_info',
            'data': [{
                'fileToken': signTime,//文件唯一ID(可以为时间挫
                'pos': '0',//文件的断点信息(初始为0)
                'filePath': msg,//文件路径
                'appPath': 'e001',//自定义文件路径
                'appBuss': appBus,//业务参数
                'downloadToken': '',//文件的下载ID(初始为空)
                'leng': '1',//文件的长度(初始为1)
                'isNotice': 'yes', //是否调用后台(一直是yes)
                "fileType": "1",
                "REMARK1": "01" //上传状态01-默认
            }]
        };
        insertTableData(sendDataJson, function (msg) {
            if(++compressCount == 2){
                topicUtil.publish("eleAuth/eleImsgAuthUpload");
            }
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
}

//提交电子渠道开通信息超时处理
function eleGetSilverNewsSigningFail(){
    eleSignJson.userSign = true;   //开通情况界面 显示用户名字段
    // Meap.zipCompression(eleSignJson.platGlobalSeq + 'image', eleSignJson.picFileARR, function (msg) {
    //     var phoneTime = myTime.CurTime();
    //     var signTime = phoneTime + 1;
    //     //将要上传的影像插入到ios断点上传的数据库中
    //     //影像上传 业务参数
    //     var appBus = {
    //         'busiGloablaSeq': eleSignJson.platGlobalSeq,//业务编号
    //         'attchType': '2',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
    //         'deviceNo': eleSignJson.udId,//设备编号
    //         'moduleId': eleSignJson.moduleId,//模块编号
    //         'tranId': eleSignJson.tranId,//交易编号
    //         'orgId': commonJson.orgId,//机构编号
    //         'operatorNo': commonJson.adminCount,//操作员
    //         'custName': custermerInfo.name,//客户名称
    //         'custCredType': '0',//客户证件类型
    //         'custCredNo': custermerInfo.cerNO,//客户证件号
    //         'offlineOnline': commonJson.offlineOnline,//脱机/联机
    //         'workAddress': commonJson.workAddress//工作地址
    //     };
    //     appBus = JSON.stringify(appBus);
    //     var sendDataJson = {
    //         "databaseName": "myDatabase",
    //         "tableName": "up_download_info",
    //         "data": [{
    //             "fileToken": phoneTime,//文件唯一ID(可以为时间挫
    //             "pos": "0",//文件的断点信息(初始为0)
    //             "filePath": msg,//文件路径
    //             "appPath": "e002",//自定义文件路径
    //             "appBuss": appBus,//业务参数
    //             "downloadToken": "",//文件的下载ID(初始为空)
    //             "leng": "1",//文件的长度(初始为1)
    //             "isNotice": "yes", //是否调用后台(一直是yes)
    //             "fileType": "0"
    //         }]
    //     };
    //     insertTableData(sendDataJson, function (msg) {
    //     }, function (err) {
    //         showTags({
    //             'title': '提示',
    //             'content': '插入数据库失败',
    //             'ok': {}
    //         });
    //     });
    // }, function (err) {

    // });
    // //签名base64转路径
    // Meap.transFormImage(eleSignJson.platGlobalSeq + 'sign', eleSignJson.data, 'picSty', function (msg) {
    //     //将要上传的签名插入到ios断点上传的数据库中
    //     //签名上传 业务参数
    //     var appBus = {
    //         'busiGloablaSeq': eleSignJson.platGlobalSeq,//业务编号
    //         'attchType': '1',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
    //         'deviceNo': eleSignJson.udId,//设备编号
    //         'moduleId': eleSignJson.moduleId,//模块编号
    //         'tranId': eleSignJson.tranId,//交易编号
    //         'orgId': eleSignJson.orgId,//机构编号
    //         'operatorNo': commonJson.adminCount,//操作员
    //         'custName': custermerInfo.name,//客户名称
    //         'custCredType': '0',//客户证件类型
    //         'custCredNo': custermerInfo.cerNO,//客户证件号
    //         'offlineOnline': commonJson.offlineOnline,//脱机/联机
    //         'workAddress': commonJson.workAddress//工作地址
    //     };
    //     appBus = JSON.stringify(appBus);
    //     var sendDataJson = {
    //         'databaseName': 'myDatabase',
    //         'tableName': 'up_download_info',
    //         'data': [{
    //             'fileToken': signTime,//文件唯一ID(可以为时间挫
    //             'pos': '0',//文件的断点信息(初始为0)
    //             'filePath': msg,//文件路径
    //             'appPath': 'e001',//自定义文件路径
    //             'appBuss': appBus,//业务参数
    //             'downloadToken': '',//文件的下载ID(初始为空)
    //             'leng': '1',//文件的长度(初始为1)
    //             'isNotice': 'yes',//是否调用后台(一直是yes)
    //             "fileType": "1"
    //         }]
    //     };
    //     insertTableData(sendDataJson, function (msg) {
    //     }, function (err) {
    //         showTags({
    //             'title': '提示',
    //             'content': '插入数据库失败',
    //             'ok': {}
    //         });
    //     });
    // }, function (err) {
    //     alert('失败回调' + err);

    // });
    changeUploadStatus("02", eleSignJson.phoneTime, eleSignJson.signTime);
    $.mobile.changePage('dianzi-readingID.html');
}

//电子签约影像上传成功
function eleSignMediaUploadSucc(msg) {
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00') {
        $.mobile.changePage('dianzi-complete.html');
    } else {
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}
//电话银行外呼 成功回调
function IAskTelPhPwdServiceEleSignSucc(msg) {
    //alert(msg);
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (eleSignJson.telBankSet == false) {
//      eleSignJson.telBankSet = true;
        return;
    }
    if (responseCode[0].results == '00') {
        eleSignJson.SEQNUM = responseCode[1].pwdRecVO[0].SEQ_NUM;
        //发起电话银行
        var sendJson = {
            "b": [{
                'offlineOnline.s': commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": eleSignJson.moduleId,//模块编号
                "tranId.s": eleSignJson.tranId1,//交易编号
                "operatorNo.s": commonJson.adminCount,//操作员
                "deviceNo.s": commonJson.udId,//设备编号
                "orgId.s": commonJson.orgId,
                "SEQ_NUM.s": eleSignJson.SEQNUM
            }]
        };
        IAskTelPhPwdServiceGFun(sendJson, function (msg) {
            IAskTelPhPwdServiceEleSignGSucc(msg);
        }, function (err) {
            eleSignJson.telBankSet = false;
            hideLoader();
            funFail(err);
        });
    } else if (responseCode[0].results == '08') {
        hideLoader();
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": eleSignJson.moduleId, //模块编号
                "tranId.s": eleSignJson.tranId1, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "orgId.s": commonJson.orgId,
                "PAITYPE.s": eleSignJson.PAITYPE,//密码类型
                "DOCUMENT_ID.s": custermerInfo.cerNO, //身份证号
                //"ACCT_NO.s": eleSignJson.mo_ACCT_NO, //卡账号
                "CLIENT_ID.s": eleSignJson.CLIENT_NO, //客户号
                "PHONE_NUMBER.s": eleSignJson.PHONE_NO,//电话号码eleSignJson.PHONE_NO
                "BUSI_TYPE.s": '02'
            }]
        };
        IAskTelPhPwdServiceFun(sendJson, function (msg) {
            IAskTelPhPwdServiceEleSignSucc(msg);
        }, function (err) {
            eleSignJson.telBankSet = false;
            hideLoader();
            funFail(err);
        });
    } else {
        eleSignJson.telBankSet = false;
        hideLoader();
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}
//电话银行获取密码 成功回调
function IAskTelPhPwdServiceEleSignGSucc(msg) {
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (eleSignJson.telBankSet == false) {
        //eleSignJson.telBankSet=true;
        return;
    }
    if (responseCode[0].results == '00') {
        if (!responseCode[0].message) {
            setTimeout(function () {
                var sendJson = {
                    "b": [{
                        'offlineOnline.s': commonJson.offlineOnline,//脱机/联机
                        "workAddress.s": commonJson.workAddress,//工作地址
                        "moduleId.s": eleSignJson.moduleId,//模块编号
                        "tranId.s": eleSignJson.tranId1,//交易编号
                        "operatorNo.s": commonJson.adminCount,//操作员
                        "deviceNo.s": commonJson.udId,//设备编号
                        "orgId.s": commonJson.orgId,
                        "SEQ_NUM.s": eleSignJson.SEQNUM
                    }]
                };
                IAskTelPhPwdServiceGFun(sendJson, function (msg) {
                    IAskTelPhPwdServiceEleSignGSucc(msg);
                }, function (err) {
                    funFail(err);
                    hideLoader();
                });
            }, 5000);
        } else if (responseCode[0].B || responseCode[0].C) {
            if (eleSignJson.PAITYPE == 'B') {
                eleSignJson.B = responseCode[0].B;
            } else if (eleSignJson.PAITYPE == 'C') {
                eleSignJson.C = responseCode[0].C;
            } else if (eleSignJson.PAITYPE == 'BC') {
                eleSignJson.B = responseCode[0].B;
                eleSignJson.C = responseCode[0].C;
            }
            //alert(eleSignJson.B+'he'+eleSignJson.C);
            hideLoader();
            showTags({
                'title': '提示',
                'content': '客户密码设置成功!',
                'ok': {
                    title: '继续',
                    fun: function () {
                        $.mobile.changePage('dianzi-agreement.html');
                    }
                }
            });
        }
    } else {
        eleSignJson.telBankSet = false;
        hideLoader();
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}

//影像对比成功回调
function getPhotoCompareEleSignSucc(msg) {
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00') {
        //缓存虚拟卡影像资料
        eleSignJson.imageInfo = {
            "custFacePic": $('#dianzi-customerP .camera-pic:eq(0)').attr('src'),
            "custAndCustOwnerPic": $('#dianzi-customerP .camera-pic:eq(1)').attr('src'),
            "custAuthPic": $('#dianzi-customerP .camera-pic:eq(2)').attr('src'), //抄录内容照片
            "frontIDCardPic": $('#dianzi-customerP .camera-pic:eq(3)').attr('src'),
            "backIDCardPic": $('#dianzi-customerP .camera-pic:eq(4)').attr('src')
        };
        custermerInfo.custAndCustOwnerPic = $('#dianzi-customerP .camera-pic:eq(1)').attr('src');//与客户合影照片
        custermerInfo.frontIDCardPic = $('#dianzi-customerP .camera-pic:eq(3)').attr('src');//身份证正面
        custermerInfo.backIDCardPic = $('#dianzi-customerP .camera-pic:eq(4)').attr('src');//身份证反面
        //cacheCustermerInfo('信通电子卡');//测试代码
        $.mobile.changePage('dianzi-customerConfirm.html');
    } else if (responseCode[0].results == "08") {
        hideLoader();
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    } else {
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {
                fun: function () {
                    $.mobile.changePage('personFace.html', {reverse: true});
                }
            }
        });
    }

}


function cacheEleSignCustermerInfo(YWType) {
    var businessType = YWType;//业务类型
    var submitTime = myTime.CurTime();//获取当前时间
    var custAndCustOwnerPicBase64 = '';//与客户合影照片
    var frontIDCardPicBase64 = '';//身份证正面
    var backIDCardPicBase64 = '';//身份证反面
    //与客户合影照片转base6
    transFormBase64(custermerInfo.custAndCustOwnerPic, function (msg1) {
        custAndCustOwnerPicBase64 = msg1;
        //身份证正面转base64
        transFormBase64(custermerInfo.frontIDCardPic, function (msg2) {
            frontIDCardPicBase64 = msg2;
            //身份证反面转base64
            transFormBase64(custermerInfo.backIDCardPic, function (msg3) {
                backIDCardPicBase64 = msg3;
                var sendDataJson = {
                    "databaseName": "myDatabase",
                    "tableName": "customer_info",
                    "data": [{
                        "ADMINCOUNT": custermerInfo.operatorNo,//登陆账号
                        "SUBMITTIME": submitTime,//提交时间
                        "BUSINESSTYPE": businessType,//业务类型
                        "NATION": custermerInfo.nation,//民族
                        "CERTNUM": custermerInfo.cerNO,//身份证号码
                        "ADDRESS": custermerInfo.address,//地址
                        "MASCARDNAME": custermerInfo.name,//姓名
                        "CERTVALIDDATE": custermerInfo.cerExpdDt,//有效日期
                        "BIRTH": custermerInfo.birthday,//出生日期
                        "SEX": custermerInfo.sex,//性别
                        "ISSAUTHORITY": custermerInfo.issAuthority,//签发机关
                        "IMAGE": custermerInfo.image,//身份证头像图片
                        "CUSTANDCUSTOWNERPIC": custAndCustOwnerPicBase64,//与客户合影照片
                        "FRONTIDCARDPIC": frontIDCardPicBase64,//身份证正面
                        "BACKIDCARDPIC": backIDCardPicBase64//身份证反面
                    }]

                };
                insertTableData(sendDataJson, function (msg) {
                }, function (err) {
                    showMsg('存储个人信息失败' + msg);
                });
            }, function (err) {
                showMsg('与客户合影照片转base64失败');
            })
        }, function (err) {
            showMsg('身份证正面转base64失败');

        })
    }, function (err) {
        showMsg('身份证反面转base64失败');
    })

}


//查询影像复用全部个人信息
function queryAllcacheCustermereleSignInfo() {
    queryTableDataByConditions({
        "databaseName": "myDatabase",  //数据库名
        "tableName": "customer_info"//表名
    }, function (msg) {
        queryAllcacheCustermerInfoeleSignSucc(msg);
    }, function (err) {
        funDataFail(err);
    });
}
//查询全部个人信息 成功回调
function queryAllcacheCustermerInfoeleSignSucc(msg) {
    var textHtml = '';
    if (msg.length) {
        var nowTime = myTime.CurTime();//当前时间戳
        var delArr = [];//记录要删除的图片
        $.each(msg.reverse(), function (index, el) {
            if (myTime.dateLessHour(el.SUBMITTIME, nowTime) && custermerInfo.operatorNo == el.ADMINCOUNT && index < 5) {//是否小与一小时 true小于
                textHtml += '<li class="box-rows" cerNo="' + el.CERTNUM + '" submitTime="' + el.SUBMITTIME + '">' +
                '<div>身份证</div>' +
                '<div>' + el.CERTNUM + '</div>' +
                '<div>' + el.MASCARDNAME + '</div>' +
                '<div>' + el.BUSINESSTYPE + '</div>' +
                '<div>' + myTime.UnixToDate(el.SUBMITTIME) + '</div>' +
                '</li>';
            } else {//不小于1小时 则删除数据库中的数据
                if (custermerInfo.operatorNo == el.ADMINCOUNT) {//只删除当前操作员名下的数据
                    delArr.push(el.CUSTANDCUSTOWNERPIC, el.FRONTIDCARDPIC, el.BACKIDCARDPIC);
                    //删除表里内容 根据条件删除
                    deleteTableData({
                        "databaseName": "myDatabase",
                        "tableName": "customer_info",
                        "conditions": [{
                            "SUBMITTIME": el.SUBMITTIME //提交时间
                        }]
                    }, function (msg) {
                        //alert('删除数据库成功'+msg);
                    }, function (err) {
                        //alert('删除数据库失败'+err);
                    })
                }
            }
        });
        if (delArr.length > 0) {
            deletePhoto(delArr, function (msg) {
                // msg=='删除成功'
                //alert('删除本地图片成功'+msg);
            }, function (err) {
                // err=='删除失败'
                //alert('删除本地图片失败'+err)

            })
        }
        //为每一条数据添加class=‘click'
        $(".box-content").on('tap', function (ev) {
            var oTarget = ev.target;
            _this = $(oTarget).closest('.box-rows');
            $(_this).addClass('click').siblings().removeClass('click');
            $('#btn_next').addClass('btn_next');
            commonJson.submitTime = $(_this).attr("submitTime");//存储复用的数据的提交时间 作为删除使用
            //从数据库里查询 当前复用的个人信息
            queryTableDataByConditions({
                "databaseName": "myDatabase",  //数据库名
                "tableName": "customer_info",//表名
                "conditions": {
                    "SUBMITTIME": "between " + commonJson.submitTime + " and " + commonJson.submitTime
                }
            }, function (msg) {
                custermerInfo.nation = msg[0].NATION;//民族
                custermerInfo.cerNO = msg[0].CERTNUM;//身份证号码
                custermerInfo.address = msg[0].ADDRESS;//地址
                custermerInfo.name = msg[0].MASCARDNAME;//姓名
                custermerInfo.cerExpdDt = msg[0].CERTVALIDDATE;//有效日期
                custermerInfo.birthday = msg[0].BIRTH;//出生日期
                custermerInfo.sex = msg[0].SEX;//性别
                custermerInfo.issAuthority = msg[0].ISSAUTHORITY;//签发机关
                custermerInfo.image = msg[0].IMAGE;//身份证头像图片
                custermerInfo.custAndCustOwnerPic = msg[0].CUSTANDCUSTOWNERPIC;//与客户合影照片
                custermerInfo.frontIDCardPic = msg[0].FRONTIDCARDPIC;//身份证正面
                custermerInfo.backIDCardPic = msg[0].BACKIDCARDPIC;//身份证反面

            }, function (err) {
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

function IFacelRecognitionServiceeleSignSucc(msg) {
    //alert(msg);
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '0') {
        $('#personFace .previous:last').addClass('btn_next');
        eleSignJson.platGlobalSeqP = responseCode[0].platGlobalSeq; //流水号
        eleSignJson.cardResult = responseCode[1].photoCompareVO[0].CARD_RESULT; //联网核查结果
        eleSignJson.chipResult = responseCode[1].photoCompareVO[0].CHIP_RESULT; //芯片结果
        if (responseCode[1].photoCompareVO[0].CHIP_RESULT == "0") { //芯片通过
            $("#personFace .face-result:eq(0)").text('通过');
        } else {
            $("#personFace .face-result:eq(0)").addClass('no-pass').text('未通过');
        }
        if (responseCode[1].photoCompareVO[0].CARD_RESULT == "0") { //联网核查通过
            $("#personFace .face-result:eq(1)").text('通过');
        } else {
            $("#personFace .face-result:eq(1)").addClass('no-pass').text('未通过');
        }
        if (responseCode[1].photoCompareVO[0].CHIP_RESULT == "0" && responseCode[1].photoCompareVO[0].CARD_RESULT == "0") {
            eleSignJson.isTelCheck = true; //远程复核成功
            eleSignJson.faceRecogn = '1'; //自动通过
            $("#personFace .center-header").text('人脸识别通过！');
            $("#dianzi-managerList").hide();
        } else {
            eleSignJson.faceRecogn = '2'; //自动不通过
            $("#personFace .center-header").text('人脸识别未通过！');
            $('#personFace .previous:last').text('远程复核');
        }
    } else if (responseCode[0].results == '08') {
        //影像两两对比
        hideLoader();
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "orgId.s": commonJson.orgId,//机构号
                "moduleId.s": eleSignJson.moduleId,//模块编号
                "tranId.s": eleSignJson.tranId1,//交易编号
                "operatorNo.s": commonJson.adminCount,//操作员
                "deviceNo.s": commonJson.udId,//设备编号
                "OPERATOR_NO.s": commonJson.adminCount, //业务经办人工号
                "TRANS_SCENE.s": "0007",  //交易场景
                "COMPARE_TYPE.s": "2",  //    比对类型1-客户经理比对，2-客户比对
                "WS_TYPE.s": "2",  // 终端类型1-PC，2-IOS，3-Android
                "WSNO.s": commonJson.udId,  //    终端号
                "VERSION.s": "v1.1.4",  //当前控件版本
                "TRANS_CHANNEL.s": "301",  //   渠道301
                "ID_CARD.s": custermerInfo.cerNO,  // 身份证号码
                "IMG_BASE.s": eleSignJson.faceBase64,  //      现场照片
                "CRYPT_TYPE.s": "0",  //   图像是否经过加密0-未加密，1-加密方式一，2加密方式二
                "ID_IMG_BASE.s": eleSignJson.lianPic,  //联网核查照片
                "CARD_IMG_BASE.s": eleSignJson.imageBase64,  //  芯片照片
                "BUSI_TYPE.s": "10"  //  电子渠道“10”

            }]
        };
        ifacelRecognitionSeFun(sendJson, function (msg) {
            IFacelRecognitionServiceeleSignSucc(msg);
        }, function (err) {
            eleSignJson.faceRecogn = '2'; //自动不通过
            $("#personFace .face-result").addClass('no-pass').text('未通过');
            $("#personFace .center-header").text('人脸识别未通过！');
            $('#personFace .previous:last').addClass('btn_next');
            $('#personFace .previous:last').text('远程复核');
            funFail(err);
        })
    } else {
        eleSignJson.faceRecogn = '2'; //自动不通过
        $("#personFace .face-result").addClass('no-pass').text('未通过');
        $("#personFace .center-header").text('人脸识别未通过！');
        $('#personFace .previous:last').addClass('btn_next');
        $('#personFace .previous:last').text('远程复核');
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}

/*远程复核获取客户经理列表*/
function ISysUserServiceManListeleSignSucc(msg) {
    //alert(msg);
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00') {
        var textHtml = '<option></option>';
        //onlineFlag
        $.each(responseCode[1].TsReviewerVOs, function (index, el) {
            //if(index == 0) return;
            if (el.sysUserVO[0].onlineFlag != "1") return;
            textHtml += '<option realName="' + el.sysUserVO[0].realName + '" cellPhone="' + el.sysUserVO[0].cellPhone + '" value="' + el.sysUserVO[0].userId + '">' + el.sysUserVO[0].userId + el.sysUserVO[0].realName + '</option>';
        });
        $('#dianzi-managerList select').html(textHtml).selectmenu('refresh');
    } else if (responseCode[0].results == '08') {
        $('#dianzi-managerList select').html('<option></option>').selectmenu('refresh');
    }
    else {
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
        $('#dianzi-managerList select').html('<option></option>').selectmenu('refresh');
    }
}

/*电子签约远程复核请求  成功回调*/
function iissuesServiceeleSignSucc(msg) {
    //hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00' || responseCode[0].results == '66') {
        eleSignJson.tsReviewId = responseCode[0].tsReviewId;
        $(".ui-loader").append('<div id="loaderCancel" style="width:300px; height:40px; line-height:40px; text-align:center; border:1px solid #FFFFFF; position:absolute; bottom:220px; left:50%; margin-left:-150px;color: #FFFFFF;">放弃<span id="time-daojishi"></span></div>');
        var timeout = new Timeout('loaderCancel', 15);
        timeout.blocking('time-daojishi');//spanid:延迟过程中显示ID
        localStorage.intervalID = timeout.getIntervalID();
        $("#loaderCancel").off('click').on('click', function () {
            eleSignJson.telCheck = false;
            hideLoader();
            var badSendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "orgId.s": commonJson.orgId,//机构号
                    "moduleId.s": eleSignJson.moduleId,//模块编号
                    "tranId.s": eleSignJson.tranId1,//交易编号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "deviceNo.s": commonJson.udId,//设备编号
                    "tsReviewId.s": eleSignJson.tsReviewId
                }]
            };
            iphotoServiceStopFun(badSendJson, function (msg) {

            }, function (err) {

            });
            setTimeout(function () {
                hideLoader();
            }, 3500)
        });
        var sendJson = {
            "b": [{
                "deviceNo.s": commonJson.udId,//设备编号
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "orgId.s": commonJson.orgId,//机构号
                "moduleId.s": eleSignJson.moduleId,//模块编号
                "tranId.s": eleSignJson.tranId1,//交易编号
                "operatorNo.s": commonJson.adminCount,//操作员
                "tsReviewId.s": eleSignJson.tsReviewId,
                "userIds.s": $('#dianzi-managerList select').val()  //用户ID
            }]
        };
        getTsRevieweleSignFun(sendJson, function (msg) {
            getTsRevieweleSignSucc(msg);
        }, function (err) {
            funFail(err);
        })
    } else {
        hideLoader();
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}

/*远程复核查询  成功回调*/
function getTsRevieweleSignSucc(msg) {
    //hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (eleSignJson.telCheck == false) return;
    if (responseCode[0].results == '00') {
        if (responseCode[0].status == '5') {
            hideLoader();
            showTags({
                'title': '提示',
                'content': '远程复核通过！',
                'ok': {
                    fun: function () {
                        eleSignJson.isTelCheck = true; //远程复核成功
                        eleSignJson.faceRecogn = '3';
                        $.mobile.changePage('dianzi-customerConfirm.html');
                        lianwanghechaData.ReviewUserId = $('#dianzi-managerList select').val();
                    }
                }
            });
            clearInterval(localStorage.intervalID);
        } else if (responseCode[0].status == '2' || responseCode[0].status == '3') {
            setTimeout(function () {
                var sendJson = {
                    "b": [{
                        "deviceNo.s": commonJson.udId,//设备编号
                        "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                        "workAddress.s": commonJson.workAddress,//工作地址
                        "orgId.s": commonJson.orgId,//机构号
                        "moduleId.s": eleSignJson.moduleId,//模块编号
                        "tranId.s": eleSignJson.tranId1,//交易编号
                        "operatorNo.s": commonJson.adminCount,//操作员
                        "tsReviewId.s": eleSignJson.tsReviewId,
                        "userIds.s": $('#dianzi-managerList select').val()  //用户ID
                    }]
                };
                getTsRevieweleSignFun(sendJson, function (msg) {
                    getTsRevieweleSignSucc(msg);
                }, function (err) {
                    funFail(err);
                });
            }, 5000);

        } else {
            hideLoader();
            eleSignJson.faceRecogn = '4'; //远程复核不通过
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {}
            });
            clearInterval(localStorage.intervalID);
        }
    }
    else {
        hideLoader();
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}
