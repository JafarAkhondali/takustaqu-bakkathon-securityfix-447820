<?php 
	$api_url = 'http://www.yahoo.co.jp'; 
?>
<?xml version="1.0" encoding="UTF-8"?>
<Response>
	<?php if(!isset($_GET['open'])): ?>
	<Say language="ja-JP" voice="alice">スカートをめくろう。</Say>
	<Pause length="1"/>
	<Play>http://http://bakaapp.azurewebsites.net/webroot/twilio/ise_type2a.mp3</Play>
	<Redirect>http://http://bakaapp.azurewebsites.net/webroot/twilio?open</Redirect>
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
	<Play>http://http://bakaapp.azurewebsites.net/webroot/twilio/ise_type2b.mp3</Play>
	<Pause length="1"/>
	<Say language="ja-JP" voice="alice">ご不明点が御座いましたらご連絡ください。</Say>
	<?php endif;?>
</Response>

