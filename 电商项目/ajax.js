function creatXmlHttpRequest() {
    var xmHttp;
    if (window.XMLHttpRequest){
        xmHttp= new XMLHttpRequest();
    }else {
        xmHttp= new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmHttp;
}
function ajax(method,url,success,b) {
    var xmlHttp= creatXmlHttpRequest();
    xmlHttp.open(method,url,b);//服务器建立连接
    xmlHttp.send();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4  &&  this.status == 200){
            success(JSON.parse(this.responseText));
        }
    }
}