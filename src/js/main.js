if ($('.adaptive-slider-items').length) {
    var addSlider = function () {
        $('.adaptive-slider-items').addClass('uk-slider-items');
        UIkit.slider('.adaptive-slider', {});
    };

    var removeSlider = function () {
        $('.adaptive-slider-items').addClass('uk-slider-items');
        UIkit.slider('.adaptive-slider', {}).$destroy();
        $('.adaptive-slider-items').removeClass('uk-slider-items');
        $('.adaptive-slider-items').removeAttr('style');
    };

    $(window).on('load resize', function () {
        if ($(window).width() < 959) {
            addSlider();
        } else if ($(window).width()) {
            removeSlider();
        }
    });
}

// if ($('.section-subcatalog').length) {
//     var element = $('.section-subcatalog');
//     var maxsize = element.attr('data-maxheight');
//     var windowsize = 959;
//     $(window).on('load resize', function () {
//         if (element.innerHeight() > maxsize && $(window).width() < windowsize)  {
//             element.removeClass("full");
//             $("#show-more").css('display','block');
//             element.addClass("read-more");
//             $("#show-more").click(function (e) {
//                 element.addClass("full");
//                 $("#show-more").hide();
//                 e.preventDefault();
//             });
//         } else if ($(window).width() > windowsize) {
//             element.addClass("full");
//             $("#show-more").hide();
//         }
//     });
// }

UIkit.util.on('.head-wrapper', 'active', function () {
    UIkit.grid('.head-grid', {}).$emit(type = 'update');
});

UIkit.util.on('.head-wrapper', 'inactive', function () {
    UIkit.grid('.head-grid', {}).$emit(type = 'update');
});

const addAccordion = (mobileAccordion, mobileAccordionTitle, mobileAccordionContent, accordionTargets) => {
    mobileAccordionTitle.wrap("<a class='uk-accordion-title'></a>");
    mobileAccordionContent.addClass('uk-accordion-content');
    mobileAccordion.attr('uk-accordion', `multiple: true; targets: ${accordionTargets}`);
    $('.footer .accordion > div:first-child').addClass('uk-open');

};

const removeAccordion = (mobileAccordion, mobileAccordionTitle, mobileAccordionContent) => {
    mobileAccordionTitle.unwrap();
    mobileAccordionContent.removeClass('uk-accordion-content').removeAttr('hidden');
    mobileAccordion.removeAttr('uk-accordion').removeClass('uk-accordion');
    $('.footer .accordion > div').removeClass('uk-open');
};

const toMobileAccordion = (width, mobileAccordion, mobileAccordionTitle, mobileAccordionContent, accordionTargets = '> *') => {
    $(window).on('load resize', () => {
        if ($(window).width() < width && !mobileAccordionContent.hasClass('uk-accordion-content')) {
            addAccordion(mobileAccordion, mobileAccordionTitle, mobileAccordionContent, accordionTargets);
        } else if ($(window).width() > width && mobileAccordionContent.hasClass('uk-accordion-content')) {
            removeAccordion(mobileAccordion, mobileAccordionTitle, mobileAccordionContent);
        }
    });
};

toMobileAccordion(639, $('.accordion'), $('.accordion h4'), $('.accordion .accordion-content'));
toMobileAccordion(959, $('.accordion-repair'), $('.accordion-repair .accordion-title'), $('.accordion-repair .accordion-content'));


// menu с уровнями на мобиле
(function () {
    $('.main-nav li > .subnav').parent().addClass('has-subnav');

    $('.main-nav li.has-subnav > a').each(function () {
        var $this = $(this);
        var myClone = $this.clone();
        var myCloneParent = $this.next('.subnav');
        myClone.prependTo(myCloneParent).wrap('<li class="menu-title"></li>');
        myCloneParent.prepend("<li><a class='back-track'>Назад</a></li>");

    });


    $('.main-nav li.has-subnav > a').click(function (e) {
        e.preventDefault();
        var $this = $(this);
        $this.parent().parent().addClass('uk-overflow-hidden').scrollTop(0);
        $this.next('.subnav').addClass('active');
        $('.main-nav').scrollTop(0);
    });

    $('.main-nav a.back-track').click(function () {
        var $this = $(this);
        $this.parent().parent().removeClass('active');
        $this.parent().parent().parent().parent().removeClass('uk-overflow-hidden');
    });
})();

//гамбургер
(function () {
    var mmenuOpen = () => {
        $('.menuMenu').addClass('menuMenu-active');
        $('body').addClass('menuMenu-body');
        $('.menuMenu-overlay').addClass('menuMenu-overlay-act');
    };

    window.mmenuClose = () => {
        $('.menuMenu').removeClass('menuMenu-active');
        $('body').removeClass('menuMenu-body');
        $('.menuMenu-overlay').removeClass('menuMenu-overlay-act');
    };

    $('.hamburger').on('click', mmenuOpen);
    $('.menuMenu-overlay-close').on('click', mmenuClose);
})();

