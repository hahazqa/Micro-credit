/**
 * Created by lei on 2/22/16.
 */
//插入本地数据库  成功回调
function loanProductInfoServiceInsert(sendDataJsonItem, dataNum) {
    sendDataJsonItem[dataNum].loanProductVO[0].PRO_PROTOCOL = sendDataJsonItem[dataNum].loanProductVO[0].PRO_PROTOCOL.replace(/\'/g, ";;;a;&nbsp;a;;;");
    var sendDataJson = {
        "databaseName": "myDatabase",
        "tableName": "loanproductlist_info",
        "data": [{
            "PRO_DESC": sendDataJsonItem[dataNum].loanProductVO[0].PRO_DESC,
            "PRO_ATTACH": sendDataJsonItem[dataNum].loanProductVO[0].PRO_ATTACH,
            "PRO_REMARK1": sendDataJsonItem[dataNum].loanProductVO[0].PRO_REMARK1,
            "PRO_PROTOCOL": sendDataJsonItem[dataNum].loanProductVO[0].PRO_PROTOCOL,
            "PRO_CODE": sendDataJsonItem[dataNum].loanProductVO[0].PRO_CODE,
            "PRO_NAME": sendDataJsonItem[dataNum].loanProductVO[0].PRO_NAME,
            "REMARK1": sendDataJsonItem[dataNum].loanProductVO[0].PRO_TYPE   //营销产品
        }]
    };
    insertTableData(sendDataJson, function (msg) {
        dataNum++;
        if (dataNum == sendDataJsonItem.length) return;
        loanProductInfoServiceInsert(sendDataJsonItem, dataNum);
    }, function (err) {
        alert('失败' + msg);

    });
}

function loanproductlistInfoServiceDataSucc(msg) {
    var textHtml = '';
    if(msg !=''){
        hideLoader();
        $.each(msg, function (index, el) {
            var imgUrl = base64decode(el.PRO_ATTACH);
            textHtml += '<div class="product_box">' +
                '<img src="data:image/png;base64,' + imgUrl + '" proREMARK1="' + el.PRO_REMARK1 + '" class="product_img">' +
                '<div class="product_content">' +
                '<div class="product_register" proType="' + el.REMARK1 + '" proCODE="' + el.PRO_CODE + '" proTOCOL="' + el.PRO_PROTOCOL + '">立即申请</div>' +
                '<p class="product_title">' + el.PRO_NAME + '</p>' +
                '<div class="product_Intro">' + el.PRO_DESC + '</div>' +
                '</div>' +
                '</div>'
        });
        $('#loan-product .conter-auto').html(textHtml);
        $('#loan-product .product_register').on('click', function () {
            if(commonJson.losUserId ==''){
                showTags({
                    'title': '提示',
                    'content': '没有LOS用户号,无法办理贷款业务!',
                    'ok': {
                        fun: function () {
                            $.mobile.changePage('../main.html');
                        }
                    }
                });
            }else{
                loan.applicationObj.proCODE = $(this).attr("proCODE"); //卡产品代码
                loan.applicationObj.proType = $(this).attr("proType"); //营销产品
                $.mobile.changePage('loan-reading.html');
            }

        });
        //营销话术
        $('#loan-product .product_img').on('taphold', function () {
            productTapHold($(this));
        });
        $("#loan-product").on('tap', function (ev) {
            var oTarget = ev.target;
            if ($(oTarget).closest('.product_img').length || $(oTarget).closest('.product_img_msg').length) {

            } else {
                $(".product_img_msg").remove();
            }
        })
    }else{
        var sendJson = {
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress//工作地址
            }]
        };
        getLoanProductListConF(sendJson);
    }
}

function mgInfo(mgObj) {
    mgObj.isTrue = true;  //存在
    mgObj.nation = custermerInfo.nation;
    mgObj.cerNO = custermerInfo.cerNO;
    mgObj.address = custermerInfo.address;
    mgObj.name = custermerInfo.name;
    mgObj.cerExpdDt = custermerInfo.cerExpdDt;
    mgObj.birthday = custermerInfo.birthday;
    mgObj.sex = custermerInfo.sex;
    mgObj.issAuthority = custermerInfo.issAuthority;
    mgObj.image = custermerInfo.image;   //身份证照片
    mgObj.lianPic = custermerInfo.checkPhoto;  //联网核查照片
    mgObj.isCustermerInfoMultiplex = false;     //默认情况下是没有影响复用的
    mgObj.CheckResult = lianwanghechaData.CheckResult;  //联网核查的状态
    if (mgObj.MGCompareFace) {
        mgObj.MGCompareFace = true;
    } else {
        mgObj.MGCompareFace = false;  //默认情况下 没有进行人脸对比
    }
}

/*资料清单*/
function findDataListFun(maritalStatus, isCoborrower) {

    var sqwc = '<img src="../../images/ic_sqwc.png" alt=""/></li>'; //存在
    var yuan = '<img src="../../images/ic_yuan.png" alt=""/></li>'; //不存在
    var huKouBo = '<li><span>主申请人户口簿</span>';
    var canBaoZM = '<li><span>主申请人参保证明</span>';
    var shouRuZM = '<li><span>主申请人工作收入证明</span>';
    var fHukoubo = '<li><span>主申请人（夫妻）户口簿</span>';
    var hunYinZM = '<li><span>主申请人婚姻证明</span>';
    var ziChanZM = '<li><span>主申请人资产证明</span>';
    var oIDCard = '<li><span>配偶身份证件（正反面）</span>';
    var oShouRuZM = '<li><span>配偶工作收入证明</span>';
    //条件  ①一手商铺按揭 ②婚姻状况 ③配偶做共同申请人
    var mPicFileMsgType = (loan.applicationObj.mPicFileMsgType == undefined ? '' : loan.applicationObj.mPicFileMsgType);
    var gPicFileMsgType = (loan.applicationObj.gPicFileMsgType == undefined ? '' : loan.applicationObj.gPicFileMsgType);
    var gPicArr = (loan.applicationObj.gPicFileARR == undefined ? '' : loan.applicationObj.gPicFileARR.join("&&"));
    var mPicArr = (loan.applicationObj.mPicFileARR == undefined ? '' : loan.applicationObj.mPicFileARR.join("&&"));
    if(loan.mInfo.isTrue){
        if(mPicArr.indexOf('frontIDCardMPic') != -1 && mPicArr.indexOf('backIDCardMPic') != -1 ){
            var textHtml = '<li><span>主申请人身份证件(正反面)</span><img src="../../images/ic_sqwc.png" alt=""/></li>';
        }else{
            var textHtml = '<li><span>主申请人身份证件(正反面)</span><img src="../../images/ic_yuan.png" alt=""/></li>';
        }
    }
    if (loan.applicationObj.proCODE == '401001010') {//一手楼按揭
        if (maritalStatus == '10' || maritalStatus == '22' || maritalStatus == '30') {  //婚姻状况 未婚
            if (mPicFileMsgType.indexOf('hukoubuPic') != -1) {
                textHtml += huKouBo + sqwc;
            } else {
                textHtml += huKouBo + yuan;
            }
            if (mPicFileMsgType.indexOf('canbaozhengming') != -1) {
                textHtml += canBaoZM + sqwc;
            } else {
                textHtml += canBaoZM + yuan;
            }
            if (mPicFileMsgType.indexOf('shouruzhengmingM') != -1) {
                textHtml += shouRuZM + sqwc;
            } else {
                if(loan.dzd !=''){
                    textHtml += shouRuZM + sqwc;
                }else{
                    textHtml += shouRuZM + yuan;
                }
            }
        } else if (maritalStatus == '20' || maritalStatus == '21' || maritalStatus == '40' || maritalStatus == '23') { //已婚 (已婚无子女、已婚有子女、复婚、再婚、)
            if (isCoborrower == '0') {  //配偶不做共同是申请人
                if (mPicFileMsgType.indexOf('hukoubuPic') != -1) {
                    textHtml += fHukoubo + sqwc;
                } else {
                    textHtml += fHukoubo + yuan;
                }
                if (mPicFileMsgType.indexOf('marryzhengming') != -1) {
                    textHtml += hunYinZM + sqwc;
                } else {
                    textHtml += hunYinZM + yuan;
                }
                if (mPicFileMsgType.indexOf('canbaozhengming') != -1) {
                    textHtml += canBaoZM + sqwc;
                } else {
                    textHtml += canBaoZM + yuan;
                }
                if (mPicFileMsgType.indexOf('shouruzhengmingM') != -1) {
                    textHtml += shouRuZM + sqwc;
                } else {
                    if(loan.dzd !=''){
                        textHtml += shouRuZM + sqwc;
                    }else{
                        textHtml += shouRuZM + yuan;
                    }
                }
                if (mPicFileMsgType.indexOf('zichanzhengmingM') != -1) {
                    textHtml += ziChanZM + sqwc;
                } else {
                    textHtml += ziChanZM + yuan;
                }
                if(loan.gInfo.isTrue){
                    if(gPicArr.indexOf('frontIDCardPPic') != -1 && gPicArr.indexOf('backIDCardPPic') != -1 ){
                        textHtml += oIDCard + sqwc;
                    }else{
                        textHtml += oIDCard + yuan;
                    }
                }
            } else {  //配偶做共同申请人
                if (mPicFileMsgType.indexOf('hukoubuPic') != -1) {
                    textHtml += fHukoubo + sqwc;
                } else {
                    textHtml += fHukoubo + yuan;
                }
                if (mPicFileMsgType.indexOf('hunyinzhengming') != -1) {
                    textHtml += hunYinZM + sqwc;
                } else {
                    textHtml += hunYinZM + yuan;
                }
                if (mPicFileMsgType.indexOf('canbaozhengming') != -1) {
                    textHtml += canBaoZM + sqwc;
                } else {
                    textHtml += canBaoZM + yuan;
                }
                if (mPicFileMsgType.indexOf('shouruzhengming') != -1) {
                    textHtml += shouRuZM + sqwc;
                } else {
                    textHtml += shouRuZM + yuan;
                }
                if (mPicFileMsgType.indexOf('zichanzhengming') != -1) {
                    textHtml += ziChanZM + sqwc;
                } else {
                    textHtml += ziChanZM + yuan;
                }
                textHtml += oIDCard + sqwc;
                if (gPicFileMsgType.indexOf('shouruzhengming') != -1) {
                    textHtml += oShouRuZM + sqwc;
                } else {
                    textHtml += oShouRuZM + yuan;
                }
            }
        }
    } else if (loan.applicationObj.proCODE == '401002010') {//一手商铺按揭
        if (maritalStatus == '10' || maritalStatus == '22' || maritalStatus == '30') {  //婚姻状况 未婚
            if (mPicFileMsgType.indexOf('shouruzhengmingM') != -1) {
                textHtml += shouRuZM + sqwc;
            } else {
                if(loan.dzd !=''){
                    textHtml += shouRuZM + sqwc;
                }else{
                    textHtml += shouRuZM + yuan;
                }
            }
        } else if (maritalStatus == '20' || maritalStatus == '21' || maritalStatus == '40' || maritalStatus == '23') { //已婚 (已婚无子女、已婚有子女、复婚、再婚、)
            if (isCoborrower == '0') {  //配偶不做共同是申请人
                if (mPicFileMsgType.indexOf('shouruzhengmingM') != -1) {
                    textHtml += shouRuZM + sqwc;
                } else {
                    if(loan.dzd !=''){
                        textHtml += shouRuZM + sqwc;
                    }else{
                        textHtml += shouRuZM + yuan;
                    }
                }
                if (mPicFileMsgType.indexOf('zichanzhengmingM') != -1) {
                    textHtml += ziChanZM + sqwc;
                } else {
                    textHtml += ziChanZM + yuan;
                }
                if(loan.gInfo.isTrue){
                    if(gPicArr.indexOf('frontIDCardPPic') != -1 && gPicArr.indexOf('backIDCardPPic') != -1 ){
                        textHtml += oIDCard + sqwc;
                    }else{
                        textHtml += oIDCard + yuan;
                    }
                }
            } else {
                if (mPicFileMsgType.indexOf('shouruzhengming') != -1) {
                    textHtml += shouRuZM + sqwc;
                } else {
                    textHtml += shouRuZM + yuan;
                }
                if (mPicFileMsgType.indexOf('zichanzhengming') != -1) {
                    textHtml += ziChanZM + sqwc;
                } else {
                    textHtml += ziChanZM + yuan;
                }
                textHtml += oIDCard + sqwc;
                if (gPicFileMsgType.indexOf('shouruzhengming') != -1) {
                    textHtml += oShouRuZM + sqwc;
                } else {
                    textHtml += oShouRuZM + yuan;
                }
            }
        }
    }
    return textHtml;
}

