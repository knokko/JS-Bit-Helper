BitHelper.BitOutput = function(){};

BitHelper.BitOutput.prototype.writeShort = function(short){
	this.writeBytes([BitHelper.short0(short), BitHelper.short1(short)]);
};

BitHelper.BitOutput.prototype.writeChar = function(char){
	this.writeBytes([BitHelper.char0(char), BitHelper.char1(char)]);
};

BitHelper.BitOutput.prototype.writeInt = function(int){
	this.writeBytes([BitHelper.int0(int), BitHelper.int1(int), BitHelper.int2(int), BitHelper.int3(int)]);
};

BitHelper.BitOutput.prototype.writeBooleans = function(booleans){
	for(let index in booleans){
		this.writeBoolean(booleans[index]);
	}
};

BitHelper.BitOutput.prototype.writeBytes = function(bytes){
	for(let index in bytes){
		this.writeByte(bytes[index]);
	}
};

BitHelper.BitOutput.prototype.writeShorts = function(shorts){
	for(let index in shorts){
		this.writeShort(shorts[index]);
	}
};

BitHelper.BitOutput.prototype.writeChars = function(chars){
	for(let index in chars){
		this.writeChar(chars[index]);
	}
};

BitHelper.BitOutput.prototype.writeInts = function(ints){
	for(let index in ints){
		this.writeInt(ints[index]);
	}
};

BitHelper.BitOutput.prototype.writeBooleanArray = function(array){
	this.writeInt(array.length);
	this.writeBooleans(array);
};

BitHelper.BitOutput.prototype.writeByteArray = function(array){
	this.writeInt(array.length);
	this.writeBytes(array);
};

BitHelper.BitOutput.prototype.writeShortArray = function(array){
	this.writeInt(array.length);
	this.writeInts(array);
};

BitHelper.BitOutput.prototype.writeCharArray = function(array){
	this.writeInt(array.length);
	this.writeChars(array);
};

BitHelper.BitOutput.prototype.writeIntArray = function(array){
	this.writeInt(array.length);
	this.writeInts(array);
};

BitHelper.BitOutput.prototype.writeNumber = function(number, bitcount, allowNegative){
	this.writeBooleans(BitHelper.numberToBooleans(number, bitcount, allowNegative));
};

BitHelper.BitOutput.prototype.writeJavaString = function(string){
	if(string === null || string === undefined){//java doesn't have undefined, so we will make it just null
		this.writeInt(-1);
		return;
	}
	let max = 1;
	for(let index = 0; index < string.length; index++){
		const charCode = string.charCodeAt(index);
		if(charCode > max){
			max = charCode;
		}
	}
	const bitCount = BitHelper.getRequiredBits(max);
	this.writeInt(string.length);
	this.writeNumber(bitCount - 1, 4, false);
	for(let index = 0; index < string.length; index++){
		this.writeNumber(string.charCodeAt(index), bitCount, false);
	}
};

BitHelper.BitOutput.prototype.writeString = function(string){

	// For compatibility with other languages, null and undefined will be treated the same
	if (string === null || string === undefined){
		this.writeByte(0);
		return;
	}

	// We will use this a lot
	const length = string.length;

	if (length < 254){

		// Expected situation
		this.writeByte(length + 1);
	} else {

		// This way of storing the length costs 1 byte in this case, but spares 3 bytes in the other more likely case
		this.addByte(255);
		this.addInt(length);
	}

	// If the string is empty, we are done already
	if (length > 0){
		
		// Those values will be changed in the first iteration of the next loop
		let max = 0;
		let min = 65535;

		// Determine minimum and maximum char code
		for (let index = 0; index < length; index++){
			const current = string.charCodeAt(index);
			if (current > max){
				max = current;
			}
			if (current < min){
				min = current;
			}
		}

		const difference = max - min;
		let bitCount = 0;

		// Difference will be 0 for strings like 'aaa'
		if (difference !== 0) {
			
			// Most likely case
			bitCount = BitHelper.getRequiredBits(difference);
		}

		this.writeChar(min);
		this.writeNumber(bitCount, 5, false);

		// If the difference is 0, the string is already defined by the length and smallest/min character
		if (difference > 0){

			for (let index = 0; index < length; index++){
				this.writeNumber(string.charCodeAt(index) - min, bitCount, false);
			}
		}
	}
};