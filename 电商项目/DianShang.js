window.onload=function () {
    getBannerList();//轮播图列表
    hotsaleApi();//热卖单品数据
    guessLikeApi();
    msApi();//秒杀专区数据
    //搜索框
    // ajax("get","aaa.json",function (res) {
    //     console.log(res)
    // },true)
    var searchInput=document.getElementById('searchInput');
    searchInput.addEventListener("keyup",showkeyword,false);
    searchInput.addEventListener("blur",hidekeyword,false);
    searchInput.addEventListener("focus",showkeyword,false);
//xxx.addEventListener(a,b,c)xxx:为对象，a:监听事件，b:监听后的动作c:布尔值，是否是捕获型，默认 false

    function showkeyword() {
        if(searchInput.value !==''){
            getSuggest()
            document.getElementById('search-suggest').style.display="block";
        }


    }

    function hidekeyword() {
        document.getElementById('search-suggest').style.display="none";

    }

    function bannerOption() {

        var swiper = document.getElementsByClassName("swiper")[0];
        var swiperItem = swiper.getElementsByClassName("swiper-item");
        var prev=document.getElementsByClassName("prev")[0];
        var next=document.getElementsByClassName("next")[0];
        var indicators=document.getElementsByClassName("indicator");
        var index=0;
        //设置轮播图的透明度和移动
        for(var i=0;i<swiperItem.length;i++){
            if(index == i){
                swiperItem[i].style.opacity=1;
            }else{
                swiperItem[i].style.opacity=0;
            }
            swiperItem[i].style.transform="translateX("+(-i*swiperItem[0].offsetWidth)+"px)"/*offsetWidth:获取元素的widt+左右padding+左右border*/
        }
        //给圆点添加点击事件
        for(var k=0;k<indicators.length;k++){
            indicators[k].onclick=function () {
                clearInterval(timer);
                var clickIndex= parseInt(this.getAttribute("data-index"));
                index=clickIndex;
                changeImg();
            }
        }
        prev.onclick=function () {
            clearInterval(timer);
            index--;
            changeImg();
        }
        next.onclick=function () {
            clearInterval(timer);
            index++;
            changeImg();
        }
        swiper.addEventListener("mouseover",function () {
            clearInterval(timer);
        },false)
        swiper.addEventListener("mouseout",function () {
            autoChange();
        },false)
        //更换图片
        function changeImg() {
            if(index<0)
                index=swiperItem.length-1
            else if(index>swiperItem.length-1)
                index=0
            for(var j=0;j<swiperItem.length;j++)
                swiperItem[j].style.opacity=0;
            swiperItem[index].style.opacity=1;
            setIndicatorson()
        }
        //设置点激活状态
        function setIndicatorson() {
            for (var i=0;i<indicators.length;i++){
                indicators[i].classList.remove("on")
            }
            indicators[index].classList.add("on")
        }
        autoChange();
        //自动播放
        function autoChange() {
            timer =setInterval(function () {
                index++;
                changeImg();
            },2500)
        }
    }//轮播图操作
    function getSuggest() {
        ajax('get',"suggest.json",function (res) {
            if (res.code==0){
                var suggest_list=document.getElementById("search-suggest");
                var data = res.data;
                // console.log(data);
                var str='';
                for(var i=0;i<data.length;i++){
                    str += "<li>"+data[i].suggestname+"</li>"
                }
                suggest_list.innerHTML= str;
                //console.log(str)
            }
        },true)
    }//获取提示列表
    function getBannerList() {
        ajax('get',"swiper.json",function (res) {
            console.log(res);
            if (res.code==0){
                var data=res.data;
                //轮播图列表循环，动态加入容器
                var swiper=document.getElementById("swiper");
                var str='';
                for (i=0;i<data.length;i++){
                    str += '<li class="swiper-item"><a href="#"><img src="'+data[i].banner_img+'"></a>' + '</li>';
                }
                swiper.innerHTML= str;
                //圆点列表循环，循环插入容器
                var indicators=document.getElementById("indicators")
                var str2="";
                for (i=0;i<data.length;i++){
                    if(i == 0){
                        str2 +='<div class="indicator " data-index="'+i+'"></div>'
                    }else{
                        str2 += '<div class="indicator " data-index="'+i+'"></div>';
                    }

                }
                indicators.innerHTML = str2;
                bannerOption();
            }
        },true)
    }// 获取轮播图列表
    function msApi() {
        ajax("get","miaosha.json",function (res) {
            console.log(res);
            if (res.code == 0){
                var cd_time = res.data.ms_time;
                var good_list=res.data.goods_list;
                countDown(cd_time);
                var miaoshaList=document.getElementById("miaoshaList");
                var str='';
                for (var i=0;i<good_list.length;i++){
                    str+='<div class="ms_item">' +
                        '<a href="" class="ms_item_lk">' +
                        '<img src="'+good_list[i].good_img+'" alt="" class="ms_item_img">' +
                        '<p class="ms_item_name">'+good_list[i].name+'</p>' +
                        '<div class="ms_item_buy">' +
                        '<span class="progress"><span class="progress-bar" style="width: '+good_list[i].progress+'"%></span> </span>' +
                        '<span class="buy_num">已抢'+good_list[i].progress+'%</span>' +
                        '</div>' +
                        '<div class="ms_item_price clearfix">' +
                        '<span class="cm-price new-price">'+good_list[i].new_price+'</span>' +
                        '<span class="cm-price old-price">'+good_list[i].old_price+'</span>' +
                        '</div>' +
                        '</a>' +
                        '</div>'
                }
                miaoshaList.innerHTML= str;
            }
        },true)
    }//获取秒杀专区数据

    function countDown(t) {
        var ms_time = t;
        var ms_timer = setInterval(function () {
            if (ms_time < 0){
                clearInterval(ms_timer);
            }
            else{
                calTime(ms_time);
                ms_time--;
            }
        },1000);
    }//秒杀倒计时
        function calTime( time) {
            var hour=Math.floor(time / 60 / 60);
            var minute= Math.floor(time  / 60 % 60);
            var second=Math.floor(time  % 60 );
            hour=formatTime(hour);
            minute=formatTime(minute);
            second=formatTime(second);

            document.getElementsByClassName("cd_hour")[0].innerHTML=hour;
            document.getElementsByClassName("cd_minute")[0].innerHTML=minute ;
            document.getElementsByClassName("cd_second")[0].innerHTML=second;
        }
        function formatTime(t) {
            if (t<10){
                t="0"+t;
            }
            return t;
        }

    function hotsaleApi() {
       ajax("get","hotsale.json",function (res) {
           console.log(res);
           if(res.code==0){
               var list=res.data;
               var hotsaleList= document.getElementById("hotsaleList");
               var str='';
               for (i=0;i<list.length;i++){
                   str += '<li class="bs_item item">' +
                          '<a href="">' +
                          '<img src="'+list[i].good_img+'" alt="" class="item-img">' +
                          '<p class="title">'+list[i].name+'</p>' +
                          '<div class="line-2 clearfix">' +
                          '<span class="comment">评论<em>'+list[i].conmentNum+'</em></span>' +
                          '<span class="collect">收藏<em>'+list[i].collectNum+'</em></span>' +
                          '</div>' +
                          '<div class="line-3">' +
                          '<span class="strong">'+list[i].new_price+'</span>' +
                          '<span class="price-through">'+list[i].old_price+'</span>' +
                          '<span class="sell">月销<em>'+list[i].saleNum+'</em></span>' +
                          '</div>' +
                          '</a>' +
                          '</li>'
               }
               hotsaleList.innerHTML=str;
           }
       },true)
   }//获取热卖单品列表
    function guessLikeApi() {
        ajax("get","guessLike.json",function (res) {
            console.log(res);
            if (res.code == 0){
                var guessLike=document.getElementById("gl");
                var data=res.data;
                var str='';
                for (var i=0;i<data.length;i++){
                    str+='<li class="Like-item item">' +
                        '<a href="">' +
                        '<img src="01.jpg" alt="" class="item-img">' +
                        '</a>' +
                        '<p class="title">'+data[i].img+'</p>' +
                        '<div class="line-3">' +
                        '<span class="strong">'+data[i].new_price+'</span>' +
                        '<span class="sell">月销'+data[i].saleNum+'笔</span>' +
                        '</div>\n' +
                        '<a href="" class="item-more">发现更多相似宝贝</a>' +
                        '</li>'
                }
                guessLike.innerHTML= str;
            }
        },true)
    } //猜你喜欢单品列表
    document.getElementById("loadMore").onclick=function () {
        ajax("get","jiazai.json",function (res) {
            var liNode=document.createElement("li");
            liNode.setAttribute("class","Like-item item");
            var li=document.getElementById("gl")
            var str='';
            str+=' <a href="">' +
                '<img src="'+res.good_img+'" alt="" class="item-img">' +
                '</a>' +
                '<p class="title">'+res.name+'</p>' +
                '<div class="line-3">' +
                '<span class="strong">'+res.price+'</span>' +
                '<span class="sell">月销'+res.monSell+'笔</span>' +
                '</div>'
            liNode.innerHTML=str;
            document.getElementById('gl').appendChild(liNode);
        },true)
    }//加载更多功能实现
}
window.onscroll=function () {
    scrollShowButtom();
    var winPos=document.documentElement.scrollTop||document.body.scrollTop;//获取滚动距离
    var hotSale=document.getElementById("hotsale");
    var hotHeight= hotSale.offsetTop+hotSale.offsetHeight;

    if (winPos<hotSale.offsetTop){
        addOn(0);
    }else if (winPos>= hotSale.offsetTop&& winPos< hotHeight) {
        addOn(1)
    }else
        addOn(2);
}
function addOn(index) {
    var tool=document.getElementsByClassName("tool")[0];
    var toolItem=tool.getElementsByTagName("a");
    for (i=0 ;i<toolItem.length;i++){
        toolItem[i].classList.remove("on");
    }
    toolItem[index].classList.add("on");
}//添加菜单活动状态

function scrollShowButtom() {
    var top=document.documentElement.scrollTop||document.body.scrollTop;
    if (top>300){
        document.getElementById("goTop").style.display="block";
    }else
        document.getElementById("goTop").style.display="none";
}//显示返回顶部按钮

function goTop() {
    var TopTimer=setInterval(function () {
        var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
        var iSpeed=Math.floor(-scrollTop/8);
        if (scrollTop==0){
            clearInterval(TopTimer);
        }
        document.documentElement.scrollTop = document.body.scrollTop=scrollTop + iSpeed;
    },30)

}//返回顶部