/*确认界面 填写信息*/
function confirmPageAddData() {
    //申请人
    $('.candidate .box-content li>div:eq(1)').html(loan.mInfo.name);
    $('.candidate .box-content li>div:eq(2)').html(loan.mInfo.cerNO);
    $('.candidate .box-content li>div:eq(3)').html(loan.mInfo.cellphone);  //手机号码
    $('.candidate .box-content li>div:eq(4)').html(fmoney(loan.mInfo.income));  //月均稳定收入
    //房屋信息
    $('.building .box-content li>div:eq(0)').html(loan.applicationObj.buildingAddress);  //房屋地址
    $('.building .box-content li>div:eq(1)').html(fmoney(loan.applicationObj.buildingSea));  //建筑面积
    $('.building .box-content li>div:eq(2)').html(fmoney(loan.applicationObj.buildingDan));  //单价
    $('.building .box-content li>div:eq(3)').html(fmoney(loan.applicationObj.buildingZong));  //总价
    //借款信息
    $('.borrow .box-content li>div:eq(0)').html(fmoney(loan.applicationObj.buildingFuMoney));  //借款金额
    $('.borrow .box-content li>div:eq(1)').html(fmoney(loan.applicationObj.buildingFMoney));  //首付款
    $('.borrow .box-content li>div:eq(2)').html(loan.applicationObj.buildingFuTime);  //借款年限
    $('.borrow .box-content li>div:eq(3)').html(buildingType[loan.applicationObj.buildingType]);  //还款方式
    $('.borrow .box-content li>div:eq(4)').html(loan.applicationObj.accout);  //还款账号
    //借款人征信文件
    $('.underwriting .box-content li>div:eq(1)').html(loan.mInfo.name);  //姓名
    $('.underwriting .box-content li>div:eq(2)').html(loan.mInfo.cerNO);  //证件号码
    $('.underwriting .box-content li>div:eq(3)').html('');  //人行征信文件
    if(loan.faceSQBM){
        $('#ic_mdisqian').hide();
        $('#ic_mqian').show();
       // $("#mclear-botton").hide();
        loan.mInfo.isSignaData = true;
        $('.msg-con:eq(5)').find('span:first').addClass('aTags');
        $('.faceTalkRecord span').addClass('aTags');
    }else{
        loan.mInfo.isSignaData = false;
    }
    //=============  现在是配偶申请人
    if (loan.gInfo.isTrue) {
        $('.candidate .box-content li>div:eq(7)').html(loan.gInfo.name);  //配偶 姓名
        $('.candidate .box-content li>div:eq(8)').html(loan.gInfo.cerNO);  //配偶 证件号码
        $('.candidate .box-content li>div:eq(9)').html(loan.mInfo.consortCellphone);  //手机号码
        $('.candidate .box-content li>div:eq(10)').html(fmoney(loan.mInfo.consortIncome)); //月均稳定收入
        $('.candidate .box-content li>div:eq(11)').html('否'); //共同借款人
    }else{
        $('.candidate .box-content li:eq(1)').css('display', 'none');
    }
    if(loan.mInfo.maritalStatus == '20' || loan.mInfo.maritalStatus == '21' || loan.mInfo.maritalStatus == '40' || loan.mInfo.maritalStatus == '23'){
        if(loan.faceSQBS){
            $('#ic_sdisqian').hide();
            //$("#sclear-botton").hide();
            $('#ic_sqian').show();
            loan.gInfo.isSignaData = true;
            $('.msg-con:eq(5)').find('span:first').addClass('aTags');
        }else{
            loan.gInfo.isSignaData = false;
        }
    }else{
        $('.msg-con:eq(8)').css('display', 'none');
    }
    //=============
    //判断是否添加银行对账单
    if (loan.dzd.length != 0) {
        var textHtml = '';
        $.each(loan.dzd, function (index, ele) {
            var netFilePath = ele.split('/');
            var fileName = netFilePath[netFilePath.length - 1];
            textHtml += '<li filePath="' + ele + '">' +
                '<div>主申请人</div>' +
                '<div>' + loan.mInfo.name + '</div>' +
                '<div class="zjh">' + loan.mInfo.cerNO + '</div>' +
                '<div class="zxwj">' + fileName + '</div>' +
                '<span><div class="zlqd">查看</div></li>';
        });
        $('.msg-con:eq(4) ul').html(textHtml);
    }
    if (loan.gInfo.isTrue) {
        var textHtml = '';
        $.each(loan.fdzd, function (index, ele) {
            var netFilePath = ele.split('/');
            var fileName = netFilePath[netFilePath.length - 1];
            textHtml += '<li filePath="' + ele + '">' +
                '<div>主申请人</div>' +
                '<div>' + loan.gInfo.name + '</div>' +
                '<div class="zjh">' + loan.gInfo.cerNO + '</div>' +
                '<div class="zxwj">' + fileName + '</div>' +
                '<span><div class="zlqd">查看</div></li>';
        });
        $('.msg-con:eq(4) ul').append(textHtml);
    }
    if($('.msg-con:eq(4) ul').find('li').length < 1){
        $('.msg-con:eq(4)').css('display','none');
    }
    if (loan.mInfo.cFileStr && loan.mInfo.cFileStr.length > 0) {
    	$.each(loan.mInfo.cFileStr, function (index, data) {
    		if(data.creditReferPath){
	            var creditFile = "";
	            $.each(data.creditReferPath.split(';'), function(index, path){
	            	var fileName = path.split('/');
	            	creditFile += fileName[fileName.length - 1] + ',';
	            });
	                
	            var li = $('<li>').data('creditInfo', data)
	            	.append($('<div>').css('width', '15%').html('主申请人'))
	            	.append($('<div>').css('width', '16%').html(loan.mInfo.name))
	            	.append($('<div>').css('width', '17%').addClass('zjh').html(loan.mInfo.cerNO))
	            	.append($('<div>').css('width', '15%').html(creditTypeJson[data.creditType]))
	            	.append($('<div>').addClass('zxwj').html(creditFile.substr(0, creditFile.length - 1)))
	            	.append($('<span>').append($('<div>').addClass('zlqd').html('查看')));
	            $('.msg-con:eq(3) ul').append(li);
    		} else {
	            var li = $('<li>').data('creditInfo', data)
	            	.append($('<div>').css('width', '15%').html('主申请人'))
	            	.append($('<div>').css('width', '16%').html(loan.mInfo.name))
	            	.append($('<div>').css('width', '17%').addClass('zjh').html(loan.mInfo.cerNO))
	            	.append($('<div>').css('width', '15%').html(creditTypeJson[data.creditType]))
	            	.append($('<div>').addClass('zxwj'))
	            	.append($('<span>').append($('<div>').html('查看')));
	            $('.msg-con:eq(3) ul').append(li);
    		}
		});
    } else {
        $('.msg-con:eq(3)').css('display','none');
    }
    //初始化 主申请人签名方法
    signature.init({
        div: $('#mqianM'), //签名容器
        finishBtn: $("#mqianOK"), //完成签名按钮
        clearBtn: $("#mclear-botton"), //清除签名按钮
        lineColor: '#000000', //线条颜色
        lineWidth: 3, //线条粗细
        finish: function (data) { //签名完成回调函数
            if ($('#ic_mdisqian').is(':hidden')) {
                loan.faceSQBM = false;
                $("#mclear-botton").show();
                $('#ic_mqian').hide();
                $('#ic_mdisqian').show();
                $("#loanm-sign-over").remove();
                loan.mInfo.isSignaData = false;
                $('.msg-con:eq(5)').find('span:first').removeClass('aTags');
                $('.faceTalkRecord span').removeClass('aTags');
            } else {
                $('#ic_mdisqian').hide();
                $('#ic_mqian').show();
                //$("#mclear-botton").hide();
                loan.mInfo.isSignaData = true;
                if (loan.mInfo.isSignaData && ($('.msg-con:eq(8)').css('display') == 'none' || ($('.msg-con:eq(8)').css('display') != 'none' && loan.gInfo.isSignaData))) {
                    $('.msg-con:eq(5)').find('span:first').addClass('aTags');
                    $('.faceTalkRecord span').addClass('aTags');
                }else{
                    $('.msg-con:eq(5)').find('span:first').removeClass('aTags');
                    $('.faceTalkRecord span').removeClass('aTags');
                }
                $('#loan-cusConfirm .qian-box:eq(0)').css('position', 'relative');
                $('#loan-cusConfirm .qian-box:eq(0)').append('<div id="loanm-sign-over" style="position:absolute; top:0px; right:0;left:0;bottom:0;opacity: 0"></div>');
                loan.mInfo.signaData = data.replace('data:image/png;base64,', '')
            }
        }
    });
    //初始化 共同申请人(配偶)签名方法
    signatureS.init({
        div: $('#sqianM'), //签名容器
        finishBtn: $("#sqianOK"), //完成签名按钮
        clearBtn: $(".clearBtn:eq(1)"), //清除签名按钮
        lineColor: '#000000', //线条颜色
        lineWidth: 3, //线条粗细
        finish: function (data) { //签名完成回调函数
            if ($('#ic_sdisqian').is(':hidden')) {
                loan.faceSQBS = false;
                $("#sclear-botton").show();
                $('#ic_sqian').hide();
                $('#ic_sdisqian').show();
                $('.msg-con:eq(5)').find('span:first').removeClass('aTags');
                $('.faceTalkRecord span').removeClass('aTags');
                $("#loans-sign-over").remove();
                loan.gInfo.isSignaData = false;
            } else {
                $('#ic_sdisqian').hide();
                //$("#sclear-botton").hide();
                $('#ic_sqian').show();
                loan.gInfo.isSignaData = true;
                if (loan.mInfo.isSignaData && ($('.msg-con:eq(8)').css('display') == 'none' || ($('.msg-con:eq(8)').css('display') != 'none' && loan.gInfo.isSignaData))) {
                    $('.msg-con:eq(5)').find('span:first').addClass('aTags');
                    $('.faceTalkRecord span').addClass('aTags');
                }else{
                    $('.msg-con:eq(5)').find('span:first').removeClass('aTags');
                    $('.faceTalkRecord span').removeClass('aTags');
                }
                $('#loan-cusConfirm .qian-box:eq(1)').css('position', 'relative');
                $('#loan-cusConfirm .qian-box:eq(1)').append('<div id="loans-sign-over" style="position:absolute; top:0px; right:0;left:0;bottom:0;opacity:0;"></div>');
                loan.gInfo.signaData = data.replace('data:image/png;base64,', '')
            }
        }
    });
}

