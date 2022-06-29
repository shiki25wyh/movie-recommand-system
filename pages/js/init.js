
    var rows = 7;
    var columns = 7;
    var displaylist = [];
    // var token="MTY0ODk4NDQ3MC40NTQ2Nzc6ZDZkZWExM2NiNDNiMWVjZjA4MTVkNjNhZjY5NTM4NDEzZWUzZWM3Mw==";
    // localStorage.setItem("token","MTY0ODk4NDk3OC4zNzY5MTk6ZDk0OTY2ODE1MjU2MTYxZjI4YjQ3YzUzNDVhZmMyYjU3MzYzMTY5NA==",30)
    var token = localStorage.getItem("token");
    console.log(token)
    $(document).ready(
        function () {
            var vh = 200 / rows;
            for (var i = 0; i < rows; i++) {
                var columnshtml = '<div class="columns" style="width:95%;height:' + vh + 'vh;">';
                for (var n = 0; n < columns; n++) {
                    var innerhtml = $("#samplecard").html()
                    innerhtml = '<div class="card item" id="card_' + i + "_" + n + '" style="border-style:solid;border-width:2px;height:100%;background-image:url(./img/empty.jpg);background-size:cover;">' + innerhtml + '</div>'
                    columnshtml = columnshtml + '<div class="column" >' + innerhtml + '</div>';
                }
                columnshtml += '</div>';
                //console.log(columnshtml);
                $("#maindiv").append(columnshtml);
            }
            var cardhtml = $('#samplecard').html();


            async function setitem(row, column, imageurl, title_year, itemid) {
                $("#card_" + row + "_" + column).find(".img").attr("src",imageurl);
                //$("#card_" + row + "_" + column).css("background-image", "url(" + imageurl + ")");
                $("#card_" + row + "_" + column).find('.word').text(title_year);
                $("#card_" + row + "_" + column).find('.itemid').text(itemid);
                $("#card_" + row + "_" + column).find('.imageurl').text(imageurl);
            }
            getrecommandlist(token);
            function getrecommandlist(token) {
                k = rows * columns + 4;
                var result = recommend_userContent(token, k);
                var recommendation = result.recommendation;
                //console.log(recommendation)
                displaylist = [];
                function movieitem(nameandyear, imageurl, movieid) {
                    this.nameandyear = nameandyear;
                    this.imageurl = imageurl;
                    this.movieid = movieid;
                }
                recommendation.forEach(function (e) {
                    console.log(e)
                    var json = JSON.parse(e);
                    if (json.hasOwnProperty("COVER")) {
                        imageurl = json.COVER;
                        if (imageurl == "") {
                            imageurl = "./img/empty.jpg"
                        }
                    }
                    var releasedate = json.RELEASE_DATE;
                    if (releasedate != "")
                        releasedate = "(" + releasedate + ")"
                    var nameandyear = json.NAME + releasedate;
                    var movieid = json.MOVIE_ID
                    displaylist.push(new movieitem(nameandyear, imageurl, movieid));
                });
                displaylist.push(new movieitem("", "./img/empty.jpg", ""));
                console.log(displaylist)
                for (var i = 0; i < rows; i++) {
                    for (var n = 0; n < columns; n++) {
                        var movieunit = displaylist[i * columns + n];
                        setitem(i, n, movieunit.imageurl, movieunit.nameandyear, movieunit.movieid);
                    }
                }
            }
            var step = 1;
            var page = 1;
            var animatestep = 1;
            $(".item").click(
                function () {
                    if (step > 4)
                        return;
                    var itemid = $(this).find(".itemid").text();
                    if (itemid == "")
                        return;
                    var title = $(this).find(".word").text();
                    var imageurl = $(this).find(".imageurl").text();
                    var movieid = $(this).find(".itemid").text();
                    console.log(itemid, title, imageurl)
                    var $target = $("#step" + step)
                    $target.hide()
                    $target.css("background-image", "url(" + imageurl + ")")
                    $target.html($(this).html());
                    $target.show(500);
                    var row = -1;
                    var column = -1;
                    if (step < 4) {
                        var id = $(this).attr("id");
                        //console.log(id);
                        var temp = id.split("_")
                        row = temp[1];
                        column = temp[2];
                        console.log("row:" + row + "col:" + column)
                    }

                    $(this).hide(500, function () {
                        var index = rows * columns + animatestep;
                        console.log(index)
                        var movieunit = displaylist[index];
                        console.log(movieunit);
                        setitem(row, column, movieunit.imageurl, movieunit.nameandyear, movieunit.movieid);
                        $(this).show(500);
                        animatestep++;


                    });

                    if (page == 4 && step == 4)
                        $(".button").text("finish");
                    step++;
                    if (step == 5) {
                        $(".button").attr('disabled', false);
                    }
                    itemlist.push(movieid);
                    marklist.push(10);

                }
            )
            var itemlist = [];
            var marklist = [];
            $(".button").click(function () {
                if (page == 4 && step == 5) {
                    window.location.href = "index.html"
                }
                page++;
                if (page >= 5)
                    return;
                $(".result").each(function () {
                    $(this).html("");
                    $(this).css("background-image", "url(./img/empty.jpg)")
                });
                set_mark(token, itemlist, marklist)
                step = 1;
                animatestep = 1;
                $(this).attr('disabled', true);
                itemlist = [];
                marklist = [];
                getrecommandlist(token);

            })
        }
    )
