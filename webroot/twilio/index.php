<?php 
	$api_url = 'http://www.yahoo.co.jp'; 
?>
<?xml version="1.0" encoding="UTF-8"?>
<Response>
	<?php if(!isset($_GET['open'])): ?>
	<Say language="ja-JP" voice="alice">スカートをめくろう。</Say>
	<Pause length="1"/>
	<Play>http://demo.twilio.com/hellomonkey/monkey.mp3</Play>

	<?php else: ?>
	<?php
		//CURL叩く
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL,$api_url );
		curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'GET');
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($curl);
	?>
	<Play>http://demo.twilio.com/hellomonkey/monkey.mp3</Play>
	<Say language="ja-JP" voice="alice">ご不明点が御座いましたらご連絡ください。</Say>

	<?php endif;?>
	
	
</Response>

