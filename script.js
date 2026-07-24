document.addEventListener("DOMContentLoaded", () => {
    const galleryCards = Array.from(
        document.querySelectorAll(".gallery-card")
    );

    const filterButtons = Array.from(
        document.querySelectorAll(".filter-button")
    );

    const emptyMessage = document.querySelector(".empty-message");

    const lightbox = document.querySelector(".lightbox");
    const lightboxImage = document.querySelector(".lightbox-image");
    const lightboxCaption = document.querySelector(".lightbox-caption");
    const closeButton = document.querySelector(".lightbox-close");
    const previousButton = document.querySelector(".lightbox-previous");
    const nextButton = document.querySelector(".lightbox-next");

    const discordButtons = document.querySelectorAll(".copy-discord");

    let currentImageIndex = 0;


    /*
        Returns the gallery cards that are currently visible.
        This is used by the full-screen image viewer.
    */

    function getVisibleCards() {
        return galleryCards.filter((card) => !card.hidden);
    }


    /*
        Filters the gallery by category.
    */

    function filterGallery(category) {
        galleryCards.forEach((card) => {
            const cardCategory = card.dataset.category;

            const shouldShow =
                category === "all" ||
                cardCategory === category;

            card.hidden = !shouldShow;
        });

        const visibleCards = getVisibleCards();

        emptyMessage.hidden = visibleCards.length !== 0;
    }


    /*
        Changes which filter button looks selected.
    */

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedCategory = button.dataset.filter;

            filterButtons.forEach((otherButton) => {
                const isActive = otherButton === button;

                otherButton.classList.toggle("active", isActive);
                otherButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            filterGallery(selectedCategory);
        });
    });


    /*
        Shows an image inside the full-screen viewer.
    */

    function showLightboxImage(index) {
        const visibleCards = getVisibleCards();

        if (visibleCards.length === 0) {
            return;
        }

        if (index < 0) {
            index = visibleCards.length - 1;
        }

        if (index >= visibleCards.length) {
            index = 0;
        }

        currentImageIndex = index;

        const selectedCard = visibleCards[currentImageIndex];
        const selectedImage = selectedCard.querySelector("img");

        const title =
            selectedCard.dataset.title ||
            selectedImage.alt ||
            "Build";

        const category =
            selectedCard.dataset.category
                .replace("-", " ");

        lightboxImage.src = selectedImage.src;
        lightboxImage.alt = selectedImage.alt;

        lightboxCaption.textContent =
            `${title} · ${category}`;
    }


    /*
        Opens the full-screen viewer.
    */

    function openLightbox(card) {
        const visibleCards = getVisibleCards();
        const selectedIndex = visibleCards.indexOf(card);

        showLightboxImage(selectedIndex);

        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");

        document.body.classList.add("no-scroll");

        closeButton.focus();
    }


    /*
        Closes the full-screen viewer.
    */

    function closeLightbox() {
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");

        document.body.classList.remove("no-scroll");

        lightboxImage.src = "";
    }


    /*
        Opens images when they are clicked.
    */

    galleryCards.forEach((card) => {
        card.addEventListener("click", () => {
            openLightbox(card);
        });

        card.addEventListener("keydown", (event) => {
            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();
                openLightbox(card);
            }
        });
    });


    /*
        Lightbox buttons.
    */

    closeButton.addEventListener("click", closeLightbox);

    previousButton.addEventListener("click", () => {
        showLightboxImage(currentImageIndex - 1);
    });

    nextButton.addEventListener("click", () => {
        showLightboxImage(currentImageIndex + 1);
    });


    /*
        Close when clicking the dark background.
    */

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });


    /*
        Keyboard controls:
        Escape closes it.
        Arrow keys change image.
    */

    document.addEventListener("keydown", (event) => {
        const lightboxIsOpen =
            lightbox.classList.contains("open");

        if (!lightboxIsOpen) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowLeft") {
            showLightboxImage(currentImageIndex - 1);
        }

        if (event.key === "ArrowRight") {
            showLightboxImage(currentImageIndex + 1);
        }
    });


    /*
        Copies your Discord username.
    */

    discordButtons.forEach((button) => {
        const originalText = button.textContent.trim();

        button.addEventListener("click", async () => {
            const username = button.dataset.username;

            try {
                await navigator.clipboard.writeText(username);

                button.textContent = "copied ✓";
            } catch (error) {
                const temporaryInput =
                    document.createElement("textarea");

                temporaryInput.value = username;

                document.body.appendChild(temporaryInput);
                temporaryInput.select();

                document.execCommand("copy");

                temporaryInput.remove();

                button.textContent = "copied ✓";
            }

            window.setTimeout(() => {
                button.textContent = originalText;
            }, 1600);
        });
    });
});
