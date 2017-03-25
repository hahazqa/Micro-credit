/**
 * 丁宗花
 */
//基金超市（citigold-fundSupermarketsOne.html）
$(document).on("pageshow",'#citigold-fundSupermarketsOne',function(){
	//减少滑动页的方法（将swiper-slide的class值去掉，然后将其display：none）

    //初始化滑动界面
    /*var mySwiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        speed: 200,
//            height:heightRight,
        loop: true,

        // 如果需要分页器
        pagination: '.swiper-pagination'

        // 如果需要前进后退按钮
//        nextButton: '.swiper-button-next',
//        prevButton: '.swiper-button-prev',

        // 如果需要滚动条
//        scrollbar: '.swiper-scrollbar',

});*/
//弹窗
	$(".shuaixuan-tanchuang-con").css("margin-top",($(window).height()-365)/2);
	
		/*$("#jijinshuaixuan-btn").on("click",function(){
	   		$("#shuaixuan-tanchuang").show();
	   		$("#shuaixuan-tanchuang").on("click",function(){
	   			var evt = event.srcElement ? event.srcElement : event.target;    
		    if(evt.id == 'shuaixuan-tanchuang' ){
		    	 $('#shuaixuan-tanchuang').hide();
		    } 
		    else {
		        $('#shuaixuan-tanchuang').show();
		    }   
	   		});
	   		
	   	});*/

});/*
//基金超市（citigold-fundSupermarketsOne.html）
$(document).on("pageshow",'#citigold-fundSupermarketsOne',function(){
	//减少滑动页的方法（将swiper-slide的class值去掉，然后将其display：none）

    //初始化滑动界面
    var mySwiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        speed: 200,
//            height:heightRight,
        loop: true,

        // 如果需要分页器
        pagination: '.swiper-pagination'

        // 如果需要前进后退按钮
//        nextButton: '.swiper-button-next',
//        prevButton: '.swiper-button-prev',

        // 如果需要滚动条
//        scrollbar: '.swiper-scrollbar',

});

});
//基金超市（citigold-fundSupermarketsTwo.html）
$(document).on("pageshow",'#citigold-fundSupermarketsTwo',function(){
	
	$(".expand-collapse-title").on("click",function(){
		if($(this).siblings(".zhankai-neirong").css("display")=="none"){
			$(this).siblings(".zhankai-neirong").show();
			$(this).children(".expand-collapse-zhankai").hide();
			$(this).children(".expand-collapse-shouqi").show();
		}else{
			$(this).siblings(".zhankai-neirong").hide();
			$(this).children(".expand-collapse-zhankai").show();
			$(this).children(".expand-collapse-shouqi").hide();
		}
	});
});
//影像复用（citigold-video.html）
$(document).on("pageshow",'#citigold-video',function(){
    //为每一条数据添加class=‘click'
	$(".box-rows").bind("click", this, function() {
		console.log(this.className);
		if ($(this).hasClass('click')) {
			$(this).removeClass('click');
			$('#buy_next').removeClass('btn_next');
		} else {
			//遍历每一条数据恢复初始状态
			$('.box-rows').each(function() {
				//console.log(this);
				if ($(this).hasClass('click')) {
					$(this).removeClass('click');
					$('#buy_next').addClass('btn_next');
				}
			});
			$(this).addClass('click');
			$('#buy_next').addClass('btn_next');
		}

	});
});
//基金定投确认签名（citigold-confirmationSignature.html）
$(document).on("pageshow",'#citigold-confirmationSignature',function(){
       //初始化签名方法
    signature.init({
        div: $('#qianM'), //签名容器
        finishBtn: $("#qianOK"), //完成签名按钮
        clearBtn: $("#clear-botton"), //清除签名按钮
        lineColor: '#000000', //线条颜色
        lineWidth: 3, //线条粗细
        finish: function(data) { //签名完成回调函数
        	
        }
        });
});*/
/*//基金购买确认签名（citigold-confirmationSignature.html）
$(document).on("pageshow",'#citigold-confirmationSignatureTwo',function(){
       //初始化签名方法
    signature.init({
        div: $('#qianM'), //签名容器
        finishBtn: $("#qianOK"), //完成签名按钮
        clearBtn: $("#clear-botton"), //清除签名按钮
        lineColor: '#000000', //线条颜色
        lineWidth: 3, //线条粗细
        finish: function(data) { //签名完成回调函数
        	
        }
        });
});*/
//调查问卷（citigold-diaocawenjuan.html）
/*$(document).on("pageshow",'#citigold-diaocawenjuan',function(){
	$(".diaocawenjuan-ul-con>li").on("click",function(){
		if($(this).children(".diaocawenjuan-yes").css("display")=="none"){
			$(this).children(".diaocawenjuan-yes").show();
			$(this).siblings("li").children(".diaocawenjuan-yes").hide();
		}
});
	
	$(".diaocawenjuan-ul>li>span").on("click",function(){
		$(this).addClass("diaocawenjuan-duigou").parent("li").siblings("li").children("span").removeClass("diaocawenjuan-duigou");
	});
});*/