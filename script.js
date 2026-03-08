const container = document.getElementById("movieContainer");
const suggestionsBox = document.getElementById("suggestions");
const searchInput = document.getElementById("searchInput");


// SEARCH MOVIES
async function searchMovie(){

    const movieName = searchInput.value;

    const response = await fetch(
        `http://localhost:5000/movies?search=${movieName}`
    );

    const data = await response.json();

    if(data.Response === "True"){
        displayMovies(data.Search);
    }else{
        container.innerHTML = "<h2>No movies found</h2>";
    }
}


// DISPLAY MOVIES
function displayMovies(movies){

    container.innerHTML="";

    movies.forEach(movie=>{

        const card=`
        <div class="card">

        <img src="${movie.Poster}" 
        onclick="showDetails('${movie.imdbID}')">

        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>

        </div>
        `;

        container.innerHTML+=card;

    });
}



// MOVIE DETAILS MODAL
async function showDetails(id){

    const response = await fetch(
        `http://localhost:5000/movie/${id}`
    );

    const movie = await response.json();

    document.getElementById("modalPoster").src = movie.Poster;
    document.getElementById("modalTitle").innerText = movie.Title;
    document.getElementById("modalYear").innerText = "Year: "+movie.Year;
    document.getElementById("modalRating").innerText = "Rating: "+movie.imdbRating;
    document.getElementById("modalActors").innerText = "Actors: "+movie.Actors;
    document.getElementById("modalPlot").innerText = movie.Plot;

    document.getElementById("movieModal").style.display="block";
}


// CLOSE MODAL
function closeModal(){
    document.getElementById("movieModal").style.display="none";
}



// AUTO SUGGEST SEARCH
searchInput.addEventListener("input", async ()=>{

    const query = searchInput.value;

    if(query.length<2){
        suggestionsBox.innerHTML="";
        return;
    }

    const response = await fetch(
        `http://localhost:5000/movies?search=${query}`
    );

    const data = await response.json();

    if(data.Response==="True"){

        suggestionsBox.innerHTML="";

        data.Search.slice(0,5).forEach(movie=>{

            const item=document.createElement("div");

            item.classList.add("suggestion-item");

            item.innerText=movie.Title;

            item.onclick=()=>{
                searchInput.value=movie.Title;
                suggestionsBox.innerHTML="";
                searchMovie();
            };

            suggestionsBox.appendChild(item);
        });
    }

});