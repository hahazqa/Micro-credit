/**
 * Created by lei on 5/9/16.
 * 贷款面签
 */


/*读取身份证界面*/
$(document).on('pageshow', '#faceSign-reading', function () {
    if (commonJson.losUserId == '') {
        showTags({
            'title': '提示',
            'content': '没有LOS用户号,无法办理贷款业务!',
            'ok': {
                fun: function () {
                    $.mobile.changePage('../main.html');
                }
            }
        });
        return;
    }
    loanFaceSign.groupOption = [];
    loanFaceSign.roleArrObj = [];
    //获取经纬度
    getCurrentLocationCoordinateFun();
    //调用刷身份证方法
    $(".footter .previous").on('click', function () {
        creditReadCard(function () {
            $.mobile.changePage('faceSign-read.html');
        }, function (err) {
            $.mobile.changePage('faceSign-read.html');
        });
    });
    //点击合同号
    $(".common-reading .conter-con .picRe").on('click', function () {
        $('#faceSign-reading .cus_box').show();
        $('#faceSign-reading #htInp').val('');
        $('.foot_btn:last').removeClass('foot_btn_active');
    });

    //点击放弃
    $('#faceSign-reading .foot_btn:first').on('click', function () {
        $('#faceSign-reading #htInp').val('');
        $('#faceSign-reading .cus_box').hide();
    });

    //点亮下一步按钮
    $('#htInp').on('input propertychange', function () {
        if ($(this).val() != '') {
            $('.foot_btn:last').addClass('foot_btn_active');
        } else {
            $('.foot_btn:last').removeClass('foot_btn_active');
        }
    });

    //点击查询
    $('#faceSign-reading .foot_btn:last').on('click', function () {
        if (!($(this).hasClass('foot_btn_active'))) return;
        $('#faceSign-reading .cus_box').hide();
        loanFaceSign.isContractNo = true;  //说明是输入的合同号进入的
        loanFaceSign.contractNo = $.trim($('#faceSign-reading #htInp').val());  //获取输入的合同号
        $.mobile.changePage('faceSign-contract.html', {transition: "slide"});
    });
});

/*显示身份证*/
$(document).on('pageshow', '#faceSign-read', function () {
    if (creditJson.isReadCardSucc) { //读卡成功
        $(".common-read .ziduan-value:eq(0)").text(custermerInfo.name);
        $(".common-read .ziduan-value:eq(1)").text(custermerInfo.sex);
        $(".common-read .ziduan-value:eq(2)").text(custermerInfo.nation);
        $(".common-read .ziduan-value:eq(3)").text(custermerInfo.birthday.split("-")[0]);
        $(".common-read .ziduan-value:eq(4)").text(custermerInfo.birthday.split("-")[1]);
        $(".common-read .ziduan-value:eq(5)").text(custermerInfo.birthday.split("-")[2]);
        $(".common-read .ziduan-value:eq(6)").text(custermerInfo.address);
        $(".common-read .ziduan-value:eq(7)").text(custermerInfo.cerNO);
        $(".common-read .ziduan-value:eq(8)").text(custermerInfo.issAuthority);
        $(".common-read .ziduan-value:eq(9)").text(custermerInfo.cerExpdDt);
        $('.common-read .sfz-img').attr('src', custermerInfo.image);

        //保存数据
        loanFaceSign.name = custermerInfo.name;
        loanFaceSign.sex = custermerInfo.sex;
        loanFaceSign.nation = custermerInfo.nation;
        loanFaceSign.birthday = custermerInfo.birthday;
        loanFaceSign.address = custermerInfo.address;
        loanFaceSign.cerNO = custermerInfo.cerNO;
        loanFaceSign.issAuthority = custermerInfo.issAuthority;
        loanFaceSign.cerExpdDt = custermerInfo.cerExpdDt;
        loanFaceSign.image = custermerInfo.image;
        // 点亮下一步
        $('.footter .previous:eq(1)').addClass('btn_next');
    } else {
        $(".common-read .pic_suc").text('身份证读取失败!');
        $(".common-read .loading_box").html('');
    }

    //点击上一步，跳转页面
    $('.footter .previous:eq(0)').on('click', function () {
        $.mobile.changePage('faceSign-reading.html', {reverse: true});
    });

    //下一步
    $('.footter .previous:eq(1)').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        loanFaceSign.isContractNo = false;
        $.mobile.changePage('faceSign-contract.html', {transition: "slide"});
    });
});

/*面签---选择合同号*/
$(document).on('pageshow', '#faceSign-contract', function () {
    //请求借口
    showLoader('合同号查询中...');
    var aboutJson;
    if (loanFaceSign.isContractNo == false) {   //说明是刷身份证进入的
        aboutJson = {      //发送请求的参数
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loanFaceSign.moduleId, //模块编号
                "tranId.s": loanFaceSign.tranId, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "DOCUMENT_TYPE.s": 'Ind01',    //证件类型
                "DOCUMENT_ID.s": custermerInfo.cerNO,      //证件号码
                "CONTRACT_NO.s": '', //合同号
                "page.s": '0'    //页码
            }]
        };
    } else {
        aboutJson = {      //发送请求的参数
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loanFaceSign.moduleId, //模块编号
                "tranId.s": loanFaceSign.tranId, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "DOCUMENT_TYPE.s": '',    //证件类型
                "DOCUMENT_ID.s": '',      //证件号码
                "CONTRACT_NO.s": loanFaceSign.contractNo, //合同号
                "page.s": '0'    //页码
            }]
        };
    }
    loanFaceSign.ctbussinessDetailPg = '1';
    loanFaceSign.ctbussinessDetail = aboutJson;
    findOrdersFaceSignConF();
    //上一步
    $('.footter .previous:eq(0)').on('click', function () {
        $.mobile.changePage('faceSign-reading.html', {reverse: true});
    });
    //下一步
    $('.footter .previous:eq(1)').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        loanFaceSign.contractNo = $(".box-content .click div").eq(0).html();//合同号
        loanFaceSign.loanName = $(".box-content .click div").eq(1).html();//姓名
        loanFaceSign.documentType = $(".box-content .click div").eq(2).html();//证件类型
        loanFaceSign.documentId = $(".box-content .click div").eq(3).html();//证件号码
        loanFaceSign.loanAMT = rmoney($(".box-content .click div").eq(4).html());//贷款金额
        loanFaceSign.loanTerm = $(".box-content .click div").eq(5).html();//贷款期限
        loanFaceSign.isCachePage.isChoseT = false;
        $.mobile.changePage('faceSign-choseT.html', {transition: "slide"});
    });
});

