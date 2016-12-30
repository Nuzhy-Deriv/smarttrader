var Validate    = require('./validation').Validate;
var isValidDate = require('./common_functions').isValidDate;
var elementInnerHtml = require('./common_functions').elementInnerHtml;
var Content     = require('./content').Content;
var Cookies     = require('../../lib/js-cookie');
var localize    = require('../base/localize').localize;
var Client      = require('../base/client').Client;
var Contents    = require('../base/contents').Contents;
var url_for     = require('../base/url').url_for;

var ValidAccountOpening = (function() {
    var redirectCookie = function() {
        if (Contents.show_login_if_logout(true)) {
            return;
        }
        if (!Client.get_boolean('is_virtual')) {
            window.location.href = url_for('trading');
            return;
        }
        var client_loginid_array = Client.get_value('loginid_array');
        for (var i = 0; i < client_loginid_array.length; i++) {
            if (client_loginid_array[i].real === true) {
                window.location.href = url_for('trading');
                return;
            }
        }
    };
    var handler = function(response, message) {
        if (response.error) {
            var errorMessage = response.error.message;
            if (response.error.code === 'show risk disclaimer' && document.getElementById('financial-form')) {
                $('#financial-form').addClass('hidden');
                $('#financial-risk').removeClass('hidden');
                return;
            }
            if (document.getElementById('real-form')) {
                $('#real-form').remove();
            } else if (document.getElementById('japan-form')) {
                $('#japan-form').remove();
            } else if (document.getElementById('financial-form')) {
                $('#financial-form').remove();
                $('#financial-risk').remove();
            }
            var error = document.getElementsByClassName('notice-msg')[0];
            elementInnerHtml(error, (response.msg_type === 'sanity_check') ? localize('There was some invalid character in an input field.') : errorMessage);
            error.innerHTML = (response.msg_type === 'sanity_check') ? localize('There was some invalid character in an input field.') : errorMessage;
            error.parentNode.parentNode.parentNode.setAttribute('style', 'display:block');
        } else if (Cookies.get('residence') === 'jp') {
            window.location.href = url_for('new_account/knowledge_testws');
            $('#topbar-msg').children('a').addClass('invisible');
        } else {     // jp account require more steps to have real account
            Client.process_new_account(Cookies.get('email'), message.client_id, message.oauth_token, false);
        }
    };
    var letters,
        numbers,
        space,
        hyphen,
        period,
        apost;

    var initializeValues = function() {
        letters = Content.localize().textLetters;
        numbers = Content.localize().textNumbers;
        space   = Content.localize().textSpace;
        hyphen  = Content.localize().textHyphen;
        period  = Content.localize().textPeriod;
        apost   = Content.localize().textApost;
    };

    var checkFname = function(fname, errorFname) {
        if ((fname.value).trim().length < 2) {
            elementInnerHtml(errorFname, Content.errorMessage('min', '2'));
            Validate.displayErrorMessage(errorFname);
            window.accountErrorCounter++;
        } else if (/[`~!@#$%^&*)(_=+\[}{\]\\\/";:\?><,|\d]+/.test(fname.value)) {
            initializeValues();
            elementInnerHtml(errorFname, Content.errorMessage('reg', [letters, space, hyphen, period, apost]));
            Validate.displayErrorMessage(errorFname);
            window.accountErrorCounter++;
        }
    };
    var checkLname = function(lname, errorLname) {
        if ((lname.value).trim().length < 2) {
            elementInnerHtml(errorLname, Content.errorMessage('min', '2'));
            Validate.displayErrorMessage(errorLname);
            window.accountErrorCounter++;
        } else if (/[`~!@#$%^&*)(_=+\[}{\]\\\/";:\?><,|\d]+/.test(lname.value)) {
            initializeValues();
            elementInnerHtml(errorLname, Content.errorMessage('reg', [letters, space, hyphen, period, apost]));
            Validate.displayErrorMessage(errorLname);
            window.accountErrorCounter++;
        }
    };
    var checkDate = function(dobdd, dobmm, dobyy, errorDob) {
        if (!isValidDate(dobdd.value, dobmm.value, dobyy.value) || dobdd.value === '' || dobmm.value === '' || dobyy.value === '') {
            elementInnerHtml(errorDob, Content.localize().textErrorBirthdate);
            Validate.displayErrorMessage(errorDob);
            window.accountErrorCounter++;
        }
    };
    var checkPostcode = function(postcode, errorPostcode) {
        if ((postcode.value !== '' || Client.get_value('residence') === 'gb') && !/^[a-zA-Z\d-]+$/.test(postcode.value)) {
            initializeValues();
            elementInnerHtml(errorPostcode, Content.errorMessage('reg', [letters, numbers, hyphen]));
            Validate.displayErrorMessage(errorPostcode);
            window.accountErrorCounter++;
        }
    };
    var checkTel = function(tel, errorTel) {
        if (tel.value.replace(/\+| /g, '').length < 6) {
            elementInnerHtml(errorTel, Content.errorMessage('min', 6));
            Validate.displayErrorMessage(errorTel);
            window.accountErrorCounter++;
        } else if (!/^\+?[0-9\s]{6,35}$/.test(tel.value)) {
            initializeValues();
            elementInnerHtml(errorTel, Content.errorMessage('reg', [numbers, space]));
            Validate.displayErrorMessage(errorTel);
            window.accountErrorCounter++;
        }
    };
    var checkAnswer = function(answer, errorAnswer) {
        if (answer.value.length < 4) {
            elementInnerHtml(errorAnswer, Content.errorMessage('min', 4));
            Validate.displayErrorMessage(errorAnswer);
            window.accountErrorCounter++;
        }
    };
    var checkCity = function(city, errorCity) {
        if (/[`~!@#$%^&*)(_=+\[}{\]\\\/";:\?><,|\d]+/.test(city.value)) {
            initializeValues();
            elementInnerHtml(errorCity, Content.errorMessage('reg', [letters, space, hyphen, period, apost]));
            Validate.displayErrorMessage(errorCity);
            window.accountErrorCounter++;
        }
    };
    return {
        redirectCookie: redirectCookie,
        handler       : handler,
        checkFname    : checkFname,
        checkLname    : checkLname,
        checkDate     : checkDate,
        checkPostcode : checkPostcode,
        checkTel      : checkTel,
        checkAnswer   : checkAnswer,
        checkCity     : checkCity,
    };
})();

module.exports = {
    ValidAccountOpening: ValidAccountOpening,
};
