const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//Constructor function
function Validator(formSeletor, options = {}) {
  const formRules = {};
  /**
   * Quy ước tạo rule:
   * - Nếu có lỗi return message lỗi
   * - Nếu không có lỗi return undifined
   */
  const validatorRules = {
    required(value) {
      return value ? undefined : "Vui lòng nhập trường này";
    },
    email(value) {
      const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      return regex.test(value) ? undefined : "Trường này phải là email";
    },
    min(min) {
      return function (value) {
        return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
      };
    },
    max(max) {
      return function (value) {
        value.length <= max ? undefined : message || `Vui lòng nhập tối đa ${max} kí tự`;
      };
    },
  };
  const formElement = $(formSeletor);

  if (formElement) {
    let inputs = formElement.querySelectorAll("[name][rules]");
    inputs.forEach((input) => {
      let rules = input.getAttribute("rules").split("|");

      for (let rule of rules) {
        let isRuleHasValue = rule.includes(":");
        let ruleInfo;

        if (isRuleHasValue) {
          ruleInfo = rule.split(":");
          rule = ruleInfo[0];
        }

        let ruleFunc = validatorRules[rule];

        if (isRuleHasValue) {
          ruleFunc = validatorRules[rule](ruleInfo[1]);
        }
        if (!Array.isArray(formRules[input.name])) {
          formRules[input.name] = [ruleFunc];
        } else {
          formRules[input.name].push(ruleFunc);
        }
      }

      // Lắng nghe sự kiện để validate
      input.onblur = handleValidate;
      input.oninput = handleClearError;
    });
    function handleValidate(event) {
      let rules = formRules[event.target.name];
      let errorMessage;
      let isError = rules.some((rule) => {
        errorMessage = rule(event.target.value);
        return errorMessage;
      });
      if (isError) {
        let formGroup = event.target.closest(".form-group");
        if (formGroup) {
          formGroup.classList.add("invalid");
          let formMessage = formGroup.querySelector(".form-message");
          if (formMessage) {
            formMessage.innerText = errorMessage;
          }
        }
      }
      return !isError;
    }

    // Hàm clear message lỗi
    function handleClearError(event) {
      let formGroup = event.target.closest(".form-group");
      if (formGroup.classList.contains("invalid")) {
        formGroup.classList.remove("invalid");
        let formMessage = formGroup.querySelector(".form-message");
        if (formMessage) {
          formMessage.innerText = "";
        }
      }
    }
  }
  //Xử lý hành vi submtit form
  formElement.onsubmit = function (event) {
    event.preventDefault();
    let inputs = formElement.querySelectorAll("[name][rules]");
    let isValid = true;
    inputs.forEach((input) => {
      isValid = handleValidate({
        target: input,
      });
    });
    if (isValid) {
      if (typeof options.onSubmit === "function") {
        let enableInputs = formElement.querySelectorAll("[name]:not([disabled])");
        let formValue = Array.from(enableInputs).reduce((value, input) => {
          switch (input.type) {
            case "checkbox":
              if (input.matches(":checked")) {
                if (!Array.isArray(value[input.name])) {
                  value[input.name] = [];
                }
                value[input.name].push(input.value);
              } else if (!value[input.name]) {
                value[input.name] = "";
              }
              break;
            case "radio":
              if (input.matches(":checked")) {
                value[input.name] = input.value;
              } else if (!value[input.name]) {
                value[input.name] = "";
              }
              break;
            case "file":
              value[input.name] = input.files;
              break;
            default:
              value[input.name] = input.value;
          }
          return value;
        }, {});
        options.onSubmit(formValue);
      } else {
        formElement.submit();
      }
    }
  };
}
