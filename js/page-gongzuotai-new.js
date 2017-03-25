/**
 * Created by yangmin on 5/25/16.
 */
/**
 *
 *工作台 工作日志开始
 *
 * **/

// gongzuotai-dailyLog.html
$(document).on('pageshow',"#dailyLog",function(){

    var mday = myTime.curDate().getDate()-1,//本月已过日
        arr = dateGetYMD(mday),//计算初始和结束日期
        bussDateMin = arr[1],//初始日期
        bussDateMax = arr[0];//结束日期

    dailyLog.bussDateMin = bussDateMin;
    dailyLog.bussDateMax = bussDateMax;
    dailyLog.jgId = commonJson.orgId;
    dailyLog.personId = commonJson.adminCount;
    dailyLog.operation = '';
    dailyLog.classifyId = '';
    dailyLog.adminCount = commonJson.adminCount;

    //查询当前用户总完成情况
    iGetItemIsCompleteStatisticsFun({
        "b":[{
            "startTime.s"  : dailyLog.bussDateMin ,//开始时间
            "endTime.s"    : dailyLog.bussDateMax + ' 23:59:59',//结束时间
            "operatorNo.s" : commonJson.adminCount , //用户编号
            "orgId.s"      : commonJson.orgId , //机构号
            "deviceNo.s"   : commonJson.deviceNo , //设备唯一标识
            "moduleId.s"   : workbenchJson.moduleID , //模块号
            "tranId.s"     : workbenchJson.tranId16 , //交易号
            "personId.s"   : dailyLog.personId , //所选用户编号
            "classifyId.s" : dailyLog.classifyId ,//工作分类编号
            "operation.s"  : '' ,//操作选项
            "roleLevel.s"  : commonJson.roleLevel ,//角色级别
            "jgId.s"       : dailyLog.jgId  //查询机构机构号
        }]
    })

    //点击 自定义按钮`
    $('.seach-botton').on('click',function(){
        $('#bankBranch select').find('option').remove();
        $('#branchUser select').find('option').remove();
        $('#classify select').find('option:not(:eq(0))').remove();
        $('.seach-day-con').show();
        $('input[type="date"]:eq(0)').val(dailyLog.bussDateMin);
        $('input[type="date"]:eq(1)').val(dailyLog.bussDateMax);
        $('#classify .ui-select').find('span').html('请选择');

        if(commonJson.orgId == '00001' && (commonJson.roleLevel != '2' && commonJson.roleLevel != '3')){
            $('select:eq(0)').find('option').remove();
            $('select:eq(0)').append('<option value="'+commonJson.orgId+'">'+commonJson.orgId+' '+commonJson.orgName+'</option>');
            $('#bankBranch').find('span').html($('#bankBranch select').find('option:selected').html());
            $('#branchUser select').find('option:not(:eq(0))').remove();
            $('#branchUser select').append('<option value="'+commonJson.adminCount+'">'+commonJson.adminCount +' '+commonJson.TLRNAME+'</option>');
            $('#branchUser').find('span').html($('#branchUser select').find('option:selected').html());

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
            
        }else{
            iGetOrgListFun({
                "b":[{
                    "operatorNo.s" : commonJson.adminCount , //用户编号
                    "orgId.s"      : commonJson.orgId , //机构号
                    "deviceNo.s"   : commonJson.deviceNo , //设备唯一标识
                    "moduleId.s"   : workbenchJson.moduleID , //模块号
                    "tranId.s"     : workbenchJson.tranId16  //交易号
                }]
            })
        }
    })

    //选择支行,查询用户
    $('#bankBranch').find('.ui-select').on('change',function(){
        $('#classify').find('span').html('请选择');
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
    })
    
    //选择用户,查询用户工作分类
    $('#branchUser').find('.ui-select').on('change',function(){
        $('#classify').find('span').html('请选择');
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
        
    })

    //点击 添加按钮
    $('.button-img-tj').on('click',function(){
        dailyLog.whichDetail = 'add';
        $.mobile.changePage('gongzuotai-dailyLog-detail.html');
    })
    
    //点击 自定义弹窗 放弃按钮
    $('.fangqi-seach:eq(0)').on('click',function(){
        $('.seach-day-con').hide();
    })

    //点击 自定义弹窗 搜索按钮
    $('.fangqi-seach:eq(1)').on('click',function(){
        //日期为空
        if($('input[type="date"]:eq(0)').val() == '' || $('input[type="date"]:eq(1)').val() == ''){
            showMsg('日期不能为空');
            return;
        } else if($('input[type="date"]:eq(0)').val() > $('input[type="date"]:eq(1)').val()){
            showMsg('开始日期不能大于结束日期');
            return;
        }

        dailyLog.bussDateMin = $('input[type="date"]:eq(0)').val();//开始时间
        dailyLog.bussDateMax = $('input[type="date"]:eq(1)').val();//结束时间
        $('.seach-day-con').hide();

        //获取机构机构号
        dailyLog.jgId = $('#bankBranch select').find('option:selected').val();

        //获取用户编号和用户查询条件
        if($('#branchUser select').find('option:selected').val() == '0'){
            dailyLog.operation = 'allUser';
            dailyLog.personId = '';
        } else if($('#branchUser select').find('option:selected').val() == '-1'){
            dailyLog.operation = 'allManagerUser';
            dailyLog.personId = '';
        } else {
            dailyLog.operation = '';
            dailyLog.personId = $('select:eq(1)').find('option:selected').val();
        }

        //获取工作类型编号
        if($('#classify select').find('option:selected').val() != ''){
            dailyLog.classifyId = $('select:eq(2)').find('option:selected').val();
        } else {
            dailyLog.classifyId = '';
        }

        //查询当前用户总完成情况
        iGetItemIsCompleteStatisticsFun({
            "b":[{
                "startTime.s"  : dailyLog.bussDateMin,//开始时间
                "endTime.s"    : dailyLog.bussDateMax+ ' 23:59:59',//结束时间
                "operatorNo.s" : commonJson.adminCount , //用户编号
                "orgId.s"      : commonJson.orgId , //机构号
                "deviceNo.s"   : commonJson.deviceNo , //设备唯一标识
                "moduleId.s"   : workbenchJson.moduleID , //模块号
                "tranId.s"     : workbenchJson.tranId16 , //交易号
                "personId.s"   : dailyLog.personId , //所选用户编号
                "classifyId.s" : dailyLog.classifyId ,//工作分类编号
                "operation.s"  : dailyLog.operation ,//操作选项
                "roleLevel.s"  : commonJson.roleLevel ,//角色级别
                "jgId.s"       : dailyLog.jgId  //查询机构机构号
            }]
        })
    })

})

