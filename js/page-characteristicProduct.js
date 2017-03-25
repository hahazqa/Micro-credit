/**
 * Created by Administrator on 2016/5/7.
 */
/******************/
/*需要的私有检查方法*/
/******************/
function todayIsY(){
    var myDate = myTime.curDate(),
        y = myDate.getFullYear(),
        m = (myDate.getMonth() + 1) > 9 ? (myDate.getMonth() + 1) : '0' + (myDate.getMonth() + 1),
        d = myDate.getDate() > 9 ? myDate.getDate() : '0' + myDate.getDate(),
        todayIs = y + '' + m + '' + d;
    return todayIs;
}
//如果是当天请求就从数据库中获取
function ReRequestFuncY(){
    showLoader('获取产品列表');

    if (todayIsY() == localStorage.specialProTime) {
        var isReRequest = false;
    } else {
        var isReRequest = true;
    }

    if (!isReRequest) {
        queryTableDataByConditions({
            "databaseName": "myDatabase", //数据库名
            "tableName": "productdisplay_info", //表名
            "conditions": {"PRO_TYPE": '特色产品'} //条件查询
        }, function (msg) {
            (function(){
                if (msg == '') {
                    var sendJson = {
                        "b": [{
                            'deviceNo.s'     : commonJson.udId,                //设备编号
                            'moduleId.s'     : characteristicProduct.moduleId, //模块号
                            'tranId.s'       : characteristicProduct.tranId,   //交易号
                            'orgId.s'        : commonJson.orgId,               //机构号
                            'operatorNo.s'   : commonJson.adminCount,          //操作员号
                            'offlineOnline.s': commonJson.offlineOnline,       //脱机，联机
                            'workAddress.s'  : commonJson.workAddress          //工作地点
                        }]
                    }
                    getSpecialtyProductListFun(sendJson,function(msg){
                        getSpecialtyProductListFunSucc(msg)
                    },function(err){
                        funFail(err);
                    })
                }
                var textHtml = '';
                $.each(msg, function(index, el) {
                    var imgUrl = base64decode(el.imgUrl);
                    textHtml += ' <div class="product_box">' +
                        '<img src="data:image/png;base64,' + imgUrl + '"proRemark1="' + el.proRemark1 + '" class="product_img"/>' +
                        '<div class="product_content">' +
                        '<div class="product_register ' + el.className +'" PRONAME="' + el.PRONAME + '" PRODCODE="'+el.PRODCODE+'">签&nbsp;&nbsp;&nbsp;约</div>' +
                        '<p class="product_title">' + el.PRONAME + '</p>' +
                        '<div class="product_Intro">' + el.pro_description.replace(/\n/g, "<br/>") + '</div>' +
                        '</div>' +
                        '</div>';
                });


                $('.common-productList-Y .conter-auto').html(textHtml);
                hideLoader();

                //长按图片显示话术
                $('#characteristicProductA .product_img').on('taphold', function () {
                    productTapHold($(this));
                })

                //隐藏话术
                $("#characteristicProductA").on('tap', function (ev) {
                    var oTarget = ev.target;
                    if ($(oTarget).closest('.product_img').length || $(oTarget).closest('.product_img_msg').length) {

                    } else {
                        $(".product_img_msg").remove();
                    }
                })

                //为每个产品添加点击事件
                $('.common-productList-Y .product_register').click(function (event) {
                    characteristicProduct.agreement = $(this).attr('AGREEMENT');
                    characteristicProduct.productName = $(this).attr('PRONAME');
                    characteristicProduct.productCode = $(this).attr('PRODCODE');
                    //根据特色产品不同，判断跳转的内页
                    if($(this).hasClass('characteristicP-normal')) {
                        statusY.isSpecial = false;
                        $.mobile.changePage('characteristicProductB-readingID.html');
                    } else {
                        statusY.isSpecial = true;
                        $.mobile.changePage('characteristicProductB-readingID.html');
                    }
                });
            })()
        }, function (err) {
            alert(err + "失败！");
        });
        return;
    }

    var sendJson = {
        "b": [{
            'deviceNo.s'     : commonJson.udId,                //设备编号
            'moduleId.s'     : characteristicProduct.moduleId, //模块号
            'tranId.s'       : characteristicProduct.tranId,   //交易号
            'orgId.s'        : commonJson.orgId,               //机构号
            'operatorNo.s'   : commonJson.adminCount,          //操作员号
            'offlineOnline.s': commonJson.offlineOnline,       //脱机，联机
            'workAddress.s'  : commonJson.workAddress          //工作地点
        }]
    }
    getSpecialtyProductListFun(sendJson,function(msg){
        getSpecialtyProductListFunSucc(msg)
    },function(err){
        queryTableDataByConditions({
            "databaseName": "myDatabase", //数据库名
            "tableName": "productdisplay_info", //表名
            "conditions": {"PRO_TYPE": '特色产品'}
        }, function (msg) {
            if (msg == '') {
                localStorage.specialProTime = 1;
            }
        }, function (err) {
            alert(err + "失败！")
        });
        funFail(err);
    })
}

