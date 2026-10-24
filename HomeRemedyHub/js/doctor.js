document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           ELEMENTS
        ===================================================== */

        const searchInput =
            document.getElementById(
                "doctorSearch"
            );


        const filterButtons =
            document.querySelectorAll(
                ".filter-btn"
            );


        const doctorCards =
            document.querySelectorAll(
                ".doctor-card"
            );


        const doctorCount =
            document.getElementById(
                "doctorCount"
            );


        const noDoctors =
            document.getElementById(
                "noDoctors"
            );


        let activeFilter =
            "all";



        /* =====================================================
           UPDATE DOCTORS
        ===================================================== */

        function updateDoctors() {


            const searchValue =
                searchInput

                    ? searchInput.value
                        .trim()
                        .toLowerCase()

                    : "";


            let visibleCount =
                0;



            doctorCards.forEach(
                function (card) {


                    const cardText =
                        card.textContent
                            .toLowerCase();


                    const specialty =
                        (
                            card.dataset.specialty
                            ||
                            ""
                        )
                        .trim()
                        .toLowerCase();



                    const matchesSearch =
                        cardText.includes(
                            searchValue
                        );


                    const matchesFilter =
                        activeFilter === "all"
                        ||
                        specialty === activeFilter;



                    if (
                        matchesSearch &&
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



            /* =================================================
               DOCTOR COUNT
            ================================================= */

            if (doctorCount) {


                doctorCount.textContent =

                    visibleCount === 1

                        ? "1 doctor available"

                        : `${visibleCount} doctors available`;


            }



            /* =================================================
               EMPTY STATE
            ================================================= */

            if (noDoctors) {


                noDoctors.style.display =

                    visibleCount === 0

                        ? "block"

                        : "none";


            }


        }



        /* =====================================================
           SEARCH
        ===================================================== */

        if (searchInput) {


            searchInput.addEventListener(
                "input",
                updateDoctors
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
                            (
                                button.dataset.filter
                                ||
                                "all"
                            )
                            .trim()
                            .toLowerCase();


                        updateDoctors();


                    }
                );


            }
        );



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
           INITIAL LOAD
        ===================================================== */

        updateDoctors();


    }
);



/* =========================================================
   CONSULT DOCTOR
   OPENS consultation.html
========================================================= */

function consultDoctor(
    doctorName,
    specialization,
    hospital
) {


    /* =====================================================
       FIND CORRECT DOCTOR IMAGE
    ===================================================== */

    let doctorImage =
        "images/doctor-priya.jpg";


    if (
        doctorName ===
        "Dr. Priya Sharma"
    ) {

        doctorImage =
            "images/doctor-priya.jpg";

    }


    else if (
        doctorName ===
        "Dr. Rahul Kumar"
    ) {

        doctorImage =
            "images/doctor-rahul.jpg";

    }


    else if (
        doctorName ===
        "Dr. Anil Reddy"
    ) {

        doctorImage =
            "images/doctor-anil.jpg";

    }


    else if (
        doctorName ===
        "Dr. Meena Reddy"
    ) {

        doctorImage =
            "images/doctor-meena.jpg";

    }


    else if (
        doctorName ===
        "Dr. Anjali Verma"
    ) {

        doctorImage =
            "images/doctor-anjali.jpg";

    }



    /* =====================================================
       SAVE FOR CONSULTATION PAGE
    ===================================================== */

    localStorage.setItem(
        "selectedDoctor",
        doctorName
    );


    localStorage.setItem(
        "selectedSpecialization",
        specialization
    );


    localStorage.setItem(
        "selectedHospital",
        hospital
    );


    localStorage.setItem(
        "selectedDoctorImage",
        doctorImage
    );



    /* =====================================================
       ALSO SAVE FOR SUMMARY PAGE LATER
    ===================================================== */

    localStorage.setItem(
        "summaryDoctor",
        doctorName
    );


    localStorage.setItem(
        "summarySpecialization",
        specialization
    );


    localStorage.setItem(
        "summaryImage",
        doctorImage
    );



    /* =====================================================
       OPEN CONSULTATION PAGE
    ===================================================== */

    window.location.href =
        "consultation.html";


}



/* =========================================================
   VIEW DOCTOR
========================================================= */

function viewDoctor(
    doctorName,
    specialization,
    hospital,
    experience,
    fee
) {


    localStorage.setItem(
        "selectedDoctor",
        doctorName
    );


    localStorage.setItem(
        "selectedSpecialization",
        specialization
    );


    localStorage.setItem(
        "selectedHospital",
        hospital
    );


    localStorage.setItem(
        "selectedExperience",
        experience
    );


    localStorage.setItem(
        "selectedFee",
        fee
    );


    alert(
        `${doctorName}\n${specialization}\n${hospital}\nExperience: ${experience}\nFee: ${fee}`
    );


}



/* =========================================================
   BOOK DOCTOR
========================================================= */

function bookDoctor(
    doctorName,
    specialization,
    hospital
) {


    localStorage.setItem(
        "selectedDoctor",
        doctorName
    );


    localStorage.setItem(
        "selectedSpecialization",
        specialization
    );


    localStorage.setItem(
        "selectedHospital",
        hospital
    );


    window.location.href =
        "appointment.html";


}