// gongzuotai-dailyLog-summary.html
$(document).on('pageshow',"#dailyLogSummary",function(){

    workbenchJson.bussinessDetailPg = 1
    //查询日志分类概述
    iGetListJobLogInfoFun({
        "b": [{
            "operatorNo.s" : commonJson.adminCount , //用户编号
            "orgId.s"      : commonJson.orgId , //机构号
            "deviceNo.s"   : commonJson.deviceNo , //设备唯一标识
            "moduleId.s"   : workbenchJson.moduleID , //模块号
            "tranId.s"     : workbenchJson.tranId16 , //交易号
            //"personId.s"     : '202202' , //所选用户编号
            "personId.s"   : dailyLog.personId , //所选用户编号
            //"startTime.s"  : '2015-01-01' ,//开始时间
            "startTime.s"  : dailyLog.bussDateMin,//开始时间
            //"endTime.s"    : '2017-06-01' ,//结束时间
            "endTime.s"    : dailyLog.bussDateMax+ ' 23:59:59',//结束时间
            "classifyId.s" : dailyLog.classifyId ,//工作分类编号
            "operation.s"  : dailyLog.operation ,//操作选项
            "roleLevel.s"  : commonJson.roleLevel ,//角色级别
            "jgId.s"       : dailyLog.jgId ,//查询机构号
            "itemId.s"     : dailyLog.itemId,//项目编号
            "page.s"       : "1" //页码
        }]
    })

    //点击 添加按钮
    $('.button-img-tj').on('click',function(){
        dailyLog.whichDetail = 'add';
        $.mobile.changePage('gongzuotai-dailyLog-detail.html');
    })

    //点击删除按钮
    //点击底部按钮(返回 或者删除)
    $('.footter .previous:eq(0)').on('click',function(){
        if($(this).hasClass('btn-cannt-click')) return;
        showTags({
            'title'  : '提示',
            'content': '是否删除该笔日志?', //必输
            'cancel': {
                'title' : '删除',
                'fun'   : function(){
                    showLoader('数据删除中...')
                    deleteJobLogFun({
                        'b': [{
                            "operatorNo.s" : commonJson.adminCount, //用户编号
                            "orgId.s"      : commonJson.orgId, //机构号
                            "deviceNo.s"   : commonJson.deviceNo, //设备唯一标识
                            "moduleId.s"   : workbenchJson.moduleID, //模块号
                            "tranId.s"     : workbenchJson.tranId16, //交易号
                            "personId.s"   : dailyLog.detailUserId, //所选用户编号
                            'id.s'         : dailyLog.ID          //工作项目编号
                        }]
                    },function(msg){
                        deleteJobLogSucc(msg,{refreshY : true });
                    },function(err){
                        funFail(err);
                    })
                }
            },
            'ok': {
                'title' : '放弃',
                'fun'   : function(){

                }
            }
        })
    })


    //点击查询详情
    $('.previous:eq(1)').on('click',function(){
        if(!$(this).hasClass('btn_next')) return ;
        dailyLog.whichDetail = 'detail';
        $.mobile.changePage('gongzuotai-dailyLog-detail.html');
    })

})

