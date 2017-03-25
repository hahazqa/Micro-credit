/**
 * Created by lei on 2015/10/20.
 */


/*信用卡进度查询  成功回调*/
function getCardApplicationSucc(msg) {
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == "00") {    // 接口处理成功
    	$('.box-header>div:last').css('display','block');
	    $('.box-header>div').css('width','15%');
	    $('.box-header>div:last').css('width','25%');
        applicationObj.cardApplicationVO=responseCode[1].cardApplicationVO[0];
        applicationObj.responseCode=responseCode[1].cardApplicationVO[1].APPLICATIONINFOS_ARRAY;
        var textHtml = '';
        if(applicationObj.responseCode.length>0){
            $.each(applicationObj.responseCode,function(index, val) {
                //if(val.applicationInfosVO[0].REFUSERESON!=''){
                //    refusereson=val.applicationInfosVO[0].REFUSERESON;
                //}else{
                //    refusereson='';
                //}
                textHtml += '<li class="box-rows">' +
                    '<div>' + val.applicationInfosVO[0].PAINAME + '</div>' +
                    '<div>' + val.applicationInfosVO[0].IDNO + '</div>' +
                    '<div>' + val.applicationInfosVO[0].CREATEDATE + '</div>' +
                    '<div>' + paiTypeObj[val.applicationInfosVO[0].PAITYPE] + '</div>' +
                    '<div attyy="'+val.applicationInfosVO[0].BOLTSTATE+'">' + pcardStatusObj[val.applicationInfosVO[0].PCARDARRPOVESTATUS];
               if(val.applicationInfosVO[0].BOLTSTATE == "01" || val.applicationInfosVO[0].BOLTSTATE == "02"){
               	 textHtml += "(" + pcardStatusObjj[val.applicationInfosVO[0].BOLTSTATE] + ")";
               }
               textHtml += '</div>' +
                    '<div>' +val.applicationInfosVO[0].REFUSERESON + '</div>' +
                    '</li>';
            });
        }else{
            textHtml = '<li style="line-height:40px;margin-top:30px;text-align:center;">未查询到业务数据</li>';
        }
        $("#credit-jinduchaxun .box-content").empty();
        $('#credit-jinduchaxun .box-content').html(textHtml);
        $("#credit-jinduchaxun .page-number-con").show();
        //分页
        $("#credit-jinduchaxun .page-number-con").createPage({
            pageCount:applicationObj.cardApplicationVO.TOTALPAGE?applicationObj.cardApplicationVO.TOTALPAGE:0,
            current:applicationObj.pageIndex,
            backFn:function(p){
                showLoader('信用卡办理进度查询中...');
                applicationObj.pageIndex = p;
                applicationObj.bussinessDetail.b[0]["CURRENT_NUM.s"] = String(p);
                $("#credit-jinduchaxun .box-rows").hide();
                getCardApplicationFun( applicationObj.bussinessDetail, function (msg) {
                    getCardApplicationSucc(msg);
                }, function (err) {
                    hideLoader();
                    funFail(err);
                })
            }
        });
        //添加事件
        $(".box-content .box-rows").on('tap', function(ev) {
            var oTarget = ev.target;
            _this = $(oTarget).closest('.box-rows');
            $(_this).addClass('click').siblings().removeClass('click');
            if($($(_this).children("div")[4]).attr("attyy") == '01'){
            		$('#credit-jinduchaxun-btn').addClass('btn_next');
            }else{
            		$('#credit-jinduchaxun-btn').removeClass('btn_next');
            }
        });

    }else if(responseCode[0].results == "08"){
        showLoader("信用卡办理进度查询中...");
        getCardApplicationFun( applicationObj.bussinessDetail, function (msg) {
            getCardApplicationSucc(msg);
        }, function (err) {
            funFail(err);
        })
    } else if(responseCode[0].results == "03"){
        $('.box-header>div:last').css('display','block');
	    $('.box-header>div').css('width','15%');
	    $('.box-header>div:last').css('width','25%');
        $('#credit-jinduchaxun .box-content').html('<li style="line-height:40px;margin-top:30px;text-align:center;">未查询到业务数据</li>');
        $("#credit-jinduchaxun .page-number-con").hide();
    } else {
    	showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
        if($('#credit-jinduchaxun .box-content').html() != ''){
        	$('div.creditNav div').toggleClass('creditSelected');
        }
    }
}

/*信用卡待补件  成功回调*/
function findAdditionalsSucc(msg){
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == "00") {    // 接口处理成功
    	$('.box-header>div:last').css('display','none');
    	$('.box-header>div').css('width','20%');
        applicationObj.responseCode=responseCode;
        var textHtml = '';
        $.each(applicationObj.responseCode,function(index, val) {
            if(index == 0){return;}
            textHtml += '<li class="box-rows">' +
                '<div>' + val.cardClaimsVO[0].MASCARDNAME + '</div>' +
                '<div>' + val.cardClaimsVO[0].CERTNUM + '</div>' +
                '<div>' + val.cardClaimsVO[0].CREATEDATE + '</div>' +//val.applicationInfosVO[0].CREATEDATE
                '<div>' + paiTypeObj[val.cardClaimsVO[0].MASTERFLAG] + '</div>' +
                '<div>' + pcardStatusObj[val.cardClaimsVO[0].SCHEDULEDSTATUS] + '</div>' +
                '</li>';
        });
        $("#credit-jinduchaxun .box-content").empty();
        $('#credit-jinduchaxun .box-content').html(textHtml);
        $('#credit-jinduchaxun .box-content li>div').css('width','20%');
        $("#credit-jinduchaxun .page-number-con").show();
        //分页
        $("#credit-jinduchaxun .page-number-con").createPage({
            pageCount:responseCode[0]['totalNum.i']?Math.ceil(responseCode[0]['totalNum.i']/7):0,
            current:applicationObj.pageIndex,
            backFn:function(p){
                showLoader('信用卡办理进度查询中...');
                applicationObj.pageIndex = p;
                applicationObj.bussinessDetail.b[0]["page.s"] = String(p);
                $("#credit-jinduchaxun .box-rows").hide();
                findAdditionalsFun( applicationObj.bussinessDetail, function (msg) {
                    findAdditionalsSucc(msg);
                }, function (err) {
                    funFail(err);
                })
            }
        });
        //添加事件
        $(".box-content .box-rows").on('tap', function(ev) {
            var oTarget = ev.target;
            var _this = $(oTarget).closest('.box-rows');
            $(_this).addClass('click').siblings().removeClass('click');
           // applicationObj.plSeq = _this.attr('plSeq');
            $('#credit-jinduchaxun-btn').addClass('btn_next');
        });
    }else if(responseCode[0].results == "08"){
        showLoader("信用卡办理进度查询中...");
        findAdditionalsFun( applicationObj.bussinessDetail, function (msg) {
            findAdditionalsSucc(msg);
        }, function (err) {
            funFail(err);
        })
    } else if(responseCode[0].results == "03"){
    	$('.box-header>div:last').css('display','none');
    	$('.box-header>div').css('width','20%');
        $('#credit-jinduchaxun .box-content').html('<li style="line-height:40px;margin-top:30px;text-align:center;">未查询到业务数据</li>');
        $("#credit-jinduchaxun .page-number-con").hide();
    } else {
    	showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
        if($('#credit-jinduchaxun .box-content').html() != ''){
        	$('div.creditNav div').toggleClass('creditSelected');
        }
    }
}