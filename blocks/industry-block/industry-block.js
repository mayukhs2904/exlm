export default function decorate(block) {
    block.textContent = '';
  
    const industryBlockDiv = document.createRange().createContextualFragment(`
        <div class="industry-container">
        <h1>hello</h1>
        </div>
    `)
  
    block.append(industryBlockDiv);
}