(function($) {
	var reportController = {
		__name: 'handson.ReportController',

		__ready: function() {
			this.$find('input[name="reportDate"]').val(
				handson.utils.formatDateWithHyphen(new Date())
			);
			this.$find('input[name=startTime]').val('09:00');
			this.$find('input[name=endTime]').val(
				handson.utils.formatTime(new Date())
			)
		},

		'input, textarea focusout': function(context, $el) {
			// 変数の定義
			var value = $el.val(); // 入力された値
			var name  = $el.attr('name'); // 入力した場所の名前
			var error_class = 'has-error'; // エラー用クラス
			var $msg = this.$find('.report-content').find('.msg'); // メッセージを出す場所
			var $formGroup = $el.parents('.form-group'); // エラー用クラスを追加する場所

			// 除外条件の設定（画像選択部分は無視）
			if (name == "img") {
				return;
			}

			// 入力チェック
			if (value == null || value == '') {
				// 入力されていない場合の処理
				if ($formGroup.hasClass(error_class)) {
					// すでにエラー表示があるならば何もしない
					return;
				}
				// 空の入力項目に赤い枠を追加
				$formGroup.addClass(error_class);

				// 入力項目名(日本語）を取得
				var label = $formGroup.find('label').text();

				// メッセージの組み立て
				var $p = $('<p data-handson-input-name="' + name + '">');
				$p.append('<strong>' + label + 'を入力してください' + '</strong>');
				// エラーメッセージの挿入
				$msg.append($p);
			} else {
				// 入力されている場合の処理
				// エラーの枠を外す
				$formGroup.removeClass(error_class);

				// 入力した項目のメッセージを消す
				$msg.find('p[data-handson-input-name="' + name + '"]').remove();
			}

			// メッセージの表示、非表示の指定
			if ($msg.children().length != 0) {
				// エラーあり
				$msg.show();
			} else {
				// エラーなし
				$msg.hide();
			}
		},

		'input[name="img"] change': function(context, $el) {
			// 変数の定義
			var $imgPreview = this.$find('.img-preview'); // 画像表示のDOM部分

			// input要素からファイルを取得
			var file = $el[0].files[0];

			// FileReaderインスタンスの作成
			var reader = new FileReader();

			// ファイルが読み込まれた時の処理を記述
			reader.onload = function(e) {
				// 画像を表示（変数eの中にファイルの内容が入るので、imgタグのsrcに適用する）
				$imgPreview.find('img').attr('src', e.target.result);
				$imgPreview.show();
			}

			// ファイル読み込み開始
			reader.readAsDataURL(file);
		},

		'.confirm click': function(context, $el) {
			// 初期化（イベント無効化）
			context.event.preventDefault();

			// パラメータの設定（フォームに入力されている値をハッシュ化して、ビューで表示する変数とする）
			var params = {};
			var ary = this.$find('form').serializeArray();
			for (i in ary) {
				params[ary[i].name] = ary[i].value;
			}

			// 複数行対応分のエスケープ処理（報告内容欄は複数行入力できますので、表示時に改行を <br /> にする）
			// index.html内の<script>タグ内で改行を置き換えている
			// TODO: セミコロンがなくても動く(hifiveのメソッドだから？)
			params.comment = h5.u.str.escapeHtml(params.comment)

			// ビューの設定
			this.view.update('.modal-content', 'confirm', params);

			// モーダル表示
			this.$find('#confirmModal').modal();
		},

		'.register click': function(context, $el) {
			// Ajaxの擬似実行
			h5.ajax({
				type: 'post',
				data: this.$find('form').serialize(),
				url: '/register',
			}).then(this.own(function(){ // ownでthisを中に渡す
				alert('登録しました');
				this.$find('#confirmModal').modal('hide');
			}))
		}

	};

	h5.core.expose(reportController);
})(jQuery);
$(function() {
	h5.core.controller(document.body, handson.ReportController);
});
