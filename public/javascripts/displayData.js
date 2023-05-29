const fetchData = (fromPopstate, sortBy="") => {
  fetch('getApi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sortBy: sortBy })
  })
    .then(res => res.json())
    .then(data => {
      updatePage(data, fromPopstate);
    });
};

const dropdownMenu = document.querySelector('.dropdown-menu');
const dropdownButton = document.querySelector('.dropdown-toggle');
dropdownMenu.addEventListener('click', (event) => {
  const selectedValue = event.target.getAttribute('data-value');
 /*  console.log(selectedValue); */
  dropdownButton.textContent = selectedValue; // Set the selected value as the button text
  dropdownButton.classList.add('selected');
  fetchData(false, selectedValue);
});
dropdownButton.addEventListener('click', () => {
  resetSelection();
});


function resetSelection() {
  dropdownButton.textContent = 'Select an option'; // Reset the button text to default
  /* selectedValueInput.value = ''; */ // Reset the input box value
  dropdownButton.classList.remove('selected'); // Remove the "selected" class from the button
  fetchData(false,"")
}
dropdownButton.addEventListener('click', () => {
  dropdownButton.textContent = 'Select an option'; // Reset the button text to default
  dropdownButton.classList.remove('selected'); // Remove the "selected" class from the button
});

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
    <div class="col-sm-12 col-md-6 col-lg-4">
    <div class="card indexCards shadow border-0 mt-4">
    <a href="/campgrounds/${item._id}" >
       ${item.images.length ? `<img class="img-fluid" alt="" src="${item.images[0].url}">` : `<img class="img-fluid" alt="" src="">`}
    </a>
       <div class="card-body">
        <h6 class="card-title text-capitalize" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        ${item.title}
        </h6><br>
        <small class="float-end">Rs. ${item.price}/Person</small>
        </h6>
        <h6 class= "card-subtitle">`
        if(item.reviews.length ===0){
          html+= ` <span class="text-muted">No Reviews</span>`
        }else{
          var stars= [`<i class="far fa-star"></i>', '<i class="far fa-star text-danger "></i>', '<i class="far fa-star text-danger "></i>', '<i class="far fa-star text-danger "></i>', '<i class="far fa-star text-danger "></i>`]
          for(var i = 0; i < Math.round(item.rateAvg); i++) { 
          stars[i] = html+='<i class="fas fa-star" style="color: rgb(223, 223, 11) ;"></i>'
         } 
         for(var i = 0; i < stars.length; i++) { 
           stars[i] 
         } 
         if (item.reviews.length === 1) {
          html+= `<span class="text-muted">${item.reviews.length} Review</span>`
        } else { 
          html+=`<span class="text-muted">${item.reviews.length} Reviews</span>`
         } 
        }        
       html+= `<h6 class="card-subtitle">
              <span class="text-muted">${item.reviews.length} Review</span>
        </h6>
      </div>
    </div>
  </div>
  
      `;
      myDiv.innerHTML += html;
  })
}

const limit = 6;
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


fetchData(false)