/*录入信息*/
function LOSinputLosValue(obj, resource) {
    if (obj.clientDescVO[0].MARITAL_STATUS != '') {
        if (obj.clientDescVO[0].MARITAL_STATUS == '90') {  //说明是  未说明的婚
            $('#maritalStatus').val('10').selectmenu('refresh');//未婚
        } else {
            $('#maritalStatus').val(obj.clientDescVO[0].MARITAL_STATUS).selectmenu('refresh');//婚姻状况
        }
    }
    if (obj.clientDescVO[0].EDUCATION != '') {
        $('#eduExp').val(obj.clientDescVO[0].EDUCATION).selectmenu('refresh');//最高学历
    }
    if (obj.clientDescVO[0].CUZGXW != '') {  //最高学位
        $('#cuzgxw').val(obj.clientDescVO[0].CUZGXW).selectmenu('refresh');
    }
    if (obj.clientDescVO[0].INDUSTRY != '') {  //行业
        $('#industry').val(obj.clientDescVO[0].INDUSTRY).selectmenu('refresh');
    }
    if (obj.clientDescVO[0].OCCUPATION_CODE != '') {
        $('#occupation').val(obj.clientDescVO[0].OCCUPATION_CODE).selectmenu('refresh');//职业
    }
    $('#corporation').val($.trim(obj.clientDescVO[0].EMPLOYER_NAME)); //工作单位
    if (obj.clientDescVO[0].POST != '') {
        $('#headship').val(obj.clientDescVO[0].POST).selectmenu('refresh'); //工作职位
    }
    if (obj.clientDescVO[0].QUALIFICATION != '') { //职称
        $('#position').val(obj.clientDescVO[0].QUALIFICATION).selectmenu('refresh');
    }
    if (obj.clientDescVO[0].dwellYear != '') {
        document.getElementById('dwellYear').valueAsDate = new Date(obj.clientDescVO[0].dwellYear);//何时来本地  --->现地址居住开始年份
    }
    $('.input-test-con:eq(3)').val($.trim(obj.clientDescVO[0].EMPLOYER_PHONE)); //办公电话
    if($.trim(obj.clientDescVO[2].CONTACT_INFO[0].contactInfo[0].CITY_TEL) !='' && $.trim(obj.clientDescVO[2].CONTACT_INFO[0].contactInfo[0].CONTACT_ID) !=''){
        $('.input-test-con:eq(4)').val(''+$.trim(obj.clientDescVO[2].CONTACT_INFO[0].contactInfo[0].CITY_TEL)+'-'+$.trim(obj.clientDescVO[2].CONTACT_INFO[0].contactInfo[0].CONTACT_ID)); //家庭电话
    }else{
        $('.input-test-con:eq(4)').val(''+$.trim(obj.clientDescVO[2].CONTACT_INFO[0].contactInfo[0].CITY_TEL)+$.trim(obj.clientDescVO[2].CONTACT_INFO[0].contactInfo[0].CONTACT_ID)); //家庭电话
    }
    $('.input-test-con:eq(5)').val($.trim(obj.clientDescVO[2].CONTACT_INFO[0].contactInfo[0].POSTAL_CODE)); //邮政编码--->居住地址邮编
    if (resource == '3') {
        $('.input-test-con:eq(2)').val($.trim(obj.clientDescVO[2].CONTACT_INFO[1].contactInfo[0].CONTACT_ID)).attr('disabled', 'disabled');
        $('.input-test-con:eq(6)').val($.trim(obj.clientDescVO[2].CONTACT_INFO[1].contactInfo[0].ADDRESS2)); //现住址--->居住地址
    } else {
        $('.input-test-con:eq(2)').val($.trim(obj.clientDescVO[2].CONTACT_INFO[1].contactInfo[0].CONTACT_ID)).removeAttr('disabled', 'disabled');
        if (obj.clientDescVO[2].CONTACT_INFO[1].contactInfo[0].ADDRESS2 == '') {
            $('.input-test-con:eq(6)').val($.trim(obj.clientDescVO[2].CONTACT_INFO[0].contactInfo[0].ADDRESS2)); //通讯地址
        } else {
            $('.input-test-con:eq(6)').val($.trim(obj.clientDescVO[2].CONTACT_INFO[1].contactInfo[0].ADDRESS2)); //现住址--->居住地址
        }
    }
    $('.input-test-con:eq(7)').val($.trim(obj.clientDescVO[2].CONTACT_INFO[0].contactInfo[0].ADDRESS2)); //通讯地址
    if (obj.clientDescVO[0].dwellingStatus != '') {
        $('#dwellingStatus').val(obj.clientDescVO[0].dwellingStatus).selectmenu('refresh'); //现住房性质
    }
    $('.addrAndArea:eq(2)').val($.trim(obj.clientDescVO[0].houses)); //现住房数
    $('.input-test-con:eq(8)').val(fmoney(obj.clientDescVO[0].ANNUALEARNING)); //月均收入
    if(Number($.trim(obj.clientDescVO[0].debtBalance)) == '0'){
        $('.input-test-con:eq(9)').val('0.00'); //现负债额
    }else{
        $('.input-test-con:eq(9)').val(fmoney(obj.clientDescVO[0].debtBalance)); //现负债额
    }
    $('.input-test-con:eq(10)').val($.trim(obj.clientDescVO[0].support)); //供养人数
    if (obj.clientDescVO[0].minorChildren != '') {
        $('#minorChildren').val($.trim(obj.clientDescVO[0].minorChildren)).selectmenu('refresh'); //未成年子女
    }
    //配偶信息
    if (resource == '3') {  //LOS系统存在信息
        if (loan.gInfo.isTrue) {
            if (obj.clientDescVO[0].consortCertType == 'Ind01' && loan.gInfo.cerNO == $.trim(obj.clientDescVO[0].consortCertId)) {
                $('.input-test-con:eq(11)').val($.trim(obj.clientDescVO[0].consortCellphone));//配偶手机号
                //$('.input-test-con:eq(12)').val($.trim(obj.clientDescVO[0].)); //工作单位---->借口没有提供
                $('.input-test-con:eq(13)').val(fmoney(obj.clientDescVO[0].consortIncome));//配偶月均稳定收入
                if($.trim(obj.clientDescVO[0].consortHeadship) !=''){
                    $('#consortHeadship').val($.trim(obj.clientDescVO[0].consortHeadship)).selectmenu('refresh');
                }
            }else{
                if(obj.clientDescVO[0].consortCertType !='' &&$.trim(obj.clientDescVO[0].consortCertId) !=''){
                    showTags({
                        'title': '提示',
                        'content': '配偶证件信息与LOS系统不一致,无法办理!',
                        'ok': {
                            fun: function () {
                                $.mobile.changePage('loan-product.html', {reverse: true});
                            }
                        }
                    });
                    return;
                }
            }
        }
    }

    //未显示在页面上的上传字段
    loan.mInfo.country = 'CHN';//国籍
    loan.mInfo.nativePlace = $.trim(obj.clientDescVO[2].CONTACT_INFO[2].contactInfo[0].ADDRESS2); //户籍地址
    loan.mInfo.creditCategory = $.trim(obj.clientDescVO[0].creditCategory); //授信客户分类
    loan.mInfo.clStencil = $.trim(obj.clientDescVO[0].clStencil);//信用等级评估模板名称
    loan.mInfo.remark = $.trim(obj.clientDescVO[0].remark);//房产证号码
    loan.organCode = $.trim(obj.clientDescVO[0].ORGAN_CODE);//LOS机构
    loan.resource = resource;  //数据源
    //配偶信息
    loan.mInfo.consortCellphone = $.trim(obj.clientDescVO[0].consortCellphone);//配偶手机号
    loan.mInfo.consortIncome = $.trim(obj.clientDescVO[0].consortIncome);//配偶月均稳定收入
    loan.mInfo.consortHeadship = $.trim(obj.clientDescVO[0].consortHeadship);  //工作职位
    loan.mInfo.consortCertType = $.trim(obj.clientDescVO[0].consortCertType);  //证件类型
    loan.mInfo.consortCertId = $.trim(obj.clientDescVO[0].consortCertId);   //证件号码
    getInputSelectValue();
}

function getInputSelectValue() {
    loan.mInfo.maritalStatus = $.trim($('#maritalStatus').val());
    loan.mInfo.eduExp = $.trim($('#eduExp').val());
    loan.mInfo.occupation = $.trim($('#occupation').val());
    loan.mInfo.corporation = $.trim($('#corporation').val());
    loan.mInfo.headship = $.trim($('#headship').val());
    loan.mInfo.dwellYear = $.trim($('#dwellYear').val());
    loan.mInfo.cellphone = $.trim($('.input-test-con:eq(2)').val());
    loan.mInfo.workTel = $.trim($('.input-test-con:eq(3)').val());
    loan.mInfo.homeTel = $.trim($('.input-test-con:eq(4)').val());
    loan.mInfo.dwellingZip = $.trim($('.input-test-con:eq(5)').val());
    loan.mInfo.dwellingAddr = $.trim($('.input-test-con:eq(6)').val());
    loan.mInfo.mailingAddr = $.trim($('.input-test-con:eq(7)').val());
    loan.mInfo.dwellingStatus = $.trim($('#dwellingStatus').val());
    loan.mInfo.houses = $.trim($('.addrAndArea:eq(2)').val());
    loan.mInfo.income = rmoney($('.input-test-con:eq(8)').val());
    loan.mInfo.debtBalance = rmoney($('.input-test-con:eq(9)').val());
    loan.mInfo.support = $('.input-test-con:eq(10)').val();
    loan.mInfo.minorChildren = $.trim($('#minorChildren').val());
    loan.mInfo.industry = $.trim($('#industry').val());  //所属行业
    loan.mInfo.degree = $.trim($('#cuzgxw').val());//最高学位
    loan.mInfo.position = $.trim($('#position').val());//职称
    if (loan.gInfo.isTrue) {
        loan.mInfo.consortCellphone = $.trim($('.input-test-con:eq(11)').val());//配偶手机号
        loan.mInfo.peiHeadship = $.trim($('.input-test-con:eq(12)').val()); //工作单位
        loan.mInfo.consortIncome = rmoney($('.input-test-con:eq(13)').val());//配偶月均稳定收入
        loan.mInfo.consortHeadship = $.trim($('#consortHeadship').val());
    }
}

