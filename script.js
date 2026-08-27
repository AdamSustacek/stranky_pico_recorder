document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".btn-download");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.style.transform = "scale(0.98)";
            setTimeout(() => {
                btn.style.transform = "";
            }, 150);
        });
    });
});
