function fetchData(fromPopstate){
  fetch('getApi',{
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body :  JSON.stringify( filterParams)
    })
    .then(res=>res.json())
    .then(data=>{
        updatePage(data,fromPopstate);
    });
}

window.addEventListener('popstate',(event)=>{
  const state = event.state;
  console.log(state.source+" :: "+state.page)
  if(state.page && state.source == "displayData")
  {
    document.querySelector('#search-input').value = ""
    currentPage = state.page
    fetchData(true)
  }
})

function showData(campgrounds){
  const myDiv = document.querySelector("#my-div");
  myDiv.innerHTML = "";
  campgrounds.forEach(item =>{
    let html = `
        <div class="card mb-3">
          <div class="row">
            <div class="col-md-4">
              ${item.images.length ? `<img class="img-fluid" alt="" src="${item.images[0].url}">` : `<img class="img-fluid" alt="" src="">`}
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${item.description}</p>
                <p class="card-text">
                  <small class="text-muted">${item.location}</small>
                </p>
                <a class="btn btn-primary" href="/campgrounds/${item._id}" >View: ${item.title}</a>
              </div>
            </div>
          </div>
        </div>
      `;
      myDiv.innerHTML += html;
  })
}

const limit = 2;
let currentPage = sessionStorage.getItem('currentPage')||1;

const updatePage = (data, fromPopstate=false) => {
  const searchParam = new URLSearchParams(window.location.search);
  
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const Campgrounds_Slice = data.slice(startIndex, endIndex);
  
  showData(Campgrounds_Slice)
    
  if(!fromPopstate){
    searchParam.set("page", currentPage)
    var newpath = window.location.pathname + "?" + searchParam.toString();
    var states = {
      page : currentPage,
      source: "displayData"
    }
    history.pushState(states, "", newpath);
  }
  sessionStorage.setItem('currentPage',currentPage)

  // Create pagination buttons
  const numPages = Math.ceil(data.length / limit);
  const paginationDiv = document.querySelector("#pagination-div");
  paginationDiv.innerHTML = "";
  const ul = document.createElement("ul");
  ul.classList.add("pagination");
  
  if(numPages>1){
    if(currentPage>1){
    //Add First Page Button
      const firstPageLi = document.createElement("li");
      firstPageLi.classList.add("page-item");
      const firstPageButton = document.createElement("button");
      firstPageButton.classList.add("page-link");
      firstPageButton.innerHTML = "First Page";
      firstPageButton.disabled = currentPage === 1;
      firstPageButton.addEventListener("click", () => {
        currentPage = 1;
        updatePage(data);
      });
      firstPageLi.appendChild(firstPageButton);
      ul.appendChild(firstPageLi);

      // Add Previous Button
      
      const previousLi = document.createElement("li");
      previousLi.classList.add("page-item");
      const previousButton = document.createElement("button");
      previousButton.classList.add("page-link");
      previousButton.innerHTML = "&laquo;";
      previousButton.disabled = currentPage === 1;
      previousButton.addEventListener("click", () => {
        currentPage--;
        updatePage(data);
      });
      previousLi.appendChild(previousButton);
      ul.appendChild(previousLi);
    }
    // Add Page Buttons
      const li = document.createElement("li");
      li.classList.add("page-item");
      const button = document.createElement("button");
      button.classList.add("page-link");
      button.innerText = currentPage;
      if (currentPage /* === i */) {
        li.classList.add("active");
        button.addEventListener("click", () => {
          currentPage = i;
          updatePage(data);
        });
      li.appendChild(button);
      ul.appendChild(li);
    }
    // Add Next Button
    if(currentPage<numPages){
      const nextLi = document.createElement("li");
      nextLi.classList.add("page-item");
      const nextButton = document.createElement("button");
      nextButton.classList.add("page-link");
      nextButton.innerHTML = "&raquo;";
      nextButton.disabled = currentPage === numPages;
      nextButton.addEventListener("click", () => {
        currentPage++;
        updatePage(data);
      });
      nextLi.appendChild(nextButton);
      ul.appendChild(nextLi);
    
      //Add Last Page Button
      const LastPageLi = document.createElement("li");
      LastPageLi.classList.add("page-item");
      const LastPageButton = document.createElement("button");
      LastPageButton.classList.add("page-link");
      LastPageButton.innerHTML = "Last Page";
      LastPageButton.disabled = currentPage === numPages;
      LastPageButton.addEventListener("click", () => {
        currentPage = numPages;
        updatePage(data);
      });
      LastPageLi.appendChild(LastPageButton);
      ul.appendChild(LastPageLi);
    }
    paginationDiv.appendChild(ul);
  }
};

const filterParams= {
  minPrice: null,
  maxPrice: null
}

fetchData(false)