function zipCompressionFilePathFun(type) {
    var arr = [];
    if (type == 'customer') {  //
        $.each(loan.applicationObj.mPicFileARR, function (index, e) {
            var fileName = e.substring(e.lastIndexOf('\/') + 1);
            if(fileName.indexOf('frontIDCardMPic') != -1 ||fileName.indexOf('backIDCardMPic') != -1||fileName.indexOf('hukoubuPic') != -1 ||fileName.indexOf('marryzhengming') != -1 ||fileName.indexOf('shouruzhengmingM') != -1 ||fileName.indexOf('zichanzhengmingM') != -1){
                arr.push(e);
            }
        });
        if (loan.gInfo.isTrue) {
            $.each(loan.applicationObj.gPicFileARR, function (index, e) {
                    var fileName = e.substring(e.lastIndexOf('\/') + 1);
                    if(fileName.indexOf('frontIDCardPPic') != -1 ||fileName.indexOf('backIDCardPPic') != -1||fileName.indexOf('hukoubuPic') != -1 ||fileName.indexOf('marryzhengming') != -1||fileName.indexOf('zichanzhengmingP') != -1||fileName.indexOf('shouruzhengmingP') !=-1){
                        arr.push(e);
                    }
            });
        }
    } else {
        $.each(loan.applicationObj.mPicFileARR,function (index,e) {
            if (index == 0) {
                arr.push(e);
            }else{
                var fileName = e.substring(e.lastIndexOf('\/') + 1);
                if(fileName.indexOf('custAndCustOwnerPic') != -1 ||fileName.indexOf('canbaozhengming') != -1||fileName.indexOf('pingzhengPic') != -1 ||fileName.indexOf('qitazhengming') != -1||fileName.indexOf('bankstatements') != -1){
                    arr.push(e);
                }
            }
        });
        if (loan.gInfo.isTrue) {
            $.each(loan.applicationObj.gPicFileARR,function (index,e) {
                if (index == 0) {
                    arr.push(e);
                }else{
                    var fileName = e.substring(e.lastIndexOf('\/') + 1);
                    if(fileName.indexOf('custAndCustOwnerPic') != -1 ||fileName.indexOf('canbaozhengming') != -1||fileName.indexOf('pingzhengPic') != -1 ||fileName.indexOf('qitazhengming') != -1||fileName.indexOf('bankstatements') != -1){
                        arr.push(e);
                    }
                }
            });
        }
    }
    return arr;
}
/*签名文件上传*/
function transFormImageAndInsertTableData(appBus, signTime, appPath, filePath,fileType) {
    var appBusJson = JSON.stringify(appBus);
    var sendDataJson = {
        'databaseName': 'myDatabase',
        'tableName': 'up_download_info',
        'data': [{
            'fileToken': signTime,//文件唯一ID(可以为时间挫
            'pos': '0',//文件的断点信息(初始为0)
            'filePath': filePath,//文件路径
            'appPath': appPath,//自定义文件路径
            'appBuss': appBusJson,//业务参数
            'downloadToken': '',//文件的下载ID(初始为空)
            'leng': '1',//文件的长度(初始为1)
            'isNotice': 'yes', //是否调用后台(一直是yes)
            "fileType": fileType
        }]
    };
    insertTableData(sendDataJson, function (msg) {
    }, function (err) {
        showTags({
            'title': '提示',
            'content': '插入数据库失败',
            'ok': {}
        });
    });
}

function buildingInputValue() {
    loan.applicationObj.relativeAgreement = $.trim($('#buildingInfoId option:selected').attr('relativeAgreement'));  //房屋 第三方额度号
    loan.applicationObj.developer = $('#buildingInfoId option:selected').attr('developers');
    loan.applicationObj.buildingAddr = $('#buildingInfoId option:selected').attr('address');
    loan.applicationObj.summary = $.trim($('#buildingInfoId option:selected').attr('summary'));//楼盘项目
    loan.applicationObj.buildingAddress = $.trim($('.input-test-con:eq(14)').val()); //房屋地址
    loan.applicationObj.buildId = $.trim($('#buildingInfoId').val());
    loan.applicationObj.buildingStau = $.trim($('.info-enter-item:eq(2)').find('select:eq(1) option:selected').val());//房屋状态
    loan.applicationObj.buildingPurpose = $.trim($('.info-enter-item:eq(2)').find('select:eq(2)').val());//房屋用途
    loan.applicationObj.buildingZong = rmoney($('.info-enter-item:eq(2)').find('input:eq(1)').val());//房屋总价
    loan.applicationObj.buildingSea = rmoney($('.info-enter-item:eq(2)').find('input:eq(2)').val());//建筑面积
    loan.applicationObj.buildingDan = rmoney($('.info-enter-item:eq(2)').find('input:eq(3)').val());//单价
    loan.applicationObj.buildingFMoney = rmoney($('.info-enter-item:eq(2)').find('input:eq(4)').val());//首付款金额
    loan.applicationObj.buildingFuMoney = rmoney($('.info-enter-item:eq(2)').find('input:eq(5)').val());//借款金额
    loan.applicationObj.buildingFuTime = $.trim($('.info-enter-item:eq(2)').find('select:eq(3)').val());//借款期限
    loan.applicationObj.buildingType = $.trim($('.info-enter-item:eq(2)').find('select:eq(4)').val());//还款方式
    loan.applicationObj.buildingExplain = '';//还款计划说明
    loan.applicationObj.accout = $.trim($('#cardAccount option:selected').val());//还款账号
    loan.applicationObj.accoutType = $.trim($('#cardAccount option:selected').attr('docType'));//凭证类型
    loan.applicationObj.fuJian = ''; //上传附件
    loan.applicationObj.manager = commonJson.losUserId;//客户经理
    loan.applicationObj.uploadTime = "" + myTime.CurTime(); //本地上传时间
    //新增字段
    loan.applicationObj.shopHouseNum = $('.addrAndArea:eq(0)').val();  // 银行贷款购买/申请商品住房套
    loan.applicationObj.shopHouseArea = $('.addrAndArea:eq(1)').val();  // 银行贷款购买/申请商品住房面积
    loan.applicationObj.hadHouseArea = $('.addrAndArea:eq(3)').val();  //目前家庭实际拥有商品住房  建筑面积
}

