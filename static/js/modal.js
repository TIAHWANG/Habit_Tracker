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

// 습관 등록 모달
function openAddHabits() {
    const modal = $("#addHabits");
    const content = $("#addHabits .addHabits__content");
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

function closeAddHabits() {
    $("#addHabits").fadeOut(400);
    bgLayerClear();
}

function addHabits() {
    const currentEmail = location.search.split("=")[1];
    const habit = $("#habit").val();
    const color = $("#add__select-color option:checked").val();

    $.ajax({
        type: "POST",
        url: "/habits-add",
        data: {
            email: currentEmail,
            habit: habit,
            color: color,
        },
        success: function (response) {
            if (response["result"] == "success") {
                window.location.reload();
            } else {
                alert("서버 오류!");
            }
        },
    });
}

// 습관 수정/삭제 모달
$("#external-events div").click((e) => {
    const modal = $("#multiModal");
    const content = $("#multiModal .multiModal__content");
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

    // 처음 설정한 habit 색깔 select box에 뜨게 설정
    const colorName = e.target.classList[1];

    if (e.target.classList[1] === "deep-blue") {
        $("#select-color option:eq(0)").prop("selected", true);
    }
    if (e.target.classList[1] === "green") {
        $("#select-color option:eq(1)").prop("selected", true);
    }
    if (e.target.classList[1] === "orange") {
        $("#select-color option:eq(2)").prop("selected", true);
    }
    if (e.target.classList[1] === "yellow") {
        $("#select-color option:eq(3)").prop("selected", true);
    }
    if (e.target.classList[1] === "beige") {
        $("#select-color option:eq(4)").prop("selected", true);
    }
    if (e.target.classList[1] === "pink") {
        $("#select-color option:eq(5)").prop("selected", true);
    }
    if (e.target.classList[1] === "burgendy") {
        $("#select-color option:eq(6)").prop("selected", true);
    }
    if (e.target.classList[1] === "grey") {
        $("#select-color option:eq(7)").prop("selected", true);
    }

    const currentEmail = location.search.split("=")[1];

    // 모달창에 원래 습관 이름 보이기
    const targetName = e.target.innerHTML;
    $("#habitName").val(targetName);

    // 습관 삭제
    $("#delete-btn").click((e) => {
        $.ajax({
            type: "POST",
            url: "/habits-delete2",
            data: {
                email: currentEmail,
                title: targetName,
            },
            success: () => {
                $("#multiModal").fadeOut(400);
                bgLayerClear();
                window.location.reload();
            },
        });
    });

    // 습관 수정사항 변경
    $("#save-btn").click(() => {
        const newName = $("#habitName").val();
        const newColorName = $("#select-color option:checked").val();

        if (newColorName === "deep-blue") color = "#4d638c";
        else if (newColorName === "green") color = "#83b799";
        else if (newColorName === "orange") color = "#ffa94d";
        else if (newColorName === "yellow") color = "#e2cd6d";
        else if (newColorName === "beige") color = "#c3b28f";
        else if (newColorName === "pink") color = "#e86f68";
        else if (newColorName === "burgendy") color = "#881d1d";
        else if (newColorName === "grey") color = "#495057";

        if (colorName !== newColorName) {
            $(e.target).attr(`${colorName}`, `${newColorName}`);
            $(".fc-event").attr(`${colorName}`, `${newColorName}`);
        }

        $.ajax({
            type: "POST",
            url: "/habits-edit",
            data: {
                email: currentEmail,
                title: targetName,
                newTitle: newName,
                colorName: colorName,
                newColorName: newColorName,
                color: color,
            },
            dataType: "json",
            success: function (response) {
                if (response["result"] === "success") {
                    window.location.reload();
                } else {
                    alert("error");
                }
            },
        });
    });

    $("#close-btn").click(() => {
        $("#multiModal").fadeOut(400);
        bgLayerClear();
    });
});

// 통계 차트 모달
function openChartModal() {
    const modal = $("#chart__container");
    const content = $("#chart__container .chart__content");
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

function closeChart() {
    $("#chart__container").fadeOut(400);
    bgLayerClear();
}

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

function openChart() {
    const currentEmail = location.search.split("=")[1];
    const changeMonth = $("#selectMonth option:selected").val();

    $.ajax({
        url: "/habits-date",
        method: "GET",
        success: (result) => {
            // 현재 접속된 이메일의 습관목록 가져오기
            const eventsList = result["events_list"];
            let event = [];
            for (let i = 0; i < eventsList.length; i++) {
                if (eventsList[i].email === currentEmail) {
                    event.push(eventsList[i]);
                }
            }

            // 월별로 새로운 array 형성
            const groupedByMonth = groupBy(event, (e) => e.date.split("-")[1]);
            const month = Array.from(groupedByMonth);

            // 내가 선택한 month의 습관정보만 가져오는 array 형성
            let currentMonth = [];
            for (let i = 0; i < month.length; i++) {
                if (month[i][0] === changeMonth) {
                    currentMonth.push(month[i][1]);
                }
            }

            // currentMonth를 다시 습관이름별로 array 형성
            const groupedByTitle = groupBy(currentMonth[0], (e) => e.title);
            const labelList = Array.from(groupedByTitle);

            // 월별로 습관별 횟수 array
            let countByHabits = [];
            for (let i = 0; i < labelList.length; i++) {
                countByHabits.push(labelList[i][1].length);
            }

            let habitName = [];
            for (let i = 0; i < labelList.length; i++) {
                habitName.push(labelList[i][0]);
            }

            if ($("#graph").css("display") === "none") {
                $("#graph").show();
                let ctx = document.getElementById("myChart").getContext("2d");

                var myChart = new Chart(ctx, {
                    type: "doughnut",
                    data: {
                        labels: habitName,
                        datasets: [
                            {
                                data: countByHabits,
                                backgroundColor: ["#3A4564", "#D7D1E5", "#EA9FA2", "#FFDBDC", "#AAAAAA", "#F8D3A5", "#81B3AE"],
                            },
                        ],
                    },
                });
            }
        },
    });
}
