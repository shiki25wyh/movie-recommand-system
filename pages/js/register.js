
    $(document).ready(function () {
        $("#register").click(function () {
            var name = $("#username").val();
            var password = $("#password").val()
            var result = register(name, password)
            if (result.status == '100') {
                localStorage.setItem("token", result.token);
                window.location.href = 'init.html';
            }
            else if (result.status = 101) {
                alert("User has already registered")
            }
            else {
                alert("Register failed")
            }

        })
    })
