$(function(){
	$("#mybutton").click(function(e){
		if ($("#book_name").val()=='')
		{
			alert('請輸入書名');
			$("#book_name").focus();
			return false;
		}
		else if($("#book_isbn").val()=='')
		{
			alert('請輸入ISBN');
			$("#book_isbn").focus();
			return false;
		}
		else
		{
		// 打包 要的資料
			var data = {
				'isbn' : $("#book_isbn").val(),
				'book_name':$("#book_name").val(),
				'book_author': $("#book_author").val(),
				'book_maker': $("#book_maker").val(),
				'sheetTag':'書籍資料庫',
				'kind':4
			}
		// 呼叫 send ajax function
			send(data);
			$("#book_isbn").val('');
			$("#book_author").val('');
			$("#book_maker").val('');
			$("#test").html($("#book_name").val()+'--新增成功！');
			$("#book_name").val('');
			$('#isbn').val('');
			document.getElementById('isbn').focus();
		}
	});
	
  //輸入ISBN
	$('#isbn').change(function(){
		
		$("#alert_isbn").html('');
		$("#spinners_isbn").html('<div class="spinner-grow" role="status"></div>');
		var isbn = $('#isbn').val();
  	//alert(stud_id);

		if (isbn!='')
		{
  		//先判斷資料庫中是否已有此書
		// 打包 要的資料
		var data = {
			'isbn' : isbn,
			'sheetTag':'書籍資料庫',
			'kind':5
		}
		$.ajax({
			type: "post",
			url: Google_API,
			data: data,
			// 資料格式是JSON 
			dataType: "JSON",
			success: function (response) {
			if (response.substr(0, 1)=='0')
			{
				$("#spinners_isbn").html('');
				$("#alert_isbn").html('<div class="alert alert-danger" role="alert">'+response.substr(1)+'</div>');
				// alert(response.substr(1));
				$('#isbn').val('');
				$('#isbn').focus();
			}
			else {
				var book_str = "http://192.83.186.170/search*cht/i"+isbn+"/i"+isbn+"/-6,0,0,B/marc&FF=i"+isbn+"&1,1,";
				$.get('https://cors-anywhere.herokuapp.com/'+book_str, function(data) 
				{
					var line_arr = data.split("\n");
					for (var i=0; i<line_arr.length; i++)
					{
					if (line_arr[i].match(/^245/) || line_arr[i].match(/^200/))
					{
						var data_arr = line_arr[i].split("|");
						var book_name = data_arr[0].substr(7,data_arr[0].length-7);
						$("#book_name").val(book_name);
						if (line_arr[i].match(/^200/))
						{
							for (var j=1; j<data_arr.length; j++)
							{
							if (data_arr[j].match(/^f/))
							{
								var book_author = data_arr[j].substr(1,data_arr[j].length-1);
								$("#book_author").val(book_author);
							}
								
							}
						}
						else if (line_arr[i].match(/^245/))
						{
							for (var j=1; j<data_arr.length; j++)
							{
							if (data_arr[j].match(/^b/))
								$("#book_name").val($("#book_name").val()+data_arr[j].substr(1,data_arr[j].length-1));
							else if (data_arr[j].match(/^c/))
								$("#book_author").val(data_arr[j].substr(1,data_arr[j].length-1));
							}
						}
					}
					else if(line_arr[i].match(/^260/))
					{
						var data_arr = line_arr[i].split("|");
						for (var j=1; j<data_arr.length; j++)
						{
						if (data_arr[j].match(/^b/))
						{
							var book_maker = data_arr[j].substr(1,data_arr[j].length-1);
							$("#book_maker").val(book_maker);
						}
						}
					}
					else if(line_arr[i].match(/^210/))
					{
						var data_arr = line_arr[i].split("|");
						for (var j=1; j<data_arr.length; j++)
						{
						if (data_arr[j].match(/^c/))
						{
							var book_maker = data_arr[j].substr(1,data_arr[j].length-1);
							if ($("#book_maker").val()=='')
							$("#book_maker").val(book_maker);
							else
							$("#book_maker").val($("#book_maker").val()+','+book_maker);
						}
						}
					}
					}
					$("#book_isbn").val(isbn);
					var start = 0;
					var book_data = '';
					var books_title = '機讀資料';
					for (var i=0; i<line_arr.length; i++)
					{
						if (start == 1)
							book_data += line_arr[i]+'<br>';
						if (line_arr[i].match(/^LEADER/))
							start = 1;
					}
					$("#spinners_isbn").html('');
					$("#books_title").html(books_title);
					$("#test").html(book_data);
				});
			}	
			}
		});
		
	}
	});
});
function send(data){
	$.ajax({
    type: "post",
    url: Google_API,
    data: data,
    dataType: "JSON",
    success: function (response) {
	return response;
    }
	});
}
