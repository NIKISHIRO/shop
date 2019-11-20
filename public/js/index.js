function addHandler() {
    $('.categories-cat__separate-icon').on('click', function() {
        $(this).parent().remove();
    });
}

const formValid = (val) => /^[0-9a-zA-Zа-яА-Я]{1,30}$/.test(val);

const categoryTextError = `<div class="category-error alert alert-danger alert-dismissible fade show" role="alert">
<strong>Ошибка!</strong>&nbsp;Текстовое поле может содержать только латинские буквы, русские буквы и цифры.
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
</div>`;

/**BOOTSTRAP */
$(".alert").alert();
$('.category-error').toggle();

const priceFormat = (number) => {
    $('.price, .cart-total').each((id, el) => {
        const currentPrice = $(el).text().trim();
        const price = new Intl.NumberFormat('ru-RU').format(currentPrice);
        $(el).text(price);
    });
};
priceFormat();

$('.category-list__all a').on('click', function(e) {
    e.preventDefault();
    $(this).toggleClass('select');
    const $cats = $('.category-list__all a[class="select"]');
    let catsList = [];
    $cats.each((id, el) => {
        let nCat = $(el).text().trim();
        catsList.push(nCat);
    });

    $('#cat-list').val(JSON.stringify(catsList));
});

$('.category a[data-cat]').on('click', function() {
    const $catLink = $(this);
    const catText = $catLink.attr('data-cat').trim();
    $catLink.toggleClass('cat-select');
});

$('#filter').on('click', function() {
    const $cats = $('.category a[class="cat-select"]'); 
    let catsList = [];
    $cats.each((id, el) => {
        let nCat = $(el).attr('data-cat').trim();
        catsList.push(nCat);
    });

    $.ajax({
        type: "POST",
        url: '/products/',
        data: {
            categories: JSON.stringify(catsList)
        },
        success: (products) => {
            const p = products.map(product => `
                    <div class="products-product">
                        <div class="products-left">
                            <div class="product-image">
                                <img src="${product.image}" alt="${product.title}"></div>
                            </div>
                        <div class="products-right">
                            <div class="product-title"><a href="/products/${product._id}">${product.title}</a></div>
                            <div class="product-description">${product.description}</div>
                            <div class="product-all-category">
                                ${product.categories.map(cat => `<span class="product-cat">${cat}</span>`).join('')}
                            </div>
                        </div>
                        <div class="product-price">
                            <span class="price">${product.price}</span>
                            <span>руб.</span>
                        </div>
                    </div>`);
            $('.products').html(p.join(''));
        }
      });
});

/* СТРАНИЦА КАТЕГОРИИ */
$('.categories-cat__title-link').on('click', function(e) {
    e.preventDefault();
    $(this).next().toggle(100);
});
// УДАЛИТЬ ПОДКАТЕГОРИЮ
addHandler();
// ДОБАВИТЬ НОВУЮ ПОДКАТЕГОРИЮ
$('.categories-cat__separate-add').on('click', function(e) {
    e.preventDefault();
    $(this).prev().append($('<div>', {
        html: `
            <div class="categories-cat__separate">
                <span class="categories-cat__separate-icon text-primary">
                    <span class="fi-minus"></span>
                </span>
                <input type="text" value="" class="form-control categories-cat__separate-input" placeholder="Новая подкатегория">
            </div>
        `,
    }));
    addHandler();
});

$('.categories-save').on('click', function(e) {
    e.preventDefault();
    const catId = $(this).attr('data-id');
    const catGeneral = $(this).prev().val().trim();
    const $subCats = $(this).parent().find('input');

    let flag = true;
    let catsArray = [];
    $subCats.each((id, subCat) => {
        const subCatVal = $(subCat).val().trim();
        
        if (!formValid(subCatVal)) {
            $('.categories-container').prepend(categoryTextError);
            setTimeout(() => {
                $('.category-error').eq(0).remove();
            }, 6000);
            return flag = false;
        }
        if ($(subCat).hasClass('categories-cat__separate-input')) {            
            catsArray.push(subCatVal);
        }
    });

    if (flag) {
        $.ajax({
            type: "POST",
            url: '/category/edit',
            data: {catId, catGeneral, catsArray},
            success: (res) => {
                console.log(res);
            }
        });
    }
});