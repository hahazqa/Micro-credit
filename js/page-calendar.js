var JobCalendar = function() { //工作提醒
	var pathName = window.document.location.pathname;
	var projectName = pathName.substring(0, pathName.indexOf('www') + 4);
	var currentdate = myTime.curDate();
	var yearmonth = currentdate.getFullYear() + "-" + ((currentdate.getMonth() + 1) > 9 ? (currentdate.getMonth() + 1) : ("0" + (currentdate.getMonth() + 1)));
	var weekDay = ["日", "一", "二", "三", "四", "五", "六"]; //暂未使用到该变量
	var redDay = [];
	var jobDay = [];
	var calendarDay = [];
	if (arguments.length == 1) { //参数的数据模型：2015-08
		if (arguments[0] != "" && arguments[0] != null) {
			yearmonth = arguments[0];
		}
	}
	var days = new Date(Number(yearmonth.split("-")[0]), Number(yearmonth.split("-")[1]), 0).getDate();
	var _tempDay = '';
	var dayIndex = 0;
	for (var i = 1; i <= days; i++) {
		_tempDay = new Date(Number(yearmonth.split("-")[0]), Number(yearmonth.split("-")[1]) - 1, i).getDay();
		if (i == 1) { //获取本月第一天从星期几开始，之前的星期置空
			for (var j = 0; j < _tempDay; j++) {
				calendarDay[dayIndex++] = '';
			}
		}
		calendarDay[dayIndex++] = i;
		if (i == days) { //获取本月最后一天从星期几开始，之后的星期置空
			for (;
				(dayIndex + 1) <= 42; dayIndex++) {
				calendarDay[dayIndex] = '';
			}
		}
		if (_tempDay == 0 || _tempDay == 6) {
			redDay.push(i);
		}
	}
	var jobCalendarOpt = {
		getPreMonth: function(date) { //@date 格式为yyyy-mm-dd的日期，如：2014-01-25
			var arr = date.split('-');
			var year = arr[0]; //获取当前日期的年份
			var month = arr[1]; //获取当前日期的月份
			var day = arr[2]; //获取当前日期的日
			var days = new Date(year, month, 0);
			days = days.getDate(); //获取当前日期中月的天数
			var year2 = year;
			var month2 = parseInt(month) - 1;
			if (month2 == 0) {
				year2 = parseInt(year2) - 1;
				month2 = 12;
			}
			var day2 = day;
			var days2 = new Date(year2, month2, 0);
			days2 = days2.getDate();
			if (day2 > days2) {
				day2 = days2;
			}
			if (month2 < 10) {
				month2 = '0' + month2;
			}
			var t2 = year2 + '-' + month2;
			return t2;
		},
		getNextMonth: function(date) { //@date 格式为yyyy-mm-dd的日期，如：2014-01-25
			var arr = date.split('-');
			var year = arr[0]; //获取当前日期的年份
			var month = arr[1]; //获取当前日期的月份
			var day = arr[2]; //获取当前日期的日
			var days = new Date(year, month, 0);
			days = days.getDate(); //获取当前日期中的月的天数
			var year2 = year;
			var month2 = parseInt(month) + 1;
			if (month2 == 13) {
				year2 = parseInt(year2) + 1;
				month2 = 1;
			}
			var day2 = day;
			var days2 = new Date(year2, month2, 0);
			days2 = days2.getDate();
			if (day2 > days2) {
				day2 = days2;
			}
			if (month2 < 10) {
				month2 = '0' + month2;
			}

			var t2 = year2 + '-' + month2;
			return t2;
		},
		currentDay: function(day) { //是否是当天,参数模型(Number)
			if (Number(yearmonth.split("-")[0]) == currentdate.getFullYear() && Number(yearmonth.split("-")[1]) == (currentdate.getMonth() + 1) && Number(day) == currentdate.getDate()) {
				return true;
			}
			return false;
		},
		beforeDay: function(day) { //是否是今天之前的日期,参数模型(2015-11-04)
			var days = day.split("-");
			var beforeDate = new Date(Number(days[0]), Number(days[1]) - 1, Number(days[2]));
			if (currentdate.getTime() > beforeDate.getTime()) {
				return true;
			}
			return false;
		},
		existRedDay: function(day) { //判断当前月份是否是周六日,参数模型(Number)
			for (var i = 0; i < redDay.length; i++) {
				if (redDay[i] == day) {
					return true;
				}
			}
			return false;
		},
		existJobDay: function(date) { //提醒任务的日期标记:参数模型（2015-11-04）
			for (var j = 0; j < jobDay.length; j++) {
				if (jobDay[j] == date) {
					return true;
				}
			}
			return false;
		},
		jobJSON: function(dateStr, jobList) { //获取提醒任务记录:参数模型（2015-11-04）,[{'date':'2015-11-04','time':'09:12','event':'job1'},{'date':'2015-11-04','time':'10:10','event':'job2'}]
			var jobBuffer = [];
			if (jobList != null && jobList.length > 0) {
				for (var j = 0; j < jobList.length; j++) {
					if (jobList[j].date == dateStr) {
						jobBuffer.push(jobList[j]);
					}
				}
			}
			return jobBuffer;
		},
		jobEvent: function(eventData) {
//			showLoader('数据加载中...');
			//TODO:调用后台接口获取当月的任务提醒,数据模型：[{'date':'2015-11-04','time':'09:12','event':'job1'},{'date':'2015-11-04','time':'10:10','event':'job2'}]
//			var JobAlertsJson = {
//				"b": [{
//					"deviceNo.s": commonJson.udId, //设备编号
//					"moduleId.s": workbenchJson.moduleID, //设备编号
//					"tranId.s": workbenchJson.tranId10, //交易名
//					"orgId.s": commonJson.orgId, //机构号
//					"operatorNo.s": commonJson.adminCount, //操作员
//					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
//					"workAddress.s": commonJson.workAddress, //工作地址
//					"searchDate.s": yearmonth, //查询日期
//					"searchContent.s": '', //搜索内容
//					"isLoginNow.s": 'false' //是否是登陆时查询
//
//				}]
//			};
			if(usrStatistic.isSucess == '00'){
				eval(eventData(usrStatistic.alertAry));
			}else{
				eval(eventData([]));
			}
//			IJobAlertsServiceFun(JobAlertsJson, function(msg) {
//				//alert("IJobAlertsServiceFun = " + msg);
//				msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
//				var responseObj = JSON.parse(msg);
//				var responseCode = responseObj.b;
//				var jobList = [];
//				//alert("是否"+jobList);
//				if (responseCode[0].results == "00") {
//					for (var i = 1; i < responseCode.length; i++) {
//						var jobAlertsArray = responseCode[i].jobAlerts;
//						$.each(jobAlertsArray, function(j, d) {
//							jobList.push({
//								'date': d.REMIND_DATE,
//								'time': d.START_TIME + ' - ' + d.END_TIME,
//								'event': d.REMIND_CONTENT
//							});
//						});
//					}
//					//alert(jobList[0].REMIND_DATE);
//					eval(eventData(jobList));
//				} else {
//					
//					eval(eventData([]));
//				}
//
//			}, function(err) {
//				hideLoader();
//			});
//
//						var jobList = [{
//							'date': '2015-11-11',
//							'time': '09:12',
//							'event': 'job1'
//						}, {
//							'date': '2015-11-04',
//							'time': '10:10',
//							'event': 'job2'
//						}, {
//							'date': '2015-11-05',
//							'time': '10:10',
//							'event': '2015-11-05job2'
//						}, {
//							'date': '2015-11-13',
//							'time': '10:10',
//							'event': 'xxxxxxxxxxxjob2'
//						}, {
//							'date': '2015-11-15',
//							'time': '10:10',
//							'event': 'ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttjob2'
//						}];
			//
			//
			//			if (jobList != null && jobList.length > 0) { //提醒任务的日期标记
			//				for (var i = 0; i < jobList.length; i++) {
			//					var dateStr = jobList[i].date;
			//					if (!jobCalendarOpt.existJobDay(dateStr)) {
			//						jobDay.push(dateStr);
			//					}
			//				}
			//			}
//						eval(eventData(jobList));
		},
		showCalendar: function() {
			jobCalendarOpt.jobEvent(function(jobList) {
				if (jobList != null && jobList.length > 0) { //提醒任务的日期标记
						for (var i = 0; i < jobList.length; i++) {
							var dateStr = jobList[i].date;
							if (!jobCalendarOpt.existJobDay(dateStr)) {
								jobDay.push(dateStr);
							}
						}
					}
				$('#flip-container').html('');
				var pathName = window.document.location.pathname;
				var projectName = pathName.substring(0, pathName.indexOf('www') + 4);
				var frontDiv = '<div class="front"><div class="yewujob-after-fanzhuanone"></div><div class="yewujob-after-fanzhuantwo"></div><div class="job-after-head"><img src="' + projectName + 'images/ic_home_zuo.png" class="ic_home_zuo" data-content="' + jobCalendarOpt.getPreMonth(yearmonth) + '"/><span>' + Number(yearmonth.split("-")[0]) + '年' + Number(yearmonth.split("-")[1]) + '月</span><img src="' + projectName + 'images/ic_home_you.png" class="ic_home_you" data-content="' + jobCalendarOpt.getNextMonth(yearmonth) + '"/></div><ul class="job-after-xingqi"><ul class="job-after-xingqi"><li class="job-after-li-bgcolor">日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li class="job-after-li-bgcolor">六</li></ul><ul class="job-after-riqi">';
				for (var i = 0; i < calendarDay.length; i++) {
					var dateStr = yearmonth + "-" + ((Number(calendarDay[i]) > 9) ? Number(calendarDay[i]) : ('0' + Number(calendarDay[i])));
					frontDiv = frontDiv + '<li ';
					var classBuffer = '';
					var dataContent = '';
					if (jobCalendarOpt.existRedDay(calendarDay[i])) {
						classBuffer = "job-after-li-bgcolor";
					}
					if (jobCalendarOpt.currentDay(Number(calendarDay[i]))) {
						classBuffer = classBuffer + " yuanquan-borderlanse";
					}
					if (jobCalendarOpt.existJobDay(dateStr)) {
						dataContent = JSON.stringify(jobCalendarOpt.jobJSON(dateStr, jobList));
						if (!jobCalendarOpt.currentDay(Number(calendarDay[i]))) {
							if (jobCalendarOpt.beforeDay(dateStr)) {
								classBuffer = classBuffer + " yuanquan-yellow";
							} else {
								classBuffer = classBuffer + " yuanquan-lanse";
							}
						}
						classBuffer = classBuffer + " button-fanzhuan";
					}
					if (classBuffer != '') {
						frontDiv = frontDiv + ' class="' + classBuffer + '"';
					}
					if (dataContent != '') {
						frontDiv = frontDiv + ' data-content=\'' + dataContent + '\' data-date="' + dateStr + '"';
					}
					frontDiv = frontDiv + '>' + calendarDay[i] + '</li>';
				}
				frontDiv = frontDiv + '</ul></div>';

				var backDiv = '<div class="back"><!-- 背面内容 --><div class="beimian-riqi" id="_beimian-riqi"></div><ul class="beimian-con" id="_beimian-con"></ul><div class="beimian-djfh">点击返回</div></div>';
				var flipperHTML = '<div class="flipper">' + frontDiv + backDiv + '</div>';
				var scriptHTML = '<script type="text/javascript">';
				scriptHTML = scriptHTML + 'var content = $("#flip-container");$(".ic_home_zuo").on("click",function(){var jobCalendar = new JobCalendar($(this).attr("data-content"));jobCalendar.showCalendar();});$(".ic_home_you").on("click",function(){var jobCalendar = new JobCalendar($(this).attr("data-content"));jobCalendar.showCalendar();});';
				scriptHTML = scriptHTML + '$(".button-fanzhuan").on("click", function() {';
				scriptHTML = scriptHTML + 'if (content.hasClass("hover")) {';
				scriptHTML = scriptHTML + 'content.removeClass("hover");';
				scriptHTML = scriptHTML + '} else {';
				scriptHTML = scriptHTML + 'content.addClass("hover");';
				scriptHTML = scriptHTML + '$(".beimian-djfh").on("tap", function() {';
				scriptHTML = scriptHTML + 'content.removeClass("hover");';
				scriptHTML = scriptHTML + '});';
				scriptHTML = scriptHTML + '}';
				scriptHTML = scriptHTML + 'var dataDate=$(this).attr("data-date");if(!dataDate) return false;';
				scriptHTML = scriptHTML + 'var _dd = dataDate.split("-");;';
				scriptHTML = scriptHTML + '$("#_beimian-riqi").html(_dd[0]+"年"+_dd[1]+"月"+_dd[2]+"日");';
				scriptHTML = scriptHTML + 'var dataContent=$(this).attr("data-content");';
				scriptHTML = scriptHTML + 'var dataJSON=JSON.parse(dataContent);';
				scriptHTML = scriptHTML + 'if(dataJSON!=null&&dataJSON.length>0){';
				scriptHTML = scriptHTML + 'var _buffer = "";';
				scriptHTML = scriptHTML + 'for(var i=0;i<dataJSON.length;i++){';
				scriptHTML = scriptHTML + 'var _o=dataJSON[i];';
				scriptHTML = scriptHTML + '_buffer = _buffer + "<li>"+ _o.event +"<span class=\'beimian-time beimian-time-lanse\'>"+ _o.time+"</span></li>";';
				scriptHTML = scriptHTML + '}';
				scriptHTML = scriptHTML + '$("#_beimian-con").html(_buffer);';
				scriptHTML = scriptHTML + '}';
				
				scriptHTML = scriptHTML + '});';
				scriptHTML = scriptHTML + '</script>';
				//alert(2222);
				$('#flip-container').html(flipperHTML + scriptHTML);
				hideLoader();
			});
		},
        showInit: function (classYM, classD,jobList) {  //形参class
            $('.' + classD).html('');
            $('.' + classYM).html(Number(yearmonth.split("-")[0]) + '年' + Number(yearmonth.split("-")[1]) + '月').attr('curTime', yearmonth);
            var dataHtml = '';
            var htmlFont='</li>';
            for (var i = 0; i < calendarDay.length; i++) {
                var htmlHead = '';
                var htmlContent='';
                var html='';
                var dateStr = yearmonth + "-" + ((Number(calendarDay[i]) > 9) ? Number(calendarDay[i]) : ('0' + Number(calendarDay[i])));
                htmlHead='<li class="jobAlertsOne-bgcolor"><span>'+calendarDay[i]+'</span>';
                if(jobList.length > 0){
                    for(var j=0;j<jobList.length;j++ ){
                        if (jobList[j].jobAlerts[0].REMIND_DATE == dateStr) {  //有标记
                            //htmlContent += '<div class="jobAlertsOne-contents" REMIND_MODE="' + jobList[j].jobAlerts[0].REMIND_MODE + '"START_TIME="' + jobList[j].jobAlerts[0].START_TIME + '"END_TIME="'+jobList[j].jobAlerts[0].END_TIME+'"REMIND_NUM="'+jobList[j].jobAlerts[0]['REMIND_NUM.l']+'"><span class="jobAlertsOne-a">'+jobList[j].jobAlerts[0].REMIND_CONTENT+'</span></div>';
                            if(jobList[j].jobAlerts[0].START_TIME.split(':')[0]>12){
                                htmlContent +='<div class="jobAlertsOne-contents" REMIND_MODE="'+jobList[j].jobAlerts[0].REMIND_MODE+'" START_TIME="'+jobList[j].jobAlerts[0].START_TIME+'" END_TIME="'+jobList[j].jobAlerts[0].END_TIME+'" REMIND_NUM="'+jobList[j].jobAlerts[0]['REMIND_NUM.l']+'">' +
                                    '<span class="jobAlertsOne-p">'+jobList[j].jobAlerts[0].REMIND_CONTENT+'</span>' +
                                    '</div>'
                            }else{
                                htmlContent +='<div class="jobAlertsOne-contents" REMIND_MODE="'+jobList[j].jobAlerts[0].REMIND_MODE+'" START_TIME="'+jobList[j].jobAlerts[0].START_TIME+'" END_TIME="'+jobList[j].jobAlerts[0].END_TIME+'" REMIND_NUM="'+jobList[j].jobAlerts[0]['REMIND_NUM.l']+'">' +
                                    '<span class="jobAlertsOne-a">'+jobList[j].jobAlerts[0].REMIND_CONTENT+'</span>' +
                                    '</div>'
                            }

                        }
                    }
                    if(htmlContent==''){
                        htmlHead='<li><span>'+calendarDay[i]+'</span>';
                        html=htmlHead+htmlFont;
                    }else{
                        html=htmlHead+htmlContent+htmlFont;
                    }
                }else{
                    htmlHead='<li><span>'+calendarDay[i]+'</span>';
                    html=htmlHead+htmlFont;
                }

                dataHtml += html;
            }
            $('.' + classD).html(dataHtml);
            if($('.gongzuotai-date-con li:eq(35)').find('span').html()==''){
                $('.gongzuotai-date-con li:eq(35)').hide().nextAll().hide();
            }
            //添加点击事件
            $('.jobAlertsOne-bgcolor').bind('click',function(eve){
                //  var eTarget=eve.target;
                var _this=$(this);
                if(_this.hasClass('clickTrue')){
                    $('.dayTixing-con').hide();
                    _this.removeClass('clickTrue').siblings('li').removeClass('clickTrue');
                }else{
                    $('.dayTixing-con').show();
                    _this.addClass('clickTrue').siblings('li').removeClass('clickTrue');
                    var winWidth = $(window).width();//获取屏幕宽度
                    var winHeight = $(window).height();//获取屏幕高度
                    var dayTixingWidth = $('.dayTixing-con').outerWidth();//获取显示容器宽度
                    var dayTixingHeight = $('.dayTixing-con').outerHeight();
                    var _objHeight = _this.outerHeight() + 12;
                    var _objWidth = _this.outerWidth() + 12;
                    var oft = _this.offset();//获取点击对象位移屏幕的位置 {left:100,top:100}
                    //左右显示位置判断
                    if (winWidth - oft.left - _objWidth < dayTixingWidth) {
                        //当右边不够显示的时候在左边显示
                        oft.left -= dayTixingWidth + 12;
                        $('.dayTixing-con').addClass('showleft').removeClass('showright');
                    } else {
                        //默认显示右边
                        oft.left += _objWidth;
                        $('.dayTixing-con').addClass('showright').removeClass('showleft');
                    }
                    //上下显示位置判断
                    if (winHeight - oft.top < dayTixingHeight) {
                        //当下边不够显示的时候在上边显示
                        oft.top -= (dayTixingHeight - _objHeight);
                        $('.dayTixing-con').addClass('showtop').removeClass('showbottom');
                    } else {
                        $('.dayTixing-con').addClass('showbottom').removeClass('showtop');
                        //默认显示上面
                    }
                    $('.dayTixing-con').css(oft);
                    var duringD=''+$('.navigation-steps-day').html()+$(this).find('span').eq(0).html()+'日';
                    var len=$(this).find('div').length;
                    var textHtml='<div class="Mask"></div><div class="dayTixing-time">'+duringD+'</div>';
                    var xiang='';
                    var duringT='';
                    var timeP='';
                    for(var k=0;k<len;k++){
                        timeP=$(this).find('.jobAlertsOne-contents').eq(k).attr('START_TIME').split(':')[0];
                        xiang=$(this).find('.jobAlertsOne-contents').eq(k).find('span').text();
                        duringT=''+$(this).find('.jobAlertsOne-contents').eq(k).attr('START_TIME')+' - '+$(this).find('.jobAlertsOne-contents').eq(k).attr('END_TIME');
                        if(timeP>12){
                            textHtml+='<div class="jobAlertsOne-contents">' +
                                '<span class="jobAlertsOne-p">'+duringT+'</span>' +
                                '</div>' +
                                '<div class="gongzuotixing-xiangqing">'+xiang+'</div>'
                        }else{
                            textHtml+='<div class="jobAlertsOne-contents">' +
                                '<span class="jobAlertsOne-a">'+duringT+'</span>' +
                                '</div>' +
                                '<div class="gongzuotixing-xiangqing">'+xiang+'</div>'
                        }
                    }
                    $('.dayTixing-all').html(textHtml);
                }
            });
        },
        req: function (reqTime,classYM, classD) {
            var JobAlertsJson = {
                "b": [{
                    "deviceNo.s": commonJson.udId, //设备编号
                    "moduleId.s":workbenchJson.moduleID , //设备编号
                    "tranId.s": workbenchJson.tranId10, //交易名
                    "orgId.s": commonJson.orgId, //机构号
                    "operatorNo.s": commonJson.adminCount, //操作员
                    "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                    "workAddress.s": commonJson.workAddress, //工作地址
                    "searchDate.s": reqTime, //查询日期
                    "searchContent.s": '', //搜索内容
                    "isLoginNow.s": 'false' //是否是登陆时查询

                }]
            };
            showLoader('日历加载中...');
            IJobAlertsServiceFun(JobAlertsJson, function (msg) {
                hideLoader();
                msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
                var responseObj = JSON.parse(msg);
                var responseCode = responseObj.b;
                if (responseCode[0].results == "00") {
                    responseCode.shift();
                    var jobList =responseCode;
                    jobCalendarOpt.showInit(classYM, classD,jobList);

                }else {
                	if (responseCode[0].results == "08") {
                		var sendJson = {
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
				"moduleId.s":workbenchJson.moduleID , //设备编号
				"tranId.s": workbenchJson.tranId10, //交易名
                "orgId.s": commonJson.orgId, //机构号
                "operatorNo.s": commonJson.adminCount, //操作员
                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                "workAddress.s": commonJson.workAddress, //工作地址
                "REMIND_DATE.s": $('.seach-change-input:eq(0) input').val(), //提醒日期
                "START_TIME.s": '00:00:00',//startTime, //开始时间
                "END_TIME.s": '23:59:59',//endTime, //结束时间
                "REMIND_MODE.s": 'E',//$('.seach-change-input:eq(1) select option:selected').val(),//提醒方式
                "REMIND_USER.s": commonJson.adminCount,//提醒对象
                "REMIND_CONTENT.s": $('.tianjiagongzuotixing-con textarea').val()//提醒内容
            }]
        };
        addJobAlertListFun(sendJson, function (msg) {
            var jobCalendarC = new JobCalendar($('.navigation-steps-day').attr('curTime'));
            jobCalendarC.req( $('.navigation-steps-day').attr('curTime'), 'navigation-steps-day', 'gongzuotai-date-con');
            $(".tianjiagongzuotixing-con").hide();
        }, function (err) {
            $(".tianjiagongzuotixing-con").hide();
            funFail(err);
        });
                }else{
                	showTags({
                        'title': '提示',
                        'content': responseCode[0].message,
                        'ok': {}
                    });
                }
                }
            }, function (err) {
                hideLoader();
                funFail(err);
            });
        }
	};
	return jobCalendarOpt;
}