//联机状态 暂存影像文件--影响采集界面
function loanZanCunPictureInfo(TEMPFROM) {
    var sendDataJson = {
        "databaseName": "myDatabase",
        "tableName": "loanapply_info",
        "data": [{
            'organCode':'',
            'modifiable':'',
            'proCODE':loan.applicationObj.proCODE,  //产品代买
            'proType':loan.applicationObj.proType,
            'isPicturePage':loan.isPicturePage,
            'ispeiPicturePage':loan.ispeiPicturePage,
            'isInputChange': '',  //字段变化
            'mCLIENT_NO': loan.mCLIENT_NO,    //客户号
            'BUSINESSTYPE': '申请贷款',//
            'TEMPFROM': TEMPFROM,
            'YWXS': '',//业务线索
            'SUBMITTIME': myTime.CurTime(),
            'buildArr': '',
            'accountArr': '',
            'inputLogo':'false',
            'mCheckResult':loan.mInfo.CheckResult, //主申请人
            'gCheckResult':'', //主申请人配偶
            //基础的
            'mfaceRecogn':loan.mInfo.faceRecogn,
            'gfaceRecogn':'',
            'offlineOnline': commonJson.offlineOnline,//脱机/联机
            'workAddress': commonJson.workAddress,//工作地址
            'moduleId': loan.moduleId, //模块编号
            'tranId': loan.tranId, //交易编号
            'operatorNo': commonJson.adminCount, //操作员
            'deviceNo': commonJson.udId, //设备编号
            'orgId': commonJson.orgId,
            'isLoanMaster':loan.isLoanMaster,  //设置
            //主身份证信息
            'misTrue': loan.mInfo.isTrue,  //存在
            'mNation': loan.mInfo.nation, //
            'mcerNo': loan.mInfo.cerNO,
            'maddress': loan.mInfo.address,
            'mname': loan.mInfo.name,
            'mcerExpdDt': loan.mInfo.cerExpdDt,
            'mbirthday': loan.mInfo.birthday,
            'msex': loan.mInfo.sex,
            'missAuthority': loan.mInfo.issAuthority,
            'mimage': loan.mInfo.image,
            'mMGCompareFace': loan.mInfo.MGCompareFace,
            //配偶身份证信息
            'gisTrue': loan.gInfo.isTrue,  //存在
            'gNation': '', //
            'gcerNo': '',
            'gaddress': '',
            'gname': '',
            'gcerExpdDt': '',
            'gbirthday': '',
            'gsex': '',
            'gissAuthority': '',
            'gimage': '',
            'gMGCompareFace': '',
            //主影像
            "mcustFacePic": loan.applicationObj.mPicFileARR[0], //客户面部照片
            "mcustAndCustOwnerPic": loan.applicationObj.mPicFileARR[1], //与客户合影照片
            "mfrontIDCardPic": loan.applicationObj.mPicFileARR[2], //身份证正面
            "mbackIDCardPic": loan.applicationObj.mPicFileARR[3], //身份证反面
            "mpicFileARR": loan.applicationObj.mPicFileARR.join("&&"), //要打包的影像路径
            "mpicFileInfoARR": JSON.stringify(loan.applicationObj.mPicFileInfoARR), //每个图片的名称和类型
            "mpicFileMsgType": loan.applicationObj.mPicFileMsgType.join("&&"), //其他图片对象的证明类型
            "mcheckPhoto": loan.mInfo.lianPic, //联网核查图片
            //配偶影像
            "gcustFacePic": '', //客户面部照片
            "gcustAndCustOwnerPic": '', //与客户合影照片
            "gfrontIDCardPic": '', //身份证正面
            "gbackIDCardPic": '', //身份证反面
            "gpicFileARR": '', //要打包的影像路径
            "gpicFileInfoARR": '', //每个图片的名称和类型
            "gpicFileMsgType": '', //其他图片对象的证明类型
            "gcheckPhoto": '', //联网核查图片
            //输入的字段
            'maritalStatus':'',
            'eduExp': '',
            'occupation': '',
            'corporation': '',
            'headship': '',
            'dwellYear': '',
            'cellphone': '',
            'workTel': '',
            'homeTel': '',
            'dwellingZip': '',
            'dwellingAddr': '',
            'mailingAddr': '',
            'dwellingStatus': '',
            'houses': '',
            'income': '',
            'debtBalance': '',
            'support':'',
            'minorChildren': '',
            'consortHeadship': '',
            'consortCellphone': '',
            'consortIncome': '',
            'peiHeadship':'', //配偶工作单位
            'consortCertType':'',  //证件类型---------->新增
            'consortCertId':'' ,  //证件号码---------->新增
            'isCoborrower': '0', //配偶是否共借人
            'relativeAgreement': '',  //房屋 第三方额度号
            'buildId': '',
            'developer':'',
            'summary': '',//楼盘项目
            'buildingAddress': '', //房屋地址
            'buildingStau': '',//房屋状态
            'buildingPurpose': '',//房屋用途
            'buildingSea': '',//建筑面积
            'buildingDan': '',//单价
            'buildingZong': '',//房屋总价
            'buildingFMoney': '',//首付款金额
            'buildingFuMoney': '',//借款金额
            'buildingFuTime': '',//借款期限
            'buildingType': '',//还款方式
            'buildingExplain': '',//还款计划说明
            'accout': '',//还款账号
            'accoutType': '',//凭证类型
            'fuJian': '', //上传附件
            'manager': '',//客户经理
            'uploadTime': '', //本地上传时间
            //未显示在页面上的上传字段
            'country': '',//国籍
            'nativePlace': '', //户籍地址
            'creditCategory': '', //授信客户分类
            'clStencil': '',//信用等级评估模板名称
            'degree': '',//最高学位
            'industry': '',//所属行业
            'position': '',//职称
            'remark': '',//房产证号码
            'shopHouseNum': '',
            'shopHouseArea': '',
            'hadHouseArea': '',
            'buildingAddr':'',//楼盘项目地址
            'resource':'',//数据源
            "REMARK1":commonJson.longitude,//经度
            "REMARK2":commonJson.latitude//纬度
        }]
    };
    if (loan.gInfo.isTrue) {
        sendDataJson.data[0].gfaceRecogn = loan.gInfo.faceRecogn;
        sendDataJson.data[0].gCheckResult = loan.gInfo.CheckResult; //主申请人配偶
        sendDataJson.data[0].gNation = loan.gInfo.nation;
        sendDataJson.data[0].gcerNo = loan.gInfo.cerNO;
        sendDataJson.data[0].gname = loan.gInfo.name;
        sendDataJson.data[0].gaddress = loan.gInfo.address;
        sendDataJson.data[0].gcerExpdDt = loan.gInfo.cerExpdDt;
        sendDataJson.data[0].gbirthday = loan.gInfo.birthday;
        sendDataJson.data[0].gsex = loan.gInfo.sex;
        sendDataJson.data[0].gissAuthority = loan.gInfo.issAuthority;
        sendDataJson.data[0].gimage = loan.gInfo.image;
        sendDataJson.data[0].gMGCompareFace = loan.gInfo.MGCompareFace;
        sendDataJson.data[0].gcustFacePic = loan.applicationObj.gPicFileARR[0]; //客户面部照片
        sendDataJson.data[0].gcustAndCustOwnerPic = loan.applicationObj.gPicFileARR[1]; //与客户合影照片
        sendDataJson.data[0].gfrontIDCardPic = loan.applicationObj.gPicFileARR[2]; //身份证正面
        sendDataJson.data[0].gbackIDCardPic = loan.applicationObj.gPicFileARR[3]; //身份证反面
        sendDataJson.data[0].gpicFileARR = loan.applicationObj.gPicFileARR.join("&&"); //要打包的影像路径
        sendDataJson.data[0].gpicFileInfoARR = JSON.stringify(loan.applicationObj.gPicFileInfoARR); //每个图片的名称和类型
        sendDataJson.data[0].gpicFileMsgType = loan.applicationObj.gPicFileMsgType.join("&&"); //其他图片对象的证明类型
        sendDataJson.data[0].gcheckPhoto = loan.gInfo.lianPic; //联网核查图片

    }
    insertTableData(sendDataJson, function (msg) {
    }, function (err) {
        showMsg('存储个人信息失败' + msg);
    });
}
//联机状态 暂存个人信息--信心录入界面
function loanZanCunCustermerInfo() {
    buildingInputValue();  //房屋信息
    getInputSelectValue(); //申请人信息
    if(loan.applicationObj.buildingAddr ==null ||loan.applicationObj.buildingAddr ==undefined){
        loan.applicationObj.buildingAddr = '';
    }
    if(loan.applicationObj.developer ==null ||loan.applicationObj.developer ==undefined){
        loan.applicationObj.developer = '';
    }
    if(loan.applicationObj.summary ==null ||loan.applicationObj.summary ==undefined){
        loan.applicationObj.summary = '';
    }
    var sendDataJson = {
        "databaseName": "myDatabase",
        "tableName": "loanapply_info",
        "data": [{
            'organCode':loan.organCode,
            'modifiable':loan.applicationObj.modifiable,
            'proType':loan.applicationObj.proType,
            'proCODE':loan.applicationObj.proCODE,  //产品代买
            'isPicturePage':loan.isPicturePage,
            'ispeiPicturePage':loan.ispeiPicturePage,
            'inputLogo':loan.inputLogo,
            'isInputChange': loan.isInputChange,  //字段变化
            'mCLIENT_NO': loan.mCLIENT_NO,    //客户号
            'BUSINESSTYPE': '申请贷款',//
            'TEMPFROM': 'loan-cusInfo.html',
            'YWXS': loan.applicationObj.summary,//业务线索
            'SUBMITTIME': myTime.CurTime(),
            'buildArr': JSON.stringify(loan.buildArr),
            'accountArr': JSON.stringify(loan.accountArr),
            //基础的
            'mfaceRecogn':loan.mInfo.faceRecogn,
            'gfaceRecogn':'',
            'mCheckResult':loan.mInfo.CheckResult, //主申请人
            'gCheckResult':'', //主申请人配偶
            'offlineOnline': commonJson.offlineOnline,//脱机/联机
            'workAddress': commonJson.workAddress,//工作地址
            'moduleId': loan.moduleId, //模块编号
            'tranId': loan.tranId, //交易编号
            'operatorNo': commonJson.adminCount, //操作员
            'deviceNo': commonJson.udId, //设备编号
            'orgId': commonJson.orgId,
            'isLoanMaster':loan.isLoanMaster,  //设置
            //主身份证信息
            'misTrue': loan.mInfo.isTrue,  //存在
            'mNation': loan.mInfo.nation, //
            'mcerNo': loan.mInfo.cerNO,
            'maddress': loan.mInfo.address,
            'mname': loan.mInfo.name,
            'mcerExpdDt': loan.mInfo.cerExpdDt,
            'mbirthday': loan.mInfo.birthday,
            'msex': loan.mInfo.sex,
            'missAuthority': loan.mInfo.issAuthority,
            'mimage': loan.mInfo.image,
            'mMGCompareFace': loan.mInfo.MGCompareFace,
            //配偶身份证信息
            'gisTrue': loan.gInfo.isTrue,  //存在
            'gNation': '', //
            'gcerNo': '',
            'gaddress': '',
            'gname': '',
            'gcerExpdDt': '',
            'gbirthday': '',
            'gsex': '',
            'gissAuthority': '',
            'gimage': '',
            'gMGCompareFace': '',
            //主影像
            "mcustFacePic": loan.applicationObj.mPicFileARR[0], //客户面部照片
            "mcustAndCustOwnerPic": loan.applicationObj.mPicFileARR[1], //与客户合影照片
            "mfrontIDCardPic": loan.applicationObj.mPicFileARR[2], //身份证正面
            "mbackIDCardPic": loan.applicationObj.mPicFileARR[3], //身份证反面
            "mpicFileARR": loan.applicationObj.mPicFileARR.join("&&"), //要打包的影像路径
            "mpicFileInfoARR": JSON.stringify(loan.applicationObj.mPicFileInfoARR), //每个图片的名称和类型
            "mpicFileMsgType": loan.applicationObj.mPicFileMsgType.join("&&"), //其他图片对象的证明类型
            "mcheckPhoto": loan.mInfo.lianPic, //联网核查图片
            //配偶影像
            "gcustFacePic": '', //客户面部照片
            "gcustAndCustOwnerPic": '', //与客户合影照片
            "gfrontIDCardPic": '', //身份证正面
            "gbackIDCardPic": '', //身份证反面
            "gpicFileARR": '', //要打包的影像路径
            "gpicFileInfoARR": '', //每个图片的名称和类型
            "gpicFileMsgType": '', //其他图片对象的证明类型
            "gcheckPhoto": '', //联网核查图片
            //输入的字段
            'maritalStatus': loan.mInfo.maritalStatus,
            'eduExp': loan.mInfo.eduExp,
            'occupation': loan.mInfo.occupation,
            'corporation': loan.mInfo.corporation,
            'headship': loan.mInfo.headship,
            'dwellYear': loan.mInfo.dwellYear,
            'cellphone': loan.mInfo.cellphone,
            'workTel': loan.mInfo.workTel,
            'homeTel': loan.mInfo.homeTel,
            'dwellingZip': loan.mInfo.dwellingZip,
            'dwellingAddr': loan.mInfo.dwellingAddr,
            'mailingAddr': loan.mInfo.mailingAddr,
            'dwellingStatus': loan.mInfo.dwellingStatus,
            'houses': loan.mInfo.houses,
            'income': loan.mInfo.income,
            'debtBalance': loan.mInfo.debtBalance,
            'support': loan.mInfo.support,
            'minorChildren': loan.mInfo.minorChildren,
            'consortHeadship': loan.mInfo.consortHeadship,
            'consortCellphone': loan.mInfo.consortCellphone,
            'consortIncome': loan.mInfo.consortIncome,
            'peiHeadship':loan.mInfo.peiHeadship,  //配偶工作单位
            'consortCertType':loan.mInfo.consortCertType,  //证件类型---------->新增
            'consortCertId':loan.mInfo.consortCertId ,  //证件号码---------->新增
            'isCoborrower': '0', //配偶是否共借人
            'relativeAgreement': loan.applicationObj.relativeAgreement,  //房屋 第三方额度号
            'buildId': loan.applicationObj.buildId,
            'developer':loan.applicationObj.developer, //楼盘开发商-------------------------->新增
            'summary': loan.applicationObj.summary,//楼盘项目
            'buildingAddress': loan.applicationObj.buildingAddress, //房屋地址
            'buildingStau': loan.applicationObj.buildingStau,//房屋状态
            'buildingPurpose': loan.applicationObj.buildingPurpose,//房屋用途
            'buildingSea': loan.applicationObj.buildingSea,//建筑面积
            'buildingDan': loan.applicationObj.buildingDan,//单价
            'buildingZong': loan.applicationObj.buildingZong,//房屋总价
            'buildingFMoney': loan.applicationObj.buildingFMoney,//首付款金额
            'buildingFuMoney': loan.applicationObj.buildingFuMoney,//借款金额
            'buildingFuTime': loan.applicationObj.buildingFuTime,//借款期限
            'buildingType': loan.applicationObj.buildingType,//还款方式
            'buildingExplain': loan.applicationObj.buildingExplain,//还款计划说明
            'accout': loan.applicationObj.accout,//还款账号
            'accoutType': loan.applicationObj.accoutType,//凭证类型
            'fuJian': loan.applicationObj.fuJian, //上传附件
            'manager': loan.applicationObj.manager,//客户经理
            'uploadTime': loan.applicationObj.uploadTime, //本地上传时间
            //未显示在页面上的上传字段
            'country': loan.mInfo.country,//国籍
            'nativePlace': loan.mInfo.nativePlace, //户籍地址
            'creditCategory': loan.mInfo.creditCategory, //授信客户分类
            'clStencil': loan.mInfo.clStencil,//信用等级评估模板名称
            'degree': loan.mInfo.degree,//最高学位
            'industry': loan.mInfo.industry,//所属行业
            'position': loan.mInfo.position,//职称
            'remark': loan.mInfo.remark,//房产证号码
            'shopHouseNum': loan.applicationObj.shopHouseNum,
            'shopHouseArea': loan.applicationObj.shopHouseArea,
            'hadHouseArea': loan.applicationObj.hadHouseArea,
            'buildingAddr':loan.applicationObj.buildingAddr,//楼盘项目地址
            'resource':loan.resource,//数据源
            "REMARK1":commonJson.longitude,//经度
            "REMARK2":commonJson.latitude//纬度
        }]
    };
    if (loan.gInfo.isTrue) {
        sendDataJson.data[0].gfaceRecogn = loan.gInfo.faceRecogn;
        sendDataJson.data[0].gCheckResult = loan.gInfo.CheckResult; //主申请人配偶
        sendDataJson.data[0].gNation = loan.gInfo.nation;
        sendDataJson.data[0].gcerNo = loan.gInfo.cerNO;
        sendDataJson.data[0].gname = loan.gInfo.name;
        sendDataJson.data[0].gaddress = loan.gInfo.address;
        sendDataJson.data[0].gcerExpdDt = loan.gInfo.cerExpdDt;
        sendDataJson.data[0].gbirthday = loan.gInfo.birthday;
        sendDataJson.data[0].gsex = loan.gInfo.sex;
        sendDataJson.data[0].gissAuthority = loan.gInfo.issAuthority;
        sendDataJson.data[0].gimage = loan.gInfo.image;
        sendDataJson.data[0].gMGCompareFace = loan.gInfo.MGCompareFace;
        sendDataJson.data[0].gcustFacePic = loan.applicationObj.gPicFileARR[0]; //客户面部照片
        sendDataJson.data[0].gcustAndCustOwnerPic = loan.applicationObj.gPicFileARR[1]; //与客户合影照片
        sendDataJson.data[0].gfrontIDCardPic = loan.applicationObj.gPicFileARR[2]; //身份证正面
        sendDataJson.data[0].gbackIDCardPic = loan.applicationObj.gPicFileARR[3]; //身份证反面
        sendDataJson.data[0].gpicFileARR = loan.applicationObj.gPicFileARR.join("&&"); //要打包的影像路径
        sendDataJson.data[0].gpicFileInfoARR = JSON.stringify(loan.applicationObj.gPicFileInfoARR); //每个图片的名称和类型
        sendDataJson.data[0].gpicFileMsgType = loan.applicationObj.gPicFileMsgType.join("&&"); //其他图片对象的证明类型
        sendDataJson.data[0].gcheckPhoto = loan.gInfo.lianPic; //联网核查图片

    }
    insertTableData(sendDataJson, function (msg) {
    }, function (err) {
        showMsg('存储个人信息失败' + err);
    });
}
//数据反显到页面
function objcontentToPage() {
    if (loan.resource == '3'&& loan.organCode !='' && commonJson.superOrgId != loan.organCode) {  // 判断 LOS机构(在不为空的情况下) 和 登录机构(信息源来自LOS且LOS机构和登录机构不一致)
        $('.info-enter-item:eq(0) input,.info-enter-item:eq(1) input').attr('disabled', 'disabled');
        $('.input-test-con:eq(2)').attr('disabled','disabled');  //手机号码
        $('.addrAndArea:eq(0),.addrAndArea:eq(1),.addrAndArea:eq(3)').removeAttr('disabled');
        $('.info-enter-item:eq(1) input:eq(1)').removeAttr('disabled');
        $('.info-enter-item:eq(0) select,.info-enter-item:eq(1) select').attr('disabled', 'disabled');
    }
    $('#maritalStatus').val(loan.mInfo.maritalStatus).selectmenu('refresh');//婚姻状况
    $('#eduExp').val(loan.mInfo.eduExp).selectmenu('refresh');//最高学历
    $('#occupation').val(loan.mInfo.occupation).selectmenu('refresh');//职业
    $('#corporation').val(loan.mInfo.corporation); //工作单位
    $('#headship').val(loan.mInfo.headship).selectmenu('refresh'); //工作职位
    document.getElementById('dwellYear').valueAsDate = new Date(loan.mInfo.dwellYear); //何时来本地  --->现地址居住开始年份
    if (loan.resource == '3') {
        if (loan.gInfo.isTrue) {
            if (loan.mInfo.consortCertType != 'Ind01' || loan.gInfo.cerNO != loan.mInfo.consortCertId) {
                if(loan.mInfo.consortCertType !='' &&loan.mInfo.consortCertId !=''){
                    showTags({
                        'title': '提示',
                        'content': '配偶证件信息与LOS系统不一致,无法办理!',
                        'ok': {
                            fun: function () {
                                $.mobile.changePage('loan-product.html', {reverse: true});
                            }
                        }
                    });
                }
            }
        }
        $('.input-test-con:eq(2)').val(loan.mInfo.cellphone).attr('disabled', 'disabled'); //手机号码
    } else {
        $('.input-test-con:eq(2)').val(loan.mInfo.cellphone).removeAttr('disabled', 'disabled'); //手机号码
    }
    $('.input-test-con:eq(3)').val(loan.mInfo.workTel); //办公电话
    $('.input-test-con:eq(4)').val(loan.mInfo.homeTel); //家庭电话
    $('.input-test-con:eq(5)').val(loan.mInfo.dwellingZip); //邮政编码--->居住地址邮编
    $('.input-test-con:eq(6)').val(loan.mInfo.dwellingAddr); //现住址--->居住地址
    $('.input-test-con:eq(7)').val(loan.mInfo.mailingAddr); //通讯地址
    $('#dwellingStatus').val(loan.mInfo.dwellingStatus).selectmenu('refresh'); //现住房性质
    $('.addrAndArea:eq(2)').val(loan.mInfo.houses); //现住房数
    $('.input-test-con:eq(8)').val(fmoney(loan.mInfo.income)); //月均收入
    if(loan.mInfo.debtBalance =='0' ||loan.mInfo.debtBalance ==''){
        $('.input-test-con:eq(9)').val('0.00'); //现负债额
    }else{
        $('.input-test-con:eq(9)').val(fmoney(loan.mInfo.debtBalance)); //现负债额
    }
    $('.input-test-con:eq(10)').val(loan.mInfo.support); //供养人数
    $('#minorChildren').val(loan.mInfo.minorChildren).selectmenu('refresh'); //未成年子女
    $('.addrAndArea:eq(0)').val(loan.applicationObj.shopHouseNum);  // 银行贷款购买/申请商品住房套
    $('.addrAndArea:eq(1)').val(loan.applicationObj.shopHouseArea);  // 银行贷款购买/申请商品住房面积
    $('.addrAndArea:eq(3)').val(loan.applicationObj.hadHouseArea);  //目前家庭实际拥有商品住房  建筑面积
    $('.input-test-con:eq(11)').val(loan.mInfo.consortCellphone); //配偶手机号码
    $('.input-test-con:eq(12)').val(loan.mInfo.peiHeadship); //配偶工作单位
    $('.input-test-con:eq(13)').val(fmoney(loan.mInfo.consortIncome));//配偶月均稳定收入
    $('#consortHeadship').val(loan.mInfo.consortHeadship).selectmenu('refresh');
    $('.input-test-con:eq(14)').val(loan.applicationObj.buildingAddress); //房屋地址
    $('.info-enter-item:eq(2)').find('select:eq(1)').val(loan.applicationObj.buildingStau).selectmenu('refresh');//房屋状态
    $('.info-enter-item:eq(2)').find('select:eq(2)').val(loan.applicationObj.buildingPurpose).selectmenu('refresh');//房屋用途
    $('.info-enter-item:eq(2)').find('input:eq(1)').val(fmoney(loan.applicationObj.buildingZong));//房屋总价
    $('.info-enter-item:eq(2)').find('input:eq(2)').val(fmoney(loan.applicationObj.buildingSea));//建筑面积
    $('.info-enter-item:eq(2)').find('input:eq(3)').val(fmoney(loan.applicationObj.buildingDan));//单价
    $('.info-enter-item:eq(2)').find('input:eq(4)').val(fmoney(loan.applicationObj.buildingFMoney));//首付款金额
    $('.info-enter-item:eq(2)').find('input:eq(5)').val(fmoney(loan.applicationObj.buildingFuMoney));//借款金额
    $('.info-enter-item:eq(2)').find('select:eq(3)').val(loan.applicationObj.buildingFuTime).selectmenu('refresh');//借款期限
    $('.info-enter-item:eq(2)').find('select:eq(4)').val(loan.applicationObj.buildingType).selectmenu('refresh');//还款方式
    loan.applicationObj.buildingExplain = '';//还款计划说明
    //loan.applicationObj.accout = $.trim($('#cardAccount option:selected').val());//还款账号
    //loan.applicationObj.accoutType = $.trim($('#cardAccount option:selected').attr('docType'));//凭证类型
    loan.applicationObj.fuJian = ''; //上传附件
    $('#position').val(loan.mInfo.position).selectmenu('refresh');  //职称
    $('#cuzgxw').val(loan.mInfo.degree).selectmenu('refresh'); //最高学位
    $('#industry').val(loan.mInfo.industry).selectmenu('refresh');//行业
}
//反显building 和 account select的 内容
function buildingAndaccountSelect(buildArr, accountArr) {
    var buildTextHtml = '<option></option>';  //buildingSelect
    var accountTextHtml = '<option></option>'; //accountSelect
    $.each(buildArr, function (index, val) {
        if (val.buildingInfo[0].id == loan.applicationObj.buildId) {
            buildTextHtml += '<option developers="'+val.buildingInfo[0].developers+'" selected="true" address="' + val.buildingInfo[0].address + '" summary="' + val.buildingInfo[0].summary + '" relativeAgreement="' + val.buildingInfo[0].relativeAgreement + '"  value="' + val.buildingInfo[0].id + '">' + val.buildingInfo[0].summary + '</option>';
        } else {
            buildTextHtml += '<option developers="'+val.buildingInfo[0].developers+'" address="' + val.buildingInfo[0].address + '" summary="' + val.buildingInfo[0].summary + '" relativeAgreement="' + val.buildingInfo[0].relativeAgreement + '"  value="' + val.buildingInfo[0].id + '">' + val.buildingInfo[0].summary + '</option>';
        }
    });
    $('#buildingInfoId').html(buildTextHtml).selectmenu('refresh');
    $.each(accountArr, function (index, val) {
        var docType;
        if (val.docLicenceVO[0].DOC_TYPE == '001') {
            docType = '1';
        } else if (val.docLicenceVO[0].DOC_TYPE == '') {
            docType = '2';
        }
        if (val.docLicenceVO[0].ACCT_NO != '') {
            if (val.docLicenceVO[0].ACCT_NO == loan.applicationObj.accout) {
                accountTextHtml += '<option selected="true" docType ="' + docType + '" value="' + val.docLicenceVO[0].ACCT_NO + '">' + val.docLicenceVO[0].ACCT_NO + '</option>';
            } else {
                accountTextHtml += '<option docType ="' + docType + '" value="' + val.docLicenceVO[0].ACCT_NO + '">' + val.docLicenceVO[0].ACCT_NO + '</option>';
            }
        }
        if (val.docLicenceVO[0].ISSUE_ACCT_NO != '') {
            if (val.docLicenceVO[0].ISSUE_ACCT_NO == loan.applicationObj.accout) {
                accountTextHtml += '<option selected="true" docType ="' + docType + '" value="' + val.docLicenceVO[0].ISSUE_ACCT_NO + '">' + val.docLicenceVO[0].ISSUE_ACCT_NO + '</option>';
            } else {
                accountTextHtml += '<option docType ="' + docType + '" value="' + val.docLicenceVO[0].ISSUE_ACCT_NO + '">' + val.docLicenceVO[0].ISSUE_ACCT_NO + '</option>';
            }
        }
    });
    $("#loan-cusInfo #cardAccount").html(accountTextHtml).selectmenu('refresh', true);

}

