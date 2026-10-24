document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           API
        ===================================================== */

        const HISTORY_API =
            "http://localhost:8080/api/symptoms/history";


        const DELETE_API =
            "http://localhost:8080/api/symptoms/delete";


        const DELETE_ALL_API =
            "http://localhost:8080/api/symptoms/delete-all";



        /* =====================================================
           LOGGED-IN USER
        ===================================================== */

        const userEmail =
            (
                localStorage.getItem("userEmail")
                || ""
            )
            .trim()
            .toLowerCase();



        /* =====================================================
           ELEMENTS
        ===================================================== */

        const totalRecords =
            document.getElementById(
                "totalRecords"
            );


        const latestCondition =
            document.getElementById(
                "latestCondition"
            );


        const latestSeverity =
            document.getElementById(
                "latestSeverity"
            );


        const latestPercentage =
            document.getElementById(
                "latestPercentage"
            );


        const historySearch =
            document.getElementById(
                "historySearch"
            );


        const filterButtons =
            document.querySelectorAll(
                ".filter-btn"
            );


        const healthHistoryList =
            document.getElementById(
                "healthHistoryList"
            );


        const historyEmptyState =
            document.getElementById(
                "historyEmptyState"
            );


        const recordCount =
            document.getElementById(
                "recordCount"
            );


        const deleteAllHistoryBtn =
            document.getElementById(
                "deleteAllHistoryBtn"
            );



        /* =====================================================
           STATE
        ===================================================== */

        let allUserRecords = [];

        let activeFilter = "all";



        /* =====================================================
           LOAD HISTORY
        ===================================================== */

        loadHealthHistory();



        async function loadHealthHistory() {


            try {


                showLoadingState();


                const response =
                    await fetch(
                        HISTORY_API
                    );


                if (!response.ok) {

                    throw new Error(
                        "Unable to load history"
                    );

                }


                const data =
                    await response.json();


                const records =
                    Array.isArray(data)
                        ? data
                        : [];


                /* CURRENT USER ONLY */

                allUserRecords =
                    records.filter(
                        function (record) {


                            const recordEmail =
                                String(
                                    record.userEmail || ""
                                )
                                .trim()
                                .toLowerCase();


                            return (

                                userEmail &&
                                recordEmail === userEmail

                            );


                        }
                    );


                /* NEWEST FIRST */

                allUserRecords.sort(
                    function (a, b) {


                        const idA =
                            Number(a.id || 0);


                        const idB =
                            Number(b.id || 0);


                        if (idA !== idB) {

                            return idB - idA;

                        }


                        return (
                            getRecordTimestamp(b)
                            -
                            getRecordTimestamp(a)
                        );


                    }
                );


                updateSummary();

                applyFilters();


            }


            catch (error) {


                console.error(
                    "Health history error:",
                    error
                );


                showErrorState();


            }


        }



        /* =====================================================
           SUMMARY
        ===================================================== */

        function updateSummary() {


            setText(
                totalRecords,
                allUserRecords.length
            );


            if (deleteAllHistoryBtn) {

                deleteAllHistoryBtn.style.display =

                    allUserRecords.length > 0

                        ? "flex"

                        : "none";

            }


            if (
                allUserRecords.length === 0
            ) {


                setText(
                    latestCondition,
                    "No Data"
                );


                setText(
                    latestSeverity,
                    "No Data"
                );


                setText(
                    latestPercentage,
                    "0%"
                );


                if (latestSeverity) {

                    latestSeverity.style.color =
                        "";

                }


                return;


            }


            const latest =
                allUserRecords[0];


            setText(

                latestCondition,

                latest.possibleCondition
                ||
                "Not Available"

            );


            setText(

                latestSeverity,

                latest.severity
                ||
                "Not Available"

            );


            const percentage =
                normalizePercentage(
                    latest.percentage
                );


            setText(

                latestPercentage,

                `${percentage}%`

            );


            setSeverityColor(
                latest.severity
            );


        }



        /* =====================================================
           SEVERITY COLOR
        ===================================================== */

        function setSeverityColor(
            severity
        ) {


            if (!latestSeverity) {
                return;
            }


            latestSeverity.style.color =
                "";


            const value =
                normalizeSeverity(
                    severity
                );


            if (value === "high") {

                latestSeverity.style.color =
                    "var(--red)";

            }


            else if (
                value === "moderate"
            ) {

                latestSeverity.style.color =
                    "var(--yellow)";

            }


            else if (
                value === "low"
            ) {

                latestSeverity.style.color =
                    "var(--green)";

            }


        }



        /* =====================================================
           SEARCH
        ===================================================== */

        if (historySearch) {


            historySearch.addEventListener(
                "input",
                applyFilters
            );


        }



        /* =====================================================
           FILTERS
        ===================================================== */

        filterButtons.forEach(
            function (button) {


                button.addEventListener(
                    "click",
                    function () {


                        filterButtons.forEach(
                            function (item) {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        button.classList.add(
                            "active"
                        );


                        activeFilter =
                            button.dataset.filter
                            ||
                            "all";


                        applyFilters();


                    }
                );


            }
        );



        /* =====================================================
           APPLY SEARCH + FILTER
        ===================================================== */

        function applyFilters() {


            const searchValue =
                historySearch

                    ? historySearch.value
                        .trim()
                        .toLowerCase()

                    : "";


            const filteredRecords =
                allUserRecords.filter(
                    function (record) {


                        const symptoms =
                            String(
                                record.symptoms || ""
                            )
                            .toLowerCase();


                        const condition =
                            String(
                                record.possibleCondition || ""
                            )
                            .toLowerCase();


                        const severity =
                            String(
                                record.severity || ""
                            )
                            .toLowerCase();


                        const matchesSearch =

                            symptoms.includes(
                                searchValue
                            )

                            ||

                            condition.includes(
                                searchValue
                            )

                            ||

                            severity.includes(
                                searchValue
                            );


                        let matchesFilter =
                            true;


                        if (
                            activeFilter !== "all"
                        ) {


                            matchesFilter =

                                normalizeSeverity(
                                    severity
                                )

                                ===

                                activeFilter;


                        }


                        return (

                            matchesSearch
                            &&
                            matchesFilter

                        );


                    }
                );


            renderRecords(
                filteredRecords
            );


        }



        /* =====================================================
           DISPLAY RECORDS
        ===================================================== */

        function renderRecords(
            records
        ) {


            if (!healthHistoryList) {
                return;
            }


            healthHistoryList.innerHTML =
                "";


            updateRecordCount(
                records.length
            );


            if (
                records.length === 0
            ) {


                showEmptyState();

                return;


            }


            hideEmptyState();


            records.forEach(
                function (record) {


                    healthHistoryList
                        .appendChild(

                            createHistoryCard(
                                record
                            )

                        );


                }
            );


        }



        /* =====================================================
           CREATE RECORD CARD
        ===================================================== */

        function createHistoryCard(
            record
        ) {


            const severity =
                record.severity
                ||
                "Not Available";


            const percentage =
                normalizePercentage(
                    record.percentage
                );


            const condition =
                record.possibleCondition
                ||
                "Not Available";


            const symptoms =
                record.symptoms
                ||
                "No symptoms recorded";


            const analysisDate =
                getRecordDate(
                    record
                );


            const severityClass =
                getSeverityClass(
                    severity
                );


            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "history-record";


            article.innerHTML = `

                <div class="history-record-top">


                    <div class="history-condition">


                        <div class="history-condition-icon">

                            <i class="fa-solid fa-stethoscope"></i>

                        </div>


                        <div>

                            <span>
                                POSSIBLE CONDITION
                            </span>

                            <h3>
                                ${escapeHTML(condition)}
                            </h3>

                        </div>


                    </div>


                    <div
                        class="severity-badge ${severityClass}">

                        ${escapeHTML(severity)}

                    </div>


                </div>



                <div class="history-record-body">


                    <div
                        class="history-detail symptom-detail">

                        <span>
                            Symptoms
                        </span>

                        <strong>
                            ${escapeHTML(symptoms)}
                        </strong>

                    </div>


                    <div class="history-detail">

                        <span>
                            Severity
                        </span>

                        <strong>
                            ${escapeHTML(severity)}
                        </strong>

                    </div>


                    <div class="history-detail">

                        <span>
                            Assessment Score
                        </span>

                        <strong>
                            ${percentage}%
                        </strong>

                    </div>


                </div>



                <div class="match-wrapper">


                    <div class="match-heading">

                        <span>
                            Assessment score
                        </span>

                        <strong>
                            ${percentage}%
                        </strong>

                    </div>


                    <div class="match-track">

                        <div
                            class="match-bar"
                            style="width:${percentage}%;">
                        </div>

                    </div>


                </div>



                <div class="history-record-footer">


                    <div class="history-date">

                        <i class="fa-regular fa-calendar"></i>

                        <span>
                            ${escapeHTML(analysisDate)}
                        </span>

                    </div>


                    <button
                        type="button"
                        class="delete-record-btn">

                        <i class="fa-solid fa-trash"></i>

                        Delete

                    </button>


                </div>

            `;


            const deleteButton =
                article.querySelector(
                    ".delete-record-btn"
                );


            deleteButton.addEventListener(
                "click",
                function () {


                    deleteSingleRecord(
                        record.id,
                        deleteButton
                    );


                }
            );


            return article;


        }



        /* =====================================================
           DELETE ONE RECORD
        ===================================================== */

        async function deleteSingleRecord(
            id,
            button
        ) {


            const confirmed =
                window.confirm(

                    "Are you sure you want to delete this health record?"

                );


            if (!confirmed) {
                return;
            }


            try {


                button.disabled =
                    true;


                button.innerHTML =
                    '<i class="fa-solid fa-spinner fa-spin"></i> Deleting...';


                const response =
                    await fetch(

                        `${DELETE_API}/${id}?userEmail=${encodeURIComponent(userEmail)}`,

                        {
                            method: "DELETE"
                        }

                    );


                if (!response.ok) {

                    throw new Error(
                        "Delete failed"
                    );

                }


                allUserRecords =
                    allUserRecords.filter(
                        function (record) {


                            return (

                                Number(record.id)
                                !==
                                Number(id)

                            );


                        }
                    );


                updateSummary();

                applyFilters();


            }


            catch (error) {


                console.error(
                    "Delete error:",
                    error
                );


                alert(
                    "Unable to delete this record."
                );


                button.disabled =
                    false;


                button.innerHTML =
                    '<i class="fa-solid fa-trash"></i> Delete';


            }


        }



        /* =====================================================
           DELETE ALL
        ===================================================== */

        if (deleteAllHistoryBtn) {


            deleteAllHistoryBtn
                .addEventListener(
                    "click",
                    deleteAllHistory
                );


        }



        async function deleteAllHistory() {


            if (
                allUserRecords.length === 0
            ) {

                return;

            }


            const confirmed =
                window.confirm(

                    "Are you sure you want to delete ALL health history?\n\nThis cannot be undone."

                );


            if (!confirmed) {
                return;
            }


            try {


                deleteAllHistoryBtn.disabled =
                    true;


                deleteAllHistoryBtn.innerHTML =
                    '<i class="fa-solid fa-spinner fa-spin"></i> Deleting...';


                const response =
                    await fetch(

                        `${DELETE_ALL_API}?userEmail=${encodeURIComponent(userEmail)}`,

                        {
                            method: "DELETE"
                        }

                    );


                if (!response.ok) {

                    throw new Error(
                        "Delete all failed"
                    );

                }


                allUserRecords =
                    [];


                updateSummary();

                applyFilters();


                alert(
                    "All health history deleted successfully."
                );


            }


            catch (error) {


                console.error(
                    "Delete all error:",
                    error
                );


                alert(
                    "Unable to delete health history."
                );


            }


            finally {


                deleteAllHistoryBtn.disabled =
                    false;


                deleteAllHistoryBtn.innerHTML =
                    '<i class="fa-solid fa-trash"></i> Delete All';


                if (
                    allUserRecords.length === 0
                ) {

                    deleteAllHistoryBtn
                        .style
                        .display =
                        "none";

                }


            }


        }



        /* =====================================================
           SEVERITY CLASS
        ===================================================== */

        function getSeverityClass(
            severity
        ) {


            const value =
                normalizeSeverity(
                    severity
                );


            if (value === "low") {

                return "severity-low";

            }


            if (
                value === "moderate"
            ) {

                return "severity-moderate";

            }


            if (value === "high") {

                return "severity-high";

            }


            return "severity-default";


        }



        function normalizeSeverity(
            severity
        ) {


            const value =
                String(
                    severity || ""
                )
                .trim()
                .toLowerCase();


            if (

                value.includes("critical")
                ||
                value.includes("severe")
                ||
                value.includes("high")

            ) {

                return "high";

            }


            if (

                value.includes("moderate")
                ||
                value.includes("medium")

            ) {

                return "moderate";

            }


            if (

                value.includes("mild")
                ||
                value.includes("low")

            ) {

                return "low";

            }


            return "other";


        }



        /* =====================================================
           PERCENTAGE
        ===================================================== */

        function normalizePercentage(
            value
        ) {


            let number =
                Number(value);


            if (
                Number.isNaN(number)
            ) {

                number = 0;

            }


            number =
                Math.round(number);


            return Math.max(
                0,
                Math.min(
                    100,
                    number
                )
            );


        }



        /* =====================================================
           DATE
        ===================================================== */

        function getRecordDate(
            record
        ) {


            const value =

                record.analysisDate
                ||
                record.createdAt
                ||
                record.date;


            if (!value) {

                return "Date not available";

            }


            const date =
                new Date(value);


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return String(value);

            }


            return date.toLocaleString(

                "en-IN",

                {

                    day: "2-digit",

                    month: "short",

                    year: "numeric",

                    hour: "2-digit",

                    minute: "2-digit"

                }

            );


        }



        function getRecordTimestamp(
            record
        ) {


            const value =

                record.analysisDate
                ||
                record.createdAt
                ||
                record.date;


            if (!value) {

                return 0;

            }


            const timestamp =
                new Date(value)
                    .getTime();


            return Number.isNaN(
                timestamp
            )

                ? 0

                : timestamp;


        }



        /* =====================================================
           RECORD COUNT
        ===================================================== */

        function updateRecordCount(
            count
        ) {


            if (!recordCount) {
                return;
            }


            recordCount.textContent =

                count === 1

                    ? "1 record available"

                    : `${count} records available`;


        }



        /* =====================================================
           EMPTY STATE
        ===================================================== */

        function showEmptyState() {


            if (historyEmptyState) {

                historyEmptyState
                    .style
                    .display =
                    "block";

            }


        }



        function hideEmptyState() {


            if (historyEmptyState) {

                historyEmptyState
                    .style
                    .display =
                    "none";

            }


        }



        /* =====================================================
           LOADING
        ===================================================== */

        function showLoadingState() {


            if (!healthHistoryList) {
                return;
            }


            hideEmptyState();


            healthHistoryList.innerHTML = `

                <div class="history-loading">

                    <i class="fa-solid fa-spinner fa-spin"></i>

                    Loading your health records...

                </div>

            `;


        }



        /* =====================================================
           ERROR
        ===================================================== */

        function showErrorState() {


            if (healthHistoryList) {


                healthHistoryList.innerHTML = `

                    <div class="history-error">

                        <i class="fa-solid fa-circle-exclamation"></i>

                        Unable to load health records.

                    </div>

                `;


            }


            updateRecordCount(0);


            setText(
                totalRecords,
                "0"
            );


            setText(
                latestCondition,
                "Unavailable"
            );


            setText(
                latestSeverity,
                "Unavailable"
            );


            setText(
                latestPercentage,
                "0%"
            );


            if (deleteAllHistoryBtn) {

                deleteAllHistoryBtn
                    .style
                    .display =
                    "none";

            }


        }



        /* =====================================================
           PROFILE IMAGE
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
           HELPERS
        ===================================================== */

        function setText(
            element,
            value
        ) {


            if (element) {

                element.textContent =
                    value;

            }


        }



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