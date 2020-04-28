function bgLayerOpen() {
    if (!$(".bgLayer").length) {
        $('<div class="bgLayer"></div>').appendTo($("body"));
    }
    const object = $(".bgLayer");
    const w = $(document).width() + 12;
    const h = $(document).height();

    object.css({ width: w, height: h });
    object.fadeIn(1000);
}

function bgLayerClear() {
    const object = $(".bgLayer");

    if (object.length) {
        object.fadeOut(1000, function () {
            object.remove();
        });
    }
}

function openModal() {
    const modal = $("#mainModal");
    const content = $(".content");
    const marginLeft = content.outerWidth() / 2;
    const marginTop = content.outerHeight() / 2;

    if (modal.css("display") === "none") {
        modal.fadeIn(400);
        content.css({
            "margin-top": -marginTop,
            "margin-left": -marginLeft,
        });
    }
    bgLayerOpen();
}

function posting() {
    const email = $("#email").val();
    const habit = $("#habit").val();
    const bgColor = $("#select-color option:selected").val();

    $.ajax({
        type: "POST",
        url: "/habits",
        data: {
            email: email,
            habit: habit,
            bgColor: bgColor,
        },
        success: function (response) {
            if (response["result"] == "success") {
                if (email === "") {
                    alert("이메일을 입력해주세요");
                    bgLayerClear();
                    return;
                }
                const currentEmail = response["current_email"];
                window.location.href = `/habits?email=${currentEmail}`;
            } else {
                alert("서버 오류!");
            }
        },
    });

    $("#mainModal").fadeOut(400);
    bgLayerClear();
}

function closeModal() {
    $("#mainModal").fadeOut(400);
    bgLayerClear();
}