//获取特色产品模块 获取产品成功回调
function getSpecialtyProductListFunSucc(msg){
    var responseCode = preJsonY(msg);
    var textHtml = '';
    hideLoader();
    //00 成功获取
    if(responseCode[0].results == '00'){
        //循环添加产品
        //alert(responseCode);
        $.each(responseCode, function (index, el) {
            if (index == 0) return;
            var imgUrl = base64decode(el.specialtyProductVO[0].attach);
            if(el.specialtyProductVO[0].prodSummary == '供楼宝'){
                var className = 'characteristicP-special';
            } else {
                var className = 'characteristicP-normal';
            }
            textHtml += ' <div class="product_box">' +
                '<img src="data:image/png;base64,' + imgUrl + '"proRemark1="' + el.specialtyProductVO[0].remark + '" class="product_img"/>' +
                '<div class="product_content">' +
                '<div class="product_register ' + className +'" PRONAME="' + el.specialtyProductVO[0].prodSummary + '" PRODCODE="'+el.specialtyProductVO[0].prodCode+'">签&nbsp;&nbsp;&nbsp;约</div>' +
                '<p class="product_title">' + el.specialtyProductVO[0].prodSummary + '</p>' +
                '<div class="product_Intro">' + el.specialtyProductVO[0].description.replace(/\n/g, "<br/>") + '</div>' +
                '</div>' +
                '</div>';
        });

        //插入DOM树
        $('.common-productList-Y .conter-auto').html(textHtml);

        //先删除表里数据
        deleteTableData({
            "databaseName": "myDatabase", //数据库名
            "tableName": "productdisplay_info", //表名
            "conditions": [{"PRO_TYPE": '特色产品'}] //条件查询
        }, function (msg) {
            //再插入数据库
            var index = 1;
            (function dataInsertSpecialProduct(Item,index) {
                Item[index].specialtyProductVO[0].agreement = Item[index].specialtyProductVO[0].agreement.replace(/\'/g, ";;;a;&nbsp;a;;;");
                if(Item[index].specialtyProductVO[0].prodSummary == '供楼宝'){
                    var className = 'characteristicP-special';
                } else {
                    var className = 'characteristicP-normal';
                }
                var sendDataJson = {
                    "databaseName": "myDatabase",
                    "tableName": "productdisplay_info",
                    "data": [{
                        "PRO_TYPE": '特色产品',
                        "PRONAME": Item[index].specialtyProductVO[0].prodSummary,
                        "UPDATE_TIME": Item[index].specialtyProductVO[0].createdDate,
                        "proRemark1": Item[index].specialtyProductVO[0].remark,
                        "imgUrl": Item[index].specialtyProductVO[0].attach,
                        "AGREEMENT": Item[index].specialtyProductVO[0].agreement,
                        "className": className,
                        "pro_description": Item[index].specialtyProductVO[0].description,
                        "PRODCODE": Item[index].specialtyProductVO[0].prodCode,
                        "PRO_ATTACH": Item[index].specialtyProductVO[0].attach,
                        "REMARK1": Item[index].specialtyProductVO[0].createdBy,
                        "REMARK2": Item[index].specialtyProductVO[0].modifiedBy,
                        "REMARK3": Item[index].specialtyProductVO[0].orderNo,
                        "REMARK4": '',
                        "REMARK5": '',
                        "REMARK6": '',
                        "REMARK7": ''
                    }]
                };
                insertTableData(sendDataJson, function(msg) {
                    index++;
                    if (index == Item.length) {
                        localStorage.specialProTime = todayIsY();
                        return;
                    }
                    dataInsertSpecialProduct(Item, index);
                }, function(err) {
                    showTags({
                        'title': '提示',
                        'content': '数据库读写失败，请联系技术人员',
                        'ok': {}
                    });
                });
            })(responseCode,index)
        }, function (err) {

        });

        //长按图片显示话术
        $('#characteristicProductA .product_img').on('taphold', function () {
            productTapHold($(this));
        })

        //隐藏话术
        $("#characteristicProductA").on('tap', function (ev) {
            var oTarget = ev.target;
            if ($(oTarget).closest('.product_img').length || $(oTarget).closest('.product_img_msg').length) {

            } else {
                $(".product_img_msg").remove();
            }
        })

        //为每个产品添加点击事件
        $('.common-productList-Y .product_register').click(function (event) {
            characteristicProduct.productName = $(this).attr('PRONAME');
            characteristicProduct.productCode = $(this).attr('PRODCODE');
            //根据特色产品不同，判断跳转的内页
            if($(this).hasClass('characteristicP-normal')) {
                statusY.isSpecial = false;
                $.mobile.changePage('characteristicProductB-readingID.html');
            } else {
                statusY.isSpecial = true;
                $.mobile.changePage('characteristicProductB-readingID.html');
            }
        });
    } else if(responseCode[0].results == '08'){
        var sendJson = {
            "b": [{
                'deviceNo.s'     : commonJson.udId,                //设备编号
                'moduleId.s'     : characteristicProduct.moduleId, //模块号
                'tranId.s'       : characteristicProduct.tranId,   //交易号
                'orgId.s'        : commonJson.orgId,               //机构号
                'operatorNo.s'   : commonJson.adminCount,          //操作员号
                'offlineOnline.s': commonJson.offlineOnline,       //脱机，联机
                'workAddress.s'  : commonJson.workAddress          //工作地点
            }]
        }
        getSpecialtyProductListFun(sendJson,function(msg){
            getSpecialtyProductListFunSucc(msg)
        },function(err){
            funFail(err);
        })
    }else{
        showTags({
            'title': '提示',
            'content': '产品获取失败,确认返回首页',
            'ok': {
                'title': '确认',
                'fun': function () {
                    $.mobile.changePage('../main.html', {reverse:true});
                }
            }
        });
    }
}

//特色产品 客户号查询贷款账号成功回调
function commonGetLoansRecordListsuccY(msg,Obj,bussObj){
    var responseCode = preJsonY(msg);
    var textHtml = '';
        bussObj.accountArr = [];
    //00 成功获取
    if(responseCode[0].results == '00'){
        $.each(responseCode, function (index, val) {
            if (index == 0) return;
            bussObj.accountArr.push(val);
        })
        $.mobile.changePage(Obj.nextUrl);
    }else if (responseCode[0].results == "08") {
        getLoansRecordListFun({
            "b": [{
                "deviceNo.s"     : commonJson.udId,         //设备编号
                "moduleId.s"     : bussObj.moduleId,        //模块编号
                "tranId.s"       : bussObj.tranId,          //交易编号
                "orgId.s"        : commonJson.orgId,        //机构号
                "operatorNo.s"   : commonJson.adminCount,   //操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s"  : commonJson.workAddress,  //工作地址
                'CLIENT_NO.s'    : bussObj.CLIENT_NO,       //工作号
            }]
        },function (msg) {
            commonGetLoansRecordListsuccY(msg,Obj,bussObj)
        }, function (err) {
            funFail(err)
        });
    }else if(responseCode[0].results == "03"){
        hideLoader();
        showTags({
            'title': '提示',
            'content': '暂不具备申请供楼宝的条件',
            'ok': {
                'title': '确认',
                'fun': function () {
                    $.mobile.changePage('../main.html', {reverse:true});
                }
            }
        });
    } else {
        hideLoader();
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {
                'title': '确认',
                'fun': function () {
                }
            }
        });
    }
}



