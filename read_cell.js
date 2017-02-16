/**
 *
 * Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

  var Spreadsheet = require('edit-google-spreadsheet');

function Read_Cell() {}

Read_Cell.prototype = {};

Read_Cell.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    exports = {};

    Spreadsheet.load({
	    debug: true,
	    spreadsheetName: imports.spreadsheetName,
	    worksheetName: imports.worksheetName,
	    accessToken : {
	    	type : 'Bearer',
	    	token : sysImports.auth.oauth.access_token
	    }
	  }, function sheetReady(err, spreadsheet) {
		  if(err){
		      next(err, null);
		  }
		  spreadsheet.receive(function(err, rows, info) {
		      if(err){
		    	  next(err, null);
		      }else{
		    	  var col = imports.col,row = imports.row,
		    	  value = (rows[col] && rows[col][row]) ? rows[col][row] : null;
		    	  next(err,{value : value});
		      }

		  });
	  });
}

// -----------------------------------------------------------------------------
module.exports = Read_Cell;