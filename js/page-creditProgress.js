/**
 * Created by Administrator on 2015/10/20.
 * named by lei.
 */

/**
 * 公共方法-----（获取当前时间,年月日）
 * @param <int> spacer    间隔符
 * @param <bool>
 * @param <int>
 */

var appTime = {
    myCurDate: myTime.curDate(),
    suiDate: function (y, m, d, spacer, chaTime) {
        var date = myTime.curDate();
        var appDate;
        date.setFullYear(y, m - 1, d);
        var dateC = new Date((date.getTime() - chaTime));
        var myY = dateC.getFullYear();  //年
        var myM = dateC.getMonth() < 9 ? ('0' + (dateC.getMonth() + 1)) : (dateC.getMonth() + 1);   //月
        var myD = dateC.getDate() < 10 ? ('0' + dateC.getDate()) : dateC.getDate();      //日
        appDate = myY + spacer + myM + spacer + myD;
        return appDate;
    },
    appCurDate: function (spacer) {   //当前时间的年月日
    	appTime.myCurDate = myTime.curDate();
        var appDate;
        var myY = appTime.myCurDate.getFullYear();  //年
        var myM = appTime.myCurDate.getMonth() < 9 ? '0' + (appTime.myCurDate.getMonth() + 1) : appTime.myCurDate.getMonth() + 1;   //月
        var myD = appTime.myCurDate.getDate() < 10 ? '0' + appTime.myCurDate.getDate() : appTime.myCurDate.getDate();      //日
        appDate = myY + spacer + myM + spacer + myD;
        return appDate;
    },
    appPreDate: function (spacer, chaTime) {   //之前时间的年月日
    	appTime.myCurDate = myTime.curDate();
        var appDate;
        var beforeTime = appTime.myCurDate.getTime() - chaTime;
        appTime.myPreDate = new Date(beforeTime);
        var myY = appTime.myPreDate.getFullYear();  //年
        var myM = appTime.myPreDate.getMonth() < 9 ? '0' + (appTime.myPreDate.getMonth() + 1) : appTime.myPreDate.getMonth() + 1;   //月
        var myD = appTime.myPreDate.getDate() < 10 ? '0' + appTime.myPreDate.getDate() : appTime.myPreDate.getDate();      //日
        appDate = myY + spacer + myM + spacer + myD;
        return appDate;
    }
}

