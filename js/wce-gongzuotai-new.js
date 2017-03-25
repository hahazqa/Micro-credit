/**
 * Created by yangmin on 5/30/16.
 */
/**
 *
 *工作台 工作日志开始
 *
 * **/

//查询所属子机构
function iGetOrgListFun(sendJson){
    showLoader('获取机构列表...')
    getOrgListFun(sendJson,function(msg){
        var responseCode = preJsonY(msg);
        setTimeout(hideLoader(),1000);
        if(responseCode[0].results == '00') {
            var text = '';
            $.each(responseCode,function(i,el){
                if(i == 0) return;
                text += '<option value="'+el.org[0].orgId+'">'+el.org[0].orgId+' '+el.org[0].orgName+'</option>'
            })
            $('select:eq(0)').find('option').remove();
            $('select:eq(0)').append(text);
            $('#bankBranch').find('span').html($('#bankBranch select').find('option:selected').html());

            if(commonJson.roleLevel == '2' || commonJson.roleLevel == '3'){
                iGetListSysUserFun({
                    "b": [{
                        "operatorNo.s": commonJson.adminCount, //用户编号
                        "orgId.s"     : commonJson.orgId, //机构号
                        "deviceNo.s"  : commonJson.deviceNo, //设备唯一标识
                        "moduleId.s"  : workbenchJson.moduleID, //模块号
                        "tranId.s"    : workbenchJson.tranId16,  //交易号
                        "jgId.s"      : $('#bankBranch select').find('option:selected').val(),//所选机构编号
                        "roleLevel.s" : commonJson.roleLevel//角色等级
                    }]
                })
            }else{
                var text = '<option value="'+commonJson.adminCount+'">'+commonJson.adminCount +' '+commonJson.TLRNAME+'</option>'
                $('#branchUser select').find('option:not(:eq(0))').remove();
                $('#branchUser select').append(text);
                $('#branchUser').find('span').html($('#branchUser select').find('option:selected').html());

                showLoader('查询工作分类...')
                //获取当前用户可选工作分类
                iGetClassifyByUserRoleFun({
                    "b": [{
                        "operatorNo.s": commonJson.adminCount, //用户编号
                        "orgId.s"     : commonJson.orgId, //机构号
                        "deviceNo.s"  : commonJson.deviceNo, //设备唯一标识
                        "moduleId.s"  : workbenchJson.moduleID, //模块号
                        "tranId.s"    : workbenchJson.tranId16, //交易号
                        "personId.s"  : commonJson.adminCount, //用户编号
                        "operation.s" : '' //操作选项
                    }]
                })
            }

        } else if(responseCode[0].results == '08'){
            iGetOrgListFun(sendJson);
        } else {
            showTags({
                'title': '提示',
                'content': '未查询到机构信息',
                'ok': {
                    'title': '确认',
                    'fun': function () {
                        $('select:eq(0)').find('option').remove();
                        $('select:eq(0)').append('<option>请选择</option>');
                        $('#bankBranch').find('span').html('请选择');
                    }
                }
            });
        }
    },function(err){
        funFail(err);
    })
}

//获取对应用户列表
function iGetListSysUserFun(sendJson){
    showLoader('获取用户列表...')
    getListSysUserFun(sendJson,function(msg){
        var responseCode = preJsonY(msg);
        setTimeout(hideLoader(),1000);
        if(responseCode[0].results == '00') {
            var text = '';
            if(commonJson.roleLevel == '2') {
                text += '<option value="-1">支行分管领导</option><option value="0">全部营销人员</option>'
            } else {
                text += '<option value="0">全部营销人员</option><option value="' + commonJson.adminCount + '">当前用户</option>'
            }
            $.each(responseCode,function(i,el){
                if(i == 0) return;
                text += '<option value="'+el.sysUser[0].userId+'">'+el.sysUser[0].userId +' '+el.sysUser[0].realName+'</option>'
            })
            
            $('#branchUser select').find('option').remove();
            $('#branchUser select').append(text);
            $('#branchUser').find('span').html($('#branchUser select').find('option:selected').html());

            //获取用户编号和用户查询条件
            if($('#branchUser select').find('option:selected').val() == '0'){
                var operation = 'allUser';
                var personId = '';
            } else if($('#branchUser select').find('option:selected').val() == '-1'){
                var operation = 'allManagerUser';
                var personId = '';
            } else {
                var operation = '';
                var personId = $('select:eq(1)').find('option:selected').val();
            }
            
            //获取当前用户可选工作分类
            iGetClassifyByUserRoleFun({
                "b": [{
                    "operatorNo.s": commonJson.adminCount, //用户编号
                    "orgId.s"     : commonJson.orgId, //机构号
                    "deviceNo.s"  : commonJson.deviceNo, //设备唯一标识
                    "moduleId.s"  : workbenchJson.moduleID, //模块号
                    "tranId.s"    : workbenchJson.tranId16, //交易号
                    "personId.s"  : personId, //用户编号
                    "operation.s" : operation //操作选项
                }]
            })

        } else if(responseCode[0].results == '08'){
            iGetListSysUserFun(sendJson);
        } else {
            showTags({
                'title': '提示',
                'content': '未获取到用户列表',
                'ok': {
                    'title': '确认',
                    'fun': function () {
                        $('#branchUser select').find('option').remove();
                        $('#branchUser select').append('<option>请选择</option>');
                        $('#branchUser').find('span').html('请选择');
                    }
                }
            });
        }
    },function(err){
        funFail(err);
    })
}