/*再次选择*/
$(document).on('pageshow', '#faceSign-choseT', function () {
    if (loanFaceSign.isCachePage.isChoseT || workbenchJson.isTemp) {
        if (workbenchJson.isTemp) {
            getLoanFaceTempORPreToObject(workbenchJson.temp);
        }
        $('.msg_box span:eq(0)').html(loanFaceSign.contractNo); //合同号
        $('.msg_box span:eq(1)').html(loanFaceSign.loanName + '&nbsp;&nbsp;&nbsp;&nbsp;' + loanFaceSign.documentId); //贷款人  姓名+证件号码
        $('.msg_box span:eq(2)').html(fmoney(loanFaceSign.loanAMT)); //签约金额
        $('.msg_box span:eq(3)').html(parseInt(loanFaceSign.loanTerm) + '&nbsp;月'); //贷款期限
        workbenchJson.isTemp = false;
        var roleTArr = [];  //未完成角色
        var comRoleArr = []; //完成角色

        loanFaceSign.isFirst = false;
        if (loanFaceSign.roleArrObj.length < 1) {
            findRolesFaceSignOption(loanFaceSign.roleArr);
        } else {
            for (var q = 0; q < loanFaceSign.roleArr.length; q++) {
                for (var p = 0; p < loanFaceSign.roleArrObj.length; p++) {
                    if (p == loanFaceSign.roleArrObj.length - 1) {
                        if (loanFaceSign.roleArrObj[p].role == loanFaceSign.roleArr[q].custRoleVO[0].CUSTOMER_ROLE && loanFaceSign.roleArrObj[p].name ==loanFaceSign.roleArr[q].custRoleVO[0].CUSTOMER_NAME) {
                            comRoleArr.push(loanFaceSign.roleArrObj[p]);
                            break;
                        } else {
                            roleTArr.push(loanFaceSign.roleArr[q]);
                        }
                    } else {
                        if (loanFaceSign.roleArrObj[p].role == loanFaceSign.roleArr[q].custRoleVO[0].CUSTOMER_ROLE && loanFaceSign.roleArrObj[p].name ==loanFaceSign.roleArr[q].custRoleVO[0].CUSTOMER_NAME) {
                            comRoleArr.push(loanFaceSign.roleArrObj[p]);
                            break;
                        }
                    }
                }
            }
        }
        if (roleTArr.length > 0) {
            findRolesFaceSignOption(roleTArr);
        }
        if (loanFaceSign.flag == '1') {
            $('.msg_box').eq(1).find('.ple').html('请勾选需补充验证客户');
            $('.msg_box').eq(2).find('.ple').html('已完成补充验证客户');
        } else {
            $('.msg_box').eq(1).find('.ple').html('请勾选在场未验证客户');
            $('.msg_box').eq(2).find('.ple').html('已完成验证客户');
        }
        if ((loanFaceSign.flag == '1' && loanFaceSign.roleArrObj.length > 0) || (loanFaceSign.roleArrObj.length == loanFaceSign.roleArr.length)) {
            $('.footter .previous:last').addClass('btn_next');
        } else {
            $('.footter .previous:last').removeClass('btn_next');
        }
        if (comRoleArr.length > 0) {
            $('.customerP-peiou').show();
            $('.msg_box:eq(2)').css('display', 'block');
            var txtHtml = '';
            $.each(comRoleArr, function (index, ele) {
                txtHtml += ' <div class="img_box">' +
                    '<div class="customer customer_one">' +
                    '<img src="' + ele.custFacePic.replace(/\\/g, "") + '" width="100%" height="100%" class="camera-pic">' +
                    '</div>' +
                    '<div class="img_notes">' +
                    '<span>' + roleType[ele.role] + '</span>&nbsp;&nbsp;<span>' + ele.name + '</span>' +
                    '</div>' +
                    '<div class="img_notes">' + ele.cerNO + '</div>' +
                    '</div>';
            });
            $('.msg_box:last').html(txtHtml);
        }

    } else {
        $('.msg_box span:eq(0)').html(loanFaceSign.contractNo); //合同号
        $('.msg_box span:eq(1)').html(loanFaceSign.loanName + '&nbsp;&nbsp;&nbsp;&nbsp;' + loanFaceSign.documentId); //贷款人  姓名+证件号码
        $('.msg_box span:eq(2)').html(fmoney(loanFaceSign.loanAMT)); //签约金额
        $('.msg_box span:eq(3)').html(parseInt(loanFaceSign.loanTerm) + '&nbsp;月'); //贷款期限
        findRolesFaceSignConF();
    }
    loanFaceSign.isCachePage.isChoseT = true;
    //点击提交
    $('.footter .previous:first').on('click', function () {
        loanFaceSign.noOption = [];
        loanFaceSign.groupRole = [];
        loanFaceSign.curOption = '0';
        $('.op_box li').each(function (index, ele) {
            if ($(this).attr('isselected') == 'true') {
                loanFaceSign.noOption.push(loanFaceSign.roleArr[$(this).attr('arrNum')]);
            }
        });
        if (loanFaceSign.noOption.length < 1) {
            showTags({
                'title': '提示',
                'content': '请勾选需要验证的客户!',
                'ok': {
                    'title': '确认',
                    fun: function () {
                    }
                }
            });
            return;
        }
        loanFaceSign.curAudioTime = '';  
        $.mobile.changePage('faceSign-perReading.html', {transition: "slide"});
    });
    $('.footter .previous:last').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        showLoader('获取交易流水号中..');
        custermerInfo.name = loanFaceSign.loanName;
        custermerInfo.cerNO = loanFaceSign.documentId;
        getPlatGlobalSeq(loanFaceSign,function () {
            showLoader('影像压缩中...');
            //影像上传文件打包压缩插件
            topicUtil.subscribe("faceSign/signAContractFaceSign", signAContractFaceSign);
            var compressCount = 0;  //压缩成功次数,为2时完成压缩
            var phoneTime = myTime.CurTime();
            loanFaceSign.phoneTime = phoneTime;
            var tempPicArr = [];  //ct001
            $.each(loanFaceSign.groupOption,function (index, ele) {
                tempPicArr.push(ele.audio);
                tempPicArr = tempPicArr.concat(ele.screenPic);
            });
            $.each(loanFaceSign.roleArrObj,function (index, ele) {
                if(ele.role == '1'){  //判断面部照片 角色是主借人的面部照片放在数组的第一个位置
                    tempPicArr.unshift(ele.custFacePic);
                }else{
                    tempPicArr.push(ele.custFacePic);
                }
            });
            Meap.zipCompression(loanFaceSign.platGlobalSeq + 'image', tempPicArr, function (msg) {
                //将要上传的影像插入到ios断点上传的数据库中
                //影像上传 业务参数
                var appBus = {
                    'busiGloablaSeq': loanFaceSign.platGlobalSeq,//业务编号
                    'attchType': '0',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
                    'deviceNo': commonJson.udId,//设备编号
                    'moduleId': loanFaceSign.tranId,//模块编号  ----->交易编号  丰益要求的
                    'tranId': loanFaceSign.tranId,//交易编号
                    'orgId': commonJson.orgId,//机构编号
                    'operatorNo': commonJson.adminCount,//操作员
                    'custName': loanFaceSign.loanName,//客户名称
                    'custCredType': '0',//客户证件类型
                    'custCredNo': loanFaceSign.documentId,//客户证件号
                    'offlineOnline': commonJson.offlineOnline,//脱机/联机
                    'BUS_NO':loanFaceSign.contractSerialNo,//合同流水号
                    'TRADE_TYPE':'00008',//交易编号
                    'OPER_TYPE': 'ADD',//操作类型 add-->表示新增  mod-->表示修改
                    'workAddress': commonJson.workAddress//工作地址
                };
                appBus = JSON.stringify(appBus);
                var sendDataJson = {
                    "databaseName": "myDatabase",
                    "tableName": "up_download_info",
                    "data": [{
                        "fileToken": loanFaceSign.phoneTime,//文件唯一ID(可以为时间挫
                        "pos": "0",//文件的断点信息(初始为0)
                        "filePath": msg,//文件路径
                        "appPath": 'ct001',//自定义文件路径
                        "appBuss": appBus,//业务参数
                        "downloadToken": "",//文件的下载ID(初始为空)
                        "leng": "1",//文件的长度(初始为1)
                        "isNotice": "yes", //是否调用后台(一直是yes)
                        "fileType": "0",
                        "REMARK1": "01" //上传状态01-默认
                    }]
                };
                insertTableData(sendDataJson, function (msg) {
                    topicUtil.publish('faceSign/signAContractFaceSign',++compressCount);
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
        });
        // var sendJson = {
        //     "b": [{
        //         "deviceNo.s": commonJson.udId, //设备编号
        //         "moduleId.s": loanFaceSign.moduleId, //模块编号
        //         "tranId.s": loanFaceSign.tranId, //交易编号
        //         "orgId.s": commonJson.orgId,//机构号
        //         "operatorNo.s": commonJson.adminCount,//操作员
        //         "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
        //         "workAddress.s": commonJson.workAddress,//工作地址
        //         "CLIENT_NAME.s": loanFaceSign.loanName,//客户姓名
        //         "DOCUMENT_TYPE.s": '0',//证件类型
        //         "DOCUMENT_ID.s": loanFaceSign.documentId//证件号码
        //     }]
        // };
        // getPlatGlobalSeqFinFun(sendJson, loanFaceSign, signAContractFaceSign);
    });
    //点击暂存按钮
    $('.customerP-zancun').on('click', function () {
        $(this).css('display','none');
        loanFaceZanCunCustomerInfo();
        $.mobile.changePage('../main.html', {reverse: true});
    });

    //点击录音和相片按钮
    $('.customerP-peiou').on('click', function () {
        $.mobile.changePage('faceSign-showAudio.html', {transition: "slide"});
    });
});

/*再次读取身份证界面*/
$(document).on('pageshow', '#faceSign-perReading', function () {
    loanFaceSign.curRoleNum = loanFaceSign.noOption[loanFaceSign.curOption].custRoleVO[0].CUSTOMER_ROLE;
    $('.clues span:eq(0)').html(roleType[loanFaceSign.curRoleNum]);//读身份证人的角色
    $('.clues span:eq(1)').html(loanFaceSign.noOption[loanFaceSign.curOption].custRoleVO[0].CUSTOMER_NAME);//附身份证人的姓名
    //调用刷身份证方法
    $(".footter .previous:last").on('click', function () {
        if (loanFaceSign.isContractNo == false && loanFaceSign.noOption[loanFaceSign.curOption].custRoleVO[0].CUSTOMER_ROLE == '1') {
            showTags({
                'title': '提示',
                'content': '已读取借款人&nbsp;' + loanFaceSign.noOption[loanFaceSign.curOption].custRoleVO[0].CUSTOMER_NAME + '&nbsp;身份证,是否重新读取?',
                'ok': {
                    'title': '放弃',
                    fun: function () {
                        custermerInfo.name = loanFaceSign.name;
                        custermerInfo.sex = loanFaceSign.sex;
                        custermerInfo.nation = loanFaceSign.nation;
                        custermerInfo.birthday = loanFaceSign.birthday;
                        custermerInfo.address = loanFaceSign.address;
                        custermerInfo.cerNO = loanFaceSign.cerNO;
                        custermerInfo.issAuthority = loanFaceSign.issAuthority;
                        custermerInfo.cerExpdDt = loanFaceSign.cerExpdDt;
                        custermerInfo.image = loanFaceSign.image;
                        creditJson.isReadCardSucc = true;
                        $.mobile.changePage('faceSign-perRead.html');
                    }
                },
                'cancel': {
                    'title': '继续',
                    fun: function () {
                        creditReadCard(function () {
                            $.mobile.changePage('faceSign-perRead.html');
                        }, function (err) {
                            $.mobile.changePage('faceSign-perRead.html');
                        });
                    }
                }
            });
        } else {
            creditReadCard(function () {
                $.mobile.changePage('faceSign-perRead.html');
            }, function (err) {
                $.mobile.changePage('faceSign-perRead.html');
            });
        }

    });
    //点击关闭
    $(".footter .previous:first").on('click', function () {
        showTags({
            'title': '提示',
            'content': '' + loanFaceSign.noOption[loanFaceSign.curOption].custRoleVO[0].CUSTOMER_NAME + '&nbsp;身份验证不通过!',
            'ok': {  //放弃
                title: '确认',
                fun: function () {
                    if (loanFaceSign.noOption.length > 1) {  //说明存在多个验证的角色
                        loanFaceSign.noOption.splice(loanFaceSign.curOption, 1);//在本次勾选的角色数组中取出验证不通过的
                        if (loanFaceSign.curOption >= loanFaceSign.noOption.length) {
                            $.mobile.changePage('faceSign-audio.html', {transition: "slide"});
                        } else {
                            loanFaceSign.curRoleNum = loanFaceSign.noOption[loanFaceSign.curOption].custRoleVO[0].CUSTOMER_ROLE;
                            $('.clues span:eq(0)').html(roleType[loanFaceSign.curRoleNum]);//读身份证人的角色
                            $('.clues span:eq(1)').html(loanFaceSign.noOption[loanFaceSign.curOption].custRoleVO[0].CUSTOMER_NAME);//附身份证人的姓名
                        }
                    } else {
                        $.mobile.changePage('faceSign-choseT.html', {reverse: true});
                    }
                }
            }
        });
    });
});

/*---- 显示身份证 ----*/
$(document).on('pageshow', '#faceSign-perRead', function () {
    if (creditJson.isReadCardSucc) { //读卡成功
        $(".common-read .ziduan-value:eq(0)").text(custermerInfo.name);
        $(".common-read .ziduan-value:eq(1)").text(custermerInfo.sex);
        $(".common-read .ziduan-value:eq(2)").text(custermerInfo.nation);
        $(".common-read .ziduan-value:eq(3)").text(custermerInfo.birthday.split("-")[0]);
        $(".common-read .ziduan-value:eq(4)").text(custermerInfo.birthday.split("-")[1]);
        $(".common-read .ziduan-value:eq(5)").text(custermerInfo.birthday.split("-")[2]);
        $(".common-read .ziduan-value:eq(6)").text(custermerInfo.address);
        $(".common-read .ziduan-value:eq(7)").text(custermerInfo.cerNO);
        $(".common-read .ziduan-value:eq(8)").text(custermerInfo.issAuthority);
        $(".common-read .ziduan-value:eq(9)").text(custermerInfo.cerExpdDt);
        $('.common-read .sfz-img').attr('src', custermerInfo.image);

        $('.footter .previous:eq(1)').removeClass('btn_next');
        $('.sh_loading_box_shadow').remove();
        $('.header .head-left,.header .head-right').addClass('btn-cannt-click');
        $('.ui-page').append('<div class="sh_loading_box_shadow" style="position:absolute;right:0;top:0;left:0;bottom:0;z-index:24;background-color: rgba(0,0,0,.0);"></div>');

        //判断当前角色信息是否存在  存在就覆盖不存在就创建
        if (loanFaceSign.noOption[loanFaceSign.curOption].custRoleVO[0].CUSTOMER_NAME != custermerInfo.name || loanFaceSign.noOption[loanFaceSign.curOption].custRoleVO[0].DOCUMENT_ID != custermerInfo.cerNO) {  //人员
            $(".common-read .loading_box").html('<div class="read_loading" style="margin-top:40px;"></div>');
            showTags({
                'title': '提示',
                'content': '请在读卡器上放置 ' + loanFaceSign.noOption[loanFaceSign.curOption].custRoleVO[0].CUSTOMER_NAME + ' 的身份证件',
                'ok': {
                    fun: function () {
                        $.mobile.changePage('faceSign-perReading.html', {reverse: true});
                    }
                }
            });
            return;
        }
        loanFaceSign.temp = {};
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "orgId.s": commonJson.orgId,//机构号
                "moduleId.s": loanFaceSign.moduleId,//模块编号
                "tranId.s": loanFaceSign.tranId,//交易编号
                "operatorNo.s": commonJson.adminCount,//操作员
                "deviceNo.s": commonJson.udId,//设备编号
                "DOCUMENT_TYPE.s": "0",//证件类型
                "DOCUMENT_ID.s": custermerInfo.cerNO,//身份证号码
                "CLIENT_NAME.s": custermerInfo.name,//被核对人姓名
                "BUSSINESSCODE.s": "01",//业务总类
                "BRANCH_ID.s": commonJson.orgId//机构号
            }]
        };
        //身份证联网核查
        icitizenCertificateIdenifyFun(sendJson, function (msg) {
            $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
            $('.sh_loading_box_shadow').remove();
            icitizenCertificateIdenifyComSucc(msg, loanFaceSign.temp, 'faceSign-perReading.html', 'faceSign-customeP.html', function () {
                CopyCustermerInfo(loanFaceSign.temp);
                $.mobile.changePage('faceSign-customeP.html', {transition: "slide"});
            }, function () {
                if (loanFaceSign.noOption.length > 1) {  //说明存在多个验证的角色
                    loanFaceSign.noOption.splice(loanFaceSign.curOption, 1);//在本次勾选的角色数组中取出验证不通过的
                    if (loanFaceSign.curOption >= loanFaceSign.noOption.length) {
                        $.mobile.changePage('faceSign-audio.html', {transition: "slide"});
                    } else {
                        $.mobile.changePage('./faceSign-perReading.html', {reverse: true});
                    }
                } else {
                    $.mobile.changePage('faceSign-choseT.html', {reverse: true});
                }
            });
        }, function (err) {
            $('.footter .previous:eq(1)').removeClass('btn_next');
            $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
            $('.sh_loading_box_shadow').remove();
            $(".common-read .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
            funFail(err);
        })
    } else {
        $(".common-read .pic_suc").text('身份证读取失败!');
        $(".common-read .loading_box").html('');
    }

    $(".lianwanghecha-chongxin").on("click", function () {//重新联网核查
        showLoader('信息查询中...');
        $(".lianwanghecha-yichang").hide();
        $('.footter .previous:eq(1)').removeClass('btn_next');
        $('.sh_loading_box_shadow').remove();
        $('.header .head-left,.header .head-right').addClass('btn-cannt-click');
        $('.ui-page').append('<div class="sh_loading_box_shadow" style="position:absolute;right:0;top:0;left:0;bottom:0;z-index:24;background-color: rgba(0,0,0,.0);"></div>');
        $(".loading_box").html('<img class="img_loading" src="../../images/ic_load.gif" alt=""/><div class="read_loading">信息审核中…</div>');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "orgId.s": commonJson.orgId,//机构号
                "moduleId.s": loanFaceSign.moduleId,//模块编号
                "tranId.s": loanFaceSign.tranId,//交易编号
                "operatorNo.s": commonJson.adminCount,//操作员
                "deviceNo.s": commonJson.udId,//设备编号
                "DOCUMENT_TYPE.s": "0",//证件类型
                "DOCUMENT_ID.s": custermerInfo.cerNO,//身份证号码
                "CLIENT_NAME.s": custermerInfo.name,//被核对人姓名
                "BUSSINESSCODE.s": "01",//业务总类
                "BRANCH_ID.s": commonJson.orgId//机构号
            }]
        };
        //身份证联网核查
        icitizenCertificateIdenifyFun(sendJson, function (msg) {
            $('.footter .previous:eq(1)').addClass('btn_next');
            $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
            $('.sh_loading_box_shadow').remove();
            icitizenCertificateIdenifyComSucc(msg, loanFaceSign.temp, 'faceSign-perReading.html', 'faceSign-customeP.html', function () {
                CopyCustermerInfo(loanFaceSign.temp);
                $.mobile.changePage('faceSign-customeP.html', {transition: "slide"});
            }, function () {
                if (loanFaceSign.noOption.length > 1) {  //说明存在多个验证的角色
                    loanFaceSign.noOption.splice(loanFaceSign.curOption, 1);//在本次勾选的角色数组中取出验证不通过的
                    if (loanFaceSign.curOption >= loanFaceSign.noOption.length) {
                        $.mobile.changePage('faceSign-audio.html', {transition: "slide"});
                    } else {
                        $.mobile.changePage('./faceSign-perReading.html', {reverse: true});
                    }
                } else {
                    $.mobile.changePage('faceSign-choseT.html', {reverse: true});
                }
            });
        }, function (err) {
            $('.footter .previous:eq(1)').removeClass('btn_next');
            $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
            $('.sh_loading_box_shadow').remove();
            $(".common-read .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
            funFail(err);
        })
    });

    $(".lianwanghecha-jixu").on("click", function () {//继续业务办理
        $(".lianwanghecha-yichang").hide();
        CopyCustermerInfo(loanFaceSign.temp);
        $.mobile.changePage('faceSign-customeP.html', {transition: "slide"});
    });

    $(".lianwanghecha-tuichu").on("click", function () {//退出
        $(".lianwanghecha-yichang").hide();
        if (loanFaceSign.noOption.length > 1) {  //说明存在多个验证的角色
            loanFaceSign.noOption.splice(loanFaceSign.curOption, 1);//在本次勾选的角色数组中取出验证不通过的
            if (loanFaceSign.curOption >= loanFaceSign.noOption.length) {
                $.mobile.changePage('faceSign-audio.html', {transition: "slide"});
            } else {
                $.mobile.changePage('./faceSign-perReading.html', {reverse: true});
            }
        } else {
            $.mobile.changePage('faceSign-choseT.html', {reverse: true});
        }
    });

    //点击上一步，跳转页面
    $('.footter .previous:eq(0)').on('click', function () {
        $.mobile.changePage('faceSign-perReading.html', {reverse: true});
    });

    //下一步
    $('.footter .previous:eq(1)').on('click', function () {  // 查核心
        if (!($(this).hasClass('btn_next'))) return;
        CopyCustermerInfo(loanFaceSign.temp);
        $.mobile.changePage('faceSign-customeP.html', {transition: "slide"});
    });

});
/*拍摄面部照片*/
$(document).on('pageshow', '#faceSign-customerP', function () {
    $('.plesPic span:eq(0)').html(roleType[loanFaceSign.curRoleNum]);  //角色
    $('.plesPic span:eq(1)').html(loanFaceSign.noOption[loanFaceSign.curOption].custRoleVO[0].CUSTOMER_NAME);  //姓名
    if (loanFaceSign.isCachePage.isFacePic && loanFaceSign.temp.custFacePic != '' && loanFaceSign.temp.custFacePic != undefined) {
        $('.img_box:eq(0) .customer').find('.camera-pic').remove();
        $('.img_box:eq(0) .customer').append('<img src="' + loanFaceSign.temp.custFacePic.replace(/\\/g, "") + '" width="100%" height="115px" class="camera-pic">');
        $('.img_box:eq(0) .rephoto').text('重拍');
        $('.img_box:eq(0) .camera').hide();
        $('.footter .previous:eq(1)').addClass('btn_next');
    }
    //预览大图 点击关闭
    $('.bigpic-review-close').click(function (event) {
        commonImageAcquisition.reviewImgClose();
    });
    //预览大图 删除图片
    $('.bigpic-review-del').click(function (event) {
        commonImageAcquisition.delImg(commonImageAcquisition.curParentObj, commonImageAcquisition.imgSrc, '');
    });
    //预览大图 重新拍照
    $('.bigpic-review-rephone').click(function (event) {
        commonImageAcquisition.reGetImg(commonImageAcquisition.curParentObj, commonImageAcquisition.imgSrc, loanFaceSign.temp);
    });
    //点击拍照
    $('.customerP .conter-con').on('click', '.customer', function (ev) {
        commonImageAcquisition.curParentObj = $(this);
        commonImageAcquisition.imgSrc = $(this).find('.camera-pic').attr('src');
        var oTarget = ev.target;
        if ($(this).find('.rephoto').html() == '重拍') { //重拍
            if ($(oTarget).hasClass('rephoto')) {
                commonImageAcquisition.reGetImg(commonImageAcquisition.curParentObj, commonImageAcquisition.imgSrc, loanFaceSign.temp);
            }
            if ($(oTarget).hasClass('camera-pic')) { //预览大图
                commonImageAcquisition.imgSrc = $(oTarget).attr('src');
                commonImageAcquisition.reviewImg($(oTarget).attr('src'));
            }
            return;
        }
        //拍照
        if (commonImageAcquisition.curParentObj.parent().hasClass('get-face')) {
            commonImageAcquisition.getFace(commonImageAcquisition.curParentObj, '', loanFaceSign.temp);
        } else {
            commonImageAcquisition.getImg(commonImageAcquisition.curParentObj, '', '');
        }
    });
    loanFaceSign.isCachePage.isFacePic = true;
    //点击上一步，跳转页面
    $('.footter .previous:eq(0)').on('click', function () {
        $.mobile.changePage('faceSign-perReading.html', {reverse: true});
    });

    //下一步
    $('.footter .previous:eq(1)').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        loanFaceSign.temp.custFacePic = $('.customerP .img_box:eq(0) .camera-pic:eq(0)').attr('src'); //客户面部照片
        if (loanFaceSign.temp.isCompress) {
             loanFaceSign.isCachePage.isFacePic = false;
            if (loanFaceSign.noOption.length == 1) {  //说明签名只勾选了一个人
                $.mobile.changePage('faceSign-audio.html', {transition: "slide"});
            } else {
                if (loanFaceSign.curOption == loanFaceSign.noOption.length-1) {  //判断循环是否到了最后一个
                    loanFaceSign.groupRole.push(loanFaceSign.temp);
                    $.mobile.changePage('faceSign-audio.html', {transition: "slide"});
                } else {
                    loanFaceSign.curOption++;
                    loanFaceSign.groupRole.push(loanFaceSign.temp);
                    $.mobile.changePage('faceSign-perReading.html', {reverse: true});
                }
            }
        } else {
            $.mobile.changePage('faceSign-personFace.html', {transition: "slide"});
        }

    });
});

