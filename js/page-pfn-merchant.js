(function(){
var merchantCache = {       //特惠商户缓存
    merchantList : [],      //商户列表
    showType : '',          //显示类型
    distance : '',          //距离
    merchantType : '',      //商户类型
    gpsPoint : null,        //我的位置
    center : null,          //地图中心
    zoom : null,            //缩放级别
    flag : false,           //缓存是否可用
    pageTwoList : [],       //列表页的商户数据
    pageThiInfo : {}        //详情页的商户数据
};

//百度地图api功能
$(document).on('pageshow', '#MT_businessdealPageOne', function(){
    //地图初始化
    var map = new BMap.Map("MT_allMap");
    map.addEventListener('load',function(){         //屏蔽百度logo的跳转
        setTimeout(function(){
            $('a[href="http://map.baidu.com/?sr=1"]').attr('href', '#').on('click',function(){
                showTags({
                    'content': "处理异常",
                    'ok': {}
                });
            });
        },1000);
    });
    if(merchantCache.flag && merchantCache.center && merchantCache.zoom){
        map.centerAndZoom(merchantCache.center, merchantCache.zoom);
        $('li.list_distance select').val(merchantCache.distance).trigger("change");
        $('li.list_merchantType select').val(merchantCache.merchantType).trigger("change");
    }else{
        var x = 114.12383374603;//114.1174158545506;//114.124008
        var y = 22.549569280319;//22.54323303948415;//22.549696
        map.centerAndZoom(new BMap.Point(x, y), 15);
    }

    //添加地图控件
    map.addControl(new BMap.NavigationControl());
    // var geolocationControl = new BMap.GeolocationControl();
    // geolocationControl.addEventListener("locationSuccess", function(e){
    //     map.clearOverlays();
    //     getCurrentPosition(function(){
    //         getMerchantPoint(false, false, function(list){
    //             markMerchant(list);
    //         });
    //     });
    // });
    // map.addControl(geolocationControl);
    
    //坐标转换完之后的展示商户标签
    // translateCallback = function(data){
    //     if(data.status === 0) {
    //         var myIcon = new BMap.Icon("../../images/ic-ld-ing.png", new BMap.Size(37, 55), {     
    //             offset: new BMap.Size(18, 55)
    //         });
    //         for(var i = 0; i < data.points.length; i++){
    //             var marker = new BMap.Marker(data.points[i], {icon: myIcon});
    //             map.addOverlay(marker)
    //             console.log(marker)
    //             console.log(marker.V)
    //             marker.V.addEventListener('touchstart', function(e){
    //                 // alert(e.domEvent.eventPhase)
    //                 // e.domEvent.stopPropagation();
    //                 cacheData();
    //                 $.mobile.changePage("pfn-merchantList.html");
    //             });
    //         }
    //     }
    // }
    //GPS定位坐标
    if(merchantCache.flag && merchantCache.gpsPoint){
        markLocation(merchantCache.gpsPoint);
        getMerchantPoint(true);
    }else{
        getCurrentPosition(function(){
            getMerchantPoint(false, false, function(list){
                markMerchant(list);
            });
        });
    }
    
    $('#btn-filter').on('click',function(){
        var showType = $('li.list_showType select').val();
        if(showType == "LIST"){
            cacheData();
            getMerchantPoint(false, false, function(list){
                $.mobile.changePage("pfn-merchantList.html");
            });
        }else if(showType == "MAP"){
            map.clearOverlays();
            getCurrentPosition(function(){  //重新定位
                getMerchantPoint(false, false, function(list){
                    markMerchant(list);
                });
            });
        }
    });

    $('a[data-action="backToHome"]').on('click', function(){
        merchantCache.flag = false;
    });
    $('#ipt-search').on('keyup', function(e){
        if(e.keyCode == "13" && $('#ipt-search').val().trim()){
            cacheData();
            $(this).trigger('blur');
            getMerchantPoint(false, true, function(list){
                $.mobile.changePage("pfn-merchantList.html");
            });
        }
    });
    $('#btn-search').on('click', function(){
        if($('#ipt-search').val().trim()){
            cacheData();
            getMerchantPoint(false, true, function(list){
                $.mobile.changePage("pfn-merchantList.html");
            });
        }
    });

    //GPS定位坐标(异步)
    function getCurrentPosition(callBackFun){
        // var geolocation = new BMap.Geolocation();
        // geolocation.getCurrentPosition(function(r){
        //     if(this.getStatus() == BMAP_STATUS_SUCCESS){
        //         markLocation(r.point);
        //         merchantCache.gpsPoint = new BMap.Point(r.point.lng, r.point.lat);
        //         if(callBackFun){
        //             callBackFun();
        //         }
        //     }     
        // },{enableHighAccuracy: true});
        getCurrentLocationCoordinate("", function(data){
            var pointArr = data.split(",");//114.12379217,225495628
            commonJson.longitude = pointArr[0];  //经度
            commonJson.latitude = pointArr[1];   //纬度
            var point = new BMap.Point(pointArr[0], pointArr[1]);
            markLocation(point);
            merchantCache.gpsPoint = point;
            if(callBackFun){
                callBackFun();
            }
        }, function(err){
            showTags({
                'content': err,
                'ok': {
                    'fun': function(){
                        $.mobile.changePage("../main.html", {reverse: true});
                    }
                }
            });
        });
    }

    //绘制我的位置
    function markLocation(point){
        map.panTo(point);
        var myIcon = new BMap.Icon("../../images/ic-weizi-ing.png", new BMap.Size(18, 30), {     
            offset: new BMap.Size(9, 30)
        });
        var marker = new BMap.Marker(point, {icon: myIcon});
        map.addOverlay(marker);
    }

    //查询商户地址
    //cacheflag:true-使用缓存数据;false-重新请求数据
    //searchText:true-根据文本搜索;false-根据经纬度搜索
    //callBackFun   查询成功后的回调函数
    function getMerchantPoint(cacheflag, searchText, callBackFun){
        if(cacheflag && merchantCache.flag){
            markMerchant(merchantCache.merchantList);
        }else{
            var sendJson = {
                "b" : [{
                    "CNAME.s"         : "",           //商户名称
                    "MCH_TYPE.s"      : "",           //商户类型
                    "LONGITUDE.s"     : "",           //所在经度
                    "LATITUDE.s"      : "",           //所在纬度
                    "BOUNDARY.s"      : "",           //范围
                    "USER_CODE.s"     : commonJson.adminCount,        //登陆客户经理号
                    "deviceNo.s"      : commonJson.udId,              //设备编号
                    "moduleId.s"      : preferentialJson.moduleID,    //模块名
                    "tranId.s"        : preferentialJson.tranId,      //交易名
                    "orgId.s"         : commonJson.orgId,             //机构号
                    "operatorNo.s"    : commonJson.adminCount,        //操作员
                    "offlineOnline.s" : commonJson.offlineOnline,     //脱机/联机
                    "workAddress.s"   : commonJson.workAddress        //工作地址
                }]
            };
            if(searchText){
                sendJson.b[0]["CNAME.s"] = $('#ipt-search').val();
                getExmerchantgatherQuerySucc(sendJson, function(list){
                    merchantCache.pageTwoList = list;
                    if(callBackFun){
                        callBackFun(list);
                    }
                });
            }else{
                var distance = $('li.list_distance select').val();
                var merchantType = $('li.list_merchantType select').val();
                sendJson.b[0]["MCH_TYPE.s"] = merchantType;
                sendJson.b[0]["BOUNDARY.s"] = distance;
                sendJson.b[0]["LONGITUDE.s"] = merchantCache.gpsPoint.lng + "";
                sendJson.b[0]["LATITUDE.s"] = merchantCache.gpsPoint.lat + "";
                getExmerchantgatherQuerySucc(sendJson, function(list){
                    merchantCache.merchantList = list;
                    merchantCache.pageTwoList = list;
                    if(callBackFun){
                        callBackFun(list);
                    }
                });
            }
        }
    }

    //绘制商户标签
    function markMerchant(list){
        // var pointArr = [];
        // for(var i = 0; i < list.length; i++){
        //     pointArr.push(list[i].point);
        // }
        // var convertor = new BMap.Convertor();
        // convertor.translate(pointArr, 3, 5, translateCallback);//不转换
        var myIcon = new BMap.Icon("../../images/ic-ld-ing.png", new BMap.Size(19, 28), {     
            offset: new BMap.Size(9, 28)
        });
        for(var i = 0; i < list.length; i++){
            var point = new BMap.Point(list[i].LONGITUDE, list[i].LATITUDE);
            var marker = new BMap.Marker(point, {icon: myIcon});
            marker.setTop(true);    //全部置顶,覆盖“我的位置”标记
            map.addOverlay(marker);
            marker.addEventListener('click', function(){
                var p = this.getPosition();
                //根据经纬度过滤列表页的商户
                merchantCache.pageTwoList = list.filter(function(item){
                    if(item.LONGITUDE == p.lng && item.LATITUDE == p.lat){
                        return true;
                    }
                });
                cacheData();
                $.mobile.changePage("pfn-merchantList.html");
            }, false);
        }
    }

    //商户列表查询数据处理方法
    function getExmerchantgatherQuerySucc(sendJson, callBackFun){
        showLoader("搜索中...");
        var list = [];
        getExmerchantgatherQueryFun(sendJson, function (msg) {
            hideLoader();
            msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
            var responseBody = (JSON.parse(msg)).b;
            if (responseBody[0].results == '00') {
                for(var i = 1; i < responseBody.length; i++){
                    list.push(responseBody[i].exmerchantgatherQueryVO[0]);
                }
                if(callBackFun){
                    callBackFun(list);
                }
            } else if (responseBody[0].results == "08") {//session过期重新登陆请求
                getExmerchantgatherQuerySucc(sendJson, callBackFun);
            } else {
                if(responseBody[0].message.indexOf("[000110]") > -1){   //匹配返回码修改提示信息
                    responseBody[0].message = "没有找到合适的商户";
                }
                showTags({
                    'content': responseBody[0].message,
                    'ok': {}
                });
            }
        }, function (err) {
            pfnFunFail(err);
        });
    }

    //缓存第一页地图数据
    function cacheData(){
        merchantCache.distance = $('li.list_distance select').val();
        merchantCache.merchantType = $('li.list_merchantType select').val();
        merchantCache.center = map.getCenter();
        merchantCache.zoom = map.getZoom();
        merchantCache.flag = true;
    }
});

$(document).on('pageshow', '#MT_businessdealPageTwo', function() {
    var page_list = [];
    if(merchantCache.flag && merchantCache.pageTwoList){
        page_list = merchantCache.pageTwoList;
    }
    
    var tpl = $('#li-template');
    for(var i = 0; i < page_list.length; i++){
        var tplClone = tpl.clone().removeAttr('id').removeAttr('hidden');
        $('.business_name span', tplClone).text(page_list[i].CNAME);
        $('.business_type span', tplClone).text(MERCHANTTYPE[page_list[i].MCH_TYPE]);
        var FAVORITE = page_list[i].FAVORITE.replace(/\\n/g, "<br>");
        $('.business_msg span', tplClone).html(FAVORITE);
        // Meap.transFormImage("merchantPic", page_list[i].PICTURE, 'picSty', function (msg) {
        //     $('.business_img img', tplClone).attr('src', msg);
        // }, function (err) {
        //     showMsg('商户照片base64转路径失败');
        // })
        var imgsrc = "data:image/png;base64," + page_list[i].PICTURE;
        $('.business_img img', tplClone).attr('src', imgsrc);
        tplClone.data(page_list[i]);
        $('#ul-frame').append(tplClone);
    }

    $('a[data-action="changeToOne"]').on('click', function(){
        // $('#MT_businessdealPageTwo').removeClass('ui-page-active').hide();
        // $('#MT_businessdealPageOne').addClass('ui-page-active').show();
        $.mobile.changePage("pfn-merchantMap.html", {reverse: true});
    });
    $('#btn-close').on('click', function(){
        $.mobile.changePage("pfn-merchantMap.html", {reverse: true});
    });

    $('a[data-action="changeToThree"]').on('click', function(){
        var mchInfo = $(this).closest('li').data();
        var sendJson = {
            "b" : [{
                "MID.s"           : mchInfo.MID,           //商户ID
                "USER_CODE.s"     : commonJson.adminCount,        //登陆客户经理号
                "deviceNo.s"      : commonJson.udId,              //设备编号
                "moduleId.s"      : preferentialJson.moduleID,    //模块名
                "tranId.s"        : preferentialJson.tranId,      //交易名
                "orgId.s"         : commonJson.orgId,             //机构号
                "operatorNo.s"    : commonJson.adminCount,        //操作员
                "offlineOnline.s" : commonJson.offlineOnline,     //脱机/联机
                "workAddress.s"   : commonJson.workAddress        //工作地址
            }]
        };
        getExmerchantdetailQuerySucc(sendJson);
    });

    //商户详情查询数据处理方法
    function getExmerchantdetailQuerySucc(sendJson){
        showLoader("商户详情查询中...");
        getExmerchantdetailQueryFun(sendJson, function (msg) {
            hideLoader();
            msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
            var responseBody = (JSON.parse(msg)).b;
            if (responseBody[0].results == '00') {
                var info = {};
                var MCH_PICTURES = [];
                info = responseBody[1].exmerchantdetailQueryVO[0];
                var piclist = responseBody[1].exmerchantdetailQueryVO[1].MCH_PICTURES;
                for(var i = 0; i < piclist.length; i++){
                    MCH_PICTURES.push(piclist[i].mchPicturesVO[0]);
                }
                info.MCH_PICTURES = MCH_PICTURES;
                merchantCache.pageThiInfo = info;
                $.mobile.changePage("pfn-merchantInfo.html");
            } else if (responseBody[0].results == "08") {//session过期重新登陆请求
                getExmerchantdetailQuerySucc(sendJson);
            } else {
                showTags({
                    'content': responseBody[0].message,
                    'ok': {}
                });
            }
        }, function (err) {
            pfnFunFail(err);
        });
    }
});

$(document).on('pageshow', '#MT_businessdealPageThree', function() {
    var map;
    var myValue;                //商户定位的地址
    var myPoint;                //商户定位的经纬度
    var img_change = "0";       //是否修改图片
    var page_picDelArr = [];    //删除照片数组
    var page_info = {};
    if(merchantCache.flag && merchantCache.pageThiInfo){
        page_info = merchantCache.pageThiInfo;
    }

    var content = $('#merchant-content');
    $('.business_style select', content).val(page_info.MCH_TYPE).trigger("change");
    $('.business_name span', content).text(page_info.CNAME);
    $('.business_address span', content).text(page_info.ADDRESS);
    page_info.FAVORITE = page_info.FAVORITE.replace(/\\n/g, "\n");
    $('.business_dischargeText textarea', content).html(page_info.FAVORITE);
    //展示商户照片
    var tpl = $('#photo-template');
    for(var i = 0; i < page_info.MCH_PICTURES.length; i++){
        var divPhoto = tpl.clone().removeAttr('id').removeAttr('hidden');
        var base64url = "data:image/png;base64," + page_info.MCH_PICTURES[i].ATTACH;
        $('img', divPhoto).attr('src', base64url);
        divPhoto.attr('picID', page_info.MCH_PICTURES[i].PICTURE);
        divPhoto.attr('coverFlag', page_info.MCH_PICTURES[i].COVER_FLAG);
        if(page_info.MCH_PICTURES[i].COVER_FLAG == "1"){
            $('#photo-template').after(divPhoto);
        }else{
            $('#photo-container').append(divPhoto);
        }
    }
    //展示拍照按钮
    var addPhotoBtn = tpl.clone().removeAttr('id').removeAttr('hidden').addClass('addPhotoBtn');
    $('#photo-container').append(addPhotoBtn);
    //展示商户定位地址
    if(page_info.LONGITUDE && page_info.LATITUDE){
        var geoc = new BMap.Geocoder();
        myPoint = new BMap.Point(page_info.LONGITUDE, page_info.LATITUDE);
        geoc.getLocation(myPoint, function(rs){
            var addComp = rs.addressComponents;
            myValue = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
            $('.business_position #text-position', content).text(myValue);
        });
    }
    
    $('a[data-action="changeToTwo"]').on('click', function(){
        $.mobile.changePage("pfn-merchantList.html", {reverse: true});
    });
    $('#btn-close').on('click', function(){
        $.mobile.changePage("pfn-merchantMap.html", {reverse: true});
    });

    $('#img-location').on('click', function(){
        $('#pop-window .sure').addClass('btn-disable');
        $('#suggestId').val('');
        $('#pop-window').show();
        if($(this).hasClass('initMap')) return;
        $(this).addClass('initMap');
        map = new BMap.Map("pop-map");      //初始化地图
        map.addEventListener('load',function(){     //屏蔽百度logo的跳转
            setTimeout(function(){
                $('a[href="http://map.baidu.com/?sr=1"]').attr('href', '#').on('click',function(){
                    showTags({
                        'content': "处理异常",
                        'ok': {}
                    });
                });
            },1000);
        });
        if(myPoint){
            map.centerAndZoom(myPoint, 18);
            var myIcon = new BMap.Icon("../../images/ic-ld-ing.png", new BMap.Size(19, 28), {     
                offset: new BMap.Size(9, 28)
            });
            map.addOverlay(new BMap.Marker(myPoint, {icon: myIcon}));
        }else{
            map.centerAndZoom("深圳", 12);    //城市名解析是异步进行
        }
        map.addControl(new BMap.NavigationControl());
        // var searchControl = new BMapLib.SearchControl(map);
        // searchControl.open();
        var ac = new BMap.Autocomplete({    //建立一个自动完成的对象
            "input" : "suggestId",
            "location" : map
        });
        ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
            var _value = e.item.value;
            myValue = _value.province +  _value.city +  _value.district +  _value.street + _value.streetNumber +  _value.business;
            var srp = document.getElementById("searchResultPanel");
            srp.innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
            setPlace();
            $('#pop-window .sure').removeClass('btn-disable');
            $('#suggestId').trigger('blur');
        });
    });

    $('#pop-window .close').on('click', function(){
        $('#pop-window').hide();
    });
    $('#pop-window .sure').on('click', function(){
        if($(this).hasClass('btn-disable')) return;
        $('.business_position #text-position', content).text(myValue);
        $('#pop-window').hide();
    });

    $('#MT_businessdealPageThree .content_top').on('click', '.take', function (ev) {
        var takePhoto = $(this).closest('.take_Photo');
        // if (takePhoto.index() == 6) {
        //     takePhoto.remove();
        //     showTags({
        //         'title': '提示',
        //         'content': "拍摄照片已到最大限度[最大限度为5张]",
        //         'ok': {}
        //     });
        //     return;
        // }
        pfnImageAcquisition.curParentObj = takePhoto;
        if(takePhoto.hasClass('addPhotoBtn')){
            pfnImageAcquisition.getImg(pfnImageAcquisition.curParentObj);
        }else{
            pfnImageAcquisition.imgSrc = takePhoto.find('.camera').attr('src');
            pfnImageAcquisition.reviewImg(pfnImageAcquisition.imgSrc);
        }
    });

    $('#btn-submit').on('click', function(){
        showLoader();
        var MCH_TYPE = $('.business_style select', content).val();
        var FAVORITE = $('.business_dischargeText textarea', content).val();
        var sendJson = {
                "b" : [{
                    "MID.s"           : page_info.MID,           //商户号
                    "MCH_TYPE.s"      : MCH_TYPE,           //商户类型
                    "LONGITUDE.s"     : "",                 //所在经度
                    "LATITUDE.s"      : "",                 //所在纬度
                    "img_change.s"    : img_change,         //是否修改图片
                    "USER_CODE.s"     : commonJson.adminCount,        //登陆客户经理号
                    "FAVORITE.s"      : FAVORITE,           //优惠信息
                    "deviceNo.s"      : commonJson.udId,              //设备编号
                    "moduleId.s"      : preferentialJson.moduleID,    //模块名
                    "tranId.s"        : preferentialJson.tranId,      //交易名
                    "orgId.s"         : commonJson.orgId,             //机构号
                    "operatorNo.s"    : commonJson.adminCount,        //操作员
                    "offlineOnline.s" : commonJson.offlineOnline,     //脱机/联机
                    "workAddress.s"   : commonJson.workAddress,       //工作地址
                    "longitude.s": commonJson.longitude,//客户经理轨迹定位
                    "latitude.s": commonJson.latitude//客户经理轨迹定位
                }]
            };
        if(myPoint){
            sendJson.b[0]["LONGITUDE.s"] = myPoint.lng + "";
            sendJson.b[0]["LATITUDE.s"] = myPoint.lat + "";
        }
        if(img_change == "0"){
            updateExmerchant(sendJson);
        }else{
            var picArr = page_picDelArr;
            var takePhoto = $('#MT_businessdealPageThree .take_Photo.reTake');
            if(takePhoto.length === 0){             //没有拍照(reTake是拍照标识)
                if(page_picDelArr.length === 0){    //没有修改图片
                    img_change = "0";
                    sendJson.b[0]["img_change.s"] = "0";
                }else{                              //只删除图片
                    for(var i = 0; i < picArr.length; i++){
                        var obj = {
                            "MchPicupdateVO":[picArr[i]]
                        };
                        sendJson.b.push(obj);
                    }
                    changeCover(sendJson);
                }
                updateExmerchant(sendJson);
                return;
            }
            var VOlength = takePhoto.length + page_picDelArr.length;
            takePhoto.each(function(index, element){
                var em = $(element);
                var MchPicupdate = {
                    "PICTURE.s":"",
                    "OP_FLAG.s":"A"
                };
                if(em.index() == 1){
                    MchPicupdate["COVER_FLAG.s"] = "1";
                }else{
                    MchPicupdate["COVER_FLAG.s"] = "0";
                }
                var img = $('img', em).get(0);
                // MchPicupdate.ATTACH = pfnImage2Base64(img);
                pfnImage2Base64(img, function(data){
                    MchPicupdate["ATTACH.s"] = data;
                    picArr.push(MchPicupdate);
                    if(picArr.length == VOlength){      //所有图片已转码完成
                        for(var i = 0; i < picArr.length; i++){
                            var obj = {
                                "MchPicupdateVO":[picArr[i]]
                            };
                            sendJson.b.push(obj);
                        }
                        changeCover(sendJson);
                        updateExmerchant(sendJson);
                        return;
                    }
                });
            });
        }
    });

    //更换封面
    function changeCover(sendJson){
        var coverDiv = $('#MT_businessdealPageThree .take_Photo:eq(1)');
        //当第一张图片是非拍摄的并且coverFlag为0时,则删除之并添加内容一样的封面照片
        if(coverDiv.length>0 && !(coverDiv.hasClass('reTake')) && coverDiv.attr('coverFlag')=="0"){
            var picID = coverDiv.attr('picID');
            sendJson.b.push({
                "MchPicupdateVO":[{
                    "PICTURE.s":picID,
                    "COVER_FLAG.s":"0",
                    "OP_FLAG.s":"D",
                    "ATTACH.s":""
                }]
            });
            var imgUrl = $('img', coverDiv).attr('src').replace("data:image/png;base64,", "");
            sendJson.b.push({
                "MchPicupdateVO":[{
                    "PICTURE.s":"",
                    "COVER_FLAG.s":"1",
                    "OP_FLAG.s":"A",
                    "ATTACH.s":imgUrl
                }]
            });
        }
    }

    function setPlace(){
        map.clearOverlays();    //清除地图上所有覆盖物
        function myFun(){
            myPoint = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果 
            map.centerAndZoom(myPoint, 18);
            var myIcon = new BMap.Icon("../../images/ic-ld-ing.png", new BMap.Size(19, 28), {     
                offset: new BMap.Size(9, 28)
            });
            map.addOverlay(new BMap.Marker(myPoint, {icon: myIcon}));    //添加标注
        }
        var local = new BMap.LocalSearch(map, {     //智能搜索
            onSearchComplete: myFun
        });
        local.search(myValue);
    }

    //商户信息更新    platGlobalSeq-流水号
    function updateExmerchant(sendJson, platGlobalSeq){
        if(sendJson.b[0]["MCH_TYPE.s"] === "" || 
            sendJson.b[0]["LATITUDE.s"] === "" ||
            sendJson.b[0]["FAVORITE.s"] === "")
        {
            hideLoader();
            showTags({
                'content': "必输字段不能为空",
                'ok': {}
            });
            return;
        }
        if(sendJson.b[0]["img_change.s"] == "0"){
            if(sendJson.b[0]["MCH_TYPE.s"] == page_info.MCH_TYPE && 
                sendJson.b[0]["FAVORITE.s"] == page_info.FAVORITE &&
                sendJson.b[0]["LONGITUDE.s"] == page_info.LONGITUDE &&
                sendJson.b[0]["LATITUDE.s"] == page_info.LATITUDE)
            {
                hideLoader();
                showTags({
                    'content': "商户信息没有改动",
                    'ok': {}
                });
                return;
            }
        }
        if(platGlobalSeq){      //重新使用同一个流水
            sendJson.b[0]["platGlobalSeq.s"] = platGlobalSeq;
            updateExmerchantSucc(sendJson);
        }else{                  //请求流水号
            getPlatGlobalSeq(preferentialJson, function(){
                sendJson.b[0]["platGlobalSeq.s"] = preferentialJson.platGlobalSeq;
                updateExmerchantSucc(sendJson);
            });
        }
    }

    //商户信息更新数据处理方法
    function updateExmerchantSucc(sendJson){
        showLoader('提交中...');
        updateExmerchantFun(sendJson, function(msg){
            hideLoader();
            msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
            var responseBody = (JSON.parse(msg)).b;
            if(responseBody[0].results == "00"){
                //更新列表页的缓存数据
                $.each(merchantCache.pageTwoList, function(index, v){
                    if(v.MID == sendJson.b[0]["MID.s"]){
                        v.MCH_TYPE = sendJson.b[0]["MCH_TYPE.s"];
                        v.FAVORITE = sendJson.b[0]["FAVORITE.s"].replace(/\n/g, "\\n");
                        if(img_change == "1"){
                            for(var i = 1; i < sendJson.b.length; i++){
                                if(sendJson.b[i].MchPicupdateVO[0]["COVER_FLAG.s"] == "1"){
                                    v.PICTURE = sendJson.b[i].MchPicupdateVO[0]["ATTACH.s"];
                                    if(sendJson.b[i].MchPicupdateVO[0]["OP_FLAG.s"] == "A"){
                                        break;
                                    }
                                }
                            }
                        }
                        return false;
                    }
                });
                img_change = "0";
                page_picDelArr = [];
                page_info.MCH_TYPE = sendJson.b[0]["MCH_TYPE.s"];
                page_info.FAVORITE = sendJson.b[0]["FAVORITE.s"];
                page_info.LONGITUDE = sendJson.b[0]["LONGITUDE.s"];
                page_info.LATITUDE = sendJson.b[0]["LATITUDE.s"];
                showTags({
                    'content': responseBody[0].message,
                    'ok': {
                        'fun': function(){
                            $.mobile.changePage("pfn-merchantList.html", {reverse: true});
                        }
                    }
                });
            }else if(responseBody[0].results == "08"){//session超时
                updateExmerchantSucc(sendJson);
            }else if(responseBody[0].results == "09"){//请求超时
                showTags({
                    'title': '提示',
                    'content': '业务处理超时：' + responseBody[0].message,
                    'ok': {
                        'title':'继续处理',
                        'fun': function() {
                            hideTags();
                            $.mobile.changePage("pfn-merchantList.html", {reverse: true});
                        }
                    }
                });
            }else{
                showTags({
                    'content': responseBody[0].message,
                    'ok': {}
                });
            } 
        }, function (err) {
            pfnFunFail(err, function(){
                $.mobile.changePage("pfn-merchantList.html", {reverse: true});
            }, "继续处理");
        });
    }

    //img-图片<img>标签的dom对象
    function pfnImage2Base64(img, callBackFun) {
        var src = img.src;
        if(src.substring(0,8) == "file:///"){
            src = src.substring(8);
        }
        transFormBase64(src, function(data){    //transFormBase64异步返回
            if(callBackFun){
                callBackFun(data);
            }
            return data;
        },function(err){
            showMsg('影像转换失败！');
        });
        // var canvas = document.createElement("canvas");
        // canvas.width = img.width;
        // canvas.height = img.height;
        // var ctx = canvas.getContext("2d");
        // ctx.drawImage(img, 0, 0);
        // var dataURL = canvas.toDataURL("image/png");
        // // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        // return dataURL;
    }

    var pfnImageAcquisition = {
        imgSrc: '', //记录照片路径,
        curParentObj: '', //记录要删除的对象
        delImg: function (curParentObj, imgSrc) { //删除照片
            // if(imgSrc.substring(0, 10) == "data:image"){}
            if(curParentObj.hasClass('reTake')){    //删除本次拍摄的照片
                deletePhoto([imgSrc], function (msg) {
                    curParentObj.remove();
                    $('.bigpic-review-box').animate({opacity: '0'}, 200, function () {
                        $('.bigpic-review-box').hide();
                    });
                });
            }else{      //删除已提交的照片
                img_change = "1";
                page_picDelArr.push({
                    "PICTURE.s":curParentObj.attr('picID'),
                    "COVER_FLAG.s":curParentObj.attr('coverFlag'),
                    "OP_FLAG.s":"D",
                    "ATTACH.s":""
                });
                curParentObj.remove();
                $('.bigpic-review-box').animate({opacity: '0'}, 200, function () {
                    $('.bigpic-review-box').hide();
                });
            }
        },
        getImg: function (curParentObj) { //拍照
            var index = curParentObj.index();
            Meap.media('camera', "merchantPic" + index, function (msg) {
                pfnImageAcquisition.imgSrc = msg;
                if(curParentObj.hasClass('addPhotoBtn')){       //新增图片
                    var addPhotoBtn = curParentObj.clone();
                    $('#MT_businessdealPageThree .content_top').append(addPhotoBtn);
                    curParentObj.removeClass('addPhotoBtn');
                }
                curParentObj.addClass('reTake');                //重拍flag
                curParentObj.html('<div class="take"><img src="' + msg + '" class="camera"></div>');
                img_change = "1";           //修改图片标识置为1
                // pfnImage2Base64(img.get(0));
            }, function (err) {
                showMsg(err);
            });
        },
        reGetImg: function (curParentObj, imgSrc) { //重拍
            var index = curParentObj.index();
            Meap.media('camera', "merchantPic" + index, function (returnGetMsg) {
                if(curParentObj.hasClass('reTake')){    //重拍本次拍摄的照片
                    imgSrc = curParentObj.find('img').attr('src');
                    deletePhoto([imgSrc], function (returnDelMsg) {
                        creditImageAcquisition.imgSrc = returnGetMsg;
                        curParentObj.find('img').attr('src', returnGetMsg);
                        $('.bigpic-review').html('<img src=' + returnGetMsg + ' height="100%">');
                    });
                }else{      //重拍已提交的照片
                    img_change = "1";
                    page_picDelArr.push({
                        "PICTURE.s":curParentObj.attr('picID'),
                        "COVER_FLAG.s":curParentObj.attr('coverFlag'),
                        "OP_FLAG.s":"D",
                        "ATTACH.s":""
                    });
                    curParentObj.addClass('reTake');  
                    creditImageAcquisition.imgSrc = returnGetMsg;
                    curParentObj.find('img').attr('src', returnGetMsg);
                    $('.bigpic-review').html('<img src=' + returnGetMsg + ' height="100%">');
                }
            }, function (err) {
                showMsg('重拍失败');
            });
        },
        reviewImg: function (imgSrc) { //拍照预览
            $('.bigpic-review').html('<img src=' + imgSrc + ' height="100%">');
            $('.bigpic-review-box').show().animate({
                opacity: '1'
            }, 200);
        },
        reviewImgClose: function () { //关闭拍照预览
            $('.bigpic-review-box').animate({
                opacity: '0'
            }, 200, function () {
                $('.bigpic-review-box').hide();
            });
        }
    };
    //预览大图 点击关闭
    $('.bigpic-review-close').click(function (event) {
        pfnImageAcquisition.reviewImgClose();
    });
    //预览大图 删除图片
    $('.bigpic-review-del').click(function (event) {
        pfnImageAcquisition.delImg(pfnImageAcquisition.curParentObj, pfnImageAcquisition.imgSrc);
    });
    //预览大图 重新拍照
    $('.bigpic-review-rephone').click(function (event) {
        pfnImageAcquisition.reGetImg(pfnImageAcquisition.curParentObj, pfnImageAcquisition.imgSrc);
    });
});

//通用失败回调
function pfnFunFail(err, callBack, btnText) {
    hideLoader();
    err = err.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(err);
    var responseCode = responseObj.b[0].error[0];
    if ($.trim(responseCode.message).toUpperCase() == 'A CONNECTION FAILURE OCCURRED') {
        responseCode.message = '当前网络不可用,请检测网络!';
    }
    if ($.trim(responseCode.message).toUpperCase() == 'THE REQUEST TIMED OUT') { //全部改成大写即可捕获
        responseCode.message = '业务处理超时!';
    }
    var okFun = {};
    if(callBack && callBack instanceof Function){
        okFun.fun = callBack;
    }
    if(btnText && typeof(btnText) == "string"){
        okFun.title = btnText;
    }
    showTags({
        'content': responseCode.message,
        'ok': okFun
    });
}

})();