//获取总完成进度
function iGetItemIsCompleteStatisticsFun(sendJson){
    showLoader('信息查询中...')
    getItemIsCompleteStatisticsFun(sendJson,function(msg){
        var responseCode = preJsonY(msg);
        setTimeout(hideLoader(),1000);
        if(responseCode[0].results == '00') {
            var htmlText = '';
            for(var i = 1 ; i > -2 ; i--) {
                var hasItem = false;
                $.each(responseCode, function (j, el) {
                    if (j == 0) return;
                    if(i == el.jobItemDto[0].isComplete){
                        hasItem = true;
                        htmlText += '<div class="item"><span>' +
                            dailyLog.isComplete[i] +
                            el.jobItemDto[0].frequency + '笔</span><span>' +
                            parseFloat(el.jobItemDto[0].scale).toFixed(2) +
                            '%</span></div>';
                        return false;
                    }
                })
                if(! hasItem) {
                    htmlText += '<div class="item"><span>' + dailyLog.isComplete[i] + '0笔</span><span>0.00%</span></div>';
                }
            }
            if(responseCode[0].sumAmount){
                htmlText += '<div class="item item-total"><span>总时长</span><span>'+parseFloat(responseCode[0].sumAmount).toFixed(1)+'小时</span></div>'
            } else {
                htmlText += '<div class="item item-total"><span>总时长</span><span>0.0小时</span></div>'
            }
            $('.count-content').html(htmlText);
            
            //查询当前用户工作分类
            iGetClassifyStatisticsFun(sendJson)

        } else if(responseCode[0].results == '08'){
            iGetItemIsCompleteStatisticsFun(sendJson);
        } else {
            showTags({
                'title': '提示',
                'content': '暂无工作日志',
                'ok': {
                    'title': '确认',
                    'fun': function () {
                        $('.count-content').html('');
                        $('#dropDownList').html('')
                    }
                }
            });
        }
    },function(err){
        funFail(err)
    })
}

//查询角色工作分类
function iGetClassifyStatisticsFun(sendJson){
    showLoader('信息获取中...');
    getClassifyStatisticsFun(sendJson,function(msg){
        var responseCode = preJsonY(msg);
        setTimeout(hideLoader(),1000);
        if(responseCode[0].results == '00') {
            var htmlText = '';
            //循环添加下拉列表头
            $.each(responseCode ,function(i,el){
                if(i == 0) return;
                var jobClassify = el.jobClassifyDto[0];
                htmlText += '<div class="item-drop-down"><div class="drop-down-title" id="'
                    + jobClassify.itemId +'"><span>'
                    + jobClassify.item +'</span><span>' +parseFloat(jobClassify.scale).toFixed(2)
                    +'%<img src="../../images/ic_shape.png"></span></div><ul class="drop-down-summary">'
                //循环添加下拉列表内容
                $.each(el.jobClassifyDto[1].items,function(j,inEle){
                    var jobItem = inEle.jobItemDto[0];
                    htmlText +='<li class="summary-rows" id="'+ jobItem.itemId +'"><div>'
                        + jobItem.item +'</div><div>'+jobItem.frequency
                        +'笔</div><div>'+parseFloat(jobItem.totalHour).toFixed(1)+'小时</div></li>'
                })
                htmlText += '</ul></div>'
            })
            $('#dropDownList').html(htmlText);

            //下拉框 点击效果
            $('.drop-down-title').on('click',function(){
                $(this).parent().toggleClass('item-drop-down-active');
            })

            //下拉框内容 选择效果
            $('.summary-rows').on('click',function(){
                dailyLog.itemId = $(this)[0].id;
                dailyLog.classifyId = $(this).parent().siblings('.drop-down-title')[0].id
                $(this).addClass('click').siblings().removeClass('click');
                $.mobile.changePage('gongzuotai-dailyLog-summary.html');
            })

        } else if(responseCode[0].results == '08'){
            iGetClassifyStatisticsFun(sendJson);
        } else {
            showTags({
                'title': '提示',
                'content': '未获取到工作项目详情',
                'ok': {
                    'title': '确认',
                    'fun': function () {
                        $('.count-content').html('');
                        $('#dropDownList').html('')
                    }
                }
            });
        }
    },function(err){
        funFail(err)
    })
}

