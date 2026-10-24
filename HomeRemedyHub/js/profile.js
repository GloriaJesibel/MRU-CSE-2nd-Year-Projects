document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       BACKEND API
    ========================================================= */

    const PROFILE_API =
        "http://localhost:8080/api/users/profile";


    /* =========================================================
       LOGGED-IN USER
    ========================================================= */

    const userEmail =
        (localStorage.getItem("userEmail") || "").trim();


    /* =========================================================
       ELEMENTS
    ========================================================= */

    const profileFullName =
        document.getElementById("profileFullName");

    const profileHeroEmail =
        document.getElementById("profileHeroEmail");

    const profileHeroLocation =
        document.getElementById("profileHeroLocation");

    const profileHeroBloodGroup =
        document.getElementById("profileHeroBloodGroup");


    /* SUMMARY */

    const summaryBloodGroup =
        document.getElementById("summaryBloodGroup");

    const summaryGender =
        document.getElementById("summaryGender");

    const summaryHeight =
        document.getElementById("summaryHeight");

    const summaryWeight =
        document.getElementById("summaryWeight");


    /* PERSONAL DETAILS */

    const detailFullName =
        document.getElementById("detailFullName");

    const detailEmail =
        document.getElementById("detailEmail");

    const detailPhone =
        document.getElementById("detailPhone");

    const detailLocation =
        document.getElementById("detailLocation");

    const detailGender =
        document.getElementById("detailGender");

    const detailDateOfBirth =
        document.getElementById("detailDateOfBirth");


    /* HEALTH DETAILS */

    const detailBloodGroup =
        document.getElementById("detailBloodGroup");

    const detailHeight =
        document.getElementById("detailHeight");

    const detailWeight =
        document.getElementById("detailWeight");

    const detailRole =
        document.getElementById("detailRole");


    /* MESSAGE */

    const profileMessage =
        document.getElementById("profileMessage");


    /* =========================================================
       INITIAL CHECK
    ========================================================= */

    if (!userEmail) {

        showMessage(
            "No logged-in user was found. Please log in again.",
            "error"
        );


        setDefaultProfile();

        return;

    }


    /* =========================================================
       LOAD PROFILE
    ========================================================= */

    loadProfile();


    async function loadProfile() {

        try {

            showMessage(
                "Loading profile...",
                "loading"
            );


            const response =
                await fetch(
                    `${PROFILE_API}/${encodeURIComponent(userEmail)}`
                );


            if (!response.ok) {

                throw new Error(
                    `Profile request failed with status ${response.status}`
                );

            }


            const user =
                await response.json();


            console.log(
                "Profile loaded:",
                user
            );


            displayProfile(user);


            showMessage(
                "Profile loaded successfully.",
                "success"
            );


            /*
               Hide success message
               after a short delay.
            */

            setTimeout(function () {

                if (profileMessage) {

                    profileMessage.classList.add(
                        "hidden"
                    );

                }

            }, 1800);

        }

        catch (error) {

            console.error(
                "Profile loading error:",
                error
            );


            showMessage(
                "Unable to load your profile. Make sure the Spring Boot backend is running.",
                "error"
            );


            loadBasicLocalProfile();

        }

    }


    /* =========================================================
       DISPLAY PROFILE
    ========================================================= */

    function displayProfile(user) {

        if (!user) {

            setDefaultProfile();

            return;

        }


        /* =====================================================
           READ VALUES SAFELY
        ===================================================== */

        const fullName =
            getValue(
                user.fullName,
                user.name,
                localStorage.getItem("userName"),
                "Patient"
            );


        const email =
            getValue(
                user.email,
                userEmail,
                "Not available"
            );


        const phone =
            getValue(
                user.phone,
                user.mobile,
                user.phoneNumber,
                "Not provided"
            );


        const location =
            getValue(
                user.location,
                user.city,
                user.address,
                "Not provided"
            );


        const gender =
            getValue(
                user.gender,
                "Not provided"
            );


        const bloodGroup =
            getValue(
                user.bloodGroup,
                user.bloodgroup,
                "Not provided"
            );


        const height =
            getValue(
                user.height,
                "Not provided"
            );


        const weight =
            getValue(
                user.weight,
                "Not provided"
            );


        const dateOfBirth =
            getValue(
                user.dateOfBirth,
                user.dob,
                user.birthDate,
                ""
            );


        const role =
            getValue(
                user.role,
                "Patient"
            );


        /* =====================================================
           HERO
        ===================================================== */

        setText(
            profileFullName,
            fullName
        );


        setText(
            profileHeroEmail,
            email
        );


        setText(
            profileHeroLocation,
            location === "Not provided"
                ? "Location not available"
                : location
        );


        setText(
            profileHeroBloodGroup,
            bloodGroup === "Not provided"
                ? "Blood group not available"
                : `Blood Group ${bloodGroup}`
        );


        /* =====================================================
           SUMMARY CARDS
        ===================================================== */

        setText(
            summaryBloodGroup,
            bloodGroup === "Not provided"
                ? "—"
                : bloodGroup
        );


        setText(
            summaryGender,
            gender === "Not provided"
                ? "—"
                : gender
        );


        setText(
            summaryHeight,
            formatHeight(height)
        );


        setText(
            summaryWeight,
            formatWeight(weight)
        );


        /* =====================================================
           PERSONAL INFORMATION
        ===================================================== */

        setText(
            detailFullName,
            fullName
        );


        setText(
            detailEmail,
            email
        );


        setText(
            detailPhone,
            phone
        );


        setText(
            detailLocation,
            location
        );


        setText(
            detailGender,
            gender
        );


        setText(
            detailDateOfBirth,
            formatDateOfBirth(
                dateOfBirth
            )
        );


        /* =====================================================
           HEALTH INFORMATION
        ===================================================== */

        setText(
            detailBloodGroup,
            bloodGroup
        );


        setText(
            detailHeight,
            formatHeight(height)
        );


        setText(
            detailWeight,
            formatWeight(weight)
        );


        setText(
            detailRole,
            formatRole(role)
        );


        /* =====================================================
           UPDATE LOCAL STORAGE
        ===================================================== */

        if (
            fullName &&
            fullName !== "Patient"
        ) {

            localStorage.setItem(
                "userName",
                fullName
            );

        }


        if (email) {

            localStorage.setItem(
                "userEmail",
                email
            );

        }


        if (user.id) {

            localStorage.setItem(
                "userId",
                user.id
            );

        }

    }


    /* =========================================================
       BASIC LOCAL PROFILE FALLBACK
    ========================================================= */

    function loadBasicLocalProfile() {

        const savedName =
            localStorage.getItem("userName") ||
            "Patient";


        const savedEmail =
            localStorage.getItem("userEmail") ||
            "Not available";


        setText(
            profileFullName,
            savedName
        );


        setText(
            profileHeroEmail,
            savedEmail
        );


        setText(
            detailFullName,
            savedName
        );


        setText(
            detailEmail,
            savedEmail
        );

    }


    /* =========================================================
       DEFAULT PROFILE
    ========================================================= */

    function setDefaultProfile() {

        setText(
            profileFullName,
            "Patient"
        );


        setText(
            profileHeroEmail,
            "Account information unavailable"
        );


        setText(
            profileHeroLocation,
            "Location not available"
        );


        setText(
            profileHeroBloodGroup,
            "Blood group not available"
        );


        setText(
            summaryBloodGroup,
            "—"
        );


        setText(
            summaryGender,
            "—"
        );


        setText(
            summaryHeight,
            "—"
        );


        setText(
            summaryWeight,
            "—"
        );


        setText(
            detailFullName,
            "Not available"
        );


        setText(
            detailEmail,
            "Not available"
        );


        setText(
            detailPhone,
            "Not provided"
        );


        setText(
            detailLocation,
            "Not provided"
        );


        setText(
            detailGender,
            "Not provided"
        );


        setText(
            detailDateOfBirth,
            "Not provided"
        );


        setText(
            detailBloodGroup,
            "Not provided"
        );


        setText(
            detailHeight,
            "Not provided"
        );


        setText(
            detailWeight,
            "Not provided"
        );


        setText(
            detailRole,
            "Patient"
        );

    }


    /* =========================================================
       FORMAT DATE OF BIRTH
    ========================================================= */

    function formatDateOfBirth(value) {

        if (!value) {

            return "Not provided";

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


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    }


    /* =========================================================
       FORMAT HEIGHT
    ========================================================= */

    function formatHeight(value) {

        if (
            value === null ||
            value === undefined ||
            value === "" ||
            value === "Not provided"
        ) {

            return "—";

        }


        const text =
            String(value).trim();


        /*
           If backend already sends a unit,
           don't add another one.
        */

        if (
            text.toLowerCase().includes("cm") ||
            text.toLowerCase().includes("ft") ||
            text.includes("'")
        ) {

            return text;

        }


        return `${text} cm`;

    }


    /* =========================================================
       FORMAT WEIGHT
    ========================================================= */

    function formatWeight(value) {

        if (
            value === null ||
            value === undefined ||
            value === "" ||
            value === "Not provided"
        ) {

            return "—";

        }


        const text =
            String(value).trim();


        if (
            text.toLowerCase().includes("kg")
        ) {

            return text;

        }


        return `${text} kg`;

    }


    /* =========================================================
       FORMAT ROLE
    ========================================================= */

    function formatRole(value) {

        if (!value) {

            return "Patient";

        }


        const text =
            String(value)
                .replace(/_/g, " ")
                .trim()
                .toLowerCase();


        return text
            .split(" ")
            .map(function (word) {

                if (!word) {
                    return "";
                }


                return (
                    word.charAt(0).toUpperCase() +
                    word.slice(1)
                );

            })
            .join(" ");

    }


    /* =========================================================
       GET FIRST VALID VALUE
    ========================================================= */

    function getValue(...values) {

        for (const value of values) {

            if (
                value !== null &&
                value !== undefined &&
                String(value).trim() !== ""
            ) {

                return String(value).trim();

            }

        }


        return "";

    }


    /* =========================================================
       SET TEXT
    ========================================================= */

    function setText(element, value) {

        if (!element) {
            return;
        }


        element.textContent =
            value === null ||
            value === undefined ||
            value === ""
                ? "Not provided"
                : value;

    }


    /* =========================================================
       MESSAGE
    ========================================================= */

    function showMessage(message, type) {

        if (!profileMessage) {
            return;
        }


        profileMessage.className =
            "profile-message";


        if (type === "success") {

            profileMessage.classList.add(
                "success"
            );


            profileMessage.innerHTML = `

                <i class="fa-solid fa-circle-check"></i>

                ${escapeHTML(message)}

            `;

        }

        else if (type === "error") {

            profileMessage.classList.add(
                "error"
            );


            profileMessage.innerHTML = `

                <i class="fa-solid fa-circle-exclamation"></i>

                ${escapeHTML(message)}

            `;

        }

        else {

            profileMessage.innerHTML = `

                <i class="fa-solid fa-spinner fa-spin"></i>

                ${escapeHTML(message)}

            `;

        }

    }


    /* =========================================================
       PROFILE IMAGE FALLBACK
    ========================================================= */

    const profileImages =
        document.querySelectorAll(
            ".profile-top img, .profile-avatar-large img"
        );


    profileImages.forEach(function (image) {

        image.addEventListener(
            "error",
            function () {

                image.style.display =
                    "none";


                const fallback =
                    image.nextElementSibling;


                if (fallback) {

                    fallback.style.display =
                        "flex";

                }

            }
        );

    });


    /* =========================================================
       ESCAPE HTML
    ========================================================= */

    function escapeHTML(value) {

        const div =
            document.createElement("div");


        div.textContent =
            String(value);


        return div.innerHTML;

    }

});