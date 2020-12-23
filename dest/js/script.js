{
    class Slider {

        //принимаем селектор блока со слайдером
        constructor(str) {
            this._init(str);
        }

        getNumberActiveSlide(){
            return +this._activeSlideNumber;
        }
        getCountItems(){
            return +this._countItems;
        }
        getWidth (){
            return +this._sliderWidth;
        }
        getHeight(){
            return +this._sliderHeight;
        }


        _init(str){
            console.log("init");
            try{
                this._slider= document.querySelector(str);
                if(!this._slider) throw new Error("Error! selector '" + str + "' not found");
            }
            catch(e) {
                console.log(e.message);
                return;
            }
            // стили для слайдера
            this._slider.style.position = "relative";
            this._slider.style.overflow = "hidden";
            
            this._sliderWidth = getComputedStyle(this._slider).width.slice(0, -2);
            this._sliderHeight = getComputedStyle(this._slider).height.slice(0, -2);
            
            this._countItems = this._slider.children.length;



            //стили для трэка
            let track = document.createElement("div");

            this._trackWidth =  this.getWidth() * this._countItems;
            track.style.width = this.getWidth() * this._countItems + "px";

            this._trackHeight =  this.getHeight();
            track.style.height = this.getHeight() + "px";

            track.style.transition = "left 0.5s";
            track.style.position = "absolute";
            track.style.top = "0px";
            track.style.left  = "0px";

            track.style.display = "flex";

            let listItems = this._slider.children;

            // оборачиваем элементы в трэк
            for(let i=0; i< listItems.length; i++)
            {   
                listItems[i].style.width = 100 / this._countItems +"%";
                listItems[i].style.height = this._trackHeight + "px";

                track.appendChild(listItems[i]);
                i--;
            }
            this._slider.appendChild(track); 
            this._track=track;

            this._activeSlideNumber = 0;


            //если меняется разрешение окна
            window.addEventListener("resize", ()=>{
                this._resize();
            });
        }

        _resize(){
            //Обновляем размеры самого окна со слайдером
            this._sliderWidth = getComputedStyle(this._slider).width.slice(0, -2);
            this._sliderHeight = getComputedStyle(this._slider).height.slice(0, -2);

            //Обновляем размер трека
            this._trackWidth =  this.getWidth() * this._countItems;
            this._trackHeight =  this.getHeight();
            this._track.style.height = this._trackHeight + "px";
            this._track.style.width = this._trackWidth + "px";

            this._track.style.left = -(this._activeSlideNumber * this.getWidth()) + "px"; 
            //Обновляем  айтемы
            let listItems = this._track.children;

            for (const it of listItems) {
                it.style.height = this._trackHeight + "px";
            }
        }

        toSlide(num){
            try{
                if( num> this._countItems-1 || num<0 || !isFinite(num)) throw new Error();
                this._activeSlideNumber = num;
                this._track.style.left = -(this._activeSlideNumber * this.getWidth()) + "px"; 
            }
            catch(e) {
                console.log("Слайдера с номером " + num + " не существует");
            }
        }
        nextSlide(){
            if(this._activeSlideNumber == this._countItems-1){
                this.toSlide(0);
                return;
            }
            this.toSlide(++this._activeSlideNumber);
        }
        prevSlide(){
            if(this._activeSlideNumber == 0) {
                this.toSlide(this._countItems-1);
                return;
            }
            this.toSlide(--this._activeSlideNumber);
        }
    }
    let slider = new Slider(".slider");
    let btnNext = document.querySelector(".nextBtn");
    let btnPrev = document.querySelector(".prevBtn");
    let btnSlide = document.querySelector(".toSlide");
    let input = document.querySelector(".slider__input");
    input.value=slider.getNumberActiveSlide();

    btnNext.addEventListener("click", ()=> {
        slider.nextSlide();
        input.value=slider.getNumberActiveSlide();
    });
    btnPrev.addEventListener("click", ()=> {
        slider.prevSlide();
        input.value=slider.getNumberActiveSlide();
    });
    btnSlide.addEventListener("click", ()=> {
        slider.toSlide(input.value);
        // alert("active slide: " + slider.getNumberActiveSlide() + "\n" + "all slides :" + slider.getCountItems());
    });
}