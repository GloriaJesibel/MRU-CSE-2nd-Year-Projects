document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           ELEMENTS
        ===================================================== */

        const symptomButtons =
            document.querySelectorAll(
                ".symptom-option"
            );


        const durationButtons =
            document.querySelectorAll(
                ".duration-btn"
            );


        const selectedSymptomsBox =
            document.getElementById(
                "selectedSymptoms"
            );


        const selectedCount =
            document.getElementById(
                "selectedCount"
            );


        const additionalSymptoms =
            document.getElementById(
                "additionalSymptoms"
            );


        const analyzeButton =
            document.getElementById(
                "analyzeButton"
            );


        /* =====================================================
           RESULT ELEMENTS
        ===================================================== */

        const analysisResult =
            document.getElementById(
                "analysisResult"
            );


        const resultCondition =
            document.getElementById(
                "resultCondition"
            );


        const resultSeverity =
            document.getElementById(
                "resultSeverity"
            );


        const resultPercentage =
            document.getElementById(
                "resultPercentage"
            );


        const resultRecommendation =
            document.getElementById(
                "resultRecommendation"
            );


        const resultSeverityBadge =
            document.getElementById(
                "resultSeverityBadge"
            );


        const riskCircle =
            document.getElementById(
                "riskCircle"
            );


        const riskLabel =
            document.getElementById(
                "riskLabel"
            );


        /* =====================================================
           USER
        ===================================================== */

        const userEmail =
            localStorage.getItem(
                "userEmail"
            ) || "";


        /* =====================================================
           STATE
        ===================================================== */

        let selectedSymptoms = [];

        let selectedDuration = "";


        /* =====================================================
           SELECT SYMPTOMS
        ===================================================== */

        symptomButtons.forEach(
            function (button) {


                button.addEventListener(
                    "click",
                    function () {


                        const symptom =
                            button.dataset.symptom;


                        if (
                            selectedSymptoms.includes(
                                symptom
                            )
                        ) {


                            selectedSymptoms =
                                selectedSymptoms.filter(
                                    function (item) {

                                        return (
                                            item !== symptom
                                        );

                                    }
                                );


                            button.classList.remove(
                                "selected"
                            );


                        }


                        else {


                            selectedSymptoms.push(
                                symptom
                            );


                            button.classList.add(
                                "selected"
                            );


                        }


                        updateSelectedSymptoms();


                    }
                );


            }
        );


        /* =====================================================
           UPDATE SELECTED SYMPTOMS
        ===================================================== */

        function updateSelectedSymptoms() {


            if (selectedCount) {

                selectedCount.textContent =
                    selectedSymptoms.length;

            }


            if (!selectedSymptomsBox) {

                return;

            }


            selectedSymptomsBox.innerHTML =
                "";


            if (
                selectedSymptoms.length === 0
            ) {


                selectedSymptomsBox.innerHTML = `

                    <p class="no-selection">

                        No symptoms selected yet.

                    </p>

                `;


                return;

            }


            selectedSymptoms.forEach(
                function (symptom) {


                    const chip =
                        document.createElement(
                            "div"
                        );


                    chip.className =
                        "selected-chip";


                    chip.innerHTML = `

                        <span>
                            ${escapeHTML(symptom)}
                        </span>

                        <button
                            type="button"
                            title="Remove">

                            <i class="fa-solid fa-xmark"></i>

                        </button>

                    `;


                    const removeButton =
                        chip.querySelector(
                            "button"
                        );


                    if (removeButton) {


                        removeButton.addEventListener(
                            "click",
                            function () {


                                removeSymptom(
                                    symptom
                                );


                            }
                        );


                    }


                    selectedSymptomsBox
                        .appendChild(
                            chip
                        );


                }
            );


        }


        /* =====================================================
           REMOVE SYMPTOM
        ===================================================== */

        function removeSymptom(
            symptom
        ) {


            selectedSymptoms =
                selectedSymptoms.filter(
                    function (item) {

                        return (
                            item !== symptom
                        );

                    }
                );


            symptomButtons.forEach(
                function (button) {


                    if (
                        button.dataset.symptom ===
                        symptom
                    ) {


                        button.classList.remove(
                            "selected"
                        );


                    }


                }
            );


            updateSelectedSymptoms();


        }


        /* =====================================================
           DURATION
        ===================================================== */

        durationButtons.forEach(
            function (button) {


                button.addEventListener(
                    "click",
                    function () {


                        durationButtons.forEach(
                            function (btn) {


                                btn.classList.remove(
                                    "selected"
                                );


                            }
                        );


                        button.classList.add(
                            "selected"
                        );


                        selectedDuration =
                            button.dataset.duration;


                    }
                );


            }
        );


        /* =====================================================
           ANALYZE
        ===================================================== */

        if (analyzeButton) {


            analyzeButton.addEventListener(
                "click",
                async function () {


                    const extraSymptoms =
                        additionalSymptoms

                            ? additionalSymptoms
                                .value
                                .trim()

                            : "";


                    /* =========================================
                       VALIDATION
                    ========================================= */

                    if (
                        selectedSymptoms.length === 0
                        &&
                        extraSymptoms === ""
                    ) {


                        alert(
                            "⚠️ Please select at least one symptom or enter additional symptoms."
                        );


                        return;

                    }


                    if (!selectedDuration) {


                        alert(
                            "⚠️ Please select how long you have had these symptoms."
                        );


                        return;

                    }


                    /* =========================================
                       LOADING
                    ========================================= */

                    analyzeButton.disabled =
                        true;


                    analyzeButton.innerHTML = `

                        <i class="fa-solid fa-spinner fa-spin"></i>

                        Analyzing...

                    `;


                    try {


                        /* =====================================
                           RULE-BASED ASSESSMENT
                        ===================================== */

                        const assessment =
                            analyzeSymptoms(

                                selectedSymptoms,

                                extraSymptoms,

                                selectedDuration

                            );


                        /* =====================================
                           MYSQL REMEDIES
                        ===================================== */

                        let databaseRemedies =
                            [];


                        for (
                            const symptom
                            of selectedSymptoms
                        ) {


                            const results =
                                await getRemedyFromDatabase(
                                    symptom
                                );


                            if (
                                Array.isArray(
                                    results
                                )
                            ) {


                                databaseRemedies.push(
                                    ...results
                                );


                            }


                        }


                        /* =====================================
                           CARE TYPE
                        ===================================== */

                        const careType =
                            determineCareType(

                                databaseRemedies,

                                assessment

                            );


                        /* =====================================
                           PRIMARY REMEDY
                        ===================================== */

                        const primaryRemedy =
                            selectPrimaryRemedy(

                                databaseRemedies,

                                careType

                            );


                        /* =====================================
                           MEDLINEPLUS
                           ONLY FOR HOME CARE
                        ===================================== */

                        let medlineInfo =
                            null;


                        if (
                            careType === "HOME"
                            &&
                            primaryRemedy
                        ) {


                            const medlineSearchTerm =
                                primaryRemedy.symptom
                                ||
                                selectedSymptoms[0];


                            if (
                                medlineSearchTerm
                            ) {


                                medlineInfo =
                                    await getMedlinePlusInformation(
                                        medlineSearchTerm
                                    );


                            }


                        }


                        /* =====================================
                           DISPLAY RESULT
                        ===================================== */

                        showResult(

                            assessment,

                            databaseRemedies,

                            careType,

                            medlineInfo

                        );


                        /* =====================================
                           SAVE FOR REMEDIES PAGE
                        ===================================== */

                        localStorage.setItem(

                            "lastSelectedSymptoms",

                            JSON.stringify(
                                selectedSymptoms
                            )

                        );


                        localStorage.setItem(

                            "lastCareType",

                            careType

                        );


                        localStorage.setItem(

                            "lastRemedyResults",

                            JSON.stringify(
                                databaseRemedies
                            )

                        );


                        if (
                            medlineInfo
                        ) {


                            localStorage.setItem(

                                "lastMedlinePlusResult",

                                JSON.stringify(
                                    medlineInfo
                                )

                            );


                        }


                        else {


                            localStorage.removeItem(
                                "lastMedlinePlusResult"
                            );


                        }


                        /* =====================================
                           HISTORY TEXT
                        ===================================== */

                        let symptomText =
                            selectedSymptoms.join(
                                ", "
                            );


                        if (extraSymptoms) {


                            if (symptomText) {


                                symptomText +=
                                    ", "
                                    +
                                    extraSymptoms;


                            }


                            else {


                                symptomText =
                                    extraSymptoms;


                            }


                        }


                        symptomText +=
                            ` | Duration: ${selectedDuration}`;


                        /* =====================================
                           HISTORY DATA
                        ===================================== */

                        const historyData = {


                            userEmail:
                                userEmail,


                            symptoms:
                                symptomText,


                            possibleCondition:
                                assessment.condition,


                            severity:
                                assessment.severity,


                            percentage:
                                assessment.percentage


                        };


                        /* =====================================
                           SAVE HISTORY
                        ===================================== */

                        try {


                            await saveSymptomHistory(
                                historyData
                            );


                        }


                        catch (
                            historyError
                        ) {


                            console.error(
                                "History save error:",
                                historyError
                            );


                        }


                        /* =====================================
                           SCROLL
                        ===================================== */

                        setTimeout(
                            function () {


                                if (
                                    analysisResult
                                ) {


                                    analysisResult
                                        .scrollIntoView({

                                            behavior:
                                                "smooth",

                                            block:
                                                "start"

                                        });


                                }


                            },

                            150
                        );


                    }


                    catch (error) {


                        console.error(
                            "Symptom analysis error:",
                            error
                        );


                        alert(
                            "❌ The symptom analysis could not be completed. Please make sure the Spring Boot backend is running."
                        );


                    }


                    finally {


                        analyzeButton.disabled =
                            false;


                        analyzeButton.innerHTML = `

                            <i class="fa-solid fa-wand-magic-sparkles"></i>

                            Analyze Symptoms

                        `;


                    }


                }
            );


        }


        /* =====================================================
           MYSQL REMEDY DATABASE
        ===================================================== */

        async function getRemedyFromDatabase(
            symptom
        ) {


            try {


                const response =
                    await fetch(

                        `http://localhost:8080/api/remedies/search?symptom=${encodeURIComponent(symptom)}`

                    );


                if (!response.ok) {


                    throw new Error(
                        "Unable to retrieve remedy"
                    );


                }


                return await response.json();


            }


            catch (error) {


                console.error(
                    "Remedy database error:",
                    error
                );


                return [];


            }


        }


        /* =====================================================
           MEDLINEPLUS
        ===================================================== */

        async function getMedlinePlusInformation(
            symptom
        ) {


            try {


                const response =
                    await fetch(

                        `http://localhost:8080/api/medlineplus/search?symptom=${encodeURIComponent(symptom)}`

                    );


                if (!response.ok) {


                    throw new Error(
                        "Unable to retrieve MedlinePlus information"
                    );


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
           DETERMINE CARE TYPE

           EMERGENCY > MEDICAL > HOME

           MedlinePlus is allowed only when the
           database explicitly contains a HOME remedy.
        ===================================================== */

        function determineCareType(
            remedies,
            assessment
        ) {


            /* =========================================
               HIGH RULE-BASED RISK
            ========================================= */

            if (
                assessment.severity ===
                "High"
            ) {


                return "EMERGENCY";


            }


            /* =========================================
               DATABASE EMERGENCY
            ========================================= */

            const hasEmergency =
                remedies.some(
                    function (item) {


                        return (
                            (
                                item.careType
                                ||
                                ""
                            )
                            .trim()
                            .toUpperCase()
                            ===
                            "EMERGENCY"
                        );


                    }
                );


            if (hasEmergency) {


                return "EMERGENCY";


            }


            /* =========================================
               DATABASE MEDICAL
            ========================================= */

            const hasMedical =
                remedies.some(
                    function (item) {


                        return (
                            (
                                item.careType
                                ||
                                ""
                            )
                            .trim()
                            .toUpperCase()
                            ===
                            "MEDICAL"
                        );


                    }
                );


            if (hasMedical) {


                return "MEDICAL";


            }


            /* =========================================
               MODERATE RULE-BASED RISK
            ========================================= */

            if (
                assessment.severity ===
                "Moderate"
            ) {


                return "MEDICAL";


            }


            /* =========================================
               HOME ONLY WHEN DATABASE SAYS HOME
            ========================================= */

            const hasHome =
                remedies.some(
                    function (item) {


                        return (
                            (
                                item.careType
                                ||
                                ""
                            )
                            .trim()
                            .toUpperCase()
                            ===
                            "HOME"
                        );


                    }
                );


            if (hasHome) {


                return "HOME";


            }


            /*
               If there is no known database entry,
               do not automatically suggest a home remedy.
            */

            return "MEDICAL";


        }


        /* =====================================================
           PRIMARY REMEDY
        ===================================================== */

        function selectPrimaryRemedy(
            remedies,
            careType
        ) {


            if (
                !Array.isArray(
                    remedies
                )
                ||
                remedies.length === 0
            ) {


                return null;


            }


            const match =
                remedies.find(
                    function (item) {


                        return (
                            (
                                item.careType
                                ||
                                ""
                            )
                            .trim()
                            .toUpperCase()
                            ===
                            careType
                        );


                    }
                );


            return (
                match
                ||
                remedies[0]
            );


        }


        /* =====================================================
           RULE-BASED ANALYSIS ENGINE
        ===================================================== */

        function analyzeSymptoms(
            symptoms,
            extra,
            duration
        ) {


            const allText = `

                ${symptoms.join(" ")}

                ${extra}

            `.toLowerCase();


            let condition =
                "General Symptoms";


            let severity =
                "Low";


            let percentage =
                55;


            let recommendation =

                "Monitor your symptoms and consult a healthcare professional if they persist or become worse.";


            /* =================================================
               CHEST PAIN / BREATHING
            ================================================= */

            if (

                allText.includes(
                    "chest pain"
                )

                ||

                allText.includes(
                    "breathing difficulty"
                )

            ) {


                condition =
                    "Symptoms Requiring Prompt Medical Evaluation";


                severity =
                    "High";


                percentage =
                    90;


                recommendation =

                    "These symptoms require prompt professional medical evaluation.";


            }


            /* =================================================
               FEVER + RESPIRATORY
            ================================================= */

            else if (

                allText.includes(
                    "fever"
                )

                &&

                (

                    allText.includes(
                        "cough"
                    )

                    ||

                    allText.includes(
                        "cold"
                    )

                    ||

                    allText.includes(
                        "sore throat"
                    )

                )

            ) {


                condition =
                    "Possible Respiratory Infection";


                severity =
                    "Moderate";


                percentage =
                    82;


                recommendation =

                    "A healthcare consultation is recommended if fever persists or symptoms worsen.";


            }


            /* =================================================
               FEVER + BODY PAIN
            ================================================= */

            else if (

                allText.includes(
                    "fever"
                )

                &&

                allText.includes(
                    "body pain"
                )

            ) {


                condition =
                    "Possible Viral Illness";


                severity =
                    "Moderate";


                percentage =
                    78;


                recommendation =

                    "Professional medical review is recommended if fever or other symptoms continue.";


            }


            /* =================================================
               HEADACHE + FEVER
            ================================================= */

            else if (

                allText.includes(
                    "headache"
                )

                &&

                allText.includes(
                    "fever"
                )

            ) {


                condition =
                    "Possible Febrile Illness";


                severity =
                    "Moderate";


                percentage =
                    73;


                recommendation =

                    "Medical consultation is recommended if fever and headache continue or become severe.";


            }


            /* =================================================
               VOMITING + STOMACH PAIN
            ================================================= */

            else if (

                allText.includes(
                    "vomiting"
                )

                &&

                allText.includes(
                    "stomach pain"
                )

            ) {


                condition =
                    "Possible Gastrointestinal Illness";


                severity =
                    "Moderate";


                percentage =
                    80;


                recommendation =

                    "Medical evaluation may be needed if vomiting continues or abdominal pain becomes severe.";


            }


            /* =================================================
               DIZZINESS + FATIGUE
            ================================================= */

            else if (

                allText.includes(
                    "dizziness"
                )

                &&

                allText.includes(
                    "fatigue"
                )

            ) {


                condition =
                    "Possible Fatigue / Dehydration";


                severity =
                    "Moderate";


                percentage =
                    68;


                recommendation =

                    "Consult a healthcare professional if dizziness persists or repeatedly occurs.";


            }


            /* =================================================
               COUGH
            ================================================= */

            else if (
                allText.includes(
                    "cough"
                )
            ) {


                condition =
                    "Possible Mild Respiratory Irritation";


                severity =
                    "Low";


                percentage =
                    62;


                recommendation =

                    "Monitor the cough and seek medical advice if it persists or becomes severe.";


            }


            /* =================================================
               COLD / SORE THROAT
            ================================================= */

            else if (

                allText.includes(
                    "cold"
                )

                ||

                allText.includes(
                    "sore throat"
                )

            ) {


                condition =
                    "Possible Common Cold";


                severity =
                    "Low";


                percentage =
                    65;


                recommendation =

                    "Monitor your symptoms and seek professional care if they worsen.";


            }


            /* =================================================
               HEADACHE
            ================================================= */

            else if (
                allText.includes(
                    "headache"
                )
            ) {


                condition =
                    "Possible Mild Headache";


                severity =
                    "Low";


                percentage =
                    58;


                recommendation =

                    "Seek medical evaluation for severe, sudden or persistent headache.";


            }


            /* =================================================
               FEVER
            ================================================= */

            else if (
                allText.includes(
                    "fever"
                )
            ) {


                condition =
                    "Possible Febrile Illness";


                severity =
                    "Moderate";


                percentage =
                    65;


                recommendation =

                    "Medical consultation is recommended if fever persists or symptoms worsen.";


            }


            /* =================================================
               FATIGUE
            ================================================= */

            else if (
                allText.includes(
                    "fatigue"
                )
            ) {


                condition =
                    "Possible Fatigue";


                severity =
                    "Low";


                percentage =
                    55;


                recommendation =

                    "Consult a healthcare professional if unexplained fatigue continues.";


            }


            /* =================================================
               DURATION
            ================================================= */

            if (

                duration ===
                    "More than a Week"

                &&

                severity ===
                    "Low"

            ) {


                severity =
                    "Moderate";


                percentage =
                    Math.min(

                        percentage + 10,

                        95

                    );


                recommendation =

                    "Because the symptoms have continued for more than a week, medical consultation is recommended.";


            }


            else if (

                duration ===
                    "3-7 Days"

            ) {


                percentage =
                    Math.min(

                        percentage + 5,

                        95

                    );


            }


            percentage =
                Math.max(

                    1,

                    Math.min(

                        percentage,

                        95

                    )

                );


            return {


                condition:
                    condition,


                severity:
                    severity,


                percentage:
                    percentage,


                recommendation:
                    recommendation


            };


        }


        /* =====================================================
           DISPLAY RESULT
        ===================================================== */

        function showResult(
            assessment,
            databaseRemedies,
            careType,
            medlineInfo
        ) {


            if (!analysisResult) {

                return;

            }


            analysisResult.classList.add(
                "show"
            );


            resultCondition.textContent =
                assessment.condition;


            resultSeverity.textContent =
                `${assessment.severity} Risk`;


            const primaryRemedy =
                selectPrimaryRemedy(

                    databaseRemedies,

                    careType

                );


            let recommendationHTML =
                "";


            /* =================================================
               HOME CARE
            ================================================= */

            if (
                primaryRemedy &&
                careType === "HOME"
            ) {


                recommendationHTML = `

                    <strong>
                        🌿 Home Care Suitable
                    </strong>

                    <br><br>


                    <strong>
                        ${escapeHTML(
                            primaryRemedy.conditionName
                            ||
                            "Suggested Home Care"
                        )}
                    </strong>

                    <br><br>


                    <strong>
                        Suggested Remedy:
                    </strong>

                    <br>

                    ${escapeHTML(
                        primaryRemedy.remedy
                        ||
                        ""
                    )}

                    <br><br>


                    <strong>
                        Instructions:
                    </strong>

                    <br>

                    ${escapeHTML(
                        primaryRemedy.instructions
                        ||
                        ""
                    )}

                    <br><br>


                    <strong>
                        Precaution:
                    </strong>

                    <br>

                    ${escapeHTML(
                        primaryRemedy.precaution
                        ||
                        ""
                    )}

                    <br><br>


                    <strong>
                        When to See a Doctor:
                    </strong>

                    <br>

                    ${escapeHTML(
                        primaryRemedy.whenToSeeDoctor
                        ||
                        ""
                    )}

                `;


                /* =============================================
                   MEDLINEPLUS ONLY FOR HOME
                ============================================= */

                if (
                    medlineInfo &&
                    medlineInfo.summary
                ) {


                    let medlineSummary =
                        medlineInfo.summary;


                    if (
                        medlineSummary.length >
                        650
                    ) {


                        medlineSummary =
                            medlineSummary.substring(
                                0,
                                650
                            )
                            +
                            "...";


                    }


                    recommendationHTML += `

                        <br><br>

                        <div
                            class="medline-info-box"

                            style="
                                margin-top:18px;
                                padding:16px;
                                border-radius:12px;
                                background:#f8f7ff;
                                border:1px solid #ebe9f4;
                                line-height:1.7;
                            "
                        >

                            <strong
                                style="
                                    color:#6366f1;
                                "
                            >

                                🏛 Trusted Health Information

                            </strong>

                            <br><br>


                            <strong>

                                ${escapeHTML(
                                    medlineInfo.title
                                    ||
                                    "MedlinePlus Health Information"
                                )}

                            </strong>

                            <br><br>


                            ${escapeHTML(
                                medlineSummary
                            )}

                            <br><br>


                            <small>

                                Source:
                                ${escapeHTML(
                                    medlineInfo.source
                                    ||
                                    "MedlinePlus.gov"
                                )}

                                <br>

                                ${escapeHTML(
                                    medlineInfo.organization
                                    ||
                                    "National Library of Medicine"
                                )}

                            </small>


                            ${
                                medlineInfo.url

                                    ? `

                                        <br><br>

                                        <a
                                            href="${escapeHTML(
                                                medlineInfo.url
                                            )}"

                                            target="_blank"

                                            rel="noopener noreferrer"

                                            style="
                                                color:#6366f1;
                                                font-weight:600;
                                                text-decoration:none;
                                            "
                                        >

                                            Read more on MedlinePlus

                                            <i
                                                class="fa-solid fa-arrow-up-right-from-square"
                                            ></i>

                                        </a>

                                    `

                                    : ""
                            }

                        </div>

                    `;


                }


            }


            /* =================================================
               MEDICAL
            ================================================= */

            else if (
                careType === "MEDICAL"
            ) {


                recommendationHTML = `

                    <strong
                        style="
                            color:#d97706;
                        "
                    >

                        🩺 Medical Consultation Recommended

                    </strong>

                    <br><br>


                    Your symptoms may require
                    professional medical evaluation.

                    <br><br>


                    ${
                        primaryRemedy

                            ? `

                                <strong>

                                    ${escapeHTML(
                                        primaryRemedy.conditionName
                                        ||
                                        assessment.condition
                                    )}

                                </strong>

                                <br><br>


                                ${escapeHTML(
                                    primaryRemedy.instructions
                                    ||
                                    assessment.recommendation
                                )}

                                <br><br>


                                <strong>
                                    When to See a Doctor:
                                </strong>

                                <br>

                                ${escapeHTML(
                                    primaryRemedy.whenToSeeDoctor
                                    ||
                                    assessment.recommendation
                                )}

                            `

                            : `

                                ${escapeHTML(
                                    assessment.recommendation
                                )}

                            `
                    }


                    <br><br>


                    <button
                        type="button"
                        id="resultBookAppointment"

                        style="
                            border:none;
                            border-radius:9px;
                            padding:11px 18px;
                            background:#6366f1;
                            color:white;
                            font-family:Poppins,sans-serif;
                            font-weight:600;
                            cursor:pointer;
                        "
                    >

                        <i class="fa-solid fa-calendar-check"></i>

                        Book Appointment

                    </button>

                `;


            }


            /* =================================================
               EMERGENCY
            ================================================= */

            else if (
                careType === "EMERGENCY"
            ) {


                recommendationHTML = `

                    <strong
                        style="
                            color:#ef4444;
                        "
                    >

                        🚨 Immediate Medical Attention Recommended

                    </strong>

                    <br><br>


                    These symptoms should not be
                    managed using home remedies alone.

                    <br><br>


                    ${
                        primaryRemedy

                            ? escapeHTML(
                                primaryRemedy.instructions
                                ||
                                "Seek urgent medical attention."
                            )

                            : escapeHTML(
                                assessment.recommendation
                            )
                    }


                    <br><br>


                    <strong>
                        Important:
                    </strong>

                    <br>


                    ${
                        primaryRemedy

                            ? escapeHTML(
                                primaryRemedy.precaution
                                ||
                                "Do not delay medical care."
                            )

                            : "Do not delay medical care."
                    }


                    <br><br>


                    <div
                        style="
                            display:flex;
                            gap:10px;
                            flex-wrap:wrap;
                        "
                    >


                        <button
                            type="button"
                            id="resultEmergencyAppointment"

                            style="
                                border:none;
                                border-radius:9px;
                                padding:11px 18px;
                                background:#6366f1;
                                color:white;
                                font-family:Poppins,sans-serif;
                                font-weight:600;
                                cursor:pointer;
                            "
                        >

                            <i class="fa-solid fa-calendar-check"></i>

                            Book Appointment Immediately

                        </button>


                        <button
                            type="button"
                            id="resultEmergencyHelp"

                            style="
                                border:none;
                                border-radius:9px;
                                padding:11px 18px;
                                background:#ef4444;
                                color:white;
                                font-family:Poppins,sans-serif;
                                font-weight:600;
                                cursor:pointer;
                            "
                        >

                            <i class="fa-solid fa-truck-medical"></i>

                            Emergency Help

                        </button>


                    </div>

                `;


            }


            resultRecommendation.innerHTML =
                recommendationHTML;


            /* =================================================
               ACTION BUTTON EVENTS
            ================================================= */

            const appointmentButton =
                document.getElementById(
                    "resultBookAppointment"
                );


            if (
                appointmentButton
            ) {


                appointmentButton.addEventListener(
                    "click",
                    function () {


                        window.location.href =
                            "appointment.html";


                    }
                );


            }


            const emergencyAppointmentButton =
                document.getElementById(
                    "resultEmergencyAppointment"
                );


            if (
                emergencyAppointmentButton
            ) {


                emergencyAppointmentButton.addEventListener(
                    "click",
                    function () {


                        window.location.href =
                            "appointment.html";


                    }
                );


            }


            const emergencyHelpButton =
                document.getElementById(
                    "resultEmergencyHelp"
                );


            if (
                emergencyHelpButton
            ) {


                emergencyHelpButton.addEventListener(
                    "click",
                    function () {


                        window.location.href =
                            "emergency.html";


                    }
                );


            }


            /* =================================================
               RISK DISPLAY
            ================================================= */

            const severity =
                assessment.severity
                    .toLowerCase();


            let riskColor =
                "#9ca3af";


            let label =
                "Assessment";


            if (
                severity ===
                "low"
            ) {


                riskColor =
                    "#22c55e";


                label =
                    "Low Risk";


            }


            else if (
                severity ===
                "moderate"
            ) {


                riskColor =
                    "#f59e0b";


                label =
                    "Moderate Risk";


            }


            else if (
                severity ===
                "high"
            ) {


                riskColor =
                    "#ef4444";


                label =
                    "High Risk";


            }


            if (
                resultSeverityBadge
            ) {


                resultSeverityBadge.className =
                    `severity-badge ${severity}`;


                resultSeverityBadge.textContent =
                    label;


            }


            if (
                resultSeverity
            ) {


                resultSeverity.className =
                    severity;


            }


            if (
                riskLabel
            ) {


                riskLabel.className =
                    `risk-label ${severity}`;


                riskLabel.textContent =
                    label;


            }


            if (
                riskCircle
            ) {


                riskCircle.style.setProperty(
                    "--risk-color",
                    riskColor
                );


            }


            animateRiskCircle(
                assessment.percentage
            );


        }


        /* =====================================================
           ANIMATED RISK CIRCLE
        ===================================================== */

        function animateRiskCircle(
            targetValue
        ) {


            if (
                !resultPercentage
                ||
                !riskCircle
            ) {


                return;

            }


            let currentValue =
                0;


            resultPercentage.textContent =
                "0%";


            riskCircle.style.setProperty(
                "--risk-value",
                0
            );


            const duration =
                850;


            const startTime =
                performance.now();


            function animate(
                currentTime
            ) {


                const elapsed =
                    currentTime -
                    startTime;


                const progress =
                    Math.min(

                        elapsed /
                        duration,

                        1

                    );


                currentValue =
                    Math.round(

                        targetValue *
                        progress

                    );


                riskCircle.style.setProperty(

                    "--risk-value",

                    currentValue

                );


                resultPercentage.textContent =
                    `${currentValue}%`;


                if (
                    progress < 1
                ) {


                    requestAnimationFrame(
                        animate
                    );


                }


            }


            requestAnimationFrame(
                animate
            );


        }


        /* =====================================================
           SAVE SYMPTOM HISTORY
        ===================================================== */

        async function saveSymptomHistory(
            historyData
        ) {


            const response =
                await fetch(

                    "http://localhost:8080/api/symptoms/save",

                    {


                        method:
                            "POST",


                        headers: {


                            "Content-Type":
                                "application/json"


                        },


                        body:
                            JSON.stringify(
                                historyData
                            )


                    }

                );


            if (!response.ok) {


                throw new Error(
                    "Unable to save symptom history"
                );


            }


            return await response.json();


        }


        /* =====================================================
           ESCAPE HTML
        ===================================================== */

        function escapeHTML(
            value
        ) {


            const element =
                document.createElement(
                    "div"
                );


            element.textContent =
                String(
                    value ?? ""
                );


            return element.innerHTML;


        }


        /* =====================================================
           INITIALISE
        ===================================================== */

        updateSelectedSymptoms();


    }
);