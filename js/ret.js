$(function(){
	//輸入ISBN
	$('#isbn').change(function(){
		
		$("#alert_book_name").html('');
		$("#spinners_isbn").html('<div class="spinner-grow" role="status"></div>');
		var isbn = $('#isbn').val();
		if (isbn!='')
		{
			var currentdate = new Date();
			var filltime = currentdate.getFullYear() + "/"
				+ (currentdate.getMonth() + 1) + "/"
				+ currentdate.getDate() + "  "
				+ currentdate.getHours() + ":"
				+ currentdate.getMinutes() + ":"
				+ currentdate.getSeconds();
			var data = {
				'isbn': isbn,
				'ret_date': filltime,
				'sheetTag':'借閱紀錄',
				'sheetTag2':'書籍資料庫',
				'kind':1
			}
			$.ajax({
				type: "post",
				url: Google_API,
				data: data,
				dataType: "JSON",
				success: function (response) 
				{
					if (response == false) {
						
						$("#spinners_isbn").html('');
						$("#alert_book_name").html('<div class="alert alert-danger" role="alert">書庫中查無此書</div>');
						$('#isbn').val('');
						$('#isbn').focus();

					} else {
						
						$("#spinners_isbn").html('');
						$("#book_name").html(response);
						$('#retModal').modal();
						$('#isbn').val('');
						$('#isbn').focus();
					}
					
				}
			});
		}
	});
})