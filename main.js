import './src/scss/style.scss';

//Иконки в боковом меню
const initIcons = () => {
    document.querySelectorAll('.side-menu__icon').forEach((icon, index) => {
        Object.assign(icon.style, {
            backgroundImage: `url(/icons/icon-${index + 1}.svg)`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '24px',
            height: '24px'
        });
    });
};

//Селеект валью
const initCustomSelect = () => {
    const selectValue = document.querySelector('.select-value');
    const selectOptions = document.querySelector('.select-options');
    const hiddenSelect = document.querySelector('.hidden-select');
    const arrow = document.querySelector('.select-value__arrow');

    const toggleSelect = (isOpen) => {
        selectOptions.style.display = isOpen ? 'block' : 'none';
        arrow.classList.toggle('rotate', isOpen);
    };

    const handleOptionClick = (option) => {
        const title = option.querySelector('.select-value__title').textContent;
        const subtitle = option.querySelector('.select-value__subtitle').textContent;

        hiddenSelect.value = option.dataset.value;
        document.querySelector('.select-value__title').textContent = title;
        document.querySelector('.select-value__subtitle').textContent = subtitle;
        toggleSelect(false);
    };

    selectValue.addEventListener('click', () => toggleSelect(selectOptions.style.display !== 'block'));
    
    selectOptions.addEventListener('click', (e) => {
        const option = e.target.closest('li');
        if (option) handleOptionClick(option);
    });

    document.addEventListener('click', (e) => {
        if (!selectValue.contains(e.target) && !selectOptions.contains(e.target)) {
            toggleSelect(false);
        }
    });
};

//Адаптив шапки
class ResponsiveMenu {
    constructor() {
        this.burgerButton = document.getElementById('burger-button');
        this.sideBar = document.getElementById('side-bar');
        this.sideElements = this.sideBar.querySelector('.side-bar__elements');
    
        this.elements = {
        profile: { element: document.querySelector('.header__profile'), breakpoint: 1024 },
        search: { element: document.querySelector('.header__search'), breakpoint: 800 },
        nav: { element: document.getElementById('nav'), breakpoint: 800 }
    };

        this.originalPositions = new WeakMap();
        this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
        this.init();
    }

    init() {
        this.burgerButton.addEventListener('click', this.toggleMenu.bind(this));
        this.resizeObserver.observe(document.documentElement);
        this.manageLayout();
    }

    toggleMenu() {
        this.sideBar.classList.toggle('active');
        this.burgerButton.classList.toggle('active');
    }

    manageElement({ element, breakpoint }, width) {
        if (!element) return;

        const shouldMove = width <= breakpoint;
        const currentParent = element.parentElement;

        if (shouldMove && currentParent !== this.sideElements) {
            if (!this.originalPositions.has(element)) {
                this.originalPositions.set(element, {
                    parent: currentParent,
                    nextSibling: element.nextElementSibling
                });
            }
            this.sideElements.appendChild(element);
        } else if (!shouldMove && currentParent === this.sideElements) {
            const original = this.originalPositions.get(element);
            
            if (original?.parent?.isConnected) {
                try {
                    const isValidAnchor = original.nextSibling?.parentNode === original.parent;
                    
                    if (isValidAnchor) {
                        original.parent.insertBefore(element, original.nextSibling);
                    } else {
                        original.parent.appendChild(element);
                    }
                } catch (error) {
                    console.error("Element move error:", error);
                    original.parent.appendChild(element);
                }
            }
        }
    }

    manageLayout() {
        const width = window.innerWidth;
        Object.values(this.elements).forEach(el => this.manageElement(el, width));
    }

    handleResize() {
        this.manageLayout();
    if (window.innerWidth > 1024) {
        this.sideBar.classList.remove('active');
        }}
}

//Грид сетка
    class GridManager {
        constructor() {
    this.grid = document.querySelector('.main__content');
    this.pairs = new Map([
        ['container-2', 'container-3'],
        ['container-3', 'container-2'],
        ['container-5', 'container-6'],
        ['container-6', 'container-5']
    ]);

    this.observer = new MutationObserver(mutations => 
        mutations.forEach(m => this.handleMutation(m)));
    this.observer.observe(this.grid, { 
        childList: true,
        subtree: true
    });
}

    handleMutation(mutation) {
        mutation.removedNodes.forEach(node => {
            const target = this.pairs.get(node.classList?.[0]);
            if (target) this.toggleElement(target, true);
        });

        mutation.addedNodes.forEach(node => {
        const target = this.pairs.get(node.classList?.[0]);
        if (target) this.toggleElement(target, false);
    });
}

    toggleElement(selector, expand) {
        const element = document.querySelector(selector);
        if (!element) return;
    
        element.classList.toggle('expanded', expand);
        if (expand) {
        requestAnimationFrame(() => {
            this.grid.style.display = 'none';
            this.grid.offsetHeight;
            this.grid.style.display = 'grid';
        });
    }}
}



document.addEventListener('DOMContentLoaded', () => {
    initIcons();
    initCustomSelect();
    new ResponsiveMenu();
    new GridManager();
});