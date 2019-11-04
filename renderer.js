const fs = require('fs')
fs.readFile('tiobe.txt', 'utf-8', (error, data) => {
	var re1 = /}/g;
	var re2 = /{/g;
	var re3 = /Date.UTC/g;
	var re4 = /name/g;
	data = data.replace(re1, "")
	data = data.replace(re2, "")
	data = data.trim();
	data = data.replace(re3, "\n")
	data = data.replace(re4, "\nname")
	patterns = data.split("\n")
	patterns.shift();

	function match_numbers(str){
		var reg1 = /(\d\d\d\d), *(\d+), *(\d+)\), *(\d+.\d+)/g;
		var nums = Array.from(str.matchAll(reg1));
		if(nums === undefined){
			return undefined;
		}else {
			return nums[0];
		}
	}

	function match_language_name(str){
		var reg2 = /name *: *\' *(.+) *\'/g;
	    var name = Array.from(str.matchAll(reg2))
	    if(name === undefined){
	        return undefined;
	    }else {
	    	return name[0]
	    }
	}
	
	function convert_date(nums){
		const datearr = [parseInt(nums[1]), parseInt(nums[2])+1, parseInt(nums[3])]
	    const [y, m, d] =datearr;    
	    const value = parseFloat(nums[4])
	    const date = `${y}-${m.toString().length === 2?m.toString():'0'+m.toString()}`;
	    return [date, value]; 
	}
	
	var my_data = {}
	var current_name = ""

	patterns.forEach((line) =>{
		let nums = match_numbers(line)
	    let name = match_language_name(line)

	    if(name !== undefined){
	    	current_name = name[1];
	        my_data[current_name] = {};
	    }
	         
	    if(nums !== undefined){
	    	let [date, value] = convert_date(nums)
	        my_data[current_name][date] = value
	    }	    	
	})

	var key_dates = Object.getOwnPropertyNames(my_data['Java'])
	var language  = Object.getOwnPropertyNames(my_data)
	var colors = ['IndianRed', 'SandyBrown', 'MediumVioletRed', 'Gold', 'LightSeaGreen',
	          'DeepSkyBlue', 'SlateBlue', 'LightPink', 'BurlyWood', 'MediumSeaGreen']
	key_dates.sort()
	console.log(my_data);
	console.log(language);
	console.log(key_dates);
	var count = [];
	var obj2arr = Object.entries(my_data);
	obj2arr.forEach((language) => {
		count.push(Object.values(language[1]))
	})
	var standardLength = count[0].length;
	console.log(count);
	count.forEach((arr, idx) => {
		if(arr.length !== standardLength){
			let dual = standardLength - arr.length;
			let dualArr = new Array(dual);
			dualArr.fill(0);
			arr = dualArr.concat(arr);
			count[idx] = arr;
		}
	})
	console.log(count);
	var bardata = math.transpose(count);
	var finalObj = [];
	var colorObj = [];
	console.log(colors);
	bardata.forEach(arr => {
		let obj = new Map();
		let obj2 = new Map();
		for(let i = 0; i < language.length; i++){
			obj.set(language[i], arr[i])
			obj2.set(colors[i], arr[i])
		}
		finalObj.push(obj)
		colorObj.push(obj2)
	})
	console.log(finalObj);
	console.log(colorObj);
	var mapSort = []; 
	var colorSort = [];
	finalObj.forEach(mmp => mapSort.push(new Map([...mmp.entries()].sort((a, b) => a[1] - b[1]))))
	colorObj.forEach(mmp => colorSort.push(new Map([...mmp.entries()].sort((a, b) => a[1] - b[1]))))
	console.log(mapSort);
	console.log(colorSort);
	var colorSortData = [];
	colorSort.forEach(mmp => colorSortData.push([...mmp.keys()]))
	console.log(colorSortData);
	
	var data = [{
		x:[...mapSort[0].values()],
		y:[...mapSort[0].keys()],
		type:'bar',
		// text:key_dates, 
		orientation:'h', 
		marker:{
			color:colors,
			}, 
		textposition:'outside' 
	}] 

	var buttons = [{
		type:'buttons',
		direction: 'right',
		pad:{t:0, l:0},
		buttons: [
			{
				label:"play",
				method:"animate",
				args:[
					null,
					{
						transition: {duration: 1800, easing:"linear-in-out"},
						frame: {duration: 600, redraw: true},
						fromcurrent: true,
						mode: 'immediate',
					}
				]
			}

		]
	}]
	var frames = [];
	for(let i = 0; i < mapSort.length; i++){
		frames.push({
			data:[{
			x:[...mapSort[i].values()],
			y:[...mapSort[i].keys()],
			type:'bar',
			text:key_dates[i],
			orientation:'h',
			marker:{
			color:colorSortData[i],
			}, 
			textposition:'outside' 
			}]
			
		})
	}
	var layout = {
		title: {
			text:'2001-06',
			font:{size:36}
		},
		width:1100,
		height:600,
		updatemenus:buttons,
		font: {family: 'monospace', size:15},
		xaxis: {
			showgrid:true,
			zeroline:false,
			automargin:true
		},
		yaxis: {
			showgrid:true,
			zeroline:false,
			automargin:true
		}
	}
	console.log(data);
	console.log(layout);
	console.log(frames);
	Plotly.newPlot('graph', {data:data, layout:layout, frames: frames,})


})