(function () {
    if ($('.product_image').length) {
        $('.product_image').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: false,
            fade: true,
            asNavFor: '.product_images',

        });
        $('.product_images').slick({
            slidesToScroll: 1,
            asNavFor: '.product_image',
            focusOnSelect: true,
            variableWidth: true,
            arrows: false,
            dots: false,
        });
    }
})();


UIkit.util.on('#show-more-specs', 'scrolled', function () {
    UIkit.switcher('.selectors').show(1);
});

$('#show-more-usage').on('click', function () {
    UIkit.scroll('#show-more-usage').scrollTo('#selectors');
    UIkit.switcher('.selectors').show(2);
});

if ($('.specs').length) {
    $(window).on('load resize', function () {
        if ($(window).width() < 959) {
            $('.specs').find('li').addClass('uk-active uk-margin-bottom');
        } else if ($(window).width() > 959) {
            $('.specs').find('li').removeClass('uk-active');
            $('.specs').find('li.uk-active').removeClass('uk-active');
            UIkit.switcher('.selectors').show(0);
        }
    });
}

/**
 * Отправка AJAX форм
 */
(function () {
    var ajaxFormCreate = function (button, container, form) {
        var $body = $('body');
        $body
            .off('click' + button)
            .on('click' + button, button, function (e) {
                e.preventDefault();

                var _ = $(this);
                var $rForm = _.closest(container);

                $.ajax({
                    type: "POST",
                    url: _.closest(form).attr('action'),
                    data: new FormData(_.closest(form)[0]),
                    contentType: false,
                    processData: false,
                    success: function (response) {

                        var $res = $('<div>').append($.parseJSON(response).html);

                        $rForm.replaceWith($res.find(container));
                    },
                    error: function (response) {
                        console.log(response);
                    }
                });
            });
    };
    ajaxFormCreate('.rSave', '.rContainer', '.rForm');
})();


(function () {
    $(window).on('load resize', function () {
        if ($(".bottom-text").innerHeight() > 400) {
            $(".bottom-text").removeClass("full");
            $("#show-more-link").css('display', 'block');
            $(".bottom-text").addClass("read-more");
            $("#show-more-link").click(function (e) {
                $(".bottom-text").addClass("full");
                $("#show-more-link").hide();
                e.preventDefault();
            });
        }
    });
})();

$('.head-dropdown-more').on('click', function (e) {
    e.preventDefault();
    this.closest('.head-dropdown-list').classList.toggle('list-active');
    var cur = this.dataset.toggle;
    this.dataset.toggle = this.textContent;
    this.textContent = cur;
    UIkit.grid('.head-dropdown-grid', {masonry: true}).$emit(type = 'update');
});

/*
function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCityCookies () {
    UIkit.dropdown('.desk-city-drop').hide(false);
    UIkit.notification.closeAll();
    setCookie('city', 1, {expires: 86400 * 7 * 1000});
}

if(!getCookie('city')) {
    if ($(window).width() < 960) {
        UIkit.notification({
            message: document.querySelector('.desk-city-drop').innerHTML,
            timeout: 100000
        });
    } else {
        UIkit.dropdown('.desk-city-drop').show();
    }
}

$('.save-city-check').on('click', setCityCookies);
toMobileAccordion(959, $('.accordion-checkout'), $('.accordion-checkout .accordion-title'), $('.accordion-checkout .accordion-content'));

const techBanner = document.querySelector('.tech-banner');
const techBannerBtn = document.querySelector('.tech-banner .uk-button');
const techBannerClose = document.querySelector('.tech-banner .tech-banner__close');
if (!getCookie('tech-price') && techBanner) {
    techBanner.classList.remove('close');
    techBannerBtn.addEventListener('click', function () {
        techBanner.classList.add('close');
        // location.href = '/catalog/elektricheskie-kondicionery/'
        setCookie('tech-price', '1', {expires: 3600 * 24 * 7 * 1000});
    });
    techBannerClose.addEventListener('click', function () {
        techBanner.classList.add('close');
    });
}*/


/**
 * new
 */

// Input check
if (document.querySelector('[data-input-check]')) {
    document.querySelectorAll('[data-input-check]').forEach((elm) => {
        switch (elm.dataset.inputCheck) {
            case 'number':
                let numberSelection = this.selectionStart - 1;
                elm.addEventListener("input", function () {
                    this.value = this.value.replace(/[^\d\\+]/g, "");
                });
                break;
            case 'phone':
                elm.addEventListener("input", function () {
                    if (/[^\d\\+]/g.test(this.value)) {
                        let Selection = this.selectionStart - 1;
                        this.value = this.value.replace(/[^\d\\+]/g, '');
                        this.setSelectionRange(Selection, Selection);
                    }
                });
                break;
            case 'text':
                elm.addEventListener("input", function () {
                    if (/[^a-zA-ZА-яЁё\s]/g.test(this.value)) {
                        let Selection = this.selectionStart - 1;
                        this.value = this.value.replace(/[^a-zA-ZА-яЁё\s]/g, '');
                        this.setSelectionRange(Selection, Selection);
                    }
                });
                break;
        }
    })
}