/****************/
/*页面交互所写方法*/
/****************/

//产品页面（characteristicProductA.html）
$(document).on('pageshow','#characteristicProductA',function(){
    //初始化数据
    commonInitY();
    //便民签约特色产品接口 获取产品列表
    getCurrentLocationCoordinateFun(ReRequestFuncY)
    
    
    /*var sendJson = {
        "b": [{
            'deviceNo.s'     : commonJson.udId,                //设备编号
            'moduleId.s'     : characteristicProduct.moduleId, //模块号
            'tranId.s'       : characteristicProduct.tranId,   //交易号
            'orgId.s'        : commonJson.orgId,               //机构号
            'operatorNo.s'   : commonJson.adminCount,          //操作员号
            'offlineOnline.s': commonJson.offlineOnline,       //脱机，联机
            'workAddress.s'  : commonJson.workAddress          //工作地点
        }]
    }
    getSpecialtyProductListFun(sendJson,function(msg){
        getSpecialtyProductListFunSucc(msg)
    },function(err){
        funFail(err);
    })*/

})

//读取身份证页面（characteristicProductB-readingID.html）
$(document).on('pageshow','#characteristicProductB-readingID',function(){

    characteristicProduct.picFileARR  = [];

    //点击读取身份证按钮
    $('.footter .previous').on('click',function(){
        //调用身份证读取通用方法
        commonReadIDCardY(function(msg){
            //读卡成功 对象值statusY.isReadCardSucc = true;
            $.mobile.changePage('characteristicProductC-readID.html')
        },function(err){
            //读卡失败成功 对象值statusY.isReadCardSucc = false;
            $.mobile.changePage('characteristicProductC-readID.html')
        })
    })

    //点击影像复用
    $(".conter-con .picRe").on('click', function () {
        $.mobile.changePage('characteristicProduct-video.html');
    })
})

////影像复用界面(socialSecurity_customerInfo.html)
$(document).on("pageshow", '#characteristicProduct-video', function () {
    //alert(convenienceContract.whichPage);
    //从数据库中查询可复用的个人信息
    queryAllcacheCustermerInfo();

    $('.footter .previous:eq(0)').on('tap', function () {
            $.mobile.changePage('characteristicProductB-readingID.html', {
                reverse: true
            });
    });

    $('.footter .previous:eq(1)').on('tap', function () {
        if (!($(this).hasClass('btn_next'))) return;
        commonJson.isCustermerInfoMultiplex = true; //确定影像复用
        characteristicProduct.custAndCustOwnerPic = custermerInfo.custAndCustOwnerPic; //与客户合影照片
        characteristicProduct.frontIDCardPic = custermerInfo.frontIDCardPic; //身份证正面
        characteristicProduct.backIDCardPic = custermerInfo.backIDCardPic; //身份证反面
        $.mobile.changePage('characteristicProductC-readID.html');
    })
});

