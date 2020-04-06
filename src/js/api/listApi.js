var xmlhttp = null;
if (window.XMLHttpRequest) {
    // code for modern browsers
    xmlhttp = new XMLHttpRequest();
  } else {
    // code for old IE browsers
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
 }

 /**
  * Factory function to hit api and return results
  * @param {} listReq 
  */
export function listApi (listReq){
    var obj ={};
     obj.getList = new Promise(
        function (resolve, reject) {
            let xhr = xmlhttp;
            var url = listReq.url;
            if(listReq.request.q && listReq.request.q.length){
                url += '?'+listReq.request.q;
            }
            xhr.open(listReq.method,url,true);

            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (xhr.status == 200) {
                    resolve(JSON.parse(xhr.response))
                }
              };
              xhr.onerror = function(){
                  reject("Some error occured!")
              }
            xhr.send();
        }
    );
    return obj;
};
