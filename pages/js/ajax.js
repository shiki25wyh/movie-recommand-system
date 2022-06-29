const test_url = '/';
// const test_url = 'http://127.0.0.1:8000/';
function do_ajax(data, url, method) {
    var r_result;
    $.ajax({
        url: test_url+url,
        data: data,
        type: method,
        async:false,
        dataType: "json",
        contentType: 'application/json; charset=UTF-8',
        success: function (result) {
            r_result = result
            console.log(r_result)
        },
        error: function () {
            alert("error!");
            return null;
        }
    });
    return r_result;
}
function register(name,password)
{
    data = { name: name, password: password };
    data = JSON.stringify(data)
    const url = 'register';
    var result = do_ajax(data, url, 'POST');
    var return_data = { status:result.status,msg:result.msg,token:result.token };
    return return_data
}
//登录
//传入string,string
function login(name, password) {
    data = { name: name, password: password };
    data = JSON.stringify(data)
    const url = 'login';
    var result = do_ajax(data, url, 'POST');
    var return_data = { status:result.status,msg:result.msg,token:result.token };
    return return_data
}
//初始化用户
//传入string,list,list,int,int
//传回[{'itemid':###,'image_url':###,'item_content':###},{'itemid':###,'image_url':###,'item_content':###},...]
function user_init(userid, itemlist, marklist, page, step) {
    data = {
        'userid': userid,
        'itemlist':itemlist,
        'marklist':marklist,
    };
    
    const url = 'init';
    reslut = do_ajax(data, url, 'POST');
    reslut = JSON.parse(reslut);
    return reslut;
}
//评分
//传入string,list,list
function set_mark(token, movielist, scorelist) {
    function mark_uint(movieid, score) {
        this.movie_id = movieid;
        this.score = score;
    }
    unit_list = []
    for (var i = 0; i < movielist.length; i++) {
        var unit = new mark_uint(movielist[i], scorelist[i])
        unit_list.push(unit)
    }
    var send_data = { 'token': token, 'scores': unit_list }
    send_data = JSON.stringify(send_data)
    const url = 'score';
    var result = do_ajax(send_data, url, 'POST');
    var return_data = {status:result.status,msg:result.msg};
    return return_data;
}
//搜索
//传入string
// 使用数组传回，数组的内容是json，结果打印出来应该是
//[{'itemid':###,'image_url':###,'item_content':###},{'itemid':###,'image_url':###,'item_content':###},...]
// 里面的属性可以加减，不一定要跟注释一样
// result 的使用，result[i].itemid
function search_by_key(key) {
    const url = 'search/'+key;
    var result =do_ajax("", url, 'GET')
    //console.log(result);
    //result = JSON.parse(result);
    var return_data={status:result.status,msg:result.msg,recommendation:result.recommendation};
    return return_data;
}
//用户画像
//[{'itemid':###,'image_url':###,'item_content':###},{'itemid':###,'image_url':###,'item_content':###},...]
function recommend_userContent(token,k) {
    const url = 'contentbased/'+token+'/'+k;
    var result = do_ajax("", url, 'GET')
    var return_data={status:result.status,msg:result.msg,recommendation:result.recommendation};
    return return_data;
}
//Knn
//[{'itemid':###,'image_url':###,'item_content':###},{'itemid':###,'image_url':###,'item_content':###},...]
function recommend_Knn_user(token,k) {
    const url = 'knn/user/'+token+'/'+k;
    var result = do_ajax("", url, 'GET')
    var return_data={status:result.status,msg:result.msg,recommendation:result.recommendation};
    return return_data;
}
function recommend_Knn_movie(movie_id,k) {
    const url = 'knn/movie/'+movie_id+'/'+k;
    var result = do_ajax("", url, 'GET')
    var return_data={status:result.status,msg:result.msg,recommendation:result.recommendation};
    return return_data;
}
// //model
// //[{'itemid':###,'image_url':###,'item_content':###},{'itemid':###,'image_url':###,'item_content':###},...]
// function recommend_model(userid) {
//     const url = 'recommend/model.do';
//     var result = do_ajax(userid, url, 'GET')
//     reslut = JSON.parse(reslut);
//     return reslut;
// }

// //similarity
// //[{'itemid':###,'image_url':###,'item_content':###},{'itemid':###,'image_url':###,'item_content':###},...]
// function recommend_similarity(userid) {
//     const url = 'recommend/similarity.do';
//     var result = do_ajax(userid, url, 'GET')
//     reslut = JSON.parse(reslut);
//     return reslut;
// }