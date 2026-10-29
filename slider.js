"use strict";

document.addEventListener("DOMContentLoaded", function () {

    var viewport = document.getElementById("gallery-viewport");
    var track = document.getElementById("gallery-track");
    var totalItems = track.children.length;
    var prevButton = document.getElementById("prev-button");
    var nextButton = document.getElementById("next-button");
    var pagerStatus = document.getElementById("pager-status");
    var pagerDots = document.getElementById("pager-dots");

    // Тот же брейкпоинт, что и в CSS, — без рассинхрона из-за скроллбара/зума
    var desktopQuery = window.matchMedia("(min-width: 768px)");

    var currentPage = 0;
    var resizeTimer = null;

    function getItemsPerPage() {
        return desktopQuery.matches ? 3 : 1;
    }

    function getPageCount() {
        return Math.max(1, Math.ceil(totalItems / getItemsPerPage()));
    }

    function buildDots() {
        var pageCount = getPageCount();
        var fragment = document.createDocumentFragment();
        var i, listItem, dot;

        pagerDots.innerHTML = "";

        for (i = 0; i < pageCount; i += 1) {
            listItem = document.createElement("li");
            dot = document.createElement("button");
            dot.type = "button";
            dot.className = "pager-dot";
            dot.setAttribute("data-page", String(i));
            dot.setAttribute("aria-label", "Перейти на страницу " + (i + 1));
            listItem.appendChild(dot);
            fragment.appendChild(listItem);
        }

        pagerDots.appendChild(fragment);
    }

    function updateUI() {
        var pageCount = getPageCount();
        var dots = pagerDots.getElementsByClassName("pager-dot");
        var i, dot;

        pagerStatus.textContent = "Страница " + (currentPage + 1) + " из " + pageCount;

        for (i = 0; i < dots.length; i += 1) {
            dot = dots[i];
            if (i === currentPage) {
                dot.classList.add("active");
                dot.setAttribute("aria-current", "true");
            } else {
                dot.classList.remove("active");
                dot.removeAttribute("aria-current");
            }
        }

        prevButton.disabled = currentPage <= 0;
        nextButton.disabled = currentPage >= pageCount - 1;
    }

    function moveToCurrentPage() {
        var viewportWidth = viewport.clientWidth;
        var trackWidth = track.scrollWidth;
        var itemWidth, maxOffset, offset;

        if (viewportWidth <= 0 || totalItems === 0) {
            return;
        }

        itemWidth = trackWidth / totalItems;
        maxOffset = Math.max(0, trackWidth - viewportWidth);
        offset = currentPage * getItemsPerPage() * itemWidth;

        if (offset > maxOffset) {
            offset = maxOffset;
        }
        if (offset < 0) {
            offset = 0;
        }

        track.style.transform = "translateX(-" + offset + "px)";
        updateUI();
    }

    function goToPage(page) {
        var pageCount = getPageCount();

        if (page < 0) {
            page = 0;
        }
        if (page > pageCount - 1) {
            page = pageCount - 1;
        }

        currentPage = page;
        moveToCurrentPage();
    }

    function handleResize() {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () {
            var pageCount = getPageCount();

            if (currentPage > pageCount - 1) {
                currentPage = pageCount - 1;
            }

            buildDots();
            moveToCurrentPage();
        }, 100);
    }

    // Делегирование: один обработчик на весь список точек
    pagerDots.addEventListener("click", function (event) {
        var dot = event.target.closest(".pager-dot");
        if (!dot || !pagerDots.contains(dot)) {
            return;
        }
        goToPage(parseInt(dot.getAttribute("data-page"), 10));
    });

    prevButton.addEventListener("click", function () {
        goToPage(currentPage - 1);
    });

    nextButton.addEventListener("click", function () {
        goToPage(currentPage + 1);
    });

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    buildDots();
    moveToCurrentPage();
});
