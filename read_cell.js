/**
 *
 * @author Elie Youssef <elie.youssef@elementn.com>
 * Copyright (c) 2010-2014 Michael Pearson https://github.com/mjpearson
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
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