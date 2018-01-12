(function () {
    let lab7Methods = {
        doOperation: function (textAreaText, textToInsert, num1, num2) {
            if (!textAreaText) throw "You must enter text into the text area";
            if (!textToInsert) throw "You must enter text to insert";
            if (typeof num1 !== "number") throw "Must provide a number in first number";
            if (isNaN(num1)) throw "Must provide a number in first number";
            if (typeof num2 !== "number") throw "Must provide a number in second number";
            if (isNaN(num2)) throw "Must provide a number in second number";
             let finalString="";
        let position=0
        for (let i=0;i <num1;i++){
             position=position+num2;
            finalString += insertString(textAreaText.substring(position-num2,position),position,textToInsert); 
        }
        finalString += textAreaText.substring(position)
        return finalString;
        }
    };

    function insertString(str,index,insert){
        return str.slice(0,index) + insert + str.slice(index,str.length);
    }
    var staticForm = document.getElementById("static-form");

    if (staticForm) {
        // We can store references to our elements; it's better to 
        // store them once rather than re-query the DOM traversal each time
        // that the event runs.
        var textAreaElement = document.getElementById("textAreaText");
        var textToInsertElement = document.getElementById("textToInsert");
        var firstNumberElement = document.getElementById("number1");
        var secondNumberElement = document.getElementById("number2");

        var errorContainer = document.getElementById("error-container");
        var errorTextElement = errorContainer.getElementsByClassName("text-goes-here")[0];

        var resultContainer = document.getElementById("result-container");
        var resultTextElement = resultContainer.getElementsByClassName("text-goes-here")[0];

        // We can take advantage of functional scoping; our event listener has access to its outer functional scope
        // This means that these variables are accessible in our callback
        staticForm.addEventListener("submit", function (event) {
            event.preventDefault();

            try {
                // hide containers by default
                errorContainer.classList.add("hidden");
                resultContainer.classList.add("hidden");

                // Values come from inputs as strings, no matter what :(
                var firstNumberValue = firstNumberElement.value;
                var secondNumberValue = secondNumberElement.value;
                var parsedFirstNumberValue = parseInt(firstNumberValue);
                var parsedSecondNumberValue = parseInt(secondNumberValue);
                var operation = lab7Methods['doOperation'] ;
                var result = operation(textAreaElement.value, textToInsertElement.value, parsedFirstNumberValue, parsedSecondNumberValue)
                resultTextElement.textContent = "The result is " + result;
                resultContainer.classList.remove("hidden");
            } catch (e) {
                var message = typeof e === "string" ? e : e.message;
                errorTextElement.textContent = e;
                errorContainer.classList.remove("hidden");
            }
        });
    }
})();