window.addEventListener('popstate',function(event){
    const state = event.state;
    
    console.log(state.source+" :: "+state.page)
    if(state.page && state.source=="searchDisplay"){
      const searchBox = document.querySelector("#search-input")
      const url = new URLSearchParams(window.location.search)
      const searchValue = url.get("search")
      searchBox.value = searchValue
      page = state.page
      sendData(searchBox, 6, page,true)
    }
})

window.addEventListener("load", function() {
  const searchBox = document.querySelector("#search-input");
  const searchQuery = sessionStorage.getItem("searchQuery");
  if (searchQuery) {
    const { search, page } = JSON.parse(searchQuery);
    searchBox.value = search;
    console.log("from load:: " +page)
   /*  const url = new URLSearchParams(window.location.search)
     url.set("search",search)
     url.set("page",page) */

   /*   var newpath = window.location.pathname + "?" + url.toString(); */
     
    sendData(searchBox, 6 , page,false)
  }
});

function sendData(e, limit = 6  ,page = 1 ,fromPopstate = false) {

    const searchParam = new URLSearchParams(window.location.search);
    
    if(!fromPopstate){
      searchParam.set("search", e.value);
      searchParam.set("page", page)   

      if (e.value.length != 0) {
        var newpath = window.location.pathname + "?" + searchParam.toString();
      } /* else {
        var newpath = window.location.pathname;
        window.location.href = newpath
      } */
      if (e.value.length === 0) {
        var newpath = window.location.pathname+"?page="+page;
        const script = document.createElement('script')
        script.src = "/javascripts/dispalyData.js"  
      }
      var states = {
        page : page,
        source: "searchDisplay"
      }
      history.pushState(states, "", newpath);
    }
    sessionStorage.setItem('searchQuery', JSON.stringify({
      search: e.value,
      page: page,
    }));


    fetch('getData', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: e.value, limit: limit , page: page, skip: (page-1)*limit})
    })
      .then(res => res.json())
      .then(data => {
        /* console.log(data) */
        let payload = data.payload;
        displayResults(payload);
  
    // Calculate the number of pages

    const pageCount = Math.ceil(data.count / limit);
    const paginationDiv = document.querySelector("#pagination-div");
    paginationDiv.innerHTML = "";
    const ul = document.createElement("ul")
    ul.classList.add("pagination");
    /* console.log("pagecount:: "+pageCount) */
    if(pageCount>1){
      if (page > 1) {
    //Add First Page Button
        const firstPageLi = document.createElement("li");
        firstPageLi.classList.add("page-item")
        const firstPageButton = document.createElement("button");
        firstPageButton.classList.add("page-link");
        firstPageButton.innerHTML = "First Page";
        firstPageButton.disabled = page === 1;
        firstPageButton.addEventListener("click", () => {
          sendData(e, limit, 1);
        });
        firstPageLi.appendChild(firstPageButton);
        ul.appendChild(firstPageLi);

      // Add previous page button  
      
        const previousLi = document.createElement("li");
        previousLi.classList.add("page-item")
        const previousButton = document.createElement("button");
        previousButton.classList.add("page-link");
        previousButton.innerHTML = "&laquo;";
        previousButton.disabled = page === 1;
        previousButton.addEventListener("click", () => {
          sendData(e, limit, page - 1);
        });
        previousLi.appendChild(previousButton);
        ul.appendChild(previousLi);
      }
  
    // Add page buttons
      const li = document.createElement("li");
      li.classList.add("page-item");
      const button = document.createElement("button")
      button.innerText = page;
      button.classList.add("page-link");
    
      if (page /* === i */) {
        li.classList.add("active");
        button.addEventListener("click", () => {
          sendData(e, limit, i);
        });
      }     
      li.appendChild(button);
      ul.appendChild(li);
  
    // Add next page button
    if (page < pageCount) {
      const nextLi = document.createElement("li");
      nextLi.classList.add("page-item")
      const nextButton = document.createElement("button");
      nextButton.classList.add("page-link");
      nextButton.innerHTML = "&raquo;";
      nextButton.disabled = page === pageCount
      nextButton.addEventListener("click", () => {
        sendData(e, limit, page+1);
      });
      nextLi.appendChild(nextButton);
      ul.appendChild(nextLi);
    
    //Add Last Page Button
      const LastPageLi = document.createElement("li");
      LastPageLi.classList.add("page-item")
      const LastPageButton = document.createElement("button");
      LastPageButton.classList.add("page-link");
      LastPageButton.innerHTML = "Last Page";
      LastPageButton.disabled = page === pageCount;
      LastPageButton.addEventListener("click", () => {
        sendData(e, limit, pageCount);
      });
      LastPageLi.appendChild(LastPageButton);
      ul.appendChild(LastPageLi);
    }
    paginationDiv.appendChild(ul);
    }
  });
}
    
function displayResults(payload){
  const myDiv = document.querySelector("#my-div");
        myDiv.innerHTML = "";
        if (payload.length < 1) {
          myDiv.innerHTML = "<p>Nothing found</p>";
        }else{
        payload.forEach(item => {
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
                var stars= [`<i class="far fa-star text-danger "></i>', '<i class="far fa-star text-danger "></i>', '<i class="far fa-star text-danger "></i>', '<i class="far fa-star text-danger "></i>', '<i class="far fa-star text-danger "></i>`]
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
        });      
        myDiv.scrollTop = 0; 
      }      
}