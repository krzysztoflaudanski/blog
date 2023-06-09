'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorListLink: Handlebars.compile(document.querySelector('#templete-author-list-link').innerHTML)
}

const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  tagsListSelector: '.tags.list',
  cloudClassCount: '5',
  cloudClassPrefix: 'tag-size-',
  articleAuthorSelector: '.post-author',
  authorListSelector: '.authors.list'
};

const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;

  /*  [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */

  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.posts article.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);

  /* [DONE] add class 'active' to the correct article */

  targetArticle.classList.add('active');
};

function generateTitleLinks(customSelector = '') {

  /* [DONE] remove contents of titleList */

  const titleList = document.querySelector(opts.titleListSelector);

  titleList.innerHTML = '';

  /*  [DONE] for each article */

  const articles = document.querySelectorAll(opts.articleSelector + customSelector);

  for (let article of articles) {

    /* [DONE] get the article id */

    const articleId = article.getAttribute('id');

    /* [DONE] find the title element */
    /* [DONE] get the title from the title element */

    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

    /* [DONE] create HTML of the link */

    const linkHTMLData = { id: articleId, title: articleTitle };

    const linkHTML = templates.articleLink(linkHTMLData);

    /* [DONE] insert link into titleList */

    titleList.insertAdjacentHTML('beforeend', linkHTML);
  }
  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();

function calculateTagsParams(tags) {

  const params = { 'max': 0, 'min': 999999 };

  for (let tag in tags) {
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }
    if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params) {

  const classNumber = Math.floor(((count - params.min) / (params.max - params.min)) * (opts.cloudClassCount - 1) + 1);

  return classNumber;
}


function generateTags() {

  /* [DONE] create a new variable allTags with an empty object */

  let allTags = {};

  /* [DONE] find all articles */

  const articles = document.querySelectorAll(opts.articleSelector);

  /* [DONE] START LOOP: for every article: */

  for (let article of articles) {

    /* [DONE] find tags wrapper */

    const tagsWrapper = article.querySelector(opts.articleTagsSelector);

    /* [DONE] make html variable with empty string */

    let html = '';

    /* [DONE] get tags from data-tags attribute */

    const articleTags = article.getAttribute('data-tags');

    /* [DONE] split tags into array */

    const articleTagsArray = articleTags.split(' ');

    /* [DONE] START LOOP: for each tag */

    for (let tag of articleTagsArray) {

      /* [DONE] generate HTML of the link */

      const linkHTMLData = { id: tag, title: tag };
      const linkHTML = templates.tagLink(linkHTMLData);

      /* [DONE] add generated code to html variable */

      html = html + linkHTML + ' ';

      /* [DONE] check if this link is NOT already in allTags */

      if (!allTags[tag]) {

        /* [DONE] add tag to allTags object */

        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

      /* [DONE] END LOOP: for each tag */
    }
    /* [DONE] insert HTML of all the links into the tags wrapper */

    tagsWrapper.innerHTML = html;

    /* [DONE] END LOOP: for every article: */

  }

  /* [DONE] find list of tags in right column */

  const tagList = document.querySelector(opts.tagsListSelector);

  /* [DONE] create variable for all links HTML code */

  const tagsParams = calculateTagsParams(allTags);

  const allTagsData = { tags: [] };

  /* [DONE] START LOOP: for each tag in allTags: */

  for (let tag in allTags) {

    /* [DONE] generate code of a link and add it to allTagsHTML */

    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: opts.cloudClassPrefix + calculateTagClass(allTags[tag], tagsParams)
    });

    /* [DONE] END LOOP: for each tag in allTags: */
  }
  /*[DONE] add HTML from allTagsHTML to tagList */

  tagList.innerHTML = templates.tagCloudLink(allTagsData);

}
generateTags();

