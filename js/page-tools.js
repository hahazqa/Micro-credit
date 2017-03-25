/*
 * 延迟点击处理
 * 参数：
 *     divID:触发事件的标签ID
 *     time:延迟时间（单位：秒）
 * 使用方法：
 *      var timeout = new Timeout('divid',10);
 *      timeout.blocking('spanid');//spanid:延迟过程中显示ID
 */
var Timeout = function() {
	var divID = ""; //标签ID
	var time = 30; //延迟时间
	var len = arguments.length;
	if (len == 1) {
		divID = arguments[0];
	} else if (len == 2) {
		divID = arguments[0];
		time = arguments[1];
	}
	var blockID = divID + '_block';
	var divObj = document.getElementById(divID);
	var blockID_top = 0;
	var blockID_left = 0;
	var blockID_width = '100%';
	var blockID_heigth = '100%';
//	if (divObj != null) {
//		blockID_top = (divObj.style.top || (divObj.offsetTop + document.body.scrollTop)) + "px";
//		blockID_left = (divObj.style.left || divObj.offsetLeft);
//		blockID_width = (divObj.style.width || divObj.offsetWidth || divObj.scrollWidth);
//		blockID_heigth = (divObj.style.height || divObj.offsetHeight || divObj.scrollHeight);
//	}
//	alert(blockID_top + " 0" + blockID_left + "| " + blockID_width+'0'+blockID_heigth);
	var block = '<div id="' + blockID + '" style="position:fixed; bottom:220px; left:50%; border:1px solid #FFFFFF; margin-left:-150px; z-index:1000000000; width:300px; height:40px; line-height:40px; text-align:center; background:#f5f5f5; filter:alpha(opacity=30); opacity:0.3;display: none;">';
	var intervalID = "";
	var timeoutOpt = {
		blocking: function(spanID) {
			if (divObj != null) {
				if (document.getElementById(blockID) != null) {
					document.getElementById(blockID).remove();
				}
				divObj.outerHTML = divObj.outerHTML + block;
				document.getElementById(blockID).style.display = "block";
				intervalID = setInterval(function() {
					var spanObj = document.getElementById(spanID);
					if (spanObj) {
						if (time <= 0) {
							document.getElementById(blockID).style.display = "none";
							spanObj.innerHTML = "";
							clearInterval(intervalID);
						} else {
							spanObj.innerHTML = "(请等待 " + time + " 秒)";
							time--;
						}
					}
				}, 1000);
			}
		},
		getIntervalID:function(){
			return intervalID;
		}
	};
	return timeoutOpt;
}