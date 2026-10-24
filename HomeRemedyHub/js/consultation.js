document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           USER DETAILS
        ===================================================== */

        const userName =
            localStorage.getItem(
                "userName"
            ) || "Patient";


        const userEmail =
            localStorage.getItem(
                "userEmail"
            ) || "";



        /* =====================================================
           SELECTED DOCTOR
        ===================================================== */

        const selectedDoctor =
            localStorage.getItem(
                "selectedDoctor"
            ) || "";


        const selectedSpecialization =
            localStorage.getItem(
                "selectedSpecialization"
            ) || "";


        const selectedHospital =
            localStorage.getItem(
                "selectedHospital"
            ) || "";



        /* =====================================================
           DOCTOR INFORMATION
        ===================================================== */

        const consultationDoctor =
            document.getElementById(
                "consultationDoctor"
            );


        const consultationSpecialization =
            document.getElementById(
                "consultationSpecialization"
            );


        const consultationHospital =
            document.getElementById(
                "consultationHospital"
            );


        const selectedDoctorImage =
            document.getElementById(
                "selectedDoctorImage"
            );


        const doctorImageFallback =
            document.getElementById(
                "doctorImageFallback"
            );



        /* =====================================================
           PATIENT
        ===================================================== */

        const patientName =
            document.getElementById(
                "patientName"
            );


        const patientEmail =
            document.getElementById(
                "patientEmail"
            );



        /* =====================================================
           FORM
        ===================================================== */

        const consultationForm =
            document.getElementById(
                "consultationForm"
            );


        const healthConcern =
            document.getElementById(
                "healthConcern"
            );


        const concernDetails =
            document.getElementById(
                "concernDetails"
            );


        const symptomDuration =
            document.getElementById(
                "symptomDuration"
            );


        const concernSeverity =
            document.getElementById(
                "concernSeverity"
            );


        const currentMedication =
            document.getElementById(
                "currentMedication"
            );


        const clearConsultationForm =
            document.getElementById(
                "clearConsultationForm"
            );


        const consultationMessage =
            document.getElementById(
                "consultationMessage"
            );



        /* =====================================================
           SUMMARY
        ===================================================== */

        const consultationSummary =
            document.getElementById(
                "consultationSummary"
            );


        const summaryDoctor =
            document.getElementById(
                "summaryDoctor"
            );


        const summaryHospital =
            document.getElementById(
                "summaryHospital"
            );


        const summaryConcern =
            document.getElementById(
                "summaryConcern"
            );


        const summarySeverity =
            document.getElementById(
                "summarySeverity"
            );


        const summaryDuration =
            document.getElementById(
                "summaryDuration"
            );


        const summaryMedication =
            document.getElementById(
                "summaryMedication"
            );


        const summaryDescription =
            document.getElementById(
                "summaryDescription"
            );



        /* =====================================================
           PAGE BUTTONS
        ===================================================== */

        const startVideoCall =
            document.getElementById(
                "startVideoCall"
            );


        const startAudioCall =
            document.getElementById(
                "startAudioCall"
            );


        const summaryVideoCall =
            document.getElementById(
                "summaryVideoCall"
            );


        const bookAppointmentButton =
            document.getElementById(
                "bookAppointmentButton"
            );


        const summaryBookAppointment =
            document.getElementById(
                "summaryBookAppointment"
            );



        /* =====================================================
           CALL ELEMENTS
        ===================================================== */

        const callModal =
            document.getElementById(
                "callModal"
            );


        const callTypeLabel =
            document.getElementById(
                "callTypeLabel"
            );


        const callDoctorName =
            document.getElementById(
                "callDoctorName"
            );


        const remoteDoctorName =
            document.getElementById(
                "remoteDoctorName"
            );


        const callStatus =
            document.getElementById(
                "callStatus"
            );


        const localVideo =
            document.getElementById(
                "localVideo"
            );


        const remoteVideo =
            document.getElementById(
                "remoteVideo"
            );


        const localVideoPanel =
            document.getElementById(
                "localVideoPanel"
            );


        const callDoctorImage =
            document.getElementById(
                "callDoctorImage"
            );


        const callDoctorFallback =
            document.getElementById(
                "callDoctorFallback"
            );


        const toggleMicrophone =
            document.getElementById(
                "toggleMicrophone"
            );


        const toggleCamera =
            document.getElementById(
                "toggleCamera"
            );


        const endCall =
            document.getElementById(
                "endCall"
            );


        const closeCallButton =
            document.getElementById(
                "closeCallButton"
            );


        const callPermissionMessage =
            document.getElementById(
                "callPermissionMessage"
            );



        /* =====================================================
           DOCTOR IMAGE DATABASE
        ===================================================== */

        const doctorImages = {


            "Dr. Priya Sharma":
                "images/doctor-priya.jpg",


            "Dr. Rahul Kumar":
                "images/doctor-rahul.jpg",


            "Dr. Anil Reddy":
                "images/doctor-anil.jpg",


            "Dr. Meena Reddy":
                "images/doctor-meena.jpg",


            "Dr. Anjali Verma":
                "images/doctor-anjali.jpg"


        };



        /* =====================================================
           MEDIA STATE
        ===================================================== */

        let localStream =
            null;


        let currentCallMode =
            null;


        let microphoneEnabled =
            true;


        let cameraEnabled =
            true;



        /* =====================================================
           INITIALISE
        ===================================================== */

        loadDoctorInformation();


        loadPatientInformation();


        restoreConsultationDraft();



        /* =====================================================
           LOAD DOCTOR
        ===================================================== */

        function loadDoctorInformation() {


            setText(

                consultationDoctor,

                selectedDoctor ||
                "Doctor not selected"

            );


            setText(

                consultationSpecialization,

                selectedSpecialization ||
                "Select a doctor to continue"

            );


            setText(

                consultationHospital,

                selectedHospital ||
                "Hospital not selected"

            );



            loadDoctorPhoto();


        }



        /* =====================================================
           DOCTOR PHOTO
        ===================================================== */

        function loadDoctorPhoto() {


            const photo =
                doctorImages[
                    selectedDoctor
                ];



            if (
                photo &&
                selectedDoctorImage
            ) {


                selectedDoctorImage.src =
                    photo;


                selectedDoctorImage.style.display =
                    "block";


                doctorImageFallback.style.display =
                    "none";



                selectedDoctorImage.onerror =
                    function () {


                        selectedDoctorImage.style.display =
                            "none";


                        doctorImageFallback.style.display =
                            "flex";


                    };


            }


            else {


                selectedDoctorImage.style.display =
                    "none";


                doctorImageFallback.style.display =
                    "flex";


            }



            if (
                photo &&
                callDoctorImage
            ) {


                callDoctorImage.src =
                    photo;


                callDoctorImage.style.display =
                    "block";


                callDoctorFallback.style.display =
                    "none";



                callDoctorImage.onerror =
                    function () {


                        callDoctorImage.style.display =
                            "none";


                        callDoctorFallback.style.display =
                            "flex";


                    };


            }


        }



        /* =====================================================
           PATIENT
        ===================================================== */

        function loadPatientInformation() {


            if (patientName) {

                patientName.value =
                    userName;

            }


            if (patientEmail) {

                patientEmail.value =
                    userEmail;

            }


        }



        /* =====================================================
           FORM SUBMIT
        ===================================================== */

        if (consultationForm) {


            consultationForm.addEventListener(
                "submit",
                function (event) {


                    event.preventDefault();



                    if (!selectedDoctor) {


                        showMessage(

                            "Please select a doctor before preparing the consultation.",

                            "error"

                        );


                        return;


                    }



                    if (!selectedHospital) {


                        showMessage(

                            "Hospital information is missing. Please choose the doctor again.",

                            "error"

                        );


                        return;


                    }



                    if (
                        !healthConcern.value.trim()
                    ) {


                        showMessage(

                            "Please enter your main health concern.",

                            "error"

                        );


                        healthConcern.focus();


                        return;


                    }



                    if (
                        !concernDetails.value.trim()
                    ) {


                        showMessage(

                            "Please describe your symptoms.",

                            "error"

                        );


                        concernDetails.focus();


                        return;


                    }



                    if (
                        !symptomDuration.value
                    ) {


                        showMessage(

                            "Please select how long you have had the symptoms.",

                            "error"

                        );


                        symptomDuration.focus();


                        return;


                    }



                    if (
                        !concernSeverity.value
                    ) {


                        showMessage(

                            "Please select the current severity.",

                            "error"

                        );


                        concernSeverity.focus();


                        return;


                    }



                    prepareConsultationSummary();


                }
            );


        }



        /* =====================================================
           PREPARE SUMMARY
        ===================================================== */

        function prepareConsultationSummary() {


            const concern =
                healthConcern.value.trim();


            const description =
                concernDetails.value.trim();


            const duration =
                symptomDuration.value;


            const severity =
                concernSeverity.value;


            const medication =
                currentMedication.value.trim()
                ||
                "None mentioned";



            setText(
                summaryDoctor,
                selectedDoctor
            );


            setText(
                summaryHospital,
                selectedHospital
            );


            setText(
                summaryConcern,
                concern
            );


            setText(
                summarySeverity,
                severity
            );


            setText(
                summaryDuration,
                duration
            );


            setText(
                summaryMedication,
                medication
            );


            setText(
                summaryDescription,
                description
            );



            /* =================================================
               SAVE DRAFT
            ================================================= */

            localStorage.setItem(

                "consultationConcern",

                concern

            );


            localStorage.setItem(

                "consultationDetails",

                description

            );


            localStorage.setItem(

                "consultationDuration",

                duration

            );


            localStorage.setItem(

                "consultationSeverity",

                severity

            );


            localStorage.setItem(

                "consultationMedication",

                medication

            );



            /* =================================================
               SHOW SUMMARY
            ================================================= */

            consultationSummary.classList.add(
                "show"
            );


            showMessage(

                "Consultation summary prepared successfully.",

                "success"

            );



            consultationSummary.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "start"

            });


        }



        /* =====================================================
           RESTORE DRAFT
        ===================================================== */

        function restoreConsultationDraft() {


            const savedConcern =
                localStorage.getItem(
                    "consultationConcern"
                );


            const savedDetails =
                localStorage.getItem(
                    "consultationDetails"
                );


            const savedDuration =
                localStorage.getItem(
                    "consultationDuration"
                );


            const savedSeverity =
                localStorage.getItem(
                    "consultationSeverity"
                );


            const savedMedication =
                localStorage.getItem(
                    "consultationMedication"
                );



            if (savedConcern) {

                healthConcern.value =
                    savedConcern;

            }


            if (savedDetails) {

                concernDetails.value =
                    savedDetails;

            }


            if (savedDuration) {

                symptomDuration.value =
                    savedDuration;

            }


            if (savedSeverity) {

                concernSeverity.value =
                    savedSeverity;

            }


            if (
                savedMedication &&
                savedMedication !==
                    "None mentioned"
            ) {


                currentMedication.value =
                    savedMedication;


            }


        }



        /* =====================================================
           CLEAR FORM
        ===================================================== */

        if (clearConsultationForm) {


            clearConsultationForm.addEventListener(
                "click",
                function () {


                    healthConcern.value =
                        "";


                    concernDetails.value =
                        "";


                    symptomDuration.value =
                        "";


                    concernSeverity.value =
                        "";


                    currentMedication.value =
                        "";



                    localStorage.removeItem(
                        "consultationConcern"
                    );


                    localStorage.removeItem(
                        "consultationDetails"
                    );


                    localStorage.removeItem(
                        "consultationDuration"
                    );


                    localStorage.removeItem(
                        "consultationSeverity"
                    );


                    localStorage.removeItem(
                        "consultationMedication"
                    );



                    consultationSummary.classList.remove(
                        "show"
                    );


                    hideMessage();


                    healthConcern.focus();


                }
            );


        }



        /* =====================================================
           BOOK APPOINTMENT
        ===================================================== */

        if (bookAppointmentButton) {


            bookAppointmentButton.addEventListener(
                "click",
                goToAppointment
            );


        }


        if (summaryBookAppointment) {


            summaryBookAppointment.addEventListener(
                "click",
                goToAppointment
            );


        }



        function goToAppointment() {


            if (!selectedDoctor) {


                showMessage(

                    "Please choose a doctor first.",

                    "error"

                );


                return;


            }



            localStorage.setItem(

                "selectedDoctor",

                selectedDoctor

            );


            localStorage.setItem(

                "selectedHospital",

                selectedHospital

            );


            localStorage.setItem(

                "selectedSpecialization",

                selectedSpecialization

            );



            if (
                healthConcern.value.trim()
            ) {


                localStorage.setItem(

                    "consultationConcern",

                    healthConcern.value.trim()

                );


            }



            if (
                concernDetails.value.trim()
            ) {


                localStorage.setItem(

                    "consultationDetails",

                    concernDetails.value.trim()

                );


            }



            window.location.href =
                "appointment.html";


        }



        /* =====================================================
           VIDEO CALL BUTTONS
        ===================================================== */

        if (startVideoCall) {


            startVideoCall.addEventListener(
                "click",
                function () {


                    startConsultationCall(
                        "video"
                    );


                }
            );


        }



        if (summaryVideoCall) {


            summaryVideoCall.addEventListener(
                "click",
                function () {


                    startConsultationCall(
                        "video"
                    );


                }
            );


        }



        /* =====================================================
           AUDIO CALL
        ===================================================== */

        if (startAudioCall) {


            startAudioCall.addEventListener(
                "click",
                function () {


                    startConsultationCall(
                        "audio"
                    );


                }
            );


        }



        /* =====================================================
           START CALL
        ===================================================== */

        async function startConsultationCall(
            mode
        ) {


            if (!selectedDoctor) {


                showMessage(

                    "Please choose a doctor before starting a consultation call.",

                    "error"

                );


                return;


            }



            if (

                !navigator.mediaDevices ||

                !navigator.mediaDevices.getUserMedia

            ) {


                alert(

                    "Camera and microphone access are not available in this browser or connection."

                );


                return;


            }



            /* STOP PREVIOUS STREAM */

            stopLocalStream();



            currentCallMode =
                mode;


            microphoneEnabled =
                true;


            cameraEnabled =
                mode === "video";



            /* =================================================
               CALL UI
            ================================================= */

            callDoctorName.textContent =
                selectedDoctor;


            remoteDoctorName.textContent =
                selectedDoctor;


            callTypeLabel.textContent =
                mode === "video"

                    ? "VIDEO CONSULTATION"

                    : "AUDIO CONSULTATION";


            callStatus.textContent =
                "Requesting camera and microphone permission...";



            callModal.classList.add(
                "show"
            );


            callModal.setAttribute(
                "aria-hidden",
                "false"
            );


            document.body.classList.add(
                "modal-open"
            );



            try {


                /* =================================================
                   REQUEST MEDIA
                ================================================= */

                const constraints = {


                    audio:
                        true,


                    video:
                        mode === "video"

                            ? {

                                facingMode:
                                    "user",

                                width: {

                                    ideal:
                                        1280

                                },

                                height: {

                                    ideal:
                                        720

                                }

                            }

                            : false


                };



                localStream =
                    await navigator.mediaDevices
                        .getUserMedia(
                            constraints
                        );



                localVideo.srcObject =
                    localStream;



                /* =================================================
                   VIDEO MODE
                ================================================= */

                if (
                    mode === "video"
                ) {


                    localVideoPanel.classList.remove(
                        "audio-only"
                    );


                    localVideoPanel.classList.remove(
                        "camera-off"
                    );


                    toggleCamera.disabled =
                        false;


                    toggleCamera.classList.remove(
                        "off"
                    );


                    toggleCamera.innerHTML = `

                        <i class="fa-solid fa-video"></i>

                        <span>
                            Camera
                        </span>

                    `;


                }


                /* =================================================
                   AUDIO MODE
                ================================================= */

                else {


                    localVideoPanel.classList.add(
                        "audio-only"
                    );


                    localVideoPanel.classList.add(
                        "camera-off"
                    );


                    toggleCamera.disabled =
                        true;


                }



                toggleMicrophone.classList.remove(
                    "off"
                );


                toggleMicrophone.innerHTML = `

                    <i class="fa-solid fa-microphone"></i>

                    <span>
                        Mic
                    </span>

                `;



                callPermissionMessage.innerHTML = `

                    <i class="fa-solid fa-circle-check"></i>

                    ${
                        mode === "video"

                            ? "Camera and microphone are ready."

                            : "Microphone is ready."
                    }

                `;



                /*
                   We deliberately do NOT display
                   "Doctor connected".

                   There is no remote WebRTC signalling
                   backend yet.
                */

                callStatus.textContent =
                    "Waiting for doctor connection...";


            }


            catch (error) {


                console.error(
                    "Media access error:",
                    error
                );


                callPermissionMessage.innerHTML = `

                    <i class="fa-solid fa-circle-exclamation"></i>

                    Camera or microphone permission was not granted.

                `;


                callStatus.textContent =
                    "Unable to start consultation media.";


                alert(

                    "Please allow camera and microphone permission in your browser to use consultation calling."

                );


            }


        }



        /* =====================================================
           MICROPHONE
        ===================================================== */

        if (toggleMicrophone) {


            toggleMicrophone.addEventListener(
                "click",
                function () {


                    if (!localStream) {
                        return;
                    }



                    const audioTracks =
                        localStream
                            .getAudioTracks();



                    if (
                        audioTracks.length ===
                        0
                    ) {

                        return;

                    }



                    microphoneEnabled =
                        !microphoneEnabled;



                    audioTracks.forEach(
                        function (track) {


                            track.enabled =
                                microphoneEnabled;


                        }
                    );



                    if (
                        microphoneEnabled
                    ) {


                        toggleMicrophone.classList.remove(
                            "off"
                        );


                        toggleMicrophone.innerHTML = `

                            <i class="fa-solid fa-microphone"></i>

                            <span>
                                Mic
                            </span>

                        `;


                    }


                    else {


                        toggleMicrophone.classList.add(
                            "off"
                        );


                        toggleMicrophone.innerHTML = `

                            <i class="fa-solid fa-microphone-slash"></i>

                            <span>
                                Muted
                            </span>

                        `;


                    }


                }
            );


        }



        /* =====================================================
           CAMERA
        ===================================================== */

        if (toggleCamera) {


            toggleCamera.addEventListener(
                "click",
                function () {


                    if (
                        !localStream ||

                        currentCallMode !==
                            "video"
                    ) {

                        return;

                    }



                    const videoTracks =
                        localStream
                            .getVideoTracks();



                    if (
                        videoTracks.length ===
                        0
                    ) {

                        return;

                    }



                    cameraEnabled =
                        !cameraEnabled;



                    videoTracks.forEach(
                        function (track) {


                            track.enabled =
                                cameraEnabled;


                        }
                    );



                    if (cameraEnabled) {


                        localVideoPanel.classList.remove(
                            "camera-off"
                        );


                        toggleCamera.classList.remove(
                            "off"
                        );


                        toggleCamera.innerHTML = `

                            <i class="fa-solid fa-video"></i>

                            <span>
                                Camera
                            </span>

                        `;


                    }


                    else {


                        localVideoPanel.classList.add(
                            "camera-off"
                        );


                        toggleCamera.classList.add(
                            "off"
                        );


                        toggleCamera.innerHTML = `

                            <i class="fa-solid fa-video-slash"></i>

                            <span>
                                Off
                            </span>

                        `;


                    }


                }
            );


        }



        /* =====================================================
   END CALL → CONSULTATION SUMMARY PAGE
===================================================== */

