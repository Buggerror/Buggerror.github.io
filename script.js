const projectImages = document.querySelectorAll(".project-card img");

projectImages.forEach((image) => {
    image.addEventListener("click", () => {
        const overlay = document.createElement("div");

        overlay.className = "image-overlay";

        overlay.innerHTML = `
            <span class="close-image">&times;</span>
            <img src="${image.src}" alt="${image.alt}">
        `;

        document.body.appendChild(overlay);

        document.body.style.overflow = "hidden";

        const closeOverlay = () => {
            overlay.remove();
            document.body.style.overflow = "";
        };

        overlay.addEventListener("click", (event) => {
            if (
                event.target === overlay ||
                event.target.classList.contains("close-image")
            ) {
                closeOverlay();
            }
        });

        document.addEventListener(
            "keydown",
            (event) => {
                if (event.key === "Escape") {
                    closeOverlay();
                }
            },
            { once: true }
        );
    });
});
