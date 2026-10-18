const div = document.createElement('div');
div.style.color = 'oklch(0.7 0.1 200)';
document.body.appendChild(div);
console.log(window.getComputedStyle(div).color);
