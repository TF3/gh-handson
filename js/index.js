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
		},

		'.confirm click': function(context, $el) {
		},

	};

	h5.core.expose(reportController);
})(jQuery);
$(function() {
	h5.core.controller(document.body, handson.ReportController);
});
