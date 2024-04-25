import { htmlToElement } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const socialDiv = block.firstElementChild;
  const socialNetworks = socialDiv.textContent.split(',').map((network) => network.trim());

  block.textContent = '';

  const socialLinks = {
    Facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
    'X (formerly Twitter)': `https://twitter.com/intent/tweet?url=${window.location.href}`,
    LinkedIn: `https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`,
  };

  const networkIconClasses = {
    Facebook: 'fb-social-icon',
    LinkedIn: 'li-social-icon',
    'X (formerly Twitter)': 'x-social-icon',
  };

 // Wait for the document to finish loading
document.addEventListener("DOMContentLoaded", function() {
  // Find all meta tags with property="og:image"
  var ogImageTags = document.querySelectorAll('meta[property="og:image"]');
  console.log(ogImageTags,"ogimage")

  // Loop through each meta tag
  ogImageTags.forEach(function(tag) {
      // Get the content attribute value
      var content = tag.getAttribute('content');

      console.log(content,"content");

      // Check if the content contains '/default-meta-image.png'
      if (content && content.includes('/default-meta-image.png')) {
          // Remove the current meta tag from the document
          tag.parentNode.removeChild(tag);
      }
  });
});

  const headerDiv = htmlToElement(`
    <div class="social-share-block">
    <div class="social-share-title">
      ${'SHARE ON SOCIAL'}
    </div>
    <div class="social-share-view">
      ${socialNetworks
        .map(
          (network) => `<a href="${socialLinks[network]}" target="_blank">
      <div class="social-share-item">
      <span class="icon icon-${networkIconClasses[network]}"></span></span><span class="social-share-name">${network}</span>
      </div>
      </a>`,
        )
        .join('')}
    </div>
    </div>
  `);

  block.append(headerDiv);
  decorateIcons(block);
}