if (endCall) {

    endCall.addEventListener(
        "click",
        function () {

            // Stop camera and microphone
            stopLocalStream();


            // Stop remote video if available
            if (remoteVideo) {

                remoteVideo.srcObject =
                    null;

            }


            // Save doctor information for summary page
            localStorage.setItem(
                "summaryDoctor",
                selectedDoctor
            );


            localStorage.setItem(
                "summarySpecialization",
                selectedSpecialization
            );


            const doctorPhoto =
                doctorImages[selectedDoctor];


            if (doctorPhoto) {

                localStorage.setItem(
                    "summaryImage",
                    doctorPhoto
                );

            }


            // Save consultation information
            if (healthConcern) {

                localStorage.setItem(
                    "consultationConcern",
                    healthConcern.value.trim()
                );

            }


            if (concernDetails) {

                localStorage.setItem(
                    "consultationDetails",
                    concernDetails.value.trim()
                );

            }


            if (symptomDuration) {

                localStorage.setItem(
                    "consultationDuration",
                    symptomDuration.value
                );

            }


            if (concernSeverity) {

                localStorage.setItem(
                    "consultationSeverity",
                    concernSeverity.value
                );

            }


            if (currentMedication) {

                localStorage.setItem(
                    "consultationMedication",
                    currentMedication.value.trim()
                );

            }


            // Open final consultation summary page
            window.location.replace(
    "summary.html"
);

        }
    );

}



        if (closeCallButton) {


            closeCallButton.addEventListener(
                "click",
                closeConsultationCall
            );


        }



        function closeConsultationCall() {


            stopLocalStream();



            if (remoteVideo) {

                remoteVideo.srcObject =
                    null;

            }



            callModal.classList.remove(
                "show"
            );


            callModal.setAttribute(
                "aria-hidden",
                "true"
            );


            document.body.classList.remove(
                "modal-open"
            );



            currentCallMode =
                null;


            microphoneEnabled =
                true;


            cameraEnabled =
                true;


            toggleCamera.disabled =
                false;


            toggleCamera.classList.remove(
                "off"
            );


            toggleMicrophone.classList.remove(
                "off"
            );


            localVideoPanel.classList.remove(
                "audio-only"
            );


            localVideoPanel.classList.remove(
                "camera-off"
            );


        }



        /* =====================================================
           STOP MEDIA
        ===================================================== */

        function stopLocalStream() {


            if (!localStream) {
                return;
            }



            localStream
                .getTracks()
                .forEach(
                    function (track) {


                        track.stop();


                    }
                );



            localStream =
                null;



            if (localVideo) {

                localVideo.srcObject =
                    null;

            }


        }



        /* =====================================================
           CLOSE MODAL WITH ESC
        ===================================================== */

        document.addEventListener(
            "keydown",
            function (event) {


                if (

                    event.key ===
                    "Escape"

                    &&

                    callModal.classList.contains(
                        "show"
                    )

                ) {


                    closeConsultationCall();


                }


            }
        );



        /* =====================================================
           STOP CAMERA IF PAGE CLOSES
        ===================================================== */

        window.addEventListener(
            "beforeunload",
            stopLocalStream
        );



        /* =====================================================
           MESSAGE
        ===================================================== */

        function showMessage(
            message,
            type
        ) {


            if (!consultationMessage) {
                return;
            }


            consultationMessage.className =
                "consultation-message";


            consultationMessage.classList.add(
                type
            );


            consultationMessage.innerHTML = `

                <i class="fa-solid ${
                    type === "success"

                        ? "fa-circle-check"

                        : "fa-circle-exclamation"
                }"></i>


                <span>

                    ${escapeHTML(
                        message
                    )}

                </span>

            `;


        }



        function hideMessage() {


            if (!consultationMessage) {
                return;
            }


            consultationMessage.className =
                "consultation-message hidden";


            consultationMessage.innerHTML =
                "";


        }



        /* =====================================================
           SET TEXT
        ===================================================== */

        function setText(
            element,
            value
        ) {


            if (!element) {
                return;
            }


            element.textContent =
                value || "—";


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