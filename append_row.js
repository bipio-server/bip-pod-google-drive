/**
 *
 * @author Michael Pearson <elie.youssef@elementn.com>
 * Copyright (c) 2010-2015 WoT.io, Inc http://wot.io
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

function AppendRow() {}

AppendRow.prototype = {};

AppendRow.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    exports = {};

    Spreadsheet.load({
//	    debug: true,
	    spreadsheetName: imports.spreadsheetName,
	    worksheetName: imports.worksheetName,
	    accessToken : {
	    	type : 'Bearer',
	    	token : sysImports.auth.oauth.access_token
	    }
	  }, function sheetReady(err, spreadsheet) {
		  if(err){
		      next(err, null);
		  } else{

		  	spreadsheet.receive(function(err, rows, info) {
		  		if (err) {
		  			next(err);
		  		} else {
		  			var data = {};

		  			data[info.lastRow + 1] = [ imports.value.trim().split(',') ];
		  			spreadsheet.add(data);
			      spreadsheet.send(function(err) {
				      if (err) {
				    	 next(err,null);
				      } else {
				    	  next(false, {});
				      }
			     	});
		  		}
		  	});
		  }
	  });
}

// -----------------------------------------------------------------------------
module.exports = AppendRow;