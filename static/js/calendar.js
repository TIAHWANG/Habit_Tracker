document.addEventListener("DOMContentLoaded", function () {
    let Calendar = FullCalendar.Calendar;
    let Draggable = FullCalendarInteraction.Draggable;

    let containerEl = document.getElementById("external-events");
    let calendarEl = document.getElementById("calendar");

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
    let calendar = new Calendar(calendarEl, {
        plugins: ["interaction", "dayGrid"],
        header: { left: "prev", center: "title", right: "next" },
        editable: false,
        droppable: true,
        displayEventTime: false,
        eventReceive: function (event, _) {
            saveEvent(event);
        },
        eventClick: function (info) {
            const target = info.event;
            // console.log(target);
            const targetId = target.extendedProps._id;
            const targetName = target.title;
            const deleteMsg = confirm(`정말로 "${targetName}" 습관을 삭제하시겠습니까?`);
            if (deleteMsg) {
                target.remove();
                $.ajax({
                    url: "/habits-delete",
                    type: "POST",
                    data: { targetId_give: targetId },
                    success: function (response) {
                        if (response["result"] == "success") {
                            window.location.reload();
                        }
                    },
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
                            // console.log(eventsList);
                            let event = [];
                            for (let i = 0; i < eventsList.length; i++) {
                                if (eventsList[i].email === currentEmail) {
                                    event.push(eventsList[i]);
                                }
                            }
                            // console.log(event);
                            successCallback(event);
                        },
                    });
                },
            },
        ],
    });

    calendar.render();
});

function saveEvent(event) {
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
}
