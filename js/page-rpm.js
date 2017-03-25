//rpm-home页面(GET请求,iframe加载页面)  by liangjk
// $(document).on("pageshow", '#rpm-home', function() {
// 	showLoader('加载中...');
// 	// var rpmUrl = "https://112.95.233.35/rpm/rpm/rpm/mobile/custInfoQuery.jsp?username=sysadmin&aaaa";

// 	// $('#rpm-home').append("<iframe name='crmFrame' width='100%' height='100%'></iframe>"
// 	// 		+ "<form id='crmForm' action='" + rpmUrl + "' target='crmFrame' method='post'></form>"
// 	// 	);
// 	// $("#crmForm").submit();
// 	// $("#crmForm").remove();

// 	// $.ajax({
// 	// 	url: rpmUrl,
// 	// 	method: 'GET',
// 	// 	dataType: 'html',
// 	// 	success: function(data){
// 	// 		$('#rpm-test').html("TESTTESTTESTTESTTEST");
// 	// 		console.log(data);
// 	// 		// $('#rpm-content').html(data);
// 	// 	},
// 	// 	error: function(err){
// 	// 		console.log(err);
// 	// 	}
// 	// });

// 	//请求RPM域名
// 	CRMAddress('', function(msg) {
// 		var rpmUrl = msg + "rpm/rpm/rpm/mobile/custInfoQuery.jsp?username=sysadmin&aaaa";
// 		//超时处理定时器60s没加载完成则返回首页
// 		timeout_callback = setTimeout(timeoutCallback, 60000);

// 		// var rpmFrame = document.createElement('iframe');
// 		var rpmFrame = document.getElementById("rpmFrame");
// 		rpmFrame.onload = function(){
// 			clearTimeout(timeout_callback);
// 			hideLoader();
// 			//获取iframe的document
// 			var doc = rpmFrame.contentDocument;
// 			var body = doc.getElementsByTagName('body')[0];
// 			// var backBtn = $(body).find('a.head-all');
// 			// console.log(backBtn);
// 			//为首页和退出按钮委托绑定事件
// 			$(body).on('click', '[action="backHome"]', function(){
// 				backToHome();
// 			});

// 			$(body).on('click', '[action="backCustInfoQuery"]', function(){
// 				backToCustInfoQuery();
// 			});
// 		};

// 		//开始加载定价系统页面
// 		rpmFrame.src = rpmUrl;
		
// 	});
// });

$(function(){
var timeout_callback = null;
// var rpmUrl = "https://112.95.233.35/rpm/rpm/rpm/mobile/custInfoQuery.jsp?aaaa";
// var rpmUrl = "https://112.95.233.35/rpm/rpm/businessScena_mobileCustInfoQuery.action?aaaa";
var rpmUrl = "rpm/rpm/businessScena_mobileCustInfoQuery.action?aaaa";
// var rpmUrl = "https://meap.4001961200.com:443/rpm/rpm/businessScena_mobileCustInfoQuery.action?aaaa";

//rpm-home页面(POST请求,提交表单)  by liangjk
$(document).on("pageshow", '#rpm-home', function() {
	showLoader('加载中...');
	CRMAddress('', function(msg) {
		var url = msg + rpmUrl;
		$('#rpmForm').attr('action', url);
		if(commonJson.adminCount){
			$('#userId').val(commonJson.adminCount); //登陆账号
		}
		if(commonJson.udId){
			$('#deviceId').val(commonJson.udId); //设备编号
		}
		if (commonJson.rpmUserId) {		//上送rpm用户ID否则送LOS用户ID
			$('#rpmForm #createUser').val(commonJson.rpmUserId);
		} else if(commonJson.losUserId){
			$('#rpmForm #createUser').val(commonJson.losUserId);
		}

		var rpmFrame = document.getElementById("rpmFrame");
		rpmFrame.onload = function(){
			clearTimeout(timeout_callback);
			hideLoader();
			//获取iframe的document
			var doc = rpmFrame.contentDocument;
			var body = doc.getElementsByTagName('body')[0];
			//为首页和退出按钮委托绑定事件
			$(body).on('click', '[action="backHome"]', function(){
				backToHome();
			});
			$(body).on('click', '[action="backCustInfoQuery"]', function(){
				backToCustInfoQuery();
			});
		};

		//超时处理定时器60s没加载完成则返回首页
		timeout_callback = setTimeout(timeoutCallback, 60000);

		//提交表单加载定价系统页面
		$("#rpmForm").submit();
		$("#rpmForm").hide();
	});
});

function backToHome(){
	$.mobile.changePage('../main.html', {
        reverse: true
    });
}

function backToCustInfoQuery(){
	timeout_callback = setTimeout(timeoutCallback, 60000);
	showLoader('加载中...');
	$("#rpmForm").submit();
}

//超时回调
function timeoutCallback(){
	hideLoader();
	showTags({
        'title': '提示',
        'content': '加载超时',
        'ok': {
            fun: function () {
                backToHome();
            }
        }
    });
}

})();