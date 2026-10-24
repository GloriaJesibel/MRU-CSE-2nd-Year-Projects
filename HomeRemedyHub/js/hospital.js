document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           ELEMENTS
        ===================================================== */

        const searchInput =
            document.getElementById(
                "hospitalSearch"
            );


        const filterButtons =
            document.querySelectorAll(
                ".filter"
            );


        const hospitalCards =
            document.querySelectorAll(
                ".hospital-card"
            );


        const hospitalCount =
            document.getElementById(
                "hospitalCount"
            );


        const noHospitals =
            document.getElementById(
                "noHospitals"
            );


        let activeFilter =
            "all";



        /* =====================================================
           UPDATE HOSPITALS
        ===================================================== */

        function updateHospitals() {


            const searchValue =
                searchInput

                    ? searchInput.value
                        .toLowerCase()
                        .trim()

                    : "";


            let visibleCount =
                0;



            hospitalCards.forEach(
                function (card) {


                    const cardText =
                        card.textContent
                            .toLowerCase();



                    const matchesSearch =
                        cardText.includes(
                            searchValue
                        );



                    const matchesFilter =

                        activeFilter === "all"

                        ||

                        cardText.includes(
                            activeFilter
                        );



                    if (
                        matchesSearch
                        &&
                        matchesFilter
                    ) {


                        card.style.display =
                            "block";


                        visibleCount++;


                    }


                    else {


                        card.style.display =
                            "none";


                    }


                }
            );



            updateHospitalCount(
                visibleCount
            );



            /* EMPTY STATE */

            if (noHospitals) {


                noHospitals.style.display =

                    visibleCount === 0

                        ? "block"

                        : "none";


            }


        }



        /* =====================================================
           HOSPITAL COUNT
        ===================================================== */

        function updateHospitalCount(
            count
        ) {


            if (!hospitalCount) {

                return;

            }


            hospitalCount.textContent =

                count === 1

                    ? "1 hospital available"

                    : `${count} hospitals available`;


        }



        /* =====================================================
           SEARCH
        ===================================================== */

        if (searchInput) {


            searchInput.addEventListener(
                "input",
                updateHospitals
            );


        }



        /* =====================================================
           FILTER BUTTONS
        ===================================================== */

        filterButtons.forEach(
            function (button) {


                button.addEventListener(
                    "click",
                    function () {


                        filterButtons.forEach(
                            function (btn) {


                                btn.classList.remove(
                                    "active"
                                );


                            }
                        );



                        button.classList.add(
                            "active"
                        );



                        activeFilter =
                            button.textContent
                                .trim()
                                .toLowerCase();



                        updateHospitals();


                    }
                );


            }
        );



        /* =====================================================
           VIEW MAP
        ===================================================== */

        const mapButtons =
            document.querySelectorAll(
                ".map-btn"
            );



        mapButtons.forEach(
            function (button) {


                button.addEventListener(
                    "click",
                    function () {


                        const card =
                            button.closest(
                                ".hospital-card"
                            );


                        if (!card) {

                            return;

                        }



                        const hospitalNameElement =
                            card.querySelector(
                                "h2"
                            );


                        const locationElement =
                            card.querySelector(
                                ".location"
                            );



                        const hospitalName =
                            hospitalNameElement

                                ? hospitalNameElement
                                    .textContent
                                    .trim()

                                : "";



                        const location =
                            locationElement

                                ? locationElement
                                    .textContent
                                    .trim()

                                : "Hyderabad";



                        const query =
                            encodeURIComponent(

                                `${hospitalName} ${location}`

                            );



                        window.open(

                            `https://www.google.com/maps/search/?api=1&query=${query}`,

                            "_blank"

                        );


                    }
                );


            }
        );



        /* =====================================================
           PROFILE FALLBACK
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
           INITIAL
        ===================================================== */

        updateHospitals();


    }
);



/* =========================================================
   BOOK APPOINTMENT
========================================================= */

function bookAppointment(
    hospital,
    doctor
) {


    localStorage.setItem(
        "selectedHospital",
        hospital
    );


    localStorage.setItem(
        "selectedDoctor",
        doctor
    );


    window.location.href =
        "appointment.html";


}