document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       LOGGED-IN USER
    ===================================================== */

    const userName =
        localStorage.getItem("userName") || "User";

    const userEmail =
        localStorage.getItem("userEmail") || "";


    /* =====================================================
       ELEMENT REFERENCES
    ===================================================== */

    const welcomeName =
        document.getElementById("welcomeName");

    const symptomCount =
        document.getElementById("symptomCount");

    const appointmentCount =
        document.getElementById("appointmentCount");

    const healthStatus =
        document.getElementById("healthStatus");

    const healthRecordCount =
        document.getElementById("healthRecordCount");

    const latestAppointment =
        document.getElementById("latestAppointment");

    const recentActivity =
        document.getElementById("recentActivity");


    /* =====================================================
       USER NAME
    ===================================================== */

    if (welcomeName) {
        welcomeName.textContent = userName;
    }


    /* =====================================================
       INITIAL VALUES
    ===================================================== */

    setText(symptomCount, "0");
    setText(appointmentCount, "0");
    setText(healthRecordCount, "0");

    if (healthStatus) {
        healthStatus.textContent = "No Data";
        healthStatus.className = "status-neutral";
    }


    /* =====================================================
       LOAD ALL DASHBOARD DATA
    ===================================================== */

    loadDashboard();


    async function loadDashboard() {

        await Promise.all([
            loadSymptomHistory(),
            loadAppointments()
        ]);

    }


    /* =====================================================
       LOAD SYMPTOM HISTORY
    ===================================================== */

    async function loadSymptomHistory() {

        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/symptoms/history"
                );


            if (!response.ok) {
                throw new Error(
                    "Unable to load symptom history"
                );
            }


            const data =
                await response.json();


            /* Only current user's records */

            const userSymptoms =
                data.filter(function (record) {

                    if (!userEmail) {
                        return false;
                    }


                    return (
                        record.userEmail &&
                        record.userEmail
                            .trim()
                            .toLowerCase() ===
                        userEmail
                            .trim()
                            .toLowerCase()
                    );

                });


            /* TOTAL SYMPTOM CHECKS */

            setText(
                symptomCount,
                userSymptoms.length
            );


            /* HEALTH RECORDS */

            setText(
                healthRecordCount,
                userSymptoms.length
            );


            /* HEALTH STATUS */

            updateHealthStatus(
                userSymptoms
            );


            /* RECENT SYMPTOM ACTIVITY */

            showSymptomActivity(
                userSymptoms
            );

        }

        catch (error) {

            console.error(
                "Symptom history error:",
                error
            );

        }

    }


    /* =====================================================
       HEALTH STATUS
    ===================================================== */

    function updateHealthStatus(records) {

        if (!healthStatus) {
            return;
        }


        if (records.length === 0) {

            healthStatus.textContent =
                "No Data";

            healthStatus.className =
                "status-neutral";

            return;

        }


        /*
           Use latest database record
        */

        const sorted =
            [...records].sort(function (a, b) {

                return (
                    Number(b.id || 0) -
                    Number(a.id || 0)
                );

            });


        const latest =
            sorted[0];


        const severity =
            String(
                latest.severity || ""
            )
            .trim()
            .toLowerCase();


        if (
            severity.includes("high") ||
            severity.includes("severe") ||
            severity.includes("critical")
        ) {

            healthStatus.textContent =
                "High Risk";

            healthStatus.className =
                "status-high";

        }

        else if (
            severity.includes("moderate") ||
            severity.includes("medium")
        ) {

            healthStatus.textContent =
                "Moderate Risk";

            healthStatus.className =
                "status-moderate";

        }

        else if (
            severity.includes("low") ||
            severity.includes("mild")
        ) {

            healthStatus.textContent =
                "Low Risk";

            healthStatus.className =
                "status-low";

        }

        else {

            healthStatus.textContent =
                latest.severity || "Recorded";

            healthStatus.className =
                "status-neutral";

        }

    }


    /* =====================================================
       LOAD APPOINTMENTS
    ===================================================== */

    async function loadAppointments() {

        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/appointments/history"
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to load appointments"
                );

            }


            const data =
                await response.json();


            const userAppointments =
                data.filter(function (appointment) {

                    if (!userEmail) {
                        return false;
                    }


                    return (
                        appointment.email &&
                        appointment.email
                            .trim()
                            .toLowerCase() ===
                        userEmail
                            .trim()
                            .toLowerCase()
                    );

                });


            /* TOTAL APPOINTMENTS */

            setText(
                appointmentCount,
                userAppointments.length
            );


            /*
               Latest saved record by database ID.
               It can be future OR past.
            */

            userAppointments.sort(
                function (a, b) {

                    return (
                        Number(b.id || 0) -
                        Number(a.id || 0)
                    );

                }
            );


            if (
                userAppointments.length === 0
            ) {

                showNoAppointment();

                return;

            }


            const latest =
                userAppointments[0];


            showLatestAppointment(
                latest
            );


            showAppointmentActivity(
                latest
            );

        }

        catch (error) {

            console.error(
                "Appointment error:",
                error
            );


            showAppointmentError();

        }

    }


    /* =====================================================
       LATEST APPOINTMENT
    ===================================================== */

    function showLatestAppointment(
        appointment
    ) {

        if (!latestAppointment) {
            return;
        }


        const status =
            getAppointmentStatus(
                appointment
            );


        latestAppointment.innerHTML = `

            <div class="latest-appointment-card">

                <div class="latest-appointment-top">

                    <div class="latest-doctor">

                        <div class="latest-doctor-icon">
                            <i class="fa-solid fa-user-doctor"></i>
                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(
                                    appointment.doctor ||
                                    "Doctor"
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    appointment.hospital ||
                                    "Hospital"
                                )}
                            </span>

                        </div>

                    </div>


                    <span
                        class="appointment-badge
                        ${status.className}">

                        ${status.label}

                    </span>

                </div>


                <div class="latest-details">

                    <div class="latest-detail">

                        <span>Date</span>

                        <strong>
                            ${formatDate(
                                appointment.appointmentDate
                            )}
                        </strong>

                    </div>


                    <div class="latest-detail">

                        <span>Time</span>

                        <strong>
                            ${formatTime(
                                appointment.appointmentTime
                            )}
                        </strong>

                    </div>


                    <div class="latest-detail">

                        <span>Hospital</span>

                        <strong>
                            ${escapeHTML(
                                appointment.hospital ||
                                "-"
                            )}
                        </strong>

                    </div>


                    <div class="latest-detail">

                        <span>Status</span>

                        <strong>
                            ${status.label}
                        </strong>

                    </div>

                </div>


                <button
                    class="history-btn"
                    onclick="
                        window.location.href=
                        'appointment.html?tab=history'
                    ">

                    <i class="fa-solid fa-clock-rotate-left"></i>

                    View Appointment History

                </button>

            </div>

        `;

    }


    /* =====================================================
       NO APPOINTMENTS
    ===================================================== */

    function showNoAppointment() {

        if (!latestAppointment) {
            return;
        }


        latestAppointment.innerHTML = `

            <div class="appointment-empty">

                <i class="fa-regular fa-calendar-xmark"></i>

                <strong>
                    No appointments yet
                </strong>

                <p>
                    Book an appointment with one of our doctors.
                </p>


                <button
                    class="history-btn"
                    onclick="
                        window.location.href=
                        'appointment.html'
                    ">

                    Book Appointment

                </button>

            </div>

        `;

    }


    /* =====================================================
       APPOINTMENT ERROR
    ===================================================== */

    function showAppointmentError() {

        if (!latestAppointment) {
            return;
        }


        latestAppointment.innerHTML = `

            <div class="appointment-empty">

                <i class="fa-solid fa-circle-exclamation"></i>

                <strong>
                    Unable to load appointments
                </strong>

                <p>
                    Make sure the backend is running.
                </p>

            </div>

        `;

    }


    /* =====================================================
       APPOINTMENT STATUS
    ===================================================== */

    function getAppointmentStatus(
        appointment
    ) {

        if (!appointment.appointmentDate) {

            return {
                label: "Booked",
                className:
                    "appointment-current"
            };

        }


        const time =
            appointment.appointmentTime
                ? String(
                    appointment.appointmentTime
                ).substring(0, 5)
                : "00:00";


        const appointmentDateTime =
            new Date(
                `${appointment.appointmentDate}T${time}:00`
            );


        const now =
            new Date();


        if (
            appointmentDateTime.getTime() >
            now.getTime()
        ) {

            return {
                label:
                    "Upcoming Appointment",

                className:
                    "appointment-upcoming"
            };

        }


        if (
            appointmentDateTime.getTime() <
            now.getTime()
        ) {

            return {
                label:
                    "Past Appointment",

                className:
                    "appointment-past"
            };

        }


        return {
            label:
                "Booked Appointment",

            className:
                "appointment-current"
        };

    }


    /* =====================================================
       SYMPTOM ACTIVITY
    ===================================================== */

    function showSymptomActivity(
        records
    ) {

        if (
            !recentActivity ||
            records.length === 0
        ) {

            return;

        }


        const sorted =
            [...records].sort(
                function (a, b) {

                    return (
                        Number(b.id || 0) -
                        Number(a.id || 0)
                    );

                }
            );


        const latest =
            sorted[0];


        const item =
            document.createElement("div");


        item.className =
            "activity-item";


        item.innerHTML = `

            <div class="activity-icon">

                <i class="fa-solid fa-stethoscope"></i>

            </div>


            <div class="activity-text">

                <strong>
                    Symptom analysis completed
                </strong>

                <span>
                    ${escapeHTML(
                        latest.possibleCondition ||
                        latest.symptoms ||
                        "Health analysis"
                    )}
                </span>

            </div>


            <span class="activity-date">

                ${formatActivityDate(
                    latest.analysisDate
                )}

            </span>

        `;


        recentActivity.prepend(
            item
        );

    }


    /* =====================================================
       APPOINTMENT ACTIVITY
    ===================================================== */

    function showAppointmentActivity(
        appointment
    ) {

        if (!recentActivity) {
            return;
        }


        const item =
            document.createElement("div");


        item.className =
            "activity-item";


        item.innerHTML = `

            <div class="activity-icon">

                <i class="fa-solid fa-calendar-check"></i>

            </div>


            <div class="activity-text">

                <strong>
                    Appointment recorded
                </strong>

                <span>

                    ${escapeHTML(
                        appointment.doctor ||
                        "Doctor"
                    )}

                    •

                    ${escapeHTML(
                        appointment.hospital ||
                        "Hospital"
                    )}

                </span>

            </div>


            <span class="activity-date">

                ${formatDate(
                    appointment.appointmentDate
                )}

            </span>

        `;


        recentActivity.prepend(
            item
        );

    }


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatDate(
        value
    ) {

        if (!value) {
            return "-";
        }


        const date =
            new Date(
                value + "T00:00:00"
            );


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    /* =====================================================
       FORMAT TIME
    ===================================================== */

    function formatTime(
        value
    ) {

        if (!value) {
            return "-";
        }


        const clean =
            String(value)
                .substring(0, 5);


        const parts =
            clean.split(":");


        let hour =
            Number(parts[0]);


        const minute =
            parts[1] || "00";


        const period =
            hour >= 12
                ? "PM"
                : "AM";


        hour =
            hour % 12;


        if (hour === 0) {
            hour = 12;
        }


        return `${hour}:${minute} ${period}`;

    }


    /* =====================================================
       ACTIVITY DATE
    ===================================================== */

    function formatActivityDate(
        value
    ) {

        if (!value) {
            return "Recent";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "Recent";

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short"
            }
        );

    }


    /* =====================================================
       SET TEXT
    ===================================================== */

    function setText(
        element,
        value
    ) {

        if (element) {
            element.textContent = value;
        }

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(
        value
    ) {

        const div =
            document.createElement("div");


        div.textContent =
            String(value);


        return div.innerHTML;

    }

});