/*录音界面*/
$(document).on('pageshow', '#faceSign-audio', function () {
    var textHtml = '';
    $.each(loanFaceSign.noOption, function (index, ele) {
        textHtml += '<li>' +
            '<div>' + roleType[ele.custRoleVO[0].CUSTOMER_ROLE] + '</div>' +
            '<div>' + ele.custRoleVO[0].CUSTOMER_NAME + '</div>' +
            '<div>' + idCardType[ele.custRoleVO[0].DOCUMENT_TYPE] + '</div>' +
            '<div class="colTty">' + ele.custRoleVO[0].DOCUMENT_ID + '</div>' +
            '</li>';
    });
    $('#faceSign-audio .op_box').html(textHtml);
    //实现时间的计数
    loanFaceSign.duringTime = null;
    $('.audio_box').html('');
    var audioTime = 0;

    function audioAddTime() {
        audioTime++;
        var hour = parseInt(audioTime / 3600);
        var minute = parseInt((audioTime - hour * 3600) / 60);
        var seconds = parseInt((audioTime - hour * 3600) % 60);
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        $('.search_con .time_box span').html(hour + ':' + minute + ':' + seconds);
        if(minute ==20){
            recordPlugin(loanFaceSign.audioName, 'stop', function (msg) {
                loanFaceSign.curAudio = msg;
                clearInterval(loanFaceSign.duringTime);
                loanFaceSign.duringTime = null;
                audioTime = 0;
                $('.search_box').hide();
                $('.audio_box').html('<audio style="width: 100%;" src="' + loanFaceSign.curAudio + '" preload="auto" controls></audio>');
                $('.footter .previous:eq(0)').addClass('btn_next');
            }, function (err) {
                $('.audio_box').html('');
                showTags({
                    'title': '提示',
                    'content': '录音失败!',
                    'ok': {}
                })
            });
        }
    }

    //重新录音
    $('#faceSign-audio .btn_box .restart').on('click', function () {
        //首先删除源文件
        if (loanFaceSign.curAudioTime != undefined && loanFaceSign.curAudioTime != '') {
            showTags({
                'title': '提示',
                'content': '重新录音,将会删除原录音文件,是否继续?',
                'ok': {
                    'title': '放弃',
                    fun: function () {

                    }
                },
                'cancel': {
                    'title': '继续',
                    fun: function () {
                       // loanFaceSign.audioName = getYMDHMSM('audio') + commonJson.udId.splice(/-/g,'');
                        deletePhoto([loanFaceSign.curAudio], function (msg) {
                            $('.audio_box').html('');
                            audioTime = 0;
                            recordPlugin(loanFaceSign.audioName, 'start', function (msg) {
                                $('.search_box').show();
                                $('.search_con .time_box span').html('00:00:00');
                                loanFaceSign.duringTime = setInterval(audioAddTime, 1000);
                            }, function (err) {
                                showTags({
                                    'title': '提示',
                                    'content': '录音失败!',
                                    'ok': {}
                                })
                            });
                        }, function (err) {

                        });
                    }
                }
            });
        } else {
            loanFaceSign.curAudioTime = myTime.CurTime();//当前时间戳
            loanFaceSign.audioName = getYMDHMSM('audio') + commonJson.udId.replace(/-/g,'');
            recordPlugin(loanFaceSign.audioName, 'start', function (msg) {
                $('.search_box').show();
                $('.search_con .time_box span').html('00:00:00');
                loanFaceSign.duringTime = setInterval(audioAddTime, 1000);
            }, function (err) {
                showTags({
                    'title': '提示',
                    'content': '录音失败!',
                    'ok': {}
                })
            });
        }
    });

    //结束录音
    $('.search_box img').on('click', function () {
        recordPlugin(loanFaceSign.audioName, 'stop', function (msg) {
            loanFaceSign.curAudio = msg;
            clearInterval(loanFaceSign.duringTime);
            loanFaceSign.duringTime = null;
            audioTime = 0;
            $('.search_box').hide();
            $('.audio_box').html('<audio style="width: 100%;" src="' + loanFaceSign.curAudio + '" preload="auto" controls></audio>');
            $('.footter .previous:eq(0)').addClass('btn_next');
        }, function (err) {
            $('.audio_box').html('');
            showTags({
                'title': '提示',
                'content': '录音失败!',
                'ok': {}
            })
        });
    });

    //点击录音完成
    $('.footter .previous:eq(0)').on('click', function () {
        if (!($(this).hasClass('btn_next'))) {
            return;
        }
        $.mobile.changePage('faceSign-screenP.html');
    });
});

