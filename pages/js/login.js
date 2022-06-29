
    $(document).ready(function(){
        $("#login").click(function()
        {
            var name=$("#username").val(); 
            var password=$("#password").val()
            var result=login(name,password)
            if(result.status=='110')
            {
                window.location.href='index.html';
                localStorage.setItem("token",result.token);
  
            }
            else
            {
                alert("login failed")
            }

        })
    })
