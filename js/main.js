//網路應用程式網址
var Google_API = '請填入應用程式網址';
//試算表ID
var sheetID = '請填入試算表ID';
$(function() {
  //瀏覽器頁籤標題及網頁標題，可改
  $('#Title').html('請填入你像要的瀏覽器頁籤標題');
  $('#Header').html('請填入你想要的網頁標題');

  //後端資料庫連結網址記得要改
  $('#dataLink').html(
    '<a class="nav-link" href="請填入你的試算表網址" target="_blank"><i class="fas fa-database mr-1"></i>後端資料庫</a>',
  );
});
