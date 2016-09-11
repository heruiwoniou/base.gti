export default function Header(context){
	let head = context.el.querySelector('h1');
	let init = head == null ;
	head = head || document.createElement('h1');
	head.innerHTML = `<span class="left"><</span>${context.date.year()}年${context.date.month() + 1}月<span class="right">></span>`
	if( init ) context.el.appendChild(head);
}