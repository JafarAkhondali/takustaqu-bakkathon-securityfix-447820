
//forIn追加 -> http://qiita.com/phi/items/98975e1bb4995c1f1bcf
Object.defineProperty(Object.prototype, "forIn", {
    value: function(fn, self) {
        self = self || this;

        Object.keys(this).forEach(function(key, index) {
            var value = this[key];

            fn.call(self, key, value, index);
        }, this);
    }
});


function bpmToMs(bpm){
	return (1000*60)/bpm
}

function drag( $event ,$this) {
	var className = "p"+Math.floor(Math.random()*10000);
	$($this).addClass(className);
    $event.dataTransfer.setData( "classname", className);
}

function drop( $event, $this ) {
    $event.preventDefault();
    var $data = $event.dataTransfer.getData( "classname" );
    
    $($this).append( $("."+$data).removeClass($data) );
}

function allowDrop( $event ) {
    $event.preventDefault();
}


function addObject(type,payload){
	var obj = {type:type,data:payload};
	var result = '<div draggable="true" ondragstart="drag( event,this );">'+JSON.stringify(obj)+'</div>';
	return result;
}



function flash(strong,$el){

	var $tgt = $el ? $el : $("#beat");
	if(strong){
		$tgt.css({"background-color":"rgba(255,0,0,1)"})
	}else{
		$tgt.css({"background-color":"rgba(0,0,0,0.5)"})
	}

	setTimeout(function(){
		$tgt.css({"background-color":""})
	},bpmToMs((86.5)))
}

function exportToJSON(){
	var result = {};
	$("tbody > tr > td:nth-child(2)").each(function(i){
	    var payload = [];
	    $(this).children("div").each(function(){
	    	payload.push(JSON.parse($(this).text()));
	    })

	    if(!!payload.length) result[i] = payload;
	})
	return JSON.stringify(result);
}

function restoreFromJSON(json){
	var data = JSON.parse(json);
	var $tbd = $("tbody > tr");

	$tbd.find("div").remove();
	
	data.forIn(function(key, value, index) {
		var $this = $tbd.eq(key).children("td").eq(1);
		for(var i=0,il=value.length;i<il;i++){
			$this.append(addObject(value[i].type,value[i].data))
		}
	});

}


