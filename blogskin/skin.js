
const params = new URLSearchParams(window.location.search);

    if (params.get("page") === "post") {
        document.body.classList.remove("home-page");
        document.body.classList.add("post-page");
    }

document.querySelectorAll(".side-book").forEach(book => {
    book.addEventListener("click", event => {
        event.preventDefault();

        const group = book.closest(".category-group");

        document.querySelectorAll(".side-book").forEach(item => {
            item.classList.remove("active");
        });

        document.querySelectorAll(".category-posts").forEach(list => {
            list.hidden = true;
        });

        book.classList.add("active");
        group.querySelector(".category-posts").hidden = false;
    });
});