//暂存数据 ----> 还原页面流程数据
function tempORpreToObject(obj) {
    loan.isInputChange = obj.isInputChange; //字段变化
    loan.mCLIENT_NO = obj.mCLIENT_NO;    //客户号
    loan.buildArr = JSON.parse(obj.buildArr);
    loan.accountArr = JSON.parse(obj.accountArr);
    loan.applicationObj.proType = obj.proType;  //产品代买
    loan.applicationObj.proCODE = obj.proCODE;  //产品代买
    loan.applicationObj.modifiable = obj.modifiable;
    commonJson.longitude = obj.REMARK1;//经度
    commonJson.latitude = obj.REMARK2;//纬度
    //主身份证信息
    if (obj.misTrue == '0') {
        loan.mInfo.isTrue = false;
    } else {
        loan.mInfo.isTrue = true;
    }
    if(obj.isPicturePage =='0'){
        loan.isPicturePage = false;
    }else{
        loan.isPicturePage = true;
    }
    if(obj.ispeiPicturePage =='0'){
        loan.ispeiPicturePage = false;
    }else{
        loan.ispeiPicturePage = true;
    }
    if(obj.isLoanMaster == '0'){
        loan.isLoanMaster = false; //设置
    }else{
        loan.isLoanMaster = true;
    }
    if(obj.inputLogo == '0'){
        loan.inputLogo = false;
    }else{
        loan.inputLogo = true;
    }
    loan.mInfo.faceRecogn = obj.mfaceRecogn;
    loan.gInfo.faceRecogn = obj.gfaceRecogn;
    loan.mInfo.CheckResult = obj.mCheckResult;
    loan.gInfo.CheckResult = obj.gCheckResult;
    loan.mInfo.nation = obj.mNation;//
    loan.mInfo.cerNO = obj.mcerNo;
    loan.mInfo.address = obj.maddress;
    loan.mInfo.name = obj.mname;
    loan.mInfo.cerExpdDt = obj.mcerExpdDt;
    loan.mInfo.birthday = obj.mbirthday;
    loan.mInfo.sex = obj.msex;
    loan.mInfo.issAuthority = obj.missAuthority;
    loan.mInfo.image = obj.mimage;
    loan.mInfo.MGCompareFace = obj.mMGCompareFace;
    //配偶身份证信息
    if (obj.gisTrue == '0') {
        loan.gInfo.isTrue = false;
    } else {
        loan.gInfo.isTrue = true;
    }
    loan.mInfo.peiHeadship = obj.peiHeadship;
    loan.mInfo.consortCertType = obj.consortCertType;
    loan.mInfo.consortCertId = obj.consortCertId;
    //loan.gInfo.isTrue = obj.gisTrue; //存在
    loan.gInfo.nation = obj.gNation;//
    loan.gInfo.cerNO = obj.gcerNo;
    loan.gInfo.address = obj.gaddress;
    loan.gInfo.name = obj.gname;
    loan.gInfo.cerExpdDt = obj.gcerExpdDt;
    loan.gInfo.birthday = obj.gbirthday;
    loan.gInfo.sex = obj.gsex;
    loan.gInfo.issAuthority = obj.gissAuthority;
    loan.gInfo.image = obj.gimage;
    loan.gInfo.MGCompareFace = obj.gMGCompareFace;
    loan.mInfo.maritalStatus = obj.maritalStatus;
    loan.mInfo.eduExp = obj.eduExp;
    loan.mInfo.occupation = obj.occupation;
    loan.mInfo.corporation = obj.corporation;
    loan.mInfo.headship = obj.headship;
    loan.mInfo.dwellYear = obj.dwellYear;
    loan.mInfo.cellphone = obj.cellphone;
    loan.mInfo.workTel = obj.workTel;
    loan.mInfo.homeTel = obj.homeTel;
    loan.mInfo.dwellingZip = obj.dwellingZip;
    loan.mInfo.dwellingAddr = obj.dwellingAddr;
    loan.mInfo.mailingAddr = obj.mailingAddr;
    loan.mInfo.dwellingStatus = obj.dwellingStatus;
    loan.mInfo.houses = obj.houses;
    loan.mInfo.income = obj.income;
    loan.mInfo.debtBalance = obj.debtBalance;
    loan.mInfo.support = obj.support;
    loan.mInfo.minorChildren = obj.minorChildren;
    loan.mInfo.consortHeadship = obj.consortHeadship;
    loan.mInfo.consortCellphone = obj.consortCellphone;
    loan.mInfo.consortIncome = obj.consortIncome;
    loan.mInfo.isCoborrower = obj.isCoborrower; //配偶是否共借人
    loan.applicationObj.relativeAgreement = obj.relativeAgreement;  //房屋 第三方额度号
    loan.applicationObj.developer = obj.developer;  //楼盘开发商
    loan.applicationObj.summary = obj.summary;//楼盘项目
    loan.applicationObj.buildId = obj.buildId;
    loan.applicationObj.buildingAddress = obj.buildingAddress; //房屋地址
    loan.applicationObj.buildingStau = obj.buildingStau;//房屋状态
    loan.applicationObj.buildingPurpose = obj.buildingPurpose;//房屋用途
    loan.applicationObj.buildingSea = obj.buildingSea;//建筑面积
    loan.applicationObj.buildingDan = obj.buildingDan;//单价
    loan.applicationObj.buildingZong = obj.buildingZong;//房屋总价
    loan.applicationObj.buildingFMoney = obj.buildingFMoney;//首付款金额
    loan.applicationObj.buildingFuMoney = obj.buildingFuMoney;//借款金额
    loan.applicationObj.buildingFuTime = obj.buildingFuTime;//借款期限
    loan.applicationObj.buildingType = obj.buildingType;//还款方式
    loan.applicationObj.buildingExplain = obj.buildingExplain;//还款计划说明
    loan.applicationObj.accout = obj.accout;//还款账号
    loan.applicationObj.accoutType = obj.accoutType;//凭证类型
    loan.applicationObj.fuJian = obj.fuJian; //上传附件
    loan.applicationObj.manager = obj.manager;//客户经理
    loan.applicationObj.uploadTime = obj.uploadTime; //本地上传时间
    loan.applicationObj.shopHouseNum = obj.shopHouseNum;
    loan.applicationObj.shopHouseArea = obj.shopHouseArea;
    loan.applicationObj.hadHouseArea = obj.hadHouseArea;
    //未显示在页面上的上传字段
    loan.organCode = obj.organCode; //los机构
    loan.mInfo.country = obj.country;//国籍
    loan.mInfo.nativePlace = obj.nativePlace; //户籍地址
    loan.mInfo.creditCategory = obj.creditCategory; //授信客户分类
    loan.mInfo.clStencil = obj.clStencil;//信用等级评估模板名称
    loan.mInfo.degree = obj.degree;//最高学位
    loan.mInfo.industry = obj.industry;//所属行业
    loan.mInfo.position = obj.position;//职称
    loan.mInfo.remark = obj.remark;//房产证号码
    loan.resource = obj.resource;
    //影像
    loan.applicationObj.mPicFileARR = obj.mpicFileARR.split('&&');//要打包的影像路径
    loan.applicationObj.mPicFileInfoARR = JSON.parse(obj.mpicFileInfoARR);
    loan.applicationObj.mPicFileMsgType = obj.mpicFileMsgType.split('&&');
    loan.mInfo.lianPic = obj.mcheckPhoto;
    if (loan.gInfo.isTrue) {
        loan.applicationObj.gPicFileARR = obj.gpicFileARR.split('&&');//要打包的影像路径
        loan.applicationObj.gPicFileInfoARR = JSON.parse(obj.gpicFileInfoARR);
        loan.applicationObj.gPicFileMsgType = obj.gpicFileMsgType.split('&&');
        loan.gInfo.lianPic = obj.gcheckPhoto;
        var nameNumP = obj.gimage.lastIndexOf('\/') +1;
        var checkNameP = obj.gimage.substring(nameNumP);
        loan.gInfo.image = MT_path + checkNameP;
        for(var i = 0;i<loan.applicationObj.gPicFileARR.length;i++){
            if(loan.applicationObj.gPicFileARR[i] !=''){
                var elIndexP = loan.applicationObj.gPicFileARR[i].lastIndexOf('\/') + 1;
                var fileNameP = loan.applicationObj.gPicFileARR[i].substring(elIndexP);
                loan.applicationObj.gPicFileARR[i] = MT_path +fileNameP;
            }else{
                loan.applicationObj.gPicFileARR[i] = '';
            }
        }
    }
    for(var k = 0;k<loan.applicationObj.mPicFileARR.length;k++){
        if(loan.applicationObj.mPicFileARR[k] !=''){
            var elIndex = loan.applicationObj.mPicFileARR[k].lastIndexOf('\/') + 1;
            var fileName = loan.applicationObj.mPicFileARR[k].substring(elIndex);
            loan.applicationObj.mPicFileARR[k] = MT_path +fileName;
        }else{
            loan.applicationObj.mPicFileARR[k] = '';
        }
    }

}

