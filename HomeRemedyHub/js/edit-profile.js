document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       API ENDPOINTS
    ========================================================= */

    const PROFILE_API =
        "http://localhost:8080/api/users/profile";

    const UPDATE_API =
        "http://localhost:8080/api/users/update";


    /* =========================================================
       LOGGED-IN USER
    ========================================================= */

    const savedEmail =
        (localStorage.getItem("userEmail") || "").trim();

    const savedName =
        localStorage.getItem("userName") || "Patient";


    /* =========================================================
       FORM ELEMENTS
    ========================================================= */

    const editProfileForm =
        document.getElementById("editProfileForm");

    const userId =
        document.getElementById("userId");

    const fullName =
        document.getElementById("fullName");

    const email =
        document.getElementById("email");

    const phone =
        document.getElementById("phone");

    const location =
        document.getElementById("location");

    const gender =
        document.getElementById("gender");

    const dateOfBirth =
        document.getElementById("dateOfBirth");

    const bloodGroup =
        document.getElementById("bloodGroup");

    const height =
        document.getElementById("height");

    const weight =
        document.getElementById("weight");

    const role =
        document.getElementById("role");


    /* =========================================================
       HERO
    ========================================================= */

    const editHeroName =
        document.getElementById("editHeroName");

    const editHeroEmail =
        document.getElementById("editHeroEmail");


    /* =========================================================
       MESSAGE / BUTTON
    ========================================================= */

    const editProfileMessage =
        document.getElementById("editProfileMessage");

    const saveProfileBtn =
        document.getElementById("saveProfileBtn");


    /* =========================================================
       CHECK LOGIN
    ========================================================= */

    if (!savedEmail) {

        showMessage(
            "No logged-in user was found. Please login again.",
            "error"
        );

        disableForm();

        return;
    }


    /* =========================================================
       INITIAL HERO
    ========================================================= */

    if (editHeroName) {
        editHeroName.textContent = savedName;
    }

    if (editHeroEmail) {
        editHeroEmail.textContent = savedEmail;
    }


    /* =========================================================
       LOAD PROFILE
    ========================================================= */

    loadProfile();


    async function loadProfile() {

        try {

            showMessage(
                "Loading your profile information...",
                "loading"
            );


            if (saveProfileBtn) {
                saveProfileBtn.disabled = true;
            }


            const response =
                await fetch(
                    `${PROFILE_API}/${encodeURIComponent(savedEmail)}`
                );


            if (!response.ok) {

                throw new Error(
                    `Unable to load profile. Status: ${response.status}`
                );

            }


            const user =
                await response.json();


            console.log(
                "Edit profile data loaded:",
                user
            );


            populateForm(user);


            hideMessage();


        }

        catch (error) {

            console.error(
                "Profile loading error:",
                error
            );


            showMessage(
                "Unable to load profile information. Make sure the Spring Boot backend is running.",
                "error"
            );

        }

        finally {

            if (saveProfileBtn) {
                saveProfileBtn.disabled = false;
            }

        }

    }


    /* =========================================================
       POPULATE FORM
    ========================================================= */

    function populateForm(user) {

        if (!user) {
            return;
        }


        setInputValue(
            userId,
            user.id
        );


        setInputValue(
            fullName,
            firstValue(
                user.fullName,
                user.name,
                savedName
            )
        );


        setInputValue(
            email,
            firstValue(
                user.email,
                savedEmail
            )
        );


        setInputValue(
            phone,
            firstValue(
                user.phone,
                user.mobile,
                user.phoneNumber
            )
        );


        setInputValue(
            location,
            firstValue(
                user.location,
                user.city,
                user.address
            )
        );


        setSelectValue(
            gender,
            firstValue(
                user.gender
            )
        );


        setInputValue(
            dateOfBirth,
            formatDateForInput(
                firstValue(
                    user.dateOfBirth,
                    user.dob,
                    user.birthDate
                )
            )
        );


        setSelectValue(
            bloodGroup,
            firstValue(
                user.bloodGroup,
                user.bloodgroup
            )
        );


        setInputValue(
            height,
            cleanNumber(
                user.height
            )
        );


        setInputValue(
            weight,
            cleanNumber(
                user.weight
            )
        );


        setInputValue(
            role,
            firstValue(
                user.role,
                "Patient"
            )
        );


        /* =====================================================
           HERO
        ===================================================== */

        if (editHeroName) {

            editHeroName.textContent =
                firstValue(
                    user.fullName,
                    user.name,
                    savedName
                );

        }


        if (editHeroEmail) {

            editHeroEmail.textContent =
                firstValue(
                    user.email,
                    savedEmail
                );

        }

    }


    /* =========================================================
       FORM SUBMIT
    ========================================================= */

    if (editProfileForm) {

        editProfileForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                /* =================================================
                   VALIDATION
                ================================================= */

                if (!validateForm()) {
                    return;
                }


                /* =================================================
                   CREATE UPDATE OBJECT
                ================================================= */

                const updatedUser = {

                    id:
                        userId.value
                            ? Number(userId.value)
                            : null,

                    fullName:
                        fullName.value.trim(),

                    email:
                        email.value.trim(),

                    phone:
                        phone.value.trim(),

                    location:
                        location.value.trim(),

                    gender:
                        gender.value,

                    dateOfBirth:
                        dateOfBirth.value || null,

                    bloodGroup:
                        bloodGroup.value,

                    height:
                        height.value
                            ? Number(height.value)
                            : null,

                    weight:
                        weight.value
                            ? Number(weight.value)
                            : null,

                    role:
                        role.value.trim() || "Patient"

                };


                console.log(
                    "Updating profile:",
                    updatedUser
                );


                await updateProfile(
                    updatedUser
                );

            }
        );

    }


    /* =========================================================
       VALIDATION
    ========================================================= */

    function validateForm() {

        /* FULL NAME */

        if (
            !fullName.value.trim()
        ) {

            showMessage(
                "Please enter your full name.",
                "error"
            );

            fullName.focus();

            return false;
        }


        if (
            fullName.value.trim().length < 2
        ) {

            showMessage(
                "Please enter a valid full name.",
                "error"
            );

            fullName.focus();

            return false;
        }


        /* EMAIL */

        if (
            !email.value.trim()
        ) {

            showMessage(
                "Email address is missing.",
                "error"
            );

            return false;
        }


        /* PHONE */

        const phoneValue =
            phone.value
                .replace(/\s+/g, "")
                .trim();


        if (phoneValue) {

            const phonePattern =
                /^[0-9]{10}$/;


            if (
                !phonePattern.test(
                    phoneValue
                )
            ) {

                showMessage(
                    "Please enter a valid 10-digit mobile number.",
                    "error"
                );

                phone.focus();

                return false;
            }

        }


        /* DATE OF BIRTH */

        if (dateOfBirth.value) {

            const selectedDate =
                new Date(
                    dateOfBirth.value +
                    "T00:00:00"
                );


            const today =
                new Date();


            today.setHours(
                0,
                0,
                0,
                0
            );


            if (
                selectedDate > today
            ) {

                showMessage(
                    "Date of birth cannot be a future date.",
                    "error"
                );

                dateOfBirth.focus();

                return false;
            }

        }


        /* HEIGHT */

        if (height.value) {

            const heightValue =
                Number(height.value);


            if (
                heightValue < 50 ||
                heightValue > 250
            ) {

                showMessage(
                    "Please enter a height between 50 cm and 250 cm.",
                    "error"
                );

                height.focus();

                return false;
            }

        }


        /* WEIGHT */

        if (weight.value) {

            const weightValue =
                Number(weight.value);


            if (
                weightValue < 10 ||
                weightValue > 400
            ) {

                showMessage(
                    "Please enter a weight between 10 kg and 400 kg.",
                    "error"
                );

                weight.focus();

                return false;
            }

        }


        return true;

    }


    /* =========================================================
       UPDATE PROFILE
    ========================================================= */

    async function updateProfile(updatedUser) {

        try {

            /* =================================================
               LOADING
            ================================================= */

            if (saveProfileBtn) {

                saveProfileBtn.disabled =
                    true;


                saveProfileBtn.innerHTML = `

                    <i class="fa-solid fa-spinner fa-spin"></i>

                    Saving Changes...

                `;

            }


            showMessage(
                "Updating your profile...",
                "loading"
            );


            /* =================================================
               SEND TO SPRING BOOT
            ================================================= */

            const response =
                await fetch(
                    UPDATE_API,
                    {

                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                updatedUser
                            )

                    }
                );


            if (!response.ok) {

                let errorMessage =
                    `Unable to update profile. Status: ${response.status}`;


                try {

                    const errorText =
                        await response.text();


                    if (errorText) {
                        errorMessage =
                            errorText;
                    }

                }

                catch (error) {

                    console.log(
                        "Unable to read server error message."
                    );

                }


                throw new Error(
                    errorMessage
                );

            }


            /* =================================================
               READ UPDATED RESPONSE
            ================================================= */

            let result = null;


            const responseText =
                await response.text();


            if (responseText) {

                try {

                    result =
                        JSON.parse(
                            responseText
                        );

                }

                catch (error) {

                    result =
                        responseText;

                }

            }


            console.log(
                "Profile updated successfully:",
                result
            );


            /* =================================================
               UPDATE LOCAL STORAGE
            ================================================= */

            localStorage.setItem(
                "userName",
                updatedUser.fullName
            );


            localStorage.setItem(
                "userEmail",
                updatedUser.email
            );


            if (updatedUser.id) {

                localStorage.setItem(
                    "userId",
                    String(updatedUser.id)
                );

            }


            /* =================================================
               UPDATE HERO
            ================================================= */

            if (editHeroName) {

                editHeroName.textContent =
                    updatedUser.fullName;

            }


            if (editHeroEmail) {

                editHeroEmail.textContent =
                    updatedUser.email;

            }


            /* =================================================
               SUCCESS
            ================================================= */

            showMessage(
                "Profile updated successfully! Redirecting to your profile...",
                "success"
            );


            if (saveProfileBtn) {

                saveProfileBtn.innerHTML = `

                    <i class="fa-solid fa-circle-check"></i>

                    Saved

                `;

            }


            /* =================================================
               RETURN TO PROFILE
            ================================================= */

            setTimeout(
                function () {

                    window.location.href =
                        "profile.html";

                },
                1400
            );

        }

        catch (error) {

            console.error(
                "Profile update error:",
                error
            );


            showMessage(
                "Unable to update your profile. Please make sure the backend is running and try again.",
                "error"
            );


            resetSaveButton();

        }

    }


    /* =========================================================
       RESET SAVE BUTTON
    ========================================================= */

    function resetSaveButton() {

        if (!saveProfileBtn) {
            return;
        }


        saveProfileBtn.disabled =
            false;


        saveProfileBtn.innerHTML = `

            <i class="fa-solid fa-floppy-disk"></i>

            Save Changes

        `;

    }


    /* =========================================================
       SET INPUT VALUE
    ========================================================= */

    function setInputValue(
        element,
        value
    ) {

        if (!element) {
            return;
        }


        if (
            value === null ||
            value === undefined
        ) {

            element.value =
                "";

            return;
        }


        element.value =
            String(value).trim();

    }


    /* =========================================================
       SET SELECT VALUE
    ========================================================= */

    function setSelectValue(
        select,
        value
    ) {

        if (!select) {
            return;
        }


        const target =
            String(
                value || ""
            )
            .trim();


        if (!target) {

            select.value =
                "";

            return;

        }


        const options =
            Array.from(
                select.options
            );


        const matchingOption =
            options.find(
                function (option) {

                    return (
                        option.value
                            .trim()
                            .toLowerCase()
                        ===
                        target
                            .toLowerCase()
                    );

                }
            );


        if (matchingOption) {

            select.value =
                matchingOption.value;

        }

        else {

            select.value =
                "";

        }

    }


    /* =========================================================
       FIRST VALID VALUE
    ========================================================= */

    function firstValue(
        ...values
    ) {

        for (
            const value
            of values
        ) {

            if (
                value !== null &&
                value !== undefined &&
                String(value).trim() !== ""
            ) {

                return String(value)
                    .trim();

            }

        }


        return "";

    }


    /* =========================================================
       CLEAN HEIGHT / WEIGHT NUMBER
    ========================================================= */

    function cleanNumber(value) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return "";

        }


        const match =
            String(value)
                .match(
                    /-?\d+(\.\d+)?/
                );


        return match
            ? match[0]
            : "";

    }


    /* =========================================================
       FORMAT DATE FOR INPUT
       Converts dates to YYYY-MM-DD
    ========================================================= */

    function formatDateForInput(
        value
    ) {

        if (!value) {

            return "";

        }


        const text =
            String(value)
                .trim();


        /*
           Already YYYY-MM-DD
        */

        const simpleDatePattern =
            /^\d{4}-\d{2}-\d{2}$/;


        if (
            simpleDatePattern.test(
                text
            )
        ) {

            return text;

        }


        const date =
            new Date(text);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "";

        }


        const year =
            date.getFullYear();


        const month =
            String(
                date.getMonth() + 1
            )
            .padStart(
                2,
                "0"
            );


        const day =
            String(
                date.getDate()
            )
            .padStart(
                2,
                "0"
            );


        return `${year}-${month}-${day}`;

    }


    /* =========================================================
       SHOW MESSAGE
    ========================================================= */

    function showMessage(
        message,
        type
    ) {

        if (!editProfileMessage) {
            return;
        }


        editProfileMessage.className =
            "edit-message";


        if (
            type === "success"
        ) {

            editProfileMessage
                .classList
                .add("success");


            editProfileMessage.innerHTML = `

                <i class="fa-solid fa-circle-check"></i>

                ${escapeHTML(message)}

            `;

        }

        else if (
            type === "error"
        ) {

            editProfileMessage
                .classList
                .add("error");


            editProfileMessage.innerHTML = `

                <i class="fa-solid fa-circle-exclamation"></i>

                ${escapeHTML(message)}

            `;

        }

        else {

            editProfileMessage
                .classList
                .add("loading");


            editProfileMessage.innerHTML = `

                <i class="fa-solid fa-spinner fa-spin"></i>

                ${escapeHTML(message)}

            `;

        }

    }


    /* =========================================================
       HIDE MESSAGE
    ========================================================= */

    function hideMessage() {

        if (!editProfileMessage) {
            return;
        }


        editProfileMessage.className =
            "edit-message hidden";


        editProfileMessage.innerHTML =
            "";

    }


    /* =========================================================
       DISABLE FORM
    ========================================================= */

    function disableForm() {

        if (!editProfileForm) {
            return;
        }


        const fields =
            editProfileForm.querySelectorAll(
                "input, select, button"
            );


        fields.forEach(
            function (field) {

                field.disabled =
                    true;

            }
        );

    }


    /* =========================================================
       PROFILE IMAGE FALLBACK
    ========================================================= */

    const profileImages =
        document.querySelectorAll(
            ".profile-top img, .hero-avatar img"
        );


    profileImages.forEach(
        function (image) {

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

        }
    );


    /* =========================================================
       ESCAPE HTML
    ========================================================= */

    function escapeHTML(value) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            String(value);


        return div.innerHTML;

    }

});