

  var displaylist = [];
  var orignals1=[];
  var token = localStorage.getItem("token");
  console.log(token)
  $(document).ready(
    function () {

      function setitem(i, imageurl, title_year, itemid) {
        $("#moviename_" + i).text(title_year);
        $("#img_" + i).attr("src", imageurl);

      }





      getlist(token);
     
      function getlist(token) {

        var result =recommend_Knn_user(token, 10);
        var recommendation = result.recommendation;
        //console.log(recommendation)
        displaylist = [];
        orignals1=[];
        function movieitem(nameandyear, imageurl, movieid) {
          this.nameandyear = nameandyear;
          this.imageurl = imageurl;
          this.movieid = movieid;
        }
        recommendation.forEach(function (e) {
          // console.log(e)
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
          orignals1.push({ movieid: movieid, jstr:e });
        });
        
        console.log(displaylist)
        for (var i = 0; i < 10; i++) {
          var movieunit = displaylist[i];
          // console.log(displaylist[i])
          setitem(i, movieunit.imageurl, movieunit.nameandyear, movieunit.movieid);

        };

        console.log(orignals1)
      }
      function saveitem(movieid)
      {
        console.log(orignals1)
        for(var i=0;i<orignals1.length;i++){
                var item = orignals1[i];
                if(item.movieid==movieid)
                {
                    localStorage.setItem("jstr",item.jstr);
                    // var test=localStorage.getItem('jstr');
                    // console.log(test)
                }
            }
      }



      $("#btnt0").click(function () {
        var result = displaylist[0]
        set_mark(token, [result.movieid], [5])
        getlist(token)
      });
      $("#btnf0").click(function () {
        var result = displaylist[0]
        set_mark(token, [result.movieid], [0])
        getlist(token)
      });


      $("#btnt1").click(function () {
        var result = displaylist[1]
        set_mark(token, [result.movieid],[5])
        getlist(token)
      });
      $("#btnf1").click(function () {
        var result = displaylist[1]
        set_mark(token, [result.movieid], [0])
        getlist(token)
      });


      $("#btnt2").click(function () {
        var result = displaylist[2]
        set_mark(token, [result.movieid], [5])
        getlist(token)
      });
      $("#btnf2").click(function () {
        var result = displaylist[2]
        set_mark(token, [result.movieid], [0])
        getlist(token)
      });


      $("#btnt3").click(function () {
        var result = displaylist[3]
        set_mark(token, [result.movieid], [5])
        getlist(token)
      });
      $("#btnf3").click(function () {
        var result = displaylist[3]
        set_mark(token, [result.movieid], [0])
        getlist(token)
      });


      $("#btnt4").click(function () {
        var result = displaylist[4]
        set_mark(token, [result.movieid], [5])
        getlist(token)
      });
      $("#btnf4").click(function () {
        var result = displaylist[4]
        set_mark(token, [result.movieid], [0])
        getlist(token)
      });



      $("#btnt5").click(function () {
        var result = displaylist[5]
        set_mark(token, [result.movieid], [5])
        getlist(token)
      });
      $("#btnf5").click(function () {
        var result = displaylist[5]
        set_mark(token, [result.movieid], [0])
        getlist(token)
      });



      $("#btnt6").click(function () {
        var result = displaylist[6]
        set_mark(token, [result.movieid], [5])
        getlist(token)
      });
      $("#btnf6").click(function () {
        var result = displaylist[6]
        set_mark(token, [result.movieid], [0])
        getlist(token)
      });


      $("#btnt7").click(function () {
        var result = displaylist[7]
        set_mark(token, [result.movieid], [5])
        getlist(token)
      });
      $("#btnf7").click(function () {
        var result = displaylist[7]
        set_mark(token, [result.movieid], [0])
        getlist(token)
      });

      $("#btnt8").click(function () {
        var result = displaylist[8]
        set_mark(token, [result.movieid], [5])
        getlist(token)
      });
      $("#btnf8").click(function () {
        var result = displaylist[8]
        set_mark(token, [result.movieid], [0])
        getlist(token)
      });

      $("#btnt9").click(function () {
        var result = displaylist[9]
        set_mark(token, [result.movieid], [5])
        getlist(token)
      });
      $("#btnf9").click(function () {
        var result = displaylist[9]
        set_mark(token, [result.movieid], [0])
        getlist(token)
      });



      $("#img_0").click(function () {
        var result = displaylist[0]
        var id = displaylist[0].movieid;
        console.log(id)
        saveitem(id);
        $("#recommend").load("movie.html");
      });

      
      $("#img_1").click(function () {
        var result = displaylist[1]
        var id = displaylist[1].movieid;
        console.log(id)
        saveitem(id);
        $("#recommend").load("movie.html");
      });

      $("#img_2").click(function () {
        var result = displaylist[2]
        var id = displaylist[2].movieid;
        console.log(id)
        saveitem(id);
        $("#recommend").load("movie.html");
      });

      $("#img_3").click(function () {
        var result = displaylist[3]
        var id = displaylist[3].movieid;
        console.log(id)
        saveitem(id);
        $("#recommend").load("movie.html");
      });

      $("#img_4").click(function () {
        var result = displaylist[4]
        var id = displaylist[4].movieid;
        console.log(id)
        saveitem(id);
        $("#recommend").load("movie.html");
      });

      $("#img_5").click(function () {
        var result = displaylist[5]
        var id = displaylist[5].movieid;
        console.log(id)
        saveitem(id);
        $("#recommend").load("movie.html");
      });

      $("#img_6").click(function () {
        var result = displaylist[6]
        var id = displaylist[6].movieid;
        console.log(id)
        saveitem(id);
        $("#recommend").load("movie.html");
      });

      $("#img_7").click(function () {
        var result = displaylist[7]
        var id = displaylist[7].movieid;
        console.log(id)
        saveitem(id);
        $("#recommend").load("movie.html");
      });

      $("#img_8").click(function () {
        var result = displaylist[8]
        var id = displaylist[8].movieid;
        console.log(id)
        saveitem(id);
        $("#recommend").load("movie.html");
      });

      $("#img_9").click(function () {
        var result = displaylist[9]
        var id = displaylist[9].movieid;
        console.log(id)
        saveitem(id);
        $("#recommend").load("movie.html");
      });


    }
  )