function tagClickHandler(event) {
  /* [DONE] prevent default action for this event */

  event.preventDefault();

  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;

  /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');

  /* [DONE] make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');

  /* [DONE] find all tag links with class active */

  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

  /* [DONE] START LOOP: for each active tag link */

  for (let activeTag of activeTags) {

    /* [DONE] remove class active */

    activeTag.classList.remove('active');

    /* [DONE] END LOOP: for each active tag link */

  }

  /* [DONE] find all tag links with "href" attribute equal to the "href" constant */

  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* [DONE] START LOOP: for each found tag link */

  for (let tagLink of tagLinks) {

    /* [DONE] add class active */

    tagLink.classList.add('active');

    /* [DONE] END LOOP: for each found tag link */
  }
  /* [DONE] execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* [DONE] find all links to tags */

  const tagLinks = document.querySelectorAll('.tag-link a');

  /* [DONE] START LOOP: for each link */

  for (let tagLink of tagLinks) {

    /* [DONE] add tagClickHandler as event listener for that link */

    tagLink.addEventListener('click', tagClickHandler);

    /* [DONE] END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors() {

  /* [DONE] create a new variable allAuthors with an empty array */

  let allAuthors = {};

  /* [DONE] find all articles */

  const articles = document.querySelectorAll(opts.articleSelector);

  /* [DONE] START LOOP: for every article */

  for (let article of articles) {

    /* [DONE] find authors wrapper */

    const authorWrapper = article.querySelector(opts.articleAuthorSelector);

    /* [DONE] make html variable with empty string */

    let html = '';

    /* [DONE] get author from data-author atribute */

    const articleAuthor = article.getAttribute('data-author');

    /* [DONE] generate HTML of the link */

    const linkHTMLData = { id: articleAuthor, title: articleAuthor };

    const linkHTML = templates.authorLink(linkHTMLData);

    /* [DONE] add generate code to html variable */

    html = html + linkHTML;

    /* [DONE] check if this link is NOT already in allAuthors */

    if (!allAuthors[articleAuthor]) {

      /* [DONE] add articleAuthor to allAuthors object */

      allAuthors[articleAuthor] = 1;
    }
    else {
      allAuthors[articleAuthor]++;
    }

    /* [DONE] insert html of all the links into the author wrapper */

    authorWrapper.innerHTML = html;

    /* [DONE] END LOOP: for every author */
  }

  /* [DONE] find list of authors in right column */

  const authorList = document.querySelector(opts.authorListSelector);

  /* [DONE] create variable for all links HTML code */

  const allAuthorsData = { authors: [] };

  /* [DONE] START LOOP: for each articleAuthor in allAuthors: */

  for (let articleAuthor in allAuthors) {

    /* [DONE] generate code of a link and add it to allAuthorsHTML */

    allAuthorsData.authors.push({
      id: articleAuthor,
      count: allAuthors[articleAuthor],
    });

    /* [DONE] END LOOP: for each articleAuthor in allAuthos: */

  }
  /* [DONE] add html from allAuthors to authorsList */

  authorList.innerHTML = templates.authorListLink(allAuthorsData);

}

generateAuthors();

function authorClickHandler(event) {

  /* [DONE] prevent default action for this event */

  event.preventDefault();

  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;

  /* [DONE] get 'href' attribute from the clicked link */

  const href = clickedElement.getAttribute('href');

  /* [DONE] make a new constant "author" and extract tag from the "href" constant */

  const author = href.replace('#', '');

  /* [DONE] find all author links with class active */

  const activeAuthors = document.querySelectorAll('.post-author a.active');

  /* [DONE] START LOOP: for each active author link */

  for (let activeAuthor of activeAuthors) {

    /* [DONE] remove class active */

    activeAuthor.classList.remove('active');

    /* [DONE] END LOOP: for each active author link */

  }

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */

  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* [DONE] START LOOP: for each found author link */

  for (let authorLink of authorLinks) {

    /* [DONE] add class active */

    authorLink.classList.add('active');

    /* [DONE] END LOOP: for each found author link */

  }
  /* [DONE] execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-author="' + author + '"]');

}

function addClickListenersToAuthors() {

  /* [DONE] find all links to author */

  const authorLinks = document.querySelectorAll('.post-author a');

  /* [DONE] START LOOP: for each link */

  for (let authorLink of authorLinks) {

    /* [DONE] add authorClickHandler as event listener for that link */

    authorLink.addEventListener('click', authorClickHandler);

    /* [DONE] END LOOP: for each link */

  }
}

addClickListenersToAuthors();
