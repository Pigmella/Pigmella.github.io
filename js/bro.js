$(function(){
	
	//輸入人員代碼
	$('#stud_id').change(function()
	{
		$("#alert_stud_id").html('');
		$("#spinners_stud_id").html('<div class="spinner-grow" role="status"></div>');
		var stud_id = $('#stud_id').val();
		if (stud_id!='')
		{
			var data = {
				'member_id': stud_id,
				'sheetTag':'人員資料庫',
				'kind':2
			}
			
			$.ajax({
				type: "post",
				url: Google_API,
				data: data,
				dataType: "JSON",
				success: function (response) 
				{
					if (response==false){
						
						$("#spinners_stud_id").html('');
						$("#alert_stud_id").html('<div class="alert alert-danger" role="alert">沒有'+ stud_id +'這號人物喔！</div>');
						$('#stud_id').val('');
						$('#stud_id').focus();
					}
					else
					{
						$("#spinners_stud_id").html('');
						//自動帶出姓名欄位並填入對應的姓名
						$("#member").html(
							'<label for="Name" class="col-sm-4 col-form-label" style="text-align: end;">人員姓名：</label><div class= "col-sm-8" style="margin-left: -20px;"><input class="form-control" id="Name" name="name" value="'+response+'" readonly="readonly"></div>'
						);
						//自動跳出ISBN碼的輸入欄位
						$("#ISBNCode").html(
							'<label for="ISBNCode" class="col-sm-4 col-form-label" style="text-align: end;">書籍ISBN碼：</label><div class= "col-sm-8" style="margin-left: -20px;"><input maxlength="13" class="form-control" name="isbn" id="isbn" onchange="ShowStr(this.id)" placeholder="請輸入ISBN："><small class="form-text text-muted">下一位借書請輸入：33</small ></div>'
						);
						
						document.getElementById('isbn').focus();
					}
				}
			});
		}
	});
})

//輸入ISBN
function ShowStr(x)
{
	$("#spinners_isbn").html('<div class="spinner-grow" role="status"></div>');
	var isbn = $('#isbn').val();
	if (isbn=='33')
	{
		$("#spinners_isbn").html('');
		$("#member").html('');
		$("#book_name").html('');
		$("#miss_book").html('');
		$("#stud_id").val('');
		$("#stud_id").focus();
		$("#ISBNCode").val('');
	}
	var member_id = $('#stud_id').val();
	var name = $('#Name').val();
	var isbn = $('#isbn').val();
	var currentdate = new Date();
	var filltime = currentdate.getFullYear() + "/"
		+ (currentdate.getMonth() + 1) + "/"
		+ currentdate.getDate() + "  "
		+ currentdate.getHours() + ":"
		+ currentdate.getMinutes() + ":"
		+ currentdate.getSeconds();
	if (member_id!='' && name!='' && isbn!='')
	{
		var data = {
			'member_id': member_id,
			'isbn': isbn,
			'name': name,
			'bro_date': filltime,
			'sheetTag':'書籍資料庫',
			'kind':3
		}
		$.ajax({
			type: "post",
			url: Google_API,
			data: data,
			dataType: "JSON",
			success: function (response) {
				if (response==false)
					alert('書庫內沒有' + $("#isbn").val() + '這本書喔！');
				else
				{
					$("#spinners_isbn").html('');
					$("#book_name").html(response);
					$('#myModal').modal();
				}
				document.getElementById('isbn').value='';
				document.getElementById('isbn').focus();
			}
		});
	}
}
