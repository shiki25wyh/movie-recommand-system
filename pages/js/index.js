


    function onClickMeun() {
        document.getElementById("meun").classList.toggle("change");
        document.getElementById("mobile-nav").classList.toggle("change");
        document.getElementById("menu-bg").classList.toggle("change-bg");
    }






    $(document).ready(function () {
        $("#start").click(function () {
            $("#recommend").load("recommend.html");
            $("#container").remove()
        });
        $("#Recommend").click(function () {
            $("#recommend").load("recommend.html");
            $("#container").remove()
        });
        $("#Recommend2").click(function () {
            $("#recommend").load("recommend.html");
            $("#container").remove()
        });
        var timer
        var displaylist = [];
        $("#searchinput").on("input", function () {
            $("#select").hide();
        })
        var orignals=[]
        $("#searchb").click(function () {
            orignals = [];
            var value = $("#searchinput").val();
            if (value == "")
                return;
            result = search_by_key(value)
            console.log(result)
            var recommendation = result.recommendation;
            if (recommendation == null)
                return;
            $("#select").html("");
            $("#select").append('<option value="default">please select</option>');
            recommendation.forEach(function (e) {
                console.log(e)
                var json = JSON.parse(e);
                var releasedate = json.RELEASE_DATE;
                var nameandyear = json.NAME + releasedate;
                var movieid = json.MOVIE_ID

                orignals.push({ movieid: movieid, jstr:e });
                
               
                $("#select").append("<option value='" + movieid + "'>" + nameandyear + "</option>");
                $("#select").css("display","block");
            });
            console.log(orignals)
        })
        $("#select").change(function(){
            var id=$(this).val()
            console.log(id);
            //console.log(orignals);
            for(var i=0;i<orignals.length;i++){
                var item = orignals[i];
                if(item.movieid==id)
                {
                    localStorage.setItem("jstr",item.jstr);
                    // var test=localStorage.getItem('jstr');
                    // console.log(test)
                    $("#select").hide();
                    $("#recommend").load("movie.html");
                }
            }
        })



    });