//身份证联网核查与查核心页面（characteristicProductC-readID.html）
$(document).on('pageshow','#characteristicProductC-readID',function(){
    //进入界面进行联网核查
    if(commonJson.isCustermerInfoMultiplex){
        //如果是影响复用直接复用
        $(".loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
        $('.footter .previous:eq(1)').addClass('btn_next');
        $('.footter .previous:eq(0)').addClass('btn_next');
        $('.footter .previous:eq(0)').addClass('back-1');
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
    } else{
        //如果不是影像复用组需要联网核查
        //第一个对象是联网核查 核查异常重新核查传入的变量参数
        //第二个对象是联网核查 核查异常继续办理业务传入的变量参数(即下一步联网核查方法需要的参数)
        //第三个对象是联网核查 核查异常继续办理业务传入的变量参数 用于保存客户号CLIENT_NO(即下一步联网核查方法需要的参数)
        //第四个为扩展方法 如果有有效客户信息 查询有无有效账卡号
        commonIcitizenCertificateIdenifyY({
            //联网核查需要传入的数据
            nextUrl : 'characteristicProductC-readID.html',

            prevUrl : 'characteristicProductA.html'
            
        },{
            sendJson : {
                "CARD_CATEGORY" : '2'                             //查询卡类型
            },

            nextUrl : 'characteristicProductD-agreement.html',

            prevUrl : 'characteristicProductA.html'
            
        },characteristicProduct,function(){
            commonGetDocLicenceListBankFunY({

                sendJson : {
                    "isSBICCard": ''                    //查询卡类型(社保卡)
                },

                nextUrl : 'characteristicProductD-agreement.html',

                prevUrl : 'characteristicProductA.html'
                
            },characteristicProduct)
        })
    }

    //点击重新获取身份证
    $('.footter .previous:eq(0)').on('click',function(){
        $.mobile.changePage('characteristicProductB-readingID.html',{
            reverse:true
        })
    })

    //点击下一步进入下一页
    $('.footter .previous:eq(1)').on('click',function(){
        if(! $('.footter .previous:eq(1)').hasClass('btn_next')) return;
        
        //查询客户核心方法需要的参数
        //查询客户核心方法需要的参数 用于保存客户号CLIENT_NO
        //扩展方法查询有无有效账卡号 传入的第二个参数添加属性accountArr 保存所有符合的账号
        commonIcustomerInfoServiceCharacteristicProductY({
            
            sendJson : {
                "CARD_CATEGORY" : '2'                             //查询卡类型
                
            },
            
            nextUrl : 'characteristicProductD-agreement.html',

            prevUrl : 'characteristicProductA.html'
            
        },characteristicProduct,function(){
            commonGetDocLicenceListBankFunY({

                sendJson : {
                    "isSBICCard": '',                     //查询卡类型(社保卡)
                },

                nextUrl : 'characteristicProductD-agreement.html',

                prevUrl : 'characteristicProductA.html'
            
            },characteristicProduct)
        });
    })
})

//客户须知页面（characteristicProductD-agreement.html）
$(document).on('pageshow','#characteristicProductD-agreement',function(){

    queryTableDataByConditions({
        "databaseName": "myDatabase", //数据库名
        "tableName": "productdisplay_info", //表名
        "conditions": {
            "PRODCODE": characteristicProduct.productCode
        }
    }, function (msg) {
        var PROTOCOL = msg[0].AGREEMENT.replace(/;;;a;&nbsp;a;;;/g, "'");
        $('.agree-content').html(PROTOCOL);
    }, function (err) {
        showMsg('查询数据库失败' + msg);
    });
    
    //同意 可以点击下一步
    $('#agree-btn').on('click',function(){
        if($('#ic-agree').css('display') == 'none'){
            $('#ic-agree').css('display','inline-block');
            $('#ic-disagree').css('display','none');
            $('.footter .previous:eq(1)').addClass('btn_next');
        } else {
            $('#ic-disagree').css('display','inline-block');
            $('#ic-agree').css('display','none');
            $('.footter .previous:eq(1)').removeClass('btn_next');
        }
    })

    $('.footter .previous:eq(1)').on('click',function(){
        if(! $(this).hasClass('btn_next')) return ;
        $.mobile.changePage('characteristicProductE-customerP.html')
    })

    $('.footter .previous:eq(0)').on('click',function(){
        $.mobile.changePage('characteristicProductB-readingID.html',{
            reverse:true
        })
    })
})

//影像采集页面（characteristicProductE-customerP.html）
$(document).on('pageshow','#characteristicProductE-customerP',function(){

    //判断是否有影像复用
    if(commonJson.isCustermerInfoMultiplex && !statusY.savePic){
        queryTableDataByConditions({
            "databaseName": "myDatabase",
            "tableName": "customer_info",
            "conditions": {
                "SUBMITTIME": "between " + commonJson.submitTime + " and " + commonJson.submitTime
            }
        }, function (msg) {
            var CUSTANDCUSTOWNERPICBase64 = msg[0].CUSTANDCUSTOWNERPIC.replace(/\\/g, "").replace('data:image/png;base64,', '');
            var FRONTIDCARDPICBase64 = msg[0].FRONTIDCARDPIC.replace(/\\/g, "").replace('data:image/png;base64,', '');
            var BACKIDCARDPICBase64 = msg[0].BACKIDCARDPIC.replace(/\\/g, "").replace('data:image/png;base64,', '');

            //身份证正面base64转路径
            Meap.transFormImage(getYMDHMSM('frontIDCardPic') + commonJson.udId, FRONTIDCARDPICBase64, 'picSty', function (msg2) {
                $('.img_box:eq(1) .customer').append('<img src="' + msg2 + '" width="100%" height="115px" class="camera-pic">');
            }, function (err) {
                showMsg('身份证正面base64转路径失败');
            })
            //身份证反面base64转路径
            Meap.transFormImage(getYMDHMSM('backIDCardPic') + commonJson.udId, BACKIDCARDPICBase64, 'picSty', function (msg3) {
                $('.img_box:eq(2) .customer').append('<img src="' + msg3 + '" width="100%" height="115px" class="camera-pic">');

            }, function (err) {
                showMsg('身份证反面base64转路径失败');
            })
            $('.img_box:eq(1) .rephoto,.img_box:eq(3) .rephoto,.img_box:eq(4) .rephoto').text('重拍');
            $('.img_box:eq(1) .camera,.img_box:eq(3) .camera,.img_box:eq(4) .camera').hide();
            $('.img_box:eq(2) .rephoto,.img_box:eq(3) .rephoto,.img_box:eq(4) .rephoto').text('重拍');
            $('.img_box:eq(2) .camera,.img_box:eq(3) .camera,.img_box:eq(4) .camera').hide();
        },function(err){

        })
    } else if(statusY.savePic){
        $.each(characteristicProduct.picFileARR, function (index, el) {
            if(characteristicProduct.picFileARR[index] == '') return;
            el = MT_path + el.split("/")[el.split("/").length - 1];
            $('.img_box:eq(' + index + ') .customer').find('.camera-pic').remove()
            $('.img_box:eq(' + index + ') .customer').append('<img src="' + el.replace(/\\/g, "") + '" width="100%" height="115px" class="camera-pic">');
            $('.img_box:eq(' + index + ') .rephoto').text('重拍');
            $('.img_box:eq(' + index + ') .camera').hide();
        })
        //监测下一步是否可点击
        var ind = 0;
        for (var i = 0; i < 3; i++) {
            if ($('.customer:eq(' + i + ')').find("img").length == 2) {
                ind++;
                if (ind >= 3) {
                    $('.footter .previous:eq(1)').addClass('btn_next');
                } else {
                    $('.footter .previous:eq(1)').removeClass('btn_next');
                }
            };
        }
    }

    //预览大图 点击关闭
    $('.bigpic-review-close').click(function (event) {
        commonImageAcquisition.reviewImgClose();
    });

    //预览大图 删除图片
    $('.bigpic-review-del').click(function (event) {
        //alert(commonImageAcquisition.imgSrc);
        commonImageAcquisition.delImg(commonImageAcquisition.curParentObj, commonImageAcquisition.imgSrc,3);
    });

    //预览大图 重新拍照
    //reGetImg方法传入的最后一个参数对象保存 isCompress属性 判断是否需要重新对比
    $('.bigpic-review-rephone').click(function (event) {
        //alert(commonImageAcquisition.imgSrc);
        commonImageAcquisition.reGetImg(commonImageAcquisition.curParentObj, commonImageAcquisition.imgSrc, characteristicProduct);
    });

    //点击拍照
    //reGetImg方法传入的最后一个参数对象保存 isCompress属性 值为false 判断是否需要重新对比
    $('.customerP .conter-con').on('click', '.customer', function (ev) {
        commonImageAcquisition.curParentObj = $(this);
        commonImageAcquisition.imgSrc = $(this).find('.camera-pic').attr('src');
        var oTarget = ev.target;
        if ($(this).find('.rephoto').html() == '重拍') { //重拍
            if ($(oTarget).hasClass('rephoto')) {
                commonImageAcquisition.reGetImg(commonImageAcquisition.curParentObj, commonImageAcquisition.imgSrc, characteristicProduct);
            }
            if ($(oTarget).hasClass('camera-pic')) { //预览大图
                commonImageAcquisition.imgSrc = $(oTarget).attr('src');
                commonImageAcquisition.reviewImg($(oTarget).attr('src'));
            }
            return;
        }
        //拍照
        if (commonImageAcquisition.curParentObj.parent().hasClass('get-face')) {
            commonImageAcquisition.getFace(commonImageAcquisition.curParentObj,3,characteristicProduct);
        } else {
            commonImageAcquisition.getImg(commonImageAcquisition.curParentObj,3);
        }
    });

    //点击下一步
    $('.footter .previous:eq(1)').on('click',function(){
        if(! $('.footter .previous:eq(1)').hasClass('btn_next')) return;

        //图片路径缓存 可供最后打包上传
        commonCacheYXCJY(characteristicProduct,{
            '0' : 'custFacePic' ,
            '1' : 'frontIDCardPic',
            '2' : 'backIDCardPic',
            'len' : 3
        });
        
        if(characteristicProduct.isCompress){
            if(statusY.isSpecial){
                $.mobile.changePage('characteristicProductG-contract-s.html')
            } else{
                $.mobile.changePage('characteristicProductG-contract.html')
            }
        } else{
            $.mobile.changePage('characteristicProductF-personFace.html')
        }

    })

    //点击上一步
    $('.footter .previous:eq(0)').on('click',function(){

        //图片路径缓存 可供最后打包上传
        commonCacheYXCJY(characteristicProduct,{
            '0' : 'custFacePic' ,
            '1' : 'frontIDCardPic',
            '2' : 'backIDCardPic',
            'len' : 3
        });

        $.mobile.changePage('characteristicProductD-agreement.html',{
            reverse:true
        })
    })
})

//人脸对比页面（characteristicProductF-personFace.html）
$(document).on('pageshow','#characteristicProductF-personFace',function(){
    //隐藏客服经理远程核实框
    $("#managerList").hide();
    showLoader("影像对比中...");

    transFormBase64(characteristicProduct.custFacePic, function (msg) {
        characteristicProduct.faceBase64 = msg;
        transFormBase64(custermerInfo.image, function (msg1) {
            characteristicProduct.imageBase64 = msg1;
            $(".personFace .camera:eq(0)").attr('src', characteristicProduct.custFacePic);
            $(".personFace .camera:eq(1)").attr('src', custermerInfo.image);
            $(".personFace .camera:eq(2)").attr('src', characteristicProduct.custFacePic);

            if (lianwanghechaData.CheckResult == '09' || lianwanghechaData.CheckResult == '02') {
                $(".personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + custermerInfo.checkPhoto);
            } else {
                $(".personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + custermerInfo.checkPhoto);
            }

            //图像转换成功
            //传入方法的最后一个参数保存  isTelCheck属性    值true 远程符合成功
            //传入方法的最后一个参数保存  faceRecogn属性    值保存人脸识别状态
            //传入方法的最后一个参数保存  platGlobalSeq属性 值保存客户流水号
            //传入方法的最后一个参数保存  cardResult属性    值保存联网核查结果
            //传入方法的最后一个参数保存  chipResult属性    值保存芯片结果
            commonifacelRecognitionSeFunY(
                //此方法封装了包括footter按钮点击事件
                {

                'prevUrl' : 'characteristicProductD-agreement',

                'nextUrl' : 'characteristicProductG-contract'

            },characteristicProduct);
        }, function (err) {
            alert('影像转换失败！')
        })
    }, function (err) {
        alert('影像转换失败！')
    })

})

//签约产品页面（characteristicProductG-contract.html）
$(document).on('pageshow','#characteristicProductG-contract',function(){
    characteristicProduct.isCompress = true;

    //循环添加卡号
    var text = '';
    $.each(characteristicProduct.accountArr,function(index,el){
        text += '<option value="'+ el.docLicenceVO[0].DOC_TYPE +'">'+ el.docLicenceVO[0].ISSUE_ACCT_NO +'</option>'
    })


    //页面显示是讲信息写入页面
    $('#XM').html(custermerInfo.name)
    $('#CPM').html(characteristicProduct.productName)
    $('#ZKH').append(text);

    //判断下一步是否可点击
    console.log($('#ZKH-button span')[0])
    $('#ZKH-button select').on('change',function(){
        if($('#ZKH-button span').html() !== '请选择'){
            $('.footter .previous:eq(1)').addClass('btn_next');
        } else {
            $('.footter .previous:eq(1)').removeClass('btn_next');
        }
    })

    //返回上一页
    $('.footter .previous:eq(0)').on('click',function(){
        $.mobile.changePage('characteristicProductE-customerP.html',{
            reverse:true
        })
    })

    //进入下一页
    $('.footter .previous:eq(1)').on('click',function(){
        if(! $('.footter .previous:eq(1)').hasClass('btn_next')) return;
        characteristicProduct.QYZH = $('#ZKH-button span').html();
        $('#ZKH option').each(function(index,el){
            if($(el).html() == $('#ZKH-button span').html()){
                characteristicProduct.DOC_TYPE =  $(el).attr('value');
            }
        })
        if(! characteristicProduct.DOC_TYPE){
            characteristicProduct.DOC_TYPE = '008';
        }
        $.mobile.changePage('characteristicProductH-customerConfirm.html');
    })
})

//签约产品页面（characteristicProductG-contract-s.html）
$(document).on('pageshow','#characteristicProductG-contract-s',function(){
    characteristicProduct.isCompress = true;

    //页面显示是讲信息写入页面
    var text = '';
    $.each(characteristicProduct.accountArr,function(index,el){
        text += '<li class="box-rows"><div>'+
                 el.clientLoansNoVO[0].LOAN_NO+'</div><div class="QYZH">'+
                 el.clientLoansNoVO[0].ACCT_59+'</div><div>'+
                 el.clientLoansNoVO[0].LOAN_PERIOD+'月</div><div>'+
                 dateToYMDhms(el.clientLoansNoVO[0].MATURE_DATE,false)+'</div><div>'+
                 el.clientLoansNoVO[0].LOAN_CURRENT_AMT+'</div></li>'
    });
    $('.table-box .box-content').append(text);
    $('#XM').html(custermerInfo.name);
    $('#CPM').html(characteristicProduct.productName);

    if($('.table-box').find('.box-rows').size() === 1){
        $('.footter .previous:eq(1)').addClass('btn_next');
        $('.table-box').find('.box-rows:eq(0)').addClass('click');
        $('#ZKH').html($('.table-box').find('.box-rows:eq(0)').find('.QYZH').html());
    }

    if($('#zkh').html() == ''){
        $('.footter .previous:eq(1)').removeClass('btn_next');
    }

    $('.table-box .box-rows').on('click',function(){
        $('.footter .previous:eq(1)').addClass('btn_next');
        $(this).addClass('click').siblings().removeClass('click');
        text = $(this).find('.QYZH').html();
        $('#ZKH').html(text);
    })
    
    //返回上一页
    $('.footter .previous:eq(0)').on('click',function(){
        $.mobile.changePage('characteristicProductE-customerP.html',{
            reverse:true
        })
    })
    
    //点击下一步
    $('.footter .previous:eq(1)').on('click',function(){
        if(! $('.footter .previous:eq(1)').hasClass("btn_next")) return;

        if($('#ZKH').html() == ''){
            showMsg('还没有可用签约账卡号');
            return;
        }
        characteristicProduct.QYZH = $('.box-content .click').find('.QYZH').html()
        if(characteristicProduct.QYZH.length < 16){
            characteristicProduct.DOC_TYPE = '001';
        } else {
            characteristicProduct.DOC_TYPE = '008';
        }
        $.mobile.changePage('characteristicProductH-customerConfirm.html')
    })
})

//客户确认页面（characteristicProductH-customerConfirm.html）
$(document).on('pageshow','#characteristicProductH-customerConfirm',function(){

    //写入客户信息
    $('#QYCP').html(characteristicProduct.productName)
    $('#HM').html(custermerInfo.name)
    $('#QYZH').html(characteristicProduct.QYZH)
    
    //客户签名
    //传入对象，添加signUrl属性 保存签名图片路径
    commonCustomerSignatureFunY(characteristicProduct);
    
    //返回修改页面
    $('#socialSecurity-customerCon-edit').on('click',function(){
        if(statusY.isSpecial){
            $.mobile.changePage('characteristicProductG-contract-s.html',{
                reverse:true
            })
        } else {
            $.mobile.changePage('characteristicProductG-contract.html',{
                reverse:true
            })
        }
    })
    
    
    $('.footter .previous').on('tap',function(){
        if ($('#qianOK #ic_agree').css('display') === 'none') {
            showMsg('请确认签名!');
            return;
        }
        if(!$(this).hasClass('btn_next')) return;
        getPlatGlobalSeq(characteristicProduct,function(){
            characteristicImgUpload(function(){ //影像插库完成后提交报文
                // var againFun = arguments.callee;
                showLoader('产品签约提交中...')
                //特色产品提交页面
                var sendJson = {
                    'b' : [{
                        'deviceNo.s'        : commonJson.udId,                                                  //设备编号
                        'moduleId.s'        : characteristicProduct.moduleId,                                   //模块号
                        'tranId.s'          : characteristicProduct.tranId,                                     //交易号
                        'orgId.s'           : commonJson.tranId,                                                //机构号
                        'operatorNo.s'      : commonJson.adminCount,                                            //操作员
                        'offlineOnline.s'   : commonJson.offlineOnline,                                         //脱机/联机
                        'workAddress.s'     : commonJson.workAddress,                                           //工作地址
                        'CheckResult.s'     : lianwanghechaData.CheckResult,                                    //联网核查结果
                        'signature.s'       : characteristicProduct.data,                                       //签名
                        'faceRecogn.s'      : characteristicProduct.faceRecogn,                                 //人脸识别状态
                        'ReviewUserId.s'    : lianwanghechaData.ReviewUserId,                                   //远程复合
                        'FILE_COUNT.s'      : '2',                                                              //文件上传数量
                        'OPTION.s'          : '1',                                                              //交易标识
                        'BussinessCode.s'   : '01',
                        'DOC_TYPE.s'        : characteristicProduct.DOC_TYPE,                                   //凭证类型
                        'PACKAGE_ACCT_NO.s' : characteristicProduct.QYZH,                                       //签约账卡号
                        'ACCT_TYPE.s'       : '',                                                               //账号类型
                        'BASE_ACCT_NO.s'    : '',                                                               //交易子账号
                        'DOCUMENT_TYPE.s'   : '0',                                                              //证件类型
                        'DOCUMENT_ID.s'     : custermerInfo.cerNO,                                              //证件号码
                        'CLIENT_NAME.s'     : custermerInfo.name,                                               //客户姓名
                        'platGlobalSeq.s'   : characteristicProduct.platGlobalSeq,                              //客户流水号
                        'CLIENT_NO.s'       : characteristicProduct.CLIENT_NO,                                  //客户号
                        'SDMUSF2.s'         : characteristicProduct.productCode,                                //账号标记
                        "longitude.s"       : commonJson.longitude,//经度
                        "latitude.s"        : commonJson.latitude//纬度
                    }]
                }
                signSpecialtyProductFun(sendJson,function(msg){
                    signSpecialtyProductSucc(msg, sendJson);
                },function(err){
                    signSpecialtyProductFail(err, sendJson);
                });
            });
        })
    })
})

//特色产品相关影像上传
function characteristicImgUpload(callback){
    showLoader("影像压缩中...");
    // 事件发布执行回调方法前，取订事件，避免重复发布
    var ussbCallback = function(){
        topicUtil.unsubscribe("characteristicProduct/characteristicImgUpload");
        hideLoader();
        callback();
    };
    topicUtil.subscribe("characteristicProduct/characteristicImgUpload", ussbCallback);
    var compressCount = 0;  //压缩成功次数,为2时完成压缩
    var phoneTime = myTime.CurTime();
    var signTime = phoneTime + 1;
    characteristicProduct.phoneTime = phoneTime;
    characteristicProduct.signTime = signTime;
    //保存并上传影像文件信息
    Meap.zipCompression(characteristicProduct.platGlobalSeq + 'image', characteristicProduct.picFileARR, function (msg) {
        //将要上传的影像插入到ios断点上传的数据库中
        //影像上传 业务参数
        var appBus = {
            'busiGloablaSeq': characteristicProduct.platGlobalSeq,//业务编号
            'attchType': "2",//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
            'deviceNo': commonJson.udId,//设备编号
            'moduleId': characteristicProduct.moduleId,//模块编号
            'tranId': characteristicProduct.tranId,//交易编号
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
                "appPath": "sp002",//自定义文件路径
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
                topicUtil.publish("characteristicProduct/characteristicImgUpload");
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
    Meap.transFormImage(characteristicProduct.platGlobalSeq + 'sign', characteristicProduct.data, 'picSty', function (msg) {
        //将要上传的签名插入到ios断点上传的数据库中
        //签名上传 业务参数
        var appBus = {
            'busiGloablaSeq': characteristicProduct.platGlobalSeq,//业务编号
            'attchType': "1",//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
            'deviceNo': commonJson.udId,//设备编号
            'moduleId': characteristicProduct.moduleId,//模块编号
            'tranId': characteristicProduct.tranId,//交易编号
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
            'databaseName': 'myDatabase',
            'tableName': 'up_download_info',
            'data': [{
                'fileToken': signTime,//文件唯一ID(可以为时间挫
                'pos': '0',//文件的断点信息(初始为0)
                'filePath': msg,//文件路径
                'appPath': "sp001",//自定义文件路径
                'appBuss': appBus,//业务参数
                'downloadToken': '',//文件的下载ID(初始为空)
                'leng': '1',//文件的长度(初始为1)
                'isNotice': 'yes', //是否调用后台(一直是yes)
                "fileType":"1",
                "REMARK1": "01" //上传状态01-默认
            }]
        };
        insertTableData(sendDataJson, function (msg) {
            if(++compressCount == 2){
                topicUtil.publish("characteristicProduct/characteristicImgUpload");
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

//特色产品信息提交成功处理方法
function signSpecialtyProductSucc(msg, cpSendJson){
    //alert(JSON.stringify(msg))
    hideLoader();
    var responseCode = preJsonY(msg);
    if (responseCode[0].results == "00" || responseCode[0].results == '13') {
        characteristicProduct.pdfUrl = responseCode[0].pdfUrl
        if (lianwanghechaData.CheckResult == "09") {

        } else {
            //暂存本地数据库
            cacheCustermerInfo({
                "databaseName": "myDatabase",
                "tableName": "customer_info",
                "data": [{
                    "ADMINCOUNT": commonJson.adminCount,//登陆账号
                    "SUBMITTIME": myTime.CurTime(),//提交时间
                    "BUSINESSTYPE": '特色产品',//业务类型
                    "NATION": custermerInfo.nation,//民族
                    "CERTNUM": custermerInfo.cerNO,//身份证号码
                    "ADDRESS": custermerInfo.address,//地址
                    "MASCARDNAME": custermerInfo.name,//姓名
                    "CERTVALIDDATE": custermerInfo.cerExpdDt,//有效日期
                    "BIRTH": custermerInfo.birthday,//出生日期
                    "SEX": custermerInfo.sex,//性别
                    "ISSAUTHORITY": custermerInfo.issAuthority,//签发机关
                    "IMAGE": custermerInfo.image,//身份证头像图片
                    "CUSTANDCUSTOWNERPIC" : '',
                    "FRONTIDCARDPIC": characteristicProduct.frontIDCardPic,//身份证正面
                    "BACKIDCARDPIC": characteristicProduct.backIDCardPic,//身份证反面
                    "checkPhoto": custermerInfo.checkPhoto //联网核查图片
                }]
            });
        }
        //断点上传签名
        // saveAndUploadSignFileInfo(characteristicProduct,'1','sp001');
        //断点上传影像
        // saveAndUploadPhotoFileInfo(characteristicProduct,'2','sp002');
        changeUploadStatus("02", characteristicProduct.phoneTime, characteristicProduct.signTime);
        if (responseCode[0].results == '13'){
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {
                    'fun' : function(){
                        $.mobile.changePage('characteristicProductI-complete.html')
                    }
                }
            });
        } else {
            $.mobile.changePage('characteristicProductI-complete.html')
        }
        
    }else if(responseCode[0].results == "08"){
        // againFun();
        showLoader('产品签约提交中...')
        signSpecialtyProductFun(cpSendJson,function(msg){
            signSpecialtyProductSucc(msg, cpSendJson);
        },function(err){
            signSpecialtyProductFail(err, cpSendJson);
        });
    }else if(responseCode[0].results == "09"){
        showTags({
            'title': '提示',
            'content': "业务处理超时!" + responseCode[0].message, //必输
            'ok': {
                'title' : '继续处理',
                'fun'   : function(){
                    setTimeout(function(){
                        showLoader('产品签约提交中...')
                        signSpecialtyProductFun(cpSendJson,function(msg){
                            signSpecialtyProductSucc(msg, cpSendJson);
                        },function(err){
                            signSpecialtyProductFail(err, cpSendJson);
                        });
                    }, 300);
                }
            }
        })
    }else{
        changeUploadStatus("03", characteristicProduct.phoneTime, characteristicProduct.signTime);
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {
                'title' : '确认',
                'fun'   : function(){
                    $.mobile.changePage('../main.html')
                }
            }
        });
    }
}

//特色产品信息提交失败处理方法
function signSpecialtyProductFail(err, cpSendJson){
    //alert('前端超时')
    hideLoader();
    //核查失败
    // err = err.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    // var responseObj = JSON.parse(err);
    // var responseCode = responseObj.b[0].error[0];
    // if ($.trim(responseCode.message).toUpperCase() == 'A CONNECTION FAILURE OCCURRED') {
    //     Meap.isNetConnect(function(msg){
    //         if (msg == '01' || msg == '02') {
    //             responseCode.message = '未接收到后台响应!';
    //         } else if (msg == '03') {
    //             responseCode.message = '当前网络不可用,请检测网络是否畅通!';
    //         }
    //         showTags({
    //             'content': responseCode.message, //必输
    //             'ok': {
    //                 'title' : '继续处理',
    //                 'fun'   : againFun
    //             }

    //         })
    //     },function(err) {
    //         responseCode.message = '当前网络不可用,请检测网络是否畅通!';
    //         showTags({
    //             'content': responseCode.message, //必输
    //             'ok': {
    //                 'title' : '继续处理',
    //                 'fun'   : againFun
    //             }

    //         })
    //     })
    // }
    // if ($.trim(responseCode.message).toUpperCase() == 'THE REQUEST TIMED OUT') { //全部改成大写即可捕获
    //     responseCode.message = '系统超时,请重新操作!';
    //     showTags({
    //         'content': responseCode.message, //必输
    //         'ok': {
    //             'title' : '继续处理',
    //             'fun'   : againFun
    //         }
    //     })
    // }
    showTags({
        'content': "业务处理超时!",
        'ok': {
            'title' : '继续处理',
            'fun'   : function(){
                setTimeout(function(){
                    showLoader('产品签约提交中...')
                    signSpecialtyProductFun(cpSendJson,function(msg){
                        signSpecialtyProductSucc(msg, cpSendJson);
                    },function(err){
                        signSpecialtyProductFail(err, cpSendJson);
                    });
                }, 300);
            }
        }
    });
}

//完成页面（characteristicProductI-complete.html）
$(document).on('pageshow','#characteristicProductI-complete',function(){

    $('.compl').find('span').html(characteristicProduct.productName + '产品签约成功！');
    $('#HM').html(custermerInfo.name)
    $('#QYZH').html(characteristicProduct.QYZH)

    transformStringToImage(characteristicProduct.pdfUrl,function(msg){
        //alert(msg);
        $('#characteristicProductI-complete .card_mode').attr('src',msg);
    },function(err){
        alert(err+'生成二维码失败');
    })

    $('.footter .previous:eq(0)').on('click',function(){
        $.mobile.changePage('../main.html',{
            reverse:true
        })
    })

})