$(document).on("pageshow", "#credit-jinduchaxun", function () {
    var dataEnd = appTime.appCurDate('');     //当前时间
    var dataStart = appTime.appPreDate('', 1000 * 60 * 60 * 24 * 10);
    $("#seach-day").css("margin-top", ($(window).height() - 365) / 2);
    $("#seach-undone").css("margin-top", ($(window).height() - 439) / 2);
    $("#jieshuDate, #end_date_ud").val(appTime.appCurDate('-'));
    $("#kaishiDate").val(appTime.appPreDate('-', 1000 * 60 * 60 * 24 * 10));
    $("#start_date_ud").val(appTime.appPreDate('-', 1000 * 60 * 60 * 24 * 30));
    
    //20161022  byliuwg
    var textHtml = '<option value='+commonJson.adminCount+'>'+commonJson.adminCount+" "+commonJson.TLRNAME +'</option><option value="">全部</option>';
		$('#operaterNo').html(textHtml).selectmenu('refresh');
    
    /*点击事件*/
    $(".seach-botton").on("click", function () {   //搜索按钮
        if($(".creditNav>div:first").hasClass('creditSelected')){
            $("#seach-day-con").show();
        }else{
            $("#seach-undone-con").show();
        }
    });
    $("#btn_cancel_done").on("click", function () { //点击隐藏搜索框
        $("#seach-day-con").hide();
    });
    $('#btn_cancel_ud').on('click',function(){
        $("#seach-undone-con").hide();
    });

    $(".creditNav>div:first").on('click', function () {
    	$('#credit-jinduchaxun-btn').removeClass('btn_next');
        if (!$(this).hasClass('creditSelected')) {
            $(this).addClass('creditSelected');
            $(this).siblings('div').removeClass('creditSelected');
            applicationObj.responseCode = '';
            showLoader("信用卡办理进度查询中...");
            var dataEnd = appTime.appCurDate('');     //当前时间
            var dataStart = appTime.appPreDate('', 1000 * 60 * 60 * 24 * 10);
            var aboutJson = {      //发送请求的参数
                "b": [{
                    "deviceNo.s": commonJson.udId, //设备编号
                    "moduleId.s": creditJson.moduleID, //模块编号
                    "tranId.s": '21',//creditJson.tranId, //交易编号
                    "orgId.s": commonJson.orgId,//机构号commonJson.orgId
                    "operatorNo.s": commonJson.adminCount,//操作员commonJson.adminCount
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "IDTYPE.s": '',      //证件类型
                    "IDNO.s": '',       //证件号码
                    "APPDATESTART.s": dataStart,    //申请日期开始
                    "APPDATEEND.s": dataEnd,      //申请日期结束
                    "BRNO.s": '',//commonJson.orgId,         //推广人机构代码
                    "TLRNO.s": commonJson.SPRNUM,       // 推广人编号
                    "CURRENT_NUM.s": '1'
                }]
            };
            applicationObj.pageIndex = 1;
            applicationObj.bussinessDetail = aboutJson;
            getCardApplicationFun(aboutJson, function (msg) {
                getCardApplicationSucc(msg);
            }, function (err) {
                hideLoader();
                funFail(err);
                $('div.creditNav div').toggleClass('creditSelected');
            });
        }
    });
    $(".creditNav>div:last").on('click', function () {
    	$('#credit-jinduchaxun-btn').removeClass('btn_next');
        if (!$(this).hasClass('creditSelected')) {
            $(this).addClass('creditSelected');
            $(this).siblings('div').removeClass('creditSelected');
            showLoader("信用卡办理进度查询中...");
            var dataEnd = appTime.appCurDate('');     //当前时间
            var dataStart = appTime.appPreDate('', 1000 * 60 * 60 * 24 * 30);
            var sendJson = {
                "b": [{
                    "deviceNo.s": commonJson.udId, //设备编号
                    "moduleId.s": creditJson.moduleID, //模块编号
                    "tranId.s": '21',//creditJson.tranId, //交易编号
                    "orgId.s": commonJson.orgId,//机构号commonJson.orgId
                    "operatorNo.s": commonJson.adminCount,//操作员commonJson.adminCount
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "page.s": 1,
                    "certNum.s": '',//证件号码
                    "minDate.s": dataStart,//申请时间
                    "maxDate.s": dataEnd,//申请时间
                    "reqOperaterNo.s":commonJson.adminCount//查询受理申请的客户经理编号,默认查询本人经办申请信息
                }]
            };
            applicationObj.pageIndex = 1;
            applicationObj.bussinessDetail = sendJson;
            findAdditionalsFun(sendJson, function (msg) {
                findAdditionalsSucc(msg);
            }, function (err) {
                funFail(err);
                $('div.creditNav div').toggleClass('creditSelected');
            });
        }
    });
    //点击导航栏
    // $('.creditNav>div').on('click', function () {
    //     if (!$(this).hasClass('creditSelected')) {
    //         return;
    //     }
    // });
    applicationObj.numIndex = '';
    applicationObj.responseCode = '';
    showLoader("信用卡办理进度查询中...");
    var aboutJson = {      //发送请求的参数
        "b": [{
            "deviceNo.s": commonJson.udId, //设备编号
            "moduleId.s": creditJson.moduleID, //模块编号
            "tranId.s": '21',//creditJson.tranId, //交易编号
            "orgId.s": commonJson.orgId,//机构号commonJson.orgId
            "operatorNo.s": commonJson.adminCount,//操作员commonJson.adminCount
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "IDTYPE.s": '',      //证件类型
            "IDNO.s": '',       //证件号码
            "APPDATESTART.s": dataStart,    //申请日期开始
            "APPDATEEND.s": dataEnd,      //申请日期结束
            "BRNO.s": '',//commonJson.orgId,         //推广人机构代码
            "TLRNO.s": commonJson.SPRNUM,       // 推广人编号
            "CURRENT_NUM.s": '1'
        }]
    };
    applicationObj.pageIndex = 1;
    applicationObj.bussinessDetail = aboutJson;
    getCardApplicationFun(aboutJson, function (msg) {
        getCardApplicationSucc(msg);
    }, function (err) {
        hideLoader();
        funFail(err);
    });

    //点击搜素按钮按条件搜索(已提交)
    $('#btn_sure_done').on('click', function () {
        //获取要查询的时间
        if ($('#kaishiDate').val() == '' || $('#jieshuDate').val() == '') {
            showTags({
                'title': '提示',
                'content': '请输入查询时间！',
                'ok': {}
            });
            return;
        }
        var timeStart = $('#kaishiDate').val().replace(/-/g, '');
        var timeCompareE = $('#jieshuDate').val().split('-');
        var timeEnd = $('#jieshuDate').val().replace(/-/g, '');
        var timeCompareS = appTime.suiDate(timeCompareE[0], timeCompareE[1], timeCompareE[2], '', 1000 * 60 * 60 * 24 * 30);
        if (timeStart < timeCompareS) {
            showTags({
                'title': '提示',
                'content': '对不起，搜索区间应不大于30天！',
                'ok': {}
            });
            return;
        }
        //验证时间
        if (timeEnd < timeStart) {
            showTags({
                'title': '提示',
                'content': '对不起，搜索开始时间应不大于搜索结束时间！',
                'ok': {}
            });
            return;
        }
        var suoJson;
        if ($('.input-test-con').eq(0).val() == '') {  //说明使用推广人机构代码和推广人编号查询
            suoJson = {      //发送请求的参数
                "b": [{
                    "deviceNo.s": commonJson.udId, //设备编号
                    "moduleId.s": creditJson.moduleID, //模块编号
                    "tranId.s": '21',//creditJson.tranId, //交易编号
                    "orgId.s": commonJson.orgId,//机构号commonJson.orgId
                    "operatorNo.s": commonJson.adminCount,//操作员commonJson.adminCount
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "IDTYPE.s": '',      //证件类型   0:身份证
                    "IDNO.s": '',       //证件号码
                    "APPDATESTART.s": timeStart,    //申请日期开始
                    "APPDATEEND.s": timeEnd,      //申请日期结束
                    "BRNO.s": '',//commonJson.orgId,              //推广人机构代码
                    "TLRNO.s": commonJson.SPRNUM,        // 推广人编号
                    "CURRENT_NUM.s": '1'
                }]
            };
            applicationObj.pageIndex = 1;
            applicationObj.bussinessDetail = suoJson;
        } else {      //使用身份证进行查询
            suoJson = {      //发送请求的参数
                "b": [{
                    "deviceNo.s": commonJson.udId, //设备编号
                    "moduleId.s": creditJson.moduleID, //模块编号
                    "tranId.s": '21',//creditJson.tranId, //交易编号
                    "orgId.s": commonJson.orgId,//机构号commonJson.orgId
                    "operatorNo.s": commonJson.adminCount,//操作员commonJson.adminCount
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "IDTYPE.s": '0',      //证件类型  1:    2:身份证
                    "IDNO.s": $('.input-test-con').eq(0).val(),       //证件号码
                    "APPDATESTART.s": timeStart,    //申请日期开始
                    "APPDATEEND.s": timeEnd,      //申请日期结束
                    "BRNO.s": '',              //推广人机构代码
                    "TLRNO.s": '',        // 推广人编号
                    "CURRENT_NUM.s": '1'
                }]
            };
            //验证身份证
            if (!(fmReg.cerNo.test($('.input-test-con').eq(0).val()))) {
                showMsg('您输入的身份证有误，请重新输入！');
                return false;
            }
            applicationObj.pageIndex = 1;
            applicationObj.bussinessDetail = suoJson;
        }
        $("#seach-day-con").hide();
        showLoader("信用卡办理进度查询中...");
        getCardApplicationFun(suoJson, function (msg) {
            getCardApplicationSucc(msg);
        }, function (err) {
            hideLoader();
            funFail(err);
        });
    });

    //点击搜素按钮按条件搜索(未提交)
    $('#btn_sure_ud').on('click', function () {
        var timeStart = "",
            timeEnd = "",
            certNum = "",
            masCardName = "",
            mobileNum = "",
            scheduledStatus = "";
        certNum = $('#ipt-certNo').val();
        if(certNum !== "" && !(fmReg.cerNo.test(certNum))){
            showMsg('您输入的身份证有误，请重新输入！');
            return false;
        }
        mobileNum = $('#ipt-phoneNo').val();
        if(mobileNum !== "" && !(fmReg.mobile.test(mobileNum))){
            showMsg('您输入的手机号码有误，请重新输入！');
            return false;
        }
        if ($('#start_date_ud').val() === '' || $('#end_date_ud').val() === '') {
            showTags({
                'title': '提示',
                'content': '请输入查询时间！',
                'ok': {}
            });
            return;
        }
        timeStart = $('#start_date_ud').val().replace(/-/g, '');
        timeEnd = $('#end_date_ud').val().replace(/-/g, '');
        if (timeEnd < timeStart) {
            showTags({
                'title': '提示',
                'content': '对不起，搜索开始时间应不大于搜索结束时间！',
                'ok': {}
            });
            return;
        }
        var timeCompareE = $('#end_date_ud').val().split('-');
        var timeCompareS = appTime.suiDate(timeCompareE[0], timeCompareE[1], timeCompareE[2], '', 1000 * 60 * 60 * 24 * 30);
        if (timeStart < timeCompareS) {
            showTags({
                'title': '提示',
                'content': '对不起，搜索区间应不大于30天！',
                'ok': {}
            });
            return;
        }
        masCardName = $('#ipt-custName').val().trim();
        scheduledStatus = $('#slt-statu').val();
        var operaterNo=$('#operaterNo').val();
        $("#seach-undone-con").hide();
        showLoader("信用卡办理进度查询中...");
        var sendJson = {
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": creditJson.moduleID, //模块编号
                "tranId.s": '21',//creditJson.tranId, //交易编号
                "orgId.s": commonJson.orgId,//机构号commonJson.orgId
                "operatorNo.s": commonJson.adminCount,//操作员commonJson.adminCount
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "page.s": 1,
                "certNum.s": certNum,//证件号码
                "minDate.s": timeStart,//申请时间
                "maxDate.s": timeEnd,//申请时间
                "masCardName.s": masCardName,//申请人
                "scheduledStatus.s": scheduledStatus,//申请状态
                "mobileNum.s": mobileNum,
                "reqOperaterNo.s":operaterNo//查询受理申请的客户经理编号
            }]
        };
        applicationObj.pageIndex = 1;
        applicationObj.bussinessDetail = sendJson;
        findAdditionalsFun(sendJson, function (msg) {
            findAdditionalsSucc(msg);
        }, function (err) {
            funFail(err);
        });
    });

    //点击补充资料按钮
    $("#credit-jinduchaxun-btn").on("click", function () {
        if (!($('#credit-jinduchaxun-btn').hasClass('btn_next')))return;
        if ($(".creditNav>div:first").hasClass('creditSelected')) {
            applicationObj.tFtype = '1';
        } else {
            applicationObj.tFtype = '2';
        }
        if ($('#credit-jinduchaxun .box-content').find('.click')) {
            applicationObj.numIndex = $('#credit-jinduchaxun .box-content').find('.click').index();
        }
        if(applicationObj.tFtype == '1'){//已提交信用卡系统返回
        	var imgNo = applicationObj.responseCode[applicationObj.numIndex].applicationInfosVO[0].IMAGEBARCODE;
//      	console.log(imgNo);
        	isMeapImgNo = /^[0-9]{2}04\d{8}$/;//移动平台进件
//      	console.log(isMeapImgNo.test(imgNo));
        	if(!isMeapImgNo.test(imgNo)){
        		showTags({
				'title': '提示',
				'content': '该进件非移动平台渠道，暂不支持跨渠道补件！',
				'ok': {
					'title': '确定',
					'fun': function() {}
				}
			});
        	}else{
        		$.mobile.changePage('credit-progressInquiry.html');
        	}
        	
        }else{
        	var applydate = applicationObj.responseCode[applicationObj.numIndex+1].cardClaimsVO[0].CREATEDATE;
        	applydate = dateToYMDhms(applydate,false);
//      	console.log('申请'+applydate);
        	var daythirtyrago = appTime.appPreDate('-', 1000 * 60 * 60 * 24 * 30);
//      	console.log(daythirtyrago);
//      	console.log(Date.parse(daythirtyrago.replace(/-/g,'/')) > Date.parse(applydate.replace(/-/g,'/')));
        	if(Date.parse(daythirtyrago.replace(/-/g,'/')) > Date.parse(applydate.replace(/-/g,'/'))){
        		showTags({
				'title': '提示',
				'content': '该进件距今日超过30天，不再支持补件交易！',
				'ok': {
					'title': '确定',
					'fun': function() {}
				}
			});
        	}else{
        		$.mobile.changePage('credit-progressInquiry.html');
        	}
        	
        }
        
        
    });
});

