document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           ELEMENTS
        ===================================================== */

        const searchInput =
            document.getElementById(
                "remedySearch"
            );


        const searchButton =
            document.getElementById(
                "searchRemedyBtn"
            );


        const quickButtons =
            document.querySelectorAll(
                ".quick-btn"
            );


        const loading =
            document.getElementById(
                "remedyLoading"
            );


        const homeResult =
            document.getElementById(
                "homeResult"
            );


        const medicalResult =
            document.getElementById(
                "medicalResult"
            );


        const emergencyResult =
            document.getElementById(
                "emergencyResult"
            );


        const unknownResult =
            document.getElementById(
                "unknownResult"
            );


        const trustedTitle =
            document.getElementById(
                "trustedTitle"
            );


        const trustedSummary =
            document.getElementById(
                "trustedSummary"
            );


        const trustedSource =
            document.getElementById(
                "trustedSource"
            );


        const trustedOrganization =
            document.getElementById(
                "trustedOrganization"
            );


        const medlineLink =
            document.getElementById(
                "medlineLink"
            );


        const bookAppointmentBtn =
            document.getElementById(
                "bookAppointmentBtn"
            );


        const urgentAppointmentBtn =
            document.getElementById(
                "urgentAppointmentBtn"
            );


        const emergencyHelpBtn =
            document.getElementById(
                "emergencyHelpBtn"
            );



        /* =====================================================
           SYMPTOM ALIASES
        ===================================================== */

        const symptomAliases = {


            "cold": [

                "cold",
                "common cold",
                "runny nose",
                "stuffy nose",
                "blocked nose",
                "nasal congestion",
                "sneezing"

            ],


            "cough": [

                "cough",
                "coughing",
                "dry cough",
                "wet cough"

            ],


            "headache": [

                "headache",
                "head ache",
                "head pain",
                "head hurts"

            ],


            "sore throat": [

                "sore throat",
                "throat pain",
                "throat irritation",
                "pain in throat",
                "throat hurts",
                "scratchy throat"

            ],


            "fever": [

                "fever",
                "high temperature",
                "feverish"

            ],


            "body pain": [

                "body pain",
                "body ache",
                "body aches",
                "muscle pain",
                "muscle ache"

            ],


            "fatigue": [

                "fatigue",
                "tired",
                "tiredness",
                "exhausted"

            ],


            "dizziness": [

                "dizziness",
                "dizzy",
                "lightheaded",
                "light headed"

            ],


            "vomiting": [

                "vomiting",
                "vomit",
                "throwing up"

            ],


            "stomach pain": [

                "stomach pain",
                "abdominal pain",
                "belly pain",
                "tummy pain"

            ],


            "chest pain": [

                "chest pain",
                "chest pressure",
                "chest tightness"

            ],


            "breathing difficulty": [

                "breathing difficulty",
                "difficulty breathing",
                "shortness of breath",
                "breathless",
                "cannot breathe",
                "can't breathe"

            ]


        };



        /* =====================================================
           HOME-CARE SYMPTOMS
        ===================================================== */

        const commonHomeSymptoms = [

            "cold",

            "cough",

            "headache",

            "sore throat",

            "body pain",

            "fatigue"

        ];



        /* =====================================================
           NORMALIZE
        ===================================================== */

        function normalizeText(
            text
        ) {


            return String(
                text || ""
            )
            .toLowerCase()
            .replace(
                /[^a-z0-9\s'-]/g,
                " "
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();


        }



        /* =====================================================
           EXTRACT SYMPTOMS
        ===================================================== */

        function extractSymptoms(
            text
        ) {


            const normalized =
                normalizeText(
                    text
                );


            const found =
                [];


            Object.keys(
                symptomAliases
            )
            .forEach(
                function (symptom) {


                    const aliases =
                        symptomAliases[
                            symptom
                        ];


                    const match =
                        aliases.some(
                            function (alias) {


                                return normalized.includes(
                                    alias
                                );


                            }
                        );


                    if (
                        match
                        &&
                        !found.includes(
                            symptom
                        )
                    ) {


                        found.push(
                            symptom
                        );


                    }


                }
            );


            return found;


        }



        /* =====================================================
           EMERGENCY TEXT RULES
        ===================================================== */

        function hasEmergencySigns(
            text
        ) {


            const value =
                normalizeText(
                    text
                );


            const emergencyTerms = [

                "cannot breathe",
                "can't breathe",
                "severe breathing difficulty",
                "severe shortness of breath",

                "severe chest pain",
                "crushing chest pain",
                "chest pressure with sweating",

                "unconscious",
                "loss of consciousness",
                "passed out",
                "fainted",

                "seizure",

                "sudden confusion",
                "confused and unresponsive",

                "heavy bleeding",
                "bleeding won't stop",

                "coughing blood",
                "vomiting blood",

                "blue lips",
                "bluish lips",

                "unable to speak"

            ];


            return emergencyTerms.some(
                function (term) {


                    return value.includes(
                        term
                    );


                }
            );


        }



        /* =====================================================
           MEDICAL WARNING RULES
        ===================================================== */

        function hasMedicalWarning(
            text
        ) {


            const value =
                normalizeText(
                    text
                );


            const medicalTerms = [

                "severe sore throat",
                "severe throat pain",

                "difficulty swallowing",
                "unable to swallow",

                "persistent fever",
                "high fever",

                "getting worse",
                "worsening",

                "severe headache",

                "severe stomach pain",

                "persistent vomiting"

            ];


            return medicalTerms.some(
                function (term) {


                    return value.includes(
                        term
                    );


                }
            );


        }



        /* =====================================================
           DURATION
        ===================================================== */

        function getDurationRisk(
            text
        ) {


            const value =
                normalizeText(
                    text
                );


            const dayMatch =
                value.match(
                    /(\d+)\s*days?/
                );


            if (
                dayMatch
            ) {


                const days =
                    Number(
                        dayMatch[1]
                    );


                if (
                    days >= 7
                ) {


                    return "MEDICAL";


                }


            }


            const weekMatch =
                value.match(
                    /(\d+)\s*weeks?/
                );


            if (
                weekMatch
            ) {


                return "MEDICAL";


            }


            if (
                value.includes(
                    "more than a week"
                )
            ) {


                return "MEDICAL";


            }


            return null;


        }



        /* =====================================================
           HIDE RESULTS
        ===================================================== */

        function hideAllResults() {


            if (loading) {

                loading.classList.remove(
                    "show"
                );

            }


            if (homeResult) {

                homeResult.classList.remove(
                    "show"
                );

            }


            if (medicalResult) {

                medicalResult.classList.remove(
                    "show"
                );

            }


            if (emergencyResult) {

                emergencyResult.classList.remove(
                    "show"
                );

            }


            if (unknownResult) {

                unknownResult.classList.remove(
                    "show"
                );

            }


        }



        /* =====================================================
           DATABASE CARE TYPE
        ===================================================== */

        async function getCareTypeFromDatabase(
            symptom
        ) {


            try {


                const response =
                    await fetch(

                        `http://localhost:8080/api/remedies/search?symptom=${encodeURIComponent(symptom)}`

                    );


                if (
                    !response.ok
                ) {


                    return null;


                }


                const records =
                    await response.json();


                if (
                    !Array.isArray(
                        records
                    )
                    ||
                    records.length === 0
                ) {


                    return null;


                }


                let careType =
                    "HOME";


                records.forEach(
                    function (record) {


                        const type =
                            String(
                                record.careType || ""
                            )
                            .trim()
                            .toUpperCase();


                        if (
                            type ===
                            "EMERGENCY"
                        ) {


                            careType =
                                "EMERGENCY";


                        }


                        else if (

                            type ===
                            "MEDICAL"

                            &&

                            careType !==
                            "EMERGENCY"

                        ) {


                            careType =
                                "MEDICAL";


                        }


                    }
                );


                return careType;


            }


            catch (error) {


                console.error(
                    "Care type error:",
                    error
                );


                return null;


            }


        }



        /* =====================================================
           FINAL SERIOUSNESS ANALYSIS
        ===================================================== */

        async function determineCareType(
            originalText,
            symptoms
        ) {


            /* =============================================
               1. EMERGENCY WORDS
            ============================================= */

            if (
                hasEmergencySigns(
                    originalText
                )
            ) {


                return "EMERGENCY";


            }



            /* =============================================
               2. KNOWN EMERGENCY SYMPTOMS
            ============================================= */

            if (
                symptoms.includes(
                    "breathing difficulty"
                )
            ) {


                return "EMERGENCY";


            }


            /*
               Chest pain is treated cautiously.
            */

            if (
                symptoms.includes(
                    "chest pain"
                )
            ) {


                return "EMERGENCY";


            }



            /* =============================================
               3. WARNING TERMS
            ============================================= */

            if (
                hasMedicalWarning(
                    originalText
                )
            ) {


                return "MEDICAL";


            }



            /* =============================================
               4. DURATION
            ============================================= */

            if (
                getDurationRisk(
                    originalText
                )
                ===
                "MEDICAL"
            ) {


                return "MEDICAL";


            }



            /* =============================================
               5. CHECK DATABASE
            ============================================= */

            let databaseMedical =
                false;


            let databaseHome =
                false;


            for (
                const symptom
                of symptoms
            ) {


                const type =
                    await getCareTypeFromDatabase(
                        symptom
                    );


                if (
                    type ===
                    "EMERGENCY"
                ) {


                    return "EMERGENCY";


                }


                if (
                    type ===
                    "MEDICAL"
                ) {


                    databaseMedical =
                        true;


                }


                if (
                    type ===
                    "HOME"
                ) {


                    databaseHome =
                        true;


                }


            }



            /* =============================================
               6. FEVER
            ============================================= */

            if (
                symptoms.includes(
                    "fever"
                )
            ) {


                /*
                   Your current database marks fever
                   as MEDICAL.
                */

                if (
                    databaseMedical
                ) {


                    return "MEDICAL";


                }


            }



            /* =============================================
               7. COMMON MILD HOME SYMPTOMS
            ============================================= */

            const allKnownMild =
                symptoms.length > 0
                &&
                symptoms.every(
                    function (symptom) {


                        return commonHomeSymptoms.includes(
                            symptom
                        );


                    }
                );


            if (
                allKnownMild
            ) {


                return "HOME";


            }



            /* =============================================
               8. DATABASE HOME
            ============================================= */

            if (
                databaseHome
                &&
                !databaseMedical
            ) {


                return "HOME";


            }



            /* =============================================
               9. UNKNOWN
            ============================================= */

            /*
               Unknown symptoms are not automatically
               declared safe for home treatment.
            */

            return "MEDICAL";


        }



        /* =====================================================
           MEDLINEPLUS
        ===================================================== */

        async function getMedlinePlus(
            symptom
        ) {


            try {


                const response =
                    await fetch(

                        `http://localhost:8080/api/medlineplus/search?symptom=${encodeURIComponent(symptom)}`

                    );


                if (
                    !response.ok
                ) {


                    return null;


                }


                const data =
                    await response.json();


                if (
                    !data
                    ||
                    data.message
                ) {


                    return null;


                }


                return data;


            }


            catch (error) {


                console.error(
                    "MedlinePlus error:",
                    error
                );


                return null;


            }


        }



        /* =====================================================
           BEST MEDLINEPLUS TERM
        ===================================================== */

        function chooseMedlineSearchTerm(
            symptoms,
            originalText
        ) {


            if (
                symptoms.includes(
                    "sore throat"
                )
            ) {


                return "sore throat";


            }


            if (
                symptoms.includes(
                    "cold"
                )
            ) {


                return "common cold";


            }


            if (
                symptoms.includes(
                    "cough"
                )
            ) {


                return "cough";


            }


            if (
                symptoms.includes(
                    "headache"
                )
            ) {


                return "headache";


            }


            if (
                symptoms.includes(
                    "body pain"
                )
            ) {


                return "muscle aches";


            }


            if (
                symptoms.includes(
                    "fatigue"
                )
            ) {


                return "fatigue";


            }


            if (
                symptoms.length > 0
            ) {


                return symptoms[0];


            }


            return originalText;


        }



        /* =====================================================
           MAIN SEARCH
        ===================================================== */

        async function searchSymptom(
            inputText
        ) {


            const originalText =
                String(
                    inputText || ""
                )
                .trim();


            if (
                !originalText
            ) {


                alert(
                    "Please enter a symptom."
                );


                return;


            }


            searchInput.value =
                originalText;


            hideAllResults();


            if (loading) {


                loading.classList.add(
                    "show"
                );


            }


            try {


                /* =============================================
                   EXTRACT SYMPTOMS
                ============================================= */

                const symptoms =
                    extractSymptoms(
                        originalText
                    );


                console.log(
                    "Recognized symptoms:",
                    symptoms
                );



                /* =============================================
                   DETERMINE CARE
                ============================================= */

                const careType =
                    await determineCareType(

                        originalText,

                        symptoms

                    );


                if (loading) {


                    loading.classList.remove(
                        "show"
                    );


                }



                /* =============================================
                   EMERGENCY
                ============================================= */

                if (
                    careType ===
                    "EMERGENCY"
                ) {


                    emergencyResult
                        .classList
                        .add(
                            "show"
                        );


                    emergencyResult
                        .scrollIntoView({

                            behavior:
                                "smooth",

                            block:
                                "start"

                        });


                    return;


                }



                /* =============================================
                   MEDICAL
                ============================================= */

                if (
                    careType ===
                    "MEDICAL"
                ) {


                    medicalResult
                        .classList
                        .add(
                            "show"
                        );


                    medicalResult
                        .scrollIntoView({

                            behavior:
                                "smooth",

                            block:
                                "start"

                        });


                    return;


                }



                /* =============================================
                   HOME
                ============================================= */

                const medlineSearchTerm =
                    chooseMedlineSearchTerm(

                        symptoms,

                        originalText

                    );


                const medlineData =
                    await getMedlinePlus(
                        medlineSearchTerm
                    );


                if (
                    !medlineData
                    ||
                    !medlineData.summary
                ) {


                    /*
                       Do not invent information.
                    */

                    medicalResult
                        .classList
                        .add(
                            "show"
                        );


                    return;


                }



                /* =============================================
                   DISPLAY MEDLINEPLUS
                ============================================= */

                trustedTitle.textContent =
                    medlineData.title
                    ||
                    medlineSearchTerm;


                trustedSummary.textContent =
                    medlineData.summary;


                trustedSource.textContent =
                    medlineData.source
                    ||
                    "MedlinePlus.gov";


                trustedOrganization.textContent =
                    medlineData.organization
                    ||
                    "National Library of Medicine";


                if (
                    medlineData.url
                ) {


                    medlineLink.href =
                        medlineData.url;


                    medlineLink.style.display =
                        "flex";


                }


                else {


                    medlineLink.style.display =
                        "none";


                }


                homeResult
                    .classList
                    .add(
                        "show"
                    );


                homeResult
                    .scrollIntoView({

                        behavior:
                            "smooth",

                        block:
                            "start"

                    });


            }


            catch (error) {


                console.error(
                    "Analysis error:",
                    error
                );


                hideAllResults();


                medicalResult
                    .classList
                    .add(
                        "show"
                    );


            }


        }



        /* =====================================================
           SEARCH BUTTON
        ===================================================== */

        if (
            searchButton
        ) {


            searchButton.addEventListener(
                "click",
                function () {


                    searchSymptom(
                        searchInput.value
                    );


                }
            );


        }



        /* =====================================================
           ENTER KEY
        ===================================================== */

        if (
            searchInput
        ) {


            searchInput.addEventListener(
                "keydown",
                function (event) {


                    if (
                        event.key ===
                        "Enter"
                    ) {


                        event.preventDefault();


                        searchSymptom(
                            searchInput.value
                        );


                    }


                }
            );


        }



        /* =====================================================
           QUICK BUTTONS
        ===================================================== */

        quickButtons.forEach(
            function (button) {


                button.addEventListener(
                    "click",
                    function () {


                        searchSymptom(
                            button.dataset.symptom
                        );


                    }
                );


            }
        );



        /* =====================================================
           BOOK APPOINTMENT
        ===================================================== */

        if (
            bookAppointmentBtn
        ) {


            bookAppointmentBtn.addEventListener(
                "click",
                function () {


                    window.location.href =
                        "appointment.html";


                }
            );


        }


        if (
            urgentAppointmentBtn
        ) {


            urgentAppointmentBtn.addEventListener(
                "click",
                function () {


                    window.location.href =
                        "appointment.html";


                }
            );


        }



        /* =====================================================
           EMERGENCY
        ===================================================== */

        if (
            emergencyHelpBtn
        ) {


            emergencyHelpBtn.addEventListener(
                "click",
                function () {


                    window.location.href =
                        "emergency.html";


                }
            );


        }



        /* =====================================================
           INITIAL
        ===================================================== */

        hideAllResults();


    }
);