//查询日志分类概述
function iGetListJobLogInfoFun(sendJson){
    showLoader('数据获取中...')
    getListJobLogInfoFun(sendJson,function(msg){
        var responseCode = preJsonY(msg);
        setTimeout(hideLoader(),1000);
        if(responseCode[0].results == '00') {
            var htmlText = '';
            $.each(responseCode,function(i,el){
                if(i == 0) return ;
                var jobLog = el.jobLogDto[0];
                htmlText += '<li class="box-rows" id="'
                            +jobLog['id']+'"><div>'
                            +jobLog.classify+'</div><div>'
                            +jobLog.item+'</div><div>'
                            +jobLog.content+'</div><div>'
                            +parseFloat(jobLog.hour).toFixed(1)+'小时</div><div>'
                            +dailyLog.isComplete[jobLog.isComplete]+'</div><div class="userId">'
                            +jobLog.userId+' '+jobLog.realName +'</div></li>'
            })
            $('.box-content').html(htmlText)

            //分页
            $(".page-number-con").createPage({
                pageCount: Math.ceil(responseCode[0]['totalNum.i'] / 7),
                current: workbenchJson.bussinessDetailPg,
                backFn: function(p) {
                    showLoader('加载中...');
                    sendJson.b[0]["page.s"] = String(p);
                    workbenchJson.bussinessDetailPg = p;
                    iGetListJobLogInfoFun(sendJson);
                }
            });

            //点击box-rows
            $('.box-rows').on('click',function(){
                $(this).addClass('click').siblings().removeClass('click');
                dailyLog.detailUserId = $('.click').find('.userId').html().split(' ');
                dailyLog.ID = $('.click').attr('id');
                if(dailyLog.detailUserId[0] == commonJson.adminCount){
                    $('.previous:eq(0)').removeClass('btn-cannt-click').addClass('back-1');
                } else {
                    $('.previous:eq(0)').addClass('btn-cannt-click').removeClass('back-1');
                }
                if(!$('.previous:eq(1)').hasClass('btn_next')){
                    $('.previous:eq(1)').addClass('btn_next');
                }
            })
        } else if(responseCode[0].results == '08'){
            iGetListJobLogInfoFun(sendJson);
        } else {
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
    },function(err){
        funFail(err)
    })
}

//查工作详情
function iGetJobLogInfoFun(sendJson){
    showLoader('获取客户详细信息...')
    getJobLogInfoFun(sendJson,function(msg){
        var responseCode = preJsonY(msg);
        setTimeout(hideLoader(),1000);
        if(responseCode[0].results == '00') {
            var jobLog = responseCode[1].jobLogDto[0],
                workTime = jobLog.workTime;

            $('input[type="date"]').val(workTime.split(' ')[0]);
            $('#dailyLog-detail .i-input-control').html(jobLog.userId+' '+jobLog.realName);
            $('span.drop-down:eq(0)').html(jobLog.classify);
            $('span.drop-down:eq(1)').html(jobLog.item);
            $('#workTime').find('input').val(parseFloat(jobLog.hour).toFixed(1) + '小时');
            $('span.drop-down:eq(2)').html(dailyLog.isComplete[jobLog.isComplete]);
            $('textarea:eq(0)').val(jobLog.content);
            $('textarea:eq(1)').val(jobLog.remarks);
            
            //获取当前用户可选工作分类
            iGetClassifyByUserRoleFun({
                "b" : [{
                    "operatorNo.s" : commonJson.adminCount , //用户编号
                    "orgId.s"      : commonJson.orgId , //机构号
                    "deviceNo.s"   : commonJson.deviceNo , //设备唯一标识
                    "moduleId.s"   : workbenchJson.moduleID , //模块号
                    "tranId.s"     : workbenchJson.tranId16, //交易号
                    "personId.s"   : commonJson.adminCount //用户编号
                }]
            })
            
        } else if(responseCode[0].results == '08'){
            iGetJobLogInfoFun(sendJson);
        } else {
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
    },function(err){
        funFail(err);
    })
}

//工作日志 增改 成功回调
function addAndUpdateJobLogSucc(msg){
    var responseCode = preJsonY(msg);
    setTimeout(hideLoader(),1000);
        if(responseCode[0].results == '00') {
            
            if(dailyLog.whichDetail == 'add' && $('#ic-agree').css('display') != 'none'){
                //添加工作提醒
                var sendJson = {
                    "b": [{
                        "deviceNo.s": commonJson.udId, //设备编号
                        "moduleId.s":workbenchJson.moduleID , //设备编号
                        "tranId.s": workbenchJson.tranId16, //交易名
                        "orgId.s": commonJson.orgId, //机构号
                        "operatorNo.s": commonJson.adminCount, //操作员
                        "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                        "workAddress.s": commonJson.workAddress, //工作地址
                        "REMIND_DATE.s": $('input[type="date"]').val(), //提醒日期
                        "START_TIME.s": '00:00:00',//startTime, //开始时间
                        "END_TIME.s": '23:59:59',//endTime, //结束时间
                        "REMIND_MODE.s": 'F',//提醒方式
                        "REMIND_USER.s": commonJson.adminCount,//提醒对象
                        "REMIND_CONTENT.s": $('textarea:eq(0)').val()//提醒内容
                    }]
                };
                addJobAlertListFun(sendJson, function (msg) {
                    $.mobile.changePage('gongzuotai-dailyLog.html',{
                        reverse : true
                    });
                }, function (err) {
                    funFail(err);
                });   
            }else{
                $.mobile.changePage('gongzuotai-dailyLog.html',{
                    reverse : true
                });
            }
        } else if(responseCode[0].results == '08'){
    
        } else {
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

//工作台 删除操作成功回调
function deleteJobLogSucc(msg,obj){
    var responseCode = preJsonY(msg);
    setTimeout(hideLoader(),1000);
    if(responseCode[0].results == '00') {
        if(obj.refreshY){
            $('.click').remove();
        } else {
            $.mobile.changePage('gongzuotai-dailyLog-summary.html',{
                reverse : true
            });
        }
    } else if(responseCode[0].results == '08'){

    } else {
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

//查询工作分类
function iGetClassifyByUserRoleFun(sendJson){
    showLoader('查询工作分类...')
    getClassifyByUserRoleFun(sendJson,function(msg){
        var responseCode = preJsonY(msg);
        setTimeout(hideLoader(),1000);
        if(responseCode[0].results == '00') {
            var text = '';
            $.each(responseCode,function(i,el){
                if(i == 0) return;
                text += '<option value="'+ el.jobItem[0].itemId +'">' + el.jobItem[0].item+'</option>'
            })

            $('#classify select').find('option:not(:eq(0))').remove();
            $('#classify').find('select').append(text);

        } else if(responseCode[0].results == '08'){
            iGetClassifyByUserRoleFun(sendJson)
        } else {
            showTags({
                'title': '提示',
                'content': '未获取到工作分类',
                'ok': {
                    'title': '确认',
                    'fun': function () {
                        $('#classify select').find('option:not(:eq(0))').remove();
                        $('#classify').find('span').html('请选择');
                    }
                }
            });
        }
    },function(err){
        funFail(err)
    })
}

//查询工作项目
function iGetJobLogItemsFun(sendJson){
    showLoader('获取用户工作项目...')
    getJobLogItemsFun(sendJson,function(msg){
        var responseCode = preJsonY(msg);
        setTimeout(hideLoader(),1000);
        if(responseCode[0].results == '00') {
            var text = '';
            $.each(responseCode,function(i,el){
                if(i == 0) return;
                text += '<option value="'+ el.jobItem[0].itemId +'">' + el.jobItem[0].item+'</option>'
            })

            $('#item').find('select').find('option:not(:eq(0))').remove();
            $('#item').find('select').append(text);

        } else if(responseCode[0].results == '08'){
            iGetJobLogItemsFun(sendJson);
        } else {
            showTags({
                'title': '提示',
                'content': '未获取到工作项目',
                'ok': {
                    'title': '确认',
                    'fun': function () {
                        $('#item').find('select').find('option:not(:eq(0))').remove();
                    }
                }
            });
        }
    },function(err){
        funFail(err)
    })
}

/**
 *
 *工作台 工作日志结束
 *
 * **/