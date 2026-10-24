document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           STORED VALUES
        ===================================================== */

        const storedDoctor =
            localStorage.getItem(
                "summaryDoctor"
            );


        const storedSpecialization =
            localStorage.getItem(
                "summarySpecialization"
            );


        const storedImage =
            localStorage.getItem(
                "summaryImage"
            );


        const patientName =
            localStorage.getItem(
                "userName"
            );


        const patientEmail =
            localStorage.getItem(
                "userEmail"
            );



        /* =====================================================
           ELEMENTS
        ===================================================== */

        const doctorNameElement =
            document.getElementById(
                "summaryDoctorName"
            );


        const specializationElement =
            document.getElementById(
                "summaryDoctorSpecialization"
            );


        const doctorImageElement =
            document.getElementById(
                "summaryDoctorImage"
            );


        const patientNameElement =
            document.getElementById(
                "summaryPatientName"
            );


        const patientEmailElement =
            document.getElementById(
                "summaryPatientEmail"
            );


        const summaryDateElement =
            document.getElementById(
                "summaryDate"
            );


        const summaryTimeElement =
            document.getElementById(
                "summaryTime"
            );


        const downloadBtn =
            document.getElementById(
                "downloadBtn"
            );


        const printBtn =
            document.getElementById(
                "printBtn"
            );


        const historyBtn =
            document.getElementById(
                "historyBtn"
            );


        const dashboardBtn =
            document.getElementById(
                "dashboardBtn"
            );



        /* =====================================================
           DOCTOR IMAGE DATABASE
        ===================================================== */

        const doctorImages = {


            "dr. priya sharma":
                "images/doctor-priya.jpg",


            "dr priya sharma":
                "images/doctor-priya.jpg",


            "dr. priya":
                "images/doctor-priya.jpg",


            "dr priya":
                "images/doctor-priya.jpg",



            "dr. rahul kumar":
                "images/doctor-rahul.jpg",


            "dr rahul kumar":
                "images/doctor-rahul.jpg",


            "dr. rahul":
                "images/doctor-rahul.jpg",


            "dr rahul":
                "images/doctor-rahul.jpg",



            "dr. anil reddy":
                "images/doctor-anil.jpg",


            "dr anil reddy":
                "images/doctor-anil.jpg",


            "dr. anil":
                "images/doctor-anil.jpg",


            "dr anil":
                "images/doctor-anil.jpg",



            "dr. anjali":
                "images/doctor-anjali.jpg",


            "dr anjali":
                "images/doctor-anjali.jpg",



            "dr. meena":
                "images/doctor-meena.jpg",


            "dr meena":
                "images/doctor-meena.jpg"


        };



        /* =====================================================
           DOCTOR NAME
        ===================================================== */

        if (
            storedDoctor &&
            doctorNameElement
        ) {


            doctorNameElement.textContent =
                storedDoctor;


        }



        /* =====================================================
           SPECIALIZATION
        ===================================================== */

        if (
            storedSpecialization &&
            specializationElement
        ) {


            specializationElement.textContent =
                storedSpecialization;


        }



        /* =====================================================
           FIND CORRECT DOCTOR IMAGE
        ===================================================== */

        let selectedImage =
            "";



        /*
           First preference:
           image explicitly saved by doctor page.
        */

        if (storedImage) {


            selectedImage =
                storedImage;


        }



        /*
           Second preference:
           automatically identify doctor
           from doctor's name.
        */

        if (
            !selectedImage &&
            storedDoctor
        ) {


            const doctorKey =
                storedDoctor
                    .trim()
                    .toLowerCase();


            selectedImage =
                doctorImages[
                    doctorKey
                ] || "";


        }



        /*
           Default fallback.
        */

        if (!selectedImage) {


            selectedImage =
                "images/doctor-priya.jpg";


        }



        /* =====================================================
           DISPLAY DOCTOR IMAGE
        ===================================================== */

        if (doctorImageElement) {


            doctorImageElement.src =
                selectedImage;



            doctorImageElement.addEventListener(
                "error",
                function () {


                    /*
                       Avoid endless fallback loop.
                    */

                    if (
                        !doctorImageElement
                            .src
                            .includes(
                                "doctor-priya.jpg"
                            )
                    ) {


                        doctorImageElement.src =
                            "images/doctor-priya.jpg";


                    }


                }
            );


        }



        /* =====================================================
           PATIENT INFORMATION
        ===================================================== */

        if (patientNameElement) {


            patientNameElement.textContent =
                patientName ||
                "Patient";


        }


        if (patientEmailElement) {


            patientEmailElement.textContent =
                patientEmail ||
                "Not available";


        }



        /* =====================================================
           CURRENT DATE
        ===================================================== */

        if (summaryDateElement) {


            const today =
                new Date();


            summaryDateElement.textContent =
                today.toLocaleDateString(

                    "en-IN",

                    {

                        day:
                            "2-digit",

                        month:
                            "long",

                        year:
                            "numeric"

                    }

                );


        }



        /* =====================================================
           CURRENT TIME
        ===================================================== */

        if (summaryTimeElement) {


            const now =
                new Date();


            summaryTimeElement.textContent =
                now.toLocaleTimeString(

                    "en-IN",

                    {

                        hour:
                            "2-digit",

                        minute:
                            "2-digit",

                        hour12:
                            true

                    }

                );


        }



        /* =====================================================
           DOWNLOAD PDF
        ===================================================== */

        if (downloadBtn) {


            downloadBtn.addEventListener(
                "click",
                function () {


                    alert(

                        "PDF download will be connected when we complete the backend integration."

                    );


                }
            );


        }



        /* =====================================================
           PRINT
        ===================================================== */

        if (printBtn) {


            printBtn.addEventListener(
                "click",
                function () {


                    window.print();


                }
            );


        }



        /* =====================================================
           HEALTH HISTORY
        ===================================================== */

        if (historyBtn) {


            historyBtn.addEventListener(
                "click",
                function () {


                    window.location.href =
                        "healthhistory.html";


                }
            );


        }



        /* =====================================================
           DASHBOARD
        ===================================================== */

        if (dashboardBtn) {


            dashboardBtn.addEventListener(
                "click",
                function () {


                    window.location.href =
                        "dashboard.html";


                }
            );


        }


    }
);