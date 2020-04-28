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

function showError(input, message) {
    const formControl = input.parent();
    formControl.addClass("error");
    const msg = formControl.children("p");
    msg.text(message);
}
function posting() {
    const emailInput = $("#email");
    const email = $("#email").val();
    const habit = $("#habit").val();
    const bgColor = $("#select-color option:selected").val();

    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.trim())) {
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
                    const currentEmail = response["current_email"];
                    window.location.href = `/habits?email=${currentEmail}`;
                } else {
                    alert("서버 오류!");
                }
            },
        });
    } else {
        showError(emailInput, "@를 포함해서 형식에 알맞게 입력해주세요");
    }
}

function closeModal() {
    $("#mainModal").fadeOut(400);
    bgLayerClear();
}
