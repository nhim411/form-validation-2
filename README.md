# Form validation library

Form validation library is a javascript library for validate input form.

## Installation

import `validator.js` to your code
## Usage

```javascript
// HTML: Add rules for input tag
//Ex: <input id="password" name="password" rules="required|min:6" type="password"/>
//
// Javascript
const form = new Validator("#register-form") //param: form selector
//optional: add onSumbit method to prevent default form submit behavior
form.onSubmit = function (formData) {
  console.log(formData);
}
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)