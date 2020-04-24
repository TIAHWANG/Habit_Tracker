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
                            alert("삭제 성공!");
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
        eventColor: "#4d638c",
    });

    calendar.render();
});

function saveEvent(event) {
    const email = location.search.split("=")[1];

    $.ajax({
        type: "POST",
        url: "/habits-date",
        data: {
            date: moment(event.event.start).format("YYYY-MM-DDThh:mm"),
            title: event.event.title,
            email: email,
        },
        dataType: "json",
        success: function (response) {
            if (response["result"] == "success") {
                alert("저장 성공!");
            } else {
                alert("서버 오류!");
            }
        },
    });
}
