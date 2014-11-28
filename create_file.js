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
  drive = gapi.drive('v2');

function CreateFile() {}

CreateFile.prototype = {};

CreateFile.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    exports = {},
    log = this.$resource.log,
    $resource = this.$resource,
    pod = this.pod,
    auth = self.pod.getOAuthClient(sysImports);

  for (var i = 0; i < contentParts._files.length; i++) {
    (function(file) {
      $resource.file.get(file, function(err, fileStruct, stream) {
        if (err) {
          next(err);
        } else {
          var args = {
            auth : auth,
            resource : {
              title: fileStruct.name,
              mimeType: fileStruct.type
            },
            media : {
              mimeType: fileStruct.type,
              body : stream
            }
          }

          drive.files.insert(args, function(err, result) {
            next(err, result);
          });
        }
      });
    })(contentParts._files[i]);
  }
}

// -----------------------------------------------------------------------------
module.exports = CreateFile;