$(document).on("pageshow", "#credit-progressInquiry", function () {
    var creditphotoNum = 0; //拍照数量(已提交信用卡系统)
    var creditImgObj = {};  //图片
    applicationObj.picFileARR = [];
    var busiGloablaSeq = '';  //待补件的业务编号
    if (applicationObj.tFtype == '1') {
        $('.additional-materials-left li').eq(1).find('span').text(applicationObj.responseCode[applicationObj.numIndex].applicationInfosVO[0].PAINAME);  //申请人
        $('.additional-materials-left li').eq(3).find('span').text(applicationObj.responseCode[applicationObj.numIndex].applicationInfosVO[0].IDNO);     //身份证
        $('.additional-materials-left li').eq(5).find('span').text(paiTypeObj[applicationObj.responseCode[applicationObj.numIndex].applicationInfosVO[0].PAITYPE]);     //申请类型
        var CREATEDATE = (applicationObj.responseCode[applicationObj.numIndex].applicationInfosVO[0].CREATEDATE.substring(0, 4)) + '年' + (applicationObj.responseCode[applicationObj.numIndex].applicationInfosVO[0].CREATEDATE.substring(4, 6)) + '月' + (applicationObj.responseCode[applicationObj.numIndex].applicationInfosVO[0].CREATEDATE.substring(6, 8)) + '日';
        $('.additional-materials-left li').eq(6).find('span').text(CREATEDATE);              //申请日期
        $('.additional-materials-left li').eq(7).find('.disReson').text(applicationObj.responseCode[applicationObj.numIndex].applicationInfosVO[0].REFUSERESON);
        var ImgNo = applicationObj.responseCode[applicationObj.numIndex].applicationInfosVO[0].IMAGEBARCODE;
//      console.log(ImgNo);
        busiGloablaSeq = ImgNo.replace(/^[0-9]{2}/g,'00');
//      console.log('替换后'+busiGloablaSeq);
        $('#btn-next').removeClass('btn_next');
    } else {
        applicationObj.numIndex++;
        $('.additional-materials-left li').eq(1).find('span').text(applicationObj.responseCode[applicationObj.numIndex].cardClaimsVO[0].MASCARDNAME);  //申请人
        $('.additional-materials-left li').eq(3).find('span').text(applicationObj.responseCode[applicationObj.numIndex].cardClaimsVO[0].CERTNUM);     //身份证
        $('.additional-materials-left li').eq(5).find('span').text(paiTypeObj[applicationObj.responseCode[applicationObj.numIndex].cardClaimsVO[0].MASTERFLAG]);     //申请类型
        $('.additional-materials-left li').eq(6).find('span').text(applicationObj.responseCode[applicationObj.numIndex].cardClaimsVO[0].CREATEDATE);              //申请日期
        $('.additional-materials-left li').eq(7).hide();
        busiGloablaSeq = applicationObj.responseCode[applicationObj.numIndex].cardClaimsVO[0].PLATGLOBALSEQ;
        $('#btn-next').addClass('btn_next');
    }
    var imgSwiper = new Swiper('.img-swiper-container', {
        pagination: '.swiper-pagination',
        observer: true
    });

    var imgWrapperCon = $('#swiper-wrapper-con');
    //切换图片内容
    $('#c-edu').on('change', function () {
        var opV = $(this).val();
        if(opV == '-1'){
            imgWrapperCon.html('');
        }else{
            if(creditImgObj.hasOwnProperty(opV) && creditImgObj[opV].length > 0){
                //alert('存在');
                var sliderHtml ='';
                $.each(creditImgObj[opV],function (index, ele) {
                    sliderHtml += '<div class="swiper-slide" style="overflow: hidden;" imgIndex="' + ele.imgIndex + '" valueIndex="' + opV + '">' +
                        '<img src="../../images/ic_delete.png" class="lajitong_icon"/>' +
                        '<img src="' + ele.imgSrc + '" class="camera-pic"/></div>'

                });
                imgWrapperCon.html(sliderHtml);
            }else{
                imgWrapperCon.html('');
            }
        }
    });
    //计算图片数量
    function imgNumber(){
        var opVObj = $('#c-edu option:selected');
        var imgNum = imgWrapperCon.children('.swiper-slide').length;
        var _num = opVObj.find('.img-num');
        if(!_num.length){
            _num = $('<span class="img-num"></span>');
            opVObj.append(_num);
        }
        if(imgNum == 0){
            _num.remove();
        }else{
            _num.show().html('('+imgNum+')');
        }
    }
    //点击拍照
    $('#credit-progressInquiry .additional-materials-paishe').on('click', function () {
        //获取拍摄的option的文本和value
        var opV = $('#c-edu option:selected').val();
        if(opV == '-1'){
            showTags({
                'title': '提示',
                'content': '请选择拍照内容！',
                'ok': {}
            });
            return false;
        }
        var myTime = new Date().getTime();//时间戳
        var picName = $('#c-edu option:selected').attr('picName');// + commonJson.udId + myTime;
        Meap.media('camera', picName, function (msg) {
            if (creditImgObj[opV] == undefined) {
                creditImgObj[opV] = [];
            }
            var imgCon = {
                'valueIndex': opV, //value值
                'imgIndex': '', //图片索引
                'imgName': picName,  //图片名字
                'imgSrc': msg
            };
            creditImgObj[opV].push(imgCon);
            var opVNum = creditImgObj[opV].indexOf(imgCon);
            creditImgObj[opV][opVNum].imgIndex = opVNum;
            imgWrapperCon.prepend('<div class="swiper-slide" style="overflow: hidden !important;" imgIndex="' + opVNum + '" valueIndex="' + opV + '"><img src="../../images/ic_delete.png" class="lajitong_icon"/><img src="' + msg + '" class="camera-pic"/></div>');
            imgNumber();
            $("#c-edu").selectmenu('refresh');
            if(applicationObj.tFtype == '1'){
                if(creditphotoNum === 0){
                    $('#btn-next').addClass('btn_next');
                }
                creditphotoNum++;
            }
        }, function (err) {
            showMsg(err);
        });
    });
    //删除图片
    imgWrapperCon.delegate(".lajitong_icon","click", function () {
        var _this = $(this);
        showTags({
            'title': '提示',
            'content': '你确定要删除该图片吗？',
            'ok': {
        		'title': '取消', //非必输  默认值：确定
				'fun': function() {}
            },
            'cancel': {
        		'title': '确定', //非必输  默认值：取消
        		'fun': function() {
                    var imgIndex = _this.parents('.swiper-slide').attr('imgIndex');
                    var obj;
                    var curIndex;
                    var valueIndex = _this.parents('.swiper-slide').attr('valueIndex');
                    $.each(creditImgObj[valueIndex],function (index, ele) {
                        if(ele.imgIndex == imgIndex){
                            obj = ele;
                            curIndex = index;
                        }
                    });
                   // var obj = creditImgObj[valueIndex];  //要删除的图片数组
                    var imgArr = [obj.imgSrc];
                    deletePhoto(imgArr, function (msg) {
                        creditImgObj[valueIndex].splice(curIndex,1);
                        if(_this.parents('.swiper-slide').length) _this.parents('.swiper-slide').remove();
                        imgNumber();
                        $("#c-edu").selectmenu('refresh');
                    }, function (err) {
                        alert('删除图片失败!');
                    });
                    if(applicationObj.tFtype == '1'){
                        creditphotoNum--;
                        if(creditphotoNum === 0){
                            $('#btn-next').removeClass('btn_next');
                        }
                    }
				}
			}
        });
        return false;
    });

    //点击提交完成按钮
    $('.footter .previous').on('click', function () {
        if(!$('#btn-next').hasClass('btn_next')){
            return;
        }
//      applicationObj.picFileInfoARR = [{
//          "b": []
//      }];
		applicationObj.picFileARR = [];
        for (var x in creditImgObj) {
            if(creditImgObj[x].length >0){
                $.each(creditImgObj[x],function(index,ele){
                    applicationObj.picFileARR.push(ele.imgSrc);
                });
            }
        }
//      $.each(applicationObj.picFileARR, function (index, el) {
//          if (!el) return true;
//          var elIndex = el.lastIndexOf('\/') + 1;
//          applicationObj.picFileInfoARR[0].b.push({
//              FILE_NAME: el.substring(elIndex),
//              FILE_TYPE: 'F0000'
//          });
//      });
        if(applicationObj.picFileARR.length > 0){
            var sendJson = {
                "b":[{
                    "deviceNo.s": commonJson.udId, //设备编号
                    "moduleId.s": creditJson.moduleID, //模块编号
                    "tranId.s": '21',//loan.tranId, //交易编号
                    "orgId.s": commonJson.orgId,//机构号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "CLIENT_NAME.s":$('.additional-materials-left li').eq(1).find('span').text(),//客户姓名
                    "DOCUMENT_TYPE.s":'0',//证件类型
                    "resend.s":'1',//补充资料
                    "fileCount.s":'1',//补充资料文件的数量
                    "DOCUMENT_ID.s":$('.additional-materials-left li').eq(3).find('span').text()//证件号码
                }]
            };
            creditPgsImgupload(sendJson);
        } else {      //没有拍照点击完成
            hideLoader();
            showTags({
                'title': '提示',
                'content': '未拍摄任何影像，是否提交信用卡申请？',
                'ok': {
                    'title':'返回拍摄',
                    'fun': function() {}
                },
                'cancel': {
                    'title':'提交申请',
                    'fun': function() {
                        noPhotoApplyCreditPgs();
                    }
                }
            });
        }
    });

    //补件压缩插库
    function creditPgsImgupload(sendJson){
        showLoader("信用卡补充资料提交中...");
        getPlatGlobalSeqFun(sendJson, function (msg) {
            var responseBody = responseBodySuccFormat(msg);
            if (responseBody[0].results == '00') {
                applicationObj.plSeq = responseBody[0].platGlobalSeq;//获取平台流水号
                var phoneTime = myTime.CurTime();
                //影像上传文件打包压缩插件
                Meap.zipCompression(applicationObj.plSeq, applicationObj.picFileARR, function (msg1) {
                    //将要上传的影像插入到ios断点上传的数据库中
                    //影像上传 业务参数
                    var appBussPhone = {
                        'busiGloablaSeq': busiGloablaSeq, //业务编号
                        'attchType': '0', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
                        'deviceNo': commonJson.udId, //设备编号
                        'moduleId': creditJson.moduleID, //模块编号
                        'tranId': '21',//creditJson.tranId, //交易编号
                        'orgId': commonJson.orgId, //机构编号
                        'operatorNo': commonJson.adminCount, //操作员
                        'custName':  $('.additional-materials-left li').eq(1).find('span').text(), //客户名称
                        'custCredType': '0', //客户证件类型
                        'custCredNo': $('.additional-materials-left li').eq(3).find('span').text(), //客户证件号
                        'offlineOnline': commonJson.offlineOnline, //脱机/联机
                        'workAddress': commonJson.workAddress, //工作地址
                        //'FILE_ADD': applicationObj.picFileInfoARR[0].b, //每个图片的名称和类型
                        'OPER_TYPE': 'MOD',  //平台待补件 MOD_PL
                        'userId': '9107',//orgIdToUserId[commonJson.orgId], //柜员号
                        'branchId': '00862',//commonJson.orgId //机构号
                        'state':''  //待补件状态
                    };
                    if(applicationObj.tFtype !='1'){  //未提交信用卡系统
                        appBussPhone.state = '-5';
                        appBussPhone.OPER_TYPE = 'MOD_PL';
                    }
                    appBussPhone = JSON.stringify(appBussPhone);
                    var sendDataJson = {
                        "databaseName": "myDatabase",
                        "tableName": "up_download_info",
                        "data": [{
                            "fileToken": phoneTime, //文件唯一ID(可以为时间挫
                            "pos": "0", //文件的断点信息(初始为0)
                            "filePath": msg1, //文件路径
                            "appPath": "c001", //自定义文件路径
                            "appBuss": appBussPhone, //业务参数
                            "downloadToken": "", //文件的下载ID(初始为空)
                            "leng": "1", //文件的长度(初始为1)
                            "isNotice": "yes", //是否调用后台(一直是yes)
                            "fileType": "0",
                            "REMARK1": "02" //上传状态02-成功
                        }]
                    };
                    insertTableData(sendDataJson, function (msg2) {
                        hideLoader();
                        $.mobile.changePage('credit-jinduchaxun.html');
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
                        'content': '影像压缩失败！',
                        'ok': {}
                    });
                });
            } else if (responseBody[0].results == '08'){
                hideLoader();
//              creditPgsImgupload(sendJson);
            } else {
                hideLoader();
                showTags({
                    'title': '提示',
                    'content': responseBody[0].message,
                    'ok': {}
                });
            }
        }, function (err) {
            funFail(err);
        });
    }

    //修改信用卡申请状态
    function noPhotoApplyCreditPgs(){
        if(applicationObj.responseCode[applicationObj.numIndex].cardClaimsVO[0].SCHEDULEDSTATUS !== "-5"){
            $.mobile.changePage("credit-jinduchaxun.html", {reverse: true});
            return;     //若状态不为待补件则不处理
        }
        showLoader("提交中");
        var platGlobalSeq = applicationObj.responseCode[applicationObj.numIndex].cardClaimsVO[0].PLATGLOBALSEQ;
        var scheduledStatus = "0";  //0-申请中
        var sendJson = {
                "b" : [{
                    "PLATGLOBALSEQ.s"       : platGlobalSeq,           //平台流水号
                    "SCHEDULEDSTATUS.s"     : scheduledStatus,          //申请状态
                    "deviceNo.s"            : commonJson.udId,              //设备编号
                    "moduleId.s"            : creditJson.moduleID,    //模块名
                    "tranId.s"              : '21',      //交易名
                    "orgId.s"               : commonJson.orgId,             //机构号
                    "operatorNo.s"          : commonJson.adminCount,        //操作员
                    "offlineOnline.s"       : commonJson.offlineOnline,     //脱机/联机
                    "workAddress.s"         : commonJson.workAddress       //工作地址
                }]
            };
        updateScheduleStatusFun(sendJson, function(msg){
            hideLoader();
            msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
            var responseBody = (JSON.parse(msg)).b;
            if (responseBody[0].results == '00') {
                $.mobile.changePage("credit-jinduchaxun.html", {reverse: true});
            } else if (responseBody[0].results == "08") {//session过期重新登陆请求
                noPhotoApplyCreditPgs();
            } else {
                showTags({
                    'content': responseBody[0].message,
                    'ok': {}
                });
            }
        }, function(err){
            setTimeout(function(){//延时执行,避免showTags的弹窗异步hideTags了
                funFail(err);
            },500);
        });
    }
});