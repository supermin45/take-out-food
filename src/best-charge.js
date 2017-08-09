const loadAllItems = require('./items.js');
const loadPromotions = require('./promotions.js');

module.exports = function bestCharge(inputs) {
        	let allItems = [];
        	let promotions = [];
        	allItems = loadAllItems();   	
        	promotions = loadPromotions();
        	
        	let foodInfo = [];
        	foodInfo = get_food_info(inputs, allItems);
        	
        	foodInfo = get_subtotal(foodInfo);     	
        	
        	let total = 0;
        	total = get_total(foodInfo);
       
        	foodInfo = get_half_price(foodInfo, promotions);
        	
        	let reduce = 0;
        	reduce = get_save_money(foodInfo,total);
       
        	let type = ' ';
        	type = get_promotion_information(promotions, reduce, foodInfo);
        	
        	let charge = 0;
        	charge = get_final_charge(total, reduce);

        	let result = '';
        	result = print_result_information(foodInfo, charge, reduce, type);

        	return result;
        };
       
        function get_food_info(inputs, allItems) {
        	let foodInfo = [];
            let arr = [];

        	for (let i = 0; i < inputs.length; i++) {
        		foodInfo[i] = {id: ' ', name: ' ', price: 0, count: 0, save: 0, subtotal: 0};
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
       
        function get_subtotal(foodInfo) {
        	for (let i = 0; i < foodInfo.length; i++) {
        		let sub = foodInfo[i].price * foodInfo[i].count;
        		foodInfo[i].subtotal = sub;
        	}

        	return foodInfo;
        }
        
        function get_total(foodInfo) {
        	let total = 0;

        	for (let i = 0; i < foodInfo.length; i++) {
        		let a = foodInfo[i].price * foodInfo[i].count;
        		total += a;
        	}

        	return total;
        }
        
        function get_half_price(foodInfo, promotions) {
        	let pro = [];
        	pro = promotions[1].items;
        	for (let i = 0; i < foodInfo.length; i++) {
        		for (let j = 0; j < pro.length; j++) {
        			if (foodInfo[i].id == pro[j]) {
        				let p = foodInfo[i].price / 2;
        				foodInfo[i].save = p;
        			}
        		} 
        	}

        	return foodInfo;
        }
        
        function get_save_money(foodInfo,total) {
        	let reduce = 0;
        	let reduce_1 = 0;
        	let reduce_2 = 0;
        	if (total >= 30) {
        		reduce_1 = 6;
        	}

            for (let item of foodInfo) {
            	reduce_2 += item.save;
            }

            reduce = Math.max(reduce_1, reduce_2);
            return reduce;
        }
        
        function get_promotion_information(promotions, reduce, foodInfo) {
        	let type  = ' ';
            
        	if (reduce === 6) {
        	    type = promotions[0].type;
        	} else if(reduce > 6) {
        		type = promotions[1].type;
                
                let arr = [];
        		for (let item of foodInfo) {
            	    if (item.save > 0) {
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
        
        function get_final_charge(total, reduce) {
        	let charge = 0;
        	charge = total - reduce;

        	return charge;
        }
        
        function print_result_information(foodInfo, charge, reduce, type) {
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

