import ffetch from '../../scripts/ffetch.js';
import { getMetadata } from '../../scripts/lib-franklin.js';
import { getLink, getPathDetails, createPlaceholderSpan, htmlToElement } from '../../scripts/scripts.js';

/**
 * Helper function thats returns a list of all products
 * - below <lang>/browse/<product-page>
 * - To get added, the product page must be published
 * - Product pages listed in <lang>/browse/top-products are put at the the top
 *   in the order they appear in top-products
 * - the top product list can point to sub product pages
 */
export async function getProducts() {
  // get language
  const { lang } = getPathDetails();
  let featured = true;
  const [Products, publishedPages] = await Promise.all([
    // load the <lang>/top-product list
    ffetch(`/${lang}/top-products.json`, `/en/top-products.json`).all(),
    // get all indexed pages below <lang>/browse
    ffetch(`/${lang}/browse-index.json`, `/en/browse-index.json`).all(),
  ]);

  // add all published top products to final list
  const finalProducts = Products.filter((product) => {
    // if separator is reached
    if (product.path.startsWith('-')) {
      featured = false;
      return false;
    }

    // check if product is in published list
    const found = publishedPages.find((elem) => elem.path === product.path);
    if (found) {
      // keep original title if no nav title is set
      if (!product.title) product.title = found.title;
      // set featured flag
      product.featured = featured;
      // remove it from publishedProducts list
      publishedPages.splice(publishedPages.indexOf(found), 1);
      return true;
    }
    return false;
  });

  // if no separator was found , add the remaining products alphabetically
  if (featured) {
    // for the rest only keep main product pages (<lang>/browse/<main-product-page>)
    const publishedMainProducts = publishedPages
      .filter((page) => page.path.split('/').length === 4)
      // sort alphabetically
      .sort((productA, productB) => productA.path.localeCompare(productB.path));
    // append remaining published products to final list
    finalProducts.push(...publishedMainProducts);
  }

  return finalProducts;
}

// Utility function to toggle visibility of items
function toggleItemVisibility(itemList, startIndex, show) {
  // eslint-disable-next-line no-plusplus
  for (let i = startIndex; i < itemList.length; i++) {
    if (!itemList[i].classList.contains('view-more-less')) {
      itemList[i].classList.toggle('hidden', !show);
    }
  }
}

// Utility function to set link visibility
function setLinkVisibility(block, linkClass, show) {
  const linkElement = block.querySelector(linkClass);
  if (linkElement) {
    linkElement.style.display = show ? 'block' : 'none';
  }
}

// Function to handle "View More" click
function handleViewMoreClick(block, numFeaturedProducts) {
  const itemList = block.querySelectorAll('.products > li > ul > li');
  toggleItemVisibility(itemList, numFeaturedProducts, true);
  setLinkVisibility(block, '.viewMoreLink', false);
  setLinkVisibility(block, '.viewLessLink', true);
}

// Function to handle "View Less" click
function handleViewLessClick(block, numFeaturedProducts) {
  const itemList = block.querySelectorAll('.products > li > ul > li');
  toggleItemVisibility(itemList, numFeaturedProducts, false);
  setLinkVisibility(block, '.viewMoreLink', true);
  setLinkVisibility(block, '.viewLessLink', false);
}

