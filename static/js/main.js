function openModal() {
    let modal = $("#mainModal");
    let content = $(".content");
    let marginLeft = content.outerWidth() / 2;
    let marginTop = content.outerHeight() / 2;

    if (modal.css("display") === "none") {
        modal.fadeIn("slow");
        content.css({
            "margin-top": -marginTop,
            "margin-left": -marginLeft,
        });
        $(this).blur();
    }
}

function posting() {
    const email = $("#email").val();
    const habit1 = $("#habit1").val();
    const habit2 = $("#habit2").val();

    $.ajax({
        type: "POST",
        url: "/habits",
        data: {
            email: email,
            habits: [habit1, habit2],
        },
        success: function (response) {
            if (response["result"] == "success") {
                if (email === "") {
                    alert("이메일을 입력해주세요");
                    return;
                }
                if (habit1 === "" || habit2 == "") {
                    alert("로그인 성공");
                }
                window.location.href = "/habits?email=" + response["current_email"];
            } else {
                alert("서버 오류!");
            }
        },
    });

    $("#mainModal").fadeOut("slow");
}