(function(){

	var $audio = $("#audio");
	var $currentTime = $("#current-time")
	var $currentLyric = $("#current-lyric")
	var $nextLyric = $("#next-lyric")
	var $beatCount = $("#beat-count")
	var $segmentCount = $("#segment-count")
	var $addLyric = $("#addLyric")
	var $addLight = $("#addLight")
	var $timeline = $("#timeline")
	var ms = 0;

	var beat = bpmToMs((110));
	gap = 30;
	var nextBeat = 50;
	var lyricIdx = 0;
	var currentLyric = "";

	var beatCount = 0;
	var segmentCount = 0;

	a = $audio.get(0);

	var beats = 0;


	$audio.on({"canplaythrough":function(){

		if(!$timeline.children("tr").length){
			var beats = Math.floor(a.duration*1000 / beat);
			for(var i=0;i<beats;i++){
				$timeline.append('<tr><td>'+i+'</td><td ondrop="drop( event, this );" ondragover="allowDrop( event );"></td></tr>');
			}	

		}

	}})



	$addLyric.on({"mousedown":function(){

	},"click":function(){return false;}});

	$addLight.on({"click":function(){
		
		var payload = {"coloralias":$("#charactor-color").val(),"target":$("#light-unit").val()}
		
		$("#palett").append(addObject("huebulb",payload));

		return false;
	}});


	function parseCommands(command){

		if(!command.length) return false;
		$.each(command,function(){
			if(this.type == "huebulb"){
				applyToHue("bulb",this.data.target,this.data.coloralias);
			}else if(this.type == "rollup"){
				$.get("http://168.63.141.143:8000/api", function(data){
					setTimeout(function(){
						hue.setBulbStatus(0,3,{"on":false});hue.setBulbStatus(0,2,{"on":false});hue.setBulbStatus(0,1,{"on":false})
					},2000)
				});
			}
		});

	}

	function applyToHue(type,id,coloralias,duration){

		var dur = duration ? duration : Math.floor(beat / 200);

		var isGroup = type == "group";
		var isLed = !isGroup && (id == 5) ? true : false;
 
		var color = !isLed ? colorPreset[coloralias][0] : colorPreset[coloralias][1];

		hue.setBulbStatus(0,id,{
			"hue": color[0],
			"on": true,
			"sat":color[1],
			"bri": 255,
			"transitiontime":dur
		})
	}

	setInterval(function(){
		ms = Math.floor(a.currentTime*1000)+gap;
	},1);

	var prevBeat = false;

	setInterval(function(){

		
		beatCount = Math.floor(Math.floor(ms/beat))
		

		if(prevBeat != beatCount){

			if(beatCount%4 == 0){
				flash(true);
				flash(true,$($timeline.children("tr").eq(beatCount)))
				segmentCount = Math.floor(beatCount/4);
			}else{
				flash(false);
				flash(false,$($timeline.children("tr").eq(beatCount)))
			}

			var commands = [];

			$timeline.children("tr").eq(beatCount).find("div").each(function(){
				commands.push(JSON.parse($(this).text()));
			});

			parseCommands(commands)

			//直前実行したビートを追記
			prevBeat = beatCount;
		}

		

		$currentTime.text(ms);
		$beatCount.text(beatCount);
		$segmentCount.text(segmentCount);

	},1000/120)

})();
$(function(){
	setTimeout(function(){
		restoreFromJSON('{"0":[{"type":"huebulb","data":{"coloralias":"nozomi","target":"2"}},{"type":"huebulb","data":{"coloralias":"maki","target":"1"}},{"type":"huebulb","data":{"coloralias":"nico","target":"3"}}],"1":[{"type":"huebulb","data":{"coloralias":"nozomi","target":"3"}},{"type":"huebulb","data":{"coloralias":"eli","target":"2"}}],"2":[{"type":"huebulb","data":{"coloralias":"maki","target":"3"}},{"type":"huebulb","data":{"coloralias":"kotori","target":"2"}}],"3":[{"type":"huebulb","data":{"coloralias":"kotori","target":"3"}},{"type":"huebulb","data":{"coloralias":"uni","target":"2"}}],"4":[{"type":"huebulb","data":{"coloralias":"rin","target":"2"}},{"type":"huebulb","data":{"coloralias":"hanayo","target":"3"}}],"5":[{"type":"huebulb","data":{"coloralias":"maki","target":"1"}},{"type":"huebulb","data":{"coloralias":"maki","target":"2"}},{"type":"huebulb","data":{"coloralias":"maki","target":"3"}}],"7":[{"type":"huebulb","data":{"coloralias":"nozomi","target":"1"}},{"type":"huebulb","data":{"coloralias":"nozomi","target":"2"}},{"type":"huebulb","data":{"coloralias":"nozomi","target":"3"}}],"8":[{"type":"huebulb","data":{"coloralias":"rin","target":"3"}},{"type":"huebulb","data":{"coloralias":"hanayo","target":"2"}}],"9":[{"type":"huebulb","data":{"coloralias":"maki","target":"2"}},{"type":"huebulb","data":{"coloralias":"eli","target":"3"}}],"10":[{"type":"huebulb","data":{"coloralias":"nozomi","target":"2"}},{"type":"huebulb","data":{"coloralias":"kotori","target":"3"}}],"11":[{"type":"huebulb","data":{"coloralias":"uni","target":"3"}},{"type":"huebulb","data":{"coloralias":"hanayo","target":"2"}}],"13":[{"type":"huebulb","data":{"coloralias":"nico","target":"1"}},{"type":"huebulb","data":{"coloralias":"nico","target":"3"}},{"type":"huebulb","data":{"coloralias":"nico","target":"2"}},{"type":"rollup","data":true}]}');
	},500)
})