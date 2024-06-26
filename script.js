const api_key = "01cbfdaacff0f6c6ccc99d91e6ecb702";
const posterUrl = "https://image.tmdb.org/t/p/w500";
const movieSection = document.getElementById("movieSection");

// Data for front page
const dailyApiData = async () => {
  try {
    let response = await fetch(
      `https://api.themoviedb.org/3/trending/all/day?api_key=${api_key}`
    );
    let json = await response.json();
    let mydata = json.results;
    displayData(mydata);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
dailyApiData();

// Searching Data
function datainp() {
  const input = document.getElementById("inptuData").value.replace(/ /g, "+");
  if (input){
    searchApiData(input);
  }
}

const searchApiData = async (searchTerm) => {
  let data = getDataLocalStorage(searchTerm);

  if (data) {
    displayData(data);
  } else {
    try {
      let response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&api_key=${api_key}`
      );
      let json = await response.json();
      let mydata = json.results;

      // Set data to localStorage with search-specific key
      localStorage.setItem(`moviesData_${searchTerm}`, JSON.stringify(mydata));

      displayData(mydata);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};

const getDataLocalStorage = (searchTerm) => {
  let dataFromLocalStorage = localStorage.getItem(`moviesData_${searchTerm}`);
  if (dataFromLocalStorage) {
    return JSON.parse(dataFromLocalStorage);
  }
  return null;
};

// display all cards data
const displayData = (data) => {
  // Clear previous results
  movieSection.innerHTML = "";

  data.forEach((res) => {
    if(res.poster_path){
      let movieCard = document.createElement("div");
      movieCard.className = "card";
  
      // Create an img element for the poster
      let posterImg = document.createElement("img");
      posterImg.className = "movieImg";
      posterImg.src = res.poster_path
        ? posterUrl + res.poster_path
        : "https://via.placeholder.com/150"; // Handle missing poster_path
      posterImg.alt = res.title;
  
      // Create an h4 element for the title
      let title = document.createElement("h4");
      title.className = "title";
      title.textContent = res.title || res.name;
  
      // Create a p element for the release date
      let releaseDate = document.createElement("p");
      releaseDate.className = "date-color";
      releaseDate.textContent = res.release_date || "Release Date Not Found";
  
      // Append the elements to the movie card
      movieCard.appendChild(posterImg);
      movieCard.appendChild(title);
      movieCard.appendChild(releaseDate);
  
      // Append the movie card to the movie section
      movieSection.appendChild(movieCard);
  
      movieCard.addEventListener("click", () => {
        showMovieDetails(res);
      });
    }
  });
};

const showMovieDetails = (movie) => {
  // Clear previous results
  movieSection.innerHTML = "";
  let movieCard = document.createElement("div");
  movieCard.className = "detailData";

  let posterImg = document.createElement("img");
  posterImg.className = "detailImg";
  posterImg.src = movie.poster_path
    ? posterUrl + movie.poster_path
    : "https://via.placeholder.com/150";
  posterImg.alt = movie.title;

  // Create an h4 element for the title
  let title = document.createElement("h4");
  title.className = "detailTitle";
  title.textContent = movie.title || movie.name;

  // Create a p element for the release date
  let releaseDate = document.createElement("p");
  releaseDate.className = "date-color";
  releaseDate.textContent = `Release Date: ${movie.release_date}`;

  let overview = document.createElement("p");
  overview.className = "detailOverview";
  overview.innerHTML = `<h3>Overview</h3> ${movie.overview}`;

  let rating = document.createElement("h3");
  rating.className = "detailOverview";
  rating.textContent = `Rating: ${movie.vote_average}`;

  // Create a close button
  let closeButton = document.createElement("button");
  closeButton.className = "closeButton";
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", () => {
    movieSection.innerHTML = "";
    displayData()
  });

  // Append the elements to the movie card
  movieCard.appendChild(posterImg);
  movieCard.appendChild(title);
  movieCard.appendChild(releaseDate);
  movieCard.appendChild(overview);
  movieCard.appendChild(rating);
  movieCard.appendChild(closeButton); // Append the close button

  // Append the movie card to the movie section
  movieSection.appendChild(movieCard);
};