/**
 * 影像界面 反显
 */
function tempORpreToPic(obj){
    loan.mCLIENT_NO = obj.mCLIENT_NO;    //客户号
    loan.applicationObj.proType = obj.proType;  //产品代买
    loan.applicationObj.proCODE = obj.proCODE;  //产品代买
    loan.applicationObj.modifiable = obj.modifiable;
    commonJson.longitude = obj.REMARK1;//经度
    commonJson.latitude = obj.REMARK2;//纬度
    //主身份证信息
    if (obj.misTrue == '0') {
        loan.mInfo.isTrue = false;
    } else {
        loan.mInfo.isTrue = true;
    }
    if(obj.isPicturePage =='0'){
        loan.isPicturePage = false;
    }else{
        loan.isPicturePage = true;
    }
    if(obj.ispeiPicturePage =='0'){
        loan.ispeiPicturePage = false;
    }else{
        loan.ispeiPicturePage = true;
    }
    if(obj.isLoanMaster == '0'){
        loan.isLoanMaster = false; //设置
    }else{
        loan.isLoanMaster = true;
    }
    //if(obj.inputLogo == '0'){
        loan.inputLogo = false;
    //}else{
    //    loan.inputLogo = true;
    //}
    loan.organCode = obj.organCode; //los机构
    loan.mInfo.faceRecogn = obj.mfaceRecogn;
    loan.gInfo.faceRecogn = obj.gfaceRecogn;
    loan.mInfo.CheckResult = obj.mCheckResult;
    loan.gInfo.CheckResult = obj.gCheckResult;
    loan.resource = obj.resource;
    loan.mInfo.nation = obj.mNation;//
    loan.mInfo.cerNO = obj.mcerNo;
    loan.mInfo.address = obj.maddress;
    loan.mInfo.name = obj.mname;
    loan.mInfo.cerExpdDt = obj.mcerExpdDt;
    loan.mInfo.birthday = obj.mbirthday;
    loan.mInfo.sex = obj.msex;
    loan.mInfo.issAuthority = obj.missAuthority;
    var nameNumM = obj.mimage.lastIndexOf('\/') + 1;
    var checkNameM = obj.mimage.substring(nameNumM);
    loan.mInfo.image = MT_path +checkNameM;
    loan.mInfo.MGCompareFace = obj.mMGCompareFace;
    //配偶身份证信息
    if (obj.gisTrue == '0') {
        loan.gInfo.isTrue = false;
    } else {
        loan.gInfo.isTrue = true;
    }
    loan.gInfo.nation = obj.gNation;//
    loan.gInfo.cerNO = obj.gcerNo;
    loan.gInfo.address = obj.gaddress;
    loan.gInfo.name = obj.gname;
    loan.gInfo.cerExpdDt = obj.gcerExpdDt;
    loan.gInfo.birthday = obj.gbirthday;
    loan.gInfo.sex = obj.gsex;
    loan.gInfo.issAuthority = obj.gissAuthority;
    loan.gInfo.MGCompareFace = obj.gMGCompareFace;
    //影像
    loan.applicationObj.mPicFileARR = obj.mpicFileARR.split('&&');//要打包的影像路径
    loan.applicationObj.mPicFileInfoARR = JSON.parse(obj.mpicFileInfoARR);
    loan.applicationObj.mPicFileMsgType = obj.mpicFileMsgType.split('&&');
    loan.mInfo.lianPic = obj.mcheckPhoto;
    if (loan.gInfo.isTrue) {
        loan.applicationObj.gPicFileARR = obj.gpicFileARR.split('&&');//要打包的影像路径
        loan.applicationObj.gPicFileInfoARR = JSON.parse(obj.gpicFileInfoARR);
        loan.applicationObj.gPicFileMsgType = obj.gpicFileMsgType.split('&&');
        loan.gInfo.lianPic = obj.gcheckPhoto;
        var nameNumP = obj.gimage.lastIndexOf('\/') +1;
        var checkNameP = obj.gimage.substring(nameNumP);
        loan.gInfo.image = MT_path + checkNameP;
        for(var i = 0;i<loan.applicationObj.gPicFileARR.length;i++){
            if(loan.applicationObj.gPicFileARR[i] !=''){
                var elIndexP = loan.applicationObj.gPicFileARR[i].lastIndexOf('\/') + 1;
                var fileNameP = loan.applicationObj.gPicFileARR[i].substring(elIndexP);
                loan.applicationObj.gPicFileARR[i] = MT_path +fileNameP;
            }else{
                loan.applicationObj.gPicFileARR[i] = '';
            }
        }
    }
    for(var k = 0;k<loan.applicationObj.mPicFileARR.length;k++){
        if(loan.applicationObj.mPicFileARR[k] !=''){
            var elIndex = loan.applicationObj.mPicFileARR[k].lastIndexOf('\/') + 1;
            var fileName = loan.applicationObj.mPicFileARR[k].substring(elIndex);
            loan.applicationObj.mPicFileARR[k] = MT_path +fileName;
        }else{
            loan.applicationObj.mPicFileARR[k] = '';
        }
    }
}