/*拍摄场景照片*/
$(document).on('pageshow', '#faceSign-screenP', function () {
    var textHtml = '<div class="img_box">' +
        '<div class="customer customer_three" picname="screenPic">' +
        '<div class="rephoto cameraMul">选拍，可多张拍摄</div>' +
        '<img class="camera" src="../../images/ic_camera.png" alt=""/></div>' +
        '<div class="img_notes">场景照片</div>' +
        '</div>';
    //预览大图 点击关闭
    $('.bigpic-review-close').click(function (event) {
        commonImageAcquisition.reviewImgClose();
    });
    //预览大图 删除图片
    $('.bigpic-review-del').click(function (event) {
        commonImageAcquisition.delImgBox(commonImageAcquisition.curParentObj, commonImageAcquisition.imgSrc, '');
    });
    //预览大图 重新拍照
    $('.bigpic-review-rephone').click(function (event) {
        commonImageAcquisition.reGetImg(commonImageAcquisition.curParentObj, commonImageAcquisition.imgSrc, loanFaceSign.temp);
    });
    //点击拍照
    $('.customerP .conter-con').on('click', '.customer', function (ev) {
        commonImageAcquisition.curParentObj = $(this);
        commonImageAcquisition.imgSrc = $(this).find('.camera-pic').attr('src');
        var oTarget = ev.target;
        if ($(this).find('.rephoto').html() == '重拍') { //重拍
            if ($(oTarget).hasClass('rephoto')) {
                commonImageAcquisition.reGetImg(commonImageAcquisition.curParentObj, commonImageAcquisition.imgSrc, loanFaceSign.temp);
            }
            if ($(oTarget).hasClass('camera-pic')) { //预览大图
                commonImageAcquisition.imgSrc = $(oTarget).attr('src');
                commonImageAcquisition.reviewImg($(oTarget).attr('src'));
            }
            return;
        }
        //拍照
        if (commonImageAcquisition.curParentObj.parent().hasClass('get-face')) {
            commonImageAcquisition.getFace(commonImageAcquisition.curParentObj, '', loanFaceSign.temp);
        } else {
            commonImageAcquisition.addGetImg(commonImageAcquisition.curParentObj, '', textHtml);
        }
    });
    loanFaceSign.isCachePage.isScreenPic = true;
    //拍照完成
    $('.footter .previous:eq(0)').one('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        loanFaceSign.picArr = [];
        $('.customerP .img_content .camera-pic').each(function (index, ele) {
            loanFaceSign.picArr.push($(this).attr('src'));
        });
        $.each(loanFaceSign.groupRole, function (index, ele) {
            loanFaceSign.roleArrObj.push(ele);
        });
        loanFaceSign.groupOption.push({
            option: loanFaceSign.noOption,  //当前的组
            len: loanFaceSign.noOption.length,  //组的长度
            audio: loanFaceSign.curAudio,  //这个组的音频
            audioTime: loanFaceSign.curAudioTime,//音频的时间戳
            screenPic: loanFaceSign.picArr  //组对应的场景图片
        });
        loanFaceSign.curAudioTime = '';
        $.mobile.changePage('./faceSign-choseT.html', {reverse: true});
    });
});

