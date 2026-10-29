"use strict";

window.addEventListener("DOMContentLoaded", function () {

    var viewport = document.getElementById("gallery-viewport");
    var track = document.getElementById("gallery-track");
    var items = track.getElementsByClassName("gallery-item");
    var prevButton = document.getElementById("prev-button");
    var nextButton = document.getElementById("next-button");
    var pagerStatus = document.getElementById("pager-status");
    var pagerDots = document.getElementById("pager-dots");
    var totalItems = items.length;
    var desktopBreakpoint = 768;
    var currentPage = 0;

    function getItemsPerPage() {
        if (window.innerWidth >= desktopBreakpoint) {
            return 3;
        }
        return 1;
    }

    function getPageCount() {
        var itemsPerPage = getItemsPerPage();
        return Math.ceil(totalItems / itemsPerPage);
    }

    function buildDots() {
        var pageCount = getPageCount();
        var i;
        var dot;
        var listItem;

        pagerDots.innerHTML = "";

        for (i = 0; i < pageCount; i += 1) {
            listItem = document.createElement("li");
            dot = document.createElement("button");
            dot.type = "button";
            dot.className = "pager-dot";
            dot.setAttribute("aria-label", "Перейти на страницу " + (i + 1));
            dot.setAttribute("data-page", String(i));
            dot.addEventListener("click", function (event) {
                var page = parseInt(event.currentTarget.getAttribute("data-page"), 10);
                goToPage(page);
            });
            listItem.appendChild(dot);
            pagerDots.appendChild(listItem);
        }
    }

    function updateUI() {
        var pageCount = getPageCount();
        var dots = pagerDots.getElementsByClassName("pager-dot");
        var i;

        pagerStatus.textContent = "Страница " + (currentPage + 1) + " из " + pageCount;

        for (i = 0; i < dots.length; i += 1) {
            if (i === currentPage) {
                dots[i].classList.add("active");
            } else {
                dots[i].classList.remove("active");
            }
        }

        prevButton.disabled = currentPage === 0;
        nextButton.disabled = currentPage === pageCount - 1;
    }

    function moveToCurrentPage() {
        var viewportWidth = viewport.clientWidth;
        var maxOffset = track.scrollWidth - viewportWidth;
        var offset = currentPage * viewportWidth;

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
        var pageCount = getPageCount();

        if (currentPage > pageCount - 1) {
            currentPage = pageCount - 1;
        }

        buildDots();
        moveToCurrentPage();
    }

    prevButton.addEventListener("click", function () {
        goToPage(currentPage - 1);
    });

    nextButton.addEventListener("click", function () {
        goToPage(currentPage + 1);
    });

    window.addEventListener("resize", handleResize);

    buildDots();
    moveToCurrentPage();

});
