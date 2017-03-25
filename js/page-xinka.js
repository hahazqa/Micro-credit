/**
 * Created by zhuLei on 2015/8/11.
 */

//虚拟卡列表 页面 yu
$(document).on("pageshow",'#xinka-product',function(){
    getCurrentLocationCoordinateFun();              //缓存经纬度(校验联网)
    showLoader("加载中...");
    debitEnter = {
        "readIDCache": false, //读取身份证页面缓存
        "agreeCache": false, //阅读协议页面缓存
        "imageCache": false, //影像采集页面缓存
        "messageCache": false, //信息录入页面缓存
        "moduleID":'22',//模块编号
        "tranId1":'23',//交易编号 1:虚拟卡开卡
        "operatorNo":commonJson.adminCount,//操作员
        "deviceNo":commonJson.udId//设备编号
    };
    if(!window.localStorage.getItem("debitCardList")){
        //虚拟卡列表
        var sendJson={
                    "b" : [{
                        "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
                        "workAddress.s":commonJson.workAddress,//工作地址
                        "orgId.s":commonJson.orgId,//机构号
                        "moduleId.s":debitEnter.moduleID,//模块编号
                        "tranId.s":debitEnter.tranId1,//交易编号
                        "operatorNo.s":commonJson.adminCount,//操作员
                        "deviceNo.s":commonJson.udId//设备编号
                    }]
                };
        idebitCardProductServiceFun(sendJson,function(msg){
            idebitCardProductServiceSucc(msg);
        },function(err){
        	hideLoader();
            funFail(err);
        })
    }else{
        var oDate = parseInt(myTime.CurTime()/3600/24);
       //alert(oDate+',,,'+window.localStorage.getItem("debitCardDate"));
        if(oDate == window.localStorage.getItem("debitCardDate")){
           // alert('cache')
            idebitCardProductServiceSucc(window.localStorage.getItem("debitCardList"),true);
        }else{
            var sendJson={
                        "b" : [{
                            "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
                            "workAddress.s":commonJson.workAddress,//工作地址
                            "orgId.s":commonJson.orgId,//机构号
                            "moduleId.s":debitEnter.moduleID,//模块编号
                            "tranId.s":debitEnter.tranId1,//交易编号
                            "operatorNo.s":commonJson.adminCount,//操作员
                            "deviceNo.s":commonJson.udId//设备编号
                        }]
                    };
            idebitCardProductServiceFun(sendJson,function(msg){
                idebitCardProductServiceSucc(msg);
            },function(err){
            	hideLoader();
                funFail(err);
            })
        }
    }
    /*$('#xinka-product .product_register').click(function(event) {
        $.mobile.changePage('xinka-readingID.html');
    });*/
});
//虚拟卡刷卡 页面 yu
$(document).on('pageshow','#xinka-readingID',function(){
    debitEnter.readIDCache = false;
    debitEnter.agreeCache = false;
    debitEnter.imageCache = false;
    debitEnter.messageCache = false;
    debitEnter.querySuss = false;
    /*debitEnter = {
        "readIDCache": false, //读取身份证页面缓存
        "agreeCache": false, //阅读协议页面缓存
        "imageCache": false, //影像采集页面缓存
        "messageCache": false, //信息录入页面缓存
        "moduleID":"2",//模块编号
        "tranId1":"1",//交易编号 1:虚拟卡开卡
        "operatorNo":commonJson.adminCount,//操作员
        "deviceNo":commonJson.udId//设备编号
    };*/
    //默认不影像复用
    commonJson.isCustermerInfoMultiplex = false;
    //调用刷身份证方法
    creditJson.isCancelReadCard = false; //初始化'是取消执行读取身份证方法' 默认false打开页面就执行
    //刷身份证
    $(".footter .previous").on('click',function(){
         creditReadCard(function() {
            $.mobile.changePage('xinka-readID.html');
        }, function(err) {
            $.mobile.changePage('xinka-readID.html');

        });
    })
    //临时输入身份证按钮确定
    /*$("#xinka-readingID .conter-con button").on('click',function(){  
        var cCerNO= $("#xinka-readingID .conter-con input").val();
        if(!cCerNO){
            showMsg('请先输入身份证号码！');
            return;
        }
        if(!(fmReg.cerNo.test(cCerNO))){
            showMsg(fmRegMsg.cerNo);
            return;
        }
        custermerInfo={};//初始化个人信息
        custermerInfo={
            "nation":"汉族",//民族
            "cerNO":cCerNO,//身份证号
            "address":"深圳市罗湖区深南东路123号",//地址
            "name":"张三",//姓名
            "cerExpdDt":"2000.01.01-2016.09.29",//到期日期
            "birthday":"1988-01-01",//出生日期
            "sex":"男",//性别
            "issAuthority":"罗湖区公安局",//签发机关
            "image":""//身份证头像图片
        }
        //刷卡后判定身份证是否过期
        if(idCardIsExpired(custermerInfo.cerExpdDt)){
            showTags({
                'title' : '提示',
                'content' :'您的身份证已过期!',
                'ok' : {}
            });
            return;
        }
        $("#xinka-readingID #btn_next").addClass('btn_next');
    })*/
    //点击影像复用
    $("#xinka-readingID .conter-con .picRe").on('click',function(){
        creditJson.isCancelReadCard = true;
        $.mobile.changePage('xinka-video.html');
    })
    //下一步
    $("#xinka-readingID #btn_next").on('click',function(){
        if(!($(this).hasClass('btn_next'))) return;
        $.mobile.changePage('xinka-readID.html');
    })
        //点击首页
    $("#xinka-readingID .head-left").on('click', function() {
        creditJson.isCancelReadCard = true;
    })
        //点击退出
    $("#xinka-readingID .head-right").on('click', function() {
        creditJson.isCancelReadCard = true;
    })
})