/*人脸对比*/
$(document).on('pageshow', '#faceSign-personFace', function () {
    showLoader("影像对比中...");
    transFormBase64(loanFaceSign.temp.custFacePic, function (msg) {
        loanFaceSign.temp.faceBase64 = msg;
        transFormBase64(loanFaceSign.temp.image, function (msg1) {
            loanFaceSign.temp.imageBase64 = msg1;
            $(".personFace .camera:eq(0)").attr('src', loanFaceSign.temp.custFacePic);
            $(".personFace .camera:eq(1)").attr('src', loanFaceSign.temp.image);
            $(".personFace .camera:eq(2)").attr('src', loanFaceSign.temp.custFacePic);
            if (loanFaceSign.temp.CheckResult == '09' || loanFaceSign.temp.CheckResult == '02') {
                $(".personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + loanFaceSign.temp.checkPhoto);
            } else {
                $(".personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + loanFaceSign.temp.checkPhoto);
            }
            //影像两两对比
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "orgId.s": commonJson.orgId,//机构号
                    "moduleId.s": loanFaceSign.moduleId,//模块编号
                    "tranId.s": loanFaceSign.tranId,//交易编号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "deviceNo.s": commonJson.udId,//设备编号
                    "OPERATOR_NO.s": commonJson.adminCount, //业务经办人工号
                    "TRANS_SCENE.s": "0006",  //交易场景  //TODO 这个地方
                    "COMPARE_TYPE.s": "2",  //    比对类型1-客户经理比对，2-客户比对
                    "WS_TYPE.s": "2",  // 终端类型1-PC，2-IOS，3-Android
                    "WSNO.s": commonJson.udId,  //    终端号
                    "VERSION.s": "v1.1.4",  //当前控件版本
                    "TRANS_CHANNEL.s": "301",  //   渠道301
                    "ID_CARD.s": loanFaceSign.temp.cerNO,  // 身份证号码
                    "IMG_BASE.s": loanFaceSign.temp.faceBase64,  //      现场照片
                    "CRYPT_TYPE.s": "0",  //   图像是否经过加密0-未加密，1-加密方式一，2加密方式二
                    "ID_IMG_BASE.s": loanFaceSign.temp.checkPhoto,  //联网核查照片
                    "CARD_IMG_BASE.s": loanFaceSign.temp.imageBase64,  //  芯片照片
                    "BUSI_TYPE.s": "52"  //  TODO 需要修改
                }]
            };
            ifacelRecognitionSeFun(sendJson, function (msg) {
                iFacelRecognitionServiceComSucc(msg, loanFaceSign.temp);
            }, function (err) {
                loanFaceSign.temp.faceRecogn = '2'; //自动不通过
                $(".personFace .face-result").addClass('no-pass').text('未通过');
                $(".personFace .center-header").text('人脸识别未通过！');
                $('.personFace .previous:last').addClass('btn_next').text('远程复核');
                funFail(err);
            })
        }, function (err) {
            alert('影像转换失败！')
        })
    }, function (err) {
        alert('影像转换失败！')
    });


    //点击查询在线客户经理
    $('#managerList a').on('click', function () {
        showLoader("获取远程复核客户经理...");
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "operatorNo.s": commonJson.adminCount,//操作员
                "deviceNo.s": commonJson.udId//设备编号
            }]
        };
        ISysUserServiceManListFun(sendJson, function (msg) {
            ISysUserServiceManListComSucc(msg);
        }, function (err) {
            funFail(err);
        })
    });
    //点击继续
    $('.personFace .previous:last').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        if ($(this).text() == '继续') {
            loanFaceSign.isCachePage.isFacePic = false;
            if (loanFaceSign.noOption.length == 1) {  //说明签名只勾选了一个人
                loanFaceSign.groupRole.push(loanFaceSign.temp);
                $.mobile.changePage('faceSign-audio.html', {transition: "slide"});
            } else {
                if (loanFaceSign.curOption == loanFaceSign.noOption.length - 1) {  //判断循环是否到了最后一个
                    loanFaceSign.groupRole.push(loanFaceSign.temp);
                    $.mobile.changePage('faceSign-audio.html', {transition: "slide"});
                } else {
                    loanFaceSign.curOption++;
                    loanFaceSign.groupRole.push(loanFaceSign.temp);
                    $.mobile.changePage('faceSign-perReading.html', {reverse: true});
                }
            }
        } else {
            if ($('#managerList select').val() == '') {
                showMsg('请选择一个客户经理');
                return;
            }
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "orgId.s": commonJson.orgId,//机构号
                    "moduleId.s": loanFaceSign.moduleId,//模块编号
                    "tranId.s": loanFaceSign.tranId,//交易编号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "deviceNo.s": commonJson.udId,//设备编号
                    "platGlobalSeq.s": loanFaceSign.temp.platGlobalSeq, //流水号
                    "topic.s": "N/A", //主题N/A
                    "code.s": "101", //指令101
                    "paramUrl.s": "abc", //参数地址
                    "days.s": "0", //有效天数
                    "appKey.s": "com.nqsky.bank.service", //appKey  com.nqsky.bank.service
                    "context.s": "您有一条远程复核业务需要办理",//推送内容
                    "userIds.s": $('#managerList select').val(),//用户ID  
                    "busiType.s": "01", //电子卡01
                    "cardResult.s": loanFaceSign.temp.cardResult,//联网核查对比
                    "chipResult.s": loanFaceSign.temp.chipResult//芯片对比
                }]
            };
            showLoader("正在等待" + $('#managerList option:selected').attr('realName') + "[手机:" + $('#managerList option:selected').attr('cellPhone') + "]复核...");
            loanFaceSign.temp.telCheck = true;
            iissuesServiceFun(sendJson, function (msg) {
                iissuesServiceLoanFaceSignSucc(msg, loanFaceSign.temp);
            }, function (err) {
                funFail(err);
            })
        }
    });
    //点击F放弃
    $('.personFace .previous:first').on('click', function () {
        loanFaceSign.temp.isCompress = false;
        $.mobile.changePage('faceSign-customeP.html', {reverse: true});
    });
});

