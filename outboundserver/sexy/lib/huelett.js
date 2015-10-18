

function RGBtoHSV (r, g, b, coneModel) {
	  var h, // 0..360
	      s, v, // 0..255
	      max = Math.max(Math.max(r, g), b),
	      min = Math.min(Math.min(r, g), b);

	  // hue の計算
	  if (max == min) {
	    h = 0; // 本来は定義されないが、仮に0を代入
	  } else if (max == r) {
	    h = 60 * (g - b) / (max - min) + 0;
	  } else if (max == g) {
	    h = (60 * (b - r) / (max - min)) + 120;
	  } else {
	    h = (60 * (r - g) / (max - min)) + 240;
	  }

	  while (h < 0) {
	    h += 360;
	  }
	  h = h*(65535/255)

	  // saturation の計算
	  if (coneModel) {
	    // 円錐モデルの場合
	    s = max - min;
	  } else {
	    s = (max == 0)
	      ? 0 // 本来は定義されないが、仮に0を代入
	      : (max - min) / max * 255;
	  }

	  // value の計算
	  v = max;

	  return {'h': h, 's': s, 'b': v};
}

var huelett = function(username,appname){
	
	this.bridge = [];
	this.username = username;
	this.devicetype = appname;
	this.bulbs = [];

	var $this = this;
	$.ajax({
	url: "https://www.meethue.com/api/nupnp"}).done(function(json) {
		$.each(json,function(){
			$this.addBridge(this.id,this.internalipaddress);
		});
	});

	
}

huelett.prototype.addBridge = function(bridgeid,ipaddr){
	var bridge = {
			id:bridgeid,
			ip:ipaddr,
			paired:true
		}

	for(var i=0,il=this.bridge.length;i<il;i++){
		if(this.bridge[i].id == bridgeid){
			this.bridge[i] = bridge;
			return false;
		}
	}
	this.bridge.push(bridge);
}


huelett.prototype.findBridge = function(target){
	var targetBridge = false;
	
	if(typeof target == "number"){
		targetBridge = this.bridge[target];
	}else{
		for(var i=0,il=this.bridge.length;i<il;i++){
			if(this.bridge[i].id == target){
				targetBridge = this.bridge[i];		
				break;
			}
		}
	}

	if(!targetBridge) return false;
	return targetBridge;
}

huelett.prototype.pairBridge = function(target){
	
	var targetBridge = this.findBridge(target);
	
	if(!targetBridge) return false;

	var $this = this;
	$.ajax({
		type:"post",
		data:JSON.stringify({"devicetype": $this.devicetype, "username": $this.username}),
		url: "http://"+targetBridge.ip+"/api"})
	.done(function(json) {
		console.log(json);
	});
}

huelett.prototype.getBulbLists = function(){
	var username = this.username;
	$.each(this.bridge,function(i){
		if(!!this.paired){
			$this = this;
			$.ajax({
				type:"get",
				url: "http://"+this.ip+"/api/"+username+"/lights"})
			.done(function(json) {
				// console.log(json);
				$this.bulbs = json;
				console.log(json)
			});
		}
	})
}

huelett.prototype.getBulbGroupLists = function(){
	var username = this.username;
	$.each(this.bridge,function(i){
		if(!!this.paired){
			$this = this;
			$.ajax({
				type:"get",
				url: "http://"+this.ip+"/api/"+username+"/groups"})
			.done(function(json) {
				// console.log(json);
				$this.groups = json;
				console.log(json)
			});
		}
	})
}

huelett.prototype.setBulbStatus = function(bridge,bulbId,message){
	if(!message) return false;
	var targetBridge = this.findBridge(bridge);
	console.log(targetBridge);
	$.ajax({
		type:"put",
		data:JSON.stringify(message),
		url: "http://"+targetBridge.ip+"/api/"+this.username+"/lights/"+bulbId+"/state"})
	.done(function(json) {
		console.log(json);
	});
}

huelett.prototype.setBulbGroupStatus = function(bridge,groupId,message){
	if(!message) return false;
	var targetBridge = this.findBridge(bridge);
	console.log(targetBridge);
	$.ajax({
		type:"put",
		data:JSON.stringify(message),
		url: "http://"+targetBridge.ip+"/api/"+this.username+"/groups/"+groupId+"/action"})
	.done(function(json) {
		console.log(json);
	});
}



var $h = huelett;