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

function showError(input, message) {
    const formControl = input.parent();
    formControl.addClass("error");
    const msg = formControl.children("p");
    msg.text(message);
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
    const habitInput = $("#habit");
    const habit = $("#habit").val();
    const color = $("#add__select-color option:checked").val();

    if (habit.length < 1) {
        showError(habitInput, `1글자 이상이 되어야합니다`);
    } else if (habit.length > 8) {
        showError(habitInput, ` 8글자 이하로 입력해주세요`);
    } else {
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
}

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
    const currentEmail = location.search.split("=")[1];

    $("#chart__container").fadeOut(400);
    bgLayerClear();

    window.location.href = `/habits?email=${currentEmail}`;
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

            let existMonth = [];
            for (let i = 0; i < month.length; i++) {
                existMonth.push(month[i][0]);
            }

            if (existMonth.includes(changeMonth)) {
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
                    $("#chartAlert").css("visibility", "hidden");
                    $("#graph").show();
                    $("#graph")
                        .children("h2")
                        .text(`${changeMonth.includes("0") ? changeMonth.split("")[1] : changeMonth}월에 이만큼 했네요 😄`);
                    const ctx = document.getElementById("myChart").getContext("2d");

                    const myChart = new Chart(ctx, {
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
                } else if ($("#myChart").html("") != "none") {
                    $("#chartAlert").css("visibility", "hidden");
                    $("#graph").show();
                    $("#graph")
                        .children("h2")
                        .text(`${changeMonth.includes("0") ? changeMonth.split("")[1] : changeMonth}월에 이만큼 했네요 😄`);
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
            } else {
                $("#graph").hide();
                $("#chartAlert").css("visibility", "visible");
            }
        },
    });
}
