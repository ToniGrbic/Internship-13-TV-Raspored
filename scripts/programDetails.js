const programDetails = document.querySelector("#program-details");
const programName = programDetails.querySelector("#program-name");
const programType = programDetails.querySelector("#program-type");
const programTime = programDetails.querySelector("#program-time");
const programRating = programDetails.querySelector("#program-rating");
const otherDetails = programDetails.querySelector("#other-details");
const userProgramRating = programDetails.querySelector("#user-program-rating");
const programStarRating = programRating.querySelector(".stars-container");
const watchListButton = programDetails.querySelector(".btn-watchlist");
const userProgramStarRating =
  userProgramRating.querySelector(".stars-container");
const userRatingStars = userProgramStarRating.querySelectorAll("i");
let handleClick;

let watchListPrograms = new Set();

function setProgramDetails(program, startTime, endTime, channel) {
  programName.textContent = program.name;
  programType.textContent = program.type;
  otherDetails.textContent = program["other-details"];
  programTime.innerHTML = `
      <span id="program-channel">${channel}</span>
      ${startTime} - ${endTime}
    `;

  if (program.isAdult) programName.textContent += " (18+)";

  if (program.isRebroadcast) programType.textContent += " (Rebroadcast)";

  removePreviousStarRating(programStarRating);
  fillStarRating(program.rating, programRating);

  if (!program?.userRating) {
    removePreviousStarRating(userProgramStarRating);
  } else {
    fillStarRating(program.userRating, userProgramRating);
  }
  watchListButton.classList.remove("hidden");
  userProgramRating.classList.remove("hidden");

  if (watchListPrograms.has(program.name)) {
    console.log(program.name);
    watchListButton.innerHTML = `
        <span class="btn-sign">✓</span>Added
      `;
    watchListButton.classList.add("linear-gradient-purple");
    watchListButton.classList.remove("linear-gradient-orange");
  } else {
    watchListButton.innerHTML = `
        <span class="btn-sign">+</span>Watchlist
      `;
    watchListButton.classList.remove("linear-gradient-purple");
    watchListButton.classList.add("linear-gradient-orange");
  }

  if (handleClick) {
    watchListButton.removeEventListener("click", handleClick);
  }

  handleClick = () => handleWatchlistBtnClick(program);

  watchListButton.addEventListener("click", handleClick);

  userRatingStars.forEach((star, index) => {
    star.addEventListener("click", () => {
      removePreviousStarRating(userProgramStarRating);
      program.userRating = index + 1;
      fillStarRating(program.userRating, userProgramRating);
    });
  });
  programRating.classList.remove("hidden");
}

function handleWatchlistBtnClick(program) {
  if (watchListPrograms.has(program.name)) {
    watchListPrograms.delete(program.name);
    watchListButton.innerHTML = `
      <span class="btn-sign">+</span>Watchlist
    `;
    watchListButton.classList.remove("linear-gradient-purple");
    watchListButton.classList.add("linear-gradient-orange");
  } else {
    watchListPrograms.add(program.name);
    watchListButton.innerHTML = `
      <span class="btn-sign">✓</span>Added
    `;
    watchListButton.classList.add("linear-gradient-purple");
    watchListButton.classList.remove("linear-gradient-orange");
  }

  console.log(watchListPrograms);
}

function createStarRating(container) {
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("i");
    star.classList.add("fa-regular", "fa-star");
    container.appendChild(star);
  }
}

function removePreviousStarRating(container) {
  const stars = container.querySelectorAll("i");
  stars.forEach((star) => {
    star.classList.remove("filled-star");
  });
  const ratingExact = container.parentElement.querySelector("p.rating-exact");
  ratingExact.textContent = "";
}

function fillStarRating(rating, container) {
  const stars = container.querySelectorAll("i");
  for (let i = 0; i < 5; i++) {
    const ratingRounded = Math.round(rating);

    if (i + 1 <= ratingRounded) {
      stars[i].classList.add("filled-star");
    }
  }

  const ratingExact = container.querySelector("p.rating-exact");
  ratingExact.textContent = `Rating: ${rating}/5`;
  container.appendChild(ratingExact);
}

export {
  setProgramDetails,
  createStarRating,
  removePreviousStarRating,
  fillStarRating,
};
