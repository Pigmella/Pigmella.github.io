function doPost(e) {
  var params = e.parameter;
  // 所有可能會用到的值
  var isbn = params.isbn;
  var book_name = params.book_name;
  var member_id = params.member_id;
  var name = params.name;
  var book_author = params.book_author;
  var book_maker = params.book_maker;
  var bro_date = params.bro_date;
  var ret_date = params.ret_date;
  var sheetTag = params.sheetTag;
  var kind = params.kind;
  //指定連結剛剛建立的Google試算表資料庫
  var SpreadSheet = SpreadsheetApp.openById("請填入試算表ID");
  //取得頁籤（工作表）
  var Sheet = SpreadSheet.getSheetByName(sheetTag);
  //取得有資料的最後一行的"行數"(目的要在最後一行插入新資料，或查詢資料)
  var LastRow = Sheet.getLastRow();
  //取得有資料的最後一行的"欄數"(嗯～，不知道何時會用到)
  var LastCol = Sheet.getLastColumn();
  

  if (kind==1)  //還書作業
  {
    
   if(isbn !== undefined){
     
    var Sheet1 = SpreadSheet.getSheets()[1];
    var LastRow1 = Sheet1.getLastRow();
    var LastCol1 = Sheet1.getLastColumn();
     
     for(var j=LastRow1;j>=2;j--)
    {
      if(Sheet1.getSheetValues(j, 1, 1, 1)==isbn)
      {
        Sheet1.getRange(j, 5).setValue('在庫');
        break;
      }
    }
     
     
     for (var i=LastRow;i>=2;i--)
     {
        if (Sheet.getSheetValues(i, 1, 1, 1)==isbn && Sheet.getSheetValues(i, 6, 1, 1)=='')
        {
          Sheet.getRange(i, 6).setValue(ret_date);
          return ContentService.createTextOutput(JSON.stringify(Sheet.getSheetValues(i, 4, 1, 1)+'歸還書本「'+Sheet.getSheetValues(i, 2, 1, 1)+'」'));
        }
        else if(Sheet.getSheetValues(i, 1, 1, 1)==isbn && Sheet.getSheetValues(i, 6, 1, 1)!=='')
        {
          return ContentService.createTextOutput(JSON.stringify('本書-「'+Sheet.getSheetValues(i, 2, 1, 1)+'」經系統顯示為在庫狀態'));
        }
     }
   }

  //檢查書庫中是否有這本書沒有的話即回傳false
    if (book_name == undefined)
    return ContentService.createTextOutput(JSON.stringify(false));   
  }
  
  else if(kind==2)  //取得人員姓名
  {
  for (var i=2;i<=LastRow;i++)
  {
    if (Sheet.getSheetValues(i, 1, 1, 1)==member_id)
    {
      name = Sheet.getSheetValues(i, 2, 1, 1);
      break;
    }
  }
  if (name==undefined)
    return ContentService.createTextOutput(JSON.stringify(false));
  else
    return ContentService.createTextOutput(JSON.stringify(name));
  }

  else if(kind==3)  //查詢書籍並寫入借閱紀錄
  {
  for (var i=2;i<=LastRow;i++)
  {
    if (Sheet.getSheetValues(i, 1, 1, 1)==isbn)
    {
      book_name = Sheet.getSheetValues(i, 2, 1, 1);
      break;
    }
  }
  if (book_name !=undefined)
  {
    var Sheet1 = SpreadSheet.getSheets()[0];
    var LastRow1 = Sheet1.getLastRow();
    var LastCol1 = Sheet1.getLastColumn();
    //查詢本書是否外借中
    for (var i=LastRow;i>=2;i--)
    {
        if (Sheet.getSheetValues(i, 1, 1, 1)==isbn && Sheet.getSheetValues(i, 5, 1, 1) != '在庫')
          return ContentService.createTextOutput(JSON.stringify('本書「'+book_name+'」已被'+Sheet.getSheetValues(i, 5, 1, 1)+'借出，請先歸還再借'));
    }
    var data = Array(isbn, book_name, member_id, name, bro_date);
    data.forEach(function(e,i){
        Sheet1.getRange(LastRow1+1, i+1).setValue(e);});
    
    //寫入保管人欄位
    for(var j=LastRow;j>=2;j--)
    {
      if(Sheet.getSheetValues(j, 1, 1, 1)==isbn)
      {
        Sheet.getRange(j, 5).setValue(name);
        break;
      }
    }
    
    //成功寫入借閱資料，回傳書名
    return ContentService.createTextOutput(JSON.stringify(book_name));
  }
  else
      //回傳false
    return ContentService.createTextOutput(JSON.stringify(false));
  } 

  else if(kind == 4)  //新增書籍資料
  {
  if (book_name!= '' && isbn != '')
  {
    var LastRow1 = LastRow+1;
    var data = Array(isbn, book_name, book_author, book_maker, '在庫', "=COUNTIF('借閱紀錄'!A:A,A"+LastRow1+")");
    data.forEach(function(e,i){
        Sheet.getRange(LastRow+1, i+1).setValue(e);});
    return ContentService.createTextOutput(true);
  }
  }

  else if(kind == 5)  //查詢資料庫中是否已經有這本書
  {
  //查詢書庫中是否已有此書
    for (var i=LastRow;i>=2;i--)
    {
        if (Sheet.getSheetValues(i, 1, 1, 1)==isbn)
        {
          book_name = Sheet.getSheetValues(i, 2, 1, 1);
          return ContentService.createTextOutput(JSON.stringify('0書庫中已有本書「' + isbn + '--' + book_name + '」'));
        }
    }
    return ContentService.createTextOutput(JSON.stringify('1'));
  }else
// 沒給正確參數，回傳訊息
  return ContentService.createTextOutput('請勿亂試！');
}