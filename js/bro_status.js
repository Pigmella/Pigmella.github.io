$(function(){
	var sql = "select+D%2Ccount%28A%29%2CC+group+by+D%2CC+order+by+count%28A%29+desc"; // SQL 語法
	
	var gid = 0;
	var callback = "callback"; // 回呼函數名稱
	
	$.getScript("https://spreadsheets.google.com/tq?tqx=responseHandler:" + callback + "&tq=" + sql + "&key=" + sheetID + "&gid=" + gid);
	
	window[callback] = function(json) {
		var rowArray = json.table.rows,
		rowLength = rowArray.length,
		html = '<table class="table table-sm table-striped table-hover"><thead class="thead-dark"><tr><th scope="col" style="text-align: center;">借閱者姓名</th><th scope="col" style="text-align: center;">借閱數</th></tr></thead><tbody>',
		i, j, dataGroup, dataLength;
		for (i = 0; i < rowLength; i++) {
			dataGroup = rowArray[i].c;
			dataLength = dataGroup.length;
			var sql1 = "select+D%2CB%2CA%2CE%2CF+where+C%3D%27" + dataGroup[2].v + "%27+order+by+E+desc";
			html += '<tr>';
			html += '<td style="text-align: center;"><a href="https://spreadsheets.google.com/tq?tqx=out:html&tq=' + sql1 + '&key=' + sheetID + '&gid=0" target="_blank">' + dataGroup[0].v + '</a></td>';
			html += '<td style="text-align: center;">' + dataGroup[1].v + '<div id="bro_book' + i + '"></div></td>';
			html += "</tr>";
		}
		html += '</tbody></table>';
		$("#book_name").html(html);
	};
});
