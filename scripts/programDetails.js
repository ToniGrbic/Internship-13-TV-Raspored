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

let handleClick;
let starOnClickListeners = [];
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

  removePreviousStarRating(userProgramStarRating);
  if (program?.userRating)
    fillStarRating(program.userRating, userProgramRating);

  watchListButton.classList.remove("hidden");
  userProgramRating.classList.remove("hidden");
  programRating.classList.remove("hidden");

  if (watchListPrograms.has(program.name)) {
    styleWachlistBtnAdded();
  } else {
    styleWachlistBtnNotAdded();
  }

  if (handleClick) watchListButton.removeEventListener("click", handleClick);
  handleClick = () => handleWatchlistBtnClick(program);

  watchListButton.addEventListener("click", handleClick);
  starsRatingEventListeners(program);
}

function starsRatingEventListeners(program) {
  const userRatingStars = userProgramStarRating.querySelectorAll("i");

  if (starOnClickListeners.length > 0) {
    userRatingStars.forEach((listener, index) => {
      listener.removeEventListener("click", starOnClickListeners[index]);
    });
    starOnClickListeners = [];
  }

  userRatingStars.forEach((star, index) => {
    let handleStarClick = () => handleStarRatingClick(program, index);
    star.addEventListener("click", handleStarClick);
    starOnClickListeners.push(handleStarClick);
  });
}

function handleWatchlistBtnClick(program) {
  if (watchListPrograms.has(program.name)) {
    watchListPrograms.delete(program.name);
    styleWachlistBtnNotAdded();
  } else {
    watchListPrograms.add(program.name);
    styleWachlistBtnAdded();
  }
}

function styleWachlistBtnAdded() {
  watchListButton.innerHTML = `
      <span class="btn-sign">✓</span>Added
    `;
  const btnSign = watchListButton.querySelector(".btn-sign");
  btnSign.style.fontSize = "25px";
  watchListButton.classList.add("linear-gradient-purple");
  watchListButton.classList.remove("linear-gradient-orange");
}

function styleWachlistBtnNotAdded() {
  watchListButton.innerHTML = `
      <span class="btn-sign">+</span>Watchlist
    `;
  const btnSign = watchListButton.querySelector(".btn-sign");
  btnSign.style.fontSize = "30px";
  watchListButton.classList.remove("linear-gradient-purple");
  watchListButton.classList.add("linear-gradient-orange");
}

function handleStarRatingClick(program, index) {
  console.log("clicked");
  removePreviousStarRating(userProgramStarRating);
  program.userRating = index + 1;
  fillStarRating(program.userRating, userProgramRating);
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
  watchListPrograms,
};
