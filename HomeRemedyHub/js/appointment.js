document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           API
        ===================================================== */

        const SAVE_API =
            "http://localhost:8080/api/appointments/save";


        const HISTORY_API =
            "http://localhost:8080/api/appointments/history";


        const DELETE_API =
            "http://localhost:8080/api/appointments/delete";


        const DELETE_ALL_API =
            "http://localhost:8080/api/appointments/delete-all";



        /* =====================================================
           FORM ELEMENTS
        ===================================================== */

        const form =
            document.getElementById(
                "appointmentForm"
            );


        const patientName =
            document.getElementById(
                "patientName"
            );


        const email =
            document.getElementById(
                "email"
            );


        const mobile =
            document.getElementById(
                "mobile"
            );


        const hospital =
            document.getElementById(
                "hospitalName"
            );


        const doctor =
            document.getElementById(
                "doctor"
            );


        const appointmentDate =
            document.getElementById(
                "appointmentDate"
            );


        const appointmentTime =
            document.getElementById(
                "appointmentTime"
            );


        const reason =
            document.getElementById(
                "reason"
            );


        const confirmButton =
            document.getElementById(
                "confirmButton"
            );



        /* =====================================================
           BOOKING SUMMARY
        ===================================================== */

        const summaryHospital =
            document.getElementById(
                "summaryHospital"
            );


        const summaryDoctor =
            document.getElementById(
                "summaryDoctor"
            );


        const summaryDate =
            document.getElementById(
                "summaryDate"
            );


        const summaryTime =
            document.getElementById(
                "summaryTime"
            );



        /* =====================================================
           TABS
        ===================================================== */

        const bookTab =
            document.getElementById(
                "bookTab"
            );


        const historyTab =
            document.getElementById(
                "historyTab"
            );


        const bookingSection =
            document.getElementById(
                "bookingSection"
            );


        const historySection =
            document.getElementById(
                "historySection"
            );



        /* =====================================================
           HISTORY ELEMENTS
        ===================================================== */

        const historyList =
            document.getElementById(
                "appointmentHistoryList"
            );


        const historyCount =
            document.getElementById(
                "historyCount"
            );


        const historySearch =
            document.getElementById(
                "historySearch"
            );


        const emptyState =
            document.getElementById(
                "historyEmptyState"
            );


        const emptyBookButton =
            document.getElementById(
                "emptyBookButton"
            );


        const deleteAllAppointmentsBtn =
            document.getElementById(
                "deleteAllAppointmentsBtn"
            );



        /* =====================================================
           STATE
        ===================================================== */

        let allAppointments =
            [];



        /* =====================================================
           LOGGED-IN USER
        ===================================================== */

        const savedName =
            localStorage.getItem(
                "userName"
            ) || "";


        const savedEmail =
            localStorage.getItem(
                "userEmail"
            ) || "";



        /* =====================================================
           LOAD PATIENT
        ===================================================== */

        if (patientName) {

            patientName.value =
                savedName;

        }


        if (email) {

            email.value =
                savedEmail;

        }



        /* =====================================================
           SELECTED HOSPITAL + DOCTOR
        ===================================================== */

        const selectedHospital =
            localStorage.getItem(
                "selectedHospital"
            ) || "";


        const selectedDoctor =
            localStorage.getItem(
                "selectedDoctor"
            ) || "";



        if (hospital) {

            hospital.value =
                selectedHospital;

        }


        if (doctor) {

            doctor.value =
                selectedDoctor;

        }



        if (summaryHospital) {

            summaryHospital.textContent =
                selectedHospital
                ||
                "Not selected";

        }


        if (summaryDoctor) {

            summaryDoctor.textContent =
                selectedDoctor
                ||
                "Not selected";

        }



        /* =====================================================
           PREVENT PAST DATE
        ===================================================== */

        if (appointmentDate) {

            appointmentDate.min =
                getTodayString();

        }



        /* =====================================================
           DATE SUMMARY
        ===================================================== */

        if (appointmentDate) {


            appointmentDate.addEventListener(
                "change",
                function () {


                    summaryDate.textContent =

                        appointmentDate.value

                            ? formatDate(
                                appointmentDate.value
                            )

                            : "Not selected";


                }
            );


        }



        /* =====================================================
           TIME SUMMARY
        ===================================================== */

        if (appointmentTime) {


            appointmentTime.addEventListener(
                "change",
                function () {


                    summaryTime.textContent =

                        appointmentTime.value

                            ? formatTime(
                                appointmentTime.value
                            )

                            : "Not selected";


                }
            );


        }



        /* =====================================================
           TAB - BOOKING
        ===================================================== */

        function showBookingTab() {


            if (bookTab) {

                bookTab.classList.add(
                    "active"
                );

            }


            if (historyTab) {

                historyTab.classList.remove(
                    "active"
                );

            }


            if (bookingSection) {

                bookingSection.classList.add(
                    "active-section"
                );

            }


            if (historySection) {

                historySection.classList.remove(
                    "active-section"
                );

            }


        }



        /* =====================================================
           TAB - HISTORY
        ===================================================== */

        function showHistoryTab() {


            if (historyTab) {

                historyTab.classList.add(
                    "active"
                );

            }


            if (bookTab) {

                bookTab.classList.remove(
                    "active"
                );

            }


            if (historySection) {

                historySection.classList.add(
                    "active-section"
                );

            }


            if (bookingSection) {

                bookingSection.classList.remove(
                    "active-section"
                );

            }


            loadAppointmentHistory();


        }



        /* =====================================================
           TAB EVENTS
        ===================================================== */

        if (bookTab) {

            bookTab.addEventListener(
                "click",
                showBookingTab
            );

        }


        if (historyTab) {

            historyTab.addEventListener(
                "click",
                showHistoryTab
            );

        }



        if (emptyBookButton) {


            emptyBookButton.addEventListener(
                "click",
                function () {


                    showBookingTab();


                    window.scrollTo({

                        top:
                            0,

                        behavior:
                            "smooth"

                    });


                }
            );


        }



        /* =====================================================
           OPEN HISTORY DIRECTLY
        ===================================================== */

        const params =
            new URLSearchParams(
                window.location.search
            );


        if (
            params.get("tab")
            ===
            "history"
        ) {

            showHistoryTab();

        }


        else {

            showBookingTab();

        }



        /* =====================================================
           PROVIDER VALIDATION
        ===================================================== */

        function validateProvider() {


            if (
                !hospital ||
                !hospital.value.trim()
            ) {


                alert(
                    "Please choose a hospital first."
                );


                window.location.href =
                    "hospital.html";


                return false;

            }



            if (
                !doctor ||
                !doctor.value.trim()
            ) {


                alert(
                    "Please choose a doctor first."
                );


                window.location.href =
                    "doctor.html";


                return false;

            }


            return true;


        }



        /* =====================================================
           BOOK APPOINTMENT
        ===================================================== */

        if (form) {


            form.addEventListener(
                "submit",
                async function (event) {


                    event.preventDefault();



                    /* PROVIDER */

                    if (
                        !validateProvider()
                    ) {

                        return;

                    }



                    /* MOBILE */

                    const mobileValue =
                        mobile.value
                            .trim();


                    if (
                        !/^[0-9]{10}$/.test(
                            mobileValue
                        )
                    ) {


                        alert(
                            "Please enter a valid 10-digit mobile number."
                        );


                        mobile.focus();


                        return;

                    }



                    /* DATE */

                    if (
                        !appointmentDate.value
                    ) {


                        alert(
                            "Please select an appointment date."
                        );


                        return;

                    }



                    /* TIME */

                    if (
                        !appointmentTime.value
                    ) {


                        alert(
                            "Please select an appointment time."
                        );


                        return;

                    }



                    /* FUTURE DATE + TIME */

                    const selectedDateTime =
                        new Date(

                            appointmentDate.value
                            +
                            "T"
                            +
                            appointmentTime.value
                            +
                            ":00"

                        );


                    if (
                        selectedDateTime.getTime()
                        <=
                        Date.now()
                    ) {


                        alert(
                            "Please choose a future appointment date and time."
                        );


                        return;

                    }



                    /* REASON */

                    if (
                        !reason.value.trim()
                    ) {


                        alert(
                            "Please enter the reason for your visit."
                        );


                        reason.focus();


                        return;

                    }



                    /* =================================================
                       OBJECT SENT TO SPRING BOOT
                    ================================================= */

                    const appointment = {


                        patientName:
                            patientName.value.trim(),


                        email:
                            email.value.trim(),


                        mobile:
                            mobileValue,


                        hospital:
                            hospital.value.trim(),


                        doctor:
                            doctor.value.trim(),


                        appointmentDate:
                            appointmentDate.value,


                        appointmentTime:
                            appointmentTime.value,


                        reason:
                            reason.value.trim()


                    };



                    /* =================================================
                       BUTTON LOADING
                    ================================================= */

                    confirmButton.disabled =
                        true;


                    confirmButton.innerHTML = `

                        <i class="fa-solid fa-spinner fa-spin"></i>

                        Booking Appointment...

                    `;



                    try {


                        const response =
                            await fetch(

                                SAVE_API,

                                {

                                    method:
                                        "POST",


                                    headers: {

                                        "Content-Type":
                                            "application/json"

                                    },


                                    body:
                                        JSON.stringify(
                                            appointment
                                        )

                                }

                            );



                        if (
                            !response.ok
                        ) {


                            throw new Error(
                                "Unable to save appointment."
                            );


                        }



                        await response.json();



                        alert(
                            "Appointment booked successfully!"
                        );



                        /* CLEAR */

                        mobile.value =
                            "";


                        appointmentDate.value =
                            "";


                        appointmentTime.value =
                            "";


                        reason.value =
                            "";



                        if (summaryDate) {

                            summaryDate.textContent =
                                "Not selected";

                        }


                        if (summaryTime) {

                            summaryTime.textContent =
                                "Not selected";

                        }



                        /* OPEN HISTORY */

                        showHistoryTab();



                        setTimeout(
                            function () {


                                historySection
                                    .scrollIntoView({

                                        behavior:
                                            "smooth",

                                        block:
                                            "start"

                                    });


                            },

                            100
                        );


                    }


                    catch (error) {


                        console.error(
                            "Appointment booking error:",
                            error
                        );


                        alert(
                            "Unable to book appointment. Please make sure your Spring Boot backend is running."
                        );


                    }


                    finally {


                        confirmButton.disabled =
                            false;


                        confirmButton.innerHTML = `

                            <i class="fa-solid fa-calendar-check"></i>

                            Confirm Appointment

                        `;


                    }


                }
            );


        }



        /* =====================================================
           LOAD APPOINTMENT HISTORY
        ===================================================== */

        async function loadAppointmentHistory() {


            if (!historyList) {
                return;
            }



            historyList.innerHTML = `

                <div class="history-loading">

                    <i class="fa-solid fa-spinner fa-spin"></i>

                    Loading appointments...

                </div>

            `;


            if (emptyState) {

                emptyState.style.display =
                    "none";

            }



            try {


                const response =
                    await fetch(
                        HISTORY_API
                    );



                if (
                    !response.ok
                ) {


                    throw new Error(
                        "Unable to load appointment history."
                    );


                }



                const data =
                    await response.json();



                /* =================================================
                   ONLY CURRENT USER
                ================================================= */

                allAppointments =

                    Array.isArray(data)

                        ? data.filter(
                            function (appointment) {


                                return (

                                    appointment.email
                                    &&
                                    savedEmail
                                    &&
                                    appointment.email
                                        .trim()
                                        .toLowerCase()
                                    ===
                                    savedEmail
                                        .trim()
                                        .toLowerCase()

                                );


                            }
                        )

                        : [];



                /* =================================================
                   NEWEST FIRST
                ================================================= */

                allAppointments.sort(
                    function (a, b) {


                        return (

                            Number(
                                b.id || 0
                            )

                            -

                            Number(
                                a.id || 0
                            )

                        );


                    }
                );



                updateHistoryCount();


                displayAppointments(
                    allAppointments
                );


            }


            catch (error) {


                console.error(
                    "History loading error:",
                    error
                );


                historyList.innerHTML = `

                    <div class="history-error">

                        <i class="fa-solid fa-circle-exclamation"></i>

                        Unable to load appointment history.

                    </div>

                `;


                if (historyCount) {

                    historyCount.textContent =
                        "0";

                }


                updateDeleteAllButton();


            }


        }



        /* =====================================================
           UPDATE HISTORY COUNT
        ===================================================== */

        function updateHistoryCount() {


            if (historyCount) {

                historyCount.textContent =
                    allAppointments.length;

            }


            updateDeleteAllButton();


        }



        /* =====================================================
           DELETE ALL BUTTON VISIBILITY
        ===================================================== */

        function updateDeleteAllButton() {


            if (!deleteAllAppointmentsBtn) {
                return;
            }


            deleteAllAppointmentsBtn.style.display =

                allAppointments.length > 0

                    ? "flex"

                    : "none";


        }



        /* =====================================================
           DISPLAY APPOINTMENTS
        ===================================================== */

        function displayAppointments(
            appointments
        ) {


            if (!historyList) {
                return;
            }


            historyList.innerHTML =
                "";



            if (
                appointments.length === 0
            ) {


                if (emptyState) {

                    emptyState.style.display =
                        "block";

                }


                return;

            }



            if (emptyState) {

                emptyState.style.display =
                    "none";

            }



            appointments.forEach(
                function (appointment) {


                    historyList.appendChild(

                        createAppointmentCard(
                            appointment
                        )

                    );


                }
            );


        }



        /* =====================================================
           CREATE APPOINTMENT CARD
        ===================================================== */

        function createAppointmentCard(
            appointment
        ) {


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "history-card";



            const appointmentStatus =
                getAppointmentStatus(
                    appointment
                );



            card.innerHTML = `

                <div class="history-card-top">


                    <div class="history-doctor-block">


                        <div class="history-doctor-icon">

                            <i class="fa-solid fa-user-doctor"></i>

                        </div>


                        <div>

                            <h3>
                                ${escapeHTML(
                                    appointment.doctor
                                    ||
                                    "Doctor"
                                )}
                            </h3>

                            <p>
                                ${escapeHTML(
                                    appointment.hospital
                                    ||
                                    "Hospital"
                                )}
                            </p>

                        </div>


                    </div>



                    <span
                        class="appointment-status
                        ${appointmentStatus.className}">

                        ${appointmentStatus.label}

                    </span>


                </div>



                <div class="history-details">


                    <div class="history-detail">

                        <i class="fa-solid fa-calendar-days"></i>

                        <div>

                            <span>
                                Appointment Date
                            </span>

                            <strong>
                                ${formatDate(
                                    appointment.appointmentDate
                                )}
                            </strong>

                        </div>

                    </div>



                    <div class="history-detail">

                        <i class="fa-solid fa-clock"></i>

                        <div>

                            <span>
                                Appointment Time
                            </span>

                            <strong>
                                ${formatTime(
                                    appointment.appointmentTime
                                )}
                            </strong>

                        </div>

                    </div>



                    <div class="history-detail">

                        <i class="fa-solid fa-hospital"></i>

                        <div>

                            <span>
                                Hospital
                            </span>

                            <strong>
                                ${escapeHTML(
                                    appointment.hospital
                                    ||
                                    "-"
                                )}
                            </strong>

                        </div>

                    </div>



                    <div class="history-detail">

                        <i class="fa-solid fa-phone"></i>

                        <div>

                            <span>
                                Mobile
                            </span>

                            <strong>
                                ${escapeHTML(
                                    appointment.mobile
                                    ||
                                    "-"
                                )}
                            </strong>

                        </div>

                    </div>


                </div>



                <div class="history-reason">

                    <span>
                        Reason for Visit
                    </span>

                    <p>
                        ${escapeHTML(
                            appointment.reason
                            ||
                            "No reason provided"
                        )}
                    </p>

                </div>



                <button
                    type="button"
                    class="delete-appointment-btn">

                    <i class="fa-solid fa-trash"></i>

                    Delete

                </button>

            `;



            const deleteButton =
                card.querySelector(
                    ".delete-appointment-btn"
                );



            if (deleteButton) {


                deleteButton.addEventListener(
                    "click",
                    function () {


                        deleteSingleAppointment(
                            appointment.id,
                            deleteButton
                        );


                    }
                );


            }



            return card;


        }



        /* =====================================================
           DELETE ONE APPOINTMENT
        ===================================================== */

        async function deleteSingleAppointment(
            appointmentId,
            button
        ) {


            if (!appointmentId) {


                alert(
                    "Unable to identify this appointment."
                );


                return;

            }



            const confirmed =
                window.confirm(

                    "Are you sure you want to delete this appointment?"

                );



            if (!confirmed) {
                return;
            }



            try {


                button.disabled =
                    true;


                button.innerHTML = `

                    <i class="fa-solid fa-spinner fa-spin"></i>

                    Deleting...

                `;



                const response =
                    await fetch(

                        `${DELETE_API}/${appointmentId}?email=${encodeURIComponent(savedEmail)}`,

                        {

                            method:
                                "DELETE"

                        }

                    );



                if (
                    !response.ok
                ) {


                    throw new Error(
                        "Delete failed."
                    );


                }



                allAppointments =
                    allAppointments.filter(
                        function (appointment) {


                            return (

                                Number(
                                    appointment.id
                                )

                                !==

                                Number(
                                    appointmentId
                                )

                            );


                        }
                    );



                if (historySearch) {

                    historySearch.value =
                        "";

                }


                updateHistoryCount();


                displayAppointments(
                    allAppointments
                );


            }


            catch (error) {


                console.error(
                    "Delete appointment error:",
                    error
                );


                alert(
                    "Unable to delete this appointment."
                );


                button.disabled =
                    false;


                button.innerHTML = `

                    <i class="fa-solid fa-trash"></i>

                    Delete

                `;


            }


        }



        /* =====================================================
           DELETE ALL
        ===================================================== */

        if (deleteAllAppointmentsBtn) {


            deleteAllAppointmentsBtn
                .addEventListener(

                    "click",

                    deleteAllAppointments

                );


        }



        async function deleteAllAppointments() {


            if (
                allAppointments.length === 0
            ) {

                return;

            }



            const confirmed =
                window.confirm(

                    "Are you sure you want to delete ALL appointment history?\n\nThis action cannot be undone."

                );



            if (!confirmed) {
                return;
            }



            try {


                deleteAllAppointmentsBtn.disabled =
                    true;


                deleteAllAppointmentsBtn.innerHTML = `

                    <i class="fa-solid fa-spinner fa-spin"></i>

                    Deleting...

                `;



                const response =
                    await fetch(

                        `${DELETE_ALL_API}?email=${encodeURIComponent(savedEmail)}`,

                        {

                            method:
                                "DELETE"

                        }

                    );



                if (
                    !response.ok
                ) {


                    throw new Error(
                        "Delete all failed."
                    );


                }



                allAppointments =
                    [];



                if (historySearch) {

                    historySearch.value =
                        "";

                }



                updateHistoryCount();


                displayAppointments(
                    allAppointments
                );



                alert(
                    "Appointment history deleted successfully."
                );


            }


            catch (error) {


                console.error(
                    "Delete all appointment error:",
                    error
                );


                alert(
                    "Unable to delete appointment history."
                );


            }


            finally {


                deleteAllAppointmentsBtn.disabled =
                    false;


                deleteAllAppointmentsBtn.innerHTML = `

                    <i class="fa-solid fa-trash"></i>

                    Delete All

                `;


                updateDeleteAllButton();


            }


        }



        /* =====================================================
           HISTORY SEARCH
        ===================================================== */

        if (historySearch) {


            historySearch.addEventListener(
                "input",
                function () {


                    const searchValue =
                        historySearch.value
                            .trim()
                            .toLowerCase();



                    const filtered =
                        allAppointments.filter(
                            function (appointment) {


                                const status =
                                    getAppointmentStatus(
                                        appointment
                                    ).label;



                                const searchableText = `

                                    ${appointment.doctor || ""}

                                    ${appointment.hospital || ""}

                                    ${appointment.appointmentDate || ""}

                                    ${appointment.appointmentTime || ""}

                                    ${appointment.reason || ""}

                                    ${status}

                                `.toLowerCase();



                                return searchableText
                                    .includes(
                                        searchValue
                                    );


                            }
                        );



                    displayAppointments(
                        filtered
                    );


                }
            );


        }



        /* =====================================================
           STATUS
        ===================================================== */

        function getAppointmentStatus(
            appointment
        ) {


            if (
                !appointment.appointmentDate
            ) {


                return {

                    label:
                        appointment.status
                        ||
                        "Booked",

                    className:
                        "status-booked"

                };


            }



            const time =
                String(
                    appointment.appointmentTime
                    ||
                    "00:00"
                )
                .substring(
                    0,
                    5
                );



            const appointmentDateTime =
                new Date(

                    `${appointment.appointmentDate}T${time}:00`

                );



            if (
                Number.isNaN(
                    appointmentDateTime.getTime()
                )
            ) {


                return {

                    label:
                        appointment.status
                        ||
                        "Booked",

                    className:
                        "status-booked"

                };


            }



            if (
                appointmentDateTime.getTime()
                >
                Date.now()
            ) {


                return {

                    label:
                        "Upcoming",

                    className:
                        "status-upcoming"

                };


            }



            return {

                label:
                    "Past",

                className:
                    "status-past"

            };


        }



        /* =====================================================
           TODAY
        ===================================================== */

        function getTodayString() {


            const today =
                new Date();


            const year =
                today.getFullYear();


            const month =
                String(
                    today.getMonth() + 1
                )
                .padStart(
                    2,
                    "0"
                );


            const day =
                String(
                    today.getDate()
                )
                .padStart(
                    2,
                    "0"
                );


            return (
                `${year}-${month}-${day}`
            );


        }



        /* =====================================================
           FORMAT DATE
        ===================================================== */

        function formatDate(
            dateValue
        ) {


            if (!dateValue) {

                return "-";

            }


            const date =
                new Date(

                    dateValue
                    +
                    "T00:00:00"

                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return dateValue;

            }


            return date.toLocaleDateString(

                "en-IN",

                {

                    day:
                        "2-digit",

                    month:
                        "short",

                    year:
                        "numeric"

                }

            );


        }



        /* =====================================================
           FORMAT TIME
        ===================================================== */

        function formatTime(
            timeValue
        ) {


            if (!timeValue) {

                return "-";

            }


            const cleanTime =
                String(
                    timeValue
                )
                .substring(
                    0,
                    5
                );


            const parts =
                cleanTime.split(
                    ":"
                );


            let hour =
                Number(
                    parts[0]
                );


            const minute =
                parts[1]
                ||
                "00";


            const period =
                hour >= 12

                    ? "PM"

                    : "AM";


            hour =
                hour % 12;


            if (
                hour === 0
            ) {

                hour = 12;

            }


            return (
                `${hour}:${minute} ${period}`
            );


        }



        /* =====================================================
           PROFILE IMAGE FALLBACK
        ===================================================== */

        const profileImage =
            document.querySelector(
                ".profile-top img"
            );


        const profileFallback =
            document.querySelector(
                ".profile-fallback"
            );


        if (profileImage) {


            profileImage.addEventListener(
                "error",
                function () {


                    profileImage.style.display =
                        "none";


                    if (profileFallback) {

                        profileFallback.style.display =
                            "flex";

                    }


                }
            );


        }



        /* =====================================================
           ESCAPE HTML
        ===================================================== */

        function escapeHTML(
            value
        ) {


            const div =
                document.createElement(
                    "div"
                );


            div.textContent =
                String(
                    value ?? ""
                );


            return div.innerHTML;


        }


    }
);