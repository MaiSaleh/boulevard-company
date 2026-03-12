const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", function(){
if(window.scrollY > 300){
scrollBtn.classList.add("show");
}else{
scrollBtn.classList.remove("show");
}
});

scrollBtn.onclick = function(){
window.scrollTo({
top:0,
behavior:"smooth"
});
};