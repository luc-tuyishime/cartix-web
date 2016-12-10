/** 
Problem:

You have a javascript array that likely has some duplicate values and you would like a count of those values.
Solution:

Try this schnippet out.
*/


function compressArray(original) {
 
	var compressed = [];
	// make a copy of the input array
	var copy = original.slice(0);
 
	// first loop goes over every element
	for (var i = 0; i < original.length; i++) {
 
		var myCount = 0;	
		// loop over every element in the copy and see if it's the same
		for (var w = 0; w < copy.length; w++) {
			if (original[i] == copy[w]) {
				// increase amount of times duplicate is found
				myCount++;
				// sets item to undefined
				delete copy[w];
			}
		}
 
		if (myCount > 0) {
			var a = new Object();
			a.value = original[i];
			a.count = myCount;
			compressed.push(a);
		}
	}
 
	return compressed;
};

// It should go something like this:

/*var testArray = new Array("dog", "dog", "cat", "buffalo", "wolf", "cat", "tiger", "cat");
var newArray = compressArray(testArray);*/
 
/*
console: [
	Object { value="dog", count=2}, 
	Object { value="cat", count=3}, 
	Object { value="buffalo", count=1}, 
	Object { value="wolf", count=1}, 
	Object { value="tiger", count=1}
]
*/