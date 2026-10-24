document.addEventListener(
    "DOMContentLoaded",
    function () {


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
           EMERGENCY CALL LINKS

           Do not preventDefault().
           The browser must handle tel: normally.
        ===================================================== */

        const callLinks =
            document.querySelectorAll(
                'a[href^="tel:"]'
            );


        callLinks.forEach(
            function (link) {


                link.addEventListener(
                    "click",
                    function () {


                        console.log(
                            "Emergency number selected:",
                            link.getAttribute("href")
                        );


                    }
                );


            }
        );


    }
);