/*完成界面*/
$(document).on('pageshow', '#faceSign-complete', function () {
    $('.info_value:eq(0)').html(loanFaceSign.contractNo);  //合同号
    $('.info_value:eq(1)').html(loanFaceSign.loanName + '&nbsp;&nbsp;&nbsp;&nbsp;' + loanFaceSign.documentId);   //姓名&nbsp;&nbsp;身份证
    $('.info_value:eq(2)').html(fmoney(loanFaceSign.loanAMT));   //贷款金额
    $('.info_value:eq(3)').html(parseInt(loanFaceSign.loanTerm) + '&nbsp;个月');   //贷款期限
    //点击完成
    $('.footter .previous:eq(0)').on('click', function () {
        $.mobile.changePage('../main.html', {reverse: true});
    })
});

/*显示录音和图片界面*/
$(document).on('pageshow', '#faceSign-showAudio', function () {
    for (var i = 0; i < loanFaceSign.groupOption.length; i++) {
        var boxHtml = '';
        $('#faceSign-showAudio .conter-auto ').append('<div class="box_con" audioSrc="' + loanFaceSign.groupOption[i].audio + '">' +
            '<div class="play_box" alt="pause">' +
            '<img class="bp_y" src="../../images/ic-ly-ing.png" alt="">' +
            '<img class="bp_n" style="display:none;" src="../../images/ic-fs-pause.png" alt="">' +
            '</div>' +
            '<div class="time_box sty_box">' + myTime.UnixToDate(loanFaceSign.groupOption[i].audioTime) + '</div>' +
            '<ul class="per_son"></ul>' +
            '<div style="clear:both;"></div>' +
            '</div>');
        for (var j = 0; j < loanFaceSign.groupOption[i].option.length; j++) {
            boxHtml += '<li class="sty_box">' +
                '<span >' + roleType[loanFaceSign.groupOption[i].option[j].custRoleVO[0].CUSTOMER_ROLE] + '</span>: <span>' + loanFaceSign.groupOption[i].option[j].custRoleVO[0].CUSTOMER_NAME + '</span></li>';
        }
        $('.box_con:last ul').html(boxHtml);
    }
    $('#faceSign-showAudio .conter-auto ').append('<div class="msg_box"></div>');

    //播放按钮
    $('.play_box').on('click', function () {
        var audioSrc = $(this).parent('.box_con').attr('audioSrc');
        if (audioSrc != $('.conter-auto audio').attr('src')) {  //判断是不是当前的音频
            if (loanFaceSign.clrAudio != undefined || loanFaceSign.clrAudio != null) {
                clearInterval(loanFaceSign.clrAudio);
            }
            $('.conter-auto audio').eq(0).attr('src', audioSrc);
            document.getElementsByTagName('audio')[0].play();
            $('.conter-auto .play_box').attr('alt','pause');
            $(this).attr('alt','play');
            loanFaceSign.clrAudio = setInterval(countSec, 500);
            $('.play_box .bp_y').show().siblings('.bp_n').hide();
            $(this).find('.bp_n').show().siblings('.bp_y').hide();
        } else {
            if ($(this).attr('alt') == 'play') {  //播放状态
                document.getElementsByTagName('audio')[0].pause();
                if (loanFaceSign.clrAudio != undefined || loanFaceSign.clrAudio != null) {
                    clearInterval(loanFaceSign.clrAudio);
                }
                $(this).attr('alt','pause');
                // $('.play_box .bp_y').show().siblings('.bp_n').hide();
                $(this).find('.bp_y').show().siblings('.bp_n').hide();
            } else {
                if (loanFaceSign.clrAudio != undefined || loanFaceSign.clrAudio != null) {
                    clearInterval(loanFaceSign.clrAudio);
                }
                loanFaceSign.clrAudio = setInterval(countSec, 500);
                document.getElementsByTagName('audio')[0].play();
                $(this).attr('alt','play');
                $(this).find('.bp_y').hide().siblings('.bp_n').show();
                // $('.play_box .bp_n').show().siblings('.bp_y').hide();
            }
        }
    });

    function countSec() {
        if (document.getElementsByTagName('audio')[0].ended) {
            var audioSrc = $('audio').attr('src');
            clearInterval(loanFaceSign.clrAudio);
            $('[audioSrc="' + audioSrc + '"]').find('.play_box').attr('alt','pause');
            $('audio').eq(0).removeAttr('src');
            $('[audioSrc="' + audioSrc + '"]').find('.bp_y').show().siblings('.bp_n').hide();
        }
    }

    var imgHtml = '';
    for (var p = 0; p < loanFaceSign.groupOption.length; p++) {
        $.each(loanFaceSign.groupOption[p].screenPic, function (index, ele) {
            imgHtml += '<div class="img_box">' +
                '<div class="customer customer_one">' +
                '<img style="width: 100%;height: 100%;" class="camera-pic" src="' + ele.replace(/\\/g, "") + '" alt=""/>' +
                '</div>' +
                '</div>';
        });
    }
    $('.msg_box:last').html(imgHtml);

    //点击关闭按钮
    $('.footter .previous:first').on('click', function () {
        $.mobile.changePage('./faceSign-choseT.html', {reverse: true});
    })
});
