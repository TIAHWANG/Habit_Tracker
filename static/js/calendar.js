document.addEventListener("DOMContentLoaded", function () {
    const Calendar = FullCalendar.Calendar;
    const Draggable = FullCalendarInteraction.Draggable;

    const containerEl = document.getElementById("external-events");
    const calendarEl = document.getElementById("calendar");

    // initialize the external events
    new Draggable(containerEl, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
            return {
                title: eventEl.innerText,
            };
        },
    });

    // initialize the calendar
    const calendar = new Calendar(calendarEl, {
        plugins: ["interaction", "dayGrid"],
        header: { left: "prev", center: "title", right: "next" },
        editable: false,
        droppable: true,
        displayEventTime: false,
        progressiveEventRendering: true,
        eventReceive: function (event, _) {
            const email = location.search.split("=")[1];
            const colorName = event.draggedEl.classList[1];

            if (colorName === "deep-blue") color = "#4d638c";
            else if (colorName === "green") color = "#83b799";
            else if (colorName === "orange") color = "#ffa94d";
            else if (colorName === "yellow") color = "#e2cd6d";
            else if (colorName === "beige") color = "#c3b28f";
            else if (colorName === "pink") color = "#e86f68";
            else if (colorName === "burgendy") color = "#881d1d";
            else if (colorName === "grey") color = "#495057";

            $.ajax({
                type: "POST",
                url: "/habits-date",
                data: {
                    date: moment(event.event.start).format("YYYY-MM-DDThh:mm"),
                    title: event.event.title,
                    email: email,
                    colorName: colorName,
                    color: color,
                },
                dataType: "json",
                success: function (response) {
                    if (response["result"] == "success") {
                        window.location.reload();
                    } else {
                        alert("서버 오류!");
                    }
                },
            });
        },
        timeZone: "local",
        eventClick: function (info) {
            const target = info.event;

            const targetId = target.extendedProps._id;
            const targetName = target.title;

            const deleteMsg = confirm(`정말로 "${targetName}" 습관을 삭제하시겠습니까?`);

            if (deleteMsg) {
                target.remove();
                $.ajax({
                    url: "/habits-delete",
                    type: "POST",
                    data: { targetId_give: targetId },
                });
            }
        },
        eventSources: [
            {
                events: function (_, successCallback, __) {
                    const currentEmail = location.search.split("=")[1];
                    $.ajax({
                        url: "/habits-date",
                        type: "GET",
                        dataType: "json",
                        data: {},
                        success: function (response) {
                            const eventsList = response["events_list"];

                            let event = [];
                            for (let i = 0; i < eventsList.length; i++) {
                                if (eventsList[i].email === currentEmail) {
                                    event.push(eventsList[i]);
                                }
                            }

                            successCallback(event);
                        },
                    });
                },
            },
        ],
    });

    $(document).on("click", ".fc-next-button,.fc-prev-button", function () {
        const text = $(".fc-center h2").text();
        const month = text.split(" ")[0];
        const year = text.split(" ")[1];

        let monthNum = [];
        if (month === "January") monthNum.push("01");
        else if (month === "February") monthNum.push("02");
        else if (month === "March") monthNum.push("03");
        else if (month === "April") monthNum.push("04");
        else if (month === "May") monthNum.push("05");
        else if (month === "June") monthNum.push("06");
        else if (month === "July") monthNum.push("07");
        else if (month === "August") monthNum.push("08");
        else if (month === "September") monthNum.push("09");
        else if (month === "October") monthNum.push("10");
        else if (month === "November") monthNum.push("11");
        else if (month === "December") monthNum.push("12");

        const saveMonth = `${year}-${monthNum}-01`;
        sessionStorage.setItem("savedMonth", saveMonth);
    });

    $(".goToday").click(() => {
        calendar.today();
        const text = $(".fc-center h2").text();
        const month = text.split(" ")[0];
        const year = text.split(" ")[1];

        let monthNum = [];
        if (month === "January") monthNum.push("01");
        else if (month === "February") monthNum.push("02");
        else if (month === "March") monthNum.push("03");
        else if (month === "April") monthNum.push("04");
        else if (month === "May") monthNum.push("05");
        else if (month === "June") monthNum.push("06");
        else if (month === "July") monthNum.push("07");
        else if (month === "August") monthNum.push("08");
        else if (month === "September") monthNum.push("09");
        else if (month === "October") monthNum.push("10");
        else if (month === "November") monthNum.push("11");
        else if (month === "December") monthNum.push("12");

        const saveMonth = `${year}-${monthNum}-01`;
        sessionStorage.setItem("savedMonth", saveMonth);
    });

    if (sessionStorage.getItem("savedMonth") != null) {
        calendar.gotoDate(sessionStorage.getItem("savedMonth"));
    }

    calendar.render();
});

function goHome() {
    window.location.href = "/";
}
