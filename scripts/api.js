const baseUrl = "https://indian-tv-schedule.p.rapidapi.com";
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "REPLACE_WITH_API_KEY",
    "X-RapidAPI-Host": "indian-tv-schedule.p.rapidapi.com",
  },
};

async function fetchData(url, options) {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function getChannelSchedule(channel) {
  const searchParams = new URLSearchParams({ channel });
  const url = `${baseUrl}/Schedule?${searchParams}`;

  return await fetchData(url, options);
}

export { getChannelSchedule };
