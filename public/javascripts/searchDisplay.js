window.onload = function() {
  const searchQuery = JSON.parse(sessionStorage.getItem('searchQuery'));
  if (searchQuery && searchQuery.search) {
    const searchBox = document.querySelector("#search-input");
    const currentPage = searchQuery.page || 1;
   /*  const url = new URLSearchParams(window.location.search)
    url.set('search',searchQuery.search)
    url.set('page',searchQuery.page)
    const path = window.location.pathname+"?"+url.toString() 
    console.log(path)
    history.pushState({page: searchQuery.page, source: "searchDisplay"}, "", path);*/
    searchBox.value = searchQuery.search;
    console.log(searchQuery.page)
    sendData(searchBox, 2, currentPage,false);
  }
};

window.addEventListener('popstate',function(event){
    const state = event.state;
    
    console.log(state.source+" :: "+state.page)
    if(state.page && state.source=="searchDisplay"){
      const searchBox = document.querySelector("#search-input")
      const url = new URLSearchParams(window.location.search)
      const searchValue = url.get("search")
      searchBox.value = searchValue
      page = state.page
      sendData(searchBox, 2 , page,true)
    }

})

function sendData(e, limit =2  ,page = 1 ,fromPopstate = false) {
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
          /* return; */
        }else{
        payload.forEach(item => {
          let html = `
            <div class="card" mb-3>
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
        });      
        myDiv.scrollTop = 0; 
      }      
}