// gongzuotai-dailyLog-detail.html
$(document).on('pageshow',"#dailyLogDetail",function(){
    //判断是新增还是详情
    if(dailyLog.whichDetail == 'add'){
        $('.footter .previous:eq(0)').removeClass('btn-cannt-click').addClass('back-1');
        $('.footter .previous:eq(1)').addClass('btn_next');
        //新增页面
        $('.previous:eq(0)').html('放弃');
        $('.select-which').find('#dailyLog-add').addClass('active').siblings().removeClass('active');

        $('input[type="date"]').on('blur',function(){
            var canAddAlert = (function(){
                var str = $('input[type="date"]').val().split('-').join(''),
                    mday = myTime.curDate().getDate()-1,
                    str2 = dateGetYMD(mday)[0].split('-').join('');
                if(parseInt(str) <= parseInt(str2)){
                    return false;
                }else {
                    return true;
                }
            })()

            if(canAddAlert){
                $('#ic-agree').hide();
                $('#ic-disabled').hide();
                $('#ic-disagree').show();
                $('#ic-disagree').siblings('span').css('color','#000');
            }else{
                $('#ic-agree').hide();
                $('#ic-disagree').hide();
                $('#ic-disabled').show();
                $('#ic-disagree').siblings('span').css('color','#979797')
            }
        })

        //当为新增 ic-agree 点击事件
        $('#dailyLog-add').on('click',function(){
            if($('#ic-disabled').css('display') == 'none'){
                if($('#ic-agree').css('display') == 'none'){
                    $('#ic-disagree').hide();
                    $('#ic-agree').show();
                }else{
                    $('#ic-disagree').show();
                    $('#ic-agree').hide();
                }
            }
        })

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

    } else if(dailyLog.whichDetail == 'detail'){
        if(dailyLog.detailUserId[0] == commonJson.adminCount){
            $('.footter .previous:eq(0)').removeClass('btn-cannt-click').addClass('back-1');
            $('.footter .previous:eq(1)').addClass('btn_next');
        } else {
            $('select').attr("disabled",true);
            $('input').attr("disabled",true);
            $('textarea').attr("disabled",true)
        }
        
        //详情页面
        $('.select-which').find('#dailyLog-detail').addClass('active').siblings().removeClass('active');

        //获取详细信息
        iGetJobLogInfoFun({
            "b":[{
                "operatorNo.s" : commonJson.adminCount , //用户编号
                "orgId.s"      : commonJson.orgId , //机构号
                "deviceNo.s"   : commonJson.deviceNo , //设备唯一标识
                "moduleId.s"   : workbenchJson.moduleID , //模块号
                "tranId.s"     : workbenchJson.tranId16 , //交易号
                "personId.s"   : commonJson.adminCount , //所选用户编号
                "id.s"         : dailyLog.ID  //详情id
            }]
        })
    }

    //获取当前用户可选工作项目
    $('#classify').find('.ui-select').on('change',function(){
        $('#item .ui-select').find('span').html('请选择');
        dailyLog.classifyId = $('#classify select').find('option:selected').val()
        iGetJobLogItemsFun({
            "b" : [{
                "operatorNo.s" : commonJson.adminCount , //用户编号
                "orgId.s"      : commonJson.orgId , //机构号
                "deviceNo.s"   : commonJson.deviceNo , //设备唯一标识
                "moduleId.s"   : workbenchJson.moduleID , //模块号
                "tranId.s"     : workbenchJson.tranId16 , //交易号
                "classifyId.s" : $('#classify select').find('option:selected').val()
            }]
        })
    })

    //获取工作项目ID
    $('#item').find('.ui-select').on('change',function() {
        dailyLog.itemId = $('#item select').find('option:selected').val()
    })

    //工作时长自动添加'小时'
    $("#workTime").find('input').on('blur',function(){
        var str = $(this).val();
        if(str !== ''){
            str = parseFloat(str);
            if(str || str == 0) {
                str = str.toFixed(1);
                if(str < 999.1 && str > 0){
                    $(this).val(str + '小时');
                } else {
                    $(this).val('');
                    showMsg('工作时长取值范围为0.1~999.0')
                }
            }else {
                $(this).val('');
                showMsg('工作时长格式不正确')
            }
        }
    })

    //修改时间自动去掉'小时'
    $("#workTime").find('input').on('tap',function(){
        var str = $(this).val();
        str = parseFloat(str);
        if(str){
            $(this).val(str);
        }
    })

    //点击底部按钮(返回 或者删除)
    $('.footter .previous:eq(0)').on('click',function(){
        if($(this).hasClass('btn-cannt-click')) return;
        if($(this).html() == '删除'){
            showTags({
                'title'  : '提示',
                'content': '是否删除该笔日志?', //必输
                'cancel': {
                    'title' : '删除',
                    'fun'   : function(){
                        showLoader('信息删除中...')
                        deleteJobLogFun({
                            'b': [{
                                "operatorNo.s" : commonJson.adminCount , //用户编号
                                "orgId.s"      : commonJson.orgId , //机构号
                                "deviceNo.s"   : commonJson.deviceNo , //设备唯一标识
                                "moduleId.s"   : workbenchJson.moduleID , //模块号
                                "tranId.s"     : workbenchJson.tranId16 , //交易号
                                "personId.s"   : dailyLog.detailUserId , //所选用户编号
                                'id.s'         : dailyLog.ID //工作项目编号
                            }]
                        },function(msg){
                            deleteJobLogSucc(msg,{refreshY : false });
                        },function(err){
                            funFail(err);
                        })
                    }
                },
                'ok': {
                    'title' : '放弃',
                    'fun'   : function(){

                    }
                }
            })
        }else{
            $.mobile.changePage('gongzuotai-dailyLog.html',{
                reverse : true
            });
        }
    })

    //点击保存
    $('.footter .previous:eq(1)').on('click',function(){
        if(!$(this).hasClass('btn_next')) return;
        var empty = 0,text = null;

        $.each($('span.drop-down'),function(i,el){
            if($.trim($(el).html()) == "请选择" ){
                text = $(el).closest('.i-input-col2').find('span:eq(0)').text().slice(1);
                empty++;
                return false;
            }
        });

        if($('input[type="date"]').val() == "") {
            showMsg('工作时间不能为空');
            return;
        } else if(empty){
            showMsg(text + '不能为空');
            return;
        } else if($('#workTime').find('input').val() == ""){
            showMsg('工作时长不能为空');
            return;
        } else if($.trim($('textarea:eq(0)').val()) == "") {
            showMsg('具体内容不能为空');
            return;
        } else if($.trim($('textarea:eq(1)').val()) == "") {
            if($.trim($('#job-complete').find('span').html()) === '已完成'){

            } else {
                showMsg('备注不能为空');
                return;
            }
        }


        if(dailyLog.whichDetail == 'add'){
            showLoader('添加日志中...')
            //添加日志
            addJobLogFun({
                'b': [{
                    "operatorNo.s" : commonJson.adminCount , //用户编号
                    "orgId.s"      : commonJson.orgId , //机构号
                    "deviceNo.s"   : commonJson.deviceNo , //设备唯一标识
                    "moduleId.s"   : workbenchJson.moduleID , //模块号
                    "tranId.s"     : workbenchJson.tranId16 , //交易号
                    'hour.s'       : parseFloat($('#workTime').find('input').val()).toString() , //工作时长
                    'itemId.s'     : $('select:eq(1)').find('option:selected').val(), //工作项目编号
                    'classifyId.s' : $('select:eq(0)').find('option:selected').val(), //工作分类编号
                    'workTime.s'   : $('input[type="date"]').val(), //工作时间
                    'content.s'    : $('textarea:eq(0)').val() , //工作内容
                    'remarks.s'    : $('textarea:eq(1)').val() , //备注
                    'isComplete.s' : $('select:eq(2)').find('option:selected').val(), //完成情况
                    "id.s"         : dailyLog.ID //工作日志序号
                }]
            },function(msg){
                addAndUpdateJobLogSucc(msg);
            },function(err){
                funFail(err);
            })
        } else if(dailyLog.whichDetail == 'detail'){
            showLoader('修改日志中...')

            //修改日志
            updateJobLogFun({
                'b': [{
                    "operatorNo.s" : commonJson.adminCount , //用户编号
                    "orgId.s"      : commonJson.orgId , //机构号
                    "deviceNo.s"   : commonJson.deviceNo , //设备唯一标识
                    "moduleId.s"   : workbenchJson.moduleID , //模块号
                    "tranId.s"     : workbenchJson.tranId16 , //交易号
                    'hour.s'       : parseFloat($('#workTime').find('input').val()).toString() , //工作时长
                    'itemId.s'     : dailyLog.itemId, //工作项目编号
                    'classifyId.s' : dailyLog.classifyId, //工作分类编号
                    'workTime.s'   : $('input[type="date"]').val(), //工作时间
                    'content.s'    : $('textarea:eq(0)').val() , //工作内容
                    'remarks.s'    : $('textarea:eq(1)').val() , //备注
                    'isComplete.s' : $('select:eq(2)').find('option:selected').val(), //完成情况
                    "id.s"         : dailyLog.ID //工作日志序号
                }]
            },function(msg){
                addAndUpdateJobLogSucc(msg);
            },function(err){
                funFail(err);
            })
        }

    })

})


/**
 *
 *工作台 工作日志结束
 *
 * **/