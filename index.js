console.log('ok')
const slider = document.querySelector('.slider');
const sliderContainer = document.querySelector('.slider__container');

//API 

/*API methods 
GET /api - получить список услуг
GET /api?service={n} - получить список барберов
GET /api?spec={n} - получить список месяца работы барбера
GET /api?spec={n}&month={n} - получить список дней работы барбера
GET /api?spec={n}&month={n}&day={n} - получить список свободных часов барбера
POST /api/order - оформить заказ
*/

const API_URL = 'https://sudsy-transparent-handsaw.glitch.me';

//need for IPhone, Safari, Firefox 
const year = new Date().getFullYear();


//preload before init slider 
const addPreload = (el) => {
    el.classList.add('preload')
};

const removePreload = (el) => {
    el.classList.remove('preload')
};

const initSlider = () => {
    sliderContainer.style.display = 'none';
    addPreload(slider);
    window.addEventListener('load', () => {
        removePreload(slider);
        //start slider
        startSlider(); 
        sliderContainer.style.display = '';
    });
};
initSlider();

//slider
const startSlider = () => {
    const sliderItems = document.querySelectorAll('.slider__item');
    const sliderList = document.querySelector('.slider__list');
    const btnPrevSlide = document.querySelector('.slider__arrow-right');
    const btnNextSlide = document.querySelector('.slider__arrow-left');

    let activeSlide = 1;
    let position = 0;

const checkSlider = () => {
    if ((activeSlide + 2 === sliderItems.length && 
        document.documentElement.offsetWidth > 450) || 
        activeSlide === sliderItems.length) {
        btnNextSlide.style.display = 'none'
    } else {
        btnNextSlide.style.display = '';
    }

    if (activeSlide === 1) {
        btnPrevSlide.style.display = 'none'
    } else {
        btnPrevSlide.style.display = '';
    }
}

checkSlider();

const nextSlide = () => {
    sliderItems[activeSlide]?.classList.remove('slider__item-active');
    position = -sliderItems[0].clientWidth * activeSlide;

    sliderList.style.transform = `translateX(${position}px)`;
    activeSlide += 1;

    sliderItems[activeSlide]?.classList.add('slider__item-active');
    checkSlider();
}

const prevSlide = () => {
    sliderItems[activeSlide]?.classList.remove('slider__item-active');
    position = -sliderItems[0].clientWidth * (activeSlide - 2);

    sliderList.style.transform = `translateX(${position}px)`;
    activeSlide -= 1;

    sliderItems[activeSlide]?.classList.add('slider__item-active');
    checkSlider();
}

    btnNextSlide.addEventListener('click', nextSlide);
    btnPrevSlide.addEventListener('click', prevSlide);

    window.addEventListener('resize', () => {
        if (activeSlide + 2 > sliderItems.length &&
            document.documentElement.offsetWidth > 450) {
                activeSlide = sliderItems.length - 2;
                sliderItems[activeSlide]?.classList.add('slider__item-active');
            }
        position = -sliderItems[0].clientWidth * (activeSlide - 1);
        sliderList.style.transform = `translateX(${position}px)`;
        checkSlider();
    })
}
//slider

const renderPrice = (wrapper, data) => {

    data.forEach((item) => {
        const priceItem = document.createElement('li');
        priceItem.classList.add ('price__item');
        priceItem.innerHTML = ` 
        <span class="price__item-title">${item.name}</span>
        <span class="price__item-count">${item.price}</span>
        `;

        wrapper.append(priceItem);
    })
}

const renderService = (wrapper, data) => {
    const labels = data.map(item => {
        const label = document.createElement('label');
        label.classList.add('radio');
        label.innerHTML = `
        <input class="radio__input" type="radio" name="service" value="${item.id}">
        <span class="radio__label">${item.name}</span>
        `
        return label;
    })
    wrapper.append(...labels);
}

const initServices = () => {
    const reserveFieldsetService = document.querySelector('.reserve__fieldset_service')
    reserveFieldsetService.innerHTML = '<legend class="reserve__legend">Услуга</legend>'
    
    addPreload(reserveFieldsetService);

    const priceList = document.querySelector('.price__list');
    priceList.textContent = '';

    addPreload(priceList);

    fetch(`${API_URL}/api`)
        .then((response) => {return response.json();})
        .then(data => {
            renderPrice(priceList, data);
            removePreload(priceList);
            return data;
        })
        .then(data => {
            renderService(reserveFieldsetService, data);
            removePreload(reserveFieldsetService);
            return data;
        })
}

const addDisabled = (arr) => {
    arr.forEach(el => {
        el.disabled = true;
    })
}

const removeDisabled = (arr) => {
    arr.forEach(el => {
        el.disabled = false;
    })
}

const renderSpec = (wrapper, data) => {
    console.log(data)
    const labels = data.map(item => {
        const label = document.createElement('label');
        label.classList.add('radio');
        label.innerHTML = 
        `<input class="radio__input" type="radio" name="spec" value="${item.id}">
        <span class="radio__label radio__label-spec" style="--bg-image: url(${API_URL}/${item.img})">${item.name}</span>`
        return label;
    });
    wrapper.append(...labels);
};

