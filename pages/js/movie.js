
  $(document).ready(
    function () {
      var jstr = localStorage.getItem("jstr");
      var jsondata = JSON.parse(jstr)
      console.log(jsondata)
      $("#m_name").text(jsondata.NAME);
      $("#m_story").text(jsondata.STORYLINE);
      $("#m_director").text(jsondata.DIRECTORS);
      $("#m_region").text(jsondata.REGIONS);
      $("#m_act").text(jsondata.ACTORS);
      $("#m_genre").text(jsondata.GENRES);
      $("#m_release").text(jsondata.RELEASE_DATE);
      $("#m_lan").text(jsondata.LANGUAGES);
      $("#mainimg").attr("src", jsondata.COVER)

      function setmovieitem(i, imageurl, title_year, itemid) {
        $("#moviename_" + i).text(title_year);
        $("#img_" + i).attr("src", imageurl);

      }
      var movie_id = jsondata.MOVIE_ID
      getmovielist(token);
      function getmovielist(token) {
        var result = recommend_Knn_movie(movie_id, 5);
        var recommendation = result.recommendation;
        //console.log(recommendation)
        displaylist = [];
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
        });
        displaylist.push(new movieitem("", "./img/empty.jpg", ""));
        // console.log(displaylist)
        for (var i = 0; i < 5; i++) {
          var movieunit = displaylist[i];
          // console.log(movieunit)
          setmovieitem(i, movieunit.imageurl, movieunit.nameandyear, movieunit.movieid);

        };





        $("#btnt0").click(function () {
          var result = displaylist[0]
          set_mark(token, [result.movieid], [5])
          alert("successfully scored")
        });
        $("#btnf0").click(function () {
          var result = displaylist[0]
          set_mark(token, [result.movieid], [0])
          alert("successfully scored")
        });


        $("#btnt1").click(function () {
          var result = displaylist[1]
          set_mark(token, [result.movieid], [5])
          alert("successfully scored")
        });
        $("#btnf1").click(function () {
          var result = displaylist[1]
          set_mark(token, [result.movieid], [0])
          alert("successfully scored")
        });


        $("#btnt2").click(function () {
          var result = displaylist[2]
          set_mark(token, [result.movieid], [5])
          alert("successfully scored")
        });
        $("#btnf2").click(function () {
          var result = displaylist[2]
          set_mark(token, [result.movieid], [0])
          alert("successfully scored")
        });



        $("#btnt3").click(function () {
          var result = displaylist[3]
          set_mark(token, [result.movieid], [5])
          alert("successfully scored")
        });
        $("#btnf4").click(function () {
          var result = displaylist[3]
          set_mark(token, [result.movieid], [0])
          alert("successfully scored")
        });



        $("#btnt4").click(function () {
          var result = displaylist[4]
          set_mark(token, [result.movieid], [5])
          alert("successfully scored")
        });
        $("#btnf4").click(function () {
          var result = displaylist[4]
          set_mark(token, [result.movieid], [0])
          alert("successfully scored")
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





      }




    })
