const loadAllItems = require('./items.js');
const loadPromotions = require('./promotions.js');

module.exports = function bestCharge(inputs) {
        	let allItems = [];
        	let promotions = [];
        	allItems = loadAllItems();
        	promotions = loadPromotions();
        	let foodInfo = getFoodinfo(inputs, allItems);
        	foodInfo = getSubtotal(foodInfo);
        	let total = getTotal(foodInfo);
        	foodInfo = getHalfPrice(foodInfo, promotions);
        	let reduce = getSaveMoney(foodInfo,total);
        	let type = getPromotionInformation(promotions, reduce, foodInfo);
        	let charge = getFinalCharge(total, reduce);
        	let result = printResultInformation(foodInfo, charge, reduce, type);

        	return result;
        };
       
        function getFoodinfo(inputs, allItems) {
        	let foodInfo = [];
            let arr = [];

        	for (let i = 0; i < inputs.length; i++) {
        		foodInfo[i] = {id: ' ', name: ' ', price: 0, count: 0, half: 0, subtotal: 0};
        		arr = inputs[i].split(' x ');
                foodInfo[i].id = arr[0];
                foodInfo[i].count = arr[1];
        	}

        	for (let item of foodInfo) {
        		for (let item_1 of allItems) {
        			if (item.id === item_1.id) {
        				item.name = item_1.name;
        				item.price = item_1.price;
        			}
        		}
        	}

        	return foodInfo;
        }

        function getSubtotal(foodInfo) {
        	for (let i = 0; i < foodInfo.length; i++) {
        		foodInfo[i].subtotal = foodInfo[i].price * foodInfo[i].count;
        	}

        	return foodInfo;
        }

        function getTotal(foodInfo) {
        	let total = 0;

        	for (let i = 0; i < foodInfo.length; i++) {
        		total += foodInfo[i].price * foodInfo[i].count;
        	}

        	return total;
        }

        function getHalfPrice(foodInfo, promotions) {
        	let pro = promotions[1].items;

        	for (let i = 0; i < foodInfo.length; i++) {
        		for (let j = 0; j < pro.length; j++) {
        			if (foodInfo[i].id === pro[j]) {
        				foodInfo[i].half = foodInfo[i].price / 2;
        			}
        		} 
        	}

        	return foodInfo;
        }

        function getSaveMoney(foodInfo,total) {
        	let reduce = 0;
        	let reduceOne = 0;
        	let reduceTwo = 0;
        	if (total >= 30) {
        		reduceOne = 6;
        	}

            for (let item of foodInfo) {
            	reduceTwo += item.half;
            }

            reduce = Math.max(reduceOne, reduceTwo);
            return reduce;
        }

        function getPromotionInformation(promotions, reduce, foodInfo) {
        	let type  = ' ';
            
        	if (reduce === 6) {
        	    type = promotions[0].type;
        	} else if(reduce > 6) {
        		type = promotions[1].type;
                
                let arr = [];
        		for (let item of foodInfo) {
            	    if (item.half > 0) {
            		    arr.push(item.name);
            	    }
                }

                let str = arr[0];
                let seperator = '，';
                for(let i = 1; i< arr.length; i++){
                    str += seperator+arr[i];
                }

                type += '(' + str +')';
                
        	} else {
        		type = '';
        	}          

        	return type;
        }
   
        function getFinalCharge(total, reduce) {
        	let charge = total - reduce;

        	return charge;
        }
 
        function printResultInformation(foodInfo, charge, reduce, type) {
        	let result = '============= 订餐明细 =============\n';

        	for (let item of foodInfo) {
        		result += item.name + ' ' + 'x' + ' ' + item.count + ' ' + '=' + ' ' + item.subtotal + '元\n';
        	}
        	result += '-----------------------------------\n';
        	if (reduce > 0) {
        		result += '使用优惠:\n' + 
        		type + '，' + '省' + reduce + '元\n' +
        		'-----------------------------------\n' +
        		'总计：' + charge + '元\n' +
        		'===================================';
        	}else {
        		result += 
        		'总计：' + charge + '元\n' +
        		'===================================';
        	}

        	return result;
        }