const renderMonth = (wrapper, data) => {
    console.log(data)
    const labels = data.map(month => {
        const label = document.createElement('label');
        label.classList.add('radio');
        label.innerHTML = 
        `<input class="radio__input" type="radio" name="month" value="${month}">
        <span class="radio__label">${new Intl.DateTimeFormat('ru-Ru', {
            month: 'long'
        }).format(new Date(year, month))}</span>`
        return label;
    });
    wrapper.append(...labels);
};

const renderDay = (wrapper, data, month) => {
    const labels = data.map((day) => {
        const label = document.createElement('label');
        label.classList.add('radio');
        label.innerHTML = 
        `
        <input class="radio__input" type="radio" name="day" value="${day}">
        <span class="radio__label">${new Intl.DateTimeFormat('ru-Ru', {
            month: 'long', day: 'numeric'
        }).format(new Date(year, month, day))}</span>`
        return label;
    });
    wrapper.append(...labels);
};

const renderTime = (wrapper, data) => {
    const labels = data.map((time) => {
        const label = document.createElement('label');
        label.classList.add('radio');
        label.innerHTML = 
        `
        <input class="radio__input" type="radio" name="time" value="${time}">
        <span class="radio__label">${time}</span>`
        return label;
    });
    wrapper.append(...labels);
};

const initReserve = () => {
    const reserveForm = document.querySelector('.reserve__form');
    /*addDisabled([
        reserveForm.fieldspec, 
        reserveForm.fielddate,
        reserveForm.fieldmonth,
        reserveForm.fieldday,
        reserveForm.fieldtime,
        reserveForm.btn
    ])*/

    //пример деструктуризации (деструктивное присвоение)  равносильно примеру выше
    const {fieldservice, fieldspec, fielddate, fieldmonth, fieldday, fieldtime, btn} = reserveForm;
    addDisabled([fieldspec, fielddate, fieldmonth, fieldday, fieldtime, btn]);

    reserveForm.addEventListener('change', async event => {
        const target = event.target;
        console.log('target: ', target)

        if(target.name === 'service') {
            addDisabled([fieldspec, fielddate, fieldmonth, fieldday, fieldtime, btn]);

            fieldspec.innerHTML = '<legend class="reserve__legend">Специалисты</legend>';

            addPreload(fieldspec);

            const response = await fetch(`${API_URL}/api?service=${target.value}`);
            console.log('response: ', response);
            const data = await response.json();
            console.log('data: ', data);

            
            renderSpec(fieldspec, data);

            removePreload(fieldspec);

            removeDisabled([fieldspec]);
        }

        if(target.name === 'spec') {
            addDisabled([fielddate, fieldmonth, fieldday, fieldtime, btn]);
            
            addPreload(fieldmonth);

            const response = await fetch(`${API_URL}/api?spec=${target.value}`);
            console.log('response: ', response);
            const data = await response.json();
            console.log('data: ', data);

            fieldmonth.textContent = '';
            renderMonth(fieldmonth, data);

            removePreload(fieldmonth);

            removeDisabled([fielddate, fieldmonth]);
        }

        if(target.name === 'month') {
            addDisabled([fieldday, fieldtime, btn]);
            
            addPreload(fieldday);

            const response = await fetch(
                `${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}`,
                );
            const data = await response.json();

            fieldday.textContent = '';
            renderDay(fieldday, data, reserveForm.month.value);
            removePreload(fieldday);
            removeDisabled([fieldday]);
        }

        if(target.name === 'day') {
            addDisabled([ fieldtime, btn]);
            
            addPreload(fieldtime);

            const response = await fetch(
                `${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}&day=${target.value}`,
                );
            const data = await response.json();

            fieldtime.textContent = '';
            renderTime(fieldtime, data);
            removePreload(fieldtime);
            removeDisabled([fieldtime]);
        }

        if(target.name === 'time') {
            removeDisabled([btn]);
        }
    })

    reserveForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(reserveForm);
        const json = JSON.stringify(Object.fromEntries(formData));

        const response = await fetch(`${API_URL}/api/order`, {
            method: 'post',
            body: json,
        });

        const data = await response.json();
        
        addDisabled([fieldservice, fieldspec, fielddate, fieldmonth, fieldday, fieldtime, btn]);

        const p = document.createElement('p');
        p.style.marginTop = '50px';

        p.textContent = `Спасибо за бронь #${data.id}! 
        Ждем Вас  ${new Intl.DateTimeFormat('ru-Ru', {
            month: 'long',
            day: 'numeric',
        }).format(new Date(`${data.month}/${data.day}`))}.
        Время: ${data.time}.`;

        reserveForm.append(p);
    })
};

const init = () => {
    initSlider();
    initServices();
    initReserve();
}

window.addEventListener('DOMContentLoaded', init);

