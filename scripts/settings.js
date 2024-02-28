import { watchListPrograms } from "./programDetails.js";

const ratingRangeMin = document.querySelector("#rating-range-min");
const ratingRangeMax = document.querySelector("#rating-range-max");
const ratingRangeValueMin = document.querySelector("#rating-value-min");
const ratingRangeValueMax = document.querySelector("#rating-value-max");
const filterContainerIcon = document.querySelector(".filter-icon img");
const filterDropdown = document.querySelector(".filter-dropdown");

const filterSport = document.querySelector("#filter-sport");
const filterNews = document.querySelector("#filter-news");
const filterTVshow = document.querySelector("#filter-tvshow");
const filterDocumentary = document.querySelector("#filter-documentary");

const filterAll = document.querySelector("#filter-all");

const categoryFilters = [
  filterSport,
  filterNews,
  filterTVshow,
  filterDocumentary,
];

if (filterAll.checked) {
  categoryFilters.forEach((category) => {
    category.checked = true;
  });
}

filterAll.oninput = () => {
  if (filterAll.checked) {
    categoryFilters.forEach((category) => {
      category.checked = true;
    });
  } else {
    categoryFilters.forEach((category) => {
      category.checked = false;
    });
  }
};

ratingRangeMin.oninput = () => {
  ratingRangeValueMin.textContent = ratingRangeMin.value;
};

ratingRangeMax.oninput = () => {
  ratingRangeValueMax.textContent = ratingRangeMax.value;
};

filterContainerIcon.addEventListener("click", () => {
  filterDropdown.classList.toggle("hidden");
});

function filterSchedules(schedules) {
  const filteredSchedules = [];
  for (const schedule of schedules) {
    const filteredSchedule = schedule
      .filter(([_, program]) => filterByCategories(program))
      .filter(([_, program]) => filterByWachlist(program))
      .filter(([_, program]) => filterByRating(program));
    filteredSchedules.push(filteredSchedule);
  }
  console.log(filteredSchedules);
  return filteredSchedules;
}

function filterByCategories(program) {
  if (filterSport.checked && program.type === "Sport") return true;
  if (filterNews.checked && program.type === "News") return true;
  if (filterTVshow.checked && program.type === "TV Show") return true;
  if (filterDocumentary.checked && program.type === "Documentary") return true;
  return false;

  // dynamic approach, needs to be debugged
  /* const containsCategory = categoryFilters.some((category) => {
    const categoryName = category.nextElementSibling.textContent;
    return category.checked && program.type === categoryName;
  });
  return containsCategory; */
}

function filterByWachlist(program) {
  const filterWatchlist = document.querySelector("#filter-watchlist");
  if (!filterWatchlist.checked) return true;
  return watchListPrograms.has(program.name);
}

function filterByRating(program) {
  return (
    program.rating >= Number(ratingRangeMin.value) &&
    program.rating <= Number(ratingRangeMax.value)
  );
}

export { filterSchedules };
