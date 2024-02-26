const programDetails = document.querySelector("#program-details");
const programName = programDetails.querySelector("#program-name");
const programType = programDetails.querySelector("#program-type");
const programTime = programDetails.querySelector("#program-time");
const programRating = programDetails.querySelector("#program-rating");
const otherDetails = programDetails.querySelector("#other-details");
const userProgramRating = programDetails.querySelector("#user-program-rating");
const programStarRating = programRating.querySelector(".stars-container");
const userProgramStarRating =
  userProgramRating.querySelector(".stars-container");

function setProgramDetails(program, startTime, endTime, channel) {
  programName.textContent = program.name;
  programType.textContent = program.type;
  otherDetails.textContent = program["other-details"];
  programTime.innerHTML = `
      <span id="program-channel">${channel}</span>
      ${startTime} - ${endTime}
    `;

  if (program.isAdult) {
    programName.textContent += " (18+)";
  }

  if (program.isRebroadcast) {
    programType.textContent += " (Rebroadcast)";
  }
  removePreviousStarRating(programStarRating);
  fillStarRating(program.rating, programRating);

  if (!program?.userRating) {
    removePreviousStarRating(userProgramStarRating);
  } else {
    fillStarRating(program.userRating, userProgramRating);
  }
  userProgramRating.classList.remove("hidden");

  const userRatingStars = userProgramStarRating.querySelectorAll("i");

  userRatingStars.forEach((star, index) => {
    star.addEventListener("click", () => {
      removePreviousStarRating(userProgramStarRating);
      program.userRating = index + 1;
      console.log(program.userRating);
      fillStarRating(program.userRating, userProgramRating);
    });
  });
  programRating.classList.remove("hidden");
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
