$(function() {
  var sql = 'select+A%2CB%2CF%2CE+order+by+F+desc'; // SQL 語法
  var gid = 000000000; //請填入「書籍資料庫」的工作表ID
  var callback = 'callback'; // 回呼函數名稱

  $.getScript(
    'https://spreadsheets.google.com/tq?tqx=responseHandler:' +
      callback +
      '&tq=' +
      sql +
      '&key=' +
      sheetID +
      '&gid=' +
      gid,
  );

  window[callback] = function(json) {
    var rowArray = json.table.rows,
      rowLength = rowArray.length,
      html =
        '<table class="table table-sm table-striped table-hover"><thead class="thead-dark"><tr><th scope="col" style="text-align: center;">ISBN</th><th scope="col" style="text-align: center;">書名</th><th scope="col" style="text-align: center;">借出次數</th><th scope="col" style="text-align: center;">所在地</th></tr></thead><tbody>',
      i,
      j,
      dataGroup,
      dataLength;
    for (i = 0; i < rowLength; i++) {
      dataGroup = rowArray[i].c;
      dataLength = dataGroup.length;
      html += '<tr>';
      html +=
        '<td style="vertical-align: top; text-align: center;">' +
        dataGroup[0].v +
        '</td>';
      html += '<td style="vertical-align: top;">' + dataGroup[1].v + '</td>';
      html +=
        '<td style="vertical-align: top; text-align: center;">' +
        dataGroup[2].v +
        '</td>';
      html +=
        '<td style="vertical-align: top; text-align: center;">' +
        dataGroup[3].v +
        '</td>';
      html += '</tr>';
    }
    html += '</tbody></table>';
    $('#book_name').html(html);
  };
});
