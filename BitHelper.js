const BitHelper = {
	BOOLEANS : new Array(256),
	POWERS : new Array(53),
	toSignedByte: function(unsigned){
		if(unsigned > 127){
			return unsigned - 256;
		}
		return unsigned;
	},
	toUnsignedByte : function(signed){
		if(signed < 0){
			return signed + 256;
		}
		return signed;
	},
	javaByteCast : function(number){
		number = roundTo0(number) % 256;
		if(number > 127){
			return number - 256;
		}
		if(number < -128){
			return number + 256;
		}
		return number;
	},
	javaCharCast : function(number){
		number = roundTo0(number) % 65536;
		if (number < 0){
			number += 65536;
		}
		return number;
	},
	javaIntCast : function(number){
		number = roundTo0(number) % 4294967296;
		if (number > 2147483647){
			number -= 4294967296;
		}
		if (number < -2147483648){
			number += 4294967296;
		}
		return number;
	},
	byteToBooleans : function(signed){
		return BitHelper.BOOLEANS[BitHelper.toUnsignedByte(signed)].slice(0, 8);
	},
	booleansToByte : function(b1, b2, b3, b4, b5, b6, b7, b8){
		if(Array.isArray(b1)){
			return BitHelper.booleansToByte(b1[0], b1[1], b1[2], b1[3], b1[4], b1[5], b1[6], b1[7]);
		}
		let signed = 64 * b1 + 32 * b2 + 16 * b3 + 8 * b4 + 4 * b5 + 2 * b6 + 1 * b7;
		if(!b8){
			signed = -signed;
			signed--;
		}
		return signed;
	},
	char0 : function(char){
		return BitHelper.javaByteCast(char);
	},
	char1 : function(char){
		return BitHelper.javaByteCast(char >> 8);
	},
	short0 : function(short){
		return BitHelper.javaByteCast(short);
	},
	short1 : function(short){
		return BitHelper.javaByteCast(short >> 8);
	},
	int0 : function(int){
		return BitHelper.javaByteCast(int);
	},
	int1 : function(int){
		return BitHelper.javaByteCast(int >> 8);
	},
	int2 : function(int){
		return BitHelper.javaByteCast(int >> 16);
	},
	int3 : function(int){
		return BitHelper.javaByteCast(int >> 24);
	},
	makeChar : function(char0, char1){
		return BitHelper.javaCharCast((char1 << 8) | (char0 & 0xff));
	},
	makeShort : function(short0, short1){
		return (short1 << 8) | (short0 & 0xff);
	},
	makeInt : function(int0, int1, int2, int3){
		return ((int3 << 24) | ((int2 & 0xff) << 16) | ((int1 & 0xff) <<  8) | (int0 & 0xff));
	},
	getRequiredBits : function(number){
		if(number < 0){
			number = -number - 1;
		}
		let l = 1;
		let b = 0;
		while(l <= number){
			l *= 2;
			b++;
		}
		return b;
	},
	checkBitCount : function(bitCount){
		if(bitCount < 0){
			throw "bitCount (" + bitCount + ") can't be negative!";
		}
		if(bitCount > 53){
			throw "bitCount (" + bitCount + ") can't be greater than 2^53 (" + Math.pow(2, 53) + ")";
		}
	},
	checkOverflow : function(number, bitCount){
		if(bitCount != 53 && (BitHelper.POWERS[bitCount] <= number || BitHelper.POWERS[bitCount] < -number)){
			throw 'You need more than ' + bitCount + ' bits to store the number ' + number;
		}
	},
	numberToBooleans : function(number, bitCount, allowNegative){
		BitHelper.checkBitCount(bitCount);
		BitHelper.checkOverflow(number, bitCount);
		const neg = allowNegative ? 1 : 0;
		const bools = new Array(bitCount + neg);
		if(allowNegative){
			if(number >= 0){
				bools[0] = true;
			}
			else {
				bools[0] = false;
				number = -number;
				number--;
			}
		}
		for(let bit = 0; bit < bitCount; bit++){
			if(number >= BitHelper.POWERS[bitCount - bit - 1]){
				number -= BitHelper.POWERS[bitCount - bit - 1];
				bools[bit + neg] = true;
			}
			else {
				bools[bit + neg] = false;
			}
		}
		return bools;
	},
	numberFromBooleans : function(bools, bitCount, allowNegative){
		BitHelper.checkBitCount(bitCount);
		let number = 0;
		const neg = allowNegative ? 1 : 0;
		for(let index = 0; index < bitCount; index++){
			if(bools[index + neg]){
				number += BitHelper.POWERS[bitCount - index - 1];
			}
		}
		if(allowNegative && !bools[0]){
			number = -number;
			number--;
		}
		return number;
	},
	stringFromUint16Array : function(array){
		const length = array.length;
   	 	let result = '';
    	let addition = Math.pow(2,16)-1;

    	for (let i = 0; i < length; i += addition){

        	if (i + addition > length) {
            	addition = length - i;
        	}
        	result += String.fromCharCode.apply(null, array.subarray(i,i+addition));
    	}

    	return result;
	},
	uint16ArrayFromString : function(string){
		const length = string.length;
		const result = new Uint16Array(length);

		for (let i = 0; i < length; i++){
			result[i] = string.charCodeAt(i);
		}

		return result;
	}
};

for(let unsigned = 0; unsigned < 256; unsigned++){
	let signed = BitHelper.toSignedByte(unsigned);
	BitHelper.BOOLEANS[unsigned] = [false, false, false, false, false, false, false, false];
	if(signed >= 0){
		BitHelper.BOOLEANS[unsigned][7] = true;
	}
	else {
		signed = -signed;
		signed--;
	}
	if(signed >= 64){
		BitHelper.BOOLEANS[unsigned][0] = true;
		signed -= 64;
	}
	if(signed >= 32){
		BitHelper.BOOLEANS[unsigned][1] = true;
		signed -= 32;
	}
	if(signed >= 16){
		BitHelper.BOOLEANS[unsigned][2] = true;
		signed -= 16;
	}
	if(signed >= 8){
		BitHelper.BOOLEANS[unsigned][3] = true;
		signed -= 8;
	}
	if(signed >= 4){
		BitHelper.BOOLEANS[unsigned][4] = true;
		signed -= 4;
	}
	if(signed >= 2){
		BitHelper.BOOLEANS[unsigned][5] = true;
		signed -= 2;
	}
	if(signed >= 1){
		BitHelper.BOOLEANS[unsigned][6] = true;
	}
}

//initialize powers

(function(){
	let power = 1;
	for(let index = 0; index < BitHelper.POWERS.length; index++){
		BitHelper.POWERS[index] = power;
		power *= 2;
	}
}());