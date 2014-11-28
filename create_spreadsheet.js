/**
 *
 * @author Michael Pearson <github@m.bip.io>
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
var gapi = require('googleapis'),
  drive = gapi.drive('v2'),
  fs = require('fs');

function CreateSpreadsheet() {}

CreateSpreadsheet.prototype = {};

CreateSpreadsheet.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    exports = {},
    log = this.$resource.log,
    pod = this.pod,
    auth = self.pod.getOAuthClient(sysImports);

  drive.files.insert({
      auth : auth,
      convert : true,
      resource : {
        title : imports.title,
        description : imports.description,
        mimeType : 'text/csv'
      },
      media : {
        mimeType : 'text/csv',
        body : imports.headers + '\n'
      }
    }, function(err, result) {
      next(err, result);
    });
}

// -----------------------------------------------------------------------------
module.exports = CreateSpreadsheet;