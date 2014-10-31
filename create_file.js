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

function CreateFile(podConfig) {
  this.name = 'create_file';
  this.title = 'Create a File on Google Drive',
  this.description = "Uploads any present file to Google drive",
  this.trigger = false;
  this.singleton = false;
  this.podConfig = podConfig;
}

CreateFile.prototype = {};

CreateFile.prototype.getSchema = function() {
  return {
    "exports" : {
      "properties" : {
        "id" : {
          "type" : "string",
          "description" : "ID"
        },
        "title" : {
          "type" : "string",
          "description" : "Title"
        },
        "description" : {
          "type" : "string",
          "description" : "Description"
        },
        "originalFilename" : {
          "type" : "string",
          "description" : "Original Filename"
        },
        "iconLink" : {
          "type" : "string",
          "description" : "Icon Link"
        },
        "mimeType" : {
          "type" : "string",
          "description" : "Mime Type"
        },
        "thumbnailLink" : {
          "type" : "string",
          "description" : "Thumbnail Link"
        },
        "createdDate" : {
          "type" : "string",
          "description" : "Created Date"
        },
        "downloadUrl" : {
          "type" : "string",
          "description" : "Download URL"
        }
      }
    }
  }
}

CreateFile.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    exports = {},
    log = this.$resource.log,
    pod = this.pod,
    auth = self.pod.getOAuthClient(sysImports);

  for (var i = 0; i < contentParts._files.length; i++) {
    (function(file) {
      var args = {
        auth : auth,
        resource : {
          title: file.name,
          mimeType: file.type
        },
        media : {
          mimeType: file.type,
          body : fs.createReadStream(file.localpath)
        }
      }

      drive.files.insert(args, function(err, result) {
        next(err, result);
      });

    })(contentParts._files[i]);
  }
}

// -----------------------------------------------------------------------------
module.exports = CreateFile;