const m = require('moment');

exports.commonFunction = {

    validateDate(strDate, format) {
      //  console.log('Valid Date:', m(strDate).isValid() )
        if (m(strDate).isValid()) {
            return m(strDate).format(format);
        }
        else {
            return 'null';
        }
    }
    
}