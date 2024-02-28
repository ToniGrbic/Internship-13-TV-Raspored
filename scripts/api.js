const baseUrl = "https://indian-tv-schedule.p.rapidapi.com";
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "b3197ce63fmsh4a88ade115974c6p161cc0jsn57e5c317f647",
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
