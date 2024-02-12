
var toast = document.querySelector(".toast");
var close = document.querySelector(".toast-close");
var progress = document.querySelector(".progress-toast");
var text1 = document.querySelector('.text-1');
var text2 = document.querySelector('.text-2');
var text2 = document.querySelector('.text-2');

export function toastActive(title, value) {
    toast.classList.add("active");
    progress.classList.add("active");
    text1.textContent = title;
    text2.textContent = value;
    setTimeout(() => {
        toast.classList.remove("active");
    }, 2000)

    setTimeout(() => {
        progress.classList.remove("active");
    }, 2300)
}

close.addEventListener("click", () => {
    toast.classList.remove("active");

    setTimeout(() => {
        progress.classList.remove("active");
    }, 300)
})