alert('hello world!');
console.log(window.clickParams);
alert(window.clickParams.name + ' clicked');

var searchKeyword = 'GT42G000001';

$.ajax({
    url: 'http://127.0.0.1:8080/searchDatabase/getHaplotypeTable/',
    data: { searchKeyword: searchKeyword }, type: 'GET',
    success: function (data) { console.log(data); },
    error: function (jqXHR, textStatus, errorThrown) {
        console.error('There has been a problem with your ajax operation:', textStatus, errorThrown);
    }
});