//虚拟卡联网核查  显示身份证信息 页面 yu
$(document).on("pageshow",'#xinka-readID',function(){
    debitEnter.readIDCache = true;
    //返显身份证信息
    /*$("#xinka-readID .ziduan-value:eq(0)").text(custermerInfo.name);
    $("#xinka-readID .ziduan-value:eq(1)").text(custermerInfo.sex);
    $("#xinka-readID .ziduan-value:eq(2)").text(custermerInfo.nation);
    $("#xinka-readID .ziduan-value:eq(3)").text(custermerInfo.birthday.split("-")[0]);
    $("#xinka-readID .ziduan-value:eq(4)").text(custermerInfo.birthday.split("-")[1]);
    $("#xinka-readID .ziduan-value:eq(5)").text(custermerInfo.birthday.split("-")[2]);
    $("#xinka-readID .ziduan-value:eq(6)").text(custermerInfo.address);
    $("#xinka-readID .ziduan-value:eq(7)").text(custermerInfo.cerNO);
    $("#xinka-readID .ziduan-value:eq(8)").text(custermerInfo.issAuthority);
    $("#xinka-readID .ziduan-value:eq(9)").text(custermerInfo.cerExpdDt);*/


    if (creditJson.isReadCardSucc) { //读卡成功
        $("#xinka-readID .ziduan-value:eq(0)").text(custermerInfo.name);
        $("#xinka-readID .ziduan-value:eq(1)").text(custermerInfo.sex);
        $("#xinka-readID .ziduan-value:eq(2)").text(custermerInfo.nation);
        $("#xinka-readID .ziduan-value:eq(3)").text(custermerInfo.birthday.split("-")[0]);
        $("#xinka-readID .ziduan-value:eq(4)").text(custermerInfo.birthday.split("-")[1]);
        $("#xinka-readID .ziduan-value:eq(5)").text(custermerInfo.birthday.split("-")[2]);
        $("#xinka-readID .ziduan-value:eq(6)").text(custermerInfo.address);
        $("#xinka-readID .ziduan-value:eq(7)").text(custermerInfo.cerNO);
        $("#xinka-readID .ziduan-value:eq(8)").text(custermerInfo.issAuthority);
        $("#xinka-readID .ziduan-value:eq(9)").text(custermerInfo.cerExpdDt);
        $('#xinka-readID .sfz-img').attr('src',custermerInfo.image);
        if(commonJson.isCustermerInfoMultiplex || debitEnter.agreeCache){ //如果是影像复用不需要进行联网核查
            $("#xinka-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
            //$("#xinka-readID .loading_box").html(''); 
            $('#xk-read-next').addClass('btn_next');
        }else{
            $('#xk-read-pre').removeClass('btn_next');
            $('.sh_loading_box_shadow').remove();
            $('.header .head-left,.header .head-right').addClass('btn-cannt-click');
            $('.ui-page').append('<div class="sh_loading_box_shadow" style="position:absolute;right:0;top:0;left:0;bottom:0;z-index:24;background-color: rgba(0,0,0,.0);"></div>');
            var sendJson={
                        "b" : [{
                          "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
                          "workAddress.s":commonJson.workAddress,//工作地址
                          "orgId.s":commonJson.orgId,//机构号
                          "moduleId.s":debitEnter.moduleID,//模块编号
                          "tranId.s":debitEnter.tranId1,//交易编号
                          "operatorNo.s":commonJson.adminCount,//操作员
                          "deviceNo.s":commonJson.udId,//设备编号
                          "DOCUMENT_TYPE.s":"0",//证件类型
                          "DOCUMENT_ID.s" :custermerInfo.cerNO,//身份证号码
                          "CLIENT_NAME.s" :custermerInfo.name,//被核对人姓名
                          "BUSSINESSCODE.s":"01" ,//业务总类
                          "BRANCH_ID.s" :commonJson.orgId//机构号
                        }]
                    };
            //身份证联网核查
            icitizenCertificateIdenifyFun(sendJson,function(msg){
                $('#xk-read-pre').addClass('btn_next');
                $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
                $('.sh_loading_box_shadow').remove();
                idebitItizenCertificateIdenifySucc(msg);
            },function(err){
                $('#xk-read-pre').addClass('btn_next');
                $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
                $('.sh_loading_box_shadow').remove();
                 $("#xinka-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
                funFail(err);
            })
        }
    }else{
        if(commonJson.isCustermerInfoMultiplex){
            $("#xinka-readID .ziduan-value:eq(0)").text(custermerInfo.name);
            $("#xinka-readID .ziduan-value:eq(1)").text(custermerInfo.sex);
            $("#xinka-readID .ziduan-value:eq(2)").text(custermerInfo.nation);
            $("#xinka-readID .ziduan-value:eq(3)").text(custermerInfo.birthday.split("-")[0]);
            $("#xinka-readID .ziduan-value:eq(4)").text(custermerInfo.birthday.split("-")[1]);
            $("#xinka-readID .ziduan-value:eq(5)").text(custermerInfo.birthday.split("-")[2]);
            $("#xinka-readID .ziduan-value:eq(6)").text(custermerInfo.address);
            $("#xinka-readID .ziduan-value:eq(7)").text(custermerInfo.cerNO);
            $("#xinka-readID .ziduan-value:eq(8)").text(custermerInfo.issAuthority);
            $("#xinka-readID .ziduan-value:eq(9)").text(custermerInfo.cerExpdDt);
            $('#xinka-readID .sfz-img').attr('src',custermerInfo.image);
            $("#xinka-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
            //$("#xinka-readID .loading_box").html(''); 
            $('#xk-read-next').addClass('btn_next');
        }else{
            $("#xinka-readID .pic_suc").text('身份证读取失败!')
            $("#xinka-readID .loading_box").html('');
        }
    }
    //点击下一步
    $('#xk-read-next').on('click',function(){
        if(debitEnter.agreeCache){
            $.mobile.changePage('./xinka-agreement.html');
        }else{
            if(!($(this).hasClass('btn_next'))) return;
            showLoader('客户信息查询中...');
            var sendJson={
                    "b" : [{
                      "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
                      "workAddress.s":commonJson.workAddress,//工作地址
                      "orgId.s":commonJson.orgId,//机构号
                      "moduleId.s":debitEnter.moduleID,//模块编号
                      "tranId.s":debitEnter.tranId1,//交易编号
                      "operatorNo.s":commonJson.adminCount,//操作员
                      "deviceNo.s":commonJson.udId,//设备编号
                      "CLIENT_TYPE.s" :"P",//客户类型 N组织 P个人
                      "CARD.s" :"",//卡号
                      "ACCT_NO.s":"" ,//账号
                      "CLIEMT_NO.s" :"",//客户号
                      "DOC_TYPE.s":"0" ,//证件类型
                      "DOC_ID.s":custermerInfo.cerNO,//证件号
                      "CLIENT_SHORT.s":"" ,//简称
                      "BIRTH_DATE.s":"" ,//出生日
                      "CELL_PHONE.s":"" ,//手机
                      "PHONE.s":"" ,//住宅电话
                      "LEGAL_REP.s":"" ,//法人代表
                      "REVERSE_FLAG.s":"D",//证件号内部检查标志 默认D
                      "CARD_CATEGORY.s":"1"//虚拟卡查核心标识 1
                    }]
                };
            icustomerInfoServiceFun(sendJson,function(msg){
                icustomerInfoServiceSucc(msg);
            },function(err){
                funFail(err);
            })
        }
    });
    //点击上一步，跳转页面
    $('#xk-read-pre').on('click',function(){
        if(!($(this).hasClass('btn_next'))) return;
        $.mobile.changePage('./xinka-readingID.html',{ reverse: true });
    });

    $(".lianwanghecha-chongxin").on("click",function(){//重新联网核查
    		showLoader('信息查询中...');
 		$(".lianwanghecha-yichang").hide();

            $('#xk-read-pre').removeClass('btn_next');
            $('.sh_loading_box_shadow').remove();
            $('.header .head-left,.header .head-right').addClass('btn-cannt-click');
            $('.ui-page').append('<div class="sh_loading_box_shadow" style="position:absolute;right:0;top:0;left:0;bottom:0;z-index:24;background-color: rgba(0,0,0,.0);"></div>');
            $(".loading_box").html('<img class="img_loading" src="../../images/ic_load.gif" alt=""/><div class="read_loading">信息审核中…</div>');
            var sendJson={
                        "b" : [{
                          "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
                          "workAddress.s":commonJson.workAddress,//工作地址
                          "orgId.s":commonJson.orgId,//机构号
                          "moduleId.s":debitEnter.moduleID,//模块编号
                          "tranId.s":debitEnter.tranId1,//交易编号
                          "operatorNo.s":commonJson.adminCount,//操作员
                          "deviceNo.s":commonJson.udId,//设备编号
                          "DOCUMENT_TYPE.s":"0",//证件类型
                          "DOCUMENT_ID.s" :custermerInfo.cerNO,//身份证号码
                          "CLIENT_NAME.s" :custermerInfo.name,//被核对人姓名
                          "BUSSINESSCODE.s":"01" ,//业务总类
                          "BRANCH_ID.s" :commonJson.orgId//机构号
                        }]
                    };
            //身份证联网核查
            icitizenCertificateIdenifyFun(sendJson,function(msg){
                $('#xk-read-pre').addClass('btn_next');
                $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
                $('.sh_loading_box_shadow').remove();
                idebitItizenCertificateIdenifySucc(msg);
            },function(err){
                $('#xk-read-pre').addClass('btn_next');
                $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
                $('.sh_loading_box_shadow').remove();
                 $("#xinka-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
                funFail(err);
            })

 	});
 	$(".lianwanghecha-jixu").on("click",function(){//继续业务办理
 		$(".lianwanghecha-yichang").hide();

        if(debitEnter.agreeCache){
            $.mobile.changePage('./xinka-agreement.html');
        }else{
            showLoader('客户信息查询中...');
            var sendJson={
                    "b" : [{
                      "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
                      "workAddress.s":commonJson.workAddress,//工作地址
                      "orgId.s":commonJson.orgId,//机构号
                      "moduleId.s":debitEnter.moduleID,//模块编号
                      "tranId.s":debitEnter.tranId1,//交易编号
                      "operatorNo.s":commonJson.adminCount,//操作员
                      "deviceNo.s":commonJson.udId,//设备编号
                      "CLIENT_TYPE.s" :"P",//客户类型 N组织 P个人
                      "CARD.s" :"",//卡号
                      "ACCT_NO.s":"" ,//账号
                      "CLIEMT_NO.s" :"",//客户号
                      "DOC_TYPE.s":"0" ,//证件类型
                      "DOC_ID.s":custermerInfo.cerNO,//证件号
                      "CLIENT_SHORT.s":"" ,//简称
                      "BIRTH_DATE.s":"" ,//出生日
                      "CELL_PHONE.s":"" ,//手机
                      "PHONE.s":"" ,//住宅电话
                      "LEGAL_REP.s":"" ,//法人代表
                      "REVERSE_FLAG.s":"D",//证件号内部检查标志 默认D
                      "CARD_CATEGORY.s":"1"//虚拟卡查核心标识 1
                    }]
                };
            icustomerInfoServiceFun(sendJson,function(msg){
                icustomerInfoServiceSucc(msg);
            },function(err){
                funFail(err);
            })
        }


 		//lianwanghechaFun();
 	});
 	$(".lianwanghecha-tuichu").on("click",function(){//退出
 		$.mobile.changePage('xinka-product.html', { transition: "slide" });
 		$(".lianwanghecha-yichang").hide();
 	});



});

//xinka-agreement页面
$(document).on("pageshow",'#xinka-agreement',function(){
    $("#xinka-agreement .agree-content").html(debitEnter.proProtocol);
    if(debitEnter.readIDCache && debitEnter.agreeCache && debitEnter.isAgree){
        $('#ic-disagree').css('display','none');
        $('#ic-agree').css('display','inline-block');
        $('#xk-agree-next').addClass('btn_next');
    }
    debitEnter.agreeCache = true;
    //同意协议勾选
    var agreeBtn=document.getElementById('xk-agree-btn');
    agreeBtn.onclick=function(){
        var dis=$('#ic-disagree').css('display');
        if(dis!='none'){
            $('#ic-disagree').css('display','none');
            $('#ic-agree').css('display','inline-block');
            $('#xk-agree-next').addClass('btn_next');
            //var btn = document.getElementById('xk-agree-next');
            debitEnter.isAgree =  true;
            /*btn.onclick=function(){
                $.mobile.changePage('./xinka-customerP.html');
            };*/
        }
        else{
            $('#ic-agree').css('display','none');
            $('#ic-disagree').css('display','inline-block');
            $('#xk-agree-next').removeClass('btn_next');
            debitEnter.isAgree =  false;
            //document.getElementById('xk-agree-next').onclick=null;
        }

    };
    //点击下一步，跳转页面
    $('#xk-agree-next').on('click',function(){
        if(!($(this).hasClass('btn_next'))) return;
        $.mobile.changePage('xinka-customerP.html');
    });
    //点击上一步，跳转页面
    $('#xk-agree-pre').on('click',function(){
        $.mobile.changePage('xinka-readingID.html',{reverse:true});
    });
});
var debitImageAcquisition={
    imgSrc:'',//记录照片路径,
    curParentObj:'',//记录要删除的对象
    delImg:function(curParentObj,imgSrc){//删除照片
        curParentObj.find('.camera-pic').remove();
        curParentObj.find('.camera').show();
        curParentObj.find('.rephoto').html('必拍');
        $('.bigpic-review-box').animate({
        opacity: '0'},
        200,function(){
            $('.bigpic-review-box').hide()
        });
        //监测下一步是否可点击
        $('#xk_customerP_next').removeClass('btn_next');
        var ind = 0;
        for(var i = 0; i < 4; i++){
           if($('#xinka-customerP .customer:eq('+i+')').find("img").length == 2){
                ind++;
                if (ind >= 4){
                    $('#xk_customerP_next').addClass('btn_next');
                }
           };
        }
        deletePhoto([imgSrc],function(msg){

        },function(err){

        })
    },
    getImg:function(curParentObj){//拍照
          Meap.media('camera',curParentObj.attr('picname'),function(msg){
            debitImageAcquisition.imgSrc=msg;
            curParentObj.find('.camera').hide();
            curParentObj.append('<img src="'+msg+'" width="100%" height="115px"  class="camera-pic">');
            curParentObj.find('.rephoto').text('重拍');
            //监测下一步是否可点击
            var ind = 0;
            for(var i = 0; i < 4; i++){
               if($('#xinka-customerP .customer:eq('+i+')').find("img").length == 2){
                    ind++;
                    if (ind >= 4){
                        $('#xk_customerP_next').addClass('btn_next');
                    }
               };
            }
        },function(err){
            showMsg(err);
        })
    },
    getFace:function(curParentObj){
        faceDistinguish('trans',function(msg){
            debitImageAcquisition.imgSrc=msg;
            curParentObj.find('.camera').hide();
            curParentObj.append('<img src="'+msg+'" width="100%" height="115px"  class="camera-pic">');
            debitEnter.isTelCheck = false;
            curParentObj.find('.rephoto').text('重拍');
            $('#xk_customerP_next').removeClass('btn_next');
            var ind = 0;
            for(var i = 0; i < 4; i++){
               if($('#xinka-customerP .customer:eq('+i+')').find("img").length == 2){
                    ind++;
                    if (ind >= 4){
                        $('#xk_customerP_next').addClass('btn_next');
                    }
               };
            }
        },function(err){
            showMsg(err);
        })
    },
    reGetImg:function(curParentObj,imgSrc){//重拍
        if(curParentObj.parent().hasClass('get-face')){
            faceDistinguish('trans',function(returnGetMsg){
                debitImageAcquisition.imgSrc=returnGetMsg;
                curParentObj.find('.camera-pic').attr('src',returnGetMsg);
                $('.bigpic-review').html('<img src='+returnGetMsg+' height="100%">');
                debitEnter.isTelCheck = false;
                deletePhoto([imgSrc],function(returnDelMsg){

                },function(err){

                })
            },function(err){
                showMsg('重拍失败');
            })
        }else{
             Meap.media('camera',curParentObj.attr('picname'),function(returnGetMsg){
                imgSrc=curParentObj.find('.camera-pic').attr('src');
                debitImageAcquisition.imgSrc=returnGetMsg;
                    curParentObj.find('.camera-pic').attr('src',returnGetMsg);
                    $('.bigpic-review').html('<img src='+returnGetMsg+' height="100%">');
                deletePhoto([imgSrc],function(returnDelMsg){

                },function(err){

                })

                },function(err){
                    showMsg('重拍失败');
             })
        }
    },
    reviewImg:function(imgSrc){//拍照预览
        $('.bigpic-review').html('<img src='+imgSrc+' height="100%">');
        $('.bigpic-review-box').show().animate({opacity: '1'},200);
    },
    reviewImgClose:function(){//关闭拍照预览
        $('.bigpic-review-box').animate({opacity: '0'},200,function(){
            $('.bigpic-review-box').hide()
        });
    }
}
//xinka-customerP页面
$(document).on("pageshow",'#xinka-customerP',function(){
    if(debitEnter.agreeCache && debitEnter.imageCache){
        if(debitEnter.custFacePic != undefined){
            $('.img_box:eq(0) .rephoto').text('重拍');
            $('.img_box:eq(0) .camera').hide();
            $('.img_box:eq(0) .customer').append('<img src="'+debitEnter.custFacePic+'" width="100%" height="115px" class="camera-pic">');
        }
        if(debitEnter.custAndCustOwnerPic != undefined){
            $('.img_box:eq(1) .rephoto').text('重拍');
            $('.img_box:eq(1) .camera').hide();
            $('.img_box:eq(1) .customer').append('<img src="'+debitEnter.custAndCustOwnerPic+'" width="100%" height="115px" class="camera-pic">');
        }
        if(debitEnter.frontIDCardPic != undefined){
            $('.img_box:eq(2) .rephoto').text('重拍');
            $('.img_box:eq(2) .camera').hide();
            $('.img_box:eq(2) .customer').append('<img src="'+debitEnter.frontIDCardPic+'" width="100%" height="115px" class="camera-pic">');
        }
        if(debitEnter.backIDCardPic != undefined){
            $('.img_box:eq(3) .rephoto').text('重拍');
            $('.img_box:eq(3) .camera').hide();
            $('.img_box:eq(3) .customer').append('<img src="'+debitEnter.backIDCardPic+'" width="100%" height="115px" class="camera-pic">');
        }
        var ind = 0;
        for(var i = 0; i < 4; i++){
           if($('#xinka-customerP .customer:eq('+i+')').find("img").length == 2){
                ind++;
                if (ind >= 4){
                    $('#xk_customerP_next').addClass('btn_next');
                }
           };
        }
    }else{
        if(commonJson.isCustermerInfoMultiplex){ //如果影像复用 影像进行返显
            queryTableDataByConditions({
                "databaseName": "myDatabase",
                "tableName": "customer_info",
                "conditions": {
                    "SUBMITTIME": "between "+commonJson.submitTime+" and "+commonJson.submitTime
                }
            },function(msg){
                var CUSTANDCUSTOWNERPICBase64 = msg[0].CUSTANDCUSTOWNERPIC.replace(/\\/g, "").replace('data:image/png;base64,', '');
                var FRONTIDCARDPICBase64 = msg[0].FRONTIDCARDPIC.replace(/\\/g, "").replace('data:image/png;base64,', '');
                var BACKIDCARDPICBase64 = msg[0].BACKIDCARDPIC.replace(/\\/g, "").replace('data:image/png;base64,', '');
                //与客户合影base64转路径
                if(CUSTANDCUSTOWNERPICBase64 != '<null>'){
					Meap.transFormImage(getYMDHMSM('custAndCustOwnerPic') + creditJson.storage.deviceNo, CUSTANDCUSTOWNERPICBase64, 'picSty', function (msg1) {
			            $('.img_box:eq(1) .customer').append('<img src="' + msg1 + '" width="100%" height="115px" class="camera-pic">');
			       		$('.img_box:eq(1) .rephoto').text('重拍');
			       		$('.img_box:eq(1) .camera').hide();
					}, function (err) {
			            showMsg('与客户合影base64转路径失败');
			        })
				}
                    //身份证正面base64转路径
                Meap.transFormImage(getYMDHMSM('frontIDCardPic') + commonJson.udId, FRONTIDCARDPICBase64, 'picSty', function(msg2) {
                    $('.img_box:eq(2) .customer').append('<img src="' + msg2 + '" width="100%" height="115px" class="camera-pic">');
                }, function(err) {
                    showMsg('身份证正面base64转路径失败');
                })
                    //身份证反面base64转路径
                Meap.transFormImage(getYMDHMSM('backIDCardPic') + commonJson.udId, BACKIDCARDPICBase64, 'picSty', function(msg3) {
                    $('.img_box:eq(3) .customer').append('<img src="' + msg3 + '" width="100%" height="115px" class="camera-pic">');

                }, function(err) {
                    showMsg('身份证反面base64转路径失败');
                })
                $('.img_box:eq(2) .rephoto,.img_box:eq(3) .rephoto').text('重拍');
                $('.img_box:eq(2) .camera,.img_box:eq(3) .camera').hide();
                /*$('.img_box:eq(1) .customer').append('<img src="'+msg[0].CUSTANDCUSTOWNERPIC.replace(/\\/g,"")+'" width="100%" height="115px" class="camera-pic">');
                $('.img_box:eq(1) .rephoto,.img_box:eq(2) .rephoto,.img_box:eq(3) .rephoto').text('重拍');
                $('.img_box:eq(1) .camera,.img_box:eq(2) .camera,.img_box:eq(3) .camera').hide();

                $('.img_box:eq(2) .customer').append('<img src="'+msg[0].FRONTIDCARDPIC.replace(/\\/g,"")+'" width="100%" height="115px" class="camera-pic">');

                $('.img_box:eq(3) .customer').append('<img src="'+msg[0].BACKIDCARDPIC.replace(/\\/g,"")+'" width="100%" height="115px" class="camera-pic">');  */
            },function(err){

            })
        }
    }
    debitEnter.imageCache = true;
    //预览大图 点击关闭
    $('.bigpic-review-close').click(function(event) {
        debitImageAcquisition.reviewImgClose();
    });
    //预览大图 删除图片
    $('.bigpic-review-del').click(function(event) {
        debitImageAcquisition.delImg(debitImageAcquisition.curParentObj,debitImageAcquisition.imgSrc);
    });
    //预览大图 重新拍照
    $('.bigpic-review-rephone').click(function(event) {
        debitImageAcquisition.reGetImg(debitImageAcquisition.curParentObj,debitImageAcquisition.imgSrc);
    });
    $('#xinka-customerP .conter-con').on('click','.customer',function(ev){
        debitImageAcquisition.curParentObj=$(this);
        var oTarget = ev.target;
        if($(this).find('.rephoto').html()=='重拍'){//重拍
            if($(oTarget).hasClass('rephoto')){
                debitImageAcquisition.reGetImg(debitImageAcquisition.curParentObj,debitImageAcquisition.imgSrc);
            }
            if($(oTarget).hasClass('camera-pic')){//预览大图
                debitImageAcquisition.imgSrc=$(oTarget).attr('src');
                debitImageAcquisition.reviewImg($(oTarget).attr('src'));
            }
            return;
        }
        //拍照
        //debitImageAcquisition.getImg(debitImageAcquisition.curParentObj);
        if(debitImageAcquisition.curParentObj.parent().hasClass('get-face')){
            debitImageAcquisition.getFace(debitImageAcquisition.curParentObj);
        }else{
            debitImageAcquisition.getImg(debitImageAcquisition.curParentObj);
        }

    })
    //点击上一步，跳转页面
    $('#xk_customerP_pre').on('click',function(){
        debitEnter.custFacePic = $('.img_box:eq(0) .customer img:eq(1)').attr('src');
        debitEnter.custAndCustOwnerPic = $('.img_box:eq(1) .customer img:eq(1)').attr('src');
        debitEnter.frontIDCardPic = $('.img_box:eq(2) .customer img:eq(1)').attr('src');
        debitEnter.backIDCardPic = $('.img_box:eq(3) .customer img:eq(1)').attr('src');
        $.mobile.changePage('./xinka-agreement.html', { reverse: true });
    });
    $('#xk_customerP_next').on('click',function(){
        if(!$(this).hasClass('btn_next')) return;
        //缓存虚拟卡影像资料
        debitEnter.custFacePic = $('#xinka-customerP .camera-pic:eq(0)').attr('src');
        custermerInfo.custAndCustOwnerPic = debitEnter.custAndCustOwnerPic = $('#xinka-customerP .camera-pic:eq(1)').attr('src');
        custermerInfo.frontIDCardPic = debitEnter.frontIDCardPic = $('#xinka-customerP .camera-pic:eq(2)').attr('src');
        custermerInfo.backIDCardPic = debitEnter.backIDCardPic = $('#xinka-customerP .camera-pic:eq(3)').attr('src');
        //cacheCustermerInfo('信通电子卡');//测试代码 
        debitEnter.picFileARR = [debitEnter.custFacePic,debitEnter.custAndCustOwnerPic,debitEnter.frontIDCardPic,debitEnter.backIDCardPic]
       // $.mobile.changePage('xinka-messageIn.html');
       if(debitEnter.isTelCheck){
            $.mobile.changePage('xinka-messageIn.html');
       }else{
            $.mobile.changePage('xinka-personFace.html');
       }

    });
});

//xinka-messageIn页面
$(document).on("pageshow",'#xinka-messageIn',function(){
    //返显身份证信息
//  $('#x-name,#x-rePersonal').text(custermerInfo.name);
    $('#x-name').text(custermerInfo.name);
    $('#x-sex').text(custermerInfo.sex);
    $('#x-cerNO').text(custermerInfo.cerNO);
    $('#x-cerExpDt').text(custermerInfo.cerExpdDt);
    //三级联动初始化
    _init_area();
    /*$('#s_province').val("省份").selectmenu('refresh'); //省份
    $('#s_province').siblings('span').text("省份");
    change(1,0);
    $('#s_city').val("北京市").selectmenu('refresh'); //地级市
    $('#s_city').siblings('span').text("北京市");
    change(2,0);
    $('#s_county').val("东城区").selectmenu('refresh'); //区
    $('#s_county').siblings('span').text("东城区");*/
    if(debitEnter.messageCache == false){
       /* $("#xinka-messageIn input").val('');
        $("#xinka-messageIn select").val('');
        $("#x-placeSelRes").html('<option value=""></option>');
        $("#s_province").html('<option value="">省份</option>');
        $("#s_city").html('<option value="">地级市</option>');
        $("#s_county").html('<option value="">市、县级市</option>');
        $("#x-occup").html('<option value=""></option>');
        $("#xinka-messageIn .information-result,#xinka-messageIn .public-drop-down").removeClass('fm-item-error');*/
         showLoader("客户信息查询中...");//把“职业信息查询中...”改成了“客户信息查询中...”
         debitEnter.isPlaceGPS = false;
         //查询客户职业
        var sendJson={
                    "b" : [{
                        "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
                        "workAddress.s":commonJson.workAddress,//工作地址
                        "orgId.s":commonJson.orgId,//机构号
                        "moduleId.s":debitEnter.moduleID,//模块编号
                        "tranId.s":debitEnter.tranId1,//交易编号
                        "operatorNo.s":commonJson.adminCount,//操作员
                        "deviceNo.s":commonJson.udId,//设备编号
                        "DOCUMENT_TYPE.s":"0",//证件类型
                        "CLIENT_NAME.s" : custermerInfo.name,
                        "DOCUMENT_ID.s" : custermerInfo.cerNO,
                        "faceRecogn.s" : debitEnter.faceRecogn //人脸识别
                    }]
                };
        ifrp005ServiceCFun(sendJson,function(msg){
            ifrp005ServiceCSucc(msg);
        },function(err){
            funFail(err);
        })
    }else{
        $('#x-placeSel').val(debitEnter.placeSel); //地区名称
        $('#x-placeSelRes').html(debitEnter.placeSelResHtml);//签发地区
        $('#x-placeSelRes').val(debitEnter.placeSelResVal).selectmenu('refresh');
        $('#x-tel').val(telNum(debitEnter.tel)); //手机号码
        $('#x-pCode').val(debitEnter.pCode); //邮编
        $('#s_province').val(debitEnter.province).selectmenu('refresh'); //省份
        $('#s_province').siblings('span').text(debitEnter.province);
        change(1,0);
        $('#s_city').val(debitEnter.city).selectmenu('refresh'); //地级市
        $('#s_city').siblings('span').text(debitEnter.city);
        //change(2,0);
        //$('#s_county').val(debitEnter.count).selectmenu('refresh'); //区
        //$('#s_county').siblings('span').text(debitEnter.count);
        $('#x-placeDet').val(debitEnter.placeDet); //详细地址
        $('#x-occup').html(debitEnter.occupValHtml);//职业
        $('#x-occup').val(debitEnter.occupVal).selectmenu('refresh');
        $('#x-recomm').val(debitEnter.recomm); //推荐人
//        $("#x-reCardNo").val(addSpace(debitEnter.reCardNo)); //OCR识别收款卡号
        if(debitEnter.isCoreHas){
            $('#s_province,#s_city,#x-tel,#x-pCode,#x-placeDet,#x-occup').attr('disabled','disabled');
            if(debitEnter.issPlace != '' && debitEnter.distCode != ''){
                $("#x-placeSelRes").attr('disabled','disabled');
                $("#x-placeSel").attr('disabled','disabled');
            }else{
                $("#x-placeSelRes").attr('disabled',false);
                $("#x-placeSel").attr('disabled',false);
            }
        }else{
            $('#s_province,#s_city,#x-tel,#x-pCode,#x-placeDet,#x-occup').attr('disabled',false);
        }
        /*if(debitEnter.isPlaceGPS == true){
            $('#s_province,#s_city').attr('disabled','disabled');
        }*/
    }
    debitEnter.messageCache = true;
    //失去焦点 发请求匹配签发地区
    $("#x-placeSel").on('blur',function(){
        $("#x-placeSelRes").val('').html('').selectmenu('refresh');
        var city = $(this).val();
        if(city == "") return;
        var sendJson={
                "b" : [{
                    "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
                    "workAddress.s":commonJson.workAddress,//工作地址
                    "orgId.s":commonJson.orgId,//机构号
                    "moduleId.s":debitEnter.moduleID,//模块编号
                    "tranId.s":debitEnter.tranId1,//交易编号
                    "operatorNo.s":commonJson.adminCount,//操作员
                    "deviceNo.s":commonJson.udId,//设备编号
                    "DOCUMENT_TYPE.s":"0",//证件类型
                    "CITY.s" : city,
                    "CLIENT_NAME.s" : custermerInfo.name,
                    "DOCUMENT_ID.s" : custermerInfo.cerNO
                }]
            };
        ifrp005ServicePFun(sendJson,function(msg){
            ifrp005ServicePSucc(msg);
        },function(err){
            funFail(err);
        })
    })
    //OCR识别
//  function ocrBankCardFun(){
//      	ocrBankCard('',function(msg){
//	        	var msg1=msg.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");
//	        	showTags({
//					'title': 'OCR识别卡号',
//					'content': msg1,
//					'ok': {
//						title: '确认',
//						fun: function() {
//							$("#x-reCardNo").val(msg1);
//						}
//					},
//					'cancel':{
//						title: '重试',
//						fun: function() {
//							ocrBankCardFun();
//						}
//					}
//
//				})
//	        },function(){
//
//	        })
//
//      };

//  $("#OCR_scan").on('click',function(){
//      $("#x-reCardNo").val('');
//      //G20151125
//       ocrBankCardFun();
//  })
//  $('#x-reCardNo').on('tap', function () {
//      $('#x-reCardNo').val(removeSpace($('#x-reCardNo').val()));
//  });
//  $('#x-reCardNo').on('blur', function () {
//      $('#x-reCardNo').val(addSpace($('#x-reCardNo').val()));
//  });
    if(debitEnter.isCoreHas == false){
        if(debitEnter.isSaveSC == false){
            debitEnter.isSaveSC = false;
        }else{
            debitEnter.isSaveSC = true;
        }
        //定位
        $('#hujifangxian').on('click',function(){
            //$('#s_province,#s_city').attr('disabled','disabled');
            $('#s_province').val('省份').selectmenu('refresh');
            $('#s_city').val('城市').selectmenu('refresh');
            $("#x-placeDet").val(custermerInfo.address);
            debitEnter.isPlaceGPS = true;
            debitEnter.isSaveSC = false;
        })
        $('#shishidingwei').on('click',function(){
            Meap.getCurrentLocationAddress("",function(msg){
                msg = JSON.parse(msg);
                $("#x-placeDet").val(msg.FormattedAddressLines[0]);
                //$('#s_province,#s_city').attr('disabled','disabled');
                $('#s_province').val('省份').selectmenu('refresh');
                $('#s_city').val('城市').selectmenu('refresh');
                debitEnter.isPlaceGPS = true;
                debitEnter.isSaveSC = false;
            },function(err){
                showMsg('定位失败！')
            });
        })
        $('#s_province').change(function(){
            if($(this).val() == '省份'){

            }else{
                $("#x-placeDet").val('');
                debitEnter.isSaveSC = true;
                debitEnter.querySuss = false;
            }
        })
        $('#s_city').change(function(){
            if($(this).val() == '城市'){

            }else{
                $("#x-placeDet").val('');
                debitEnter.isSaveSC = true;
                debitEnter.querySuss = false;
            }
        })


    }
    //点击上一步，跳转页面
    $('#xk_messageIn_pre').on('click',function(){
        debitEnter.placeSel = $.trim($('#x-placeSel').val()); //地区名称
        debitEnter.placeSelRes = $('#x-placeSelRes').find("option:selected").text(); //签发地区
        debitEnter.placeSelResHtml = $('#x-placeSelRes').html();
        debitEnter.placeSelResVal = $('#x-placeSelRes').val(); //签发地区
        debitEnter.tel = $.trim($('#x-tel').val()); //手机号码
        debitEnter.pCode = $.trim($('#x-pCode').val()); //邮编
        debitEnter.province = $('#s_province').val(); //省份
        debitEnter.city = $('#s_city').val(); //地级市
        //debitEnter.count = $('#s_county').val(); //区
        //alert(debitEnter.province+',,,,,'+debitEnter.city+',,,,'+debitEnter.count)
        debitEnter.placeDet = $.trim($('#x-placeDet').val()); //详细地址
        debitEnter.occup = $.trim($('#x-occup').find("option:selected").text()); //职业
        debitEnter.occupVal = $.trim($('#x-occup').val()); //职业
        debitEnter.occupValHtml = $('#x-occup').html();
        debitEnter.recomm = $.trim($('#x-recomm').val()); //推荐人
//      debitEnter.reCardNo = addSpace($("#x-reCardNo").val()); //OCR识别收款卡号
        $.mobile.changePage('./xinka-customerP.html',{ reverse: true });
    });
    $('#x-tel').on('blur', function () {
        $('#x-tel').val(telNum($('#x-tel').val()));
    });
    $('#x-tel').on('tap', function () {
        $('#x-tel').val(removeSpace($('#x-tel').val()));
    });
    //点击下一步
    $("#xk_messageIn_next").on('click',function(){
        //控制详细地址字数,参考信用卡申请页面
        if ($("#s_province").val() == '省份' || $("#s_city").val() == '城市') {
            if (checkAs400ChineseLength($("#x-placeDet").val()) >= 60) {
                showTags({
                    'title': '提示',
                    'content': "详细地址长度不能超过29位。",
                    'ok': {}
                });
                return;
            }
            if ($("#x-placeDet").val().length >= 30) {
                showTags({
                    'title': '提示',
                    'content': "详细地址长度不能超过29位。",
                    'ok': {}
                });
                return;
            }
        } else {
            if (checkAs400ChineseLength($("#s_province").val() + $("#s_city").val() + $("#x-placeDet").val()) >= 60) {
                showTags({
                    'title': '提示',
                    'content': "详细地址长度不能超过29位。",
                    'ok': {}
                });
                return;
            }
            if ($("#x-placeDet").val().length + $("#s_province").val().length + $("#s_city").val().length >= 30) {
                showTags({
                    'title': '提示',
                    'content': "详细地址长度不能超过29位。",
                    'ok': {}
                });
                return;
            }
        }
        //输入信息 非空验证
        var inpInd = 0;
        $("#xinka-messageIn input").each(function(index, val) {
             if(index == 0 || index == 4 || $(this).is(':disabled')) return ;
             if($(this).val() == "" || $(this).val() == null){
                $(this).closest(".information-result").addClass('fm-item-error');
                inpInd++;
             }else{
                $(this).closest(".information-result").removeClass('fm-item-error');
             }
        });

        $("#xinka-messageIn select").each(function(index, val) {
             if($(this).is(':disabled')) return ;
             if(debitEnter.querySuss && (this.id == "s_province" || this.id == "s_city" )) return;
             if(debitEnter.isSaveSC == false && ($(this).val()== "省份" || $(this).val()== "城市" )) return;
             if(debitEnter.isCoreHas && (index == 1 ||  index == 2 /*|| index == 3*/)) return ;
             if($(this).val() == "" || $(this).val() == null || $(this).val()== "省份" || $(this).val()== "城市" /*|| $(this).val()== "市、县级市"*/){
                $(this).closest(".public-drop-down,.information-result").addClass('fm-item-error');
                inpInd++;
             }else{
                $(this).closest(".public-drop-down,.information-result").removeClass('fm-item-error');
             }
        });

        if(inpInd > 0 ){
            showMsg('必填项不能为空');
            return;
        }
        //信息输入格式验证
        $('#xinka-messageIn input[type="text"][reg]').each(function(index,el){
            if($(this).is(':disabled')) return ;
            var reg=$(this).attr('reg');
            if(!(fmReg[reg].test($.trim($(this).val().replace(/\s+/g,''))))){
                inpInd++;
                showMsg(fmRegMsg[reg]);
                return false;
            }
        })
        if(inpInd > 0 ) return;
//      if(!/^\d*$/.test($('#x-reCardNo').val().replace(/\s+/g,''))){
//          showMsg('请输入正确格式的收款卡号!');
//          return false;
//      }
//      if(!/^\d{0,28}$/.test($('#x-reCardNo').val().replace(/\s+/g,''))){
//          showMsg('收款卡号长度不能大于28个字节!');
//          return false;
//      }
        debitEnter.name = $.trim($('#x-name').text()); //姓名
        debitEnter.sex = $.trim($('#x-sex').text()); //性别
        debitEnter.nation = $.trim($('#x-nation').text()); //国籍
        //debitEnter.cardType = $.trim($('#x-cardType').text()); //卡片类型
        debitEnter.cerNO = $.trim($('#x-cerNO').text()); //证件号码
        debitEnter.cerExpDt = $.trim($('#x-cerExpDt').text()); //证件有效期
        debitEnter.placeSel = $.trim($('#x-placeSel').val()); //地区名称
        debitEnter.placeSelResHtml = $('#x-placeSelRes').html();
        debitEnter.placeSelRes = $('#x-placeSelRes').find("option:selected").text(); //签发地区
        debitEnter.placeSelResHtml = $('#x-placeSelRes').html();
        debitEnter.placeSelResVal = $('#x-placeSelRes').val(); //签发地区
        debitEnter.tel = $.trim($('#x-tel').val().replace(/\s+/g,'')); //手机号码
        debitEnter.pCode = $.trim($('#x-pCode').val()); //邮编
        debitEnter.province = $('#s_province').val(); //省份
        debitEnter.city = $('#s_city').val(); //地级市
       // debitEnter.count = $('#s_county').val(); //区
        debitEnter.placeDet = $.trim($('#x-placeDet').val()); //详细地址
        if(debitEnter.isSaveSC == false){
            debitEnter.subAddress = debitEnter.placeDet;
        }else{
            if(debitEnter.querySuss){
                debitEnter.subAddress = debitEnter.placeDet;
            }else{
                debitEnter.subAddress = debitEnter.province+debitEnter.city+debitEnter.placeDet;
            }
        }
        // if(debitEnter.isCoreHas == false && debitEnter.subAddress.replace(/[^\x00-\xff]/g, '__').length > 50){
        //     showMsg('通讯地址长度不能大于50个字节!');
        //     return false;
        // }
        debitEnter.occup = $.trim($('#x-occup').find("option:selected").text()); //职业
        debitEnter.occupVal = $.trim($('#x-occup').val()); //职业
        debitEnter.occupValHtml = $('#x-occup').html();
        debitEnter.recomm = $.trim($('#x-recomm').val()); //推荐人
//      debitEnter.reCardNo = $.trim($("#x-reCardNo").val().replace(/\s+/g,'')); //OCR识别收款卡号
        $.mobile.changePage('xinka-customerConfirm.html');
    })
});

//信息确认页面
$(document).on("pageshow",'#xinka-customerConfirm',function(){
	debitEnter.platGlobalSeq = undefined;
    $("#basic-name").text(debitEnter.name);
    $("#basic-sex").text(debitEnter.sex);
    $("#basic_zhengJH").text(debitEnter.cerNO);
    $("#basic_addressZ").text(debitEnter.placeSelRes);
    $("#basic_zhengJY").text(debitEnter.cerExpDt);
    $("#basic_qianF").text(custermerInfo.issAuthority);
    $("#family_famliyName").text(removeSpace(debitEnter.tel));
    $("#family_familyType").text(debitEnter.pCode);
    if(debitEnter.isCoreHas){  //如果核心有客户号
        $("#family_familyNum").text(debitEnter.placeDet);
    }else{
        //$("#family_familyNum").text(debitEnter.province+debitEnter.city+debitEnter.placeDet); 
        $("#family_familyNum").text(debitEnter.subAddress);
    }
    $("#work_workName").text(debitEnter.occup);
    $("#work_tuiJ").text(debitEnter.recomm);
//  $("#re_card_no").text(removeSpace(debitEnter.reCardNo));
//  $("#re_personal").text(debitEnter.name);

    //初始化canvas画板
    //$(function() {
        //初始化方法
        signature.init({
            div: $('#qianM'), //签名容器
            finishBtn: $("#qianOK"), //完成签名按钮
            clearBtn: $("#clear-botton"), //清除签名按钮
            lineColor: '#000000', //线条颜色
            lineWidth: 3, //线条粗细
            finish: function(data) { //签名完成回调函数
                if($('#ic_disagree').is(':hidden')){
                    $('#ic_agree').hide();
                    $('#ic_disagree').show();
                    $("#xinka-sign-over").remove();
                }else{
                    $('#ic_disagree').hide();
                    $('#ic_agree').show();
                    $('#xinka-customerConfirm .video-qian .qian-box').css('position','relative');
                    $('#xinka-customerConfirm .video-qian .qian-box').append('<div id="xinka-sign-over" style="position:absolute; top:0; right:0;left:0;bottom:0"></div>');
                    debitEnter.data = data.replace('data:image/png;base64,','')
                }
            }
        });
    //});
    //点击打开pdf文件
    $('.xinka-sure-xy span').on('click', function() {
        Meap.scanOfficeFile('www/images/开立个人信通数字卡账户协议.docx', function(msg) {}, function(err) {})
    })
    $('.xinka-sure-xy img').on('click', function() {
        if ($('.xinka-sure-xy img#xy_agree').css('display') == 'none') {
            $('.xinka-sure-xy img#xy_disagree').hide();
            $('.xinka-sure-xy img#xy_agree').show();
        } else {
            $('.xinka-sure-xy img#xy_disagree').show();
            $('.xinka-sure-xy img#xy_agree').hide();
        }

    })
    //debitEnter.getYZM = true;
    //点击获取验证码
//  var timer = null;
//  $('#xinka-customerConfirm #getMsg').on('click',function(){
//      if($(this).hasClass('yzmGrey')) return;
//      $('#xinka-customerConfirm #getMsg').text('重新获取').addClass('yzmGrey');
//      if(timer){
//          clearInterval(timer);            
//      }
//      $('#xinka-customerConfirm #inp').val("");
//      $("#xinka-auth-time").text('90');       
//      var _ind = 90;
//      timer = setInterval(function(){
//          _ind--;
//          $("#xinka-auth-time").text(_ind);
//          if(_ind == 0){
//              clearInterval(timer);
//              $('#xinka-customerConfirm #getMsg').removeClass('yzmGrey');
//          }
//      },1000);
//      var sendJson={
//              "b" : [{
//                  "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
//                  "workAddress.s":commonJson.workAddress,//工作地址
//                  "orgId.s":commonJson.orgId,//机构号
//                  "moduleId.s":debitEnter.moduleID,//模块编号
//                  "tranId.s":debitEnter.tranId1,//交易编号
//                  "operatorNo.s":commonJson.adminCount,//操作员
//                  "deviceNo.s":commonJson.udId,//设备编号
//                  "SUSER_ID.s": commonJson.orgId+commonJson.adminCount, //机构号+柜员号
//                  "Flags.s": "BBBB", //标记位
//                  "MOBILE_NO.s": debitEnter.tel, //手机号码debitEnter.tel
//                  "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
//                  "faceRecogn.s" : debitEnter.faceRecogn //人脸识别
//              }]
//          };
//      imessageAuthentionServiceFun(sendJson,function(msg){
//          imessageAuthentionServiceSucc(msg);
//      },function(err){
//          $('#xinka-customerConfirm #getMsg').removeClass('yzmGrey');
//          funFail(err);
//      });
//  })
    //页面跳转
    $('#xinka-customerCon-sub').on('click',function(){
        if($('#ic_agree').is(':hidden')){
            showMsg('请确认签名！');
            return;
        }
        /*if($('#xinka-customerConfirm #inp').val()==""){
            showMsg('请填写验证码！');
            return;
        }*/
//      if(!(fmReg.pwD6.test($('#xinka-customerConfirm #inp').val()))){
//          showMsg('请输入正确格式的验证码');
//          return;
//      }
        if ($('.xinka-sure-xy img#xy_agree').css('display') == 'none') {
            showMsg('请勾选确认协议信息');
            return;
        }
//      showLoader("短信验证码验证中...");
//      $('#xinka-customerConfirm #getMsg').removeClass('yzmGrey');
//      if(timer){
//          clearInterval(timer);            
//      }
//      var sendJson={
//              "b" : [{
//                  "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
//                  "workAddress.s":commonJson.workAddress,//工作地址
//                  "orgId.s":commonJson.orgId,//机构号
//                  "moduleId.s":debitEnter.moduleID,//模块编号
//                  "tranId.s":debitEnter.tranId1,//交易编号
//                  "operatorNo.s":commonJson.adminCount,//操作员
//                  "deviceNo.s":commonJson.udId,//设备编号
//                  "SUSER_ID.s": commonJson.orgId+commonJson.adminCount, //机构号+柜员号
//                  "USER_NO.s": debitEnter.USER_NO, //用户唯一标识
//                  "EPay_PassType.s": "ST", //认证类型 ST短信  NT令牌
//                  "MSG_INFO.s": $('#xinka-customerConfirm #inp').val(), //动态口令debitEnter.MSG_INFO
//                  "Flags.s": "BBBB", //标记位
//                  "MOBILE_NO.s": debitEnter.tel, //手机号码debitEnter.tel
//                  "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
//                  "faceRecogn.s" : debitEnter.faceRecogn //人脸识别
//              }]
//          };
//   imessageAuthentionServiceYFun(sendJson,function(msg){
//          imessageAuthentionServiceYSucc(msg);
//      },function(err){
//          funFail(err);
//      });
	showLoader('数字卡卡号查询中...');
		//开始查询虚拟卡卡号
		var sendJson = {
			"b": [{
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"orgId.s": commonJson.orgId, //机构号
				"moduleId.s": debitEnter.moduleID, //模块编号
				"tranId.s": debitEnter.tranId1, //交易编号
				"operatorNo.s": commonJson.adminCount, //操作员
				"deviceNo.s": commonJson.udId, //设备编号
				"CLIENT_NAME.s": custermerInfo.name,
				"DOCUMENT_ID.s": custermerInfo.cerNO,
				"CARD_TYPE.s": debitEnter.cardType, //卡类型
				"PRO_CODE.s": debitEnter.proCode, //卡代码
				"faceRecogn.s": debitEnter.faceRecogn //人脸识别
			}]
		};
		idebitCardInfoServiceFun(sendJson, function(msg) {
			idebitCardInfoServiceSucc(msg);
		}, function(err) {
			funFail(err);
		})
    });
    //点击修改
    $('#xinka-customerCon-edit').on('click',function(){
//      if(timer){
//          clearInterval(timer);            
//      }
        $.mobile.changePage('xinka-messageIn.html',{reverse:true});
    })
});
//虚拟卡 影像复用 页面
$(document).on('pageshow','#xinka-video',function(){
    //从数据库中查询可复用的个人信息
    queryAllcacheCustermerInfo();
    //为每一条数据添加class=‘click'
    $("#xinka-video .box-rows").bind("click",this,function(){
        if($(this).hasClass('click')){
            $(this).removeClass('click');
            $('#xinka-video #btn_next').removeClass('btn_next');
        }else{
            //遍历每一条数据恢复初始状态
            $('#xinka-video .box-rows').each(function(){
                if($(this).hasClass('click')){
                    $(this).removeClass('click');
                    $('#xinka-video #btn_next').addClass('btn_next');
                }
            });
            $(this).addClass('click');
            $('#xinka-video-btn').addClass('btn_next');
        }

    });
    //点击取消
    $('#xinka-video .previous-con').on('click',function(){
        $.mobile.changePage('xinka-readingID.html',{reverse:true});
    })
    //点击影像复用 
    $('#btn_next').on('click',function(){
        if(!($(this).hasClass('btn_next'))) return;
        commonJson.isCustermerInfoMultiplex = true; //使用影像复用功能
        $.mobile.changePage('xinka-readID.html');
    })
})
//虚拟卡提交完成
$(document).on('pageshow','#xinka-complete',function(){
    $('#xinka-complete .name_cn').text(debitEnter.name);
    $('#xinka-complete .phone_num').text(debitEnter.tel);
    $('#xinka-complete .zheng_type').text('身份证');
    $('#xinka-complete .zheng_num').text(debitEnter.cerNO);
    $('#xinka-complete .kehu_num').text(debitEnter.CLIENT_NO);
    $('#xinka-complete .xinka_num').text(debitEnter.CardNo);
    $('#xinka-complete .kaihu_time').text(myTime.UnixToDate(myTime.CurTime()));
    if(debitEnter.pdfUrl != undefined){
        transformStringToImage(debitEnter.pdfUrl,function(msg){
            $('#xinka-complete .basic_erweima img').attr('src',msg);
        },function(err){
            alert(err+'生成二维码失败');
        })
    }
    //点击电子渠道 
    $('#xinka-complete .previous:first').on('click',function(){
        $.mobile.changePage('../dianzi/dianzi-readingID.html', { reverse: true });
    });
    //点击贵宾理财
    $('#xinka-complete .previous:last').on('click',function(){
        $.mobile.changePage('../citigold/citigold-fundSupermarketsOne.html', { reverse: true });
    });
})
//虚拟卡影像对比
$(document).on('pageshow','#xinka-personFace',function(){
    showLoader("影像对比中...");
    transFormBase64(debitEnter.custFacePic,function(msg){
        debitEnter.faceBase64 = msg;
        transFormBase64(custermerInfo.image,function(msg1){
            debitEnter.imageBase64 = msg1;
            $("#xinka-personFace .camera:eq(0)").attr('src',debitEnter.custFacePic);
            $("#xinka-personFace .camera:eq(1)").attr('src',custermerInfo.image);
            $("#xinka-personFace .camera:eq(2)").attr('src',debitEnter.custFacePic);
            if(commonJson.isCustermerInfoMultiplex){
                debitEnter.checkPhoto = custermerInfo.checkPhoto;
            }

            if(lianwanghechaData.CheckResult=='09' || lianwanghechaData.CheckResult=='02'){
        		$("#xinka-personFace .camera:eq(3)").attr('src','data:image/png;base64,'+ debitEnter.checkPhoto);
        }else{
        		$("#xinka-personFace .camera:eq(3)").attr('src','data:image/png;base64,'+ debitEnter.checkPhoto);
        }
            //影像两两对比
            var sendJson={
                    "b" : [{
                        "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
                        "workAddress.s":commonJson.workAddress,//工作地址
                        "orgId.s":commonJson.orgId,//机构号
                        "moduleId.s":debitEnter.moduleID,//模块编号
                        "tranId.s":debitEnter.tranId1,//交易编号
                        "operatorNo.s":commonJson.adminCount,//操作员
                        "deviceNo.s":commonJson.udId,//设备编号
                        "OPERATOR_NO.s":commonJson.adminCount, //业务经办人工号
                        "TRANS_SCENE.s":"0006",  //交易场景 电子卡0006
                        "COMPARE_TYPE.s":"2",  //    比对类型1-客户经理比对，2-客户比对
                        "WS_TYPE.s":"2",  // 终端类型1-PC，2-IOS，3-Android
                        "WSNO.s":commonJson.udId,  //    终端号
                        "VERSION.s":"v1.1.4",  //当前控件版本
                        "TRANS_CHANNEL.s":"301",  //   渠道301
                        "ID_CARD.s":custermerInfo.cerNO,  // 身份证号码
                        "IMG_BASE.s":debitEnter.faceBase64,  //      现场照片
                        "CRYPT_TYPE.s":"0",  //   图像是否经过加密0-未加密，1-加密方式一，2加密方式二
                        "ID_IMG_BASE.s":debitEnter.checkPhoto,  //联网核查照片
                        "CARD_IMG_BASE.s":debitEnter.imageBase64,  //  芯片照片
                        "BUSI_TYPE.s":"01"  //  电子卡“01”

                    }]
                };
            //alert(JSON.stringify(sendJson));
            ifacelRecognitionSeFun(sendJson,function(msg){
                IFacelRecognitionServiceDebitSucc(msg);
            },function(err){
                debitEnter.faceRecogn = '2'; //自动不通过
                $("#xinka-personFace .face-result").addClass('no-pass').text('未通过');
                $("#xinka-personFace .center-header").text('人脸识别未通过！');
                $('#xinka-personFace .previous:last').addClass('btn_next');
                $('#xinka-personFace .previous:last').text('远程复核');
                funFail(err);
            })
        },function(err){
            alert('影像转换失败！')
        })
    },function(err){
        alert('影像转换失败！')
    })


    //点击查询在线客户经理
    $('#xinka-managerList a').on('click',function(){
        showLoader("获取远程复核客户经理...");
        var sendJson={
                "b" : [{
                    "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
                    "workAddress.s":commonJson.workAddress,//工作地址
                    /*"orgId.s":commonJson.orgId,//机构号
                    "":debitEnter.moduleID,//模块编号
                    "tranId.s":debitEnter.tranId1,//交易编号*/
                    "operatorNo.s":commonJson.adminCount,//操作员
                    "deviceNo.s":commonJson.udId//设备编号
                }]
            };
        ISysUserServiceManListFun(sendJson,function(msg){
            ISysUserServiceManListDebitSucc(msg);
        },function(err){
            funFail(err);
        })
    })
    //点击继续 
    $('#xinka-personFace .previous:last').on('click',function(){
        if(!($(this).hasClass('btn_next'))) return;
        if($(this).text() == '继续'){
            $.mobile.changePage('xinka-messageIn.html', { reverse: true });
        }else{
            if($('#xinka-managerList select').val() == ''){
                showMsg('请选择一个客户经理');
                return;
            }
             var sendJson={
                    "b" : [{
                        "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
                        "workAddress.s":commonJson.workAddress,//工作地址
                        "orgId.s":commonJson.orgId,//机构号
                        "moduleId.s":debitEnter.moduleID,//模块编号
                        "tranId.s":debitEnter.tranId1,//交易编号
                        "operatorNo.s":commonJson.adminCount,//操作员
                        "deviceNo.s":commonJson.udId,//设备编号
                        "platGlobalSeq.s":debitEnter.platGlobalSeqP, //流水号
                        "topic.s":"N/A", //主题N/A
                        "code.s":"101", //指令101
                        "paramUrl.s":"abc", //参数地址
                        "days.s":"0", //有效天数
                        "appKey.s":"com.nqsky.bank.service", //appKey  com.nqsky.bank.service
                        "context.s":"您有一条远程复核业务需要办理",//推送内容
                        "userIds.s":$('#xinka-managerList select').val(),//用户ID  $('#xinka-managerList select').val()
                        "busiType.s":"01", //电子卡01
                        "cardResult.s":debitEnter.cardResult,//联网核查对比
                        "chipResult.s":debitEnter.chipResult,//芯片对比
                    }]
                };
            //alert(JSON.stringify(sendJson));
            showLoader("正在等待"+$('#xinka-managerList option:selected').attr('realName')+"[手机:"+$('#xinka-managerList option:selected').attr('cellPhone')+"]复核...");
            debitEnter.telCheck = true;

            iissuesServiceFun(sendJson,function(msg){
                iissuesServiceSucc(msg);
            },function(err){
                funFail(err);
            })
        }

    });
    //点击F放弃
    $('#xinka-personFace .previous:first').on('click',function(){
        $.mobile.changePage('xinka-customerP.html', { reverse: true });
    });
});




$(document).on('pageshow','#xinka-cardNoQuery',function(){
	$('#xinka-query-cardno').on('click',function(){
		$('#debitCardNo').text('');
		$('#validDate').text('');
		$('#custName').val('');
		$('#voucherStatus').val('').selectmenu('refresh');
		if(!fmReg.cerNo.test($('#doc_no').val()))
		{
			showMsg(fmRegMsg.cerNo);
			return;
		}
		showLoader("查询中...");
		var sendJson={
                    "b" : [{
                        "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
                        "workAddress.s":commonJson.workAddress,//工作地址
                        "orgId.s":commonJson.orgId,//机构号
                        "moduleId.s":debitEnter.moduleID,//模块编号
                        "tranId.s":debitEnter.tranId1,//交易编号
                        "operatorNo.s":commonJson.adminCount,//操作员
                        "deviceNo.s":commonJson.udId,//设备编号
                        "OPERATOR_NO.s":commonJson.adminCount, //业务经办人工号
            		"DOC_TYPE.s":$('#c-com-property option:selected').val(),
            		"DOC_NO.s":$('#doc_no').val()
                    }]
                };
        getXinKaServiceFun(sendJson,function(msg){
        	getXinKaServiceSuccessFun(msg,sendJson);
        },function(err){
        $('#debitCardNo').text('');
		$('#validDate').text('');
		$('#custName').val('');
		$('#voucherStatus').val('').selectmenu('refresh');;
		funFail(err);
		$('#custName').focus();
        });
		

	});
	$('#xinka-cardNoQuery .OCRID_scan').on('click',function(){	
        if ($("#c-com-property option:selected").val() == 0) {
            ocrIdCardFun();
        } else {
            showTags({
                'title': '提示',
                'content': "OCR暂时只支持身份证",
                'ok': {}
            });
            return;
        }

    
		

	});
	
	
});
