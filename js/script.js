// Input
const inputNumberOfArticles = document.querySelector('.input_number');
let articlesLimit = 15;

inputNumberOfArticles.placeholder = articlesLimit;
inputNumberOfArticles.value = articlesLimit;

inputNumberOfArticles.addEventListener("input", () => {
  articlesLimit = inputNumberOfArticles.value;
  getLoadedArticles();
  console.log ('Number of articles:',articlesLimit);
  fetchArticles(articlesLimit)
    .then((articles) => renderPostList(articles))
    .catch((error) => console.log(error));
});

// Counter
const articlesCounterEl = document.querySelector('.counter')

const allArticles = await fetch('https://api.spaceflightnewsapi.net/v3/articles/count')
.then(function (resp) { return resp.json() })
function getLoadedArticles() {
    articlesCounterEl.textContent = `Loaded ${articlesLimit} of ${allArticles} articles`;
}
getLoadedArticles();


//Postlist
const containerEl = document.querySelector('.container');
const postList = document.createElement('ul');

postList.classList.add('post__list');
containerEl.append(postList);

const postListEl = document.querySelector('.post__list');


function fetchArticles(articlesLimit) {
  return fetch(`https://api.spaceflightnewsapi.net/v3/articles?_limit=${articlesLimit}`).then(
    (response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    }
  );
}

function renderPostList(articles) {
  const markup = articles
    .map((article) => {
      console.log(article.id);
      const dateOfArticle = new Date(article.publishedAt).toLocaleString();
      return `        
      <li class="post__item">
        <div>
            <h2>${article.title}</h2>
            <h3>News Site: ${article.newsSite}</h3>
            <time datetime=${article.publishedAt}>${dateOfArticle}</time>
            <p>${article.summary.slice(0,200)}</p>
            <a class="post__button button button-link" href=${article.url}>Read article</a>
            <button class="post__button button button-add">Add to Library</button>
            <button class="post__button button button-remove hidden">Remove from Library</button>
        </div>
        <img src="${article.imageUrl}" alt=${article.title} width="200">
      </li>
      `;
    })
    .join("");
  postListEl.innerHTML = markup;
}


fetchArticles(articlesLimit)
.then((articles) => {
  renderPostList(articles)})
.catch((error) => console.log(error));




//Infinite Scroll
function getPosition() {
  const bodyHeight = document.body.offsetHeight
  const screenHeight = window.innerHeight
  const scrolled = window.scrollY
  const threshold = bodyHeight - screenHeight / 4
  const position = scrolled + screenHeight

  if (position >= threshold) {
    articlesLimit = +articlesLimit + 15;
    fetchArticles(articlesLimit)
        .then((articles) => renderPostList(articles))
        .catch((error) => console.log(error));
    console.log(articlesLimit);
    getLoadedArticles();
  }
}

function throttle(callee, timeout) {
  let timer = null

  return function perform(...args) {
    if (timer) return

    timer = setTimeout(() => {
      callee(...args)

      clearTimeout(timer)
      timer = null
    }, timeout)
  }
}

;(() => {
  window.addEventListener("scroll", throttle(getPosition, 250))
  window.addEventListener("resize", throttle(getPosition, 250))
})()
// 




const buttonAdd = document.querySelector('.button-add');
const buttonRemove = document.querySelectorAll('.button-remove');

const handleClick = (event) => {
  if (event.target.classList.contains('button-add')) {
    console.log('+');
    console.log(event.target);
    // event.target.classList.add("hidden");
      // buttonRemove.classList.remove("hidden");
  };
}

document.addEventListener("click", handleClick);




fetchArticles(articlesLimit)
.then((articles) => {
  console.log(...articles)})
.catch((error) => console.log(error));

