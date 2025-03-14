import './src/scss/style.scss';

const icons = document.querySelectorAll('.side-menu__icon');

icons.forEach((icon, index) => {
    const iconNumber = index + 1;
    icon.style.backgroundImage = `url(/icons/icon-${iconNumber}.svg)`;
    icon.style.backgroundSize = 'contain';
    icon.style.backgroundPosition = 'center';
    icon.style.backgroundRepeat = 'no-repeat';
    icon.style.width = '24px';
    icon.style.height = '24px';
});

document.addEventListener('DOMContentLoaded', function() {
    const selectValue = document.querySelector('.select-value');
    const selectOptions = document.querySelector('.select-options');
    const hiddenSelect = document.querySelector('.hidden-select');
    const options = document.querySelectorAll('.select-options li');
    const arrow = document.querySelector('.select-value__arrow');

    selectValue.addEventListener('click', function() {
        const isOpen = selectOptions.style.display === 'block';
        selectOptions.style.display = selectOptions.style.display === 'block' ? 'none' : 'block';
        arrow.classList.toggle('rotate', !isOpen);
});

    options.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const title = this.querySelector('.select-value__title').textContent;
            const subtitle = this.querySelector('.select-value__subtitle').textContent;

        hiddenSelect.value = value;
            document.querySelector('.select-value__title').textContent = title;
            document.querySelector('.select-value__subtitle').textContent = subtitle;

        selectOptions.style.display = 'none';
        arrow.classList.remove('rotate'); 
    });
});

    document.addEventListener('click', function(event) {
        if (!selectValue.contains(event.target) && !selectOptions.contains(event.target)) {
            selectOptions.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const burgerButton = document.getElementById('burger-button');
    const sideBar = document.getElementById('side-bar');
    const sideElements = sideBar.querySelector('.side-bar__elements');
    
    const elements = {
        profile: {
            element: document.querySelector('.header__profile'),
            breakpoint: 1024
        },
        nav: {
            element: document.getElementById('nav'),
            breakpoint: 800
        },
        search: {
            element: document.querySelector('.header__search'),
            breakpoint: 587
        }
    };

    const originalPositions = new WeakMap();

    function manageElement(elementInfo, screenWidth) {
        const { element, breakpoint } = elementInfo;
        if (!element) return;

        const shouldMove = screenWidth <= breakpoint;
        const currentParent = element.parentElement;

        if (shouldMove && currentParent !== sideElements) {
            if (!originalPositions.has(element)) {
            originalPositions.set(element, {
                parent: currentParent,
                nextSibling: element.nextElementSibling
            });
        }
            sideElements.appendChild(element);
        
    } else if (!shouldMove && currentParent === sideElements) {
        const original = originalPositions.get(element);
            if (original) {
                original.parent.insertBefore(element, original.nextSibling);
            }
        }
    }

    function manageLayout() {
        const width = window.innerWidth;
        
        Object.values(elements).reverse().forEach(el => {
            manageElement(el, width);
        });
    }

    burgerButton.addEventListener('click', () => {
        sideBar.classList.toggle('active');
        burgerButton.classList.toggle('active');
    });

    window.addEventListener('resize', () => {
        manageLayout();
        if (window.innerWidth > 1024) {
            sideBar.classList.remove('active');
        }
    });

    manageLayout();
});


class GridManager {
    constructor() {
        this.grid = document.querySelector('.main__content');
        this.observer = new MutationObserver(mutations => 
            this.handleMutation(mutations));
        this.observer.observe(this.grid, { 
            childList: true,
            subtree: true
        });
    }

    handleMutation(mutations) {
        mutations.forEach(mutation => {
            mutation.removedNodes.forEach(node => {
                if(node.classList.contains('container-2')) {
                    this.expandElement('.container-3');
                }
                if(node.classList.contains('container-3')) {
                    this.expandElement('.container-2');
                }
                if(node.classList.contains('container-5')) {
                    this.expandElement('.container-6');
                }
                if(node.classList.contains('container-6')) {
                    this.expandElement('.container-5');
                }
            });
            
            mutation.addedNodes.forEach(node => {
                if(node.classList.contains('container-2')) {
                    this.resetElement('.container-3');
                }
                if(node.classList.contains('container-3')) {
                    this.resetElement('.container-2');
                }
                if(node.classList.contains('container-5')) {
                    this.resetElement('.container-6');
                }
                if(node.classList.contains('container-6')) {
                    this.resetElement('.container-5');
                }
            });
        });
    }

    expandElement(selector) {
        const element = document.querySelector(selector);
        if(element) {
            element.classList.add('expanded');
            this.grid.style.display = 'none';
            this.grid.offsetHeight; 
            this.grid.style.display = 'grid';
        }
    }

    resetElement(selector) {
        const element = document.querySelector(selector);
        if(element) {
            element.classList.remove('expanded');
        }
    }
}

const gridManager = new GridManager();