async function displayAllProducts(block) {
  const productList = await getProducts();

  if (productList.length > 0) {
    const productsUL = document.createElement('ul');
    productsUL.classList.add('products');
    const productsLI = document.createElement('li');
    const productsPlaceholder = createPlaceholderSpan('products', 'Products');
    productsLI.appendChild(productsPlaceholder);
    productsLI.appendChild(htmlToElement('</span><span class="js-toggle"></span>'));

    const ul = document.createElement('ul');
    let otherProductFirstItem = false;
    productList.forEach((item) => {
      const li = document.createElement('li');
      if (!item.featured && !otherProductFirstItem) {
        li.classList.add('other-product-first-item');
        otherProductFirstItem = true;
      }
      li.innerHTML = `<a href="${getLink(item.path)}">${item.title}</a>`;
      ul.appendChild(li);
    });

    productsLI.append(ul);
    productsUL.append(productsLI);
    block.append(productsUL);

    // get number of featured products
    const numFeaturedProducts = productList.filter((elem) => elem.featured).length;
    toggleItemVisibility(ul.children, numFeaturedProducts, false);

    // "View More" and "View Less" links
    if (ul.children.length > numFeaturedProducts) {
      const viewMoreLI = document.createElement('li');
      viewMoreLI.classList.add('left-rail-view-more', 'view-more-less');
      const viewMoreSpan = createPlaceholderSpan('viewMore', '+ View More', (span) => {
        span.textContent = `+ ${span.textContent}`;
      });
      viewMoreSpan.classList.add('viewMoreLink');
      viewMoreLI.appendChild(viewMoreSpan);
      ul.append(viewMoreLI);

      const viewLessLI = document.createElement('li');
      viewLessLI.classList.add('left-rail-view-less', 'view-more-less');
      const viewLessSpan = createPlaceholderSpan('viewLess', '- View Less', (span) => {
        span.textContent = `- ${span.textContent}`;
      });
      viewLessSpan.classList.add('viewLessLink');
      viewLessSpan.style.display = 'none';
      viewLessLI.appendChild(viewLessSpan);
      ul.append(viewLessLI);

      // Event listeners for "View More" and "View Less" links
      block
        .querySelector('.viewMoreLink')
        .addEventListener('click', () => handleViewMoreClick(block, numFeaturedProducts));
      block
        .querySelector('.viewLessLink')
        .addEventListener('click', () => handleViewLessClick(block, numFeaturedProducts));
    }
  }

  // Toggle functionality for products/sub-pages
  const toggleElements = block.querySelectorAll('.js-toggle');
  if (toggleElements) {
    toggleElements.forEach((toggleElement) => {
      const subMenu = toggleElement.parentElement.querySelector('ul');
      toggleElement.classList.add('expanded');
      toggleElement.addEventListener('click', (event) => {
        event.preventDefault();
        subMenu.style.display = subMenu.style.display === 'block' || subMenu.style.display === '' ? 'none' : 'block';
        toggleElement.classList.toggle('collapsed', subMenu.style.display === 'none');
        toggleElement.classList.toggle('expanded', subMenu.style.display === 'block');
      });
    });
  }
}

function displayManualNav(manualNav, block) {
  // get root ul
  const rootUL = manualNav.querySelector('ul');
  rootUL.classList.add('subPages');

  // every li entry that is not a link gets a span
  [...rootUL.querySelectorAll('li')]
    .filter((li) => li.firstChild.nodeName === '#text')
    .forEach((li) => {
      const span = document.createElement('span');
      span.appendChild(li.firstChild);
      li.insertBefore(span, li.firstChild);
    });

  // set class for li with sub pages, add collapse icon
  [...rootUL.querySelectorAll('li')]
    .filter((li) => li.querySelector('ul'))
    .forEach((li) => {
      li.classList.add('hasSubPages');
      const toggleIcon = document.createElement('span');
      toggleIcon.classList.add('js-toggle');
      li.querySelector('ul').before(toggleIcon);
    });

  // add manual nav to rail
  block.append(rootUL);
}

// Main function to decorate the block
export default async function decorate(block) {
  // get any defined manual navigation
  const [manualNav] = block.querySelectorAll(':scope div > div');

  // to avoid dublication when editing
  block.textContent = '';

  const theme = getMetadata('theme');

  // const label = getMetadata('og:title');

  // const results = await ffetch(`/${getPathDetails().lang}/articles-index.json`).all();
  // const currentPagePath = getEDSLink(window.location.pathname);

  // For Browse All Page
  if (theme.startsWith('article-')) {
    // Browse By
    const browseByUL = document.createElement('ul');
    browseByUL.classList.add('browse-by');
    const browseByLI = document.createElement('li');
    const browseBySpan = createPlaceholderSpan('browseBy', 'Browse By');
    const browseAllContentSpan = createPlaceholderSpan('allThoughtLeadership', 'All thought leadership');
    browseAllContentSpan.classList.add('is-active');
    const ul = document.createElement('ul');
    const li = document.createElement('li');
    ul.append(li);
    li.append(browseAllContentSpan);

    browseByLI.appendChild(browseBySpan);
    browseByLI.appendChild(ul);
    browseByUL.append(browseByLI);
    block.append(browseByUL);
    // Show All Products
    if (manualNav) {
      displayManualNav(manualNav, block);
    } else {
      displayAllProducts(block);
    }
  }
}
