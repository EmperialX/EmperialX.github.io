class Preloader{constructor(){this.preloader=document.querySelector(".preloader")}show(){this.preloader?.classList.remove("hidden")}hide(){this.preloader?.classList.add("hidden"),setTimeout(()=>{this.preloader?.remove()},300)}static inject(){let e=`
    <div class="preloader">
        <div class="loader"></div>
    </div>
`;document.body.insertAdjacentHTML("afterbegin",e)}}document.addEventListener("DOMContentLoaded",()=>{Preloader.inject();let e=new Preloader;window.addEventListener("load",()=>{setTimeout(()=>e.hide(),500)})});