/**
 * 采集页面影像信息 ---->可用于:下一步  采集配偶影像资料  暂存
 */
function cachePictureLoan(PicFileARR,PicFileInfoARR,PicFileMsgType,idName){
    if( $(idName+' .img_box:eq(0) .camera-pic:eq(0)').length>0){
        loan.applicationObj.custFacePic = $(idName+' .img_box:eq(0) .camera-pic:eq(0)').attr('src'); //客户面部照片
    }else{
        loan.applicationObj.custFacePic ='';
    }
    if($(idName+' .img_box:eq(1) .camera-pic:eq(0)').length>0){
        loan.applicationObj.custAndCustOwnerPic = $(idName+' .img_box:eq(1) .camera-pic:eq(0)').attr('src'); //与客户合影照片
    }else{
        loan.applicationObj.custAndCustOwnerPic ='';
    }
    if($(idName+' .img_box:eq(2) .camera-pic:eq(0)').length>0){
        loan.applicationObj.frontIDCardPic = $(idName+' .img_box:eq(2) .camera-pic:eq(0)').attr('src'); //身份证正面
    }else{
        loan.applicationObj.frontIDCardPic = '';
    }
    if($(idName+' .img_box:eq(3) .camera-pic:eq(0)').length>0){
        loan.applicationObj.backIDCardPic = $(idName+' .img_box:eq(3) .camera-pic:eq(0)').attr('src'); //身份证反面
    }else{
        loan.applicationObj.backIDCardPic = '';
    }
    PicFileARR.push(loan.applicationObj.custFacePic, loan.applicationObj.custAndCustOwnerPic, loan.applicationObj.frontIDCardPic, loan.applicationObj.backIDCardPic);
    var len = $(idName+' .img_box').length;
    if (len - 4 > 0) {
        for (var i = 4; i < len; i++) {
            if ($(idName+' .img_box:eq(' + i + ') .camera-pic').length > 0) {
                PicFileARR.push($(idName+' .img_box:eq(' + i + ') .camera-pic:eq(0)').attr('src'));
                PicFileMsgType.push($(idName+' .img_box:eq(' + i + ') .camera-pic:eq(0)').closest('.customer').attr('picname'));
            }
        }
    }
    $.each(PicFileARR, function (index, el) {
        if (!el) return true;
        var elIndex = el.lastIndexOf('\/') + 1;
        PicFileInfoARR[0].b.push({
            FILE_NAME: el.substring(elIndex),
            FILE_TYPE: 'F0000'
        });
    });
}

/**
 * 工作台暂存  查询数据库贷款表
 **/
function queryLoanapplyTable(text, query) {
    queryTableDataByConditions({
        "databaseName": "myDatabase", //数据库名
        "tableName": "loanapply_info", //表名
        "conditions": query
    }, function (loanMsg) {
        queryLoanapplyTableSucc(loanMsg, text);
    }, function (err) {
        funDataFail(err);
    });
}
function queryLoanapplyTableSucc(loanMsg, text) {
    var textHtml = text;
    if (loanMsg != "") {
        loanMsg.reverse();
        var nT = myTime.CurTime();
        $.each(loanMsg, function (index, val) {
            var indexNum = index + workbenchJson.creditNum;
            if (nT - val.SUBMITTIME < 864000) {
                textHtml += "<li class='box-rows' data='" + JSON.stringify(val) + "' offlineOnline='" + val.offlineOnline + "' ind='" + Math.ceil(++indexNum / 7) + "' style='display:none'>" +
                    "<div style='width: 18%;'>" + val.BUSINESSTYPE + "</div>" +
                    "<div style='width: 18%;'>" + val.mname + "</div>" +
                    "<div style='width: 18%;'>" + val.mcerNo + "</div>" +
                    "<div style='width: 18%;'>" + myTime.UnixToDate(val.SUBMITTIME) + "</div>" +
                    "<div style='width: 28%;'>" + val.YWXS + "</div>" +
                    "</li>";
            } else {
                deleteTableData({
                    "databaseName": "myDatabase",
                    "tableName": "loanapply_info",
                    "conditions": [{
                        "SUBMITTIME": val.SUBMITTIME
                    }]
                }, function (msg) {
                }, function (err) {
                })
            }

        });
    }
    $('#gongzuotai-zcywjxbl .previous').removeClass('btn_next');
    $("#gongzuotai-zcywjxbl .box-content").html(textHtml == "" ? '<li style="text-align:center">查询无暂存业务</li>' : textHtml);
    //初始化分页第一页
    var pageNum = $("#gongzuotai-zcywjxbl .box-rows").length;
    $("#gongzuotai-zcywjxbl .box-rows").hide();
    $("#gongzuotai-zcywjxbl .box-rows[ind='1']").show();
    $("#gongzuotai-zcywjxbl .page-number-con").empty();
    //分页
    $("#gongzuotai-zcywjxbl .page-number-con").createPage({
        pageCount: (Math.ceil(pageNum / 7)),
        current: 1,
        backFn: function (p) {
            $("#gongzuotai-zcywjxbl .box-rows").hide();
            $("#gongzuotai-zcywjxbl .box-rows[ind=" + p + "]").show();
        }
    });
}
